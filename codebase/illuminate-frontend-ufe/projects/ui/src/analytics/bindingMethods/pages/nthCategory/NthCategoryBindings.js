import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

const {
    EVENT_NAMES: { NTH_CATEGORY },
    SOT_LINK_TRACKING_EVENT
} = anaConsts;

class NthCategoryBindings {
    static triggerSOTAnalytics = ({ eventName, ...data }) => {
        const eventData = {
            data: {
                linkName: eventName,
                actionInfo: eventName,
                specificEventName: eventName,
                ...data
            }
        };

        processEvent.process(SOT_LINK_TRACKING_EVENT, eventData);
    };

    static clearAllChiclets = () => {
        const { CLEAR_ALL } = NTH_CATEGORY;
        NthCategoryBindings.triggerSOTAnalytics({
            eventName: CLEAR_ALL
        });
    };

    static selectFilter = ({ tappedChiclets }) => {
        const { SELECT_FILTER } = NTH_CATEGORY;
        NthCategoryBindings.triggerSOTAnalytics({
            tappedChiclets,
            eventName: SELECT_FILTER
        });
    };
}

export default NthCategoryBindings;
