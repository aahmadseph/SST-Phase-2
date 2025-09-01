import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { breakpoints, forms } from 'style/config';
import AddToBasketButton from 'components/AddToBasketButton';
import SeeProductDetails from 'components/SeeProductDetails';
import basketUtils from 'utils/Basket';
import ProductLove from 'components/Product/ProductLove';
import {
    Flex, Box, Link, Text, Icon, Button, Grid
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import ProductLoveToggle from 'components/Product/ProductLove/ProductLoveToggle/ProductLoveToggle';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import ProductDisplayName from 'components/Product/ProductDisplayName/ProductDisplayName';
import SizeAndItemNumber from 'components/Product/SizeAndItemNumber/SizeAndItemNumber';
import ProductQuicklook from 'components/Product/ProductQuicklook/ProductQuicklook';
import FinalSaleItem from 'components/SharedComponents/FinalSaleItem';
import OnlyFewLeftFlag from 'components/OnlyFewLeftFlag/OnlyFewLeftFlag';
import SDURenewalPricing from 'components/SDURenewalPricing';
import dateUtils from 'utils/Date';
import deliveryFrequencyUtils from 'utils/DeliveryFrequency';
import localeUtils from 'utils/LanguageLocale';
import { itemWidths } from 'components/Product/ProductListItem/constants';
import orderUtils from 'utils/Order';
import skuUtils from 'utils/Sku';
import analyticsUtils from 'analytics/utils';
import { supplementAltTextWithProduct } from 'utils/Accessibility';
import store from 'Store';
import loveActions from 'actions/LoveActions';
import Actions from 'Actions';
import { DebouncedResize } from 'constants/events';
import SubstituteItem from 'components/ItemSubstitution/SubstituteItem';
import skuHelpers from 'utils/skuHelpers';
import Location from 'utils/Location';

const getText = localeUtils.getLocaleResourceFile('components/Product/ProductListItem/locales', 'ProductListItem');

const { formatFrequencyType } = deliveryFrequencyUtils;
const { removeLove } = loveActions;
const ADD_BUTTON_TYPE = basketUtils.ADD_TO_BASKET_TYPES;
const LOVE_ICON_SIZE = 24;
const SKU_BI_TYPE_BIRTHDAY = 'Birthday Gift';

function renderAdvisorNote(artistNotes) {
    return (
        <Text
            is='p'
            fontSize='sm'
            marginTop={2}
        >
            <strong children={getText('advisorNotes')} />
            <br />
            {artistNotes}
        </Text>
    );
}

function renderBottomActions(sku, isSmallView) {
    return (
        <Flex
            marginTop={isSmallView ? 3 : 1}
            justifyContent='center'
        >
            <Box
                width='100%'
                display='flex'
                alignItems='baseline'
                justifyContent='space-around'
                textAlign='center'
                flexDirection={isSmallView ? 'row' : 'column'}
            >
                <Link
                    display='block'
                    marginX='auto'
                    padding={isSmallView ? 0 : 2}
                    marginBottom={-2}
                    color='blue'
                    data-at={Sephora.debug.dataAt('write_review_btn')}
                    href={`/addReview?productId=${sku.productId}&skuId=${sku.skuId}`}
                    children={getText('writeAReview')}
                />
                {isSmallView && (
                    <Box
                        marginX={2}
                        height='1em'
                        borderLeft={1}
                        borderColor='gray'
                    />
                )}
                <Link
                    display='block'
                    marginX='auto'
                    padding={isSmallView ? 0 : 2}
                    marginBottom={-2}
                    color='blue'
                    data-at={Sephora.debug.dataAt('answer_question_btn')}
                    href={`${sku.targetUrl}#QandA`}
                    children={getText('answerAQuestion')}
                />
            </Box>
        </Flex>
    );
}

/* eslint-disable-next-line complexity */
function renderItemActions(props, showBottomActions, hasParentLink) {
    const {
        product, sku, showFindInStore, isLovedItemList, isPublicLovesList, isPurchaseHistoryItemList, isRecentRewardItemList, isOrderDetail
    } =
        props;
    const isSubscriptionSku = skuUtils.isSubscription(sku);

    let productListItemButton;
    const ctaText = {
        shopTheBrand: getText('shopTheBrand'),
        viewFullSize: getText('viewFullSize')
    };
    const analyticsContext = isRecentRewardItemList ? getText('recentActivity') : isPurchaseHistoryItemList ? getText('purchases') : '';

    const removeLovesHandler = (e, currentSku) => {
        e.preventDefault();
        store.dispatch(
            removeLove(
                currentSku.skuId,
                () => {},
                () => {},
                currentSku.productId
            )
        );
    };

    if (!sku.isActive) {
        productListItemButton = (
            <Text
                is='p'
                data-at={Sephora.debug.dataAt('item_is_no_longer_available')}
                height={forms.HEIGHT}
                display='flex'
                justifyContent='center'
                textAlign='center'
                alignItems='center'
                color='gray'
            >
                {getText('itemIsNoLongerAvailable')}
            </Text>
        );
    } else if (skuUtils.isCountryRestricted(sku)) {
        productListItemButton = (
            <Text
                is='p'
                data-at={Sephora.debug.dataAt('item_cannot_be_shipped')}
                height={forms.HEIGHT}
                display='flex'
                justifyContent='center'
                textAlign='center'
                alignItems='center'
                color='gray'
            >
                {getText(localeUtils.isCanada() ? 'itemShipToCanada' : 'itemShipToUS')}
            </Text>
        );
    } else if (!sku.isOutOfStock && skuUtils.isBiExclusive(sku) && !skuHelpers.isBiQualify(sku)) {
        productListItemButton = (
            <Button
                variant='secondary'
                block={true}
                href={hasParentLink ? null : sku.targetUrl}
            >
                {getText('viewDetails')}
            </Button>
        );
    } else if (skuUtils.isBiRewardGwpSample(sku)) {
        const isFullSizeOrderable = sku.actionFlags && sku.actionFlags.isFullSizeSkuOrderable;
        const buttonText = isFullSizeOrderable ? ctaText.viewFullSize : isRecentRewardItemList && sku.brandId ? ctaText.shopTheBrand : null;
        const href = buttonText === ctaText.shopTheBrand ? sku.seoBrandUrl || null : sku.fullSizeSku ? sku.fullSizeSku.targetUrl : sku.targetUrl;
        const analyticsCTAText =
            buttonText === ctaText.shopTheBrand ? getText('viewBrand') : buttonText === ctaText.viewFullSize ? getText('viewFullSize') : '';

        const ctaTrackingData = [analyticsContext, sku.productId, analyticsCTAText].join(':');

        productListItemButton = (
            <Button
                variant='secondary'
                style={buttonText && href ? null : { visibility: 'hidden' }}
                block={true}
                onClick={e => {
                    analyticsUtils.setNextPageDataAndRedirect(e, {
                        trackingData: {
                            linkData: ctaTrackingData,
                            internalCampaign: ctaTrackingData
                        },
                        destination: href
                    });
                }}
            >
                {buttonText}
            </Button>
        );
    } else {
        productListItemButton = (
            <React.Fragment>
                {sku.isExternallySellable ? (
                    <SeeProductDetails
                        block={true}
                        url={hasParentLink ? null : sku.targetUrl}
                        variant='secondary'
                        size='lg'
                    />
                ) : (
                    <AddToBasketButton
                        block={true}
                        product={isOrderDetail ? product : null}
                        analyticsContext={analyticsContext}
                        sku={sku}
                        variant={Location.isPurchaseHistoryPage() ? ADD_BUTTON_TYPE.SECONDARY : ADD_BUTTON_TYPE.SPECIAL}
                        isOrderDetail={isOrderDetail}
                    />
                )}
                {sku.isOutOfStock && showFindInStore && (
                    <Link
                        display='block'
                        marginX='auto'
                        paddingY={2}
                        marginBottom={-2}
                        color='blue'
                        onClick={e => showFindInStore(e, sku)}
                    >
                        {getText('findInStore')}
                    </Link>
                )}
            </React.Fragment>
        );
    }

    const imageProps = {
        id: sku.skuId,
        skuImages: sku.skuImages,
        disableLazyLoad: true,
        altText: supplementAltTextWithProduct(sku, product)
    };

    return (
        <Flex marginTop={showBottomActions && 3}>
            <Box
                marginRight={5}
                width={165}
                style={isSubscriptionSku ? { visibility: 'hidden' } : null}
            >
                {productListItemButton}
                {sku.isActive &&
                    isPurchaseHistoryItemList &&
                    !showBottomActions &&
                    skuUtils.showAddReview(sku) &&
                    renderBottomActions(sku, showBottomActions)}
            </Box>

            <Box
                paddingTop={(forms.HEIGHT - LOVE_ICON_SIZE) / 2 + 'px'}
                style={!sku.isActive ? { visibility: 'hidden' } : null}
            >
                {
                    // ILLUPH-100286 redo source as something generic,
                    // and remove the css visibility hidden above
                }
                {skuUtils.isStandardProduct(sku) ? (
                    isLovedItemList && !isPublicLovesList ? (
                        <Box
                            aria-label='Unlove'
                            onClick={e => removeLovesHandler(e, sku)}
                            color='red'
                            lineHeight='0'
                        >
                            <Icon
                                size={LOVE_ICON_SIZE}
                                name='heart'
                            />
                        </Box>
                    ) : (
                        <ProductLove
                            sku={sku}
                            loveSource='productPage'
                            productId={sku?.productId || product?.productId}
                            currentProduct={product}
                            imageProps={imageProps}
                        >
                            <ProductLoveToggle
                                productId={sku?.productId || product?.productId}
                                size={LOVE_ICON_SIZE}
                            />
                        </ProductLove>
                    )
                ) : (
                    <Icon
                        style={{ visibility: 'hidden' }}
                        name='heart'
                        size={LOVE_ICON_SIZE}
                    />
                )}
            </Box>
        </Flex>
    );
}

function renderPrice(props) {
    const { sku, isSDUSubscriptionInOrder } = props;
    let dataAt;

    if (props.isPurchaseHistoryItemList) {
        dataAt = Sephora.debug.dataAt('purchases_product_price');
    }

    if (props.isOrderDetail) {
        dataAt = Sephora.debug.dataAt('purchase_price');
    }

    return (
        <Box
            data-at={dataAt ? dataAt : null}
            fontWeight='bold'
        >
            <span
                css={sku.salePrice && { textDecoration: 'line-through' }}
                data-at={Sephora.debug.dataAt('sku_item_price_list')}
                dangerouslySetInnerHTML={{
                    __html: skuUtils.isBirthdayGift(sku)
                        ? SKU_BI_TYPE_BIRTHDAY
                        : isSDUSubscriptionInOrder
                            ? `${sku.listPrice}*`
                            : sku.listPrice.replace(' ', '&nbsp;')
                }}
            />
            {sku.salePrice && (
                <Text
                    display='block'
                    color='red'
                    data-at={Sephora.debug.dataAt('sku_item_price_sale')}
                    dangerouslySetInnerHTML={{ __html: sku.salePrice.replace(' ', '&nbsp;') }}
                />
            )}
            {sku.valuePrice && (
                <Text
                    display='block'
                    fontWeight='normal'
                    data-at={Sephora.debug.dataAt('sku_item_price_value')}
                    dangerouslySetInnerHTML={{ __html: sku.valuePrice.replace(' ', '&nbsp;') }}
                />
            )}
        </Box>
    );
}

function renderYouMayAlsoLikeModal(e, sku) {
    e.preventDefault();
    store.dispatch(
        Actions.showSimilarProductsModal({
            isOpen: true,
            brandName: sku.brandName,
            productName: sku.productName,
            productImages: sku.skuImages,
            productId: sku.productId,
            itemId: sku.productId,
            isYouMayAlsoLike: true,
            analyticsData: { linkData: 'purchase history' },
            skuId: sku.skuId
        })
    );
}

class ProductListItem extends BaseClass {
    state = {
        hover: false,
        isSmallView: null
    };

    componentDidMount() {
        this.handleResize();
        window.addEventListener(DebouncedResize, this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    handleResize = () => {
        const { isSmallView } = this.state;
        const isSM = window.matchMedia(breakpoints.smMax).matches;

        if (!isSmallView && isSM) {
            this.setState({ isSmallView: true });
        } else if (isSmallView && !isSM) {
            this.setState({ isSmallView: false });
        }
    };

    hoverOn = () => {
        this.setState({ hover: true });
    };

    hoverOff = () => {
        this.setState({ hover: false });
    };

    shouldShowSubstitution = () => {
        const { sku, showSubstituteOrPolicy } = this.props;
        const isSample = skuUtils.isSample(sku);
        const isBiReward = skuUtils.isBiReward(sku);
        const isBirthdayGift = skuUtils.isBirthdayGift(sku);

        return showSubstituteOrPolicy && !isSample && !isBiReward && !isBirthdayGift;
    };

    /* eslint-disable-next-line complexity */
    render() {
        const {
            sku,
            product = {},
            qty,
            amount,
            isRecentRewardItemList,
            isPurchaseHistoryItemList,
            showQuickLookOnMobile,
            dataAt,
            isLovedItemList,
            autoReplenishFrequency,
            shouldDisplayOnlyFewLeftFlag = false,
            listPrice,
            replenishmentPaymentDate,
            isSDUSubscriptionInOrder,
            substituteItem,
            isSubstitutedItem,
            forceOutOfStockLabel
        } = this.props;

        const { isSmallView, hover } = this.state;
        const isLargeView = !isSmallView;

        const isSampleSkuWithoutFullSize = skuUtils.isSample(sku) && !sku.actionFlags.isFullSizeSkuOrderable;
        const isSample = skuUtils.isSample(sku);

        const shouldShowQuickLook = sku.isActive && !this.props.isOrderDetail;

        const hasHover = !Sephora.isTouch && sku.isActive;

        const dataAtContainer = dataAt
            ? Sephora.debug.dataAt(dataAt)
            : isPurchaseHistoryItemList
                ? Sephora.debug.dataAt('purchase_history_item')
                : null;

        const [frequencyType, frequencyNum] = autoReplenishFrequency ? autoReplenishFrequency.split(':') : [];
        const isSDU = skuUtils.isSDU(sku);
        const isSDUTrial = isSDU && orderUtils.isZeroPrice(listPrice);

        return (
            <div>
                <LegacyGrid
                    data-at={dataAtContainer}
                    lineHeight='tight'
                    gutter={isSmallView ? 4 : 6}
                >
                    <LegacyGrid.Cell width={isSmallView || (!isSmallView && !qty) ? 'fill' : itemWidths.DESC}>
                        <Grid
                            gap={isSmallView ? 2 : 5}
                            columns='auto 1fr'
                            href={skuUtils.isCountryRestricted(sku) || !sku.isActive || isSample ? null : sku.targetUrl}
                            onMouseEnter={hasHover ? this.hoverOn : null}
                            onFocus={hasHover ? this.hoverOn : null}
                            onMouseLeave={hasHover ? this.hoverOff : null}
                            onBlur={hasHover ? this.hoverOff : null}
                            css={{ outline: 0 }}
                        >
                            <div css={{ position: 'relative' }}>
                                <ProductImage
                                    disableLazyLoad={true}
                                    id={sku.skuId}
                                    size={itemWidths.IMAGE}
                                    skuImages={sku.skuImages}
                                    altText={supplementAltTextWithProduct(sku, product)}
                                />
                                {shouldShowQuickLook && (
                                    <ProductQuicklook
                                        isShown={hover}
                                        sku={sku}
                                        showQuickLookOnMobile={showQuickLookOnMobile}
                                        rootContainerName={this.props.rootContainerName}
                                        productStringContainerName={this.props.productStringContainerName}
                                    />
                                )}
                            </div>
                            <div>
                                <Grid
                                    columns={isSmallView && '1fr auto'}
                                    gap={isSmallView && 2}
                                >
                                    <div>
                                        <ProductDisplayName
                                            fontSize='base'
                                            brandName={isSampleSkuWithoutFullSize ? sku.variationValue : sku.brandName}
                                            productName={isSampleSkuWithoutFullSize ? null : sku.productName}
                                            isHovered={hover && !skuUtils.isCountryRestricted(sku)}
                                        />
                                        {isSDU && (
                                            <Box fontSize='sm'>
                                                <SDURenewalPricing
                                                    hasUserSDUTrial={isSDUTrial}
                                                    SDUFormattedDate={dateUtils.getDateInMMDDYYYYShortMonth(replenishmentPaymentDate)}
                                                    sduListPrice={sku.listPrice}
                                                />
                                            </Box>
                                        )}
                                    </div>
                                    {isSmallView && (
                                        <Box
                                            data-at={this.props.isOrderDetail && Sephora.debug.dataAt('purchase_amount')}
                                            maxWidth='6.75em'
                                            fontWeight='bold'
                                            textAlign='right'
                                            dangerouslySetInnerHTML={
                                                amount
                                                    ? {
                                                        __html:
                                                              skuUtils.isFree(sku) || isSDUTrial
                                                                  ? `${getText('free')}${isSDUTrial ? '*' : ''}`
                                                                  : isSDUSubscriptionInOrder
                                                                      ? `${amount}*`
                                                                      : `${amount.replace(' ', '&nbsp;')}${isSDU ? '*' : ''}`
                                                    }
                                                    : null
                                            }
                                            children={!amount ? renderPrice(this.props) : null}
                                        />
                                    )}
                                </Grid>
                                {!isSDU && (
                                    <SizeAndItemNumber
                                        isPurchaseHistoryItemList={isPurchaseHistoryItemList}
                                        sku={sku}
                                        fontSize='sm'
                                        marginTop={1}
                                        isLovedItemList={isLovedItemList}
                                    />
                                )}
                                <ProductVariation
                                    fontSize='sm'
                                    marginTop={1}
                                    {...skuUtils.getProductVariations({ sku })}
                                />
                                {isSubstitutedItem && (
                                    <Box
                                        alignItems='center'
                                        display='flex'
                                        paddingTop={1}
                                    >
                                        <Grid
                                            gap='1'
                                            alignItems='center'
                                            columns='auto 1fr'
                                        >
                                            <Icon name='shuffle' />
                                            <Text marginBottom={1}>{getText('itemSubstituted')}</Text>
                                        </Grid>
                                    </Box>
                                )}
                                {autoReplenishFrequency && !isSmallView && (
                                    <Text
                                        fontWeight='bold'
                                        display='block'
                                        paddingTop={3}
                                    >
                                        {getText('deliveryEvery')} {frequencyNum} {formatFrequencyType(frequencyNum, frequencyType)}
                                    </Text>
                                )}
                                {!isSmallView && skuUtils.isStandardProduct(sku) && (
                                    <Box marginTop={2}>
                                        <Link
                                            padding={2}
                                            margin={-2}
                                            onClick={e => renderYouMayAlsoLikeModal(e, sku)}
                                            color='blue'
                                        >
                                            {getText('similarProductsLink')}
                                        </Link>
                                    </Box>
                                )}
                                {isSmallView && qty && (
                                    <Text
                                        is='p'
                                        fontSize='sm'
                                        marginTop={1}
                                    >
                                        {getText('qty')}: <b>{qty}</b>
                                    </Text>
                                )}
                                {autoReplenishFrequency && isSmallView && (
                                    <Text
                                        fontWeight='bold'
                                        display='block'
                                        paddingTop={3}
                                    >
                                        {getText('deliveryEvery')} {frequencyNum} {formatFrequencyType(frequencyNum, frequencyType)}
                                    </Text>
                                )}
                                {isLargeView && sku.artistNote && renderAdvisorNote(sku.artistNote)}
                                {isRecentRewardItemList && (
                                    <Text
                                        is='p'
                                        marginTop={1}
                                        fontSize='sm'
                                        color='gray'
                                        children={`${getText('redeemed')} ${sku.readableTransactionDate}`}
                                    />
                                )}
                                {shouldDisplayOnlyFewLeftFlag && <OnlyFewLeftFlag marginTop={2} />}
                                <FinalSaleItem isReturnable={sku.isReturnable} />
                                {isSmallView && !isSDU && renderItemActions(this.props, true, true)}
                                {isSmallView && sku.artistNote && renderAdvisorNote(sku.artistNote)}
                                {sku.isActive &&
                                    isPurchaseHistoryItemList &&
                                    isSmallView &&
                                    skuUtils.showAddReview(sku) &&
                                    renderBottomActions(sku, isSmallView)}
                            </div>
                        </Grid>
                        {this.shouldShowSubstitution() && isLargeView && (
                            <SubstituteItem
                                item={substituteItem}
                                forceOutOfStockLabel={forceOutOfStockLabel}
                            />
                        )}
                    </LegacyGrid.Cell>
                    {isLargeView && (
                        <LegacyGrid.Cell width={itemWidths.PRICE}>
                            {isSDUTrial ? <strong>{getText('free')}*</strong> : renderPrice(this.props)}
                        </LegacyGrid.Cell>
                    )}
                    {isLargeView && qty && <LegacyGrid.Cell width={itemWidths.QTY}>{qty}</LegacyGrid.Cell>}
                    {isLargeView && amount && (
                        <LegacyGrid.Cell
                            width={itemWidths.AMOUNT}
                            fontWeight='bold'
                            textAlign='right'
                            data-at={this.props.isOrderDetail && Sephora.debug.dataAt('purchase_amount')}
                            dangerouslySetInnerHTML={{
                                __html: isSDUTrial
                                    ? `${getText('free')}*`
                                    : skuUtils.isFree(sku)
                                        ? getText('free')
                                        : isSDUSubscriptionInOrder
                                            ? `${amount}*`
                                            : amount.replace(' ', '&nbsp;')
                            }}
                        />
                    )}
                    {isLargeView && !isSDU && (
                        <LegacyGrid.Cell width={itemWidths.ACTION}>{renderItemActions(this.props, false, false)}</LegacyGrid.Cell>
                    )}
                </LegacyGrid>
                {this.shouldShowSubstitution() && isSmallView && (
                    <SubstituteItem
                        item={substituteItem}
                        forceOutOfStockLabel={forceOutOfStockLabel}
                    />
                )}
            </div>
        );
    }
}

export default wrapComponent(ProductListItem, 'ProductListItem', true);
