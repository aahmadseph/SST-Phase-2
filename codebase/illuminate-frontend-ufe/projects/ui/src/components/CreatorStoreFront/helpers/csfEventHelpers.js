/* eslint-disable camelcase */
/**
 * Common event tracking utilities for Creator Store Front components
 */

import { useEffect } from 'react';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import csfConstants from 'components/CreatorStoreFront/helpers/csfConstants';
import UIUtils from 'utils/UI';
import Location from 'utils/Location';
import anaUtils from 'analytics/utils';

/**
 * Determines device type based on user agent with configurable fallback
 * @param {string} defaultValue - Fallback value when no specific device is detected
 * @returns {string} Device type
 */
const getDeviceSource = (defaultValue = 'others') => {
    if (UIUtils.isIOS()) {
        return 'ios';
    }

    if (UIUtils.isAndroid()) {
        return 'android';
    }

    if (UIUtils.isMac()) {
        return 'mac';
    }

    if (UIUtils.isWindows()) {
        return 'windows';
    }

    return defaultValue;
};

/**
 * Determines the visitor's referrer source platform
 * @returns {string|undefined} Referrer platform or undefined if no referrer
 */
const getVisitorRefererFrom = () => {
    const referrer = document.referrer.toLowerCase();

    if (!referrer) {
        return 'landing';
    }

    const refererMap = {
        instagram: 'instagram',
        tiktok: 'tiktok',
        youtube: 'youtube',
        facebook: 'facebook',
        beacons: 'beacons',
        linktree: 'linktree'
    };

    for (const [domain, source] of Object.entries(refererMap)) {
        if (referrer.includes(domain)) {
            return source;
        }
    }

    return 'others';
};

/**
 * Determines the traffic source classification
 * @returns {string} Traffic source
 */
const getTrafficSource = () => {
    const referrer = document.referrer;

    if (!referrer) {
        return 'others';
    }

    const refererFrom = getVisitorRefererFrom();

    if (['instagram', 'tiktok', 'youtube', 'facebook', 'beacons', 'linktree'].includes(refererFrom)) {
        return refererFrom;
    }

    if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('yahoo') || referrer.includes('duckduckgo')) {
        return 'search';
    }

    // case when coming from portal.creators.sephora.com
    if (referrer.includes('creators.sephora.com')) {
        return 'landing';
    }

    return 'others';
};

/**
 * Gets the current event date and time parts
 * @returns {
 *  eventDateTime: {string} Full UTC date in YYYY-MM-DDT00:00:00Z format
 *  eventDate: {string} UTC date in YYYY-MM-DD format
 *  eventHour: {string} UTC hour (0-23)
 *  eventTime: {number} UTC timestamp
 * }
 */
const getNormalizedDateFields = () => {
    const date = new Date();

    return {
        eventDateTime: date.toISOString(),
        eventDate: date.toISOString().split('T')[0],
        eventHour: date.getUTCHours().toString(),
        eventTime: date.getTime()
    };
};

/**
 * Gets the host domain - static value for CSF events
 * @returns {string} Static host domain
 */
const getWhomHosted = () => 'sephora.com';

/**
 * Gets the referrer URL
 * @returns {string} Full referrer URL or empty string
 */
const getRefererUrl = () => document.referrer || '';

/**
 * Gets the user agent string
 * @returns {string} Full user agent string
 */
const getUserAgent = () => navigator.userAgent;

/**
 * Creates a standard CSF event payload with common fields
 * @param {Object} options - Event-specific options
 * @param {string} options.uniqueKey - Unique identifier (e.g., collection ID, post ID)
 * @param {string} options.eventType - Type of event (view, click, etc.)
 * @param {string} [options.keyFieldName='anchor_collection_unique_key'] - Name of the unique key field
 * @param {Object} [options.additionalData] - Additional data for specific event types
 * @returns {Object} Standard CSF event payload
 */
export const createCSFEventPayload = ({ uniqueKey, eventType, keyFieldName = csfConstants.COLLECTION_EVENT_KEY, additionalData = {} }) => {
    const isPostEvent = keyFieldName === csfConstants.POST_EVENT_KEY;
    const { eventDate, eventHour, eventTime } = getNormalizedDateFields();
    const { referralOwnerId = '', productId = '', motomProductId = '' } = additionalData;
    const refererUrl = getRefererUrl();

    const basePayload = {
        [keyFieldName]: uniqueKey,
        referer: refererUrl,
        event_date: eventDate,
        event_hour: eventHour,
        event_type: eventType,
        user_agent: getUserAgent(),
        traffic_source: getTrafficSource(),
        device_source: getDeviceSource(),
        whom_hosted: getWhomHosted(),
        eventTime: eventTime,
        ...(motomProductId && { motom_product_id: motomProductId })
    };

    // Add post-specific fields
    if (isPostEvent) {
        return {
            ...basePayload,
            referral_owner_id: referralOwnerId,
            product_id: productId,
            current_url: window.location.href,
            redirect_url: refererUrl, // Same as referer for posts
            http_referer: refererUrl
        };
    }

    return basePayload;
};

/**
 * Creates SOT variable overrides for CSF events
 * @param {Object} options - SOT override options
 * @param {string} options.uniqueKey - Unique identifier
 * @param {string} options.eventName - Event name for tracking
 * @param {Object} options.csfPayload - The CSF payload for additional mappings
 * @returns {Object} SOT variable overrides
 */
export const createSOTOverrides = ({ uniqueKey, eventName, csfPayload = {} }) => {
    // Check if this is a post event by looking at the keyFieldName in the payload
    const isPostEvent = eventName.includes('post') || csfPayload[csfConstants.POST_EVENT_KEY];
    const { eventTime } = getNormalizedDateFields();

    const baseOverrides = {
        linkName: eventName,
        actionInfo: eventName,
        specificEventName: eventName,
        eventTime: csfPayload.eventTime || eventTime,
        sotType: csfPayload.event_type || csfConstants.VIEW,
        userAgent: csfPayload.user_agent || getUserAgent(),
        traffic_source: csfPayload.traffic_source || getTrafficSource(),
        sessionPlatform: csfPayload.device_source || getDeviceSource(),
        motom_product_id: csfPayload.motomProductId || ''
    };

    if (isPostEvent) {
        return {
            ...baseOverrides,
            anchor_post_unique_key: uniqueKey,
            referral_owner_id: csfPayload.referral_owner_id || '', // sotV405
            product_id: csfPayload.product_id || '', // sotV15
            pageInfoUrl: csfPayload.current_url || window.location.href,
            redirect_url: csfPayload.redirect_url || csfPayload.http_referer || '', // Use redirect_url instead of sotV278
            http_referer: csfPayload.http_referer || '',
            referer: csfPayload.referer || ''
        };
    } else {
        return {
            ...baseOverrides,
            anchor_collection_unique_key: uniqueKey,
            referer: csfPayload.referer || ''
        };
    }
};

/**
 * Sends a CSF tracking event using the SOTCSFTracking method
 * @param {Object} options - Event options
 * @param {string} options.eventName - Name of the event (e.g., 'csf.collection.tile.view')
 * @param {Object} options.csfPayload - CSF-specific payload data
 * @param {Object} options.sotOverrides - SOT variable overrides
 */
export const sendCSFTrackingEvent = ({ eventName, csfPayload = {}, sotOverrides = {} }) => {
    if (!Sephora?.analytics?.processEvent?.process || !anaConsts?.SOT_CSF_TRACKING_EVENT) {
        return;
    }

    try {
        const data = {
            linkName: eventName,
            actionInfo: eventName,
            specificEventName: eventName,
            ...sotOverrides,
            csfPayload: csfPayload
        };

        processEvent.process(
            anaConsts.SOT_CSF_TRACKING_EVENT,
            {
                data,
                specificEventName: eventName
            },
            { specificEventName: eventName }
        );

        Sephora.logger.verbose(`Sending CSF tracking event: ${eventName} with payload ${JSON.stringify(data)}`);
    } catch (error) {
        Sephora.logger.verbose(`Error sending CSF tracking event: ${eventName}`);
    }
};

/**
 * High-level function to track a CSF event with standard payload
 * @param {Object} options - Event tracking options
 * @param {string} options.eventName - Event name (e.g., 'csf.collection.tile.view')
 * @param {string} options.uniqueKey - Unique identifier for the item
 * @param {string} options.eventType - Type of event (view, click, etc.)
 * @param {string} [options.keyFieldName] - Name of the unique key field in payload
 * @param {Object} [options.additionalData] - Additional data for specific event types
 */
const trackCSFEvent = ({
    eventName, uniqueKey, eventType, keyFieldName, additionalData
}) => {
    if (!eventName || !uniqueKey || !eventType) {
        Sephora.logger.verbose('Missing required parameters for CSF tracking');

        return;
    }

    try {
        const csfPayload = createCSFEventPayload({ uniqueKey, eventType, keyFieldName, additionalData });
        const sotOverrides = createSOTOverrides({ uniqueKey, eventName, csfPayload });
        sendCSFTrackingEvent({ eventName, csfPayload, sotOverrides });
    } catch (error) {
        Sephora.logger.verbose(`Error in trackCSFEvent: ${error.message}`);
    }
};

const trackCSFProductEvent = ({ eventName, uniqueKey, eventType, additionalData }) => {
    if (!eventName || !uniqueKey || !eventType) {
        Sephora.logger.verbose('Missing required parameters for CSF product tracking');

        return;
    }

    try {
        const { href } = Location.getLocation();
        const { eventDate, eventHour } = getNormalizedDateFields();
        const { referralOwnerId, productId, targetUrl, motomProductId } = additionalData;
        const isRedirectUrl = eventType === csfConstants.CLICK && targetUrl;
        const userId = eventType === csfConstants.CLICK && referralOwnerId;

        const csfPayload = {
            referral_owner_id: referralOwnerId,
            motom_product_id: motomProductId,
            current_url: href,
            event_date: eventDate,
            event_hour: eventHour,
            event_type: eventType,
            whom_hosted: getWhomHosted(),
            device_source: getDeviceSource(),
            traffic_source: getTrafficSource(),
            user_agent: getUserAgent(),
            http_referer: getRefererUrl(),
            ...(productId && { product_id: productId }),
            ...(isRedirectUrl && { redirect_url: targetUrl }),
            ...(userId && { user_id: userId })
        };

        const sotOverrides = {
            sotType: eventType
        };

        sendCSFTrackingEvent({ eventName, csfPayload, sotOverrides });
    } catch (error) {
        Sephora.logger.verbose(`Error in trackCSFProductEvent: ${error.message}`);
    }
};

/**
 * Convenience function for tracking collection view events
 * @param {Object} options - Collection tracking options
 * @param {string} options.collectionId - Collection unique identifier
 */
export const trackCollectionView = ({ collectionId }) => {
    trackCSFEvent({
        eventName: csfConstants.COLLECTION_TILE_VIEW_EVENT,
        uniqueKey: collectionId,
        eventType: csfConstants.VIEW,
        keyFieldName: csfConstants.COLLECTION_EVENT_KEY
    });
};

/**
 * Convenience function for tracking post view events
 * @param {Object} options - Post tracking options
 * @param {string} options.postId - Post unique identifier
 */
export const trackPostView = ({ postId, referralOwnerId, productId }) => {
    trackCSFEvent({
        eventName: csfConstants.POST_TILE_VIEW_EVENT,
        uniqueKey: postId,
        eventType: csfConstants.VIEW,
        keyFieldName: csfConstants.POST_EVENT_KEY,
        additionalData: {
            referralOwnerId,
            productId
        }
    });
};

/**
 * Convenience function for tracking post detail view events
 * @param {Object} options - Post detail tracking options
 * @param {string} options.postId - Post unique identifier
 */
export const trackPostDetailView = ({ postId }) => {
    trackCSFEvent({
        eventName: 'csf.post.postdetail.view', // No constant available for this specific event
        uniqueKey: postId,
        eventType: csfConstants.VIEW,
        keyFieldName: csfConstants.POST_EVENT_KEY
    });
};

/**
 * Utility to setup intersection observer for tracking visibility with 1-second delay
 * @param {Object} options - Observer options
 * @param {Function} options.onVisible - Callback when element becomes visible
 * @param {number} [options.threshold=0.5] - Visibility threshold (0-1)
 * @param {boolean} [options.trackOnce=false] - Only track first visibility (false for posts to allow re-tracking)
 * @param {number} [options.delay=1000] - Delay in milliseconds before tracking
 * @returns {IntersectionObserver} Observer instance
 */
export const createVisibilityTracker = ({ onVisible, threshold = 0.5, trackOnce = true, delay = 0 }) => {
    if (typeof onVisible !== 'function') {
        Sephora.logger.verbose('onVisible callback is required for visibility tracker');

        return null;
    }

    const trackedElements = new Set();
    const visibilityTimers = new Map();

    // Force trigger visibility for elements already in viewport on page load
    setTimeout(() => {
        try {
            const trackers = document.querySelectorAll('[data-tracking-id]');
            Sephora.logger.verbose(`Found ${trackers.length} elements with data-tracking-id on page load`);

            trackers.forEach(element => {
                const id = element.getAttribute('data-tracking-id');

                if (id && !trackedElements.has(id)) {
                    const rect = element.getBoundingClientRect();
                    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

                    if (isInViewport) {
                        if (delay > 0) {
                            const timer = setTimeout(() => {
                                if (trackOnce) {
                                    trackedElements.add(id);
                                }

                                onVisible(id, element);
                                visibilityTimers.delete(id);
                            }, delay);
                            visibilityTimers.set(id, timer);
                        } else {
                            if (trackOnce) {
                                trackedElements.add(id);
                            }

                            onVisible(id, element);
                        }
                    }
                }
            });
        } catch (error) {
            Sephora.logger.verbose(`Error in visibility tracker initialization: ${error.message}`);
        }
    }, 500);

    return new IntersectionObserver(
        entries => {
            Sephora.logger.verbose(`Intersection observer fired with ${entries.length} entries`);

            entries.forEach(entry => {
                try {
                    const elementId = entry.target.getAttribute('data-tracking-id');

                    if (!elementId) {
                        return;
                    }

                    if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
                        if (trackOnce && trackedElements.has(elementId)) {
                            return; // Already tracked
                        }

                        if (delay > 0) {
                            // Clear any existing timer
                            if (visibilityTimers.has(elementId)) {
                                clearTimeout(visibilityTimers.get(elementId));
                            }

                            // Set new timer for delayed tracking
                            const timer = setTimeout(() => {
                                // Check if element is still visible after delay
                                const rect = entry.target.getBoundingClientRect();
                                const stillVisible = rect.top < window.innerHeight && rect.bottom > 0;

                                if (stillVisible) {
                                    if (trackOnce) {
                                        trackedElements.add(elementId);
                                    }

                                    onVisible(elementId, entry.target);
                                } else {
                                    Sephora.logger.verbose(`Element ${elementId} no longer visible after delay`);
                                }

                                visibilityTimers.delete(elementId);
                            }, delay);

                            visibilityTimers.set(elementId, timer);
                        } else {
                            Sephora.logger.verbose(`Tracking element immediately: ${elementId}`);

                            if (trackOnce) {
                                trackedElements.add(elementId);
                            }

                            onVisible(elementId, entry.target);
                        }
                    } else {
                        // Element is no longer visible, clear any pending timer
                        if (visibilityTimers.has(elementId)) {
                            Sephora.logger.verbose(`Element ${elementId} no longer visible, clearing timer`);
                            clearTimeout(visibilityTimers.get(elementId));
                            visibilityTimers.delete(elementId);
                        }
                    }
                } catch (error) {
                    Sephora.logger.verbose(`Error in intersection observer entry: ${error.message}`);
                }
            });
        },
        {
            threshold: [threshold],
            rootMargin: '0px 0px 500px 0px'
        }
    );
};

/**
 * Enhanced visibility tracker specifically designed for horizontal scrolling scenarios
 * Combines IntersectionObserver with scroll event listeners for reliable tracking
 * @param {Object} options - Observer options
 * @param {Function} options.onVisible - Callback when element becomes visible
 * @param {number} [options.threshold=0.5] - Visibility threshold (0-1)
 * @param {boolean} [options.trackOnce=true] - Only track first visibility
 * @param {number} [options.delay=1000] - Delay in milliseconds before tracking
 * @param {HTMLElement} [options.scrollContainer] - Container element that scrolls (defaults to window)
 * @returns {Object} Observer instance with additional methods
 */
export const createHorizontalVisibilityTracker = ({
    onVisible, threshold = 0.5, trackOnce = true, delay = 1000, scrollContainer = null
}) => {
    if (typeof onVisible !== 'function') {
        Sephora.logger.verbose('onVisible callback is required for horizontal visibility tracker');

        return null;
    }

    const trackedElements = new Set();
    const visibilityTimers = new Map();
    const observedElements = new Map();
    let scrollEndTimer = null;

    // Check if element is sufficiently visible in viewport
    const isElementVisible = element => {
        const rect = element.getBoundingClientRect();
        const containerRect = scrollContainer
            ? scrollContainer.getBoundingClientRect()
            : {
                top: 0,
                left: 0,
                right: window.innerWidth,
                bottom: window.innerHeight
            };

        // Calculate visible area
        const visibleLeft = Math.max(rect.left, containerRect.left);
        const visibleTop = Math.max(rect.top, containerRect.top);
        const visibleRight = Math.min(rect.right, containerRect.right);
        const visibleBottom = Math.min(rect.bottom, containerRect.bottom);

        if (visibleLeft >= visibleRight || visibleTop >= visibleBottom) {
            return false; // No visible area
        }

        const visibleWidth = visibleRight - visibleLeft;
        const visibleHeight = visibleBottom - visibleTop;
        const visibleArea = visibleWidth * visibleHeight;
        const totalArea = rect.width * rect.height;

        return totalArea > 0 && visibleArea / totalArea >= threshold;
    };

    // Handle visibility check with delay
    const handleVisibilityCheck = (elementId, element) => {
        if (trackOnce && trackedElements.has(elementId)) {
            return;
        }

        if (!isElementVisible(element)) {
            return;
        }

        if (delay > 0) {
            // Clear existing timer
            if (visibilityTimers.has(elementId)) {
                clearTimeout(visibilityTimers.get(elementId));
            }

            // Set new timer
            const timer = setTimeout(() => {
                // Recheck visibility after delay
                if (isElementVisible(element)) {
                    if (trackOnce) {
                        trackedElements.add(elementId);
                    }

                    onVisible(elementId, element);
                }

                visibilityTimers.delete(elementId);
            }, delay);

            visibilityTimers.set(elementId, timer);
        } else {
            if (trackOnce) {
                trackedElements.add(elementId);
            }

            onVisible(elementId, element);
        }
    };

    // Handle scroll events (debounced)
    const handleScroll = () => {
        if (scrollEndTimer) {
            clearTimeout(scrollEndTimer);
        }

        scrollEndTimer = setTimeout(() => {
            // Check all observed elements after scroll ends
            observedElements.forEach((element, elementId) => {
                if (element && (!trackOnce || !trackedElements.has(elementId))) {
                    handleVisibilityCheck(elementId, element);
                }
            });
        }, 200); // Debounce scroll events
    };

    // Create standard intersection observer for initial detection
    const intersectionObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                const elementId = entry.target.getAttribute('data-tracking-id');

                if (!elementId) {
                    return;
                }

                if (entry.isIntersecting) {
                    handleVisibilityCheck(elementId, entry.target);
                } else {
                    // Clear timer if element is no longer intersecting
                    if (visibilityTimers.has(elementId)) {
                        clearTimeout(visibilityTimers.get(elementId));
                        visibilityTimers.delete(elementId);
                    }
                }
            });
        },
        {
            threshold: [threshold],
            rootMargin: '50px',
            root: scrollContainer
        }
    );

    // Add scroll event listener
    const scrollTarget = scrollContainer || window;
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

    // Return enhanced observer object
    return {
        observe: element => {
            const elementId = element.getAttribute('data-tracking-id');

            if (elementId) {
                observedElements.set(elementId, element);
                intersectionObserver.observe(element);

                // Initial visibility check for elements already in view
                setTimeout(() => {
                    if (isElementVisible(element)) {
                        handleVisibilityCheck(elementId, element);
                    }
                }, 100); // Initial check after a short delay
            }
        },

        unobserve: element => {
            const elementId = element.getAttribute('data-tracking-id');

            if (elementId) {
                observedElements.delete(elementId);
                intersectionObserver.unobserve(element);

                // Clean up timers
                if (visibilityTimers.has(elementId)) {
                    clearTimeout(visibilityTimers.get(elementId));
                    visibilityTimers.delete(elementId);
                }
            }
        },

        disconnect: () => {
            intersectionObserver.disconnect();
            scrollTarget.removeEventListener('scroll', handleScroll);

            // Clean up all timers
            visibilityTimers.forEach(timer => clearTimeout(timer));
            visibilityTimers.clear();

            if (scrollEndTimer) {
                clearTimeout(scrollEndTimer);
            }

            observedElements.clear();
            trackedElements.clear();
        }
    };
};

// This hook is set to run only on componet mount for page loads/views
export const useCSFPageLoadAnalytics = ({ creatorProfileData = {}, collectionId = '', postId = '', pageType = '' }) => {
    useEffect(() => {
        const motomUserId = creatorProfileData?.creatorProfile?.creatorId || '';
        const { eventDateTime, eventDate, eventHour } = getNormalizedDateFields();

        const csfPayload = {
            event_datetime: eventDateTime,
            event_date: eventDate,
            event_hour: eventHour,
            motom_user_id: motomUserId,
            referal_owner_id: motomUserId,
            visitor_device: getDeviceSource(),
            user_agent: getUserAgent(),
            referer: getRefererUrl(),
            visitor_referer_from_url: getVisitorRefererFrom(),
            traffic_source: getTrafficSource(),
            device_source: getDeviceSource(),
            whom_hosted: getWhomHosted(),
            ...(collectionId && { [csfConstants.COLLECTION_EVENT_KEY]: collectionId }),
            ...(postId && { [csfConstants.POST_EVENT_KEY]: postId })
        };

        digitalData.csfPayload = csfPayload;
        digitalData.page.category.pageType = pageType;
    }, []);
};

/**
 * Function for tracking post click events
 * @param {Object} options - Post click tracking options
 * @param {string} options.postId - Post unique identifier
 * @param {string} options.referralOwnerId - Referral Owner Id (creatorId) (optional)
 * @param {string} options.postId - ProductId specific to clicked post (optional)
 */
export const trackPostClick = ({ postId, referralOwnerId, productId }) => {
    trackCSFEvent({
        eventName: csfConstants.POST_TILE_CLICK_EVENT,
        uniqueKey: postId,
        eventType: csfConstants.CLICK,
        keyFieldName: csfConstants.POST_EVENT_KEY,
        additionalData: {
            referralOwnerId,
            productId
        }
    });
};

export const trackProductView = ({
    referralOwnerId, productId, postId, collectionId, motomProductId, isFeaturted = false
}) => {
    if (postId) {
        // When viewing a product from a post context, include post information
        trackCSFEvent({
            eventName: csfConstants.PRODUCT_TILE_VIEW_EVENT,
            uniqueKey: postId,
            eventType: csfConstants.VIEW,
            keyFieldName: csfConstants.POST_EVENT_KEY,
            additionalData: {
                referralOwnerId,
                productId,
                motomProductId
            }
        });
    } else if (collectionId) {
        // When viewing a product from a collection context, include collection information
        trackCSFEvent({
            eventName: csfConstants.PRODUCT_TILE_VIEW_EVENT,
            uniqueKey: collectionId,
            eventType: csfConstants.VIEW,
            keyFieldName: csfConstants.COLLECTION_EVENT_KEY,
            additionalData: {
                referralOwnerId,
                productId,
                motomProductId
            }
        });
    } else {
        // Fallback to regular product tracking
        trackCSFProductEvent({
            eventName: csfConstants.PRODUCT_TILE_VIEW_EVENT,
            uniqueKey: productId,
            eventType: isFeaturted ? csfConstants.FEATURED_PRODUCT_TILE_VIEW : csfConstants.VIEW,
            additionalData: {
                referralOwnerId,
                productId,
                motomProductId
            }
        });
    }
};

export const trackProductClick = ({
    referralOwnerId, productId, targetUrl, motomProductId, isFeaturted = false
}) => {
    trackCSFProductEvent({
        eventName: csfConstants.PRODUCT_TILE_CLICK_EVENT,
        uniqueKey: productId,
        eventType: isFeaturted ? csfConstants.FEATURED_PRODUCT_TILE_CLICK : csfConstants.CLICK,
        additionalData: {
            referralOwnerId,
            productId,
            targetUrl,
            motomProductId
        }
    });
};

export const sendCSFFeaturedCarouselScrollEvent = () => {
    if (!Sephora?.analytics?.processEvent?.process || !anaConsts?.LINK_TRACKING_EVENT) {
        return;
    }

    try {
        const data = {
            actionInfo: `${anaConsts.PAGE_TYPES.CREATOR_STORE_FRONT}:${anaConsts.CAROUSEL_NAMES.CSF_FEATURED_CAROUSEL}:scroll`
        };

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data
        });

        Sephora.logger.verbose(`Sending CSF Featured Carousel first scroll event with payload ${JSON.stringify(data)}`);
    } catch (error) {
        Sephora.logger.verbose('Error sending CSF Featured Carousel first scroll event');
    }
};

export const sendCSFFeaturedCarouselNextPageLoadEvent = slot => {
    if (!anaUtils?.setNextPageData) {
        return;
    }

    try {
        const internalCampaign = `${anaConsts.PAGE_TYPES.CREATOR_STORE_FRONT}:${anaConsts.CAROUSEL_NAMES.CSF_FEATURED_CAROUSEL}:slot ${slot}`;

        anaUtils.setNextPageData({
            internalCampaign
        });

        Sephora.logger.verbose(`Sending CSF Featured Carousel next page load event with payload ${JSON.stringify(internalCampaign)}`);
    } catch (error) {
        Sephora.logger.verbose('Error sending CSF Featured Carousel next page load event');
    }
};
