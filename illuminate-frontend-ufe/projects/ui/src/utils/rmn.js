/* eslint-disable camelcase */

import localeUtils from 'utils/LanguageLocale';
import RMN_BANNER_TYPES from 'components/Rmn/constants';
import * as sponsoredProductsConstants from 'constants/sponsoredProducts';
import urlUtils from 'utils/Url';
import cookieUtils from 'utils/Cookies';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import languageLocalUtils from 'utils/LanguageLocale';
import sponsoredProducts from 'services/api/sponsoredProducts/sponsoredProducts';
import { mountBannerEventData } from 'analytics/utils/eventName';
import productUtils from 'utils/product';
import { PostLoad } from 'constants/events';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import Location from 'utils/Location';
import anaUtils from 'analytics/utils';

const { isCanada, isFrench, isFRCanada, LANGUAGES } = localeUtils;
import store from 'store/Store';

import { cmsRMNBannerSelector } from 'selectors/rmnBanners';
import { updateRmnMainBanners, clearRmnBanners } from 'actions/RmnBannersActions';
import { POSITIONS, SECTIONS } from 'components/Rmn/constants';

const RMN_SOURCES = {
    PDP: 'web-product-page',
    HOMEPAGE: 'web-homepage'
};

const { TYPES } = RMN_BANNER_TYPES;

// Clears any information previously added to the digitalData object
const resetBanners = () => {
    digitalData.page.category.sponsoredProductBanners = [];

    store.dispatch(clearRmnBanners());
};

const mountRequestParams = args => {
    const {
        type, pageType, contextId, targets, slot, count = 1, hasFallback
    } = args;

    return {
        type,
        targets,
        slot,
        count,
        countFill: count,
        hasFallback,
        contextId,
        pageType
    };
};

// Adds the banner tracking information to the digitalData object
const addBannerToDigitalData = bannerToAdd => {
    const isMobile = Sephora.isMobile();
    let addBannerTrackingInfo = false;

    const BannerType = RMN_BANNER_TYPES.TYPES.MOBILE_LEADERBOARD.NAME;

    // Checks if the mobile version is showing to add the right tracking data
    if (isMobile && bannerToAdd.type === BannerType) {
        addBannerTrackingInfo = true;
    }

    // Checks if the desktop version is showing to add the right tracking data
    if (!isMobile && bannerToAdd.type !== BannerType) {
        addBannerTrackingInfo = true;
    }

    // Verifies the banner information needs to be added to the digitalData object
    if (addBannerTrackingInfo) {
        // Clears any previous banner for that slot and section
        digitalData.page.category.sponsoredProductBanners = digitalData.page.category.sponsoredProductBanners?.filter(
            banner => banner.section !== bannerToAdd.section
        );

        digitalData.page.category.sponsoredProductBanners.push(bannerToAdd);
    }
};

const getTopRefinementValue = refinement => {
    let count = 0;
    let name = '';

    refinement?.values?.forEach(refinementValue => {
        if (refinementValue.count > count) {
            count = refinementValue.count;
            name = refinementValue.refinementValueDisplayName;
        }
    });

    return name;
};

const attributesList = [
    'Concerns',
    'Ingredient Preferences',
    'Formulation',
    'Skin Type',
    'Shopping Preferences',
    'Color Family',
    'Age Range',
    'Finish',
    'Type',
    'Coverage',
    'Fragrance Family',
    'Size',
    'Benefits',
    'Sun Protections',
    'Fragrance Type',
    'Hair Type',
    'Skin Type',
    'Age Range'
];

const getAttributes = catalog => {
    const attributes = {};

    catalog?.refinements?.forEach(refinement => {
        if (attributesList.includes(refinement.displayName)) {
            attributes[refinement.displayName] = getTopRefinementValue(refinement);
        }
    });

    return attributes;
};

const formatSponsoredProductsClickTracker = product => {
    if (product.sponsored) {
        // Extracts the Click Tracker Id
        product[sponsoredProductsConstants.CLICK_TRACKER_ID_FIELD] = urlUtils.getParamsByName(
            sponsoredProductsConstants.CLICK_TRACKER_ID_API_FIELD,
            product?.click_tracker || null
        );
        product[sponsoredProductsConstants.CLICK_TRACKER_ID_FIELD] =
            Array.isArray(product.click_id) && product.click_id.length > 0 ? product.click_id[0] : '';

        // Extracts the Click Tracker Payload
        product[sponsoredProductsConstants.CLICK_TRACKER_PAYLOAD_FIELD] = urlUtils.getParamsByName(
            sponsoredProductsConstants.CLICK_TRACKER_PAYLOAD_API_FIELD,
            product?.click_tracker || null
        );
        product[sponsoredProductsConstants.CLICK_TRACKER_PAYLOAD_FIELD] =
            Array.isArray(product.click_payload) && product.click_payload.length > 0 ? product.click_payload[0] : '';
    }

    return product;
};

const transformSponsoredProductsResponse = response => {
    const localeLang = localeUtils.getCurrentLanguage().toLowerCase();

    // Converts the response into an array of products cleaning up any non product lines and products without language.
    const productsArray = !response ? [] : Object.values(response).filter(r => r?.product && r?.product[localeLang]);

    // Cleans up the products we are receiving from the Ad service.
    const cleanedUpProducts = productsArray.map(productList => {
        // Builds the products in the product grid format
        const { product, ...trackerInfo } = productList;

        const cleanProduct = {
            // Extracts the product main information taking in count the issue of products without language
            ...productList?.product[localeLang],
            // Adds the tracker information
            ...trackerInfo
        };

        if (Sephora.configurationSettings.smnBrowseCombinedCallEnabled) {
            return cleanProduct;
        } else {
            return formatSponsoredProductsClickTracker(cleanProduct);
        }
    });

    return cleanedUpProducts;
};

// Based on the material provided, builds the slot id according to the paratemers provided
const getSlotId = pageType => {
    const country = languageLocalUtils.isUS() ? sponsoredProductsConstants.COUNTRIES.US : sponsoredProductsConstants.COUNTRIES.CA;
    const channel = Sephora.isDesktop() ? sponsoredProductsConstants.CHANNEL.DESKTOP : sponsoredProductsConstants.CHANNEL.MOBILE_WEB;
    const countryCol = country === 'US' ? sponsoredProductsConstants.SLOT_COUNTRY.US : sponsoredProductsConstants.SLOT_COUNTRY.CA;
    const channelCol = channel === 'Desktop' ? sponsoredProductsConstants.SLOT_CHANNEL.DESKTOP : sponsoredProductsConstants.SLOT_CHANNEL.MOBILE_WEB;
    const pageTypeColA =
        pageType === 'Search'
            ? sponsoredProductsConstants.SLOT_PAGETYPE.SEARCH
            : pageType === 'PDP'
                ? sponsoredProductsConstants.SLOT_PAGETYPE.PRODUCT_DETAIL_PAGE
                : sponsoredProductsConstants.SLOT_PAGETYPE.BROWSE;
    const pageTypeColB =
        pageType === 'PDP'
            ? sponsoredProductsConstants.SLOT_PAGETYPE_SECOND_POSITION.PRODUCT_DETAIL_PAGE
            : pageType === 'Search'
                ? sponsoredProductsConstants.SLOT_PAGETYPE_SECOND_POSITION.SEARCH
                : sponsoredProductsConstants.SLOT_PAGETYPE_SECOND_POSITION.BROWSE;

    return `${countryCol}${pageTypeColA}${channelCol}${pageTypeColB}`;
};

const getAdServiceParams = pageType => {
    const userData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA, false, false, true);
    const biAccountId = userData?.data?.profile?.beautyInsiderAccount?.biAccountId || '';
    const session = cookieUtils.read('SephSession') || '';
    const adSvcSlot = getSlotId(pageType);

    return {
        callAdSvc: true,
        adSvcSlot,
        adSvcSession: session,
        ...(biAccountId && { adSvcUser: biAccountId })
    };
};

const getBannerFallback = type => {
    const width = TYPES[type].WIDTH;
    const height = TYPES[type].HEIGHT;
    const canada = isCanada();
    const french = isFrench();
    const canadaFrench = isFRCanada();
    const imageFile = canadaFrench ? 'jpg' : 'png';
    const bannerType = canadaFrench ? '_FR' : '';
    const asset_url = `/img/ufe/rmn-fallback-${width}x${height}${bannerType}.${imageFile}`;
    const canadianLanguage = french ? LANGUAGES.FR : LANGUAGES.EN;
    const urlprefix = canada ? `/ca/${canadianLanguage.toLowerCase()}` : '';
    const clickthru = `${urlprefix}/beauty/giftcards`;

    return {
        asset_url,
        clickthru,
        isFallbackBanner: true
    };
};

const getBannersData = ({
    type, pageType, slot, targets, contextId, count = 1, countFill = 1, hasFallback = true
}) => {
    const requestParams = {
        width: TYPES[type].WIDTH,
        height: TYPES[type].HEIGHT,
        targets,
        category_id: pageType === RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY ? contextId : undefined,
        slot,
        count,
        count_fill: countFill
    };

    const fallback = getBannerFallback(type);

    const fallBackArray = Array(count).fill(fallback);

    return sponsoredProducts(requestParams)
        .then(response => {
            if (response.responseStatus === 200) {
                delete response.responseStatus;
                const responseArray = Array.isArray(response) ? response : Object.values(response);

                return { data: responseArray, fallback };
            }

            if (hasFallback) {
                return { data: fallBackArray, fallback };
            }

            return null;
        })
        .catch(() => {
            return hasFallback ? { data: fallBackArray, fallback } : {};
        });
};

/**
 * Initialize the banners for the page
 * @param {Object} options
 * @param {String} options.type - type of banner
 * @param {String} options.slot - slot id
 * @param {String} options.targets - target id
 * @param {Number} options.count - number of banners to fetch
 * @param {Number} options.countFill - number of banners to fill
 * @param {Boolean} options.hasFallback - flag to determine if the fallback banner should be used
 */
const initializeBanners = async ({
    type, pageType, slot, targets, count = 1, hasFallback = true, contextId
}) => {
    const state = store.getState();
    const rmnBanners = cmsRMNBannerSelector(state)[slot];

    if (rmnBanners?.contextId === contextId && rmnBanners?.banners?.length) {
        return rmnBanners.banners;
    }

    const banners = await getBannersData({
        type,
        slot,
        targets,
        contextId,
        count,
        countFill: count,
        hasFallback,
        pageType
    });

    store.dispatch(
        updateRmnMainBanners({
            slot,
            contextId,
            data: {
                targets,
                contextId,
                banners: banners.data,
                fallback: banners.fallback || banners
            }
        })
    );

    return banners.data;
};

// This is the information used in the Page View event. SOT extracts the information directly from the digitalData
const getBannerTrackingInfo = (sponsorBannerProduct, bannerProps) => {
    // Extracts the click tracking info from the RMN sponsor product
    const clickTrackerInfo = productUtils.getClickTrackerInformation(sponsorBannerProduct);
    const { slot, section, type } = bannerProps;
    const sponsorBannerProductData = {
        ...sponsorBannerProduct,
        ...clickTrackerInfo
    };

    // Builds the tracking information object
    return {
        slot,
        section,
        type,
        skuId: '',
        clickTrackerId: sponsorBannerProductData?.clickTrackerId || '',
        impressionTrackerId: sponsorBannerProductData?.impression_id || '',
        impressionPayload: sponsorBannerProductData?.impression_payload || '',
        clickPayload: sponsorBannerProductData?.click_payload || '',
        onloadPayload: sponsorBannerProductData?.onload_payload || '',
        wishlistPayload: sponsorBannerProductData?.wishlist_payload || '',
        basketPayload: sponsorBannerProductData?.basket_payload || '',
        viewableImpressionPayload: sponsorBannerProductData?.viewable_impression_payload || ''
    };
};

// This is the tracking information that is sent when events like click and viewable impression are fired
const getBannerEventTrackinfo = (bannerData, bannerProps) => {
    const bannerTrackingData = getBannerTrackingInfo(bannerData, bannerProps);

    return {
        sku: '',
        sponsored: true,
        clickTrackerId: bannerTrackingData?.clickTrackerId || '',
        impressionTrackerId: bannerTrackingData?.impressionTrackerId || '',
        impressionPayload: bannerTrackingData?.impressionPayload || '',
        clickPayload: bannerTrackingData?.clickPayload || '',
        isSponsoredProduct: true,
        onloadPayload: bannerTrackingData?.onloadPayload || '',
        wishlistPayload: bannerTrackingData?.wishlistPayload || '',
        basketPayload: bannerTrackingData?.basketPayload || '',
        viewableImpressionPayload: bannerTrackingData?.viewableImpressionPayload || ''
    };
};

let Events;

// Called when the user clicks on the banner
const handleBannerClick = ({ event, bannerData, bannerProps }) => {
    digitalData.page.attributes.previousPageData.pageType = bannerProps?.source;
    // reset internalCampaign so `getInternalCampaign` in generalBindings will set it
    // to the icid2 queryParam in the pPage URL
    digitalData.page.attributes.previousPageData.internalCampaign = '';

    const trackingInformation = getBannerEventTrackinfo(bannerData, bannerProps);
    let sotType;

    switch (bannerProps.contextId) {
        case RMN_SOURCES.HOMEPAGE:
            sotType = anaConsts.EVENT_NAMES.PLA_HOME_SPONSORED_BANNER_CLICK;

            break;
        default:
            sotType = bannerProps.clickEventName;
    }

    // Validates that the banner has the impression tracker information
    const bannerHasImpressionTrackerData = !(
        (trackingInformation?.impressionTrackerId || '') === '' && (trackingInformation?.impressionPayload || '') === ''
    );

    // Verifies the sponsored product information is available and that the product is a sponsored one.
    if (trackingInformation && trackingInformation.isSponsoredProduct && bannerHasImpressionTrackerData) {
        anaUtils.fireEventForTagManager(anaConsts.SOT_LINK_TRACKING_EVENT, {
            detail: {
                data: {
                    linkName: sotType,
                    actionInfo: sotType,
                    specificEventName: sotType,
                    sponsoredProductInformation: trackingInformation,
                    eventStrings: anaConsts.Event.EVENT_254,
                    internalCampaign: anaConsts.CAMPAIGN_STRINGS.RMN_BANNER,
                    productStrings: `;non-product click;;;${anaConsts.Event.EVENT_254};eVar124=[${bannerProps.slot}]:[${bannerProps.section}]:[${bannerData.campaign_id}]`
                },
                specificEventName: sotType
            }
        });
    }

    // This code makes sure the tracking event for the click action is fired before navigating to the banner url
    Location.navigateTo(event, bannerData.clickthru);
};

// Fired from componentDidMount, this method dispatches the event that indicates the banner has been shown to the client
const fireViewableImpressionEvent = ({ bannerProps, bannerData }) => {
    Events = require('utils/framework/Events').default;

    // Waits until the page is completely loaded to fire the event for Signal/TMS.
    Events.onLastLoadEvent(window, [PostLoad], () => {
        // Extras the viewable tracking information from the sponsored product
        const {
            sku,
            sponsored,
            impressionTrackerId,
            impressionPayload,
            isSponsoredProduct,
            onloadPayload,
            wishlistPayload,
            clickPayload,
            basketPayload,
            viewableImpressionPayload
        } = getBannerEventTrackinfo(bannerData, bannerProps);

        // Handle fallback banners or banners without no Impression information available.
        if ((impressionTrackerId || '') === '' && (impressionPayload || '') === '') {
            return;
        }

        let sotType;

        switch (bannerProps.contextId) {
            case RMN_SOURCES.HOMEPAGE:
                sotType = anaConsts.EVENT_NAMES.PLA_HOME_SPONSORED_BANNER_VIEWABLE_IMPR;

                break;
            default:
                sotType = bannerProps.viewableEventName;
        }

        // When firing the viewable impression, only the impression tracking id and payload are required
        const trackingInformation = {
            sku,
            sponsored,
            impressionTrackerId,
            impressionPayload,
            isSponsoredProduct,
            onloadPayload,
            wishlistPayload,
            clickPayload,
            basketPayload,
            viewableImpressionPayload
        };

        // Verifies the sponsored product information is available and that the product is a sponsored one.
        if (trackingInformation && trackingInformation.isSponsoredProduct) {
            processEvent.process(
                anaConsts.SOT_LINK_TRACKING_EVENT,
                {
                    data: {
                        linkName: sotType,
                        actionInfo: sotType,
                        specificEventName: sotType,
                        sponsoredProductInformation: trackingInformation
                    }
                },
                { specificEventName: sotType }
            );
        }
    });
};

const slotPrefix = localeUtils.isUS() ? '25' : '26';

const commonBannerProps = {
    handleRmnBanner: addBannerToDigitalData,
    hasFallback: true
};

const eventPages = [
    {
        targetPage: anaConsts.RMN_PAGE_NAMES.category,
        pageType: RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY
    },
    {
        targetPage: anaConsts.RMN_PAGE_NAMES.search,
        pageType: RMN_BANNER_TYPES.PAGE_TYPES.SEARCH
    }
];

const mountSectionEventData = (section, targetPage) => ({
    clickEventName: mountBannerEventData({
        section,
        targetPage,
        type: anaConsts.EVENTS_TYPES_NAME.CLICK
    }),
    viewableEventName: mountBannerEventData({
        section,
        targetPage,
        type: anaConsts.EVENTS_TYPES_NAME.VIEW
    })
});

const eventNames = eventPages.reduce((acc, page) => {
    acc[page.pageType] = {
        [SECTIONS.MAIN]: mountSectionEventData(SECTIONS.MAIN, page.targetPage),
        [SECTIONS.SIDEBAR]: mountSectionEventData(SECTIONS.SIDEBAR, page.targetPage)
    };

    return acc;
}, {});

const commonMainBannerProps = {
    ...commonBannerProps,
    marginBottom: 6,
    isCentered: true,
    section: SECTIONS.MAIN,
    position: POSITIONS.TOP,
    count: 3,
    countFill: 3
};

const commonSideBannerProps = {
    ...commonBannerProps,
    marginTop: 5,
    section: SECTIONS.SIDEBAR,
    count: 1,
    countFill: 1
};

const bannerPositions = {
    top: 0,
    mid: 1,
    bottom: 2
};

const bannerCommonProps = {
    [RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY]: {
        mainBannerProps: {
            slot: `${slotPrefix}${TYPES.SUPER_LEADERBOARD.SLOT[RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY]}`,
            source: RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY,
            type: RMN_BANNER_TYPES.TYPES.SUPER_LEADERBOARD.NAME,
            ...commonMainBannerProps,
            ...eventNames[RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY][SECTIONS.MAIN]
        },
        mainBannerMobileProps: {
            slot: `${slotPrefix}${TYPES.MOBILE_LEADERBOARD.SLOT[RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY]}`,
            source: RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY,
            type: RMN_BANNER_TYPES.TYPES.MOBILE_LEADERBOARD.NAME,
            ...commonMainBannerProps,
            ...eventNames[RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY][SECTIONS.MAIN]
        },
        sideBannerProps: {
            slot: `${slotPrefix}${TYPES.WIDE_SIDESCRAPER.SLOT[RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY]}`,
            source: RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY,
            type: RMN_BANNER_TYPES.TYPES.WIDE_SIDESCRAPER.NAME,
            ...commonSideBannerProps,
            ...eventNames[RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY][SECTIONS.SIDEBAR]
        }
    },
    [RMN_BANNER_TYPES.PAGE_TYPES.SEARCH]: {
        mainBannerProps: {
            slot: `${slotPrefix}${TYPES.SUPER_LEADERBOARD.SLOT[RMN_BANNER_TYPES.PAGE_TYPES.SEARCH]}`,
            source: RMN_BANNER_TYPES.PAGE_TYPES.SEARCH,
            type: RMN_BANNER_TYPES.TYPES.SUPER_LEADERBOARD.NAME,
            ...commonMainBannerProps,
            ...eventNames[RMN_BANNER_TYPES.PAGE_TYPES.SEARCH][SECTIONS.MAIN]
        },
        mainBannerMobileProps: {
            slot: `${slotPrefix}${TYPES.MOBILE_LEADERBOARD.SLOT[RMN_BANNER_TYPES.PAGE_TYPES.SEARCH]}`,
            source: RMN_BANNER_TYPES.PAGE_TYPES.SEARCH,
            type: RMN_BANNER_TYPES.TYPES.MOBILE_LEADERBOARD.NAME,
            ...commonMainBannerProps,
            ...eventNames[RMN_BANNER_TYPES.PAGE_TYPES.SEARCH][SECTIONS.MAIN]
        },
        sideBannerProps: {
            slot: `${slotPrefix}${TYPES.WIDE_SIDESCRAPER.SLOT[RMN_BANNER_TYPES.PAGE_TYPES.SEARCH]}`,
            source: RMN_BANNER_TYPES.PAGE_TYPES.SEARCH,
            type: RMN_BANNER_TYPES.TYPES.WIDE_SIDESCRAPER.NAME,
            ...commonSideBannerProps,
            ...eventNames[RMN_BANNER_TYPES.PAGE_TYPES.SEARCH][SECTIONS.SIDEBAR]
        }
    }
};

const mountRmnBannerConfig = ({ targets, pageType, contextId }) => {
    const commonProps = {
        targets,
        handleRmnBanner: addBannerToDigitalData,
        contextId
    };

    const configKeys = Object.keys(bannerCommonProps[pageType]);

    const configs = configKeys.reduce(
        (acc, key) => ({
            ...acc,
            [key]: {
                pageType,
                ...bannerCommonProps[pageType][key],
                ...commonProps
            }
        }),
        {}
    );

    return configs;
};

const handleBannerData = async ({
    targets, isMobile, pageType, setLoading, contextId, productCount
}) => {
    const state = store.getState();
    const bannerData = cmsRMNBannerSelector(state);

    const { mainBannerProps, mainBannerMobileProps } = mountRmnBannerConfig({
        targets,
        contextId,
        pageType,
        productCount
    });
    const slot = isMobile ? mainBannerMobileProps.slot : mainBannerProps.slot;

    if (bannerData[slot] && bannerData[slot].contextId === contextId) {
        // Set loading to false if bannerData is already loaded and it was set to true earlier
        setLoading(false);

        return;
    }

    setLoading(true);

    try {
        const count = isMobile ? 3 : 2;

        mainBannerProps.count = count;
        mainBannerMobileProps.count = count;

        const bannersToInitialize = isMobile ? [initializeBanners(mainBannerMobileProps)] : [initializeBanners(mainBannerProps)];

        await Promise.all(bannersToInitialize);

        setLoading(false);
    } catch (error) {
        Sephora.logger.error('Error initializing banners:', error);

        setLoading(false);
    }
};

export default {
    bannerCommonProps,
    bannerPositions,
    handleBannerClick,
    fireViewableImpressionEvent,
    resetBanners,
    handleBannerData,
    mountRequestParams,
    addBannerToDigitalData,
    getAttributes,
    getBannersData,
    transformSponsoredProductsResponse,
    getAdServiceParams,
    formatSponsoredProductsClickTracker,
    initializeBanners,
    getBannerFallback,
    getSlotId,
    RMN_SOURCES
};
