import Actions from 'Actions';
import checkoutApi from 'services/api/checkout';
import selfReturnApi from 'services/api/selfReturn';
import OrderActions from 'actions/OrderActions';
import UrlUtils from 'utils/Url';
import orderUtils from 'utils/Order';
import skuUtils from 'utils/Sku';
import decorators from 'utils/decorators';
import replacementOrderBindings from 'analytics/bindingMethods/pages/replacementOrder/replacementOrderBindings';
import anaConsts from 'analytics/constants';
const MAX_SAMPLES_ALLOWED = 2;
const NCR_DELAY_MS = 4000;
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import selfReturnUtils from 'utils/SelfReturn';

import languageLocaleUtils from 'utils/LanguageLocale';
const { getLocaleResourceFile } = languageLocaleUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/ReplacementOrder/locales', 'ReplacementOrder');

const { confirmReturnOrder, addSamplesToReplacementOrder, deleteItemFromOrder } = selfReturnApi;

const getReplacementOrderDetails = (orderId, originalOrderId) => dispatch => {
    decorators
        .withInterstice(checkoutApi.getOrderDetails)(orderId, '', true, false, originalOrderId)
        .then(data => {
            dispatch(OrderActions.updateOrder(data));
        })
        // eslint-disable-next-line no-console
        .catch(console.error);
};

const getQueryParam = param => {
    const paramArray = UrlUtils.getParamsByName(param);
    const orderId = Array.isArray(paramArray) && paramArray.length > 0 ? paramArray[0] : null;

    return orderId;
};

const submitReplacementOrder = (originalOrderId, replacementOrderId) => dispatch => {
    const startTime = new Date().getTime();
    dispatch(Actions.showInterstice(true));

    replacementOrderBindings.trackingEvent(
        {
            pageName: anaConsts.REPLACEMENT_ORDER.SPINNER_PAGE_ENTER,
            pageType: anaConsts.PAGE_TYPES.REPLACEMENT_ORDER,
            pageDetail: anaConsts.REPLACEMENT_ORDER.SPINNER_PAGE,
            originalOrderId,
            replacementOrderId
        },
        'asyncPageLoad'
    );

    const payload = {
        originalOrderId,
        replacementOrderId
    };

    // This function delays the return statement for a minimum of NCR_DELAY_MS
    return confirmReturnOrder(payload)
        .then(data => {
            const elapsedTime = new Date().getTime() - startTime;

            const callback = () => {
                dispatch(Actions.showInterstice(false));

                return data;
            };

            if (elapsedTime > NCR_DELAY_MS) {
                return callback();
            } else {
                const pendingTime = NCR_DELAY_MS - elapsedTime;

                return new Promise(resolve => {
                    setTimeout(() => resolve(callback()), pendingTime);
                });
            }
        })
        .catch(error => {
            dispatch(Actions.showInterstice(false));
            throw error;
        });
};

const addSampleToOrder = (samplesList, orderId) => dispatch => {
    return (
        decorators
            .withInterstice(addSamplesToReplacementOrder)({ sampleSkuIdList: samplesList, replacementOrderId: orderId })
            .then(() => {
                const originalOrderId = selfReturnUtils.getOriginalOrderId();
                dispatch(getReplacementOrderDetails(orderId, originalOrderId));
            })
            // eslint-disable-next-line no-console
            .catch(() => {
                const { originatingOrderId } = Storage.local.getItem(LOCAL_STORAGE.NCR_ORDER) || {};
                dispatch(showSessionExpiredModal(originatingOrderId));
            })
    );
};

const deleteItem = (orderId, skuId) => dispatch => {
    return (
        decorators
            .withInterstice(deleteItemFromOrder)(orderId, skuId)
            .then(() => {
                const originalOrderId = selfReturnUtils.getOriginalOrderId();
                dispatch(getReplacementOrderDetails(orderId, originalOrderId));
            })
            // eslint-disable-next-line no-console
            .catch(() => {
                const { originatingOrderId } = Storage.local.getItem(LOCAL_STORAGE.NCR_ORDER) || {};
                dispatch(showSessionExpiredModal(originatingOrderId));
            })
    );
};

const addRemoveSample = sku => dispatch => {
    const orderId = orderUtils.getOrderId();
    const samplesInOrder = orderUtils.getItemsByType(skuUtils.skuTypes.SAMPLE).map(sample => sample.sku.skuId) || [];

    if (orderUtils.isItemInOrder(sku.skuId)) {
        if (samplesInOrder.length === 1) {
            dispatch(deleteItem(orderId, sku.skuId));
        } else {
            const itemToRemove = samplesInOrder.indexOf(sku.skuId);
            samplesInOrder.splice(itemToRemove, 1);
            dispatch(addSampleToOrder(samplesInOrder, orderId));
        }
    } else if (samplesInOrder.length < MAX_SAMPLES_ALLOWED) {
        samplesInOrder.push(sku.skuId);
        dispatch(addSampleToOrder(samplesInOrder, orderId));
    }
};

const showSessionExpiredModal = (orderId = null) => {
    const redirect = () => {
        if (orderId) {
            UrlUtils.redirectTo(`/profile/orderdetail/${orderId}`);
        } else {
            UrlUtils.redirectTo('/profile/MyAccount/Orders');
        }
    };

    return Actions.showInfoModal({
        isOpen: true,
        title: getText('sessionExpired'),
        message: getText('sessionExpiredMessage'),
        buttonText: getText('ok'),
        showCloseButton: true,
        callback: redirect,
        cancelCallback: redirect
    });
};

const updateNcrShippingAddress = payload => dispatch => {
    return (
        decorators
            .withInterstice(selfReturnApi.updateAddress)(payload)
            .then(data => {
                return dispatch(OrderActions.setLastUsedShippingAddressId(data.addressId));
            })
            // eslint-disable-next-line no-console
            .catch(console.error)
    );
};

export default {
    showSessionExpiredModal,
    getReplacementOrderDetails,
    getQueryParam,
    submitReplacementOrder,
    addRemoveSample,
    deleteItem,
    updateNcrShippingAddress,
    MAX_SAMPLES_ALLOWED
};
