import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    EVENT_NAMES: { REWARDS },
    SOT_LINK_TRACKING_EVENT
} = anaConsts;

class RewardsBindings {
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

    static applyCreditCardRewards = ({ promoId }) => {
        const { APPLY_CREDIT_CARD } = REWARDS;
        RewardsBindings.triggerSOTAnalytics({
            eventName: APPLY_CREDIT_CARD,
            promoId: promoId ? promoId.toLowerCase() : ''
        });
    };
}

export default RewardsBindings;
