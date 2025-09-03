/* eslint-disable no-use-before-define */
import rwdBasket from 'reducers/rwdBasket';
import store from 'store/Store';
import userUtils from 'utils/User';

import {
    ROOT_BASKET_TYPES,
    MAIN_BASKET_TYPES,
    CHANGE_METHOD_TYPES,
    CXS_INFO_MODAL_KEYS,
    CXS_MODAL_KEYS,
    CXS_ZONE_KEYS,
    BASKET_LEVEL_MESSAGES_CONTEXTS,
    DELIVERY_METHOD_TYPES,
    RWD_CHECKOUT_ERRORS,
    BASKET_TYPES
} from 'constants/RwdBasket';
import { SHOW_SPA_PAGE_LOAD_PROGRESS } from 'constants/actionTypes/page';

import LoveActions from 'actions/LoveActions';
import homepageActions from 'actions/HomepageActions';
import { updateBasket } from 'actions/RwdBasketActions';
import rewardActions from 'actions/RewardActions';
import Actions from 'Actions';

import basketApi from 'services/api/basket';
import { getContent } from 'services/api/Content/getContent';
import p13nApi from 'services/api/p13n';

import auth from 'utils/Authentication';
import checkoutUtils from 'utils/Checkout';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import UtilActions from 'utils/redux/Actions';
import rwdBasketModalUtils from 'utils/RwdBasketModals';
import skuUtils from 'utils/Sku';
import { isNonEmptyString } from 'utils/functions/isString';
import ErrorsUtils from 'utils/Errors';
import promoUtils from 'utils/Promos';
import cookieUtils from 'utils/Cookies';
import p13nUtils from 'utils/localStorage/P13n';
import localeUtils from 'utils/LanguageLocale';
import basketUtils from 'utils/Basket';

import anaConsts from 'analytics/constants';
import removeFromBasketEvent from 'analytics/bindings/pages/all/removeFromBasketEvent';
import moveToLoveEvent from 'analytics/bindings/pages/all/moveToLoveEvent';
import anaUtils from 'analytics/utils';
import BasketBindings from 'analytics/bindingMethods/pages/basket/BasketBindings';
import processEvent from 'analytics/processEvent';
import { removeProductFromReferer } from 'analytics/utils/cmsReferer';
import { HEADER_VALUE } from 'constants/authentication';
import { refreshBasket } from 'actions/RwdBasketActions';

const getText = localeUtils.getLocaleResourceFile('actions/locales', 'RwdBasketActions');

const { ACTION_TYPES } = rwdBasket;
const { addLove } = LoveActions;
const { updateBasket: updateBasketItems, removeSkuFromBasket, switchBasketItem } = basketApi;
const { initializeCheckout, initOrderSuccess, initOrderFailure } = checkoutUtils;
const { showChangeMethodEmptyBasketModal } = rwdBasketModalUtils;
const { setP13NDataForPreview, setP13NInitialization, setPersonalizationAnalyticsData } = homepageActions;
const { updatePersonalizationCache, setPersonalizationPlaceholder } = p13nUtils;

const BASKET_EXPIRY = Storage.MINUTES * 15;

const isNewPage = ({ newLocation, previousLocation }) => newLocation.path !== previousLocation.path;

const openPage = ({ events: { onDataLoaded, onPageUpdated, onError } }) => {
    return dispatch => {
        const { country, language } = Sephora.renderQueryParams;

        return Promise.allSettled([
            basketApi.getBasketDetails(),
            getContent({
                country,
                language,
                path: '/basket/v2'
            })
        ]).then(([basketResponse, cxsResponse]) => {
            if (
                cxsResponse.status === 'fulfilled' &&
                cxsResponse.value?.data &&
                !cxsResponse.value.data.errors &&
                cxsResponse.value.responseStatus === 200
            ) {
                const {
                    value: { data: cxsData }
                } = cxsResponse;

                dispatch({ type: ACTION_TYPES.UPDATE_BASKET_CMS_DATA, payload: cxsData });

                const missing = [];

                for (const key of [...CXS_INFO_MODAL_KEYS, ...CXS_MODAL_KEYS, ...CXS_ZONE_KEYS]) {
                    if (cxsData[key] == null) {
                        missing.push(key);
                    }
                }

                if (missing.length > 0) {
                    // eslint-disable-next-line no-console
                    console.error(`CXS response is missing the following modal keys: ${missing}`);
                }
            } else {
                if (cxsResponse.reason) {
                    dispatch({ type: ACTION_TYPES.UPDATE_BASKET_CMS_DATA, payload: { error: cxsResponse.reason } });

                    // eslint-disable-next-line no-console
                    console.error(`Basket CXS Promise failed with reason: ${cxsResponse.reason}`);
                }

                if (cxsResponse.value?.errors) {
                    const msg = cxsResponse.value?.errors[0];
                    dispatch({ type: ACTION_TYPES.UPDATE_BASKET_CMS_DATA, payload: { error: msg } });

                    // eslint-disable-next-line no-console
                    console.error(`Basket CXS call failed with error: ${msg}`);
                }
            }

            if (basketResponse.status === 'fulfilled') {
                const { value: newBasket } = basketResponse;

                dispatch(updateBasket({ newBasket, shouldCalculateRootBasketType: true }));
                onDataLoaded(newBasket);
                dispatch({ type: ACTION_TYPES.SET_RWD_BASKET });
                onPageUpdated(newBasket);
            } else {
                onError(basketResponse.reason);
            }
        });
    };
};

const updatePage = () => {};

const resetNavigation = () => dispatch => {
    Storage.local.setItem(LOCAL_STORAGE.BASKET_TYPE, null, BASKET_EXPIRY);
    dispatch({
        type: ACTION_TYPES.SET_BASKET_TYPES,
        payload: {
            currentRootBasketType: null,
            currentMainBasketType: null
        }
    });
};

const resetScrollToTop = () => dispatch => dispatch({ type: ACTION_TYPES.RESET_SHOULD_SCROLL_TO_TOP });

const resetSwitchedItem = () => dispatch => dispatch({ type: ACTION_TYPES.RESET_SWITCHED_ITEM });

const setConfirmationBoxOptions = ({ itemSwitchedToBasket, itemSwitchedFromBasket }) => {
    return dispatch => {
        dispatch({
            type: ACTION_TYPES.SET_CONFIRMATION_BOX_OPTIONS,
            payload: {
                itemSwitchedToBasket,
                itemSwitchedFromBasket
            }
        });
    };
};

const goToPickUpBasket =
    ({ prop55, items } = {}) =>
        dispatch => {
            Storage.local.setItem(LOCAL_STORAGE.BASKET_TYPE, MAIN_BASKET_TYPES.BOPIS_BASKET, BASKET_EXPIRY);
            dispatch({
                type: ACTION_TYPES.SET_BASKET_TYPES,
                payload: {
                    currentRootBasketType: ROOT_BASKET_TYPES.MAIN_BASKET,
                    currentMainBasketType: MAIN_BASKET_TYPES.BOPIS_BASKET
                }
            });

            if (isNonEmptyString(prop55)) {
                digitalData.lastRefresh = 'soft';
                BasketBindings.triggerNavigationAnalytics({ prop55, pageDetail: anaConsts.PAGE_NAMES.BOPIS_BASKET, items, shippingMethod: 'Pickup' });
            }
        };

const goToDCBasket =
    ({ prop55, items } = {}) =>
        dispatch => {
            Storage.local.setItem(LOCAL_STORAGE.BASKET_TYPE, MAIN_BASKET_TYPES.DC_BASKET, BASKET_EXPIRY);
            dispatch({
                type: ACTION_TYPES.SET_BASKET_TYPES,
                payload: {
                    currentRootBasketType: ROOT_BASKET_TYPES.MAIN_BASKET,
                    currentMainBasketType: MAIN_BASKET_TYPES.DC_BASKET
                }
            });

            if (isNonEmptyString(prop55)) {
                digitalData.lastRefresh = 'soft';
                BasketBindings.triggerNavigationAnalytics({ prop55, pageDetail: anaConsts.PAGE_NAMES.BASKET, items });
            }
        };

const goToPreBasket = () => dispatch => {
    Storage.local.setItem(LOCAL_STORAGE.BASKET_TYPE, null, BASKET_EXPIRY);
    dispatch({
        type: ACTION_TYPES.SET_BASKET_TYPES,
        payload: {
            currentRootBasketType: ROOT_BASKET_TYPES.PRE_BASKET,
            currentMainBasketType: null,
            resetSwitchedItem: false
        }
    });
};

function updateSkuQuantity({
    orderId = 'current', modifyConfirmed = false, isBopis, commerceId, sku, newQty, replenishmentFrequency = ''
}) {
    return (dispatch, getState) => {
        /**
         * @Redux-thunk
         * Calling getState() here beacause it's the only time we need a full list
         * of the basket items to update their qty
         */
        const { basket } = getState();
        const fullItemList = isBopis ? basket.pickupBasket.items : basket.items;
        const sameDayBasket = basket?.itemsByBasket?.find(item => item.basketType === BASKET_TYPES.SAMEDAY_BASKET) || {};
        let isSDDBasketProduct = false;

        let currentItemPreviousQty = null;

        const newBasketItemList = fullItemList.map(item => {
            const isSelectedItem = item.commerceId === commerceId;
            const isUpdateFrequency = isSelectedItem && replenishmentFrequency;

            if (isSelectedItem) {
                currentItemPreviousQty = item.qty;
                isSDDBasketProduct = sameDayBasket.items?.some(product => product.commerceId === commerceId);
            }

            return {
                qty: isSelectedItem ? newQty : item.qty,
                skuId: item.sku.skuId,
                productId: item.sku.productId,
                isAcceptTerms: false,
                replenishmentSelected: !!item.isReplenishment,
                replenishmentFrequency: isUpdateFrequency ? replenishmentFrequency : item.replenishmentFrequency || '',
                subSkuId: item.substituteSku?.skuId || ''
            };
        });

        dispatch({
            type: SHOW_SPA_PAGE_LOAD_PROGRESS,
            payload: true
        });

        return updateBasketItems({
            orderId,
            skuList: newBasketItemList,
            modifyConfirmed,
            isRopis: isBopis,
            isSameDay: isSDDBasketProduct
        })
            .then(newBasket => dispatch(updateBasket({ newBasket, shouldCalculateRootBasketType: false })))
            .catch(err => ErrorsUtils.renderGenericErrorModal(err.errorMessages[0]))
            .finally(() => {
                dispatch({
                    type: SHOW_SPA_PAGE_LOAD_PROGRESS,
                    payload: false
                });

                const basketStateAfterUpdate = getState().basket;
                const totalBasketCount = basketUtils.getTotalCount(basketStateAfterUpdate);

                const pageName = `basket:${isBopis ? 'buy online and pickup' : 'basket'}:n/a:*`;
                const action = `basket:edit quantity:${currentItemPreviousQty < newQty ? 'increase' : 'decrease'}`;

                const analyticsData = {
                    actionInfo: action,
                    linkName: action,
                    world: 'n/a',
                    pageName,
                    sku,
                    changedQuantity: currentItemPreviousQty < newQty ? newQty - currentItemPreviousQty : currentItemPreviousQty - newQty,
                    pageDetail: isBopis ? 'buy online and pickup' : 'basket'
                };
                digitalData.page.attributes.sephoraPageInfo.pageName = pageName;

                analyticsData.sku.quantity = parseInt(newQty);

                analyticsData.productStrings = [
                    anaUtils.buildSingleProductString({
                        sku,
                        isQuickLook: false,
                        newProductQty: newQty,
                        basket
                    })
                ];

                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        ...analyticsData,
                        totalBasketCount,
                        shippingMethod: basketUtils.getItemBasketType(sku.skuId, isBopis)
                    }
                });

                const SOTactionInfo =
                    currentItemPreviousQty < newQty
                        ? anaConsts.EVENT_NAMES.BASKET.SOT_ADD_TO_BASKET
                        : anaConsts.EVENT_NAMES.BASKET.SOT_REMOVE_FROM_BASKET;

                processEvent.process(anaConsts.SOT_LINK_TRACKING_EVENT, {
                    data: {
                        ...analyticsData,
                        actionInfo: SOTactionInfo.toLowerCase(),
                        linkName: SOTactionInfo,
                        totalBasketCount,
                        shippingMethod: basketUtils.getItemBasketType(sku.skuId, isBopis)
                    }
                });
            });
    };
}

function deleteItem({
    orderId = 'current', sku, modifyConfirmed = false, qty = 1, isBopis, productId
}) {
    return (dispatch, getState) => {
        dispatch({
            type: SHOW_SPA_PAGE_LOAD_PROGRESS,
            payload: true
        });

        const { basket: oldBasket } = getState();

        return removeSkuFromBasket(orderId, sku.skuId, modifyConfirmed, isBopis, productId)
            .then(newBasket => {
                const biAccountId = userUtils.getBiAccountId();
                const options = {
                    userId: biAccountId || 'current'
                };
                getRewardsBazaarRewards(options);
                removeProductFromReferer(sku);
                const isBopisBasket = Storage.local.getItem(LOCAL_STORAGE.BASKET_TYPE) === MAIN_BASKET_TYPES.BOPIS_BASKET;

                if (isBopisBasket) {
                    const isBopisBasketEmpty = newBasket?.pickupBasket?.itemCount === 0;
                    // Reset basket type to STH/DC/Standard if BOPIS basket is empty after item removal
                    isBopisBasketEmpty && Storage.local.setItem(LOCAL_STORAGE.BASKET_TYPE, MAIN_BASKET_TYPES.DC_BASKET, BASKET_EXPIRY);
                }

                // Get the current basket state
                const { basket } = getState();
                const samples = basket?.samples;

                // Remove the sample with the matching type and skuId
                newBasket.samples = samples.filter(
                    sample => !(sample.sku.type.toLowerCase() === skuUtils.skuTypes.SAMPLE && sample.sku.skuId === sku.skuId)
                );

                newBasket.isInitialized = true;

                dispatch(updateBasket({ newBasket, shouldCalculateRootBasketType: false }));
            })
            .catch(err => ErrorsUtils.renderGenericErrorModal(err.errorMessages[0]))
            .finally(() => {
                dispatch({
                    type: SHOW_SPA_PAGE_LOAD_PROGRESS,
                    payload: false
                });

                sku.quantity = qty;

                const skuWithRemovalProperty = {
                    ...sku,
                    isRemoval: true
                };
                const isSample = skuUtils.isSample(sku);
                const isBiReward = skuUtils.isBiReward(sku);

                const basketStateAfterUpdate = getState().basket;
                const totalBasketCount = basketUtils.getTotalCount(basketStateAfterUpdate);

                const removeText = 'remove from basket';
                const actionInfo = isBopis ? 'basket:delete' : `${removeText}`;
                const recentEvent = anaUtils.getLastAsyncPageLoadData();
                const pageName = isBiReward ? recentEvent.previousPage : `basket:${isBopis ? 'buy online and pickup' : 'basket'}:n/a:*`;
                const pageDetail = isBiReward ? pageName?.split(':')[1] : isBopis ? 'buy online and pickup' : 'basket';

                const analyticsData = {
                    bindingMethods: [removeFromBasketEvent],
                    eventStrings: [anaConsts.Event.SC_REMOVE],
                    linkName: isSample ? 'Remove samples from Basket' : isBopis ? 'basket:delete' : 'Remove From Basket',
                    sku: skuWithRemovalProperty,
                    actionInfo,
                    ...recentEvent,
                    pageName,
                    pageDetail,
                    previousPage: digitalData.page.attributes.previousPageData?.pageName,
                    totalBasketCount
                };

                // Sending old basket to analytics so we have a reference of the fulfillment
                // method (SameDay, ShipToHome, BOPIS) before the item was removed
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        ...analyticsData,
                        actionInfo: anaConsts.EVENT_NAMES.BASKET.SOT_REMOVE_FROM_BASKET.toLowerCase(),
                        linkName: anaConsts.EVENT_NAMES.BASKET.SOT_REMOVE_FROM_BASKET,
                        basketType: isBopis ? DELIVERY_METHOD_TYPES.BOPIS : DELIVERY_METHOD_TYPES.STANDARD,
                        shippingMethod: basketUtils.getItemBasketType(sku.skuId, isBopis),
                        basket: oldBasket
                    }
                });
            });
    };
}

function moveItemToLoves({ item, skuId, productId, isBopis }) {
    return (dispatch, getState) => {
        return auth.requireAuthentication(false, null, null, null, false, HEADER_VALUE.USER_CLICK).then(() => {
            dispatch({
                type: SHOW_SPA_PAGE_LOAD_PROGRESS,
                payload: true
            });

            dispatch(
                addLove(
                    { skuId, productId, loveSource: 'basket', isRopisSku: isBopis },
                    res => {
                        if (res && res.shoppingListMsgs) {
                            const promoWarning = res.shoppingListMsgs.find(
                                warning => warning.messageContext === BASKET_LEVEL_MESSAGES_CONTEXTS.SHOPPING_LIST_PROMO_WARNING
                            );

                            if (promoWarning && promoWarning.messages.length) {
                                promoUtils.showWarningMessage(promoWarning.messages[0]);
                            }
                        }

                        basketApi
                            .getBasketDetails()
                            .then(newBasket => dispatch(updateBasket({ newBasket, shouldCalculateRootBasketType: false })))
                            .finally(() => {
                                dispatch({
                                    type: SHOW_SPA_PAGE_LOAD_PROGRESS,
                                    payload: false
                                });

                                const { basket } = getState();
                                const totalBasketCount = basketUtils.getTotalCount(basket);

                                const analyticsData = {
                                    bindingMethods: [moveToLoveEvent],
                                    item: [item],
                                    specificEventName: anaConsts.EVENT_NAMES.ADD_TO_LOVES,
                                    ...anaUtils.getLastAsyncPageLoadData(),
                                    pageName: `basket:${isBopis ? 'buy online and pickup' : 'basket'}:n/a:*`,
                                    pageDetail: isBopis ? 'buy online and pickup' : 'basket'
                                };

                                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                                    data: {
                                        ...analyticsData,
                                        currency: basket.currency,
                                        totalBasketCount
                                    }
                                });

                                processEvent.process(anaConsts.SOT_LINK_TRACKING_EVENT, {
                                    data: {
                                        ...analyticsData,
                                        currency: basket.currency,
                                        totalBasketCount
                                    }
                                });
                            });
                    },
                    err => err?.errorMessages?.[0] && ErrorsUtils.renderGenericErrorModal(err.errorMessages[0])
                )
            );
        });
    };
}

function changeItemMethod({
    skuId, qty, currentBasket, action, deliveryOption, productId, itemSwitchedToBasket, itemSwitchedFromBasket
}) {
    return dispatch => {
        dispatch({
            type: SHOW_SPA_PAGE_LOAD_PROGRESS,
            payload: true
        });

        return switchBasketItem(skuId, qty, currentBasket, action, deliveryOption, productId)
            .then(newBasket => {
                if (action === CHANGE_METHOD_TYPES.ACTION.SWITCH) {
                    dispatch(setConfirmationBoxOptions({ itemSwitchedToBasket, itemSwitchedFromBasket }));

                    // Dispatch the action to clear rwdCheckoutErrors
                    dispatch({
                        type: ACTION_TYPES.CLEAR_RWD_CHECKOUT_ERRORS
                    });
                }

                newBasket.isInitialized = true;

                dispatch(updateBasket({ newBasket, shouldCalculateRootBasketType: false }));

                if (currentBasket === CHANGE_METHOD_TYPES.BOPIS) {
                    const { switchedItem, itemCount } = newBasket?.pickupBasket;
                    const isEmptyBasket = switchedItem && itemCount === 0;
                    isEmptyBasket && Storage.local.setItem(LOCAL_STORAGE.BASKET_TYPE, MAIN_BASKET_TYPES.DC_BASKET, BASKET_EXPIRY);
                } else {
                    showChangeMethodEmptyBasketModal({
                        basket: newBasket,
                        goToPickUpBasket,
                        goToPreBasket
                    });
                }

                // We don't want these analytics to fire if event is not relevant. i.e. "undo" event.
                if (action.toLowerCase() === 'switch') {
                    const item = newBasket?.switchedItem || newBasket?.pickupBasket?.switchedItem;
                    switchDeliveryMethodAnalyticsCall(item, itemSwitchedToBasket, itemSwitchedFromBasket);
                }
            })
            .catch(err => ErrorsUtils.renderGenericErrorModal(err.errorMessages[0]))
            .finally(() =>
                dispatch({
                    type: SHOW_SPA_PAGE_LOAD_PROGRESS,
                    payload: false
                })
            );
    };
}

function initiateCheckout(isBopis) {
    return async dispatch => {
        dispatch({
            type: SHOW_SPA_PAGE_LOAD_PROGRESS,
            payload: true
        });

        // Disable applePay session, if it was active.
        dispatch(UtilActions.merge('applePaySession', 'isActive', false));

        try {
            const response = await initializeCheckout({ ropisCheckout: isBopis });
            initOrderSuccess(response, isBopis);
        } catch (err) {
            if (err?.errors?.sameDayBasketLevelMsg) {
                dispatch({
                    type: ACTION_TYPES.SET_RWD_CHECKOUT_ERRORS,
                    payload: {
                        error: err,
                        errorLocation: RWD_CHECKOUT_ERRORS.SDD_ZONE_2
                    }
                });
            } else if (err?.key === 'bopis.substitute.not.supported') {
                store.dispatch(
                    Actions.showInfoModal({
                        isOpen: true,
                        title: getText('itemSubErrorModalTitle'),
                        message: err.errorMessages[0],
                        buttonText: getText('gotIt'),
                        showFooterBorder: true
                    })
                );
            }

            initOrderFailure(err);
        } finally {
            dispatch({
                type: SHOW_SPA_PAGE_LOAD_PROGRESS,
                payload: false
            });
        }
    };
}

function setSameDayDeliveryAvailable(isAvailable = false) {
    return {
        type: ACTION_TYPES.SET_SAME_DAY_DELIVERY_AVAILABLE,
        payload: isAvailable
    };
}

function openMultipleRougeRewardsModal(isOpen, availableRougeRewards) {
    store.dispatch(Actions.showMultipleRougeRewardsModal({ isOpen, availableRougeRewards }));
}

function openRewardsBazaarModal(isOpen, payload = {}) {
    store.dispatch(Actions.showRewardsBazaarModal({ isOpen, ...payload }));
}

function openBIRegisterModal(isOpen) {
    store.dispatch(Actions.showBiRegisterModal({ isOpen }));
}

function openFreeSamplesModal(isOpen) {
    store.dispatch(Actions.showFreeSamplesModal({ isOpen }));

    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
        data: {
            pageName: `basket:${anaConsts.ACTION_INFO.SELECT_SAMPLES}`,
            pageType: anaConsts.PAGE_TYPES.BASKET,
            pageDetail: anaConsts.PAGE_DETAIL.SAMPLES
        }
    });
}

function openShippingRestrictionsInfoModal({ title, message, buttonText, callback }) {
    store.dispatch(
        Actions.showInfoModal({
            isOpen: true,
            title: title,
            message: message,
            buttonText: buttonText,
            ...(callback && {
                callback: callback,
                cancelCallback: callback
            })
        })
    );
}

function openCheckoutInEligibleModal({ title, message, buttonText }) {
    store.dispatch(
        Actions.showInfoModal({
            isOpen: true,
            title: title,
            message: message,
            buttonText: buttonText
        })
    );
}

function getRewardsBazaarRewards(options) {
    store.dispatch(rewardActions.fetchProfileRewards(options));
}

function switchDeliveryMethodAnalyticsCall(item, selectedDeliveryOption, itemDeliveryMethod) {
    const skuId = item?.skuId;
    let formattedItemDeliveryMethod = itemDeliveryMethod;

    if (itemDeliveryMethod.toLowerCase() === 'auto-replenish') {
        formattedItemDeliveryMethod = 'AutoReplenish';
    }

    const actionInfo = `change method:${anaConsts.DELIVERY_OPTIONS_MAP[formattedItemDeliveryMethod]}:${anaConsts.DELIVERY_OPTIONS_MAP[selectedDeliveryOption]}`;

    // Process event when delivery method is switched (INFL-4141)
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            actionInfo: actionInfo, //Prop55
            linkName: actionInfo,
            sku: skuId,
            previousDeliveryMethod: anaConsts.DELIVERY_OPTIONS_MAP[itemDeliveryMethod],
            productStrings: `;${skuId};;;;eVar26=${skuId}`
        }
    });
}

const getPersonalizedComponents = (personalization, user) => (dispatch, _) => {
    const prvCookie = cookieUtils.read(cookieUtils.KEYS.P13N_PRV);
    const { country, channel, language } = Sephora.renderQueryParams;
    const { userId: atgId, biId } = user;
    const contextEntryIds = [personalization.context];

    const payload = {
        channel,
        country,
        language,
        atgId,
        biId,
        contextEntryIds
    };

    return p13nApi
        .getP13nData(payload)
        .then(data => {
            if (prvCookie) {
                dispatch(setP13NDataForPreview(data));
            } else {
                if (data?.length === 0) {
                    setPersonalizationPlaceholder(personalization.context);
                } else {
                    updatePersonalizationCache(data, true);
                    dispatch(setPersonalizationAnalyticsData(data));
                }

                dispatch(setP13NInitialization(true));
            }
        })
        .catch(() => {
            dispatch(setP13NInitialization(true));
        });
};

export default {
    isNewPage,
    openPage,
    updatePage,
    resetNavigation,
    goToPickUpBasket,
    goToDCBasket,
    goToPreBasket,
    updateSkuQuantity,
    deleteItem,
    moveItemToLoves,
    changeItemMethod,
    initiateCheckout,
    resetScrollToTop,
    resetSwitchedItem,
    openMultipleRougeRewardsModal,
    openShippingRestrictionsInfoModal,
    getRewardsBazaarRewards,
    openRewardsBazaarModal,
    openFreeSamplesModal,
    updateBasket,
    refreshBasket,
    switchDeliveryMethodAnalyticsCall,
    setSameDayDeliveryAvailable,
    openBIRegisterModal,
    openCheckoutInEligibleModal,
    getPersonalizedComponents
};
