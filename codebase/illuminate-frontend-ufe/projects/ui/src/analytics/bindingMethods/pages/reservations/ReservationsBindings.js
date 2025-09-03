import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

const {
    EVENT_NAMES: { RESERVATIONS },
    SOT_LINK_TRACKING_EVENT
} = anaConsts;

class ReservationsBindings {
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

    static reservationClick = ({ reservationName, storeId, activityId, activityType }) => {
        const { RESERVATION_CLICK } = RESERVATIONS;
        ReservationsBindings.triggerSOTAnalytics({
            eventName: RESERVATION_CLICK,
            reservationName,
            storeId,
            activityId,
            activityType
        });
    };

    static reservationCancel = ({ reservationName, storeId, activityId, activityType }) => {
        const { CANCEL_BOOKING } = RESERVATIONS;
        ReservationsBindings.triggerSOTAnalytics({
            eventName: CANCEL_BOOKING,
            reservationName,
            storeId,
            activityId,
            activityType
        });
    };
}

export default ReservationsBindings;
