import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    EVENT_NAMES: { PROMO_NOTIFICATIONS },
    SOT_LINK_TRACKING_EVENT
} = anaConsts;
class PromoNotificationsBindings {
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

    static BBQSignIn = () => {
        const { BBQ_SIGN_IN } = PROMO_NOTIFICATIONS;
        PromoNotificationsBindings.triggerSOTAnalytics({
            eventName: BBQ_SIGN_IN
        });
    };

    static BBQJoinBi = () => {
        const { BBQ_JOIN_BI } = PROMO_NOTIFICATIONS;
        PromoNotificationsBindings.triggerSOTAnalytics({
            eventName: BBQ_JOIN_BI
        });
    };
}

export default PromoNotificationsBindings;
