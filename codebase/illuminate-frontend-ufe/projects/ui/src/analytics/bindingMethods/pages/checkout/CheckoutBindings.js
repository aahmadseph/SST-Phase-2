import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    EVENT_NAMES: { CHECKOUT },
    SOT_LINK_TRACKING_EVENT,
    ASYNC_PAGE_LOAD
} = anaConsts;

class CheckoutBindings {
    static triggerSOTAnalytics = ({ eventName, eventType = SOT_LINK_TRACKING_EVENT, ...data }) => {
        const eventData = {
            data: {
                linkName: eventName,
                actionInfo: eventName,
                specificEventName: eventName,
                ...data
            }
        };

        processEvent.process(eventType, eventData);
    };

    static birthdayGiftRedemption = ({ skuId, productId, brandName, productName }) => {
        const { BIRTHDAY_GIFT_REDEMPTION } = CHECKOUT;
        CheckoutBindings.triggerSOTAnalytics({
            eventName: BIRTHDAY_GIFT_REDEMPTION,
            skuId,
            productId,
            brandName,
            productName
        });
    };

    static accessPointClick = () => {
        const { ACCESS_POINT, TYPE_FEDEX } = CHECKOUT;
        CheckoutBindings.triggerSOTAnalytics({
            eventName: ACCESS_POINT,
            type: TYPE_FEDEX
        });
    };

    static unavailableAccessPointSelection = () => {
        const { UNAVAILABLE_ACCESS_POINT, TYPE_FEDEX } = CHECKOUT;
        CheckoutBindings.triggerSOTAnalytics({
            eventName: UNAVAILABLE_ACCESS_POINT,
            type: TYPE_FEDEX,
            eventType: ASYNC_PAGE_LOAD,
            morePageInfo: {
                oneTagPageName: `fedex:${UNAVAILABLE_ACCESS_POINT}:n/a:*`,
                oneTagPageType: 'fedex',
                oneTagPageDetail: UNAVAILABLE_ACCESS_POINT
            }
        });
    };

    static placeBOPISOrder = () => {
        const { PLACE_BOPIS_ORDER } = CHECKOUT;
        CheckoutBindings.triggerSOTAnalytics({
            eventName: PLACE_BOPIS_ORDER
        });
    };

    static placeStandardOrder = () => {
        const { PLACE_STANDARD_ORDER } = CHECKOUT;
        CheckoutBindings.triggerSOTAnalytics({
            eventName: PLACE_STANDARD_ORDER
        });
    };

    static checkoutPayPalClick = () => {
        const { PAYPAL_CLICK } = CHECKOUT;
        CheckoutBindings.triggerSOTAnalytics({
            eventName: PAYPAL_CLICK
        });
    };
}

export default CheckoutBindings;
