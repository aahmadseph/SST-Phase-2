import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    EVENT_NAMES: { BANNER },
    SOT_P13N_TRACKING_EVENT
} = anaConsts;

class PersistentBannerBindings {
    static triggerSOTAnalytics = ({ userData, eventName }) => {
        const eventData = {
            data: {
                linkName: eventName,
                actionInfo: eventName,
                specificEventName: eventName,
                personalizationData: userData
            }
        };

        processEvent.process(SOT_P13N_TRACKING_EVENT, eventData);
    };

    static bannerItemsImpression = userData => {
        const { BANNER_IMPRESSION } = BANNER;
        PersistentBannerBindings.triggerSOTAnalytics({ userData, eventName: BANNER_IMPRESSION });
    };

    static bannerPersonalizedClick = userData => {
        const { PERSONALIZED_BANNER_CLICK } = BANNER;
        PersistentBannerBindings.triggerSOTAnalytics({ userData, eventName: PERSONALIZED_BANNER_CLICK });
    };
}

export default PersistentBannerBindings;
