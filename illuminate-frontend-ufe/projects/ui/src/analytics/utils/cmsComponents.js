import userUtils from 'utils/User';
import p13nUtils from 'utils/localStorage/P13n';
import anaConsts from 'analytics/constants';
import constants from 'constants/content';
import testTarget from 'utils/TestTarget';
import Empty from 'constants/empty';
import store from 'store/Store';
import { PostLoad } from 'constants/events';
import { saveRefererData, mountComponentRef } from 'analytics/utils/cmsReferer';
import { sendSOTP13nTrackingEvent, sendSOTP13nTrackingClickEvent } from 'analytics/utils/sotTracking';
import { cmsComponentDataSelector } from 'selectors/cmsComponents';

const NA = 'n/a';

const { getPageType } = testTarget;

const {
    COMPONENT_TYPES: {
        BANNER_LIST, PRODUCT_LIST, RECAP, SOFT_LINKS, PROMOTION_LIST, REWARD_LIST, BANNER
    },
    BANNER_TYPES: { PERSISTENT }
} = constants;

const {
    SOT_P13N_TRACKING_EVENT,
    CMS_COMPONENT_EVENTS: { ITEM_CLICK }
} = anaConsts;

let isHomepage = false;
let Events;
const nextBestFlags = ['isNBCEnabled', 'isNBOEnabled', 'isMABEnabled'];

function fireEventForTagManager(eventName, eventData = Empty.Object) {
    var event = new CustomEvent(eventName, eventData);

    window.dispatchEvent(event);
}

export const shouldSentEvent = eventData => {
    const hasPersonalizationData = eventData?.personalizationData.bannersPersonalizedData?.length > 0;

    if (!hasPersonalizationData) {
        return;
    }

    if (eventData?.specificEventName === ITEM_CLICK && isHomepage) {
        const hasParent = eventData?.personalizationData.sid !== eventData?.personalizationData.bannersPersonalizedData[0].sid;
        const child = eventData?.personalizationData.bannersPersonalizedData[0];
        const currentSid = eventData?.personalizationData.sid ?? child.sid ?? null;

        const componentRefData = {
            currentSid,
            parent: hasParent
                ? {
                    sid: eventData?.personalizationData.sid,
                    type: eventData?.personalizationData.contentType,
                    sys: {
                        publishedVersion: eventData?.personalizationData.publishedVersion
                    }
                }
                : null,
            child: {
                sid: child.sid || null,
                type: !hasParent ? eventData?.personalizationData.contentType : child?.type,
                sys: child?.publishedVersion
                    ? {
                        publishedVersion: child.publishedVersion
                    }
                    : null
            }
        };

        saveRefererData(componentRefData);
    }

    fireEventForTagManager(SOT_P13N_TRACKING_EVENT, {
        detail: {
            data: eventData,
            specificEventName: eventData.specificEventName
        }
    });

    return;
};

// Get the rest of the personalization data from the local storage, by matching the context of
// the banner item with the context of the personalization data.
export const matchContexts = itemPersonalization => {
    const { personalizationData } = getPersonalizationInfo() || Empty.Array;

    if (!itemPersonalization?.context || !personalizationData.length) {
        return null;
    }

    const { context } = itemPersonalization;

    const matchData = personalizationData.find(dataItem => dataItem.context === context);

    return matchData?.p13n || Empty.Object;
};

// Get the personalized item from the local storage, by matching the sid of the item with the sid of the personalization data.
export const personlizedItem = sid => {
    const { personalizationData } = getPersonalizationInfo();

    if (!personalizationData.length) {
        return null;
    }

    const matchData = personalizationData.find(dataItem => dataItem?.variationData?.sid === sid);

    if (!matchData?.variationData) {
        return null;
    }

    return { ...matchData?.variationData, p13n: matchData?.p13n };
};

export const getPersonalizationInfo = () => {
    const personalizationData = p13nUtils.getAllPersonalizedCache();
    const profileId = userUtils.getProfileId();
    const profileStatus = userUtils.getProfileStatus();
    const biAccountId = digitalData?.user?.[0].segment.biAccountId;
    const biStatus = userUtils.getBiStatus();

    return {
        biStatus,
        profileId,
        biAccountId,
        profileStatus,
        personalizationData
    };
};

const getGuardrailsObj = item => {
    const guardrails = item?.guardrails;
    const contextId = item?.sys?.id;

    if (!Array.isArray(guardrails) || !contextId) {
        return null;
    }

    const rail = guardrails.find(r => r?.bannerContextId === contextId);

    if (!rail) {
        return null;
    }

    return {
        type: rail?.type ?? null,
        bannerContextId: rail?.bannerContextId ?? null,
        priority: rail?.priority ?? null,
        multiplier: rail?.multiplier ?? null,
        startDate: rail?.startDate ?? null,
        endDate: rail?.endDate ?? null
    };
};

const mapComponentEventData = item => ({
    sid: item?.sid,
    isNBCEnabled: item?.isNBCEnabled,
    NBCSlotCounts: item?.NBCSlotCounts,
    clientRequestId: item?.clientRequestId,
    isTrendingEnabled: item?.isTrendingEnabled,
    bannerPoolId: item?.bannerPoolId,
    guardrails: getGuardrailsObj(item),
    timestamp: item?.timestamp,
    blPlacement: item?.blPlacement,
    parentContextId: item?.parentContextId
});

export const mountComponentEventData = ({ item, component }) => {
    const componentData = mapComponentEventData(item);

    const { personalization } = item;
    componentData.p13n = {};

    if (item?.sys?.publishedVersion) {
        componentData.publishedVersion = item.sys.publishedVersion;
    }

    if (item?.p13n?.context) {
        componentData.p13n = item.p13n;
    }

    if (personalization) {
        const personalizationLocalData = matchContexts(personalization);

        if (personalizationLocalData) {
            componentData.p13n = personalizationLocalData;
        }

        nextBestFlags.forEach(flag => {
            if (typeof personalization?.[flag] === 'boolean') {
                componentData[flag] = personalization[flag];
            }
        });

        const personalizationDataContent = p13nUtils.getPersonalizationCache(personalization.context);

        if (personalizationDataContent?.variationData?.sid) {
            componentData.sid = personalizationDataContent?.variationData?.sid;
            componentData.publishedVersion = personalizationDataContent?.variationData?.sys.publishedVersion;
        }
    }

    switch (component) {
        case BANNER_LIST: {
            break;
        }
        case BANNER: {
            break;
        }

        case RECAP:
        case PROMOTION_LIST: {
            componentData.title = item.title;

            break;
        }

        case REWARD_LIST:
        case PRODUCT_LIST: {
            delete componentData.sid;
            componentData.skuId = item.skuId;

            break;
        }

        case SOFT_LINKS: {
            componentData.label = item.label;
            componentData.type = item.type;

            break;
        }

        default: {
            break;
        }
    }

    return componentData;
};

export const getCmsContent = () => {
    const state = store.getState();
    const cmsContent = cmsComponentDataSelector(state);

    return cmsContent;
};

export const getCmsContentItems = () => {
    const cmsContent = getCmsContent();
    const cmsContentItems = [...cmsContent?.items, ...cmsContent?.innerData];

    return cmsContentItems;
};

export const isCmsPage = () => {
    const cmsContentItems = getCmsContentItems();

    return !!cmsContentItems.length;
};

/**
 * Mounts the event data for the component list, ex: BannerList, RecapList
 * @param {*} items
 * @param {*} eventName
 * @param {*} title
 * @param {*} sid
 * @param {*} clickedSid
 * @param {*} component example: 'BannerList' | 'Recap'
 * @returns
 */
export const mountCmsComponentEventData = ({
    items, eventName, title, sid, component, p13n
}) => {
    const bannersPersonalizedData = [];
    const { biStatus, profileId, biAccountId, profileStatus } = getPersonalizationInfo();

    const personalizationData = {
        title,
        biStatus,
        profileId,
        biAccountId,
        profileStatus,
        sid,
        contentType: component === PERSISTENT ? BANNER : component
    };

    const cmsContentItems = getCmsContentItems();
    const currentItem = cmsContentItems?.find(item => item.sid === sid);

    if (currentItem) {
        if (currentItem?.personalization) {
            const personalizationLocalData = matchContexts(currentItem.personalization);

            if (personalizationLocalData) {
                personalizationData.p13n = personalizationLocalData;
            }

            nextBestFlags.forEach(flag => {
                if (typeof currentItem?.personalization?.[flag] === 'boolean') {
                    personalizationData[flag] = currentItem.personalization[flag];
                }
            });
        } else {
            personalizationData.p13n = Empty.Object;
        }

        if (currentItem?.sys?.publishedVersion) {
            personalizationData.publishedVersion = currentItem.sys.publishedVersion;
        } else {
            personalizationData.publishedVersion = NA;
        }
    } else {
        personalizationData.p13n = Empty.Object;
        personalizationData.publishedVersion = NA;
    }

    items.forEach(_item => {
        const variantData = personlizedItem(_item?.sid || '');
        const itemMapping = mapComponentEventData(_item);
        const item = {
            ...itemMapping,
            ...(variantData || _item)
        };
        const componentData = mountComponentEventData({
            item,
            component
        });
        componentData.itemIndex = typeof _item?.itemIndex === 'number' ? _item.itemIndex + 1 : null;
        bannersPersonalizedData.push(componentData);
    });

    personalizationData.bannersPersonalizedData = bannersPersonalizedData;

    if (p13n) {
        personalizationData.p13n = p13n;
    }

    const eventData = {
        linkName: eventName,
        actionInfo: eventName,
        specificEventName: eventName,
        personalizationData,
        title: digitalData?.page?.attributes?.sephoraPageInfo?.pageName || '',
        page: getPageType() || ''
    };

    if (eventName === ITEM_CLICK) {
        if (window?.pageInfo?.path !== window?.previousPageInfo?.path) {
            window.previousPageInfo = window.pageInfo;
        }

        if (isHomepage) {
            const targetUrl = items?.[0]?.targetUrl ?? items?.[0]?.action?.targetUrl ?? '';
            mountComponentRef({ eventData, targetUrl });
        }
    }

    return eventData;
};

/**
 * Check if the component is a FB component to avoid kill switch
 * @param {*} component
 * @returns
 */
export const isValidCmsComponent = async () => {
    const { isEnabledForHomePage } = Sephora?.configurationSettings?.impressionTracker || Empty.Object;

    const { default: Location } = await import('utils/Location');

    isHomepage = Location.isHomepage();
    const isPDP = Location.isProductPage();

    const isHome = isHomepage && isEnabledForHomePage;
    const haveCmsContent = isCmsPage();

    if (isPDP) {
        return false;
    }

    if (haveCmsContent || isHome) {
        return true;
    }

    return false;
};
/**
 * Sends the event data for the component list, ex: BannerList, RecapList
 * @param {*} items
 * @param {*} eventName
 * @param {*} title
 * @param {*} sid
 * @param {*} clickedSid
 * @param {*} component example: 'BannerList' | 'Recap'
 * @param {*} p13n
 * @param {*} parentInfo - additional info to be sent in the event data
 * @returns
 */

export async function sendCmsComponentEvent({
    items, eventName, title, sid, clickedSid, component, p13n
}) {
    if (!eventName || typeof sid === 'undefined' || !component || !items?.length) {
        return null;
    }

    Events = require('utils/framework/Events').default;

    const eventData = mountCmsComponentEventData({
        items,
        eventName,
        title,
        sid,
        clickedSid,
        component,
        p13n
    });

    if (eventData) {
        if (component === PERSISTENT) {
            sendSOTP13nTrackingClickEvent({ eventData });

            return null;
        } else {
            if (eventName === ITEM_CLICK) {
                const shouldBeTriggerEvent = await isValidCmsComponent();

                if (shouldBeTriggerEvent) {
                    shouldSentEvent(eventData);

                    return null;
                }
            }

            Events.onLastLoadEvent(window, [PostLoad], async () => {
                const shouldBeTriggerEvent = await isValidCmsComponent();

                if (shouldBeTriggerEvent) {
                    sendSOTP13nTrackingEvent({ eventData });

                    return null;
                }

                return null;
            });

            return null;
        }
    }

    return null;
}
