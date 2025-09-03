import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import locationUtils from 'utils/Location';

const { isServiceLandingPage, isEventsLandingPage } = locationUtils;

const {
    EVENT_NAMES: { HAPPENING_AT_SEPHORA },
    SOT_LINK_TRACKING_EVENT,
    PAGE_TYPES,
    PAGE_DETAIL
} = anaConsts;

class ServicesBindings {
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

    static giftAService = () => {
        const { GIFT_A_SERVICE } = HAPPENING_AT_SEPHORA;
        ServicesBindings.triggerSOTAnalytics({
            eventName: GIFT_A_SERVICE
        });
    };

    static setPageLoadAnalytics() {
        if (isServiceLandingPage()) {
            digitalData.page.category.pageType = PAGE_TYPES.OLR;
            digitalData.page.pageInfo.pageName = PAGE_DETAIL.SERVICE_HOME;
        } else if (isEventsLandingPage()) {
            digitalData.page.category.pageType = PAGE_TYPES.OLR;
            digitalData.page.pageInfo.pageName = PAGE_DETAIL.EVENTS;
        }
    }

    static completeBooking({ activityId, activityType, storeId, reservationName }) {
        const { COMPLETE_BOOKING } = HAPPENING_AT_SEPHORA;
        ServicesBindings.triggerSOTAnalytics({
            eventName: COMPLETE_BOOKING,
            activityId,
            activityType,
            storeId,
            reservationName
        });
    }

    static itemClick({ activityId, activityType, storeId, reservationName }) {
        const { ITEM_CLICK } = HAPPENING_AT_SEPHORA;
        ServicesBindings.triggerSOTAnalytics({
            eventName: ITEM_CLICK,
            activityId,
            activityType,
            storeId,
            reservationName
        });
    }
}

export default ServicesBindings;
