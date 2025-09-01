import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Text, Link, Flex
} from 'components/ui';
import {
    colors, fontSizes, fontWeights, lineHeights, radii, space, mediaQueries
} from 'style/config';
import ProductImage from 'components/Product/ProductImage';
import StarRating from 'components/StarRating/StarRating';
import Flag from 'components/Flag';
import ProductLove from 'components/Product/ProductLove';
import ProductLoveToggle from 'components/Product/ProductLove/ProductLoveToggle';
import ReviewCount from 'components/Product/ReviewCount';
import UpperFunnelProductTiles from 'components/Catalog/UpperFunnel/UpperFunnelProductTiles';
import { CTA } from 'constants/constructorConstants';
import localeUtils from 'utils/LanguageLocale';
import marketingFlagsUtil from 'utils/MarketingFlags';
import quicklookModalUtils from 'utils/Quicklook';
import skuUtils from 'utils/Sku';
import { getProductTileSize } from 'style/imageSizes';
import urlUtils from 'utils/Url';
import anaUtils from 'analytics/utils';
import analiticsConstant from 'analytics/constants';
import uiUtils from 'utils/UI';
import Location from 'utils/Location';
import imageUtils from 'utils/Image';
import anaConsts from 'analytics/constants';
import Empty from 'constants/empty';
import replaceSpecialCharacters from 'utils/replaceSpecialCharacters';
import processEvent from 'analytics/processEvent';
import { checkHomeReferer } from 'analytics/utils/cmsReferer';
import mediaUtils from 'utils/Media';
import AddToBasketButton from 'components/AddToBasketButton';
import basketUtils from 'utils/Basket';
import isFunction from 'utils/functions/isFunction';

const getText = localeUtils.getLocaleResourceFile('components/Catalog/ProductGrid/ProductTile/locales', 'ProductTile');

const ADD_BUTTON_TYPE = basketUtils.ADD_TO_BASKET_TYPES;

const {
    COMPONENT_TITLE: { PRODUCTS_GRID, SKUGRID }
} = analiticsConstant;
const { getLink } = urlUtils;
const { SKELETON_ANIMATION } = uiUtils;
const { isMobileView } = mediaUtils;

class ProductTile extends BaseClass {
    constructor(props) {
        super(props);

        if (props.showPurchasedFlagOnGridPages?.challengerOne || props.showPurchasedFlagOnGridPages?.challengerTwo) {
            this.purchaseLookup = props.completePurchaseHistory ? ProductTile.createLookup(props.completePurchaseHistory) : Empty.Object;
        } else {
            this.purchaseLookup = Empty.Object;
        }
    }

    state = {
        hover: false,
        increaseImageSizeGrid: true
    };

    componentDidUpdate(prevProps) {
        const { increaseImageSizeGrid, showPurchasedFlagOnGridPages } = this.props;

        if (prevProps.increaseImageSizeGrid !== increaseImageSizeGrid) {
            this.setState({ increaseImageSizeGrid });
        }

        if (showPurchasedFlagOnGridPages?.challengerOne || showPurchasedFlagOnGridPages?.challengerTwo) {
            if (prevProps.completePurchaseHistory !== this.props.completePurchaseHistory) {
                this.purchaseLookup = ProductTile.createLookup(this.props.completePurchaseHistory);
            }
        }

        const currTargetUrl = this.props.product?.targetUrl;

        if (typeof window !== 'undefined' && currTargetUrl) {
            // Only want this called client side
            const targetUrl = getLink(currTargetUrl, [`${this.props.rootContainerName || PRODUCTS_GRID}:${this.props.product?.productId}:product`]);

            checkHomeReferer(targetUrl);
        }
    }

    static createLookup(completePurchaseHistory) {
        return (completePurchaseHistory || Empty.Array).reduce((lookup, item) => {
            lookup[item.productId] = item.transactionDate;

            return lookup;
        }, {});
    }

    // Helper function to render the "Add to Basket" button
    renderAddToBasketButton = ({
        product, addToBasket, customStyle, paddingTop, updateAttributionData
    }) => {
        return (
            <div css={styles.addToBasketCtaContainer(paddingTop)}>
                <AddToBasketButton
                    size='sm'
                    sku={product?.currentSku}
                    product={product}
                    productId={product?.productId}
                    variant={ADD_BUTTON_TYPE.SECONDARY}
                    isAddButton={true}
                    text={addToBasket}
                    data-test='addToBasketButtonSam'
                    customStyle={customStyle}
                    updateAttributionData={updateAttributionData}
                />
            </div>
        );
    };

    renderStarRatingVariant(product) {
        const { showStarRatingOnCatalog } = this.props;
        const rating = product?.rating || product?.starRatings;
        const reviewCount = product?.productReviewCount || product?.reviewsCount || product?.reviews || 0;

        const roundedRating = Math.round(rating * 2) / 2;

        const showReviewsText = showStarRatingOnCatalog.challengerThree || showStarRatingOnCatalog.challengerFour;
        const numberOnLeft = showStarRatingOnCatalog.challengerOne || showStarRatingOnCatalog.challengerThree;
        const addMarginLeft = showStarRatingOnCatalog.challengerTwo || showStarRatingOnCatalog.challengerFour;

        const showParentheses = Object.values(showStarRatingOnCatalog).some(Boolean);
        const ratingsReviewsContainerAnchor = 'ratings-reviews-container';

        return (
            <Link
                css={styles.ratingWrap}
                onClick={this.handleClick}
                data-anchor={ratingsReviewsContainerAnchor}
            >
                {numberOnLeft && roundedRating > 0 && (
                    <Box
                        is='span'
                        css={styles.ratingNumber}
                    >
                        {roundedRating}
                    </Box>
                )}
                <StarRating
                    size='1em'
                    rating={rating}
                    isYellow
                    addMarginLeft
                />
                {!numberOnLeft && roundedRating > 0 && (
                    <Box
                        is='span'
                        css={styles.ratingNumber}
                        {...(addMarginLeft && { marginLeft: '0.25em' })}
                    >
                        {roundedRating}
                    </Box>
                )}
                <ReviewCount
                    css={styles.reviewCount}
                    productReviewCount={reviewCount}
                    {...(showReviewsText && { showReviewsText: true })}
                    {...(showParentheses && { showParentheses: true })}
                />
            </Link>
        );
    }

    getImageSize() {
        return getProductTileSize(this.state.increaseImageSizeGrid);
    }

    componentDidMount() {
        const { product, source, increaseImageSizeGrid } = this.props;

        // Set initial state from prop
        this.setState({ increaseImageSizeGrid });

        if (product?.sponsored && !product?.viewableImpressionFired) {
            const { fireProductViewableImpressionTracking, flagViewableImpression } = this.props;

            fireProductViewableImpressionTracking({ product, source });

            if (flagViewableImpression) {
                flagViewableImpression(product);
            }
        }
    }

    handleClick = event => {
        const anchor = event?.currentTarget?.dataset?.anchor;
        const isAnchorClick = Boolean(anchor);

        const isCreatorStoreFrontPage = Location.isCreatorStoreFrontPage();

        isCreatorStoreFrontPage && event?.preventDefault();

        if (isAnchorClick) {
            event.stopPropagation();
        }

        anaUtils.setNextPageData({
            recInfo: { componentTitle: SKUGRID }
        });

        const {
            product, source, fireSponsoredProductClickTracking, index, rootContainerName, trackCSFProductClick, updateAttributionData
        } =
            this.props;

        fireSponsoredProductClickTracking && fireSponsoredProductClickTracking({ product, source, event, index });

        if (isCreatorStoreFrontPage && product?.motomProductId) {
            isFunction(trackCSFProductClick) && trackCSFProductClick();
            isFunction(updateAttributionData) && updateAttributionData();
        }

        // Note: This code was not moved to the Actions (actions/ProductActions.js) due to an issue that occurs when searching or clicking
        // The require of 'HistoryService' seems to be the issue. Pending to review this issue and move the code to actions.
        const baseUrl = this.mountTargetURL(product, rootContainerName);
        const targetUrl = anchor ? `${baseUrl}#${anchor}` : baseUrl;

        if (isCreatorStoreFrontPage) {
            // CSF needs an additinal wait time to fire SOT events before redirecting to targetUrl
            setTimeout(() => Location.navigateTo(event, targetUrl), 2000);
        } else {
            Location.navigateTo(event, targetUrl);
        }
    };

    mountTargetURL = (product, rootContainerName) => {
        const targetUrl = product?.targetUrl
            ? getLink(product?.targetUrl, [`${rootContainerName ? rootContainerName : PRODUCTS_GRID}:${product?.productId}:product`])
            : null;

        return targetUrl;
    };

    handleViewSimilarProductsClick = e => {
        e.preventDefault();

        const {
            showSimilarProductsModal,
            product: {
                productId, productName, skuImages, skuId, brandName, analyticsContext
            },
            rootContainerName
        } = this.props;

        const world = digitalData.page.attributes.world || 'n/a';
        const { VIEW_SIMILAR } = anaConsts.PAGE_TYPES;
        const pageName = replaceSpecialCharacters(`${VIEW_SIMILAR}:${productId}:${world}:*pname=${productName}`);
        const pageDetail = digitalData.page.pageInfo.pageName;

        showSimilarProductsModal({
            isOpen: true,
            brandName: brandName,
            productName: productName,
            productImages: skuImages,
            itemId: productId,
            analyticsContext: analyticsContext,
            badgeAltText: this.props.badgeAltText,
            skuId: skuId
        });

        const recentEvent = anaUtils.getLastAsyncPageLoadData({
            pageType: analyticsContext
        });

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: pageName,
                pageType: VIEW_SIMILAR,
                previousPageName: recentEvent.pageName,
                internalCampaign: `${rootContainerName}:${productId}:view similar products`,
                pageDetail
            }
        });
    };

    hoverOn = () => {
        this.setState({ hover: true });
    };

    hoverOff = () => {
        this.setState({ hover: false });
    };

    handleQuicklookClick = e => {
        const { product, products } = this.props;

        const sku = product?.currentSku || product;
        const clickTrackerId = product?.click_id || '';
        const impressionTrackerId = product?.impression_id || '';
        const impressionPayload = product?.impression_payload || '';
        const clickPayload = product?.click_payload || '';

        e.preventDefault();
        e.stopPropagation();

        const quickLookConfig = {
            productId: product?.productId,
            skuType: skuUtils.skuTypes.STANDARD,
            options: { addCurrentSkuToProductChildSkus: true },
            sku: sku,
            rootContainerName: PRODUCTS_GRID,
            productStringContainerName: SKUGRID,
            categoryProducts: products,
            clickTrackerId,
            impressionTrackerId,
            impressionPayload,
            clickPayload
        };

        // Dispatch the quicklook modal with the provided config
        quicklookModalUtils.dispatchQuicklook(quickLookConfig);
    };

    /* eslint-disable-next-line complexity */
    render() {
        const {
            product,
            deliveryOptions,
            checkedRefinements,
            isLazyLoaded,
            isSkeleton,
            rootContainerName,
            similarProducts,
            parentCategoryName,
            categoryName,
            showPurchasedFlagOnGridPages,
            showVariationValue,
            customMarginTop,
            customStyle,
            addToBasket,
            showStarRatingOnCatalog,
            isDeliveryFilterApplied,
            updateAttributionData
        } = this.props;
        const { hover } = this.state;
        const isTouch = Sephora.isTouch;
        const sku = product?.currentSku || product;
        const marketingFlags = marketingFlagsUtil.getProductTileFlags(sku);
        const targetUrl = this.mountTargetURL(product, rootContainerName);
        const transactionDate = this.purchaseLookup[product?.productId];

        const RootComp = targetUrl ? 'a' : 'div';

        const sponsored = product?.sponsored || false;
        const isPartialSaleData = product?.onSaleData === 'PARTIAL';
        const valuePriceDisplay = sku?.valuePrice?.toLowerCase()?.includes('value')
            ? sku?.valuePrice
            : sku?.valuePrice && `(${sku?.valuePrice} ${getText('value')})`;

        if (sku && !sku.badge && product?.heroImage) {
            sku.badge = imageUtils.getImageBadgeFromUrl(product.heroImage);
        }

        const imageProps = sku
            ? {
                id: sku.skuId,
                badge: sku.badge,
                skuImages: product?.heroImage || product?.hero_images ? { image: product?.heroImage || product?.hero_images } : sku.skuImages,
                altText: sku.imageAltText + (sku.badgeAltText ? ` ${sku.badgeAltText}` : ''),
                size: this.getImageSize(),
                isPageRenderImg: !isLazyLoaded,
                disableLazyLoad: true,
                increaseImageSizeGrid: this.state.increaseImageSizeGrid
            }
            : {
                size: this.getImageSize()
            };

        if (sku?.gridImageURL) {
            imageProps.src = sku.gridImageURL;
        }

        return (
            <Flex
                flexDirection={'column'}
                onMouseEnter={!isTouch ? this.hoverOn : null}
                onFocus={!isTouch ? this.hoverOn : null}
                onMouseLeave={!isTouch ? this.hoverOff : null}
                onBlur={!isTouch ? this.hoverOff : null}
                css={styles.flexContainer}
            >
                <RootComp
                    css={styles.root({ increaseImageSizeGrid: this.state.increaseImageSizeGrid })}
                    style={isSkeleton ? { pointerEvents: 'none' } : null}
                    {...(targetUrl && {
                        href: targetUrl,
                        onClick: this.handleClick
                    })}
                    {...(sku?.strategyId && {
                        'data-cnstrc-item-id': sku.productId,
                        'data-cnstrc-item-name': sku.productName,
                        'data-cnstrc-item-variation-id': sku.variationId,
                        'data-cnstrc-strategy-id': sku?.strategyId,
                        'data-cnstrc-item-price': sku.salePrice || sku.listPrice
                    })}
                >
                    <Box
                        position='relative'
                        marginX='auto'
                        width={this.state.increaseImageSizeGrid && isMobileView() ? '100%' : this.getImageSize()}
                        maxWidth='100%'
                        css={styles.imageWrap}
                    >
                        {isSkeleton ? (
                            <div css={[styles.skeleton.image, SKELETON_ANIMATION]} />
                        ) : (
                            <>
                                <ProductImage {...imageProps} />
                                <button
                                    type='button'
                                    className='ProductTile-ql'
                                    css={styles.quickLook}
                                    onClick={this.handleQuicklookClick}
                                    children={getText('quickLook')}
                                />
                            </>
                        )}
                    </Box>

                    <div className='ProductTile-content'>
                        <Text
                            display='block'
                            fontSize={'sm'}
                            marginTop={customMarginTop || 4}
                            marginBottom='.125em'
                            fontWeight='bold'
                            numberOfLines={1}
                            css={isSkeleton ? [styles.skeleton.text, SKELETON_ANIMATION] : styles.brandName}
                            dangerouslySetInnerHTML={{
                                __html: isSkeleton ? '&nbsp;' : product?.brandName
                            }}
                        />
                        <Text
                            display='block'
                            fontSize={['sm', 'base']}
                            numberOfLines={4}
                            css={isSkeleton ? [styles.skeleton.text, SKELETON_ANIMATION] : styles.displayName}
                            dangerouslySetInnerHTML={{
                                __html: isSkeleton ? '&nbsp;' : product?.displayName || product?.productName
                            }}
                        />

                        {showVariationValue && sku?.variationValue ? (
                            <Text
                                display='block'
                                marginTop={customMarginTop || '.5em'}
                                fontSize={['xs', 'sm']}
                                color='gray'
                                css={styles.variationText}
                                children={sku?.variationValue}
                            />
                        ) : (
                            product?.moreColors > 1 && (
                                <Text
                                    display='block'
                                    marginTop={customMarginTop || '.5em'}
                                    fontSize={['xs', 'sm']}
                                    color='gray'
                                    children={`${product?.moreColors} ${getText('colors')}`}
                                />
                            )
                        )}

                        {isSkeleton || product?.rating || product?.starRatings >= 0 ? (
                            <div css={[styles.ratingWrap, customMarginTop && { marginTop: space[customMarginTop] }]}>
                                {isSkeleton ? (
                                    <div css={[styles.skeleton.rating, SKELETON_ANIMATION]} />
                                ) : Object.values(showStarRatingOnCatalog).some(Boolean) ? (
                                    this.renderStarRatingVariant(product)
                                ) : (
                                    <>
                                        <StarRating
                                            size='1em'
                                            rating={product?.rating || product?.starRatings}
                                        />
                                        <ReviewCount
                                            css={styles.reviewCount}
                                            productReviewCount={product?.productReviewCount || product?.reviews || product?.reviewsCount}
                                        />
                                    </>
                                )}
                            </div>
                        ) : null}

                        {(isSkeleton || sku.listPrice) && (
                            <b css={styles.price}>
                                {isSkeleton ? (
                                    <span css={[styles.skeleton.price, SKELETON_ANIMATION]}>&nbsp;</span>
                                ) : isPartialSaleData ? (
                                    <>
                                        {sku.valuePrice && (
                                            <>
                                                {' '}
                                                <span
                                                    css={styles.priceValue}
                                                    children={valuePriceDisplay}
                                                />
                                            </>
                                        )}
                                        <span
                                            css={styles.partialListPrice}
                                            children={sku.listPrice}
                                        />
                                        <span
                                            css={styles.partialListPriceText}
                                            children={getText('regPrice')}
                                        />
                                        {sku.salePrice && (
                                            <>
                                                <p
                                                    css={styles.priceSale}
                                                    children={sku.salePrice}
                                                />{' '}
                                            </>
                                        )}
                                        <p
                                            css={[styles.partialListPriceText, styles.priceSale]}
                                            children={getText('selectSaleItems')}
                                        />
                                    </>
                                ) : (
                                    <>
                                        {sku.salePrice && (
                                            <>
                                                <span
                                                    css={styles.priceSale}
                                                    children={sku.salePrice}
                                                />{' '}
                                            </>
                                        )}
                                        <span
                                            css={sku.salePrice && styles.priceList}
                                            children={sku.listPrice}
                                        />
                                        {sku.valuePrice && (
                                            <>
                                                {' '}
                                                <span
                                                    css={styles.priceValue}
                                                    children={valuePriceDisplay}
                                                />
                                            </>
                                        )}
                                    </>
                                )}
                            </b>
                        )}

                        {!sponsored && deliveryOptions && (
                            <UpperFunnelProductTiles
                                isDeliveryFilterApplied={isDeliveryFilterApplied}
                                checkedRefinements={checkedRefinements}
                                pickupEligible={product?.pickupEligible}
                                sameDayEligible={product?.sameDayEligible}
                                shipToHomeEligible={product?.shipToHomeEligible}
                                deliveryOptions={deliveryOptions}
                            />
                        )}

                        {sponsored && (
                            <Text
                                children={getText('sponsored')}
                                marginTop='1'
                                fontSize='xs'
                                color='gray'
                            />
                        )}

                        {isSkeleton || (
                            <>
                                {showPurchasedFlagOnGridPages?.challengerOne || showPurchasedFlagOnGridPages?.challengerTwo ? (
                                    <div css={styles.flagsContainer}>
                                        {transactionDate && (
                                            <div css={styles.purchaseFlag}>
                                                <Flag
                                                    backgroundColor='lightBlue'
                                                    color='black'
                                                    key={product.productId}
                                                    children={
                                                        showPurchasedFlagOnGridPages?.challengerOne
                                                            ? `${getText('purchased')} ${transactionDate}`
                                                            : getText('buyItAgain')
                                                    }
                                                />
                                            </div>
                                        )}
                                        <div css={styles.marketingFlags}>
                                            {marketingFlags.map((flag, key) => (
                                                <Flag
                                                    key={key}
                                                    children={flag}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div css={styles.flags}>
                                        {marketingFlags.map((flag, key) => (
                                            <Flag
                                                key={key}
                                                children={flag}
                                            />
                                        ))}
                                    </div>
                                )}

                                <div
                                    css={[
                                        styles.love,
                                        customMarginTop && {
                                            [mediaQueries.xsMax]: {
                                                right: 0
                                            }
                                        }
                                    ]}
                                >
                                    <ProductLove
                                        sku={sku}
                                        loveSource='productPage'
                                        productId={product?.productId}
                                        currentProduct={product}
                                        parentCategoryName={parentCategoryName}
                                        categoryName={categoryName}
                                        imageProps={imageProps}
                                    >
                                        <ProductLoveToggle
                                            isCircle={true}
                                            size={20}
                                            width={36}
                                            height={36}
                                            {...(sku?.strategyId && {
                                                'data-cnstrc-btn': CTA.MOVE_TO_LOVES
                                            })}
                                            productId={product?.productId}
                                        />
                                    </ProductLove>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Display add to basket cta if prop is true (CSF Project) */}
                    {this.props.displayAddToBasketCta &&
                        this.renderAddToBasketButton({
                            product,
                            addToBasket,
                            customStyle,
                            paddingTop: customMarginTop,
                            updateAttributionData
                        })}
                </RootComp>
                {similarProducts && (
                    <div css={styles.similarLinkWrap}>
                        <Link
                            color='blue'
                            fontSize='base'
                            padding={2}
                            margin={-2}
                            style={{
                                opacity: hover ? 1 : 0
                            }}
                            onClick={this.handleViewSimilarProductsClick}
                            children={getText('viewSimilarProducts')}
                            data-at={Sephora.debug.dataAt('view_similar_products_link')}
                        />
                    </div>
                )}
            </Flex>
        );
    }
}

const styles = {
    root: ({ increaseImageSizeGrid }) => ({
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        fontSize: fontSizes.base,
        lineHeight: lineHeights.tight,
        textAlign: 'left',
        position: 'relative',
        '.no-touch &:hover .ProductTile-name': {
            textDecoration: 'underline'
        },
        [mediaQueries.xsMax]: increaseImageSizeGrid
            ? {
                '.ProductTile-content': {
                    paddingLeft: space[4] / 2,
                    paddingRight: space[4] / 2
                }
            }
            : {}
    }),
    imageWrap: {
        '.no-touch &:hover .ProductTile-ql': {
            opacity: 1
        }
    },
    similarLinkWrap: {
        display: 'flex',
        marginTop: space[2]
    },
    quickLook: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        textAlign: 'center',
        color: colors.white,
        lineHeight: 1,
        fontWeight: fontWeights.bold,
        paddingTop: space[2],
        paddingBottom: space[2],
        fontSize: fontSizes.base,
        borderRadius: radii[2],
        opacity: 0,
        transition: 'opacity .3s',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        '.no-touch &:hover': {
            backgroundColor: 'rgba(102, 102, 102, 0.9)'
        },
        [mediaQueries.xsMax]: {
            display: 'none'
        },
        ':focus-within': {
            opacity: 1
        }
    },
    ratingWrap: {
        display: 'flex',
        alignItems: 'center',
        lineHeight: 1,
        marginTop: space[2],
        fontSize: 11,
        [mediaQueries.sm]: {
            fontSize: 13
        }
    },
    reviewCount: {
        marginLeft: '.375em',
        position: 'relative',
        top: '.0625em',
        fontSize: fontSizes.xs,
        [mediaQueries.sm]: {
            fontSize: fontSizes.sm
        }
    },
    price: {
        display: 'block',
        marginTop: '.375em',
        fontSize: fontSizes.base,
        [mediaQueries.sm]: {
            fontSize: fontSizes.md
        }
    },
    priceList: {
        fontWeight: 'var(--font-weight-normal)',
        textDecoration: 'line-through'
    },
    priceSale: {
        color: colors.red
    },
    priceValue: {
        fontWeight: 'var(--font-weight-normal)',
        fontSize: '.75em'
    },
    flags: {
        display: 'grid',
        justifyItems: 'start',
        gap: space[1],
        position: 'absolute',
        top: 0,
        left: 0
    },
    flagsContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: space[2]
    },
    marketingFlags: {
        display: 'flex',
        flexDirection: 'column',
        gap: space[1]
    },
    love: {
        position: 'absolute',
        top: -8,
        right: -8
    },
    csfLove: {
        position: 'absolute',
        top: -8,
        right: -8
    },
    skeleton: {
        image: {
            borderRadius: radii[2],
            paddingBottom: '100%'
        },
        text: {
            borderRadius: radii.full
        },
        price: {
            display: 'block',
            width: '3em',
            borderRadius: radii.full
        },
        rating: {
            width: '6em',
            height: '1em',
            borderRadius: radii.full
        }
    },
    partialListPrice: {
        fontWeight: 'var(--font-weight-normal)'
    },
    partialListPriceText: {
        fontSize: fontSizes.sm,
        fontWeight: 'var(--font-weight-normal)'
    },
    flexContainer: {
        [mediaQueries.xsMax]: {
            width: '100%'
        }
    },
    addToBasketCtaContainer: paddingTop => ({
        display: 'flex',
        flexDirection: 'column', // Stack the items vertically
        justifyContent: 'flex-start', // Align the items at the top (default)
        paddingTop: paddingTop ? space[paddingTop] : space[4],
        marginTop: 'auto', // Ensure the button stays at the bottom of the container
        alignSelf: 'flex-start',
        [mediaQueries.xsMax]: {
            paddingTop: paddingTop ? space[paddingTop] : space[1]
        }
    }),
    variationText: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    displayName: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        WebkitLineClamp: 2,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical'
    },
    brandName: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    ratingNumber: {
        marginRight: '.25em',
        fontWeight: fontWeights.bold
    }
};

ProductTile.shouldUpdatePropsOn = ['product', 'deliveryOptions'];

ProductTile.propTypes = {
    product: PropTypes.object,
    deliveryOptions: PropTypes.object,
    checkedRefinements: PropTypes.array,
    isLazyLoaded: PropTypes.bool,
    source: PropTypes.string,
    isSkeleton: PropTypes.bool,
    fireSponsoredProductClickTracking: PropTypes.func.isRequired,
    fireProductViewableImpressionTracking: PropTypes.func.isRequired,
    index: PropTypes.number,
    rootContainerName: PropTypes.string,
    similarProducts: PropTypes.bool,
    increaseImageSizeGrid: PropTypes.bool
};

ProductTile.defaultProps = {
    isSkeleton: false,
    similarProducts: false,
    increaseImageSizeGrid: true,
    isDeliveryFilterApplied: false
};

export default wrapComponent(ProductTile, 'ProductTile', true);
