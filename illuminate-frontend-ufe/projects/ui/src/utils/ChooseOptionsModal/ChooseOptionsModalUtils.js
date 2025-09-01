import store from 'store/Store';
import Actions from 'Actions';
import snbApi from 'services/api/search-n-browse';
import uiUtils from 'utils/UI';
import PageTemplateType from 'constants/PageTemplateType';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import decorators from 'utils/decorators';
import { showBuyItAgainATBModalSelector } from 'selectors/testTarget/offers/showBuyItAgainATBModal/showBuyItAgainATBModalSelector';
import Empty from 'constants/empty';
import { COMPONENT_SIDS } from 'constants/ShopYourStore';
import basketConstants from 'constants/Basket';
import { DELIVERY_OPTION_TYPES, COMPONENT_SIDS as SIDS } from 'components/GlobalModals/ChooseOptionsModal/constants';
import localeUtils from 'utils/LanguageLocale';
import ChooseOptionsModalBindings from 'analytics/bindingMethods/components/globalModals/chooseOptionsModal/ChooseOptionsModalBindings';

const { DELIVERY_OPTIONS } = basketConstants;

const { withInterstice } = decorators;
const { SHOP_MY_STORE_BUY_IT_AGAIN, SHOP_SAME_DAY_BUY_IT_AGAIN, SHOP_MY_STORE_FROM_YOUR_LOVES, SHOP_SAME_DAY_FROM_YOUR_LOVES } = COMPONENT_SIDS;
const { BASKET_YOUR_SAVED_ITEMS_CAROUSEL } = SIDS;
const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/ChooseOptionsModal/locales', 'ChooseOptionsModal');

function isChooseOptionsForMyListsEnabled() {
    const { myLists = Empty.Object } = Sephora.configurationSettings.chooseOptionsModal || Empty.Object;

    return myLists.isEnabled === true;
}

function areAllKillSwitchesDisabled(buyItAgain, myLists) {
    return !buyItAgain.isEnabled && !myLists.isEnabled;
}

function getEligiblePagesToShowChooseOptionsModal(props) {
    const { componentName = '' } = props;
    const { buyItAgain = Empty.Object, myLists = Empty.Object } = Sephora.configurationSettings.chooseOptionsModal || Empty.Object;

    if (areAllKillSwitchesDisabled(buyItAgain, myLists)) {
        return [];
    }

    const eligiblePages = [];
    const state = store.getState();
    const showBuyItAgainATBModal = showBuyItAgainATBModalSelector(state) || Empty.Object;
    let shouldIncludeShopPages = false;

    if (buyItAgain.isEnabled) {
        if (showBuyItAgainATBModal.show) {
            eligiblePages.push(PageTemplateType.PurchaseHistory);
        }

        if (componentName === SHOP_MY_STORE_BUY_IT_AGAIN || componentName === SHOP_SAME_DAY_BUY_IT_AGAIN) {
            shouldIncludeShopPages = true;
        }
    }

    if (myLists.isEnabled) {
        eligiblePages.push(PageTemplateType.MyLists, PageTemplateType.MyCustomList);

        if (componentName === BASKET_YOUR_SAVED_ITEMS_CAROUSEL) {
            eligiblePages.push(PageTemplateType.RwdBasket);
        }

        if (componentName === SHOP_MY_STORE_FROM_YOUR_LOVES || componentName === SHOP_SAME_DAY_FROM_YOUR_LOVES) {
            shouldIncludeShopPages = true;
        }
    }

    if (shouldIncludeShopPages) {
        eligiblePages.push(PageTemplateType.ShopMyStore, PageTemplateType.ShopSameDay);
    }

    return eligiblePages;
}

function shouldShowChooseOptionsModal(props = {}) {
    const { isInlineLoves = false, isSharableList = false, fromChooseOptionsModal = false } = props;
    const { buyItAgain = Empty.Object, myLists = Empty.Object } = Sephora.configurationSettings.chooseOptionsModal || Empty.Object;

    if (fromChooseOptionsModal || areAllKillSwitchesDisabled(buyItAgain, myLists)) {
        return false;
    }

    const eligiblePages = getEligiblePagesToShowChooseOptionsModal(props);
    const isCurrentPageEligible = eligiblePages.includes(Sephora.pagePath);
    const isInlineEligible = myLists.isEnabled && (isInlineLoves || isSharableList);

    return isCurrentPageEligible || isInlineEligible;
}

function createSkuUpdateHandler(setState) {
    return currentSku => {
        setState(prevState => ({
            ...prevState,
            currentSku: currentSku
        }));
    };
}

function getEffectiveCurrentSku(currentSkuFromState, currentSkuFromProps, parentProduct) {
    return currentSkuFromState || currentSkuFromProps || (parentProduct && parentProduct.currentSku);
}

function isXS() {
    return uiUtils.getBreakpoint() === 'xs';
}

function getInitialViewportState() {
    return {
        isSmallView: isXS()
    };
}

function dispatchChooseOptions({
    productId, skuType, options, sku, analyticsContext, pageName, componentName, isInlineLoves
}) {
    let requestOptions = options;

    if (sku.skuId) {
        requestOptions = {
            ...requestOptions,
            preferredSku: sku.skuId
        };
    }

    withInterstice(snbApi.getProductDetailsLite, INTERSTICE_DELAY_MS)(productId, sku.skuId, requestOptions, {})
        .then(async product => {
            const { currentSku = null } = product;

            const argumentsObj = {
                isOpen: true,
                product,
                sku: currentSku || sku,
                skuType: currentSku?.type || skuType,
                analyticsContext: analyticsContext,
                pageName: pageName,
                error: null
            };

            ChooseOptionsModalBindings.modalOpen({
                skuId: currentSku?.skuId,
                analyticsContext,
                componentName,
                isInlineLoves
            });

            store.dispatch(Actions.showChooseOptionsModal(argumentsObj));
        })
        .catch(() => {
            const title = getText('chooseOptions') || Empty.String;
            store.dispatch(
                Actions.showGenericErrorModal({
                    isOpen: true,
                    title
                })
            );
        });
}

/**
 * Maps the delivery option string to a type constant.
 * @param {string} deliveryOption - The delivery option string.
 * @returns {null|string} - Returns the corresponding type constant or null if not found.
 */
function mapDeliveryOptionToType(deliveryOption) {
    switch (deliveryOption) {
        case DELIVERY_OPTIONS.STANDARD:
            return DELIVERY_OPTION_TYPES.SHIPPED;
        case DELIVERY_OPTIONS.SAME_DAY:
            return DELIVERY_OPTION_TYPES.SAME_DAY;
        case DELIVERY_OPTIONS.PICKUP:
            return DELIVERY_OPTION_TYPES.PICKUP;
        case DELIVERY_OPTIONS.AUTO_REPLENISH:
            return DELIVERY_OPTION_TYPES.AUTO_REPLENISH;
        default:
            return null;
    }
}

export default {
    shouldShowChooseOptionsModal,
    dispatchChooseOptions,
    createSkuUpdateHandler,
    getEffectiveCurrentSku,
    getInitialViewportState,
    getEligiblePagesToShowChooseOptionsModal,
    mapDeliveryOptionToType,
    isChooseOptionsForMyListsEnabled
};
