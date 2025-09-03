/* eslint-disable complexity */
/* eslint-disable camelcase */

import React from 'react';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';

import {
    breakpoints, colors, site, space
} from 'style/config';
import {
    Grid, Box, Text, Button, Link, Icon, Flex
} from 'components/ui';
import ErrorMsg from 'components/ErrorMsg';
import Tooltip from 'components/Tooltip/Tooltip';
import SkuQuantity from 'components/Product/SkuQuantity';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import SizeAndItemNumber from 'components/Product/SizeAndItemNumber/SizeAndItemNumber';
import compConstants from 'components/constants';
import InfoButton from 'components/InfoButton/InfoButton';
import OnlyFewLeftFlag from 'components/OnlyFewLeftFlag/OnlyFewLeftFlag';
import FinalSaleItem from 'components/SharedComponents/FinalSaleItem';
import SDURenewalPricing from 'components/SDURenewalPricing';

import basketConstants from 'constants/Basket';
import anaUtils from 'analytics/utils';

import basketUtils from 'utils/Basket';
import skuUtils from 'utils/Sku';
import DateUtil from 'utils/Date';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { getImageAltText } from 'utils/Accessibility';
import resourceWrapper from 'utils/framework/resourceWrapper';
import Authentication from 'utils/Authentication';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';
import Store from 'utils/Store';

import addToCartPixels from 'analytics/addToCartPixels';
import moveToLoveEvent from 'analytics/bindings/pages/all/moveToLoveEvent';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import analyticsUtils from 'analytics/utils';

import AddToBasketActions from 'actions/AddToBasketActions';
import promoUtils from 'utils/Promos';
import Location from 'utils/Location';
import { HEADER_VALUE } from 'constants/authentication';

const { wrapComponent } = FrameworkUtils;
const { formatFrequencyType } = DeliveryFrequencyUtils;
const { getLocaleResourceFile } = LanguageLocaleUtils;

const { PROP_65_MSG } = compConstants;
const SM_IMG_SIZE = 64;
const SM_IMG_GAP = space[2];

class BasketListItem extends BaseClass {
    state = {
        showPaypalRestrictedMessage: false,
        isFewLeftFlagHidden: true,
        isQueryPresent: false
    };

    rootRef = React.createRef();

    getText = resourceWrapper(getLocaleResourceFile('components/Checkout/PromoSection/BasketList/locales', 'BasketList'), true);

    getRopisText = resourceWrapper(getLocaleResourceFile('components/ProductPage/DeliveryOptions/locales', 'DeliveryOptions'), true);

    removeItemFromBasket = item => () => {
        const isPickup = this.props.isRopis || this.props.isBopis;
        this.props.removeItemFromBasket(item, true, false, isPickup, this.props?.basket?.appliedPromotions);
    };

    handleLoveRequest = (item, callback) => {
        const loveRequest = {
            loveSource: this.props.loveSource,
            skuId: item.sku.skuId,
            productId: item.sku?.productId
        };

        loveRequest.isRopisSku = this.props.isRopis || this.props.isBopis;

        this.props.addLove(loveRequest, callback);
    };

    handleMoveToLoveClick = item => e => {
        e.preventDefault();
        const { basket } = this.props;

        const promises = Sephora.analytics.promises;
        const itemCount = basket?.itemCount || 0;
        const pickupBasketItemCount = basket?.pickupBasket?.itemCount || 0;
        const totalBasketCount = itemCount + pickupBasketItemCount;
        //Analytics
        //This should always fire on click. Don't wait for successful sign-in or anything
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                bindingMethods: [moveToLoveEvent],
                item: [item],
                specificEventName: anaConsts.EVENT_NAMES.ADD_TO_LOVES,
                ...analyticsUtils.getLastAsyncPageLoadData(),
                pageName: `basket:${this.props.isBopis ? 'buy online and pickup' : 'basket'}:n/a:*`,
                pageDetail: this.props.isBopis ? 'buy online and pickup' : 'basket',
                totalBasketCount
            }
        });

        promises.styleHaulReady.then(() => {
            const productData = item.sku;
            window.analytics &&
                window.analytics.track('AddToWishlist', {
                    value: skuUtils.parsePrice(productData.listPrice) * 100,
                    currency: 'USD',
                    product_name: productData.productName,
                    product_type: productData.type,
                    product_id: productData?.productId
                });
        });

        const {
            skuId, productName, brandName, variationValue, salePrice, listPrice
        } = item.sku;

        const googleAnalyticsChangedBasketData = {
            id: skuId,
            name: productName,
            brand: brandName || '',
            variant: variationValue || '',
            quantity: item.qty || 1,
            price: salePrice || listPrice
        };

        Sephora.analytics.promises.tagManagementSystemReady.then(() => {
            addToCartPixels.googleAnalyticsRemoveFromBasketEvent(googleAnalyticsChangedBasketData);
        });

        Authentication.requireAuthentication(null, null, null, null, false, HEADER_VALUE.USER_CLICK)
            .then(() => {
                this.handleLoveRequest(item, response => {
                    const eventData = {
                        data: {
                            sku: item.sku.skuId,
                            productId: item?.sku?.productId || '',
                            url: ''
                        }
                    };

                    processEvent.process(anaConsts.ADD_TO_LOVES_LIST, eventData);

                    if (response && response.shoppingListMsgs) {
                        const promoWarning = response.shoppingListMsgs.find(
                            warning => warning.messageContext === basketConstants.SHOPPING_LIST_PROMO_WARNING
                        );

                        if (promoWarning && promoWarning.messages.length) {
                            promoUtils.showWarningMessage(promoWarning.messages[0]);
                        }
                    }

                    this.props.refreshBasket();

                    // UTS-580 - Add To Cart & Remove from Basket for GA Begin Checkout Event
                    AddToBasketActions.fireGABeginCheckout({ id: skuId }, 'removeItem');
                });
            })
            .catch(() => {});
    };

    handleSkuQuantity = (qty, item, updateBasket) => {
        if (item.modifiable) {
            //Analytics - Track quantity change
            const action = 'basket:edit quantity';
            const analyticsData = {
                actionInfo: action,
                linkName: action,
                eventStrings: [anaConsts.Event.EVENT_71]
            };

            if (this.props.isBopis) {
                analyticsData.productStrings = [
                    anaUtils.buildSingleProductString({
                        sku: item.sku,
                        isQuickLook: false,
                        newProductQty: qty
                    })
                ];
            }

            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    ...analyticsData,
                    world: 'n/a',
                    pageName: `basket:${this.props.isBopis ? 'buy online and pickup' : 'basket'}:n/a:*`,
                    pageDetail: this.props.isBopis ? 'buy online and pickup' : 'basket'
                }
            });

            // Dispatch add & remove events for marketing pixels
            const newQuantity = parseInt(qty);
            const oldQuantity = item.qty;
            let quantityDifference;
            const {
                skuId, productName, brandName, variationValue, listPrice
            } = item.sku;
            const basketChangedData = {
                id: skuId,
                name: productName,
                brand: brandName,
                variant: variationValue || '',
                price: listPrice
            };
            const eventType = parseInt(qty) > item.qty ? anaConsts.EVENT_NAMES.ADD_TO_BASKET : anaConsts.EVENT_NAMES.REMOVE_FROM_BASKET;

            if (parseInt(qty) > item.qty) {
                quantityDifference = newQuantity - oldQuantity;
            } else {
                quantityDifference = oldQuantity - newQuantity;
            }

            basketChangedData.quantity = quantityDifference;

            window.dispatchEvent(new CustomEvent(eventType, { detail: basketChangedData }));

            const gaItem = {
                id: skuId,
                quantity: newQuantity
            };
            // UTS-580 - Add To Cart & Remove from Basket for GA Begin Checkout Event
            AddToBasketActions.fireGABeginCheckout(gaItem, 'editQuantity');

            updateBasket(qty, item);
        }
    };

    handleShipRestrictionsClick = e => {
        e.preventDefault();
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                eventStrings: [anaConsts.Event.EVENT_71],
                linkName: 'basket:shipping-restrictions',
                actionInfo: 'basket:shipping-restrictions'
            }
        });
    };

    getItemMessage = item => {
        return item.itemLevelMessages.filter(msg => {
            return basketConstants.WARNING_BLACKLIST_MESSAGES.indexOf(msg.messageContext) !== -1;
        });
    };

    componentDidMount() {
        this.showPaypalRestrictedMessage();
    }

    componentDidUpdate(prevState) {
        const isPickup = this.props.isRopis || this.props.isBopis;
        const prevBasket = isPickup ? prevState.basket.pickupBasket : prevState.basket;
        const basket = isPickup ? this.props.basket.pickupBasket : this.props.basket;

        if (prevBasket?.showPaypalRestrictedMessage !== basket?.showPaypalRestrictedMessage) {
            this.showPaypalRestrictedMessage();
        }

        const appliedPromotions = new Set();

        if (basket?.appliedPromotions?.length) {
            basket.appliedPromotions.forEach(promo => {
                if (!appliedPromotions.has(promo.couponCode)) {
                    appliedPromotions.add(promo.couponCode);
                }
            });
        }

        if (prevBasket?.appliedPromotions?.length) {
            prevBasket.appliedPromotions.forEach(prevPromo => {
                // If promos changed, there is no need to trigger an API call,
                // we just refresh the store to update the selection within PromoModal
                if (!appliedPromotions.has(prevPromo.couponCode)) {
                    this.props.removeMsgPromosByCode(prevPromo.couponCode);
                }
            });
        }
    }

    showPaypalRestrictedMessage = () => {
        /**
         * Show Paypal Restricted Message of item,
         * if it exists and wasn't shown before.
         * For Mobile: scroll to item
         */
        const basket = basketUtils.getCurrentBasketData(this.props.basket);

        if (this.props.item.sku.isPaypalRestricted && !this.state.showPaypalRestrictedMessage && basket.showPaypalRestrictedMessage) {
            this.setState({ showPaypalRestrictedMessage: true }, () => {
                if (window.matchMedia(breakpoints.xsMax).matches) {
                    const el = this.rootRef.current;

                    if (el && el.offsetTop) {
                        document.body.scrollTop = Math.max(el.offsetTop - site.headerHeight * 2, 0);
                    }
                }
            });
        }
    };

    showChangeMethodModal = (item, initialDeliveryOption) => () => {
        const user = this.props.user.profileId;
        const { toggleChangeMethodModal } = this.props;
        this.props.fetchProductSpecificDetails(user, item).then(() => {
            toggleChangeMethodModal(initialDeliveryOption, item);
        });
    };

    renderSwitchButton = () => {
        const { item, isBopis, isSameDay, isItemSDU } = this.props;
        const { isBOPISEnabled, isSameDayShippingEnabled } = Sephora.configurationSettings;
        const showChangeMethodButton = basketUtils.isBasketSwitchAvailable() && (isBOPISEnabled || isSameDayShippingEnabled) && !isItemSDU;

        let noButton = false;
        const buttonProps = {
            size: 'xs',
            variant: 'secondary'
        };

        const initialDeliveryOption = isBopis
            ? basketConstants.DELIVERY_OPTIONS.PICKUP
            : isSameDay
                ? basketConstants.DELIVERY_OPTIONS.SAME_DAY
                : item.isReplenishment
                    ? basketConstants.DELIVERY_OPTIONS.AUTO_REPLENISH
                    : basketConstants.DELIVERY_OPTIONS.STANDARD;

        const isStandardDelivery = initialDeliveryOption === basketConstants.DELIVERY_OPTIONS.STANDARD;

        /* Change method button have priority over Switch Basket button */
        if (showChangeMethodButton) {
            buttonProps.key = 'changeMethodButton';
            buttonProps.children = isStandardDelivery ? this.getText('getItSooner') : this.getText('changeMethod');
            buttonProps.disabled = !isBopis && (!item.sku.isSameDayEligibleSku || !item.sku.isPickUpEligibleSku);
            buttonProps.onClick = this.showChangeMethodModal(item, initialDeliveryOption);
        } else {
            noButton = true;
        }

        return noButton ? null : (
            <div>
                <Button {...buttonProps} />
            </div>
        );
    };

    getTargetUrlFromItem = () => {
        const { item } = this.props;

        return item.sku.fullSizeSku && item.sku.fullSizeSku.targetUrl ? item.sku.fullSizeSku.targetUrl : item.sku.targetUrl;
    };

    goToProductPage = event => {
        Location.navigateTo(event, this.getTargetUrlFromItem());
    };

    handleItemClick = item => () => {
        this.props.toggleChangeDeliveryFrequencyModal();
        this.props.updateCurrentItem(item);
    };

    renderQtyPicker = () => {
        const { allowQuantityChange = true, isBopis, user } = this.props;
        const isBopisBasket = isBopis ? isBopis : basketUtils.isPickup();
        const isKohlsStoreItem = Store.isKohlsStore(user?.preferredStoreInfo) && isBopisBasket;

        return isKohlsStoreItem ? false : !!allowQuantityChange;
    };

    render() {
        const {
            item, updateBasket, isUS, enablePageRenderTracking = null, isRopis, isBopis, hasPickupStoreReservationOnHoldError
        } = this.props;

        const isDCBasket = basketUtils.isDCBasket();
        const isPickup = isRopis || isBopis;

        const hasOOSError =
            item.itemLevelMessages &&
            item.itemLevelMessages.some(msg => msg && msg.messageContext === basketConstants.PICK_UP_ITEMS_OUT_OF_STOCK_SKU);

        if (isPickup && hasOOSError) {
            item.sku.isOutOfStock = true;
        }

        const displayName = (
            <>
                <strong data-at={Sephora.debug.dataAt('bsk_sku_brand')}>{item.sku.brandName}</strong>
                <br />
                <span data-at={Sephora.debug.dataAt('bsk_sku_name')}>{item.sku.productName}</span>
            </>
        );

        /*
            Special case where we don't want to show the item.itemLevelMessages as warnings
            but as a message next to the item
        */
        let isItemWithMsg = false;
        let itemMessages = [];
        let basketItemMessage;

        if (
            (skuUtils.isVIBFreeShipping(item.sku) || skuUtils.isCelebrationGift(item.sku)) &&
            !!(item.itemLevelMessages && item.itemLevelMessages.length)
        ) {
            itemMessages = this.getItemMessage(item);
        }

        if (itemMessages.length) {
            isItemWithMsg = true;
            basketItemMessage = itemMessages[0].messages[0];
        }

        const isValidMessage = itemLevelMessages =>
            Array.isArray(itemLevelMessages) && itemLevelMessages.length && Array.isArray(itemLevelMessages[0].messages);

        const isHazMatMessageOrProp65 = itemLevelMessages =>
            itemLevelMessages[0].messageContext === 'item.hazmatSku' || itemLevelMessages[0].messageContext === 'item.californiaRestricted';

        const errorMessages =
            item.itemLevelMessages &&
            item.itemLevelMessages.filter(
                msg =>
                    msg.messageContext !== 'item.hazmatSku' &&
                    msg.messageContext !== 'item.californiaRestricted' &&
                    msg.messageContext !== 'item.skuOutOfStock' &&
                    msg.messageContext !== 'basket.pickupsku.outOfStock'
            );

        const targetUrl = item.sku.fullSizeSku && item.sku.fullSizeSku.targetUrl ? item.sku.fullSizeSku.targetUrl : item.sku.targetUrl;

        const [frequencyType = null, frequencyNum = null] = item?.isReplenishment ? item?.replenishmentFrequency?.split(':') : [];

        return (
            <div
                ref={this.rootRef}
                data-at={Sephora.debug.dataAt('product_refinement')}
            >
                {
                    //hazmat message will be displayed in a popover and not here
                    // avoid prop65 to be duplicated
                    isValidMessage(errorMessages) &&
                    (!item.sku.isPaypalRestricted || this.state.showPaypalRestrictedMessage || errorMessages.length > 1) &&
                    (!isHazMatMessageOrProp65(item.itemLevelMessages) || basketUtils.isItemRestrictedForShipping(item)) &&
                    !isItemWithMsg ? (
                            <ErrorMsg
                                marginBottom={2}
                                children={errorMessages[0].messages[0]}
                            />
                        ) : null
                }
                {
                    /*
                        it ensures that everytime an item is prop65
                        it will display the error in the right place
                     */
                    isUS && item.sku.isProp65 && <ErrorMsg children={PROP_65_MSG} />
                }
                <Grid
                    gap={[`${SM_IMG_GAP}px`, 4]}
                    columns='auto 1fr'
                    lineHeight='tight'
                    alignItems='start'
                >
                    <Box
                        onClick={this.goToProductPage}
                        href={targetUrl}
                        data-at={Sephora.debug.dataAt('product_img_link')}
                    >
                        <ProductImage
                            id={item.sku.skuId}
                            size={[SM_IMG_SIZE, 97]}
                            skuImages={item.sku.skuImages}
                            isPageRenderImg={enablePageRenderTracking}
                            disableLazyLoad={true}
                            altText={this.props.isItemSDU ? this.props.sephoraSubscription : getImageAltText(item.sku)}
                        />
                    </Box>
                    <div>
                        <Grid
                            gap={2}
                            columns='1fr auto'
                            minHeight={[SM_IMG_SIZE, 0]}
                        >
                            <Box fontSize='sm'>
                                <Text
                                    is='p'
                                    fontSize={['sm', 'base']}
                                    marginBottom={1}
                                >
                                    {targetUrl ? (
                                        <Link
                                            display='block'
                                            onClick={this.goToProductPage}
                                            href={targetUrl ? targetUrl : null}
                                        >
                                            {displayName}
                                        </Link>
                                    ) : (
                                        displayName
                                    )}
                                </Text>
                                {this.props.isItemSDU ? (
                                    <SDURenewalPricing
                                        hasUserSDUTrial={this.props.hasUserSDUTrial}
                                        SDUFormattedDate={this.props.SDUFormattedDate}
                                        sduListPrice={this.props.sduListPrice}
                                    />
                                ) : (
                                    <SizeAndItemNumber
                                        sku={item.sku}
                                        fontSize={['xs', 'sm']}
                                    />
                                )}
                                <ProductVariation
                                    sku={item.sku}
                                    fontSize={['xs', 'sm']}
                                    marginTop={1}
                                    data-at={Sephora.debug.dataAt('bsk_sku_var')}
                                />
                                {isDCBasket && item.sku.isOnlyFewLeft && <OnlyFewLeftFlag marginTop={2} />}
                                {item.isReplenishment && (
                                    <>
                                        <Link
                                            onClick={this.handleItemClick(item)}
                                            display='block'
                                            arrowDirection='down'
                                            fontSize='sm'
                                            paddingTop={2}
                                        >
                                            {this.getRopisText('deliveryEvery')}
                                            {': '}
                                            <Text fontWeight='bold'>
                                                {frequencyNum} {formatFrequencyType(frequencyNum, frequencyType)}
                                            </Text>
                                        </Link>
                                        {item.sku?.acceleratedPromotion && (
                                            <Flex flexDirection='column'>
                                                <Text css={styles.legalText}>
                                                    {this.getRopisText(
                                                        'autoReplenishLegalText1',
                                                        false,
                                                        item.sku.acceleratedPromotion.promotionDuration
                                                    )}
                                                </Text>
                                                <Text css={styles.legalText}>
                                                    {this.getRopisText(
                                                        'autoReplenishLegalText2',
                                                        false,
                                                        item.sku.acceleratedPromotion.childOrderCount,
                                                        item.sku.acceleratedPromotion.promotionDuration,
                                                        Math.ceil(item.sku.acceleratedPromotion.baseReplenishmentAdjuster)
                                                    )}
                                                </Text>
                                                <Text css={styles.legalText}>
                                                    {this.getRopisText(
                                                        'autoReplenishLegalText3',
                                                        false,
                                                        DateUtil.getDateInMDYFormat(item.sku.acceleratedPromotion.promotionExpirationDate)
                                                    )}
                                                </Text>
                                            </Flex>
                                        )}
                                    </>
                                )}
                                {item.sku.isHazmat && (
                                    <Tooltip
                                        dataAt='popover_text'
                                        content={this.getText('shippingRestrictionPopoverText')}
                                        side='bottom'
                                    >
                                        <Link
                                            onClick={this.handleShipRestrictionsClick}
                                            data-at={Sephora.debug.dataAt('shipping_restrictions_btn')}
                                            color='gray'
                                            fontSize='sm'
                                            paddingTop={1}
                                        >
                                            {this.getText('shippingRestrictions')}
                                            <InfoButton
                                                marginLeft={-1}
                                                size={13}
                                            />
                                        </Link>
                                    </Tooltip>
                                )}
                                {/* supress OOS error message if basket.pickupStoreReservationOnHold message was raised on the basket level */}
                                {item.sku.isOutOfStock && !hasPickupStoreReservationOnHoldError && (
                                    <Text
                                        is='p'
                                        fontWeight='bold'
                                        color='red'
                                        marginTop={1}
                                    >
                                        {skuUtils.isBiReward(item.sku)
                                            ? this.getText('soldOut')
                                            : isPickup
                                                ? this.getText('outOfStockAtStore')
                                                : this.getText('outOfStock')}
                                    </Text>
                                )}
                                {item.sku.rewardSubType === 'Reward_Card' && (
                                    <Text
                                        is='p'
                                        marginTop={1}
                                    >
                                        {this.getText('rewardCardText', true)}
                                    </Text>
                                )}
                                <FinalSaleItem isReturnable={item.sku.isReturnable} />
                                {isItemWithMsg && (
                                    <Grid
                                        columns='auto 1fr'
                                        gap={2}
                                        marginTop={2}
                                        backgroundColor='nearWhite'
                                        paddingX={3}
                                        paddingY={2}
                                        borderRadius={2}
                                    >
                                        <Icon
                                            name='alert'
                                            color='midGray'
                                            size={18}
                                        />
                                        <span children={basketItemMessage} />
                                    </Grid>
                                )}
                            </Box>
                            <div
                                css={{
                                    fontWeight: 'var(--font-weight-bold)',
                                    textAlign: 'right'
                                }}
                            >
                                <div
                                    css={
                                        (item.sku.salePrice || item.isReplenishment) && {
                                            fontWeight: 'var(--font-weight-normal)',
                                            textDecoration: 'line-through'
                                        }
                                    }
                                    data-at={Sephora.debug.dataAt('bsk_sku_price')}
                                    children={this.props.isItemSDU ? this.props.sduRenewalPrice : item.listPriceSubtotal}
                                />
                                {(item.sku.salePrice || item.isReplenishment) && (
                                    <div
                                        css={{ color: colors.red }}
                                        data-at={Sephora.debug.dataAt('bsk_sale_price')}
                                        children={
                                            item.isReplenishment
                                                ? `${item?.sku?.replenishmentAdjusterPrice}${item.sku?.acceleratedPromotion ? '*' : ''}`
                                                : item.salePriceSubtotal
                                        }
                                    />
                                )}
                            </div>
                        </Grid>
                        <Grid
                            columns={[`${SM_IMG_SIZE}px 1fr auto`, 'auto 1fr auto']}
                            marginLeft={[`-${SM_IMG_SIZE + SM_IMG_GAP}px`, 0]}
                            marginTop={[3, 4]}
                            gap={[`${SM_IMG_GAP}px`, this.renderQtyPicker() ? 4 : 0]}
                            fontSize='sm'
                            alignItems='center'
                        >
                            <div css={{ textAlign: 'center' }}>
                                {this.renderQtyPicker() && (
                                    <SkuQuantity
                                        inputProps={{ size: 'sm' }}
                                        currentSku={item.sku}
                                        skuQuantity={this.props.item.qty}
                                        isNotChangeable={item.isReplenishment}
                                        disabled={this.props.isQuantityChangeable}
                                        handleSkuQuantity={value => this.handleSkuQuantity(value, item, updateBasket)}
                                        source='qty'
                                    />
                                )}
                            </div>
                            <div>
                                {this.props.displayLovesIcon && (
                                    <>
                                        {item.sku.actionFlags.myListStatus === 'notAdded' ? (
                                            <Link
                                                color='blue'
                                                padding={1}
                                                margin={-1}
                                                onClick={this.handleMoveToLoveClick(item)}
                                                data-at={Sephora.debug.dataAt('bsk_sku_love')}
                                                children={this.getText('moveToLoves')}
                                            />
                                        ) : (
                                            <span
                                                css={{ color: colors.gray }}
                                                data-at={Sephora.debug.dataAt('loved_label')}
                                            >
                                                {this.getText('loved')}
                                            </span>
                                        )}
                                        {skuUtils.isGwp(item.sku) || (
                                            <Text
                                                color='midGray'
                                                marginX='.5em'
                                                children='|'
                                            />
                                        )}
                                    </>
                                )}
                                {(!skuUtils.isGwp(item.sku) || Sephora.isAgent) && (
                                    <Link
                                        color='blue'
                                        padding={1}
                                        margin={-1}
                                        onClick={this.removeItemFromBasket(item)}
                                        data-at={Sephora.debug.dataAt('bsk_sku_remove')}
                                        children={this.getText('remove')}
                                    />
                                )}
                            </div>
                            {this.renderSwitchButton()}
                        </Grid>
                    </div>
                </Grid>
            </div>
        );
    }
}

const styles = {
    legalText: {
        marginTop: space[4],
        fontSize: 'sm',
        color: 'gray'
    }
};

export default wrapComponent(BasketListItem, 'BasketListItem', true);
