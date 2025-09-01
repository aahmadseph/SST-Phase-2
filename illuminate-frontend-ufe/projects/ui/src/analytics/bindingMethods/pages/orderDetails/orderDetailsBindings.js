import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import skuUtils from 'utils/Sku';
import orderBindingUtils from 'analytics/bindingMethods/pages/orderBindingUtils/orderBindingUtils';
import anaUtils from 'analytics/utils';

const {
    EVENT_NAMES: {
        ORDER_DETAILS,
        ORDER_DETAILS: { CURBSIDE, SMS_MODAL }
    },
    PAGE_TYPES: { GENERIC_MODAL },
    ASYNC_PAGE_LOAD,
    SOT_LINK_TRACKING_EVENT,
    LINK_TRACKING_EVENT
} = anaConsts;

class OrderDetailsSOTBindings {
    static STORE_STATUSES = {
        OPEN: 'open',
        CLOSED: 'closed',
        UNAVAILABLE: 'unavailable'
    };

    static triggerSOTAsyncAnalytics = ({ eventType = ASYNC_PAGE_LOAD, ...data }) => {
        const eventData = {
            data: {
                ...data
            }
        };

        processEvent.process(eventType, eventData);
    };

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

    static returnLinkClick = ({ shippingMethod }) => {
        const eventData = {
            data: {
                actionInfo: `${shippingMethod}:start a return`
            }
        };

        processEvent.process(LINK_TRACKING_EVENT, eventData);
    };

    static cancelOrderModal = () => {
        const { CANCEL_ORDER_MODAL, REASONS } = ORDER_DETAILS;
        OrderDetailsSOTBindings.triggerSOTAsyncAnalytics({
            pageType: CANCEL_ORDER_MODAL,
            pageTypeDetail: REASONS
        });
    };

    static curbsidePickupCheckInModal = ({ storeStatus, activeScreenIndex }) => {
        const {
            PICKUP, HOURS_CLOSED, HERE_FOR_CURBSIDE, VERIFICATION, DETAILS
        } = CURBSIDE;
        digitalData.page.category.pageType = CURBSIDE.CURBSIDE;
        digitalData.page.attributes.world = digitalData.page.attributes.world || 'n/a';

        const world = digitalData.page.attributes.world;
        const pageType = digitalData.page.category.pageType;
        let pageName = '';
        const data = {};

        switch (storeStatus) {
            case OrderDetailsSOTBindings.STORE_STATUSES.CLOSED:
                digitalData.page.pageInfo.pageName = `${PICKUP} ${HOURS_CLOSED}`;

                break;
            case OrderDetailsSOTBindings.STORE_STATUSES.OPEN:
                if (activeScreenIndex === 0) {
                    digitalData.page.pageInfo.pageName = PICKUP;

                    data.linkData = `${CURBSIDE.CURBSIDE}:${HERE_FOR_CURBSIDE}`;
                    data.pageTypeDetail = VERIFICATION;
                } else if (activeScreenIndex === 1) {
                    digitalData.page.pageInfo.pageName = DETAILS;
                    data.pageTypeDetail = DETAILS;
                }

                break;
            case OrderDetailsSOTBindings.STORE_STATUSES.UNAVAILABLE:
                digitalData.page.pageInfo.pageName = CURBSIDE.ORDER_NOT_AVAILABLE;

                break;
            default:
                return;
        }

        pageName = digitalData.page.pageInfo.pageName;

        data.pageName = `${pageType}:${pageName}:${world}:*`;
        data.pageType = digitalData.page.category.pageType;
        data.pageDetail = digitalData.page.pageInfo.pageName;

        OrderDetailsSOTBindings.triggerSOTAsyncAnalytics(data);
    };

    static curbsideModalSuccess = () => {
        const { SUCCESS } = CURBSIDE;
        digitalData.page.pageInfo.pageName = SUCCESS;
        const world = digitalData.page.attributes.world;
        const pageType = digitalData.page.category.pageType;

        OrderDetailsSOTBindings.triggerSOTAsyncAnalytics({
            pageName: `${pageType}:${SUCCESS}:${world}:*`,
            pageType: CURBSIDE.CURBSIDE,
            pageTypeDetail: SUCCESS
        });
    };

    static hereForCurbsideClick = ({ orderId }) => {
        const { HERE_FOR_CURBSIDE_CLICK } = CURBSIDE;
        OrderDetailsSOTBindings.triggerSOTAnalytics({
            eventName: HERE_FOR_CURBSIDE_CLICK,
            orderId
        });
    };

    static SMSSignupModal = ({ orderId, orderShippingMethod }) => {
        const { SING_UP } = SMS_MODAL;
        OrderDetailsSOTBindings.triggerSOTAsyncAnalytics({
            linkData: `${GENERIC_MODAL}:${SING_UP}`,
            pageName: `${GENERIC_MODAL}:${SING_UP}:n/a:*`,
            pageDetail: SING_UP,
            pageType: GENERIC_MODAL,
            orderId,
            orderShippingMethod
        });
    };

    static SMSSignupConfirmation = ({ orderId, orderShippingMethod }) => {
        const { CONFIRMATION } = SMS_MODAL;
        OrderDetailsSOTBindings.triggerSOTAsyncAnalytics({
            linkData: `${GENERIC_MODAL}:${CONFIRMATION}`,
            pageName: `${GENERIC_MODAL}}:${CONFIRMATION}:n/a:*`,
            pageDetail: CONFIRMATION,
            pageType: GENERIC_MODAL,
            orderId,
            orderShippingMethod
        });
    };

    static SMSButtonClick = () => {
        const { SMS_BUTTON_CLICK } = SMS_MODAL;
        OrderDetailsSOTBindings.triggerSOTAnalytics({
            eventName: SMS_BUTTON_CLICK
        });
    };

    static getSubstituteProductString = ({ item }) => {
        // Do not add substitute product string for rewards, samples, giftcards...
        if (skuUtils.isHardGood(item.sku, false)) {
            const fulfilledItem = item.isSubstituted ? item.substituteSku : item;
            const substituteSkuId = item.substituteSku ? item.substituteSku?.sku?.skuId : 'do not substitute';
            const fulfilledItemSkuId = fulfilledItem.sku.skuId;
            const skuId = item.sku.skuId;

            return `eVar26=${fulfilledItemSkuId}` + `|eVar131=${substituteSkuId}|eVar132=${skuId}`;
        } else {
            return `eVar26=${item?.sku?.skuId}`;
        }
    };

    static buildProductString = ({ orderItems, basket, status }) => {
        const productString = orderItems.map(item => {
            const fulfilledItem = OrderDetailsSOTBindings.getFulfilledItem({ item });
            const fulfilledItemSkuId = fulfilledItem.sku.skuId;
            const events = OrderDetailsSOTBindings.getEvents({ item, status });
            const quantity = item.qty;
            const price = orderBindingUtils.getPriceForProductString(item);
            const evars = this.buildEvarsForProductString({ sku: fulfilledItem.sku, basket, item });

            return `;${fulfilledItemSkuId};${quantity};${price};${events};${evars}`;
        });

        return productString;
    };

    static buildEvarsForProductString = ({ sku, basket, item }) => {
        const substituteEvars = OrderDetailsSOTBindings.getSubstituteProductString({ item });
        const fulfillmentType = anaUtils.getFulfillmentType({ sku, basket });
        const deliveryEvars = `eVar133=${fulfillmentType?.toLowerCase()}`;

        return `${substituteEvars}|${deliveryEvars}`;
    };

    static getFulfilledItem = ({ item }) => {
        // If item.isSubstituted is true, there should come a substituteSku. However, in OXS, sometimes
        // the substituteSku is not present when the order has been canceled.
        const fulfilledItem = item.isSubstituted && item.substituteSku ? item.substituteSku : item;

        return fulfilledItem;
    };

    static getEvents = ({ item, status }) => {
        let events = '';
        const isFirstChoiceCancelled = item.status === 'Canceled';

        // In OMCON-1577, OXS was supposed to send us the status of the substituteSku. However, it was not
        // implemented so this is a hack, since not all orders with substitutions that are canceled, are
        // canceled because both items (first choice and substitute) are out of stock.
        // We also cannot use item.substituteSku.isOutOfStock because it is not reliable (although it should be).
        // It should also have been fixed in OMCON-3279 but it hasn't, so we also add this check
        // status === 'Canceled' so analytics has some data at least.
        const isSubItemCancelled = item.substituteSku?.status === 'Canceled' || status === 'Canceled';

        if (isFirstChoiceCancelled && isSubItemCancelled) {
            digitalData.page.attributes.tempProps.isItemAndSubItemCanceled = true;
            events = `${anaConsts.Event.CANCELED_ITEM_AND_SUB_ITEM}=1;`;
        } else if (isFirstChoiceCancelled && item.isSubstituted && !isSubItemCancelled) {
            digitalData.page.attributes.tempProps.isItemSubstituted = true;
            events = `${anaConsts.Event.ITEM_SUBSTITUTED}=1;`;
        }

        return events;
    };
}

export default OrderDetailsSOTBindings;
