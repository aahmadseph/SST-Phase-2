import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import * as rwdBasketConstants from 'constants/RwdBasket';
import store from 'store/Store';

const { updateSkuQuantity, deleteItem, moveItemToLoves, changeItemMethod } = RwdBasketActions;
const { dispatch } = store;
const {
    CHANGE_METHOD_TYPES: {
        BOPIS,
        STANDARD,
        ACTION: { SWITCH, UNDO }
    }
} = rwdBasketConstants;

export default ({ isBopis }) => ({
    onQtyUpdate: ({ commerceId, newQty, sku }) =>
        dispatch(
            updateSkuQuantity({
                sku,
                commerceId,
                newQty,
                isBopis
            })
        ),
    onDelete: ({ sku, productId, qty }) =>
        dispatch(
            deleteItem({
                sku,
                productId,
                qty,
                isBopis
            })
        ),
    onLoved: ({ skuId, productId, item }) =>
        dispatch(
            moveItemToLoves({
                item,
                skuId,
                productId,
                isBopis
            })
        ),
    onChangeMethod: ({
        skuId, qty, deliveryOption, productId, itemSwitchedFromBasket
    }) =>
        dispatch(
            changeItemMethod({
                skuId,
                qty,
                currentBasket: isBopis ? BOPIS : STANDARD,
                action: SWITCH,
                deliveryOption,
                productId,
                itemSwitchedToBasket: deliveryOption,
                itemSwitchedFromBasket
            })
        ),
    onUndoChangeMethod: ({
        skuId, qty, prevDeliveryOption, productId, switchedBasket
    }) =>
        dispatch(
            changeItemMethod({
                skuId,
                qty,
                currentBasket: switchedBasket,
                action: UNDO,
                deliveryOption: prevDeliveryOption,
                productId
            })
        )
});
