/* eslint-disable camelcase */
import utils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import linkTrackingAttributes from 'analytics/bindings/pages/all/linkTrackingAttributes';
import csfConstants from 'components/CreatorStoreFront/helpers/csfConstants';

function getBaseInfo(data, linkTrackingData, csfPayload) {
    return {
        ...linkTrackingData,
        referer: csfPayload.referer || data.referer || '',
        eventTime: csfPayload.eventTime || data.eventTime || new Date().getTime(),
        sotType: csfPayload.event_type || data.sotType || csfConstants.VIEW,
        userAgent: csfPayload.user_agent || data.userAgent || navigator.userAgent,
        traffic_source: csfPayload.traffic_source || data.traffic_source || '',
        sessionPlatform: csfPayload.device_source || data.sessionPlatform || 'desktop',
        whomHosted: csfPayload.whom_hosted || 'sephora.com',
        csfPayload: csfPayload
    };
}

function getPostEventInfo(baseInfo, csfPayload, data) {
    return {
        ...baseInfo,
        [csfConstants.POST_EVENT_KEY]: csfPayload[csfConstants.POST_EVENT_KEY] || data[csfConstants.POST_EVENT_KEY] || '',
        referral_owner_id: csfPayload.referral_owner_id || data.referral_owner_id || '',
        product_id: csfPayload.product_id || data.product_id || '',
        pageInfoUrl: csfPayload.current_url || data.pageInfoUrl || window.location.href,
        redirect_url: csfPayload.redirect_url || csfPayload.http_referer || data.redirect_url || '',
        http_referer: csfPayload.http_referer || data.http_referer || ''
    };
}

function getCollectionEventInfo(baseInfo, csfPayload, data) {
    return {
        ...baseInfo,
        [csfConstants.COLLECTION_EVENT_KEY]: csfPayload[csfConstants.COLLECTION_EVENT_KEY] || data[csfConstants.COLLECTION_EVENT_KEY] || ''
    };
}

function buildLinkTrackingInfo(data, linkTrackingData) {
    const csfPayload = data.csfPayload || {};
    const isPostEvent = data.specificEventName && data.specificEventName.includes('post');
    const baseInfo = getBaseInfo(data, linkTrackingData, csfPayload);

    if (isPostEvent) {
        return getPostEventInfo(baseInfo, csfPayload, data);
    } else {
        return getCollectionEventInfo(baseInfo, csfPayload, data);
    }
}

export default function sotCSFTrackingEventBinding(data) {
    const digitalData = window.digitalData;
    const linkTrackingData = linkTrackingAttributes(data);

    // Get the most recent CSF tracking event
    const mostRecentEvent = utils.getMostRecentEvent(anaConsts.SOT_CSF_TRACKING_EVENT);

    // Set standard digitalData properties for CSF tracking
    digitalData.page.attributes.linkTrackingInfo = buildLinkTrackingInfo(data, linkTrackingData);

    // Update the most recent event with CSF-specific data
    if (mostRecentEvent) {
        mostRecentEvent.eventInfo = mostRecentEvent.eventInfo || {};
        mostRecentEvent.eventInfo.attributes = {
            ...mostRecentEvent.eventInfo.attributes,
            ...digitalData.page.attributes.linkTrackingInfo
        };
    }

    return digitalData.page.attributes.linkTrackingInfo;
}
