import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    EVENT_NAMES: {
        RICH_PROFILE: { CREDIT_CARDS }
    },
    SOT_LINK_TRACKING_EVENT
} = anaConsts;

class CreditCardsBindings {
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

    static manageMyCard = () => {
        const { MANAGE_MY_CARD } = CREDIT_CARDS;
        CreditCardsBindings.triggerSOTAnalytics({
            eventName: MANAGE_MY_CARD
        });
    };
}

export default CreditCardsBindings;
