/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';
import helpersUtils from 'utils/Helpers';
import Empty from 'constants/empty';
import anaConsts from 'analytics/constants';
import getSiteIdFromLinkSynergy from 'services/api/creatorStoreFront/getSiteIdFromLinkSynergy';
import { getCsfRoute } from 'components/CreatorStoreFront/helpers/getCsfRoute';

const { deferTaskExecution } = helpersUtils;

const U1_COLLECTION_DETAILS_PAGE_NAME = 'collectiondetail';
const U1_POST_DETAILS_PAGE_NAME = 'postdetail';

/**
 * Construct U1 parameter for CSF attribution with page-based tracking
 * @param {*} param0
 * @returns
 */
function constructU1Param({
    host_type,
    traffic_source,
    device,
    page_type,
    identifier_location = '', // comes as [identifier]_[location]
    merchant_tag,
    storefront_tag
}) {
    const prefix = [host_type, traffic_source, device, page_type, identifier_location].join('-');
    const u1Param = [prefix, merchant_tag, storefront_tag].filter(Boolean).join('_');

    // Format: [host_type]-[traffic_source]-[device]-[page_type]-[identifier]_[location]_[merchant_tag]_[storefront_tag]
    return u1Param;
}

/**
 * Map CSF page types to attribution codes based on documentation
 * @param {string} section - CSF page section
 * @param {string} identifier - Optional identifier (collection-id, post-id)
 * @returns {string} Attribution page type code
 */
function getPageTypeForAttribution(section, identifier) {
    const CXXC = 'cxxc';
    const PXXC = 'pxxc';
    const XXXC = 'xxxc';

    // If there's an identifier, it's a detail page
    if (identifier) {
        if (section === CSF_PAGE_TYPES.POSTS) {
            return PXXC; // Post detail page
        } else if (section === CSF_PAGE_TYPES.COLLECTIONS) {
            return CXXC; // Collection detail page
        }
    }

    // For listing pages or main page
    const pageTypeMap = {
        [CSF_PAGE_TYPES.FEATURED]: XXXC,
        [CSF_PAGE_TYPES.POSTS]: XXXC, // Posts listing
        [CSF_PAGE_TYPES.COLLECTIONS]: XXXC, // Collections listing
        [CSF_PAGE_TYPES.PRODUCTS]: XXXC,
        '': XXXC
    };

    return pageTypeMap[section] || XXXC;
}

/**
 * Generate page identifier from current URL and context
 * @param {string} subAffiliateId - Creator's subAffiliateId
 * @param {string} section - Page section
 * @param {string} identifier - Optional identifier (post-id, collection-id)
 * @returns {string} Page [identifier]_[location] for U1 parameter
 */
function generatePageIdentifierLocation(subAffiliateId, section, identifier) {
    // For detail pages with identifiers
    // returns  [collection_unique_key|post_unique_key]_[collectiondetail|postdetail]
    if (identifier) {
        if (section === CSF_PAGE_TYPES.COLLECTIONS) {
            return `${identifier}_${U1_COLLECTION_DETAILS_PAGE_NAME}`;
        } else if (section === CSF_PAGE_TYPES.POSTS) {
            return `${identifier}_${U1_POST_DETAILS_PAGE_NAME}`;
        }
    }

    // For listing pages (featured, products, collections, posts)
    // returns  [subAffiliateId]_[main|products|collections|posts]
    const location = !section || section === '' || section === CSF_PAGE_TYPES.FEATURED ? 'main' : section;

    return `${subAffiliateId}_${location}`;
}

/**
 * Check if user is entering CSF from a different creator
 * @param {string} currentSubAffiliateId - Current subAffiliateId
 * @param {object} existingData - Existing attribution data
 * @returns {boolean} True if this is a different creator
 */
function isDifferentCreator(currentSubAffiliateId, existingData) {
    if (!existingData || !existingData.u1) {
        return false;
    }

    // Extract subAffiliateId [identifier] from existing U1 parameter
    // u1Parts: [host_type]-[traffic_source]-[device]-[page_type]-[identifier]_[location]_[merchant_tag]_[storefront_tag]
    const u1Parts = existingData.u1.split('_');

    if (u1Parts.length === 0) {
        return false;
    }

    const prefixParts = u1Parts[0].split('-');

    if (prefixParts.length < 5) {
        return false;
    }

    const existingSubAffiliateId = prefixParts[4];

    if (!existingSubAffiliateId) {
        return false;
    }

    return existingSubAffiliateId !== currentSubAffiliateId;
}

/**
 * Check if user has left CSF and returned
 * @returns {boolean} True if user has left CSF
 */
function hasLeftCSF() {
    const currentPath = window.location.pathname;
    const lastCSFPath = Storage.session.getItem('lastCSFPath');

    // If we have a last CSF path and current path is not CSF, user has left
    if (lastCSFPath && !currentPath.startsWith('/creators/')) {
        return true;
    }

    // Update the last CSF path if we're currently in CSF
    if (currentPath.startsWith('/creators/')) {
        Storage.session.setItem('lastCSFPath', currentPath);

        return false;
    }

    return false;
}

/**
 * Determine traffic source based on UserAgent and referral source
 * @returns {string} Traffic source code
 */
function getTrafficSource() {
    const referrer = document.referrer || '';
    const userAgent = navigator.userAgent || '';

    // Check URL parameters first (highest priority)
    const urlParams = new URLSearchParams(window.location.search);
    const omMmc = urlParams.get('om_mmc');

    if (omMmc) {
        // Parse om_mmc parameter to determine source
        const omMmcParts = omMmc.toLowerCase().split('-');

        if (omMmcParts.length > 0) {
            const source = omMmcParts[0];
            // Map common om_mmc prefixes to traffic source codes
            const omMmcSourceMap = {
                social: getDetailedSocialSource(omMmc, referrer, userAgent),
                email: 'e',
                sms: 's',
                paid: 'p',
                display: 'd',
                affiliate: 'a'
            };

            if (omMmcSourceMap[source]) {
                return omMmcSourceMap[source];
            }
        }
    }

    // Check for direct social platform detection from referrer
    const socialSource = getSocialSourceFromReferrer(referrer);

    if (socialSource !== 'o') {
        return socialSource;
    }

    // Check UserAgent for social app signatures
    const userAgentSource = getSocialSourceFromUserAgent(userAgent);

    if (userAgentSource !== 'o') {
        return userAgentSource;
    }

    // Check for other traffic sources from referrer
    const referrerSource = getSourceFromReferrer(referrer);

    if (referrerSource !== 'o') {
        return referrerSource;
    }

    // Check if it's a search engine referrer
    if (isSearchEngineReferrer(referrer)) {
        return 's'; // search/SEO
    }

    // Default to 'o' (other) if no specific source detected
    return 'o';
}

/**
 * Get detailed social source when om_mmc indicates social traffic
 */
function getDetailedSocialSource(omMmc, referrer, userAgent) {
    const omMmcLower = omMmc.toLowerCase();

    if (omMmcLower.includes('instagram') || omMmcLower.includes('ig')) {
        return 'i';
    }

    if (omMmcLower.includes('tiktok') || omMmcLower.includes('tt')) {
        return 't';
    }

    if (omMmcLower.includes('youtube') || omMmcLower.includes('yt')) {
        return 'y';
    }

    // Fall back to referrer/userAgent detection for social
    return getSocialSourceFromReferrer(referrer) || getSocialSourceFromUserAgent(userAgent) || 'so';
}

/**
 * Detect social platform from referrer URL
 */
function getSocialSourceFromReferrer(referrer) {
    const referrerLower = referrer.toLowerCase();

    if (referrerLower.includes('instagram.com')) {
        return 'i';
    }

    if (referrerLower.includes('tiktok.com')) {
        return 't';
    }

    if (referrerLower.includes('youtube.com') || referrerLower.includes('youtu.be')) {
        return 'y';
    }

    return 'o';
}

/**
 * Detect social platform from User Agent
 */
function getSocialSourceFromUserAgent(userAgent) {
    const userAgentLower = userAgent.toLowerCase();

    // Instagram app signatures
    if (userAgentLower.includes('instagram') || userAgentLower.includes('igwebview') || userAgentLower.includes('igloader')) {
        return 'i';
    }

    // TikTok app signatures
    if (userAgentLower.includes('tiktok') || userAgentLower.includes('musically') || userAgentLower.includes('bytedance')) {
        return 't';
    }

    // YouTube app signatures
    if (userAgentLower.includes('youtube')) {
        return 'y';
    }

    return 'o';
}

/**
 * Get traffic source from general referrer domains
 */
function getSourceFromReferrer(referrer) {
    if (!referrer) {
        return 'o';
    }

    const referrerLower = referrer.toLowerCase();

    // Email clients
    if (
        referrerLower.includes('mail.') ||
        referrerLower.includes('gmail.') ||
        referrerLower.includes('outlook.') ||
        referrerLower.includes('yahoo.')
    ) {
        return 'e';
    }

    return 'o';
}

/**
 * Check if referrer is from a search engine
 */
function isSearchEngineReferrer(referrer) {
    if (!referrer) {
        return false;
    }

    const searchEngines = ['google.', 'bing.', 'yahoo.', 'duckduckgo.', 'baidu.', 'yandex.', 'ask.', 'aol.'];

    const referrerLower = referrer.toLowerCase();

    return searchEngines.some(engine => referrerLower.includes(engine));
}

/**
 * Determine device OS for attribution
 * @returns {string} Device OS code
 */
function getDeviceOS() {
    const userAgent = navigator.userAgent || '';

    if (userAgent.includes('iPhone')) {
        return 'i'; // iphone
    }

    if (userAgent.includes('Mac OS')) {
        return 'm'; // macos
    }

    if (userAgent.includes('Windows')) {
        return 'w'; // windows
    }

    if (userAgent.includes('Android')) {
        return 'a'; // android
    }

    // Default to 'm' for other cases
    return 'm';
}

/**
 * Capture and store CSF attribution data with page-based tracking
 * @param {object} params - Attribution parameters
 * @param {string} params.section - CSF page section
 * @param {string} params.identifier - Optional identifier (post-id, collection-id)
 * @param {string} params.creatorProfile - Should contain attributionDetails object
 */
export function captureAttributionData({ section, identifier, creatorProfile }) {
    if (!creatorProfile) {
        return;
    }

    // Sync the affiliate gateway site ID from adapter API call to local storage
    syncAffiliateGatewaySiteIdFromApi();

    try {
        const attributionDetails = creatorProfile?.attributionDetails || Empty.Object;
        const {
            linkshareSiteId, merchantTag, mid, storefrontTag, subAffiliateId
        } = attributionDetails;
        const existingData = Storage.local.getItem(LOCAL_STORAGE.CSF_ATTRIBUTION_DATA);

        // Check if we should reuse existing attribution or create new one
        const shouldReuseExisting = existingData && !isDifferentCreator(subAffiliateId, existingData) && !hasLeftCSF();

        if (shouldReuseExisting) {
            // Check if attribution is still within 5-day window
            const attributionTime = new Date(existingData.timestamp);
            const now = new Date();
            const daysDiff = (now - attributionTime) / (1000 * 60 * 60 * 24);

            if (daysDiff <= 5) {
                // Reuse existing U1, just update timestamp
                const updatedData = {
                    ...existingData,
                    timestamp: new Date().toISOString()
                };

                Storage.local.setItem(LOCAL_STORAGE.CSF_ATTRIBUTION_DATA, updatedData, Storage.DAYS * 5);
                Sephora.logger.verbose('CSF attribution: Reusing existing U1 parameter');

                // Initialize LinkSynergy affiliate tracking with existing U1
                deferTaskExecution(initializeLinkSynergyAffiliate);

                return;
            }
        }

        // Create new attribution data
        const pageType = getPageTypeForAttribution(section, identifier);
        const pageIdentifierLocation = generatePageIdentifierLocation(subAffiliateId, section, identifier);

        const u1Param = constructU1Param({
            host_type: 'b',
            traffic_source: getTrafficSource(),
            device: getDeviceOS(),
            page_type: pageType,
            identifier_location: pageIdentifierLocation,
            merchant_tag: merchantTag,
            storefront_tag: storefrontTag
        });

        const attributionData = {
            u1: u1Param,
            subId: u1Param,
            linkshareSiteId,
            subAffiliateId,
            timestamp: new Date().toISOString(),
            mid
        };

        Storage.local.setItem(LOCAL_STORAGE.CSF_ATTRIBUTION_DATA, attributionData, Storage.DAYS * 5);
        Sephora.logger.verbose('CSF attribution: Created new U1 parameter', u1Param);

        // Initialize LinkSynergy affiliate tracking with existing U1
        deferTaskExecution(initializeLinkSynergyAffiliate);
    } catch (error) {
        Sephora.logger.error('Error capturing CSF attribution data:', error);
    }
}

/**
 * Update CSF attribution data on details page with a new product ID from product tile click or ATB Cta click
 * @param {string} creatorProfile - Should contain attributionDetails object
 * @param {string} motomProductId - The motom product ID
 */
export function updateAttributionForDetailsPage(creatorProfile, motomProductId) {
    const { section, identifier } = getCsfRoute(window.location.pathname);

    if (!creatorProfile || !(section.includes(CSF_PAGE_TYPES.COLLECTIONS) || section.includes(CSF_PAGE_TYPES.POSTS)) || !identifier) {
        return;
    }

    try {
        const attributionDetails = creatorProfile?.attributionDetails || Empty.Object;
        const { merchantTag, storefrontTag, subAffiliateId } = attributionDetails;
        const existingData = Storage.local.getItem(LOCAL_STORAGE.CSF_ATTRIBUTION_DATA);

        if (existingData && existingData.u1) {
            // Create new attribution data
            const pageType = getPageTypeForAttribution(section, identifier);
            const pageIdentifierLocation = generatePageIdentifierLocation(subAffiliateId, section, identifier);

            // Replace page location with motomProductId
            const pageIdentifierPart = pageIdentifierLocation.split('_')[0]; // Skip page location
            const newPageIdentifierLocation = `${pageIdentifierPart}_${motomProductId}`;

            const u1Param = constructU1Param({
                host_type: 'b',
                traffic_source: getTrafficSource(),
                device: getDeviceOS(),
                page_type: pageType,
                identifier_location: newPageIdentifierLocation,
                merchant_tag: merchantTag,
                storefront_tag: storefrontTag
            });

            const attributionData = {
                ...existingData,
                u1: u1Param,
                timestamp: new Date().toISOString()
            };

            Storage.local.setItem(LOCAL_STORAGE.CSF_ATTRIBUTION_DATA, attributionData, Storage.DAYS * 5);
            Sephora.logger.verbose(`CSF attribution: Updated U1 parameter with page identifier ${identifier} and motomProductId ${motomProductId}`, {
                oldU1: existingData.u1,
                newU1: u1Param
            });
        } else {
            Sephora.logger.verbose(`CSF attribution: No existing data to update details on page detail /${section}/${identifier}`);
        }
    } catch (error) {
        Sephora.logger.error('Error updating CSF attribution data:', error);
    }
}

/**
 * Update attribution data when navigating within CSF (preserves existing U1)
 * @param {string} handle - Creator handle (for logging)
 * @param {string} section - Page section (for logging)
 * @param {string} identifier - Optional identifier (for logging)
 */
export function updateAttributionNavigation(handle, section, identifier) {
    try {
        const existingData = Storage.local.getItem(LOCAL_STORAGE.CSF_ATTRIBUTION_DATA);

        if (existingData && existingData.u1) {
            // Just update timestamp to show activity, keep existing U1
            const updatedData = {
                ...existingData,
                timestamp: new Date().toISOString()
            };

            Storage.local.setItem(LOCAL_STORAGE.CSF_ATTRIBUTION_DATA, updatedData, Storage.DAYS * 5);

            // Initialize LinkSynergy affiliate tracking with existing U1
            deferTaskExecution(initializeLinkSynergyAffiliate);

            // More detailed logging with navigation context
            Sephora.logger.verbose('CSF attribution: Updated navigation timestamp', {
                navigatedTo: `${handle}/${section}${identifier ? `/${identifier}` : ''}`,
                preservedU1: existingData.u1
            });
        } else {
            Sephora.logger.verbose('CSF attribution: No existing data to update during navigation', {
                attemptedNavigation: `${handle}/${section}${identifier ? `/${identifier}` : ''}`
            });
        }
    } catch (error) {
        Sephora.logger.error('Error updating CSF attribution navigation:', error);
    }
}

/**
 * Update CSF attribution data with a new product ID from product tile click or ATB Cta click
 * @param {string} motomProductId - The motom product ID
 */
export function updateAttributionWithProductId(motomProductId) {
    try {
        const existingData = Storage.local.getItem(LOCAL_STORAGE.CSF_ATTRIBUTION_DATA);

        if (!existingData || !existingData.u1 || !motomProductId) {
            // No existing attribution data, or motomProductId, can't update
            return;
        }

        // Parse the existing u1 parameter to extract components
        const u1 = existingData.u1;
        const u1Parts = u1.split('_');

        if (!u1 || u1Parts.length < 4) {
            // No u1 data or Invalid u1 format, can't update
            return;
        }

        const prefix = u1Parts[0]; // [host_type]-[traffic_source]-[device]-[page_type]_[identifier]
        const suffix = u1Parts.slice(2).join('_'); // [merchant_tag]_[storefront_tag] (skip old page location)

        // Rebuild u1 with new motomProductId instead of page loacation
        const newU1 = `${prefix}_${motomProductId}_${suffix}`;

        // Update the stored attribution data
        const updatedData = {
            ...existingData,
            u1: newU1,
            subId: newU1, // Keep subId in sync with u1
            timestamp: new Date().toISOString() // Update timestamp for last interaction
        };

        Storage.local.setItem(LOCAL_STORAGE.CSF_ATTRIBUTION_DATA, updatedData, Storage.DAYS * 5);

        Sephora.logger.verbose('CSF attribution updated with product ID:', motomProductId);

        // Initialize LinkSynergy affiliate tracking with existing U1
        deferTaskExecution(initializeLinkSynergyAffiliate);
    } catch (error) {
        Sephora.logger.error('Error updating CSF attribution with product ID:', error);
    }
}

/**
 * Syncs affiliate gateway site ID from LinkSynergy API to local storage
 * during user interaction like add to basket etc..
 *
 * It ONLY updates siteId and other values in affiliateGatewayParameters stay the same.
 * @returns {Promise<void>}
 */
async function syncAffiliateGatewaySiteIdFromApi(siteID) {
    try {
        if (siteID) {
            const DEFAULT_COOKIE_LIFETIME = anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_COOKIE_LIFETIME;
            const currentData = Storage.local.getItem(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_PARAMETERS_STORAGE) || {};

            // Deep clone or create new object to avoid mutation issues
            const newData = JSON.parse(JSON.stringify(currentData));

            // Make sure params exists and is object
            if (!newData.params) {
                newData.params = {};
            }

            // We need to check that params.siteID is an array
            if (!Array.isArray(newData.params.siteID)) {
                newData.params.siteID = [];
            }

            // Update params.siteID[0]
            newData.params.siteID[0] = siteID;

            // Update siteId
            newData.siteId = siteID;

            // Write back updated object
            Storage.local.setItem(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_PARAMETERS_STORAGE, newData, DEFAULT_COOKIE_LIFETIME * Storage.DAYS);

            Sephora.logger.verbose('Affiliate gateway site ID synced from API:', siteID);
        } else {
            Sephora.logger.warn('No valid siteID found in API response to sync');
        }
    } catch (error) {
        Sephora.logger.error('Error syncing affiliate gateway site ID from API:', error);
    }
}

async function initializeLinkSynergyAffiliate() {
    if (typeof window !== 'undefined') {
        try {
            const attributionData = Storage.local.getItem(LOCAL_STORAGE.CSF_ATTRIBUTION_DATA);
            const { linkshareSiteId, mid, u1 } = attributionData || Empty.Object;

            if (!attributionData || !linkshareSiteId || !mid || !u1) {
                // No existing attribution data, can't continue...
                return;
            }

            // Call the API once and use the result (siteID) to sync with local storage
            const result = await fetchSiteIdFromLinkSynergy(linkshareSiteId, mid, window.location.href, u1);
            const { siteID } = result?.data || {};

            // Sync the affiliate gateway site ID from API to local storage
            syncAffiliateGatewaySiteIdFromApi(siteID);

            sessionStorage.setItem('affiliatePingFired', 'true');

            Sephora.logger.verbose('Affiliate pixel fired!', u1);
        } catch (error) {
            Sephora.logger.error('Affiliate ping failed silently', error);
        }
    }
}

/**
 * Fetch site ID from LinkSynergy API using provided parameters.
 * @param {string} linkshareSiteId
 * @param {string} mid
 * @param {string} murl
 * @param {string} u1
 * @returns {Promise<object>} API response data
 */
export async function fetchSiteIdFromLinkSynergy(linkshareSiteId, mid, murl, u1) {
    try {
        const result = await getSiteIdFromLinkSynergy(linkshareSiteId, mid, murl, u1);

        Sephora.logger.verbose('LinkSynergy site ID fetched successfully:', result.data);

        return result;
    } catch (error) {
        // Handle error
        Sephora.logger.error('Error fetching site ID from LinkSynergy:', error);
        throw error;
    }
}
