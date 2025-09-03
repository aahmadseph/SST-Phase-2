import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    EVENT_NAMES: { PRODUCT_PAGE },
    SOT_LINK_TRACKING_EVENT,
    ASYNC_PAGE_LOAD,
    CONTEXT
} = anaConsts;

class ProductPageBindings {
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

    static triggerSOTAsyncAnalytics = ({ ...data }) => {
        const eventData = {
            data
        };

        processEvent.process(ASYNC_PAGE_LOAD, eventData);
    };

    static productQuantityChange = ({ skuId, quantity }) => {
        const { QUANTITY_CHANGE } = PRODUCT_PAGE;
        ProductPageBindings.triggerSOTAnalytics({
            eventName: QUANTITY_CHANGE,
            skuId,
            quantity
        });
    };

    static sameDayDeliveryZipCodeChangeInStock = ({ skuId, zipcode }) => {
        const { SDD_ZIPCODE_CHANGE } = PRODUCT_PAGE;
        ProductPageBindings.triggerSOTAnalytics({
            eventName: SDD_ZIPCODE_CHANGE,
            skuId,
            zipcode
        });
    };

    static sameDayDeliveryZipCodeChangeOutOfStock = ({ skuId, zipcode }) => {
        const { SDD_ZIPCODE_CHANGE_OOS } = PRODUCT_PAGE;
        ProductPageBindings.triggerSOTAnalytics({
            eventName: SDD_ZIPCODE_CHANGE_OOS,
            skuId,
            zipcode
        });
    };

    static shopAll = ({ brandId, productId }) => {
        const { SHOP_ALL } = PRODUCT_PAGE;
        ProductPageBindings.triggerSOTAnalytics({
            eventName: SHOP_ALL,
            brandId,
            productId
        });
    };

    static reviewImageClick = ({ selectedReviewId, productId }) => {
        const { REVIEWS, IMAGE_FROM_REVIEWS } = PRODUCT_PAGE;
        ProductPageBindings.triggerSOTAsyncAnalytics({
            pageDetail: IMAGE_FROM_REVIEWS,
            pageName: `${REVIEWS}:${IMAGE_FROM_REVIEWS}:n/a:*`,
            pageType: REVIEWS,
            selectedReviewId,
            productId
        });
    };

    static viewBasketAndCheckout = ({ shippingMethod }) => {
        const { VIEW_BASKET_AND_CHECKOUT } = PRODUCT_PAGE;
        ProductPageBindings.triggerSOTAnalytics({
            eventName: VIEW_BASKET_AND_CHECKOUT,
            shippingMethod: shippingMethod.toLowerCase()
        });
    };

    static highlyRatedForClick() {
        const { REVIEWS, HIGHLY_RATED } = PRODUCT_PAGE;

        ProductPageBindings.triggerSOTAsyncAnalytics({
            pageDetail: HIGHLY_RATED,
            pageName: `${REVIEWS}:${HIGHLY_RATED}:n/a:*`,
            pageType: REVIEWS
        });
    }

    static swatchChange({
        skuId,
        quantity,
        isOnlineOnly,
        listPrice,
        isSameDayEligibleSku,
        productId,
        storeId,
        topCategory,
        brandName,
        isOutOfStock,
        basketType,
        shippingMethod,
        customerZipCode
    }) {
        const { SWATCH_CHANGE } = PRODUCT_PAGE;

        ProductPageBindings.triggerSOTAnalytics({
            eventName: SWATCH_CHANGE,
            skuId,
            quantity,
            isOnlineOnly,
            listPrice,
            isSameDayEligibleSku,
            productId,
            storeId,
            topCategory,
            brandName,
            isOutOfStock,
            basketType,
            shippingMethod,
            customerZipCode
        });
    }

    static addAllToBasket({ skus }) {
        const { ADD_ALL_TO_BASKET } = PRODUCT_PAGE;
        let skuIds = '';
        let productIds = '';

        skus.forEach((item, index) => {
            skuIds += item.skuId;
            productIds += item.productId;

            if (index < skus.length - 1) {
                skuIds += ';';
                productIds += ';';
            }
        });

        ProductPageBindings.triggerSOTAnalytics({
            eventName: ADD_ALL_TO_BASKET,
            skuIds,
            productIds
        });
    }

    static seeDetails() {
        const { CREDIT_CARD_SEE_DETAILS, SEE_DETAILS } = PRODUCT_PAGE;
        const { PRODUCTPAGE } = CONTEXT;
        ProductPageBindings.triggerSOTAnalytics({
            linkName: CREDIT_CARD_SEE_DETAILS,
            actionInfo: CREDIT_CARD_SEE_DETAILS,
            pageType: PRODUCTPAGE,
            sectionTitle: SEE_DETAILS
        });
    }
}

export default ProductPageBindings;
