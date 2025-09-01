import skuHelpers from 'utils/skuHelpers';
import deepExtend from 'utils/deepExtend';
import UtilActions from 'utils/redux/Actions';
import addToCartPixels from 'analytics/addToCartPixels';

function updateMsgPromo(sku) {
    return (dispatch, getState) => {
        const promoObject = deepExtend({}, getState().promo);
        let msgPromosSkuList = promoObject.msgPromosSkuList;
        const { skuId, productName, brandName, displayName } = sku;
        const googleAnalyticsChangedBasketData = {
            id: skuId,
            name: productName,
            brand: brandName,
            variant: displayName,
            quantity: 1,
            price: '0.00'
        };

        if (!skuHelpers.isInMsgPromoSkuList(sku.skuId)) {
            msgPromosSkuList.push({
                skuId: sku.skuId,
                couponCode: sku.couponCode
            });
            addToCartPixels.googleAnalyticsAddToBasketEvent(googleAnalyticsChangedBasketData);
        } else {
            msgPromosSkuList = msgPromosSkuList.filter(elem => elem.skuId !== sku.skuId);
            addToCartPixels.googleAnalyticsRemoveFromBasketEvent(googleAnalyticsChangedBasketData);
        }

        dispatch(UtilActions.merge('promo', 'msgPromosSkuList', msgPromosSkuList));
        dispatch(UtilActions.merge('promo', 'promoError', null));
    };
}

function removeMsgPromosByCode(couponCode) {
    return (dispatch, getState) => {
        const promoObject = deepExtend({}, getState().promo);
        const msgPromosSkuList = promoObject.msgPromosSkuList.filter(elem => elem.couponCode.toUpperCase() !== couponCode.toUpperCase());

        dispatch(UtilActions.merge('promo', 'msgPromosSkuList', msgPromosSkuList));
        dispatch(UtilActions.merge('promo', 'promoError', null));
    };
}

export default {
    updateMsgPromo,
    removeMsgPromosByCode
};
