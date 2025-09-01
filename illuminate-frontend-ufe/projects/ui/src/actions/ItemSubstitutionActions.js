import sdnApi from 'services/api/sdn';
import basketApi from 'services/api/basket';
import itemSubApi from 'services/api/itemSubstitution';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import Actions from 'Actions';
import * as TYPES from 'constants/actionTypes/itemSubstitution';
import { FULFILLMENT_TYPES } from 'constants/ItemSubstitution';
import itemSubstitutionUtils from 'utils/ItemSubstitution';
const { findSelectedProductId } = itemSubstitutionUtils;
import ItemSubstitutionModalBindings from 'analytics/bindingMethods/components/globalModals/itemSubstitutionModal/ItemSubstitutionModalBindings';

import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/ItemSubstitution/ItemSubstitutionModal/locales', 'ItemSubstitutionModal');

function showProductRecsLoading(show) {
    return {
        type: TYPES.SHOW_PRODUCT_RECS_LOADING,
        payload: show
    };
}

function getProductRecs(firstChoiceItem, payload, openModal = false) {
    return async dispatch => {
        try {
            if (openModal) {
                dispatch(showProductRecsLoading(true));
                dispatch(
                    Actions.showItemSubstitutionModal({
                        isOpen: true,
                        firstChoiceItem
                    })
                );
            }

            const recommendedItems = await sdnApi.getItemSubstitutionProductRecs(payload);

            // When API is called with a selectedProductId, that means we are
            // in edit mode and product should appear selected in the UI if
            // product data (productPage) is part of the response
            const selectedProductId = payload.selectedProductId ? findSelectedProductId(recommendedItems.recoProducts) : null;

            dispatch({
                type: TYPES.GET_PRODUCT_RECS,
                payload: {
                    recoProducts: recommendedItems?.recoProducts || [],
                    selectedProductId
                }
            });

            if (recommendedItems?.errorMessage) {
                const { errorKey = null, errorMessages = [] } = recommendedItems.errorMessage;
                const errorMessage = errorKey ? getText(errorKey) : errorMessages[0];
                ItemSubstitutionModalBindings.triggerErrorTracking(errorMessage);
                dispatch({
                    type: TYPES.SHOW_ADD_ITEM_ERROR,
                    payload: {
                        errorMessage: errorMessage
                    }
                });
            }
        } catch (error) {
            ItemSubstitutionModalBindings.triggerErrorTracking(error?.errorMessages[0]);
            dispatch({
                type: TYPES.SHOW_ERROR,
                payload: {
                    errorMessage: error?.errorMessages[0]
                }
            });
        } finally {
            dispatch(showProductRecsLoading(false));
        }
    };
}

function selectProductRec(product, showFooter, payload = {}) {
    const productRecId = product.productId;

    return async dispatch => {
        dispatch({
            type: TYPES.SELECT_PRODUCT_REC,
            payload: productRecId
        });

        const shouldGetProductDetails = !product.productPage && showFooter;

        if (shouldGetProductDetails) {
            try {
                const { productPage } = await itemSubApi.getProductDetailsWithStockAvailability(product.productId, product.currentSku.skuId, payload);

                dispatch({
                    type: TYPES.SET_PRODUCT_DETAILS,
                    payload: {
                        productRecId,
                        productPage
                    }
                });
            } catch (error) {
                //eslint-disable-next-line no-console
                console.error(error);
            }
        }
    };
}

function resetModal() {
    return {
        type: TYPES.RESET_ITEM_SUBSTITUTION_MODAL
    };
}

function updateCurrentSku(sku) {
    return {
        type: TYPES.UPDATE_CURRENT_SKU,
        payload: { sku }
    };
}

function addOrRemoveSubstituteItem(firstChoiceCommerceId, substituteSkuId, fulfillmentType) {
    return (dispatch, getState) => {
        const isAddSubstitute = !!substituteSkuId;
        const isBopis = fulfillmentType === FULFILLMENT_TYPES.PICK;
        const { basket } = getState();
        const fullItemList = isBopis ? basket.pickupBasket.items : basket.items;

        const newBasketItemList = fullItemList.map(item => {
            const isSelectedItem = item.commerceId === firstChoiceCommerceId;

            return {
                qty: item.qty,
                skuId: item.sku.skuId,
                productId: item.sku.productId,
                subSkuId: isSelectedItem ? substituteSkuId : item.substituteSku?.skuId
            };
        });

        return basketApi
            .updateBasket({
                orderId: 'current',
                skuList: newBasketItemList,
                isRopis: isBopis,
                isSameDay: !isBopis
            })
            .then(newBasket => {
                dispatch(RwdBasketActions.updateBasket({ newBasket }));

                if (isAddSubstitute) {
                    dispatch(Actions.showItemSubstitutionModal({ isOpen: false }));
                    dispatch(resetModal());
                }
            })
            .catch(error => {
                ItemSubstitutionModalBindings.triggerErrorTracking(error?.errorMessages[0]);
                const actionType = isAddSubstitute ? TYPES.SHOW_ADD_ITEM_ERROR : TYPES.SHOW_REMOVE_ITEM_ERROR;
                dispatch({
                    type: actionType,
                    payload: {
                        errorMessage: error?.errorMessages[0]
                    }
                });
            });
    };
}

export default {
    getProductRecs,
    selectProductRec,
    resetModal,
    updateCurrentSku,
    addOrRemoveSubstituteItem
};
