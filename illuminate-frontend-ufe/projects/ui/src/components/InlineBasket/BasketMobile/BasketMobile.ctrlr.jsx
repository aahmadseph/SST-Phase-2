/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import inlineBasketActions from 'actions/InlineBasketActions';
import storeUtils from 'utils/Store';

import {
    colors, fontSizes, lineHeights, space, fontWeights
} from 'style/config';
import {
    Flex, Box, Link, Icon, Text, Button, Image, Grid, Divider
} from 'components/ui';
import ConstructorCarousel from 'components/ConstructorCarousel';
import BasketMsg from 'components/BasketMsg';
import ErrorMsg from 'components/ErrorMsg';
import ErrorList from 'components/ErrorList';
import basketConstants from 'constants/Basket';
import { CONSTRUCTOR_PODS } from 'constants/constructorConstants';
import addToBasketActions from 'actions/AddToBasketActions';
import CreditCardBanner from 'components/CreditCard/CreditCardBanner';
import TestTarget from 'components/TestTarget/TestTarget';
import BasketBreakdownSummary from 'components/BasketBreakdownSummary/BasketBreakdownSummary.f';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import processEvent from 'analytics/processEvent';
import Location from 'utils/Location';
import Actions from 'actions/Actions';
import CheckoutButton from 'components/CheckoutButton/CheckoutButton';
import FrequentlyBoughtTogether from 'components/ProductPage/FrequentlyBoughtTogether';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import Price from 'components/Product/Price/Price';

// Utilities
import BCCUtils from 'utils/BCC';
import localeUtils from 'utils/LanguageLocale';
import ReactDOM from 'react-dom';
import userUtils from 'utils/User';
import deliveryFrequencyUtils from 'utils/DeliveryFrequency';
import basketUtils from 'utils/Basket';
import deliveryOptionsUtils from 'utils/DeliveryOptions';
import skuUtils from 'utils/Sku';
import ExtraProductDetailsUtils from 'utils/ExtraProductDetailsUtils';
import cookieUtils from 'utils/Cookies';
import { TestTargetReady } from 'constants/events';
import { SEPHORA_COLLECTION } from 'constants/brands';

const getText = localeUtils.getLocaleResourceFile('components/InlineBasket/BasketMobile/locales', 'BasketMobile');
const { BASKET_TYPES } = addToBasketActions;
const { COMPONENT_NAMES, IMAGE_SIZES } = BCCUtils;
const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = basketUtils;

const { formatFrequencyType } = deliveryFrequencyUtils;
const { getStringWithTrimmedPrice } = deliveryOptionsUtils;

class BasketMobile extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isMounted: false,
            preferredStoreName: null,
            isRopisSkuAdded: false,
            productId: null,
            hideSampleAndRewardsOnATB: localeUtils.isCanada(),
            showATBFrequentlyBoughtWith: Sephora.isMobile(),
            showProductImageOnATB: localeUtils.isCanada() && Sephora.isMobile()
        };
        this.scrollRef = React.createRef();
    }

    componentDidMount() {
        store.setAndWatch('user.preferredStoreInfo', this, this.setPreferredStoreNameFromUser);

        store.watchAction(inlineBasketActions.TYPES.ROPIS_PRODUCT_ADDED, data => {
            const isKohlsStore = storeUtils.isKohlsStore(store.getState().user?.preferredStoreInfo);
            const sameDayDeliveryBasket = this.getBasketType(store.getState().basket, 'SAMEDAY_BASKET');
            const standardDeliveryBasket = this.getBasketType(store.getState().basket, 'STANDARD_BASKET');
            const isBopisSelected = !sameDayDeliveryBasket && !standardDeliveryBasket; // this basket is NOT same day and is NOT standard then is Bopis/Ropis
            const isRopisSkuAdded = (isKohlsStore && isBopisSelected) || data.isRopisSkuAdded;
            this.setState({ isRopisSkuAdded });
        });

        store.setAndWatch('modals.showInfoModal', this, this.getInfoModalState);

        this.setState({ isMounted: true });

        Sephora.Util.onLastLoadEvent(window, [TestTargetReady], () => {
            store.setAndWatch('testTarget', this, newOffers => {
                const showUpdatedCheckoutButton = newOffers?.testTarget?.offers?.updateCheckoutButtonInATBModal?.show;

                this.setState({
                    showUpdatedCheckoutButton
                });
            });
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const { isRopisSkuAdded } = store.getState().inlineBasket;
        const basket = isRopisSkuAdded ? this.props.basket.pickupBasket : this.props.basket;
        const basketMobileWasOpened = !prevProps.isOpen && this.props.isOpen;
        const isProductPage = Location.isProductPage();

        if (isProductPage && basketMobileWasOpened && basket?.items.length > 0) {
            const lastProductAdded = basket.items[0];
            const { productId, productName } = lastProductAdded.sku;

            if (prevState.productId !== productId) {
                this.setState({ productId: productId });
            }

            const pageType = anaConsts.PAGE_TYPES.ADD_TO_BASKET_MODAL;
            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: `${pageType}:${productId}:n/a:*pname=${productName}`,
                    productStrings: anaUtils.buildSingleProductString({
                        sku: lastProductAdded.sku
                    }),
                    pageType: pageType,
                    pageDetail: productId
                }
            });

            if (this.state.showProductImageOnATB || this.state.showATBFrequentlyBoughtWith) {
                const product = store.getState().page.product;
                const sku = product.currentSku;
                this.setState({
                    product,
                    sku
                });
            }
        }

        if (basketMobileWasOpened && this.scrollRef.current) {
            this.scrollRef.current.scrollTop = 0;
        }
    }

    setPreferredStoreNameFromUser = storeInfo => {
        if (storeInfo?.preferredStoreInfo) {
            const storeDisplayName = storeUtils.getStoreDisplayName(storeInfo.preferredStoreInfo);
            this.setState({ preferredStoreName: storeDisplayName });
        }
    };

    // Prevents unnecessary style recalculation by checking if basketOverlayRefs and its position
    // are available before accessing DOM properties.
    getTopPosition = () => {
        const { basketOverlayRefs } = this.props;

        if (basketOverlayRefs?.position?.current) {
            return basketOverlayRefs.position.current.getBoundingClientRect().top;
        }

        return 0; // Return default value when position is not available
    };

    // Optimizes performance by caching the top position value and calculating maxHeight
    // based on window.innerHeight without triggering layout recalculations repeatedly.
    getMaxHeight = () => {
        const topPosition = this.getTopPosition();

        return `${window.innerHeight - topPosition}px`;
    };

    getBasketType = (basket = {}, type) => {
        return basket.itemsByBasket?.find(b => b.basketType === BASKET_TYPES[type])?.itemsCount > 0;
    };

    getInfoModalState = ({ showInfoModal }) => {
        this.setState({ isInfoModalOpen: showInfoModal });
    };

    showCreditCardModal = () => {
        this.props.toggleOpen(false);
        store.dispatch(Actions.showCreditCardOfferModal({ isOpen: true }));
    };

    isSameDayBasketType = ({ lastAddedItem }) => {
        return lastAddedItem?.basketType === BASKET_TYPES.SAMEDAY_BASKET;
    };

    renderShippingMessage = ({ basket }) => {
        const { lastAddedItem } = basket;
        const { showProductImageOnATB } = this.state;

        return this.isSameDayBasketType({ lastAddedItem }) ? (
            this.renderSDDMessage({ lastAddedItem })
        ) : (
            <BasketMsg {...(showProductImageOnATB ? { textAlign: 'left', paddingX: 2 } : {})} />
        );
    };

    renderBOPISMessage = ({ preferredStoreName, basket }) => {
        const { pickupMessage } = basket?.pickupBasket || '';
        const { showProductImageOnATB } = this.state;

        return (
            <Box {...(showProductImageOnATB ? { textAlign: 'left', paddingBottom: 3 } : {})}>
                <span>{getText('ropisItemAdded')} </span>
                {!showProductImageOnATB && <br />}
                <span>{getText('pickUpAt')}</span>
                <Text fontWeight={fontWeights.bold}>{preferredStoreName}</Text>
                {!showProductImageOnATB && (
                    <>
                        <Text
                            is='p'
                            marginBottom='2px'
                            marginTop='6px'
                            fontSize='14px'
                            fontWeight={fontWeights.bold}
                            color={'green'}
                            children={showProductImageOnATB ? getText('inStock') : getText('limitedStock')}
                        />
                        <Text
                            is='p'
                            marginBottom='4px'
                            fontSize='sm'
                            color={'green'}
                            children={pickupMessage}
                        />
                    </>
                )}
            </Box>
        );
    };

    renderSDDMessage = ({ lastAddedItem }) => {
        const sameDayDeliveryMessage = getStringWithTrimmedPrice(lastAddedItem?.sameDayDeliveryMessage);
        const { showProductImageOnATB } = this.state;

        return (
            <Box
                textAlign='center'
                {...(showProductImageOnATB ? { textAlign: 'left', paddingBottom: 3 } : {})}
            >
                {getText('sameDayDeliveryConfirmation', [lastAddedItem.sameDayTitle])}
                <Text fontWeight={fontWeights.bold}>{userUtils.getZipCode()}</Text>
                {!showProductImageOnATB && (
                    <>
                        <Text
                            is='p'
                            marginBottom='2px'
                            marginTop='6px'
                            fontSize='14px'
                            fontWeight={fontWeights.bold}
                            color={'green'}
                            children={getText('inStock')}
                        />
                        <Text
                            is='p'
                            marginBottom='4px'
                            fontSize='sm'
                            color={'green'}
                            children={sameDayDeliveryMessage}
                        />
                    </>
                )}
            </Box>
        );
    };

    renderSuccessMessages = ({ basket, isRopisSkuAdded, preferredStoreName, isBasketAutoReplenish }) => {
        const { hideSampleAndRewardsOnATB, showProductImageOnATB } = this.state;

        if (isRopisSkuAdded) {
            return this.renderBOPISMessage({
                preferredStoreName,
                basket
            });
        }

        return (
            <>
                {!hideSampleAndRewardsOnATB && this.renderShippingMessage({ basket })}
                {!isBasketAutoReplenish && !showProductImageOnATB && (
                    <BasketBreakdownSummary
                        itemsByBasket={basket.itemsByBasket}
                        borderTop
                        bold
                    />
                )}
            </>
        );
    };

    getUrgencyCountdownMessage = (sku, product = {}, isSdd = true) => {
        const availabilityStatus = (isSdd ? sku?.actionFlags?.sameDayAvailabilityStatus : sku?.actionFlags?.availabilityStatus) || {};

        if (!availabilityStatus) {
            return {};
        }

        const availabilityLabel = ExtraProductDetailsUtils.availabilityLabel(availabilityStatus);
        const availabilityText = getText(availabilityLabel);
        const urgencyMessage = isSdd ? getStringWithTrimmedPrice(sku?.sameDayDeliveryMessage) : product?.pickupMessage || '';

        return { availabilityText, urgencyMessage };
    };

    renderModalTitle = ({ isRopisSkuAdded, isSdd, isReplenishment }) => {
        if (isReplenishment) {
            return getText('autoReplenishModalTitle');
        } else if (isSdd) {
            return getText('sddItemAddedModalTitle');
        } else if (isRopisSkuAdded) {
            return getText('bopisItemAddedModalTitle');
        } else {
            return getText('shippingItemAddedModalTitle');
        }
    };

    basketSummary = basket => {
        const itemCategoryCount = {
            autoReplenish: 0,
            standardShipping: 0,
            sameDayDelivery: 0
        };

        if (basket && basket?.itemsByBasket) {
            basket?.itemsByBasket.forEach(basketItem => {
                if (basketItem.basketType === BASKET_TYPES.STANDARD_BASKET) {
                    basketItem?.items.forEach(sku => {
                        sku.isReplenishment
                            ? (itemCategoryCount.autoReplenish = itemCategoryCount.autoReplenish + sku.qty)
                            : (itemCategoryCount.standardShipping = itemCategoryCount.standardShipping + sku.qty);
                    });
                }

                if (basketItem.basketType === BASKET_TYPES.SAMEDAY_BASKET) {
                    basketItem?.items.forEach(sku => {
                        itemCategoryCount.sameDayDelivery = itemCategoryCount.sameDayDelivery + sku.qty;
                    });
                }
            });
        }

        if (itemCategoryCount.autoReplenish && !itemCategoryCount.standardShipping && !itemCategoryCount.sameDayDelivery) {
            return this.renderAutoReplenishSection(itemCategoryCount.autoReplenish);
        }

        if (itemCategoryCount.autoReplenish && !itemCategoryCount.standardShipping && itemCategoryCount.sameDayDelivery) {
            return this.renderAutoReplenishSameDaySection(itemCategoryCount.autoReplenish, itemCategoryCount.sameDayDelivery);
        }

        if (itemCategoryCount.autoReplenish && itemCategoryCount.standardShipping && !itemCategoryCount.sameDayDelivery) {
            return this.renderAutoReplenishStandardSection(itemCategoryCount.autoReplenish, itemCategoryCount.standardShipping);
        }

        return this.renderAllShipment(itemCategoryCount);
    };

    renderAutoReplenishSection = autoReplenishCount => {
        return (
            <Grid
                is='p'
                gap={3}
                columns='auto 1fr'
                textAlign='left'
                alignItems='center'
            >
                <Image
                    src='/img/ufe/icons/auto-replenish.svg'
                    size={24}
                />
                <span>{`${getText('autoReplenish')} (${autoReplenishCount} ${autoReplenishCount > 1 ? getText('items') : getText('item')})`}</span>
            </Grid>
        );
    };

    renderAutoReplenishSameDaySection = (autoReplenishCount, sameDayCount) => {
        return (
            <>
                {this.renderAutoReplenishSection(autoReplenishCount)}
                <Grid
                    is='p'
                    gap={3}
                    columns='auto 1fr'
                    textAlign='left'
                    alignItems='center'
                    marginTop={2}
                >
                    <Icon name='bag' />
                    <span>{`${getText('sameDayDelivery')} (${sameDayCount} ${sameDayCount > 1 ? getText('items') : getText('item')})`}</span>
                </Grid>
            </>
        );
    };

    renderAutoReplenishStandardSection = (autoReplenishCount, standardCount) => {
        return (
            <>
                {this.renderAutoReplenishSection(autoReplenishCount)}
                <Grid
                    is='p'
                    gap={3}
                    columns='auto 1fr'
                    textAlign='left'
                    alignItems='center'
                    marginTop={2}
                >
                    <Icon name='truck' />
                    <span>{`${getText('standard')} (${standardCount} ${standardCount > 1 ? getText('items') : getText('item')})`}</span>
                </Grid>
            </>
        );
    };

    renderAllShipment = itemCategoryCount => {
        return (
            <>
                {this.renderAutoReplenishSameDaySection(itemCategoryCount.autoReplenish, itemCategoryCount.sameDayDelivery)}
                <Grid
                    is='p'
                    gap={3}
                    columns='auto 1fr'
                    textAlign='left'
                    alignItems='center'
                    marginTop={2}
                >
                    <Icon name='truck' />
                    <span>{`${getText('standard')} (${itemCategoryCount.standardShipping} ${
                        itemCategoryCount.standardShipping > 1 ? getText('items') : getText('item')
                    })`}</span>
                </Grid>
            </>
        );
    };

    displayCheckoutButton = isRopisSkuAdded => {
        const linkName = `inline basket modal:${isRopisSkuAdded ? 'checkout pickup items' : 'checkout shipped items'}`;
        const { showUpdatedCheckoutButton } = this.state;
        const checkoutButtonText = showUpdatedCheckoutButton && getText('checkout');

        return (
            <>
                <Button
                    block
                    marginTop={4}
                    onClick={this.props.onCheckoutClick}
                    variant='secondary'
                >
                    {getText('viewBasket')}
                </Button>
                <CheckoutButton
                    block
                    linkName={linkName}
                    toggleATBModalOpen={this.props.toggleOpen}
                    marginTop={3}
                    isBopis={isRopisSkuAdded}
                    isShowCheckoutActive={true}
                    variant={ADD_BUTTON_TYPE.SPECIAL}
                    children={checkoutButtonText}
                />
            </>
        );
    };

    handleToggleClick = () => {
        const { toggleOpen } = this.props;
        toggleOpen(false);
    };

    // eslint-disable-next-line complexity
    render() {
        const { onCheckoutClick, children, toggleOpen } = this.props;

        const {
            isMounted, isRopisSkuAdded, showProductImageOnATB, product, sku, productId, isInfoModalOpen, showATBFrequentlyBoughtWith
        } =
            this.state;

        const basket = isRopisSkuAdded ? this.props.basket.pickupBasket : this.props.basket;
        const { error = {}, basketItemWarnings = [] } = basket;
        let isPromoWarningError = false;

        const { errorMessages = [] } = error;

        if (basket && basket.basketLevelMessages) {
            basket.basketLevelMessages.forEach(msg => {
                if (msg.messageContext === basketConstants.PROMO_WARNING) {
                    errorMessages.push(msg.messages[0]);
                    isPromoWarningError = true;
                }
            });
        }

        let isOpen = this.props.isOpen;

        //Since isOpen is not set for small view on Inline basket, checking if error exist here to show error message
        if (errorMessages.length) {
            const justAddedSku = this.props.justAddedSku;

            // Only show the Added To Basket mobile if the added item is not a sample
            // Or if there is no error message with messageContext as basket.promoWarning
            isOpen = !skuUtils.isPDPSample(justAddedSku) && !isPromoWarningError;
        }

        const isReplenishment = basket && basket?.items && basket?.items.length > 0 && basket.items[0].isReplenishment;
        const [frequencyType, frequencyNum] = isReplenishment ? basket.items[0].replenishmentFrequency.split(':') : [];
        const isBasketAutoReplenish = basket && basket?.items && basket?.items.length > 0 && basket?.items.find(item => item.isReplenishment);
        const showCheckoutButton = !(Sephora.isMobile() && localeUtils.isCanada());

        let brandName = '';
        const params = { itemIds: productId };

        if (product?.productDetails?.brand) {
            brandName = product.productDetails.brand.displayName;
        } else if (sku?.brandName) {
            brandName = sku.brandName;
        }

        const { lastAddedItem } = basket;
        const isBopis = isRopisSkuAdded;
        const isSdd = this.isSameDayBasketType({ lastAddedItem }) && !isBopis;

        let urgencyCountdownMessage = {};

        if (isSdd) {
            urgencyCountdownMessage = this.getUrgencyCountdownMessage(sku);
        } else if (isBopis) {
            urgencyCountdownMessage = this.getUrgencyCountdownMessage(sku, product, false);
        }

        const { availabilityText, urgencyMessage } = urgencyCountdownMessage;
        const qty = lastAddedItem?.items[0]?.qty;

        return isMounted ? (
            <div>
                {children}
                {ReactDOM.createPortal(
                    <Box
                        data-at={Sephora.debug.dataAt('inline_basket_popup_small')}
                        display={[null, 'none']}
                        position='fixed'
                        zIndex={isInfoModalOpen ? 'var(--layer-modal)' : 'calc(var(--layer-modal) + 1)'}
                        top={this.getTopPosition()}
                        left={2}
                        right={2}
                        css={{ transition: 'all .2s' }}
                        style={
                            !isOpen
                                ? {
                                    visibility: 'hidden',
                                    height: 0,
                                    opacity: 0,
                                    transform: 'translateY(8px)'
                                }
                                : null
                        }
                    >
                        <Box
                            position='relative'
                            backgroundColor='white'
                            boxShadow='light'
                            borderRadius={3}
                            textAlign='center'
                            lineHeight='tight'
                        >
                            {errorMessages.length ? (
                                <ErrorMsg
                                    marginBottom={null}
                                    fontSize='base'
                                    textAlign='left'
                                    padding={4}
                                    paddingRight={7} // pad for `X`
                                    data-at={Sephora.debug.dataAt('inline_basket_error_message')}
                                    children={errorMessages[0]}
                                />
                            ) : (
                                <Flex
                                    id='inlineBasketPopupSmall'
                                    flexDirection='column'
                                    maxHeight={this.getMaxHeight()}
                                >
                                    <Flex
                                        justifyContent='center'
                                        alignItems='center'
                                        fontSize='md'
                                        paddingY={4}
                                        fontWeight='bold'
                                        children={this.renderModalTitle({
                                            isRopisSkuAdded,
                                            isSdd,
                                            isReplenishment
                                        })}
                                    ></Flex>
                                    <Box
                                        ref={this.scrollRef}
                                        padding={4}
                                        borderTop={1}
                                        borderColor='divider'
                                        flex={1}
                                        overflow='auto'
                                    >
                                        <ErrorList
                                            errorMessages={basketItemWarnings}
                                            data-at={Sephora.debug.dataAt('inline_basket_item_warning')}
                                        />
                                        {isReplenishment ? (
                                            <Box
                                                ref={this.scrollRef}
                                                borderBottom={1}
                                                paddingBottom={2}
                                                borderColor='divider'
                                                textAlign='left'
                                            >
                                                {getText('autoReplenishSuccessMessage')}{' '}
                                                <strong>{`${frequencyNum} ${formatFrequencyType(frequencyNum, frequencyType)}.`}</strong>
                                            </Box>
                                        ) : showProductImageOnATB && !isSdd && !isBopis ? null : (
                                            this.renderSuccessMessages({
                                                basket,
                                                isRopisSkuAdded,
                                                preferredStoreName: this.state.preferredStoreName,
                                                isBasketAutoReplenish
                                            })
                                        )}
                                        {isBasketAutoReplenish && (
                                            <Box
                                                marginTop={4}
                                                marginBottom={3}
                                                paddingX={1}
                                                fontWeight='bold'
                                            >
                                                {this.basketSummary(basket)}
                                            </Box>
                                        )}
                                        {showProductImageOnATB && sku && (
                                            <Grid
                                                gap={2}
                                                columns='auto 1fr'
                                                textAlign='left'
                                            >
                                                <ProductImage
                                                    disableLazyLoad={true}
                                                    id={sku.skuId}
                                                    size={IMAGE_SIZES[97]}
                                                    skuImages={sku.skuImages}
                                                />
                                                <Grid
                                                    gap={2}
                                                    columns={['1fr auto', 1]}
                                                >
                                                    <div>
                                                        <div
                                                            css={{ fontWeight: 'var(--font-weight-bold)' }}
                                                            children={brandName}
                                                        />
                                                        <div
                                                            children={product?.productDetails ? product.productDetails.displayName : sku.productName}
                                                        />
                                                        <Box
                                                            marginTop={1}
                                                            fontSize='sm'
                                                            color='gray'
                                                        >
                                                            {getText('item').toUpperCase()} {sku.skuId}
                                                            <Text marginX={2}>•</Text>
                                                            {getText('qty')} {qty}
                                                        </Box>
                                                        <ProductVariation
                                                            fontSize='sm'
                                                            marginTop={1}
                                                            product={product}
                                                            sku={sku}
                                                        />
                                                        {(isSdd || isBopis) && (
                                                            <>
                                                                <Text
                                                                    is='p'
                                                                    marginBottom='2px'
                                                                    marginTop='4px'
                                                                >
                                                                    <Text
                                                                        fontWeight={'bold'}
                                                                        color={'green'}
                                                                        children={availabilityText}
                                                                    />
                                                                </Text>
                                                                <Text
                                                                    is='p'
                                                                    marginBottom='-2px'
                                                                    color='green'
                                                                    fontSize='sm'
                                                                    children={urgencyMessage}
                                                                />
                                                            </>
                                                        )}
                                                        <Price
                                                            atPrefix='atb_product'
                                                            sku={sku}
                                                            paddingTop={3}
                                                        />
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        )}
                                        {showProductImageOnATB && !isSdd && !isBopis && !isReplenishment && (
                                            <Box paddingTop={5}>
                                                {this.renderSuccessMessages({
                                                    basket,
                                                    isRopisSkuAdded,
                                                    preferredStoreName: this.state.preferredStoreName,
                                                    isBasketAutoReplenish
                                                })}
                                            </Box>
                                        )}
                                        {showProductImageOnATB && isSdd && (
                                            <BasketBreakdownSummary
                                                itemsByBasket={basket.itemsByBasket}
                                                borderTop
                                                bold
                                            />
                                        )}
                                        {showCheckoutButton ? (
                                            this.displayCheckoutButton(isRopisSkuAdded)
                                        ) : (
                                            <Button
                                                variant={'special'}
                                                marginTop={4}
                                                minWidth='12em'
                                                onClick={onCheckoutClick}
                                                children={getText('viewBasketAndCheckout')}
                                            />
                                        )}
                                        {!isRopisSkuAdded &&
                                            (productId ? (
                                                showATBFrequentlyBoughtWith && brandName.toLowerCase() === SEPHORA_COLLECTION ? (
                                                    <FrequentlyBoughtTogether
                                                        currentSku={sku}
                                                        currentProduct={product}
                                                        showAddAllToBasketButton={!showATBFrequentlyBoughtWith}
                                                        shouldExcludeCurrentProduct
                                                    />
                                                ) : (
                                                    <ConstructorCarousel
                                                        params={params}
                                                        podId={CONSTRUCTOR_PODS.ATB}
                                                        formatValuePrice={true}
                                                        displayCount={3}
                                                        skuImageSize={70}
                                                        gutter={space[3]}
                                                        mobileWebAlignment='center'
                                                        titleMargin={space[4]}
                                                        titleStyle={{
                                                            fontSize: fontSizes.md,
                                                            fontWeight: 'var(--font-weight-bold)',
                                                            lineHeight: lineHeights.tight
                                                        }}
                                                        showPrice={true}
                                                        showTouts={true}
                                                        showLoves={false}
                                                        showReviews={true}
                                                        toggleOpen={toggleOpen}
                                                        showMarketingFlags={false}
                                                        contextStyle={{
                                                            margin: `${space[4]}px -${space[4]}px`,
                                                            padding: `${space[4]}px ${space[4]}px 0`,
                                                            borderTop: `1px solid ${colors.lightGray}`
                                                        }}
                                                        componentType={COMPONENT_NAMES.CAROUSEL}
                                                        analyticsContext={anaConsts.PAGE_TYPES.ADD_TO_BASKET_MODAL}
                                                    ></ConstructorCarousel>
                                                )
                                            ) : null)}
                                        <TestTarget
                                            testName='creditCardBanners'
                                            source='inline'
                                            testEnabled
                                            testComponent={CreditCardBanner}
                                            variant='centered'
                                            borderTop={1}
                                            borderColor='divider'
                                            paddingTop={4}
                                            marginTop={4}
                                        />
                                    </Box>
                                </Flex>
                            )}
                            <Link
                                aria-label={getText('close')}
                                paddingX={3}
                                height={fontSizes.md * lineHeights.tight + space[4] * 2}
                                lineHeight={0}
                                onClick={this.handleToggleClick}
                                css={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0
                                }}
                                id='inlineBasketLinkClose'
                            >
                                <Icon
                                    name='x'
                                    size={14}
                                />
                            </Link>
                        </Box>
                    </Box>,
                    this.props.basketOverlayRefs?.portal?.current
                )}
            </div>
        ) : null;
    }
}

export default wrapComponent(BasketMobile, 'BasketMobile', true);
