/* eslint-disable complexity */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'store/Store';
import Actions from 'Actions';
import { Grid, Text, Link } from 'components/ui';
import {
    mediaQueries, space, colors, radii
} from 'style/config';
import mediaUtils from 'utils/Media';
import skuUtils from 'utils/Sku';
import userUtils from 'utils/User';
import uiUtils from 'utils/UI';
import isFunction from 'utils/functions/isFunction';
import AddToBasketButton from 'components/AddToBasketButton';
import RougeRewardButton from 'components/ProductPage/Type/RewardProduct/RougeRewardButton/RougeRewardButton';
import basketUtils from 'utils/Basket';
import basketConstants from 'constants/Basket';
import StickyFooter from 'components/StickyFooter/StickyFooter';
import analyticsConstants from 'analytics/constants';
import languageLocale from 'utils/LanguageLocale';
import SkuQuantity from 'components/Product/SkuQuantity';
import Popover from 'components/Popover/Popover';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import productPageBindings from 'analytics/bindingMethods/pages/productPage/productPageSOTBindings';
import constantsSkuQuantity from 'components/Product/SkuQuantity/constants';
import { DebouncedScroll } from 'constants/events';
import skuHelpers from 'utils/skuHelpers';
import { HEADER_VALUE } from 'constants/authentication';
import Empty from 'constants/empty';
import ErrorDisplay from 'components/GlobalModals/ChooseOptionsModal/ErrorDisplay';

const {
    CONTEXT: { BASKET_PRODUCT }
} = analyticsConstants;
const { ADD_TO_BASKET_TYPES } = basketUtils;
const { BasketType, API_BASKET_TYPE } = basketConstants;
const { getLocaleResourceFile } = languageLocale;
const { MIN_WIDTH } = constantsSkuQuantity;
const { Media } = mediaUtils;

const BUTTON_WIDTH = ['100%', null, 212];
const BUTTON_WIDTH_WITH_QUANTITY_PICKER = ['100%', null, 282];

const getText = (text, vars) => getLocaleResourceFile('components/ProductPage/CallToAction/locales', 'CallToAction')(text, vars);

function downloadText() {
    return (
        <>
            <Link
                color='blue'
                underline={true}
                padding={2}
                margin={-2}
                href='/beauty/mobile'
                children={getText('download')}
            />{' '}
            {getText('or')}{' '}
            <Link
                display={[null, null, 'none']}
                color='blue'
                underline={true}
                padding={2}
                margin={-2}
                href={uiUtils.getAppLink()}
                children={getText('openApp')}
            />
            <Text
                display={['none', null, 'inline']}
                children={getText('openApp')}
            />
        </>
    );
}

class CallToAction extends BaseClass {
    constructor() {
        super();
        this.state = {
            skuQuantity: 1,
            isSkuQuantityChanged: false,
            showBopisTooltip: false,
            initialPageYOffset: 0,
            shouldShowQuantityPicker: false
        };

        this.shouldUnsubscribeFromHandleScroll = false;
        this.shouldUnsubscribeFromCloseTooltip = false;
    }

    bopisTooltipRef = React.createRef();

    closeTooltip = () => {
        if (this.bopisTooltipRef?.current) {
            this.bopisTooltipRef.current.closePopover();

            if (this.shouldUnsubscribeFromHandleScroll) {
                window.removeEventListener(DebouncedScroll, this.handleScroll);
                this.shouldUnsubscribeFromHandleScroll = false;
            }

            Storage.local.setItem(LOCAL_STORAGE.PRODUCT_PAGE_BOPIS_TOOLTIP, false);
            this.setState({ showBopisTooltip: false });
        }
    };

    getInitialBopisTooltipLogic = props => {
        const { sku } = props;
        const hasBopisTooltipBeenDisplayed = Storage.local.getItem(LOCAL_STORAGE.PRODUCT_PAGE_BOPIS_TOOLTIP) !== null;
        const showBopisTooltip = !sku?.isOnlineOnly && !hasBopisTooltipBeenDisplayed;

        return {
            stateValues: { showBopisTooltip },
            setStateCallback: () => {
                if (!this.shouldUnsubscribeFromHandleScroll) {
                    window.addEventListener(DebouncedScroll, this.handleScroll);
                    this.shouldUnsubscribeFromHandleScroll = true;
                }

                if (!this.shouldUnsubscribeFromCloseTooltip) {
                    window.addEventListener('click', this.closeTooltip);
                    this.shouldUnsubscribeFromCloseTooltip = true;
                }
            }
        };
    };

    getInitialQtyPickerLogic = () => {
        return {
            stateValues: {
                skuQuantity: 1,
                isSkuQuantityChanged: false
            }
        };
    };

    initializeState = initialLogicSpecs => {
        const { newStateValues, setStateCallbacks } = initialLogicSpecs.reduce(
            (acc, spec) => {
                acc.newStateValues = {
                    ...acc.newStateValues,
                    ...spec.stateValues
                };

                acc.setStateCallbacks.push(spec.setStateCallback);

                return acc;
            },
            {
                newStateValues: {},
                setStateCallbacks: []
            }
        );

        this.setState(newStateValues, () => setStateCallbacks.forEach(fn => isFunction(fn) && fn()));
    };

    setIsSkuInBasket = () => {
        const { basket, basketType, sku } = this.props;
        const basketItems = (basketType === BasketType.BOPIS ? basket?.pickupBasket?.items : basket?.items) || Empty.Array;
        const isSkuInBasket = Sephora.configurationSettings.calculateIsInBasketFlagOnChannel
            ? skuHelpers.isInBasket(sku.skuId, { items: basketItems })
            : sku.isInBasket;

        this.setState({ isSkuInBasket });
    };

    componentDidMount() {
        this.setState({ initialPageYOffset: window.pageYOffset });

        window.addEventListener('pagehide', this.onPageRefresh);
        this.setIsSkuInBasket();
        this.initializeState([this.getInitialBopisTooltipLogic(this.props)]);
    }

    componentDidUpdate(prevProps) {
        if (this.props?.product?.productDetails?.productId !== prevProps?.product?.productDetails?.productId) {
            this.initializeState([this.getInitialBopisTooltipLogic(this.props), this.getInitialQtyPickerLogic()]);
        }

        if (prevProps.autoReplenishQuantity !== this.props.autoReplenishQuantity) {
            this.setState({
                isSkuQuantityChanged: false
            });
        }

        if (
            this.props.basket !== prevProps.basket ||
            this.props.itemsByBasket !== prevProps.itemsByBasket ||
            this.props.sku.skuId !== prevProps.sku.skuId ||
            this.props.basketType !== prevProps.basketType ||
            this.props.auth.profileStatus !== prevProps.auth.profileStatus ||
            this.props.showQuantityPicker !== prevProps.showQuantityPicker ||
            this.props.autoReplenishChecked !== prevProps.autoReplenishChecked
        ) {
            this.setIsSkuInBasket();
            const basketChanged = this.props.basketType !== prevProps.basketType;
            this.refreshSkuQuantity(basketChanged);

            if (this.props.autoReplenishChecked && !basketChanged) {
                this.setState({
                    shouldShowQuantityPicker: false
                });
            }
        }
    }

    handleScroll = () => {
        const verticalScrolledDistance = this.state.initialPageYOffset - window.pageYOffset;

        if (verticalScrolledDistance >= 10 || verticalScrolledDistance <= -10) {
            this.closeTooltip();
        }
    };

    onPageRefresh = () => {
        if (!this.props?.sku?.isOnlineOnly && Storage.local.getItem(LOCAL_STORAGE.PRODUCT_PAGE_BOPIS_TOOLTIP) !== null) {
            Storage.local.setItem(LOCAL_STORAGE.PRODUCT_PAGE_BOPIS_TOOLTIP, false);
        }
    };

    componentWillUnmount() {
        window.removeEventListener('pagehide', this.onPageRefresh);

        if (this.shouldUnsubscribeFromHandleScroll) {
            window.removeEventListener(DebouncedScroll, this.handleScroll);
        }

        if (this.shouldUnsubscribeFromCloseTooltip) {
            window.removeEventListener('click', this.closeTooltip);
        }
    }

    handleSkuQuantity = value => {
        this.setState({
            skuQuantity: value,
            isSkuQuantityChanged: true
        });

        this.props.updateFrequencyModal({ quantity: value });
        this.fireAnalytics(value);
        productPageBindings.productQuantityChange({ quantity: value, skuId: this.props?.sku?.skuId });
    };

    getBasketItems = () => {
        const {
            basket: { pickupBasket },
            itemsByBasket,
            basketType
        } = this.props;
        const isBopis = basketType === BasketType.BOPIS;
        const apiBasketType = this.getApiBasketType(basketType);
        const basketItems = isBopis ? pickupBasket : itemsByBasket.find(b => b.basketType === apiBasketType);

        return { isBopis, basketItems };
    };

    getSkuItem = () => {
        const { sku } = this.props;
        const { basketItems } = this.getBasketItems();

        return basketItems?.items.find(item => item.sku.skuId === sku.skuId) || null;
    };

    handleQuantityChange = quantity => {
        const { sku, removeItemFromBasket, updateSkuQuantity } = this.props;
        const { isBopis } = this.getBasketItems();
        const skuItem = this.getSkuItem();
        const shippingMethod = this.getApiBasketType(this.props.basketType);
        // Create a new sku object with shippingMethod and changedQuantity (if quantity is 0)
        const updatedSku = {
            ...sku,
            shippingMethod,
            ...(quantity === '0' && { changedQuantity: skuItem?.qty ?? 0 })
        };

        if (quantity === '0') {
            const trackItemRemovalAnalytics = true;
            removeItemFromBasket({ sku: updatedSku }, trackItemRemovalAnalytics, false, isBopis, this.props?.basket?.appliedPromotions, true);
            this.setState({
                skuQuantity: 0,
                isSkuQuantityChanged: true,
                shouldShowQuantityPicker: false
            });
        } else {
            this.setState({
                skuQuantity: quantity,
                isSkuQuantityChanged: true
            });
            updateSkuQuantity({
                newQty: quantity,
                sku: updatedSku,
                isBopis,
                commerceId: skuItem.commerceId
            });
        }
    };

    refreshSkuQuantity(basketChanged) {
        const {
            showQuantityPicker,
            autoReplenishChecked,
            basket: { pickupBasket },
            basketType,
            itemsByBasket
        } = this.props;

        if (!showQuantityPicker || autoReplenishChecked) {
            return;
        }

        const isBopis = basketType === BasketType.BOPIS;

        if (basketChanged && isBopis && !pickupBasket.items?.length) {
            this.setState({ skuQuantity: 1, shouldShowQuantityPicker: false });

            return;
        }

        if (itemsByBasket?.length === 0 && !isBopis) {
            this.setState(basketChanged ? { skuQuantity: 1, shouldShowQuantityPicker: false } : { shouldShowQuantityPicker: false });

            return;
        }

        if (this.state.skuQuantity === 0 && !basketChanged) {
            this.setState({ skuQuantity: 1, shouldShowQuantityPicker: false });

            return;
        }

        const skuItem = this.getSkuItem();
        const skuQuantity = skuItem?.qty || 0;
        const shouldShowQuantityPicker = skuQuantity > 0;

        this.setState({
            shouldShowQuantityPicker,
            ...(skuQuantity > 0 && { skuQuantity })
        });
    }

    playUpdateAnimation = () => {
        this.setState({ showUpdateMessage: true }, () => {
            setTimeout(() => {
                this.setState({ showUpdateMessage: false });
            }, 1500);
        });
    };

    fireAnalytics = qty => {
        const action = 'product:edit quantity';
        const analyticsData = {
            actionInfo: action,
            linkName: action,
            eventStrings: [anaConsts.Event.EVENT_71]
        };

        analyticsData.productStrings = [
            anaUtils.buildSingleProductString({
                sku: this.props.sku,
                isQuickLook: false,
                newProductQty: qty,
                displayQuantityPickerInATB: this.props?.displayQuantityPickerInATB
            })
        ];

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: analyticsData
        });
    };

    showSignInModal = () => {
        store.dispatch(Actions.showSignInModal({ isOpen: true, extraParams: { headerValue: HEADER_VALUE.USER_CLICK } }));
    };

    showBiRegisterModal = () => {
        store.dispatch(Actions.showBiRegisterModal({ isOpen: true }));
    };

    getApiBasketType = type => {
        // when user chooses standard shipping, parent component sends null which means standard
        if (type === null) {
            return API_BASKET_TYPE.standard;
        }

        return API_BASKET_TYPE[type];
    };

    render() {
        const {
            product,
            sku,
            basketType,
            loveIcon,
            loveButton,
            addToBasketDataAt,
            addToBasketDataAtSm,
            addToBasketCallback,
            isCustomSets,
            isSameDayAvailable,
            productExtraDetailsLoaded,
            displayQuantityPickerInATB,
            autoReplenishChecked,
            autoReplenishQuantity,
            isKohlsStore,
            isChooseOptionsModal,
            showQuantityPicker,
            analyticsContext,
            stickyError,
            accountForBottomNav,
            pageName
        } = this.props;
        const {
            skuQuantity, isSkuQuantityChanged, shouldShowQuantityPicker, isSkuInBasket, showUpdateMessage
        } = this.state;

        const updatedQuantity = autoReplenishChecked && !isSkuQuantityChanged ? autoReplenishQuantity : skuQuantity;

        if (!sku) {
            return null;
        }

        const skuType = skuUtils.getProductType(sku);

        const isReward = skuUtils.isBiReward(sku);
        const isRougeRewardCard = skuType === skuUtils.skuTypes.ROUGE_REWARD_CARD;

        const isAppExclusive = skuUtils.isAppExclusive(sku);
        const isSignedIn = userUtils.isSignedIn();

        const biExclusiveLevel = sku.biExclusiveLevel === skuUtils.biExclusiveLevels.BI ? 'an Insider' : `${sku.biExclusiveLevel}`;

        const biExclusiveMsg =
            skuUtils.isBiExclusive(sku) && !skuHelpers.isBiQualify(sku) ? (
                <>
                    {getText('userLabelText', [biExclusiveLevel])}
                    {isSignedIn || (
                        <>
                            {' '}
                            <Link
                                color='blue'
                                underline={true}
                                padding={2}
                                margin={-2}
                                onClick={this.showSignInModal}
                                children={getText('signIn')}
                            />{' '}
                            {getText('or')}
                        </>
                    )}
                    {isSignedIn && !userUtils.isBI() && (
                        <>
                            {' '}
                            <Link
                                color='blue'
                                underline={true}
                                padding={2}
                                margin={-2}
                                onClick={this.showBiRegisterModal}
                                children={getText('signUp')}
                            />{' '}
                            {getText('or')}
                        </>
                    )}{' '}
                    <Link
                        color='blue'
                        underline={true}
                        padding={2}
                        margin={-2}
                        href='/profile/BeautyInsider'
                        children={getText('learnMore')}
                    />
                </>
            ) : null;
        const isButtonDisabled =
            (!isCustomSets && !productExtraDetailsLoaded) ||
            (basketType === BasketType.SameDay && !isSameDayAvailable) ||
            (!sku.isReplenishmentEligible && autoReplenishChecked);
        const hasSelectedKohlsStore = basketType === BasketType.BOPIS && isKohlsStore;
        const shouldDisplayQuantityPickerInATB =
            displayQuantityPickerInATB &&
            !skuHelpers.isSkuOutOfStockByBasketType(sku, basketType, isChooseOptionsModal) &&
            !isButtonDisabled &&
            !skuUtils.isGiftCard(sku) &&
            !skuUtils.isGwp(sku) &&
            !skuUtils.isBiReward(sku) &&
            !isCustomSets &&
            !hasSelectedKohlsStore &&
            !skuHelpers.isProductDisabled(sku) &&
            !skuUtils.isAppExclusive(sku);

        const buttonWidthWithQuantityPicker = isChooseOptionsModal ? ['100%', 360] : BUTTON_WIDTH_WITH_QUANTITY_PICKER;

        const { isExternallySellable } = sku;

        const isSdd = basketType === BasketType.SameDay;
        const isBopis = basketType === BasketType.BOPIS;

        const button = (dataAt, isSticky) =>
            isRougeRewardCard ? (
                <RougeRewardButton
                    product={product}
                    dataAt={dataAt}
                    buttonWidth={BUTTON_WIDTH}
                    biExclusiveMsg={biExclusiveMsg}
                    addToBasketCallback={addToBasketCallback}
                />
            ) : (
                <Grid
                    gap={isChooseOptionsModal ? [2, null, 0] : [2, null, loveButton ? 2 : 4]}
                    columns={[null, null, 'auto 1fr auto']}
                    alignItems='center'
                >
                    {isExternallySellable ? null : (
                        <div css={shouldDisplayQuantityPickerInATB && { position: 'relative' }}>
                            {shouldDisplayQuantityPickerInATB && (
                                <div css={styles.quantityPicker(shouldShowQuantityPicker || showUpdateMessage)}>
                                    <SkuQuantity
                                        basketType={basketType}
                                        currentSku={sku}
                                        skuQuantity={updatedQuantity}
                                        handleSkuQuantity={shouldShowQuantityPicker ? this.handleQuantityChange : this.handleSkuQuantity}
                                        isNotSelectable={autoReplenishChecked}
                                        isSdd={isSdd}
                                        isBopis={isBopis}
                                        playUpdateAnimation={this.playUpdateAnimation}
                                        showUpdateMessage={showUpdateMessage}
                                        inputProps={{
                                            chevronColor: 'white'
                                        }}
                                        customStyle={
                                            shouldShowQuantityPicker || showUpdateMessage
                                                ? styles.skuQuantityAlt(buttonWidthWithQuantityPicker)
                                                : styles.skuQuantity
                                        }
                                        {...(shouldShowQuantityPicker && {
                                            startFromZero: shouldShowQuantityPicker,
                                            displayShowQuantityPicker: shouldShowQuantityPicker
                                        })}
                                    />
                                </div>
                            )}
                            {!shouldShowQuantityPicker && !showUpdateMessage && (
                                <AddToBasketButton
                                    isSticky={isSticky}
                                    data-at={Sephora.debug.dataAt(dataAt)}
                                    skuQuantity={updatedQuantity}
                                    width={shouldDisplayQuantityPickerInATB ? buttonWidthWithQuantityPicker : BUTTON_WIDTH}
                                    paddingLeft={shouldDisplayQuantityPickerInATB && MIN_WIDTH.BASE}
                                    product={product}
                                    productId={product.productId}
                                    sku={sku}
                                    displayQuantityPickerInATB={shouldDisplayQuantityPickerInATB}
                                    showQuantityPicker={showQuantityPicker}
                                    quantity={updatedQuantity}
                                    analyticsContext={analyticsContext || BASKET_PRODUCT}
                                    pageName={pageName}
                                    callback={addToBasketCallback}
                                    isCustomSets={isCustomSets}
                                    replenishmentFreqNum={this.props.replenishmentFreqNum}
                                    replenishmentFreqType={this.props.replenishmentFreqType}
                                    autoReplenishChecked={autoReplenishChecked}
                                    isAutoReplenMostCommon={this.props.isAutoReplenMostCommon}
                                    basketType={basketType}
                                    ctaTwoLines={true}
                                    isChooseOptionsModal={this.props.isChooseOptionsModal}
                                    {...(isReward
                                        ? {
                                            variant: isSkuInBasket ? ADD_TO_BASKET_TYPES.PRIMARY : ADD_TO_BASKET_TYPES.SPECIAL,
                                            disabled: isSkuInBasket ? false : !sku.isEligible,
                                            quantity: product.currentSkuQuantity
                                        }
                                        : {
                                            // iOS Safari 14.5+ intermittently neglects to update the button text color
                                            // when the disabled prop is changed; force a re-render
                                            key: `addToBasketButton_${isButtonDisabled}`,
                                            variant: ADD_TO_BASKET_TYPES.SPECIAL,
                                            disabled: isButtonDisabled,
                                            basketType
                                        })}
                                />
                            )}
                        </div>
                    )}
                    {(biExclusiveMsg || isAppExclusive) && !isExternallySellable && (
                        <Text
                            is='p'
                            lineHeight='tight'
                            textAlign={['center', null, 'left']}
                            fontSize={['xs', 'sm']}
                            maxWidth={[null, null, '16em']}
                            data-at={Sephora.debug.dataAt('product_label')}
                            css={{ [mediaQueries.smMax]: { order: -1 } }}
                        >
                            {isAppExclusive ? downloadText() : biExclusiveMsg}
                        </Text>
                    )}
                    {(loveIcon || loveButton) && (
                        <Media
                            greaterThan='sm'
                            css={
                                loveIcon && isExternallySellable
                                    ? {
                                        paddingTop: space[4]
                                    }
                                    : {
                                        marginLeft: space[2],
                                        marginRight: space[3]
                                    }
                            }
                        >
                            {loveIcon || loveButton}
                        </Media>
                    )}
                </Grid>
            );

        const sddRougeTestThreshold = product?.currentProductUserSpecificDetails?.SDDRougeTestThreshold;
        const isSDDRougeFreeShipEligible = userUtils.isSDDRougeFreeShipEligible();
        const isSDDRougeTestV2 = sddRougeTestThreshold;
        const textContent = isSDDRougeFreeShipEligible
            ? getText('SDDRougeFreeShip')
            : isSDDRougeTestV2
                ? getText('SDDRougeTestFreeShipping', [sddRougeTestThreshold])
                : getText('bopisTooltip');

        return (
            <React.Fragment>
                <Media greaterThan={isChooseOptionsModal ? 'xs' : 'sm'}>{button(addToBasketDataAt, false)}</Media>
                <Media lessThan={isChooseOptionsModal ? 'sm' : 'md'}>
                    {isExternallySellable ? null : (
                        <>
                            {this.state.showBopisTooltip && (
                                <div css={styles.item}>
                                    <Popover
                                        content={textContent}
                                        placement='top'
                                        align='center'
                                        width={198}
                                        placementStyle={{ position: 'fixed', bottom: '9.275em' }}
                                        textAlign='center'
                                        ref={this.bopisTooltipRef}
                                        showImmediately={true}
                                        fontSize='sm'
                                        fontWeight='bold'
                                        padding='.5em 1em'
                                        invertColor={true}
                                    ></Popover>
                                </div>
                            )}
                            <StickyFooter accountForBottomNav={accountForBottomNav}>
                                {stickyError && <ErrorDisplay apiError={stickyError} />}
                                {button(addToBasketDataAtSm, true)}
                            </StickyFooter>
                        </>
                    )}
                </Media>
            </React.Fragment>
        );
    }
}

CallToAction.defaultProps = {
    stickyError: null,
    isChooseOptionsModal: false
};

const styles = {
    ppageOptimizations: {
        minWidth: '272px'
    },
    item: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        color: colors.gray,
        lineHeight: 1
    },
    skuQuantity: {
        color: colors.white,
        backgroundColor: 'transparent',
        border: 0,
        borderTopLeftRadius: radii.full,
        borderBottomLeftRadius: radii.full
    },
    skuQuantityAlt: buttonWidthWithQuantityPicker => ({
        color: colors.white,
        backgroundColor: colors.red,
        border: 0,
        borderRadius: radii.full,
        [mediaQueries.smMax]: {
            width: '100%'
        },
        [mediaQueries.md]: {
            width: buttonWidthWithQuantityPicker
        }
    }),
    quantityPicker: shouldShowQuantityPicker => ({
        position: shouldShowQuantityPicker ? 'relative' : 'absolute',
        borderRight: `1px solid ${colors.white}`,
        width: shouldShowQuantityPicker ? '100%' : 'auto',
        boxSizing: 'border-box'
    })
};

export default wrapComponent(CallToAction, 'CallToAction', true);
