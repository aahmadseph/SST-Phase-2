import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import Location from 'utils/Location';
import analyticsUtils from 'analytics/utils';
import basketUtils from 'utils/Basket';
import { DELIVERY_METHOD_TYPES } from 'constants/RwdBasket';
import skuUtils from 'utils/Sku';

const {
    EVENT_NAMES: { BASKET },
    PAGE_DETAIL: { APPLY_POINTS },
    CONTEXT: { BASKET_PAGE, CHECKOUT_PAGE },
    ASYNC_PAGE_LOAD,
    SOT_LINK_TRACKING_EVENT
} = anaConsts;

class BasketBindings {
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

    static triggerSOTAsyncAnalytics = eventData => {
        processEvent.process(ASYNC_PAGE_LOAD, eventData);
    };

    static checkout = ({ isBopis }) => {
        const eventName = isBopis ? BASKET.CHECKOUT_BOPIS : BASKET.CHECKOUT_STANDARD;
        const items = isBopis ? basketUtils.getBopisBasketItems() : basketUtils.getBasketItems();

        const data = {
            skuIds: analyticsUtils.buildProductSkusOnly(items),
            shippingMethod: isBopis ? DELIVERY_METHOD_TYPES.BOPIS : DELIVERY_METHOD_TYPES.STANDARD,
            listSubTotal: basketUtils.getSubtotal(true, isBopis)
        };

        BasketBindings.triggerSOTAnalytics({
            eventName,
            ...data
        });
    };

    static expandPointsSection = () => {
        let location;

        if (Location.isCheckout()) {
            location = CHECKOUT_PAGE;
        } else {
            location = BASKET_PAGE;
        }

        const eventData = {
            data: {
                pageName: `${location}:${APPLY_POINTS}:n/a:*`,
                pageType: location,
                pageDetail: APPLY_POINTS
            }
        };

        BasketBindings.triggerSOTAsyncAnalytics(eventData);
    };

    static multiPromo = ({ location, eventStrings }) => {
        const { MULTI_PROMO_MODAL } = BASKET;
        const eventData = {
            data: {
                eventStrings,
                pageName: `${location}:${MULTI_PROMO_MODAL}:n/a:*`,
                pageType: location,
                pageDetail: MULTI_PROMO_MODAL
            }
        };

        BasketBindings.triggerSOTAsyncAnalytics(eventData);
    };

    static triggerNavigationAnalytics = ({ prop55, pageDetail, items, shippingMethod = 'ShipToHome' }) => {
        digitalData.page.attributes.previousPageData.pageName = digitalData.page.attributes.sephoraPageInfo.pageName;
        digitalData.page.attributes.previousPageData.linkData = '';

        const pageType = anaConsts.PAGE_TYPES.BASKET;
        const name = `${pageType}:${pageDetail}:n/a:*`;
        const eventData = {
            pageName: name,
            pageType: pageType,
            pageDetail: pageDetail,
            previousPageName: digitalData.page.attributes.sephoraPageInfo.pageName,
            linkData: prop55,
            eventStrings: [anaConsts.Event.SC_VIEW],
            productStrings: analyticsUtils.buildProductStrings({ products: items }),
            skuIds: analyticsUtils.buildProductSkusOnly(items),
            shippingMethod: shippingMethod,
            listSubTotal: basketUtils.getSubtotal(true, shippingMethod !== 'ShipToHome')
        };
        digitalData.page.attributes.sephoraPageInfo.pageName = name;

        analyticsUtils.setNextPageData({
            pageName: name,
            linkData: ''
        });

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: eventData });
    };

    static triggerRewardErrorAnalytics = (products, errorMessages) => {
        const rewardProducts = products.filter(item => skuUtils.isBiReward(item.sku));
        const productStrings = rewardProducts.map(item => `;${item.sku.productId};;;;eVar26=${item.sku.productId}`).toString();

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                productStrings,
                errorMessages,
                fieldErrors: 'reward bazaar'
            }
        });
    };
}

export default BasketBindings;
