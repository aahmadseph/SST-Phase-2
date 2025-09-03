/*eslint camelcase: ["error", {properties: "never"}]*/
import basketTypes from 'reducers/addToBasket';
const { ACTION_TYPES: TYPES } = basketTypes;
import { breakpoints } from 'style/config';
import ProductActions from 'actions/ProductActions';
import Actions from 'Actions';
import beautyInsiderApi from 'services/api/beautyInsider';
import analyticsConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import basketApi from 'services/api/basket';
import basketConstants from 'constants/Basket';
import basketUtils from 'utils/Basket';
import beautyInsiderActions from 'actions/BeautyInsiderActions';
import BIRBActions from 'actions/BIRBActions';
import inlineBasketActions from 'actions/InlineBasketActions';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import localeUtils from 'utils/LanguageLocale';
import Location from 'utils/Location';
import processEvent from 'analytics/processEvent';
import profileApi from 'services/api/profile';
import promoUtils from 'utils/Promos';
import rewardActions from 'actions/RewardActions';
import RougeRewardsActions from 'actions/RougeRewardsActions';
import skuUtils from 'utils/Sku';
import spaUtils from 'utils/Spa';
import Storage from 'utils/localStorage/Storage';
import urlUtils from 'utils/Url';
import UtilActions from 'utils/redux/Actions';
import userUtils from 'utils/User';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';
import addToCartPixels from 'analytics/addToCartPixels';
import addToBasketEvent from 'analytics/bindings/pages/all/addToBasketEvent';
import removeFromBasketEvent from 'analytics/bindings/pages/all/removeFromBasketEvent';
import store from 'store/Store';
import { BASKET_TYPES } from './ActionsConstants';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import Empty from 'constants/empty';
import { addProductToReferer, removeProductFromReferer } from 'analytics/utils/cmsReferer';
import { updateBasket as createUpdateBasketAction } from 'actions/RwdBasketActions';
import ErrorsUtils from 'utils/Errors';
import reject from 'utils/functions/reject';

const BASKET_EXPIRY = Storage.MINUTES * 15;
const getText = localeUtils.getLocaleResourceFile('actions/locales', 'BasketActions');

const HTTP_STATUS_ACCEPTED = 202;
const OPERATION = {
    ADDED_PRODUCT: 'ADDED_PRODUCT',
    ADDED_PRODUCT_BASKET_UPDATE: 'ADDED_PRODUCT_BASKET_UPDATE',
    UPDATED_PRODUCT: 'UPDATED_PRODUCT',
    ADDED_REWARD: 'ADDED_REWARD',
    ADDED_SAMPLE: 'ADDED_SAMPLE',
    ADDED_MULTIPLE_PRODUCTS: 'ADDED_MULTIPLE_PRODUCTS'
};

const WARNING = 'warning';
const ERROR = 'error';
const PROMO_WARNING = 'basket.promoWarning';
const PROMO_INVALID = 'basketLevelMsg';
const { BasketType } = basketConstants;

import generalBindings from 'analytics/bindingMethods/pages/all/generalBindings';
import skuHelpers from 'utils/skuHelpers';

// Do not export this function. Do not use this.
// This has been kept for use within this file to maintain backwards compatibility.
// Use the updateBasket in actions/RwdBasketActions
function updateBasket(basket, clearError = true) {
    /* We cache basket data each time the basket is updated with fresh API data so we do not have
     to call the user/full API on each page load. However, we set an expire time of 15 minutes. */
    Storage.local.setItem(LOCAL_STORAGE.BASKET, basket, BASKET_EXPIRY);

    basket.isInitialized = true;

    if (Array.isArray(digitalData?.cart?.item) && Array.isArray(basket.items)) {
        if (digitalData.cart.item.length !== basket.items.length) {
            digitalData.cart.itemBeforeUpdate = [...digitalData.cart.item];
        }

        digitalData.cart.item = basket.items;
    }

    if (Array.isArray(digitalData?.cart?.itemsByBasket) && Array.isArray(basket.itemsByBasket)) {
        digitalData.cart.itemsByBasket = basket.itemsByBasket;
    }

    if (basket.pickupBasket) {
        basket.pickupBasket.isInitialized = true;
    }

    return {
        type: TYPES.UPDATE_BASKET,
        basket: basketUtils.separateItems(basket),
        clearError: clearError
    };
}

function showError(error, items, errorMessages) {
    // errors array is empty for next case (that's why we use errorMessages):
    // errorCode: -1081
    // 'There is a limit of 10 per person for this item. We have added 0 item(s) to your basket.'
    const basketError = Object.assign({}, error);

    if (error) {
        if (error.errors && !Object.keys(error.errors).length) {
            // sometimes it is empty
            basketError.errorMessages = error.errorMessages;
        } else if (!Object.keys(error).length && errorMessages) {
            basketError.errorMessages = errorMessages;
        }
    }

    if (error && !basketError.errorMessages && typeof error === 'object') {
        basketError.errorMessages = Object.keys(error).map(errorKey => {
            if (error[errorKey] instanceof Array) {
                return error[errorKey].join(',');
            } else {
                return error[errorKey];
            }
        });
    }

    return {
        type: TYPES.SHOW_BASKET_ERROR,
        isPickup: basketUtils.isPickup(),
        error: basketError,
        itemsAndErrors: items || null
    };
}

function clearPendingProductList() {
    return {
        type: TYPES.CLEAR_PENDING_SKU,
        pendingBasketSkus: []
    };
}

function showWarning(basketItemWarnings) {
    return {
        type: TYPES.SHOW_BASKET_WARNING,
        basketItemWarnings: basketItemWarnings
    };
}

function getImprovedData(basketResponse, data) {
    const improvedData = data;

    // Empty `items` may indicate the basket is empty
    if (basketResponse?.items?.length) {
        // `sku` not found may indicate this is a deletion
        const sku = basketResponse.items.find(item => item.sku.skuId === data.sku.skuId);

        if (sku) {
            improvedData.sku = {
                ...improvedData.sku,
                ...sku
            };
        }

        improvedData.analyticsData = {
            ...improvedData.analyticsData,
            ...improvedData.sku
        };
    }

    improvedData.analyticsData = {
        ...improvedData.analyticsData,
        zipCode: improvedData.analyticsData?.isSameDay ? userUtils.getZipCode() : 'n/a',
        storeId: improvedData.analyticsData?.isPickup ? userUtils.getPreferredStoreId() : 'n/a',
        totalBasketCount: basketUtils.getTotalCount(basketResponse)
    };

    return improvedData;
}

// This has been kept for use within this file to maintain backwards compatibility.
// Use the refreshBasket in actions/RwdBasketActions for new features.
function refreshBasket(keepItemLevelErrors, clearError, spaPageLoad = false) {
    return dispatch => {
        return basketApi
            .getBasketDetails()
            .then(data => {
                if (spaPageLoad) {
                    data.targeters = [{ targeterName: '/atg/registry/RepositoryTargeters/Sephora/BasketGiftCardTargeter' }];
                }

                if (keepItemLevelErrors && data.items) {
                    const itemsAndErrs = basketUtils.catchItemLevelErrors(keepItemLevelErrors, data);

                    if (itemsAndErrs) {
                        data.items.forEach(item => {
                            const itemErr = itemsAndErrs.filter(err => err.sku.skuId === item.sku.skuId);

                            if (itemErr.length) {
                                // eslint-disable-next-line no-param-reassign
                                item = Object.assign(item, itemErr[0]);
                            }
                        });
                    }
                }

                return dispatch(createUpdateBasketAction({ newBasket: data, shouldCalculateRootBasketType: false }));
            })
            .catch(reason => {
                return dispatch(showError(reason));
            });
    };
}

function confirmBasketUpdateModal(dispatch, message, callback, cancelCallback) {
    dispatch(
        Actions.showInfoModal({
            isOpen: true,
            title: getText('confirmBasketUpdateModalTitle'),
            message: message,
            buttonText: getText('confirmBasketUpdateModalButtonText'),
            callback: callback,
            showCancelButton: true,
            cancelCallback: cancelCallback,
            showCloseButton: true
        })
    );
}

function showPaypalRestrictedMessage() {
    return {
        type: TYPES.SHOW_PAYPAL_RESTRICTED_MESSAGE,
        showPaypalRestrictedMessage: true,
        isPickup: basketUtils.isPickup()
    };
}

function showStickyApplePayBtn(isSticky) {
    return {
        type: TYPES.SHOW_STICKY_APPLE_PAY_BTN,
        showStickyApplePayBtn: isSticky
    };
}

function handleAddToBasketErrorAnalytics(error, showBasketQuickAdd = false, isRewardError, sku) {
    if (Location.isBasketPage()) {
        const errorMessages = error?.errorMessages;
        const fieldErrors = [];
        let productStrings = '';

        if (showBasketQuickAdd) {
            fieldErrors.push('basket');
        }

        if (isRewardError) {
            fieldErrors.push('reward bazaar');
            productStrings = `;${sku.skuId};;;;eVar26=${sku.skuId}`;
        }

        const analyticData = {
            data: {
                bindingMethods: linkTrackingError,
                fieldErrors,
                errorMessages,
                ...anaUtils.getLastAsyncPageLoadData(),
                ...(productStrings && { productStrings })
            }
        };

        processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, analyticData);
    }
}

// Fetch rewards only for basket, BI, and BIRB pages if there is a change in the basket.
// Related to ILLUPH-124729, ILLUPH-125321 and ILLUPH-126428
// Rewards must be fetched/updated after add product in basket page
function fetchRewardsAfterBasketUpdate(dispatch, sku = null) {
    const user = store.getState().user;

    if (Location.isBasketPage()) {
        const biAccountId = userUtils.getBiAccountId();
        const options = {
            userId: biAccountId
        };
        dispatch(rewardActions.fetchProfileRewards(options));
    }

    if (Location.isBIRBPage()) {
        const biAccountId = userUtils.getBiAccountId();
        const options = {
            userId: biAccountId
        };

        dispatch(BIRBActions.fetchBiRewards(options));
        dispatch(RougeRewardsActions.loadRougeRewards(user.language.toLowerCase(), user.profileLocale));
    }

    if (Location.isBIPage()) {
        dispatch(beautyInsiderActions.fetchBiRewards());
        dispatch(RougeRewardsActions.loadRougeRewards(user.language.toLowerCase(), user.profileLocale));
    }

    if (Location.isProductPage() && sku && sku.rewardSubType === skuUtils.skuTypes.ROUGE_REWARD_CARD) {
        const productName = urlUtils.getUrlLastFragment().toLowerCase();
        const productId = productName.split('-').pop().toUpperCase();
        dispatch(BIRBActions.fetchBiRewards());
        profileApi.getUserSpecificProductDetails(productId).then(response => {
            dispatch(ProductActions.updateCurrentUserSpecificProduct(response));
        });
    }
}

function filterBasketWarningErrorMessages({ basketLevelMessages, sku }) {
    const warningErrorMessages =
        (basketLevelMessages &&
            basketLevelMessages.filter(msg => {
                return (msg.type === WARNING || msg.type === ERROR) && (msg.messageContext === PROMO_WARNING || msg.messageContext === PROMO_INVALID);
            })) ||
        [];

    if (warningErrorMessages.length) {
        const message = warningErrorMessages[0].messages[0];

        if (Location.isProductPage()) {
            const isOpen = !skuUtils.isPDPSample(sku) && window.matchMedia(breakpoints.xsMax).matches;
            store.dispatch(UtilActions.merge('inlineBasket', 'isOpen', isOpen));
            store.dispatch(showError({ internalError: message }));
        }
    }
}

function removeUpdatedItemFromItems({ items, newItem }) {
    let deletedItem = null;
    const newItems = reject(items, prevItem => {
        const match = prevItem.sku.skuId === newItem.sku.skuId;

        if (match) {
            deletedItem = prevItem;
        }

        return match;
    });

    return { items: newItems, deletedItem };
}

/**
 * Since the current API response sometimes retrieves errors inside the
 * basket and sometimes within a totally different format,
 * this method will check always for errors.lso this it will dispatch
 * different actions relevant to the operation that called this function.
 *
 * OPERATION.UPDATED_PRODUCT: dispatch updateBasket with the straight basket response.
 * OPERATION.ADDED_PRODUCT: calculate new basket object using the basket response.
 * ADDED_PRODUCT_BASKET_UPDATE: dispatch updateBasket with the straight basket response.
 * Else for ADDED_REWARD: dispatch updateBasket with straight basket response.
 * NOTE:For the last 2 cases, if it comes the quantity param it dispatches addedProductsNotification
 */
function makeGenericAddUpdateProductToBasketSuccessHandler({
    dispatch, basketType, quantity, performedAction, successCallback, sku
}) {
    return data => {
        if (typeof successCallback === 'function') {
            successCallback(data);
        }

        // operation-specifyc logic
        let updatedBasket = null;

        switch (performedAction) {
            case OPERATION.UPDATED_PRODUCT:
            case OPERATION.ADDED_PRODUCT_BASKET_UPDATE:
            case OPERATION.ADDED_SAMPLE:
                updatedBasket = updateBasket(data);

                break;
            case OPERATION.ADDED_PRODUCT:
                // When adding a product to non-BOPIS basket,
                // the api response does not contain the full basket
                // eslint-disable-next-line no-case-declarations
                let newData = null;
                // eslint-disable-next-line no-case-declarations
                let deletedItem = null;

                if (basketType !== BasketType.BOPIS && data.items.length > 1) {
                    const filteredItems = removeUpdatedItemFromItems({
                        items: data.items,
                        newItem: { sku: sku }
                    });

                    const items = [filteredItems.deletedItem, ...filteredItems.items];
                    deletedItem = filteredItems.deletedItem;
                    newData = { ...data, items };
                }

                updatedBasket =
                    basketType === BasketType.BOPIS
                        ? updateBasket(data)
                        : updateBasket(basketUtils.calculateUpdatedBasket(newData ?? data, deletedItem, !!sku.sameDayTitle));

                break;
            case OPERATION.ADDED_REWARD:
                updatedBasket = updateBasket(data.basket);

                break;
            case OPERATION.ADDED_MULTIPLE_PRODUCTS:
                updatedBasket = updateBasket(basketUtils.calculateUpdatedBasketProductBundling(data));

                break;
            default:
                updatedBasket = updateBasket(data.basket);

                break;
        }

        dispatch(updatedBasket);

        fetchRewardsAfterBasketUpdate(dispatch);

        dispatch(inlineBasketActions.ReserveOnlinePickUpInStoreProductAdded(basketType === BasketType.BOPIS));

        if (quantity) {
            dispatch(inlineBasketActions.addedProductsNotification(quantity));
        }

        if (!Location.isBasketPage() && window.matchMedia(breakpoints.xsMax).matches) {
            const isOpen = !skuUtils.isPDPSample(sku);
            dispatch(UtilActions.merge('inlineBasket', 'isOpen', isOpen));
        }

        dispatch(showWarning(basketUtils.catchItemLevelMessages(data)));

        digitalData.cart.itemsByBasket = updatedBasket.basket.itemsByBasket;

        return updatedBasket;
    };
}

function makeGenericBasketOperationFailureHandler({
    dispatch,
    showBasketQuickAdd,
    showBasketCarouselErrorModal,
    sku,
    isRewardError,
    successCallbackParams
}) {
    return reason => {
        const itemsAndErrors = basketUtils.catchItemLevelErrors(reason);
        const isAutoReplenishError = basketUtils.isAutoReplenishError(reason.errorCode);
        const isOutOfStockError = basketUtils.isOutOfStockError(reason.key);
        const isLimitExceededError = basketUtils.isLimitExceededError(reason.key);
        const { isChooseOptionsModal, product } = successCallbackParams || Empty.Object;

        if (isChooseOptionsModal) {
            const argumentsObj = {
                isOpen: true,
                product,
                sku: sku,
                skuType: sku?.type,
                error: reason?.errorMessages[0]
            };

            dispatch(Actions.showChooseOptionsModal(argumentsObj));

            return Promise.reject(reason);
        }

        if (!Location.isBasketPage() || (Location.isBasketPage() && isRewardError)) {
            const isOpen = !skuUtils.isPDPSample(sku) && window.matchMedia(breakpoints.xsMax).matches;
            dispatch(UtilActions.merge('inlineBasket', 'isOpen', isOpen));
            dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    title: isLimitExceededError ? getText('limitExceededTitle') : getText('genericErrorTitle'),
                    message: reason?.errorMessages[0],
                    buttonText: getText('gotIt'),
                    buttonWidth: '50%',
                    footerDisplay: 'flex',
                    footerJustifyContent: 'end'
                })
            );
        }

        handleAddToBasketErrorAnalytics(reason, showBasketQuickAdd, isRewardError, sku);

        if (isAutoReplenishError) {
            dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    title: getText('autoReplenishTitle'),
                    message: `<p>${getText('autoReplenishP1')}</p><p>${getText('autoReplenishP2')}</p>`,
                    buttonText: getText('gotIt'),
                    isHtml: true
                })
            );
        } else if (showBasketCarouselErrorModal) {
            dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    title: isOutOfStockError
                        ? getText('outOfStockTitle')
                        : isLimitExceededError
                            ? getText('limitExceededTitle')
                            : getText('genericErrorTitle'),
                    message: reason?.errorMessages?.[0],
                    buttonText: getText('gotIt'),
                    buttonWidth: '50%',
                    footerDisplay: 'flex',
                    footerJustifyContent: 'end'
                })
            );
            dispatch(showError(reason.errors, itemsAndErrors, reason.errorMessages));
        } else if (skuUtils.isPDPSample(sku)) {
            // If the «Add To Basket» button error comes from trying to add a product sample
            dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    title: getText('genericErrorTitle'),
                    message: getText('samplesError'),
                    buttonText: getText('gotIt'),
                    buttonWidth: '50%',
                    footerDisplay: 'flex',
                    footerJustifyContent: 'end'
                })
            );
        } else {
            dispatch(showError(reason.errors, itemsAndErrors, reason.errorMessages));
        }

        const clearErrors = !(showBasketQuickAdd || showBasketCarouselErrorModal);
        dispatch(refreshBasket(itemsAndErrors ? reason : null, clearErrors));

        return Promise.reject(reason);
    };
}

function addProductToBasket(
    sku,
    basketType,
    quantity,
    includeAllBasketItems,
    successCallbackParams,
    showBasketQuickAdd,
    isAutoReplenish,
    replenishmentFrequency,
    productId,
    showBasketCarouselErrorModal
) {
    const qty = quantity || 1;

    if (userUtils.isAnonymous() && !digitalData.user[0].profile[0].profileInfo.profileID) {
        digitalData.user[0].profile[0].profileInfo.profileID = basketUtils.getAnonymousUserId();
    }

    return dispatch => {
        return decorators
            .withInterstice(basketApi.addToCart, INTERSTICE_DELAY_MS)(
                {
                    orderId: basketUtils.getOrderId(),
                    skuList: [
                        {
                            isAcceptTerms: false,
                            qty,
                            replenishmentSelected: isAutoReplenish,
                            replenishmentFrequency,
                            skuId: sku.skuId,
                            productId: productId
                        }
                    ],
                    fulfillmentType: basketType
                },
                basketType === BasketType.BOPIS || includeAllBasketItems
            )
            .then(basketResponse => {
                // eslint-disable-next-line no-use-before-define
                const decoratedSuccessCallback = createDecoratedSuccessCallback({
                    ...successCallbackParams,
                    basketResponse,
                    basket: basketResponse?.basket
                });

                addProductToReferer(sku);

                return makeGenericAddUpdateProductToBasketSuccessHandler({
                    dispatch,
                    basketType,
                    qty,
                    performedAction: includeAllBasketItems ? OPERATION.ADDED_PRODUCT_BASKET_UPDATE : OPERATION.ADDED_PRODUCT,
                    successCallback: decoratedSuccessCallback,
                    sku,
                    basket: basketResponse?.basket
                })(basketResponse);
            })
            .then(data => {
                filterBasketWarningErrorMessages({ basketLevelMessages: data.basket?.basketLevelMessages, sku });

                return data;
            })
            .then(data => {
                filterBasketWarningErrorMessages({ basketLevelMessages: data.basket?.basketLevelMessages, sku });

                return data;
            })
            .catch(
                makeGenericBasketOperationFailureHandler({
                    dispatch,
                    showBasketQuickAdd,
                    showBasketCarouselErrorModal,
                    sku,
                    successCallbackParams
                })
            );
    };
}

function addRewardToBasket(skuId, quantity, successCallbackParams, brandName, productId, fulfillmentType) {
    digitalData.product = [
        {
            attributes: { nthLevelCategory: undefined },
            productInfo: { manufacturer: brandName || undefined }
        }
    ];

    return dispatch => {
        return decorators
            .withInterstice(beautyInsiderApi.addBiRewardsToCart, INTERSTICE_DELAY_MS)(skuId, productId, fulfillmentType)
            .then(basketResponse => {
                // eslint-disable-next-line no-use-before-define
                const decoratedSuccessCallback = createDecoratedSuccessCallback({
                    ...successCallbackParams,
                    basketResponse: basketResponse?.basket,
                    basket: basketResponse?.basket,
                    isAdd: true
                });

                return makeGenericAddUpdateProductToBasketSuccessHandler({
                    dispatch,
                    quantity,
                    performedAction: OPERATION.ADDED_REWARD,
                    successCallback: decoratedSuccessCallback,
                    basket: basketResponse?.basket
                })(basketResponse);
            })
            .catch(makeGenericBasketOperationFailureHandler({ dispatch, isRewardError: true, sku: { skuId } }));
    };
}

// Prepare data for Google Analytics begin_checkout event (Add To Cart & Remove from Cart)
function getCurrentBasketItemsForGoogleAnalytics() {
    const currentBasketItems = store.getState().basket.items;
    const analyticsBasketItems = [];
    currentBasketItems.forEach(basketItem => {
        const currentSku = basketItem.sku;
        const skuPrice = anaUtils.removeCurrencySymbol(currentSku.salePrice || currentSku.listPrice);
        const brand = currentSku.brandName ? currentSku.brandName : basketItem.manufacturer;
        const itemToAdd = {
            id: currentSku.skuId,
            name: currentSku.productName,
            brand: brand,
            category: currentSku.parentCategory && currentSku.parentCategory.displayName,
            variant: currentSku.variationValue || '',
            skuType: currentSku.type,
            quantity: basketItem.qty || 1,
            price: isNaN(skuPrice) ? '0.00' : skuPrice
        };
        analyticsBasketItems.push(itemToAdd);
    });

    return analyticsBasketItems;
}

/*
 * Call Custom Event to fire Google Analytics begin_checkout event for following events:
 * 1. Add To Cart
 * 2. Remove from Basket
 * 3. Change in Quantity
 * 4. Move to Loves
 * @params  item    sku to be added to or removed from current basket
 * @params  action  addItem or removeItem
 */
function fireGABeginCheckout(item, action) {
    const currentItems = getCurrentBasketItemsForGoogleAnalytics();
    let itemList = [];

    switch (action) {
        case 'addItem':
            itemList = [...currentItems];

            break;
        case 'removeItem':
            itemList = currentItems.filter(product => product.id !== item.id);

            break;
        case 'editQuantity':
            currentItems.forEach(product => {
                if (product.id === item.id) {
                    product.quantity = item.quantity;
                    itemList.push(product);
                } else {
                    itemList.push(product);
                }
            });

            break;
        default:
            itemList = [];
    }

    if (digitalData.page.attributes.tempProps) {
        digitalData.page.attributes.tempProps.cartItems = itemList;
    } else {
        digitalData.page.attributes.tempProps = {};
        digitalData.page.attributes.tempProps.cartItems = itemList;
    }

    Sephora.analytics.promises.tagManagementSystemReady.then(() => {
        addToCartPixels.googleAnalyticsBeginCheckout();
    });
}

function handleAddToBasketAnalytics(data) {
    const { analyticsContext } = data;
    const {
        sku, skuList, analyticsData, quantity, basketType
    } = data;
    const originalContext = (analyticsData && analyticsData.originalContext) || undefined;

    const anaData = {
        bindingMethods: [addToBasketEvent],
        context: analyticsContext,
        originalContext,
        sku,
        skuList,
        analyticsData: {
            ...analyticsData,
            actionInfo: analyticsConsts.EVENT_NAMES.ADD_TO_BASKET.toLowerCase(),
            linkName: analyticsConsts.EVENT_NAMES.ADD_TO_BASKET,
            qty: quantity,
            currency: basketUtils.getBasketCurrency()
        },
        totalBasketCount: analyticsData.totalBasketCount,
        eventName: analyticsConsts.EVENT_NAMES.ADD_TO_BASKET,
        isGalleryLightBox: data.isGalleryLightBox
    };

    if (analyticsContext === analyticsConsts.CONTEXT.QUICK_LOOK) {
        anaData.internalCampaign = `${analyticsData.rootContainerName}:${analyticsData.productId}:add-to-basket`.toLowerCase();
    }

    digitalData.product = [
        {
            attributes: {
                price: sku.salePrice ? sku.salePrice : sku.listPrice,
                nthLevelCategory: analyticsData.category
            },
            productInfo: {
                description: analyticsData.productDescription,
                manufacturer: analyticsData.brandName || sku.brandName,
                productID: analyticsData.productId,
                productName: analyticsData.productName,
                isOnlineOnly: analyticsData.isOnlineOnly,
                shippingMethod: basketType || BASKET_TYPES.STANDARD_BASKET
            }
        }
    ];

    // Makes sure that the pageName parameter carries a value for the category.
    // The requested format is: product:<skuId>:<category>
    anaUtils.setWorldValueFromProduct();
    anaData.pageName = anaData?.analyticsData?.pageName || generalBindings.getSephoraPageName();

    processEvent.preprocess.commonInteractions(anaData);

    import(/* webpackMode: "eager" */ 'analytics/bindings/pages/basket/BasketEvents').then(analytics => {
        analytics.default({
            sku,
            skuUtils,
            analyticsData,
            digitalData,
            addToCartPixels,
            fireGABeginCheckout,
            anaUtils,
            quantity
        });
    });
}

function dispatchRemoveFromBasket(windowObj, itemData = {}) {
    const {
        productName, brandName, variationValue, listPrice, salePrice, quantity
    } = itemData.sku;
    const removedFromBasketData = {
        id: itemData.sku?.skuId || itemData.sku?.primaryProduct?.productId,
        name: productName || variationValue,
        brand: brandName || '',
        variant: variationValue || '',
        quantity: quantity || 1,
        price: salePrice || listPrice
    };
    windowObj.dispatchEvent(new CustomEvent('RemoveFromBasket', { detail: removedFromBasketData }));
}

function determineActionInfoForItemRemoval(isSample, containerTitle, removeText, analyticsContext, isBopisBasket) {
    const conditions = [
        { check: () => isSample && !containerTitle, result: 'Remove samples from Basket' },
        { check: () => containerTitle && analyticsContext !== analyticsConsts.CONTEXT.CONTENT_STORE, result: `${containerTitle}:${removeText}` },
        { check: () => isBopisBasket, result: 'basket:delete' },
        { check: () => true, result: `${removeText}` }
    ];

    const actionInfo = conditions.find(condition => condition.check()).result;

    return actionInfo;
}

function trackItemRemoval(data) {
    dispatchRemoveFromBasket(window, data);
    const { sku, analyticsData = {}, analyticsContext, basket } = data;
    const skuWithRemovalProperty = {
        ...sku,
        isRemoval: true
    };

    const isSample = skuUtils.isSample(sku);
    const { containerTitle = '', isBIRBPageRewardModal, totalBasketCount } = analyticsData;
    const removeText = 'remove from basket';
    const isBopisBasket = Storage.local.getItem(LOCAL_STORAGE.BASKET_TYPE) === BASKET_TYPES.BOPIS_BASKET;
    const intCampRemoveText = analyticsContext === analyticsConsts.CONTEXT.BI_REWARDS_CAROUSEL ? 'remove-from-basket' : removeText;
    const actionInfo = determineActionInfoForItemRemoval(isSample, containerTitle, removeText, analyticsContext, isBopisBasket);
    const internalCampaign = containerTitle
        ? `${containerTitle}:${sku.productId}:${intCampRemoveText}`
        : !Location.isBasketPage() && intCampRemoveText;
    const recentEvent = anaUtils.getLastAsyncPageLoadData();
    const worldAttribute = digitalData.page.attributes.world || 'n/a';
    const pageName =
        data.isBiReward && analyticsContext === analyticsConsts.PAGE_TYPES.QUICK_LOOK
            ? `quicklook:${data.sku.productId.toLowerCase()}:${worldAttribute}:*pname=${data.sku.productName.toLowerCase()}`
            : data.isBiReward
                ? recentEvent.previousPage
                : digitalData.page.attributes.sephoraPageInfo.pageName;
    const pageDetail = pageName?.split(':')[1];

    processEvent.process(analyticsConsts.LINK_TRACKING_EVENT, {
        data: {
            bindingMethods: [removeFromBasketEvent],
            eventStrings: [analyticsConsts.Event.SC_REMOVE],
            linkName: isSample ? 'Remove samples from Basket' : isBopisBasket ? 'basket:delete' : 'Remove From Basket',
            sku: skuWithRemovalProperty,
            actionInfo,
            internalCampaign,
            isBIRBPageRewardModal,
            ...recentEvent,
            pageName,
            pageDetail,
            previousPage: digitalData.page.attributes.previousPageData?.pageName,
            totalBasketCount,
            basket
        }
    });
    removeProductFromReferer(sku);
}

/**
 * Add analytics to the originally passed in success callback
 * @param  {obj} data - All the data we need
 * @return {function} - A new function that will be used as the success callback
 */
function createDecoratedSuccessCallback({ basketResponse, basket, ...data }) {
    const improvedAnalyticsData = getImprovedData(basketResponse, data);

    return function () {
        const {
            successCallback: originalCallback = () => {}, isInBasket = false, isBiReward, sku, basketType, isAdd = false
        } = data;
        const basketItems = { items: basketType === BasketType.BOPIS ? basketResponse.pickupBasket.items : basketResponse.items };
        let isSkuInBasket = isInBasket;

        if (Sephora.configurationSettings.calculateIsInBasketFlagOnChannel) {
            isSkuInBasket = skuHelpers.isInBasket(sku.skuId, basketType?.length ? basketItems : null);
        }

        isSkuInBasket && isBiReward && !isAdd
            ? trackItemRemoval({ ...improvedAnalyticsData, basket })
            : handleAddToBasketAnalytics(improvedAnalyticsData);
        // Not all calls for "AddToBasket" action have a succeess callback
        originalCallback?.apply(null, arguments);
    };
}

function addMultipleSkusToBasket(
    skus,
    skusQuantity,
    successCallback,
    analyticsContext,
    analyticsData = {},
    mainSku = {},
    isProductBundling,
    basketType = BasketType.Standard
) {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let mainSkuQty = 1;
    const skuQuantities = skus.map(sku => {
        if (mainSku.skuId === sku.skuId) {
            mainSkuQty = sku.qty;
        }

        return sku.qty;
    });

    const totalSkusQuantity = skuQuantities.reduce(reducer);
    const operation = isProductBundling ? OPERATION.ADDED_MULTIPLE_PRODUCTS : OPERATION.ADDED_PRODUCT;

    return dispatch => {
        return basketApi
            .addToCart({
                orderId: basketUtils.getOrderId(),
                skuList: skus.map(sku => {
                    return {
                        qty: sku.qty,
                        skuId: sku.skuId,
                        productId: sku.productId || '',
                        isAcceptTerms: sku.isAcceptTerms
                    };
                })
            })
            .then(
                makeGenericAddUpdateProductToBasketSuccessHandler({
                    dispatch,
                    quantity: totalSkusQuantity,
                    performedAction: operation,
                    successCallback
                })
            )
            .then(basketResponse => {
                return createDecoratedSuccessCallback({
                    sku: mainSku,
                    analyticsContext,
                    analyticsData,
                    skuList: skus,
                    quantity: mainSkuQty,
                    basketType,
                    basketResponse
                });
            })
            .catch(makeGenericBasketOperationFailureHandler({ dispatch }));
    };
}

/**
 * Function to add a new sample to the basket
 * The 'Add Samples to Basket API' receives an array of samples sku.
 * If only one sku is added it will replace the list of samples added
 * previously
 * @param sku
 * @param quantity
 * @param successCallback
 */
function addSampleToBasket(sku, quantity, decoratedSuccessCallbackParams, productId) {
    return dispatch => {
        // basket.samples contains an array of Sample objects,
        // we only need an array of Sample skuId
        const samples = basketUtils.getBasketSamples();
        const filteredSamples = skuUtils.getFilteredSamples(samples);

        const sampleSkuIdList = filteredSamples.map(item => item.sku.skuId);
        const sampleSkuList = filteredSamples.map(item => {
            return {
                skuId: item.sku.skuId,
                productId: item.sku.productId
            };
        });
        sampleSkuIdList.push(sku.skuId);
        sampleSkuList.push({
            skuId: sku.skuId,
            productId: productId
        });

        digitalData.product = [
            {
                attributes: { nthLevelCategory: undefined },
                productInfo: { manufacturer: '' }
            }
        ];

        return decorators
            .withInterstice(basketApi.addSamplesToBasket, INTERSTICE_DELAY_MS)(sampleSkuIdList, sampleSkuList)
            .then(basketResponse => {
                const decoratedSuccessCallback = createDecoratedSuccessCallback({
                    ...decoratedSuccessCallbackParams,
                    basketResponse,
                    basket: basketResponse?.basket
                });

                return makeGenericAddUpdateProductToBasketSuccessHandler({
                    dispatch,
                    quantity,
                    performedAction: OPERATION.ADDED_SAMPLE,
                    successCallback: decoratedSuccessCallback,
                    sku,
                    basket: basketResponse?.basket
                })(basketResponse);
            })
            .catch(makeGenericBasketOperationFailureHandler({ dispatch, sku }));
    };
}

/**
 * Removes an Sku from the Basket
 * @param  {Object} sku - The sku to be removed
 * @param  {Boolean} samplePanel - Whether or not the item removed is in the sample panel (optional)
 * @param  {Boolean} trackAna - Whether or not to track the removal (optional)
 * @param  {Boolean} modifyConfirmed - Appends modifyConfirmed=true to the url.  This is used when
 * calling a second time following a 202 response from the server (see API docs for details)
 * @returns {Function} Action to be performed
 */
function removeProductFromBasket({
    sku,
    samplePanel = false,
    trackAna = true,
    modifyConfirmed = false,
    isMergedBasket = false,
    isRopisSku = false,
    prevPromotions,
    productId
}) {
    return dispatch => {
        const basket = store.getState().basket;

        return basketApi
            .removeSkuFromBasket(basketUtils.getOrderId(), sku.skuId, modifyConfirmed, isRopisSku, productId)
            .then(data => {
                filterBasketWarningErrorMessages({ basketLevelMessages: data?.basketLevelMessages, sku });

                if (!isMergedBasket) {
                    dispatch(showError());
                }

                // Extract promo warning from a basket level messages and set it as an error
                if (data.basketLevelMessages && data.basketLevelMessages.length) {
                    const removedPromo = prevPromotions?.filter(code => {
                        return data.appliedPromotions.indexOf(code.couponCode) < 0;
                    });

                    const errorMessages = data.basketLevelMessages.reduce((acc, msg) => {
                        if (msg.messageContext === basketConstants.PROMO_WARNING) {
                            acc.push(msg.messages[0]);
                        }

                        return acc;
                    }, []);

                    if (errorMessages.length) {
                        dispatch(showError(errorMessages));

                        if (removedPromo?.[0]?.couponCode) {
                            promoUtils.removePromo(removedPromo[0]?.couponCode);
                        }
                    }
                }

                const improvedAnalyticsData = getImprovedData(data, {
                    sku,
                    samplePanel
                });

                trackAna &&
                    trackItemRemoval({
                        ...improvedAnalyticsData,
                        basket
                    });

                dispatch(updateBasket(data));
                fetchRewardsAfterBasketUpdate(dispatch);
            })
            .catch(reason => {
                if (reason.responseStatus === HTTP_STATUS_ACCEPTED) {
                    const messages = reason.errorMessages;

                    // Append a period and a line break to the last product
                    if (Array.isArray(messages) && messages.length > 0) {
                        let lastProductName = messages[messages.length - 1];
                        lastProductName += '.';
                        messages[messages.length - 1] = lastProductName;
                        messages.push('');
                    }

                    messages.push(getText('sureToContinueMessage'));
                    confirmBasketUpdateModal(dispatch, messages.join(''), () => {
                        dispatch(
                            removeProductFromBasket({
                                sku,
                                samplePanel,
                                trackAna,
                                modifyConfirmed: true,
                                isRopisSku,
                                productId
                            })
                        );
                        dispatch(Actions.showInfoModal({ isOpen: false }));
                    });
                } else {
                    dispatch(showError(reason));
                }
            });
    };
}

function removeRewardFromBasket(sku, successCallbackParams, productId, fulfillmentType) {
    const basket = store.getState().basket;

    return dispatch => {
        return decorators
            .withInterstice(beautyInsiderApi.removeBiRewardFromBasket, INTERSTICE_DELAY_MS)(
                basketUtils.getOrderId(),
                sku.skuId,
                productId,
                fulfillmentType
            )
            .then(data => {
                const { analyticsContext, analyticsData, successCallback } = successCallbackParams;

                if (typeof successCallback === 'function') {
                    successCallback(data);
                }

                const improvedAnalyticsData = getImprovedData(data.basket, {
                    sku,
                    analyticsContext,
                    analyticsData
                });

                trackItemRemoval({
                    ...improvedAnalyticsData,
                    basket
                });

                dispatch(updateBasket(data.basket));
                fetchRewardsAfterBasketUpdate(dispatch, sku);
                dispatch(showError());
            })
            .catch(reason => {
                const itemsAndErrors = basketUtils.catchItemLevelErrors(reason);
                dispatch(showError(reason.errors, itemsAndErrors, reason.errorMessages));
                ErrorsUtils.renderGenericErrorModal(reason.errorMessages[0]);

                return Promise.reject(reason);
            });
    };
}

/**
 * Determines the type of item to be removed and calls the corresponding action
 * @param  {Object} item - The item to be removed
 * @param  {Boolean} trackAna - Whether or not to track the removal (optional)
 * @param  {Boolean} isMergedBasket = Whether or not we are auto removing item from a merged basket
 * @returns {Function} Action to be performed
 */
function removeItemFromBasket(item, trackAna, isMergedBasket, isRopisSku = false, prevPromotions) {
    return dispatch => {
        fireGABeginCheckout({ id: item.sku.skuId }, 'removeItem');
        item.sku.quantity = item.qty ? item.qty : 1;
        const isReward = skuUtils.isBiReward(item.sku);

        if (isReward) {
            return dispatch(removeRewardFromBasket(item.sku, Empty.Object, item.sku.productId));
        } else if (skuUtils.isGwp(item.sku)) {
            return promoUtils.removePromo();
        } else {
            return dispatch(
                removeProductFromBasket({
                    sku: item.sku,
                    samplePanel: false,
                    trackAna,
                    modifyConfirmed: false,
                    isMergedBasket,
                    isRopisSku,
                    prevPromotions,
                    productId: item.sku.productId
                })
            );
        }
    };
}

const handleRewards = ({
    isInBasket, sku, successCallbackParams, productId, quantity, googleAnalyticsChangedBasketData, fulfillmentType
}) => {
    let result;

    if (isInBasket) {
        result = removeRewardFromBasket(sku, successCallbackParams, productId, fulfillmentType);
        fireGABeginCheckout(googleAnalyticsChangedBasketData, 'removeItem');
    } else {
        result = addRewardToBasket(sku.skuId, quantity, successCallbackParams, sku.brandName, productId, fulfillmentType);
    }

    return result;
};

const handleSamples = ({
    sku,
    successCallback,
    analyticsContext,
    analyticsData,
    isInBasket,
    samplePanel,
    quantity,
    basketType,
    productId,
    googleAnalyticsChangedBasketData,
    isBiReward,
    successCallbackParams,
    showBasketQuickAdd,
    isAutoReplenish,
    replenishmentFrequency,
    showBasketCarouselErrorModal
}) => {
    let result;

    if (isInBasket) {
        result = removeProductFromBasket({
            sku,
            samplePanel,
            trackAna: true,
            modifyConfirmed: false,
            isMergedBasket: false,
            isRopisSku: false,
            prevPromotions: [],
            productId
        });
        fireGABeginCheckout(googleAnalyticsChangedBasketData, 'removeItem');
    } else if (skuUtils.isPDPSample(sku)) {
        result = addProductToBasket(
            sku,
            basketType,
            quantity,
            !!Location.isBasketPage(),
            successCallbackParams,
            showBasketQuickAdd,
            isAutoReplenish,
            replenishmentFrequency,
            productId,
            showBasketCarouselErrorModal
        );
    } else {
        result = addSampleToBasket(
            sku,
            quantity,
            {
                sku,
                successCallback,
                analyticsContext,
                analyticsData,
                isInBasket,
                samplePanel,
                isBiReward,
                quantity,
                basketType
            },
            productId
        );
    }

    return result;
};

function addToBasket(
    sku,
    basketType = BasketType.Standard,
    qty,
    successCallback,
    analyticsContext,
    samplePanel = false,
    analyticsData = {},
    showBasketQuickAdd,
    isAutoReplenish = false,
    replenishmentFrequency = '',
    productId,
    isGalleryLightBox = false,
    showBasketCarouselErrorModal = false,
    isChooseOptionsModal = false,
    product
) {
    const isInBasket = skuHelpers.isInBasket(sku.skuId);
    const isBiReward = skuUtils.isBiReward(sku);
    const quantity = parseInt(qty);
    const successCallbackParams = {
        sku,
        product,
        successCallback,
        analyticsContext,
        analyticsData,
        isInBasket,
        samplePanel,
        isBiReward,
        quantity,
        basketType,
        isGalleryLightBox,
        isChooseOptionsModal
    };

    let result;

    store.dispatch(inlineBasketActions.productAdded(sku));

    const googleAnalyticsChangedBasketData = {
        id: sku.skuId,
        name: analyticsData.productName,
        brand: analyticsData.brandName || '',
        variant: sku.variationValue || '',
        quantity: quantity || 1,
        price: sku.listPrice || '0.00'
    };

    if (isBiReward) {
        result = handleRewards({
            isInBasket,
            sku,
            successCallbackParams,
            productId,
            quantity,
            googleAnalyticsChangedBasketData,
            fulfillmentType: basketType
        });
    } else if (skuUtils.isSample(sku)) {
        result = handleSamples({
            sku,
            successCallback,
            analyticsContext,
            analyticsData,
            isInBasket,
            samplePanel,
            quantity,
            basketType,
            productId,
            googleAnalyticsChangedBasketData,
            isBiReward,
            successCallbackParams,
            showBasketQuickAdd,
            isAutoReplenish,
            replenishmentFrequency,
            showBasketCarouselErrorModal
        });
    } else {
        result = addProductToBasket(
            sku,
            basketType,
            quantity,
            !!Location.isBasketPage(),
            successCallbackParams,
            showBasketQuickAdd,
            isAutoReplenish,
            replenishmentFrequency,
            productId,
            showBasketCarouselErrorModal
        );
    }

    return result;
}

// TODO We need this for now but should be flagged as legacy
function setBasketType(currentBasketType) {
    const sendBasketType = (Location.isBasketPage() || Location.isCheckout()) && currentBasketType !== BASKET_TYPES.PREBASKET;
    Storage.local.setItem(LOCAL_STORAGE.BASKET_TYPE, currentBasketType, BASKET_EXPIRY);

    if (sendBasketType) {
        const { testTarget } = store.getState();
        spaUtils.resetTestAndTarget(testTarget, true);
    }

    return {
        type: TYPES.SET_BASKET_TYPE,
        currentBasketType
    };
}

export default {
    addMultipleSkusToBasket,
    addToBasket, // skuType-independent add sku to basket.
    BASKET_TYPES,
    clearPendingProductList,
    dispatchRemoveFromBasket,
    fetchRewardsAfterBasketUpdate,
    fireGABeginCheckout,
    handleAddToBasketAnalytics,
    handleAddToBasketErrorAnalytics,
    refreshBasket, // Fetch basket from server and put it into store. No parameters needed.
    removeItemFromBasket,
    removeProductFromBasket,
    setBasketType,
    showError,
    showPaypalRestrictedMessage,
    showStickyApplePayBtn,
    trackItemRemoval,
    TYPES
};
