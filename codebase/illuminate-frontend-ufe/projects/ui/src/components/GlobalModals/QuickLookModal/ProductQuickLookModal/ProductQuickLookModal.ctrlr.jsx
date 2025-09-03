/* eslint-disable object-curly-newline */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { forms, space, modal } from 'style/config';
import { Box, Grid, Flex, Text, Link, Button, Divider } from 'components/ui';
import store from 'Store';
import watch from 'redux-watch';
import skuUtils from 'utils/Sku';
import Modal from 'components/Modal/Modal';
import StarRating from 'components/StarRating/StarRating';
import ProductBadges from 'components/Product/ProductBadges/ProductBadges';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import SkuQuantity from 'components/Product/SkuQuantity';
import ProductSwatchGroup from 'components/Product/ProductSwatchGroup/ProductSwatchGroup';
import ProductLoveToggle from 'components/Product/ProductLove/ProductLoveToggle/ProductLoveToggle';
import AddToBasketButton from 'components/AddToBasketButton';
import SeeProductDetails from 'components/SeeProductDetails';
import ProductLove from 'components/Product/ProductLove';
import ProductLoveButton from 'components/Product/ProductLove/ProductLoveButton/ProductLoveButton';
import ProductLovesCount from 'components/Product/ProductLovesCount/ProductLovesCount';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import SizeAndItemNumber from 'components/Product/SizeAndItemNumber/SizeAndItemNumber';
import MarketingFlags from 'components/Product/MarketingFlags/MarketingFlags';
import ProductQuickLookMessage from 'components/GlobalModals/QuickLookModal/ProductQuickLookModal/ProductQuickLookMessage/ProductQuickLookMessage';
import BasketUtils from 'utils/Basket';
import SkuUtils from 'utils/Sku';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import CallToActions from 'components/GlobalModals/QuickLookModal/ProductQuickLookModal/CallToActions/CallToActions';
import LocationUtils from 'utils/Location';
import localeUtils from 'utils/LanguageLocale';
import { supplementAltTextWithProduct } from 'utils/Accessibility';
import uiUtils from 'utils/UI';
import Location from 'utils/Location';
import MediaUtils from 'utils/Media';
import NumberUtils from 'utils/Number';
import Actions from 'Actions';
import quickLookModalUtils from 'utils/Quicklook';
import CarouselArrow from 'components/Carousel/CarouselArrow';
import CarouselConstants from 'components/Carousel/constants';
import Loader from 'components/Loader';
import { DebouncedResize } from 'constants/events';
import skuHelpers from 'utils/skuHelpers';

const { Media } = MediaUtils;
const { formatReviewCount } = NumberUtils;
const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = BasketUtils;
const { skuTypes: SKU_TYPES } = SkuUtils;
const { ARROW_SIZE: CAROUSEL_ARROW_SIZE } = CarouselConstants;

const CAROUSEL_ARROW_OFFSET = CAROUSEL_ARROW_SIZE + space[2];
const MODAL_WIDTH = 5;

const getText = text =>
    localeUtils.getLocaleResourceFile('components/GlobalModals/QuickLookModal/ProductQuickLookModal/locales', 'ProductQuickLookModal')(text);

const PRODUCT_ERROR_CODES = {
    COUNTRY_RESTRICTED_SKU: -4,
    INACTIVE_SKU: -12,
    INVALID_INPUT: -13,
    SKU_NOT_AVAILABLE: -15
};

const PRODUCT_ERROR_MESSAGES = {
    [PRODUCT_ERROR_CODES.COUNTRY_RESTRICTED_SKU]: 'Sorry, this product is not available ' + 'in your country.',
    [PRODUCT_ERROR_CODES.INACTIVE_SKU]: 'Sorry, this product is no longer available.',
    [PRODUCT_ERROR_CODES.INVALID_INPUT]: 'Sorry, this product is no longer available.',
    [PRODUCT_ERROR_CODES.SKU_NOT_AVAILABLE]: 'Sorry, this product is no longer available.',
    UNKNOWN: 'Sorry, product details are not available right now. Please try again later.'
};

const ProductLoveQL = ({ handleOnClick, hover, isActive, isAnonymous, mouseEnter, mouseLeave, skuLoveData, currentSku }) => {
    return (
        <>
            <Media at='xs'>
                <ProductLoveToggle
                    fontSize={22}
                    handleOnClick={handleOnClick}
                    hover={hover}
                    isActive={isActive}
                    isAnonymous={isAnonymous}
                    mouseEnter={mouseEnter}
                    mouseLeave={mouseLeave}
                    sku={currentSku}
                    skuLoveData={skuLoveData}
                    productId={currentSku?.productId}
                />
            </Media>
            <Media greaterThan='xs'>
                <ProductLoveButton
                    block
                    currentSku={currentSku}
                    handleOnClick={handleOnClick}
                    hover={hover}
                    isActive={isActive}
                    mouseEnter={mouseEnter}
                    mouseLeave={mouseLeave}
                    skuLoveData={skuLoveData}
                />
            </Media>
        </>
    );
};

function getProductPrice(currentSku) {
    return (
        <Box
            fontSize='md'
            lineHeight='tight'
            marginTop={[4, 0]}
            marginBottom={[null, 2]}
            data-at={Sephora.debug.dataAt('ql_price_list')}
            minHeight={[null, forms.HEIGHT]}
        >
            {currentSku.salePrice ? (
                <span css={{ textDecoration: 'line-through' }}>{currentSku.listPrice}</span>
            ) : (
                <strong children={currentSku.listPrice} />
            )}
            {currentSku.salePrice && (
                <>
                    {' '}
                    <Text
                        is='strong'
                        color='red'
                        children={currentSku.salePrice}
                    />
                </>
            )}
            {currentSku.valuePrice && (
                <Text
                    is='p'
                    marginTop={1}
                    fontSize='base'
                    children={currentSku.valuePrice}
                />
            )}
            {skuUtils.isAppExclusive(currentSku) && (
                <Text
                    is='p'
                    marginTop={1}
                    fontSize='base'
                    data-at={Sephora.debug.dataAt('ql_app_exclusive_label')}
                    children={getText('appExclusive')}
                />
            )}
        </Box>
    );
}

class ProductQuickLookModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            skuQuantity: 1,
            productLovesCount: 0,
            isSmallView: null,
            categoryProducts: this.props.categoryProducts,
            currentQuickLookProduct: null,
            showLoader: false
        };
    }

    requestCloseOnAddToBasket = event => {
        if (event.detail.isQuickLook) {
            this.props.requestClose && this.props.requestClose();
        }
    };

    handleSkuQuantity = value => {
        this.setState({ skuQuantity: value });
    };

    getProductError = error => {
        return PRODUCT_ERROR_MESSAGES[error.errorCode] || PRODUCT_ERROR_MESSAGES.UNKNOWN;
    };

    fireLinkTracking = () => {
        const { platform } = this.props;
        const { pageName } = anaUtils.getLastAsyncPageLoadData({
            pageType: anaConsts.PAGE_TYPES.QUICK_LOOK
        });
        let analyticsData = { pageName };

        if (platform) {
            analyticsData = {
                ...analyticsData,
                linkData: `cmnty:${platform}:product-tag-click-to-ppage`,
                events: [anaConsts.Event.EVENT_162]
            };
        } else if (this.props.isCommunityGallery) {
            analyticsData = {
                internalCampaign: `gallery:${this.props.product?.productId || this.props.product?.productDetails?.productId}:product`,
                eVar129: this.props.communityGalleryAnalytics,
                pageName: digitalData.page.attributes.sephoraPageInfo.pageName
            };
        }

        anaUtils.setNextPageData(analyticsData);
    };

    openProductPage = event => {
        const { currentSku, requestClose, isCommunityGallery, toggleGalleryLightBox } = this.props;
        this.fireLinkTracking();
        Location.navigateTo(event, currentSku.targetUrl);
        requestClose();
        store.dispatch(Actions.showSimilarProductsModal({ isOpen: false }));
        isCommunityGallery && toggleGalleryLightBox({ display: false });
    };

    getProductName = () => {
        const { currentSku, product } = this.props;

        const productUrl = skuUtils.productUrl(product, currentSku);
        const productDetails = product.productDetails || product;

        return (
            <Link
                display='block'
                hoverSelector='.Link-target'
                href={productUrl}
                onClick={event => this.openProductPage(event)}
                fontSize='md'
                lineHeight='tight'
                marginBottom={1}
            >
                {productDetails.brand && (
                    <>
                        <Text
                            fontWeight='bold'
                            fontSize='base'
                            data-at={Sephora.debug.dataAt('ql_brand')}
                        >
                            {productDetails.brand.displayName}
                        </Text>
                        <br />
                    </>
                )}
                <span
                    className='Link-target'
                    data-at={Sephora.debug.dataAt('ql_name')}
                >
                    {productDetails.displayName}
                </span>
            </Link>
        );
    };

    getProductDescription = showLink => {
        const { product, currentSku } = this.props;

        return (
            <Text
                is='p'
                marginTop={[4, 3]}
                marginBottom={[4, 3]}
                fontSize={['sm', 'base']}
                lineHeight={['tight', 'base']}
            >
                <span
                    data-at={Sephora.debug.dataAt('ql_product_details')}
                    dangerouslySetInnerHTML={{ __html: product.quickLookDescription }}
                />
                {showLink && !this.props.isCommunityGallery && (
                    <Text
                        display='block'
                        textAlign='right'
                    >
                        <Link
                            href={skuUtils.productUrl(product, currentSku)}
                            onClick={event => this.openProductPage(event)}
                            color='blue'
                            underline={true}
                            data-ql-product-details
                            ana-before-unload
                            ana-evt='QL-links'
                        >
                            {getText('seeProductDetails')}
                        </Link>
                    </Text>
                )}
            </Text>
        );
    };

    getProductLove = () => {
        const { currentSku, product } = this.props;
        const imageProps = {
            id: currentSku.skuId,
            skuImages: currentSku.skuImages,
            disableLazyLoad: true,
            altText: supplementAltTextWithProduct(currentSku, product)
        };

        return (
            <div style={!skuUtils.isLoveEligible(currentSku) ? { visibility: 'hidden' } : null}>
                <ProductLove
                    sku={currentSku}
                    isQuickLook={true}
                    // ILLUPH-95525 TODO: change source to qlLove
                    // when its implemented on API side
                    loveSource='productPage'
                    analyticsContext={anaConsts.CONTEXT.QUICK_LOOK}
                    productId={product?.productId || product?.productDetails?.productId}
                    imageProps={imageProps}
                >
                    <ProductLoveQL currentSku={currentSku} />
                </ProductLove>
            </div>
        );
    };

    getRatingsAndLoveCount = () => {
        const { product, currentSku } = this.props;
        const { productDetails, regularChildSkus } = product;
        const productUrl = skuUtils.productUrl(product, currentSku);

        let reviewCount = productDetails.reviews === undefined ? 0 : productDetails.reviews;
        reviewCount = formatReviewCount(reviewCount);

        return !skuUtils.isSubscription(currentSku) ? (
            <Flex
                marginTop={[2, 0]}
                alignItems='center'
                flexWrap='wrap'
                fontWeight='bold'
                fontSize='sm'
                lineHeight='none'
            >
                {product.isHideSocial || (
                    <>
                        <Link
                            href={productUrl + '#ratings-reviews-container'}
                            display='flex'
                            css={{ alignItems: 'center' }}
                        >
                            <StarRating rating={productDetails.rating} />
                            <span
                                css={{ marginLeft: '.5em' }}
                                data-at={Sephora.debug.dataAt('ql_rating_label')}
                            >
                                {(() => {
                                    switch (productDetails.reviews) {
                                        case undefined:
                                        case 0:
                                            return getText('notRated');
                                        case 1:
                                            return getText('oneReview');
                                        default:
                                            return reviewCount + getText('reviews');
                                    }
                                })()}
                            </span>
                        </Link>
                        {skuUtils.isGiftCard(currentSku) || (
                            <Box
                                {...(localeUtils.isFRCanada()
                                    ? {
                                        marginTop: 2,
                                        flexBasis: '100%'
                                    }
                                    : {
                                        height: '1.125em',
                                        marginX: '.75em',
                                        borderLeft: 1,
                                        borderColor: 'midGray'
                                    })}
                            />
                        )}
                    </>
                )}
                {skuUtils.isGiftCard(currentSku) || (
                    <ProductLovesCount
                        product={{
                            lovesCount: productDetails.lovesCount,
                            regularChildSkus,
                            skuId: currentSku.skuId
                        }}
                        data-at={Sephora.debug.dataAt('ql_love_count')}
                    />
                )}
            </Flex>
        ) : null;
    };

    getProductImage = () => {
        const { currentSku, product } = this.props;

        const productUrl = skuUtils.productUrl(product, currentSku);

        return (
            <Box
                href={productUrl}
                onClick={this.openProductPage}
                position='relative'
                maxWidth={[224, '100%']}
                marginX='auto'
                marginY={[4, 0]}
            >
                <ProductImage
                    disableLazyLoad={true}
                    id={currentSku.skuId}
                    size={[224, 300]}
                    skuImages={currentSku.skuImages}
                    data-at={Sephora.debug.dataAt('ql_image')}
                    altText={supplementAltTextWithProduct(currentSku, product)}
                />
                <ProductBadges sku={currentSku} />
            </Box>
        );
    };

    getSwatches = () => {
        const { product, currentSku, updateCurrentSku, matchSku } = this.props;

        const isSalePage = LocationUtils.isSalePage();

        return product.skuSelectorType !== skuUtils.skuSwatchType.NONE &&
            (product.regularChildSkus !== undefined || product.onSaleChildSkus !== undefined) ? (
                <ProductSwatchGroup
                    showOnSaleOnly={isSalePage && product.onSaleChildSkus && product.onSaleChildSkus.length}
                    product={product}
                    currentSku={currentSku}
                    updateCurrentSku={updateCurrentSku}
                    matchSku={matchSku ? currentSku : null}
                    analyticsContext={anaConsts.CONTEXT.QUICK_LOOK}
                />
            ) : null;
    };

    getSmallView = () => {
        const { product, currentSku } = this.props;

        return (
            <>
                {this.getProductName()}
                {this.getRatingsAndLoveCount()}
                {getProductPrice(currentSku)}
                {this.getProductImage()}
                <Grid
                    marginBottom={4}
                    alignItems='center'
                    columns='1fr auto'
                >
                    <div>
                        <ProductVariation
                            fontSize='sm'
                            {...skuUtils.getProductVariations({
                                product,
                                sku: currentSku
                            })}
                        />
                        <SizeAndItemNumber
                            fontSize='xs'
                            color='inherit'
                            sku={currentSku}
                            data-at={Sephora.debug.dataAt('ql_sku_size_and_number')}
                        />
                    </div>
                    {this.getProductLove()}
                </Grid>
                {this.getSwatches()}
                {this.getProductDescription()}
                {this.props.isCommunityGallery && (
                    <Divider
                        marginY={4}
                        height={2}
                    />
                )}
                <CallToActions
                    currentSku={currentSku}
                    currentProduct={product}
                    platform={this.props.platform}
                    isCommunityGallery={this.props.isCommunityGallery}
                    openProductPage={this.openProductPage}
                    onSuccess={this.props.requestClose}
                    {...product}
                />
            </>
        );
    };

    getCurrentProductIndex = () => {
        const { product, categoryProducts } = this.props;

        const { currentQuickLookProduct } = this.state;
        const productIdToCompare = currentQuickLookProduct ? currentQuickLookProduct?.productId : product?.productDetails.productId;
        const productIndex = categoryProducts?.findIndex(categoryProduct => categoryProduct?.productId === productIdToCompare);

        return productIndex;
    };

    dispatchQuicklook = nextProduct => {
        const { categoryProducts, updateCurrentSku } = this.props;

        quickLookModalUtils.dispatchQuicklook({
            productId: nextProduct.productId,
            skuType: skuUtils.skuTypes.STANDARD,
            sku: nextProduct.currentSku,
            options: { addCurrentSkuToProductChildSkus: true },
            categoryProducts,
            updateCurrentSku,
            isArrowEvent: true,
            displayLoadingModal: this.displayLoadingModal
        });
    };

    onPreviousProduct = e => {
        e.preventDefault();
        e.stopPropagation();

        const { categoryProducts } = this.props;

        let nextProduct;

        const productIndex = this.getCurrentProductIndex();

        // a match was found
        if (productIndex !== -1) {
            const nextIndex = productIndex - 1;
            nextProduct = categoryProducts[nextIndex];
            this.displayLoadingModal();
            this.dispatchQuicklook(nextProduct);

            this.setState({ currentQuickLookProduct: nextProduct });
        }
    };

    onNextProduct = e => {
        e.preventDefault();
        e.stopPropagation();

        const { categoryProducts } = this.props;

        let nextProduct;

        const productIndex = this.getCurrentProductIndex();

        // a match was found
        if (productIndex !== -1) {
            const nextIndex = productIndex + 1;
            nextProduct = categoryProducts[nextIndex];
            this.displayLoadingModal();
            this.dispatchQuicklook(nextProduct);

            this.setState({ currentQuickLookProduct: nextProduct });
        }
    };

    getLargeView = () => {
        const { requestClose, rootContainerName, product, currentSku } = this.props;

        const showButtons = !skuUtils.isSubscription(currentSku);

        return (
            <>
                <Grid
                    gap={[4, 5]}
                    columns={[null, 'minmax(30%, 300px) minmax(60%, 1fr)']}
                >
                    {this.getProductImage()}
                    <div>
                        {this.getProductName()}
                        <SizeAndItemNumber
                            fontSize='sm'
                            sku={currentSku}
                            data-at={Sephora.debug.dataAt('ql_sku_size_and_number')}
                            marginTop={1}
                        />
                        {this.getProductDescription(true)}
                        <ProductVariation
                            hasMinHeight={true}
                            {...skuUtils.getProductVariations({
                                product,
                                sku: currentSku
                            })}
                        />
                        {this.getSwatches()}
                    </div>
                    <Flex
                        flexDirection='column'
                        alignItems='center'
                        textAlign='center'
                    >
                        {this.getRatingsAndLoveCount()}
                        <MarketingFlags
                            marginTop={3}
                            sku={currentSku}
                        />
                    </Flex>
                    <Grid columns={this.props.isCommunityGallery ? undefined : '1fr auto'}>
                        <div>
                            {getProductPrice(currentSku)}
                            <ProductQuickLookMessage
                                currentSku={this.state.currentSku || currentSku}
                                product={product}
                            />
                        </div>
                        {showButtons && (
                            <Grid
                                columns={currentSku.isExternallySellable ? undefined : 'auto 166px'}
                                gap={2}
                            >
                                {currentSku.isExternallySellable || this.props.isCommunityGallery ? null : (
                                    <SkuQuantity
                                        currentSku={currentSku}
                                        skuQuantity={this.state.skuQuantity}
                                        handleSkuQuantity={this.handleSkuQuantity}
                                        source='ql_qty'
                                        disabled={
                                            skuHelpers.isProductDisabled(currentSku) ||
                                            skuUtils.isGiftCard(currentSku) ||
                                            skuUtils.isAppExclusive(currentSku)
                                        }
                                    />
                                )}
                                <Grid
                                    gap={2}
                                    columns={this.props.isCommunityGallery ? '1fr 1fr' : undefined}
                                >
                                    {currentSku.isExternallySellable ? (
                                        <SeeProductDetails
                                            url={currentSku.targetUrl}
                                            variant={'primary'}
                                            size={'md'}
                                        />
                                    ) : (
                                        <AddToBasketButton
                                            block={true}
                                            isQuickLook={true}
                                            data-at={Sephora.debug.dataAt('ql_add_to_basket')}
                                            platform={this.props.platform}
                                            origin={this.props.origin}
                                            sku={Object.assign({}, currentSku, { type: SKU_TYPES.STANDARD })}
                                            onSuccess={requestClose}
                                            product={product}
                                            productId={product.productId}
                                            variant={ADD_BUTTON_TYPE.SPECIAL}
                                            quantity={this.state.skuQuantity}
                                            analyticsContext={anaConsts.CONTEXT.QUICK_LOOK}
                                            rootContainerName={rootContainerName}
                                            isCommunityGallery={this.props.isCommunityGallery}
                                        />
                                    )}
                                    {this.props.isCommunityGallery ? null : this.getProductLove()}
                                    {this.props.isCommunityGallery && (
                                        <Button
                                            variant='secondary'
                                            onClick={e => this.openProductPage(e)}
                                            children={this.props?.localization?.seeFullDetails}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </>
        );
    };

    isXS = () => uiUtils.getBreakpoint() === 'xs';

    useCircleArrows = () => window.innerWidth > modal.width[MODAL_WIDTH] + CAROUSEL_ARROW_OFFSET * 2;

    handleResize = () => {
        const { isSmallView, useCircleArrows } = this.state;

        const isXS = this.isXS();

        if (!isXS && isSmallView) {
            this.setState({
                isSmallView: false
            });
        } else if (isXS && !isSmallView) {
            this.setState({
                isSmallView: true
            });
        }

        const circleArrows = this.useCircleArrows();

        if (!circleArrows && useCircleArrows) {
            this.setState({
                useCircleArrows: false
            });
        } else if (circleArrows && !useCircleArrows) {
            this.setState({
                useCircleArrows: true
            });
        }
    };

    displayLoadingModal = (error = false) => {
        this.setState(
            prevState => ({
                showLoader: !prevState.showLoader
            }),
            () => {
                if (error) {
                    store.dispatch(Actions.showQuickLookModal({ isOpen: false }));
                }
            }
        );
    };

    componentDidMount() {
        this.setState({
            isSmallView: this.isXS(),
            useCircleArrows: this.useCircleArrows()
        });

        const currentSkuWatch = watch(store.getState, 'product');

        store.subscribe(
            currentSkuWatch(newVal => {
                if (newVal.currentSku !== null) {
                    this.setState({
                        currentSku: newVal.currentSku,
                        product: Object.assign({}, this.state.product, {
                            currentSku: newVal.currentSku
                        })
                    });
                }
            }),
            this
        );

        this.onClose = this.requestCloseOnAddToBasket.bind(this);

        window.addEventListener(DebouncedResize, this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    render() {
        const { isOpen, requestClose, error, categoryProducts } = this.props;

        const { isSmallView, useCircleArrows } = this.state;

        const productIndex = this.getCurrentProductIndex();
        const displayPrevArrow = !isSmallView && productIndex > 0;
        const displayNextArrow = !isSmallView && productIndex !== categoryProducts?.length - 1;

        const arrowProps = useCircleArrows
            ? {
                variant: 'circle',
                outdent: CAROUSEL_ARROW_OFFSET
            }
            : {
                variant: 'simple',
                width: modal.paddingX[1]
            };

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={requestClose}
                isDrawer={true}
                dataAt='quick_look_modal'
                closeDataAt='ql_close'
                width={MODAL_WIDTH}
            >
                <Modal.Body padForX={isSmallView}>
                    {error ? (
                        <Flex
                            flexDirection='column'
                            textAlign='center'
                            justifyContent='center'
                            height={[null, 412]}
                            fontSize={[null, 'md']}
                            color='error'
                        >
                            {this.getProductError(error)}
                        </Flex>
                    ) : !this.state.showLoader ? (
                        isSmallView ? (
                            this.getSmallView()
                        ) : (
                            this.getLargeView()
                        )
                    ) : (
                        <Loader
                            isShown={true}
                            isInline={true}
                            style={{ height: '420px' }}
                        />
                    )}
                </Modal.Body>
                {displayPrevArrow && (
                    <CarouselArrow
                        aria-label={getText('prevProduct')}
                        onClick={this.onPreviousProduct}
                        direction='prev'
                        {...arrowProps}
                    />
                )}

                {displayNextArrow && (
                    <CarouselArrow
                        aria-label={getText('nextProduct')}
                        onClick={this.onNextProduct}
                        direction='next'
                        {...arrowProps}
                    />
                )}
            </Modal>
        );
    }
}

export default wrapComponent(ProductQuickLookModal, 'ProductQuickLookModal', true);
