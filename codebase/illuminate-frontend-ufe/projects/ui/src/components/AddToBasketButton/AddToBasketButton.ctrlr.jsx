/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import basketUtils from 'utils/Basket';
import {
    Text, Button, Flex, Icon, Link
} from 'components/ui';
import OutOfStockButton from 'components/AddToBasketButton/OutOfStockButton/OutOfStockButton';
import skuUtils from 'utils/Sku';
import LanguageLocale from 'utils/LanguageLocale';
import Location from 'utils/Location';
import Debounce from 'utils/Debounce';
import ReactDOM from 'react-dom';
import rrcUtils from 'utils/RrcTermsAndConditions';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import { breakpoints, space } from 'style/config';
import quicklookModalUtils from 'utils/Quicklook';
import basketConstants from 'constants/Basket';
import Empty from 'constants/empty';
import DeliveryFrequency from 'utils/DeliveryFrequency';
import storeUtils from 'utils/Store';
import helpersUtils from 'utils/Helpers';
import promoUtils from 'utils/Promos';
import productPageSOTBindings from 'analytics/bindingMethods/pages/productPage/productPageSOTBindings';
import processEvent from 'analytics/processEvent';
import rwdBasketUtils from 'utils/RwdBasket';
import skuHelpers from 'utils/skuHelpers';
// import { DELIVERY_METHOD_TYPES } from 'constants/RwdBasket';
import skuUtil from 'utils/Sku';
import chooseOptionsModalUtils from 'utils/ChooseOptionsModal/ChooseOptionsModalUtils';
import isFunction from 'utils/functions/isFunction';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const { getLocaleResourceFile } = LanguageLocale;
const { formatFrequencyType } = DeliveryFrequency;
const { formatSiteCatalystPrice, deferTaskExecution } = helpersUtils;
const { BasketType, PROMO_WARNING } = basketConstants;
const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = basketUtils;
const { findBasketTypeBySkuId } = rwdBasketUtils;

const THROTTLE_DELAY = 200;
const ADDED_TEXT_TIMEOUT = 1000;
const BASKET_TYPE_TO_TEXT = {
    [BasketType.BOPIS]: 'storePickup',
    [BasketType.SameDay]: 'sameDayDelivery',
    [BasketType.Standard]: 'standardShipping'
};

function getPendingSkus(pendingBasketSkus) {
    return pendingBasketSkus.filter(item => {
        if (item.methodId) {
            item.method();

            return false;
        }

        return true;
    });
}

class AddToBasketButton extends BaseClass {
    state = {
        disabled: true,
        showAddToBasketModal: false,
        isSample: skuUtils.isSample(this.props.sku),
        isAdded: false,
        basketIsBopisKohlsAndHasItems: false,
        clickIsFromBazaar: false,
        isEligible: false,
        basketType: null
    };

    handleClickButton = e => {
        e.stopPropagation();
        e.preventDefault();

        if (!Location.isBasketPage() && !Location.isCheckout()) {
            this.props.setBasketType(null);
        }

        const {
            sku, isRRCModal, isRewardItem, rewardFulfillmentConfiguration, showRewardFulfillmentMethodModal, isQuickLook
        } = this.props;

        const isRougeRewardCard = skuUtils.isRougeRewardCard(sku);
        const isBiReward = skuUtils.isBiReward(sku);

        let handleClick = !isRRCModal && isRougeRewardCard ? this.addClickModal : this.handleAddClick;

        if (this.state.isInBasket && (this.state.isSample || isRougeRewardCard || isBiReward)) {
            handleClick = this.handleAddClick;
        }

        if (
            !this.state.isInBasket &&
            isRewardItem &&
            rewardFulfillmentConfiguration?.shouldShowRewardFulfillmentMethodModal &&
            Location.isBasketPage()
        ) {
            handleClick = () => showRewardFulfillmentMethodModal(true, { sku });
        }

        if (!isQuickLook && chooseOptionsModalUtils.shouldShowChooseOptionsModal(this.props)) {
            handleClick = () => this.handleShowChooseOptionsModal(this.props);
        }

        deferTaskExecution(() => {
            handleClick();
        });
    };

    isDisabled = ({ isAppExclusive, isInAutoReplenishmentBasket }) => {
        const {
            sku, product, disabled, isCustomSets, preferredStore, autoReplenishChecked, isRewardItem, isBIPointsAvailable
        } = this.props;
        const basketType = this.state.basketType || this.props.basketType;
        const { preferredStoreInfo } = preferredStore;
        const { customSetsChoices = Empty.Array } = product || Empty.Object;

        const isBOPISAndUnavailable =
            basketType === BasketType.BOPIS &&
            (skuUtils.isReservationNotOffered(sku) ||
                (!Sephora.configurationSettings.isBOPISEnabled && preferredStoreInfo?.isBopisable) ||
                (!Sephora.configurationSettings.isROPISEnabled && preferredStoreInfo?.isRopisable) ||
                (!preferredStoreInfo?.isBopisable && !preferredStoreInfo?.isRopisable));

        const isRewardAndDisabled = isRewardItem && isBIPointsAvailable && !this.state.isInBasket && this.state.isRewardDisabled;
        const isAddedSample = this.state.isInBasket && this.state.isSample;

        return (
            (!this.props.isExperiment &&
                (this.state.disabled ||
                    (disabled && !isAddedSample) ||
                    (skuUtils.isBiExclusive(sku) && !skuHelpers.isBiQualify(sku)) ||
                    skuUtils.isGwp(sku) ||
                    isAppExclusive ||
                    isBOPISAndUnavailable ||
                    (isCustomSets && customSetsChoices.length === 0))) ||
            isRewardAndDisabled ||
            (autoReplenishChecked && isInAutoReplenishmentBasket)
        );
    };

    render() {
        const getText = getLocaleResourceFile('components/AddToBasketButton/locales', 'AddToBasketButton');
        /* eslint-disable prefer-const */
        let {
            sku,
            variant,
            text,
            disabled,
            isRRCModal,
            analyticsContext,
            originalContext,
            productId,
            isQuickLook,
            promoPanel,
            containerTitle,
            isBIRBReward,
            isBIRBPageRewardModal,
            productName,
            basketType,
            isAddFullSize,
            callback,
            isCustomSets,
            isAddButton,
            displayQuantityPickerInATB,
            preferredStore,
            autoReplenishChecked,
            rootContainerName,
            isMultiProductsAdd,
            isRewardItem,
            onlyUseTextProp,
            isBIPointsAvailable,
            isRwdBasketPage,
            onSuccess,
            customStyle,
            productSampleModal,
            isSharableList = false,
            ...props
        } = this.props;

        const { basketIsBopisKohlsAndHasItems, isInAutoReplenishmentBasket } = this.state;
        /* eslint-enable prefer-const */

        const isBiReward = skuUtils.isBiReward(sku);

        const { isChooseOptionsModal } = this.props;
        const isOutOfStock = skuHelpers.isSkuOutOfStockByBasketType(sku, basketType, isChooseOptionsModal);
        const isCustomSetsOutOfStock =
            isCustomSets && skuHelpers.isSkuOutOfStockByBasketType(this.props.product?.currentSku, basketType, isChooseOptionsModal);

        if (isOutOfStock || isCustomSetsOutOfStock) {
            return (
                <React.Fragment>
                    <OutOfStockButton
                        {...props}
                        basketType={basketType}
                        variant={variant}
                        analyticsContext={analyticsContext}
                        sku={isCustomSets ? this.props.product?.currentSku : sku}
                        customStyle={customStyle}
                    />
                </React.Fragment>
            );
        } else if (isSharableList && skuUtils.isCountryRestricted(sku)) {
            return (
                <Text
                    is='p'
                    color='gray'
                >
                    {getText('itemShip')}
                </Text>
            );
        } else {
            const { isAdded } = this.state;

            const isRougeRewardCard = skuUtils.isRougeRewardCard(sku);

            if (this.state.isInBasket && (this.state.isSample || isRougeRewardCard || isBiReward)) {
                text = getText('remove');
                disabled = false;
            }

            const isAppExclusive = skuUtils.isAppExclusive(sku);

            // prevent button width shift during `isAdded` state
            if (!props.minWidth && !text) {
                props.minWidth = isAddButton ? '5.63em' : '10.47em';
            }

            const isDisabled = this.isDisabled({
                isAppExclusive,
                isInAutoReplenishmentBasket
            });

            let variantProp = variant || ADD_BUTTON_TYPE.SECONDARY;

            if (basketType === BasketType.BOPIS) {
                variantProp = ADD_BUTTON_TYPE.SPECIAL;
            }

            return (
                <Button
                    {...props}
                    variant={variantProp}
                    className={isAdded ? 'is-active' : null}
                    disabled={isDisabled || basketIsBopisKohlsAndHasItems}
                    onClick={this.handleClickButton}
                    css={customStyle}
                    maxWidth={productSampleModal ? '80px' : null}
                >
                    {this.renderBasketText({ isAppExclusive, isAdded, removeText: text, displayQuantityPickerInATB })}
                </Button>
            );
        }
    }

    // ToDo: rework pending on https://jira.sephora.com/browse/GUAR-6720
    // getFulfillmentType = () => {
    //     const { autoReplenishChecked, sku, basketType } = this.props;

    //     if (autoReplenishChecked && sku.isReplenishmentEligible) {
    //         return DELIVERY_METHOD_TYPES.AUTOREPLENISH;
    //     } else if (basketType === BasketType.BOPIS) {
    //         return DELIVERY_METHOD_TYPES.BOPIS;
    //     } else if (basketType === BasketType.SameDay) {
    //         return DELIVERY_METHOD_TYPES.SAMEDAY;
    //     } else {
    //         return DELIVERY_METHOD_TYPES.STANDARD;
    //     }
    // };

    // Get the secondary text (the text that appears under the main text, related to Auto Replenishment,
    // Same Day Delivery) for the Add to Basket button
    getSecondaryText = ({ sameDayTitle, supportedBasketType, isBiReward }) => {
        if (isBiReward) {
            return undefined;
        }

        const { autoReplenishChecked, sku } = this.props;

        if (autoReplenishChecked && sku.isReplenishmentEligible) {
            return 'autoReplenish';
        }

        if (sameDayTitle && supportedBasketType === BasketType.SameDay) {
            return 'sameDayCustomDelivery';
        }

        if (supportedBasketType === BasketType.Standard) {
            return 'standardShipping';
        }

        return BASKET_TYPE_TO_TEXT[supportedBasketType];
    };

    renderTwoLines = ({ getText }) => {
        const { suppressCheckmark } = this.props;

        return (
            <Flex
                flexDirection='column'
                paddingLeft={suppressCheckmark ? 2 : 4}
                paddingRight={2}
            >
                <Flex
                    fontWeight='bold'
                    alignItems='center'
                >
                    {suppressCheckmark ? null : (
                        <Icon
                            name='checkmark'
                            size='1em'
                            css={{
                                position: 'absolute',
                                transform: `translateX(calc(-100% - ${space[1]}px))`
                            }}
                        />
                    )}
                    {getText('added')}
                </Flex>
                <Link
                    color='blue'
                    fontSize='11px'
                    fontWeight='normal'
                    children={getText('remove')}
                />
            </Flex>
        );
    };

    // Renders the text inside the Add to Basket button, including its component structure, based on the
    // button's state and the current context
    renderBasketText = ({ isAppExclusive, isAdded, removeText, displayQuantityPickerInATB }) => {
        const { basketIsBopisKohlsAndHasItems, isInAutoReplenishmentBasket } = this.state;
        const {
            isRwdBasketPage,
            onlyUseTextProp,
            sku,
            isExperiment,
            autoReplenishChecked,
            isAddButton,
            isCustomSets,
            basketType,
            isAddTwoLines,
            isRewardItem,
            itemsByBasket,
            pickupBasketItems,
            isOmniRewardEnabled,
            isRougeExclusiveCarousel,
            showQuantityPicker,
            skuQuantity
        } = this.props;
        let fontWeightMainText = 'bold';
        let fontWeightSecondaryText = 'normal';
        const getText = getLocaleResourceFile('components/AddToBasketButton/locales', 'AddToBasketButton');
        let { ctaTwoLines } = this.props;

        if (isRewardItem || isRougeExclusiveCarousel) {
            ctaTwoLines = true;
        }

        if ((isRwdBasketPage && removeText === getText('remove')) || (isAddTwoLines && removeText === getText('remove'))) {
            return this.renderTwoLines({ getText });
        }

        let forceUseSecondaryText = false;
        let secondaryText;

        if ((isRewardItem || isRougeExclusiveCarousel) && isOmniRewardEnabled && this.state.isInBasket) {
            const basketForReward = findBasketTypeBySkuId(sku.skuId, itemsByBasket, pickupBasketItems);
            forceUseSecondaryText = true;
            secondaryText = getText(basketForReward);
        }

        if (onlyUseTextProp != null && !forceUseSecondaryText) {
            return removeText || onlyUseTextProp;
        }

        const isBiExclusive = skuUtils.isBiExclusive(sku);

        if (!isExperiment && (isAppExclusive || (isBiExclusive && !skuHelpers.isBiQualify(sku)))) {
            return (
                <span
                    css={this.props.size === 'sm' && { fontSize: '.875em' }}
                    children={`${skuUtils.getExclusiveText(sku)} ${getText('exclusive')}`}
                />
            );
        }

        const addPrefix = isAdded ? 'added' : 'add';
        let mainText = getText(isAddButton ? addPrefix : `${addPrefix}ToBasket`);

        if (removeText) {
            mainText = removeText;
        }

        if (isCustomSets) {
            mainText = getText('addAllToBasket');
        }

        if (basketIsBopisKohlsAndHasItems) {
            mainText = getText('alreadyAddedKohls');
            fontWeightMainText = 'normal';
            fontWeightSecondaryText = 'bold';
        }

        if (autoReplenishChecked && isInAutoReplenishmentBasket) {
            mainText = getText('alreadyAddedKohls');
            fontWeightMainText = 'bold';
            fontWeightSecondaryText = 'normal';
        }

        const isBiReward = skuUtils.isBiReward(sku);
        const sameDayTitle = this.props.product?.currentSku?.sameDayTitle;
        const supportedBasketType = isCustomSets || isBiReward ? BasketType.Standard : basketType;

        if (!forceUseSecondaryText) {
            secondaryText = this.getSecondaryText({
                sameDayTitle,
                supportedBasketType,
                isBiReward
            });
        }

        if (showQuantityPicker && displayQuantityPickerInATB && skuQuantity && isInAutoReplenishmentBasket) {
            secondaryText = Empty.String;
        }

        const getLocaleLiteralString = () => {
            if (forceUseSecondaryText) {
                return secondaryText;
            }

            const dynamicText = autoReplenishChecked
                ? [`${this.props.replenishmentFreqNum} ${formatFrequencyType(this.props.replenishmentFreqNum, this.props.replenishmentFreqType)}`]
                : sameDayTitle
                    ? [sameDayTitle]
                    : '';

            return getText(secondaryText, dynamicText);
        };

        return secondaryText && ctaTwoLines ? (
            <Text
                fontSize='sm'
                fontWeight={fontWeightMainText}
            >
                {mainText}
                <Text
                    display='block'
                    fontWeight={fontWeightSecondaryText}
                    marginTop='.125em'
                >
                    {getLocaleLiteralString()}
                </Text>
            </Text>
        ) : (
            mainText
        );
    };

    setPropertiesFromBasket = () => {
        const {
            basketItems, pickupBasketItems, itemCount, fromBazaar, sku
        } = this.props;
        const basketType = this.state.basketType || this.props.basketType;
        const currentBasketItems = basketType === BasketType.BOPIS ? pickupBasketItems : basketItems;

        if (currentBasketItems) {
            this.setState({
                isInBasket: skuHelpers.isInBasket(sku?.skuId, basketType?.length ? { items: currentBasketItems } : null),
                disabled: itemCount === null,
                isInAutoReplenishmentBasket: skuHelpers.isInAutoReplenishmentBasket(sku?.skuId, { items: basketItems }),
                clickIsFromBazaar: fromBazaar
            });
        }
    };

    componentDidMount() {
        const { isNthCategoryPage, sku } = this.props;

        const basketTypeFromStorage = Storage.local.getItem(LOCAL_STORAGE.BASKET_TYPE);
        this.setState({ basketType: this.props.basketType || basketTypeFromStorage });

        skuUtils.isRewardDisabled(sku).then(isRewardDisabled => {
            this.setState({
                isRewardDisabled,
                isEligible: sku.isEligible
            });
        });

        this.setBasketIsBopisKohlsAndHasItems();

        if (isNthCategoryPage) {
            this.setState({ disabled: false });
        } else {
            this.setPropertiesFromBasket();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const { sku, basketItems, user, isRewardItem } = this.props;
        const isBirthdayGift = skuUtil.isBirthdayGift(sku);

        if (this.props.basketType !== prevProps.basketType) {
            const basketTypeFromStorage = Storage.local.getItem(LOCAL_STORAGE.BASKET_TYPE);
            this.setState({ basketType: this.props.basketType || basketTypeFromStorage });
        }

        if (
            sku.isEligible !== prevProps.sku.isEligible ||
            (isRewardItem && sku.isEligible !== prevState.isEligible) ||
            isBirthdayGift ||
            JSON.stringify(prevProps.user.beautyInsiderAccount) !== JSON.stringify(user.beautyInsiderAccount)
        ) {
            skuUtils.isRewardDisabled(this.props.sku).then(isRewardDisabled => {
                // Prevent an infinite loop when opening the Rewards modal
                if (this.state.isRewardDisabled !== isRewardDisabled) {
                    this.setState({
                        isRewardDisabled,
                        isEligible: this.props.sku.isEligible
                    });
                }
            });
        }

        if ((basketItems && basketItems !== prevProps.basketItems) || sku?.skuId !== prevProps.sku?.skuId) {
            this.setPropertiesFromBasket();
        }

        if (this.checkforBopisAtKohls(prevProps)) {
            this.setBasketIsBopisKohlsAndHasItems(prevProps);
        }
    }

    checkforBopisAtKohls = prevProps => {
        const currentStoreInfo = this.props.preferredStore?.preferredStoreInfo;
        const prevStoreInfo = prevProps.preferredStore?.preferredStoreInfo;
        const currentSku = this.props.sku;
        const prevSku = prevProps.sku;
        const diffBasket = this.props.basketItems && this.props.basketItems !== prevProps.basketItems;
        const diffPrefStoreType = currentStoreInfo?.storeType !== prevStoreInfo?.storeType;
        const diffPrefStoreId = currentStoreInfo?.storeId !== prevStoreInfo?.storeId;
        const diffBasketType = this.props.basketType !== prevProps.basketType;
        const diffSkuId = currentSku?.skuId !== prevSku?.skuId;

        return diffBasket || diffPrefStoreType || diffPrefStoreId || diffBasketType || diffSkuId;
    };

    setBasketIsBopisKohlsAndHasItems = () => {
        const { sku, pickupBasketItems, preferredStore } = this.props;
        const basketType = this.state.basketType || this.props.basketType;

        const hasKohlsItemsInBopisBasket = pickupBasketItems?.filter(item => item.sku.skuId === sku.skuId).length > 0;
        const isBopisBasket = basketType === BasketType.BOPIS;
        const isKohlsStore = storeUtils.isKohlsStore(preferredStore?.preferredStoreInfo);
        const basketIsBopisKohlsAndHasItems = hasKohlsItemsInBopisBasket && isBopisBasket && isKohlsStore;

        this.setState({ basketIsBopisKohlsAndHasItems });
    };

    getAddToBasketSuccessCallback = (callback = Empty.Function) => {
        const { onSuccess, updateAttributionData } = this.props;

        return response => {
            processEvent.process(anaConsts.ADD_TO_CART);

            if (isFunction(onSuccess)) {
                onSuccess();
            }

            // CSF Affiliate u1 update attribution data
            if (isFunction(updateAttributionData)) {
                updateAttributionData();
            }

            callback();

            let errorMessage = '';

            if (response && response.basketLevelMessages) {
                errorMessage = response.basketLevelMessages.find(msg => msg.messageContext === PROMO_WARNING)?.messages[0] || '';
            }

            if (errorMessage.length) {
                promoUtils.showWarningMessage(errorMessage);
            } else if (response && !response.errors && !Location.isBasketPage() && !this.props.suppressAddToCartModal) {
                // Added a property to specifically suppress showing the Add to Cart modal
                if (window.matchMedia(breakpoints.smMin).matches) {
                    this.showAddToBasketModal();
                }
            }
        };
    };

    getAnalyticsData = () => {
        const {
            sku,
            productId,
            productName,
            product = Empty.Object,
            platform,
            containerTitle,
            isBIRBReward,
            origin,
            pageName,
            originalContext,
            isBIRBPageRewardModal = false,
            isAddFullSize = false,
            rootContainerName,
            basketType,
            skuQuantity,
            displayQuantityPickerInATB,
            isMultiProductsAdd,
            autoReplenishChecked,
            analyticsContext,
            personalizedInternalCampaign,
            basket
        } = this.props;

        const category = product?.parentCategory?.displayName || sku?.parentCategory?.displayName;
        const brandName = product?.productDetails?.brand?.displayName || sku.brandName;
        const productDescription = product?.productDetails?.shortDescription
            ? product.productDetails.shortDescription.replace(/<\/?\w+[^>]*\/?>/g, '')
            : undefined;
        const isCreatorStoreFrontPage = Location.isCreatorStoreFrontPage();
        const motomProductId = isCreatorStoreFrontPage ? product?.motomProductId : null;

        let productStrings = '';

        if (autoReplenishChecked) {
            productStrings = [
                anaUtils.buildAutoReplenishDeliveryFrequencyPoductString({
                    skuId: sku.skuId,
                    qty: skuQuantity,
                    price: formatSiteCatalystPrice(sku.listPrice),
                    frequency: sku.replenishmentFreqNum,
                    frequencyType: sku.replenishmentFreqType?.toLowerCase()
                })
            ];
        } else {
            productStrings = [
                anaUtils.buildSingleProductString({
                    sku: this.props.sku,
                    isQuickLook: false,
                    newProductQty: skuQuantity,
                    displayQuantityPickerInATB,
                    basket
                })
            ];
        }

        return {
            ...(motomProductId && { motomProductId }),
            productId: sku.productId || product?.productDetails?.productId || productId,
            productName: sku.productName || productName || product?.productDetails?.displayName,
            productStrings,
            displayQuantityPickerInATB,
            productDescription,
            brandName,
            category,
            skuType: sku.type,
            origin,
            pageName,
            originalContext,
            platform,
            isBIRBReward,
            containerTitle,
            isBIRBPageRewardModal,
            isAddFullSize,
            rootContainerName,
            isPickup: basketType === BasketType.BOPIS,
            isSameDay: basketType === BasketType.SameDay,
            isMultiProductsAdd,
            sku,
            isSameDayDeliveryEligible: sku.isSameDayEligibleSku,
            isOnlineOnly: sku.isOnlineOnly,
            isAvailablePreferredStore: basketType === BasketType.BOPIS ? 'Yes' : 'No',
            analyticsContext,
            personalizedInternalCampaign,
            basket
        };
    };

    // ToDo: rework pending on https://jira.sephora.com/browse/GUAR-6720
    // triggerLinkTrackingAnalytics = () => {
    //     const { sku } = this.props;
    //     const skuId = sku?.skuId || '';
    //     const fulfillmentType = this.getFulfillmentType()?.toLowerCase();
    //     const productStrings = `;${skuId};;;;eVar26=${skuId}|eVar133=${fulfillmentType}`;

    //     const data = {
    //         productStrings
    //     };

    //     processEvent.process(anaConsts.LINK_TRACKING_EVENT, { data });
    // };

    triggerAddToBasketAction = () => {
        const {
            sku,
            quantity = 1,
            analyticsContext,
            samplePanel,
            basketType,
            showBasketQuickAdd = false,
            product,
            showBasketCarouselErrorModal = false,
            itemsByBasket,
            pickupBasketItems,
            isChooseOptionsModal,
            pageName
        } = this.props;

        const productId = sku.productId || product?.productDetails?.productId || this.props.productId;

        let rewardBasketType;
        const isBiReward = skuUtils.isBiReward(sku);

        // ToDo: this is not the place to be implemented
        // must be done on "analytics/bindings/pages/all/addToBasketEvent" as it causes double smetric calls
        // https://jira.sephora.com/browse/GUAR-6374
        // rework pending on https://jira.sephora.com/browse/GUAR-6720
        // this.triggerLinkTrackingAnalytics();

        const autoReplenishFrequency = this.props.autoReplenishChecked
            ? `${this.props.replenishmentFreqType}:${this.props.replenishmentFreqNum}`
            : '';

        if (isBiReward && this.state.isInBasket) {
            rewardBasketType = findBasketTypeBySkuId(sku.skuId, itemsByBasket, pickupBasketItems);
        }

        this.props.addToBasket(
            sku,
            rewardBasketType || basketType,
            quantity,
            this.getAddToBasketSuccessCallback(),
            analyticsContext,
            samplePanel,
            this.getAnalyticsData(),
            showBasketQuickAdd,
            this.props.autoReplenishChecked,
            autoReplenishFrequency,
            productId,
            this.props.isCommunityGallery,
            showBasketCarouselErrorModal,
            isChooseOptionsModal,
            product,
            pageName
        );
    };

    showAddToBasketModal = () => {
        const {
            product,
            sku,
            quantity = 1,
            analyticsContext,
            basketType,
            autoReplenishChecked,
            replenishmentFreqNum,
            replenishmentFreqType,
            isAutoReplenMostCommon,
            pickupBasketItems,
            basketItems,
            pageName
        } = this.props;
        const currentBasketItems = basketType === BasketType.BOPIS ? pickupBasketItems : basketItems;
        const isRewardRemoval =
            skuUtils.isBiReward(sku) && skuHelpers.isInBasket(sku.skuId, basketType?.length ? { items: currentBasketItems } : null);
        const preferredStoreName =
            basketType === BasketType.BOPIS ? storeUtils.getStoreDisplayName(this.props.preferredStore?.preferredStoreInfo) : undefined;

        if (this.props?.triggerAnalytics) {
            this.props.triggerAnalytics();
        }

        if (!isRewardRemoval) {
            this.props.showAddToBasketModal({
                analyticsContext,
                basketType,
                isOpen: true,
                preferredStoreName,
                product: product || sku.primaryProduct,
                quantity,
                sku,
                replenishmentFrequency: autoReplenishChecked ? `${replenishmentFreqType}:${replenishmentFreqNum}` : '',
                replenishmentSelected: autoReplenishChecked,
                isAutoReplenMostCommon,
                pageName
            });
        }
    };

    addClickModal = () => {
        const currentSkuType = skuUtils.getProductType(this.props.sku);
        let areTermsAndConditionsAccepted = false;

        if (this.props?.triggerAnalytics) {
            this.props.triggerAnalytics();
        }

        // If the user has clicked “Add to Basket” to add a Rouge Reward Card,
        // make sure she has accepted T&C
        if (currentSkuType === skuUtils.skuTypes.ROUGE_REWARD_CARD) {
            areTermsAndConditionsAccepted = rrcUtils.areRRCTermsConditionsAccepted();
        }

        if (!areTermsAndConditionsAccepted) {
            this.props.showRougeRewardCardModal({
                isOpen: !areTermsAndConditionsAccepted,
                sku: this.props.sku,
                isRougeExclusiveCarousel: this.props.isRougeExclusiveCarousel || false,
                analyticsContext: this.props.analyticsContext
            });
        } else {
            this.triggerAddToBasketAction();
        }

        this.blurEl();
    };

    addClick = () => {
        if (this.props?.triggerAnalytics) {
            this.props.triggerAnalytics();
        }

        const basketType = this.state.basketType || this.props.basketType;

        if (this.props.isNthCategoryPage) {
            quicklookModalUtils.dispatchQuicklook({
                productId: this.props.sku.productId,
                skuType: this.props.sku.type,
                options: { addCurrentSkuToProductChildSkus: true },
                sku: this.props.sku,
                rootContainerName: this.props.rootContainerName,
                productStringContainerName: this.props.productStringContainerName,
                origin: this.props.origin,
                analyticsContext: this.props.analyticsContext
            });
        } else if (this.props.sku && Array.isArray(this.props.sku) && this.props.sku.length > 0) {
            const products = this.props.sku.map(item => ({
                ...item,
                qty: item.qty || 1
            }));
            const qty = products
                .map(item => item.qty)
                .reduce((prev, curr) => {
                    return prev + curr;
                });
            this.props.addMultipleSkusToBasket(
                products,
                qty,
                this.getAddToBasketSuccessCallback(() => this.props.clearPendingProductList()),
                this.props.analyticsContext,
                this.getAnalyticsData(),
                undefined,
                true,
                basketType
            );

            productPageSOTBindings.addAllToBasket({ skus: this.props.sku });
        } else if (this.props.isReplacementOrder) {
            this.props.addRemoveSample(this.props.sku);
        } else {
            const {
                isCustomSets,
                pendingBasketSkus: pendingBasketSkusData,
                promoPanel,
                sku,
                quantity,
                analyticsContext,
                addMultipleSkusToBasket,
                closeParentModal,
                updateMsgPromo,
                clearPendingProductList
            } = this.props;

            this.setState({ isAdded: true }, () => setTimeout(() => this.setState({ isAdded: false }), ADDED_TEXT_TIMEOUT));

            if (!isCustomSets) {
                if (promoPanel === 'promo') {
                    updateMsgPromo(sku);
                } else {
                    let pendingBasketSkus = getPendingSkus(pendingBasketSkusData);

                    if (pendingBasketSkus.length > 0) {
                        const prod = {
                            skuId: sku.skuId,
                            qty: quantity || 1
                        };

                        pendingBasketSkus = [].concat([prod], pendingBasketSkusData);

                        const qty = pendingBasketSkus
                            .map(item => item.qty)
                            .reduce((prev, curr) => {
                                return prev + curr;
                            });

                        addMultipleSkusToBasket(
                            pendingBasketSkus,
                            qty,
                            this.getAddToBasketSuccessCallback(clearPendingProductList),
                            analyticsContext,
                            undefined,
                            undefined,
                            undefined,
                            basketType
                        );
                    } else {
                        if (closeParentModal) {
                            closeParentModal();
                        }

                        this.triggerAddToBasketAction();
                    }
                }
            }
        }

        this.blurEl();

        if (this.props.callback) {
            this.props.callback();
        }
    };

    blurEl = () => {
        const element = ReactDOM.findDOMNode(this);
        // Remove outlined focus state from the button
        element.blur();
    };

    /**
     * This workaround prevents occasional double-click events
     */
    handleAddClick = Debounce.preventDoubleClick(this.addClick, THROTTLE_DELAY);

    /**
     * Debounced version of showChooseOptionsModal to prevent duplicate API calls
     */
    handleShowChooseOptionsModal = Debounce.preventDoubleClick(data => {
        this.props.showChooseOptionsModal(data);
    });
}

export default wrapComponent(AddToBasketButton, 'AddToBasketButton', true);
