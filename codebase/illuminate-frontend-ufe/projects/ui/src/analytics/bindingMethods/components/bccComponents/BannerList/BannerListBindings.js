import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    EVENT_NAMES: { BANNER },
    SOT_LINK_TRACKING_EVENT,
    SOT_P13N_TRACKING_EVENT
} = anaConsts;

class BannerListBindings {
    static trackSotP13Nevent = eventData => {
        if (Sephora?.configurationSettings?.impressionTracker?.isEnabledForHomePage) {
            processEvent.process(SOT_P13N_TRACKING_EVENT, { data: eventData });
        }
    };

    static triggerSOTAnalytics = ({ userData, eventName }) => {
        const eventData = {
            data: {
                linkName: eventName,
                actionInfo: eventName,
                specificEventName: eventName,
                personalizationData: userData
            }
        };

        processEvent.process(SOT_LINK_TRACKING_EVENT, eventData);
    };

    static bannerItemsImpression = userData => {
        const { BANNER_IMPRESSION } = BANNER;
        BannerListBindings.triggerSOTAnalytics({ userData, eventName: BANNER_IMPRESSION });
    };

    static bannerProgressiveItemsImpression = BannerListBindings.trackSotP13Nevent;

    static bannerItemsClick = BannerListBindings.trackSotP13Nevent;

    static bannerPersonalizedClick = userData => {
        const { PERSONALIZED_BANNER_CLICK } = BANNER;
        BannerListBindings.triggerSOTAnalytics({ userData, eventName: PERSONALIZED_BANNER_CLICK });
    };
}

export default BannerListBindings;
