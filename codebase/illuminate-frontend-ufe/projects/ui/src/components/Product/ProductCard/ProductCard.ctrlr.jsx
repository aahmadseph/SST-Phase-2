/* eslint-disable class-methods-use-this */

import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import { default as Analytics, default as anaUtils } from 'analytics/utils';
import AddToBasketButton from 'components/AddToBasketButton';
import BaseClass from 'components/BaseClass';
import Flag from 'components/Flag/Flag';
import ProductImage from 'components/Product/ProductImage';
import ProductLove from 'components/Product/ProductLove';
import ProductLoveToggle from 'components/Product/ProductLove/ProductLoveToggle/ProductLoveToggle';
import ProductQuicklook from 'components/Product/ProductQuicklook/ProductQuicklook';
import ReviewCount from 'components/Product/ReviewCount';
import SeeProductDetails from 'components/SeeProductDetails';
import StarRating from 'components/StarRating/StarRating';
import SavedInLists from 'components/RichProfile/MyLists/SavedInLists';
import { Box, Text } from 'components/ui';
import { CONSTRUCTOR_PODS, CTA } from 'constants/constructorConstants';
import PropTypes from 'prop-types';
import React from 'react';
import {
    buttons, colors, fontSizes, fontWeights, mediaQueries, radii, space
} from 'style/config';
import basketUtils from 'utils/Basket';
import Location from 'utils/Location';
import locationUtils from 'utils/Location';
import localeUtils from 'utils/LanguageLocale';
import marketingFlagsUtil from 'utils/MarketingFlags';
import skuUtils from 'utils/Sku';
import uiUtils from 'utils/UI';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';
import rougeExclusiveUtils from 'utils/rougeExclusive';
import { wrapComponent } from 'utils/framework';
import isFunction from 'utils/functions/isFunction';
import { setIntersectionObserver } from 'utils/intersectionObserver';
import Markdown from 'components/Markdown/Markdown';
import helpersUtils from 'utils/Helpers';
import OnlyFewLeftFlag from 'components/OnlyFewLeftFlag/OnlyFewLeftFlag';
import Empty from 'constants/empty';

const { deferTaskExecution } = helpersUtils;
const { getLink } = urlUtils;
const { SKELETON_ANIMATION } = uiUtils;
const { ADD_TO_BASKET_TYPES } = basketUtils;
const ADD_BUTTON_TYPE = ADD_TO_BASKET_TYPES;

const outlineStyles = {
    default: {
        paddingX: [3, 4],
        boxShadow: 'light'
    },
    none: {
        paddingX: 0,
        boxShadow: 'none'
    }
};

function getLovePositionStyle({
    vertical, horizontal, offset, verticalPos = 0, horizontalPos = 0
}) {
    const style = {};

    // Set either style['top'] or style['bottom'] based on vertical side,
    // and either style['left'] or style['right'] based on horizontal side
    style[vertical] = verticalPos;
    style[horizontal] = horizontalPos;

    if (horizontal === 'right') {
        style.marginLeft = offset;
    } else {
        style.marginRight = offset;
    }

    return style;
}

function ProductCardLoveButton({
    showLovesButton,
    rank,
    isSkeleton,
    sku,
    productId,
    isConstructorContainer,
    imageProps,
    loveButtonPosition = ['top', 'right'],
    verticalPos,
    horizontalPos,
    offset = space[1]
}) {
    const [vertical, horizontal] = loveButtonPosition;
    const lovePositionStyle = getLovePositionStyle({
        vertical,
        horizontal,
        offset,
        verticalPos,
        horizontalPos
    });

    return (
        showLovesButton &&
        !rank &&
        !isSkeleton && (
            <div css={{ ...styles.love, ...lovePositionStyle }}>
                <ProductLove
                    sku={sku}
                    loveSource='productPage'
                    productId={productId}
                    imageProps={imageProps}
                >
                    <ProductLoveToggle
                        productId={productId}
                        isCircle={true}
                        size={20}
                        width={36}
                        height={36}
                        {...(isConstructorContainer && {
                            dataConstructorButton: CTA.MOVE_TO_LOVES
                        })}
                    />
                </ProductLove>
            </div>
        )
    );
}

function ProductCardCTA({
    rootContainerName,
    componentName,
    analyticsContext,
    pageName,
    showAddButton,
    sku,
    isSkeleton,
    showErrorModal,
    hasErrors,
    ctaTwoLines,
    isRougeExclusiveCarousel,
    triggerAnalytics,
    position,
    isConstructorContainer,
    isRewardItem,
    defaultRewardBiButton,
    isSharableList = false,
    customCSS,
    isAccountMenuBuyItAgain
}) {
    const isReward = skuUtils.isBiReward(sku);

    const renderBiButton = fn =>
        isSkeleton ? <div css={[styles.skeleton.button, SKELETON_ANIMATION]} /> : fn({ analyticsContext, rootContainerName, sku, position });

    if (isFunction(showAddButton)) {
        return renderBiButton(showAddButton);
    }

    if (isReward && showAddButton && isFunction(defaultRewardBiButton)) {
        return renderBiButton(defaultRewardBiButton);
    }

    let button = (
        <AddToBasketButton
            sku={sku}
            variant={ADD_BUTTON_TYPE.SECONDARY}
            isAddButton={!isSharableList}
            size='sm'
            analyticsContext={analyticsContext}
            pageName={pageName}
            rootContainerName={rootContainerName}
            componentName={componentName}
            showBasketCarouselErrorModal={showErrorModal}
            disabled={hasErrors}
            triggerAnalytics={triggerAnalytics}
            ctaTwoLines={ctaTwoLines}
            isRougeExclusiveCarousel={isRougeExclusiveCarousel}
            isRewardItem={isRewardItem}
            isSharableList={isSharableList}
            customStyle={isAccountMenuBuyItAgain && { padding: space[1] }}
            {...(isConstructorContainer && {
                'data-cnstrc-btn': CTA.ADD_TO_CART
            })}
        />
    );

    if (sku.isExternallySellable) {
        button = (
            <SeeProductDetails
                size={'sm'}
                variant={'secondary'}
            />
        );
    }

    return (isSkeleton || sku.listPrice) && showAddButton ? (
        <div css={{ ...styles.add, ...customCSS?.ATB }}>{isSkeleton ? <div css={[styles.skeleton.button, SKELETON_ANIMATION]} /> : button}</div>
    ) : null;
}

function ProductCardReview({
    isSkeleton, sku, showRating, forceDisplayRating, customCSS
}) {
    const rating = sku.starRatings || sku.primaryProduct?.rating || 0;
    const reviews = sku.productReviewCount || sku.reviewsCount || sku.primaryProduct?.reviews;

    return (
        Boolean(((isSkeleton || rating) && showRating) || forceDisplayRating) && (
            <div css={{ ...styles.ratingWrap, ...customCSS?.ratingWrap }}>
                {isSkeleton ? (
                    <div css={[styles.skeleton.rating, SKELETON_ANIMATION]} />
                ) : (
                    <>
                        <StarRating rating={rating} />
                        <ReviewCount
                            data-at={Sephora.debug.dataAt('review_count')}
                            css={styles.reviewCount}
                            productReviewCount={reviews}
                        />
                    </>
                )}
            </div>
        )
    );
}

function ProductCardMarketingFlags({
    showMarketingFlags,
    isSkeleton,
    sku,
    rougeBadgeText,
    isSharableList,
    onlyAFewLeftText,
    isInCarousel,
    showLovesButton
}) {
    const marketingFlags = marketingFlagsUtil.getProductTileFlags(sku);

    if (isSharableList && sku.isOnlyFewLeft && !isInCarousel) {
        marketingFlags.push(onlyAFewLeftText);
    }

    return (
        showMarketingFlags &&
        !isSkeleton && (
            <div css={styles.flags}>
                {marketingFlags.map((flag, key) => {
                    const isFrench = localeUtils.isFrench();
                    const isRougeFlag = flag === 'Rouge' && rougeExclusiveUtils.isRougeExclusiveEnabled;
                    const text = isRougeFlag ? rougeBadgeText : flag;
                    const isRedColor = isRougeFlag || flag === onlyAFewLeftText;
                    const isOnlyAFewLeftFlag = flag === onlyAFewLeftText;

                    return (
                        <Flag
                            key={key}
                            children={text}
                            css={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: isFrench && isOnlyAFewLeftFlag && showLovesButton ? '54%' : '100%'
                            }}
                            marginRight={space[6]}
                            backgroundColor={isRedColor ? colors.red : colors.black}
                        />
                    );
                })}
            </div>
        )
    );
}

class ProductCard extends BaseClass {
    ref = React.createRef();

    componentDidMount() {
        const { sku, fireProductViewableImpressionTracking, source } = this.props;

        if (sku.sponsored) {
            setIntersectionObserver(
                this.ref.current,
                () => {
                    fireProductViewableImpressionTracking({ product: sku, source });
                },
                { threshold: 1 }
            );
        }
    }

    shouldTriggerAnalytics = () => {
        const { podId } = this.props;

        return (
            // If the product is inside the You May Also Like Carousel
            podId === CONSTRUCTOR_PODS.YMAL ||
            // If the product is inside the Chosen For You Carousel
            podId === CONSTRUCTOR_PODS.RFY
        );
    };

    triggerSelectItemAnalytics = () => {
        // Dispatches the Select Item Event
        processEvent.process(anaConsts.SELECT_ITEM_EVENT, {
            data: {
                listName: this.props?.parentTitle || '',
                listId: this.props?.podId || '',
                productId: this.props.sku?.productId || '',
                price: this.props.sku?.listPrice || '',
                brandName: this.props.sku?.brandName || '',
                productName: this.props.sku?.productName || '',
                productIndex: this.props?.position || 0
            }
        });
    };

    triggerAnalytics = () => {
        const data = {
            linkName: anaConsts.EVENT_NAMES.CAROUSEL_PRODUCT_CLICK,
            actionInfo: anaConsts.EVENT_NAMES.CAROUSEL_PRODUCT_CLICK,
            specificEventName: anaConsts.EVENT_NAMES.CAROUSEL_PRODUCT_CLICK,
            sponsoredProductInformation: {
                customerId: userUtils.getProfileId(),
                carouselId: this.props.podId,
                pageName: anaConsts.PAGE_NAMES.PRODUCT,
                carouselName: this.props.parentTitle,
                position: this.props.position,
                productId: this.props.sku.productId
            }
        };

        processEvent.process(
            anaConsts.SOT_LINK_TRACKING_EVENT,
            {
                data
            },
            { specificEventName: anaConsts.EVENT_NAMES.CAROUSEL_PRODUCT_CLICK }
        );
    };

    triggerAnalyticsCms = () => {
        const { sku, position, triggerCmsEvent } = this.props;

        if (triggerCmsEvent) {
            triggerCmsEvent(sku, position);
        }
    };

    onClick = ({
        parentTitle,
        analyticsContext,
        componentTitle,
        calculatedUrl,
        productId,
        onClick,
        sku,
        position,
        openRewardsBazaarModal,
        event
    }) => {
        const { triggerCmsEvent, rootContainerName, podId, isCarousel } = this.props;

        deferTaskExecution(() => {
            this.triggerSelectItemAnalytics();
        });

        if (triggerCmsEvent) {
            this.triggerAnalyticsCms();
        } else if (this.shouldTriggerAnalytics()) {
            deferTaskExecution(() => {
                this.triggerAnalytics();
            });
        }

        deferTaskExecution(() => {
            anaUtils.saveProductClickAttributes({
                carouselProductIndex: position,
                listType: parentTitle,
                productId
            });

            const campaignName = parentTitle || analyticsContext || 'n/a';
            const nextPageData = {
                recInfo: {
                    isExternalRec: !!this.props.podId,
                    componentTitle,
                    podId
                },
                internalCampaign: `${campaignName.toLowerCase()}:${productId.toLowerCase()}:product`
            };

            if (locationUtils.isAutoreplenishPage() || isCarousel) {
                nextPageData.events = [anaConsts.Event.EVENT_269];
            }

            if (rootContainerName === anaConsts.CAROUSEL_NAMES.ROUGE_REWARDS_CAROUSEL) {
                nextPageData.internalCampaign = `${rootContainerName}:${productId.toLowerCase()}:product`;
                nextPageData.recInfo.componentTitle = rootContainerName;
            }

            const pageSourceName = anaUtils.getCustomPageSourceName();

            if (pageSourceName) {
                nextPageData.internalCampaign = `${pageSourceName}:${nextPageData.internalCampaign}`;
            }

            if (locationUtils.isCreatorStoreFrontPage()) {
                nextPageData.pageType = anaConsts.PAGE_TYPES.CREATOR_STORE_FRONT;
            }

            Analytics.setNextPageData(nextPageData);
        });

        if (onClick) {
            onClick({ event, product: sku, index: position });
        }

        deferTaskExecution(() => {
            Location.navigateTo(event, calculatedUrl);
        });

        openRewardsBazaarModal(false);
    };

    getTargetUrl = ({ useInternalTracking, componentName, targetUrl, ignoreTargetUrlForBox }) => {
        if (ignoreTargetUrlForBox) {
            return null;
        }

        if (useInternalTracking && targetUrl?.indexOf('icid2=') === -1) {
            return getLink(targetUrl, [componentName]);
        }

        return getLink(targetUrl);
    };

    getPrice = ({
        sku, isHorizontal, isSkeleton, showPrice, localization, showVerticlePrice
    }) => {
        return (
            showPrice &&
            (sku.listPrice || isSkeleton) && (
                <b css={isHorizontal && !showVerticlePrice ? styles.priceHorizontal : styles.priceVertical}>
                    {isSkeleton ? (
                        <span css={[styles.skeleton.price, SKELETON_ANIMATION]}>&nbsp;</span>
                    ) : (
                        <>
                            {sku.salePrice && (
                                <>
                                    <span
                                        data-at={Sephora.debug.dataAt('product_sale_price')}
                                        css={styles.priceSale}
                                        children={sku.salePrice}
                                    />{' '}
                                </>
                            )}
                            <span
                                data-at={Sephora.debug.dataAt('product_list_price')}
                                css={sku.salePrice && styles.priceList}
                                children={
                                    skuUtils.isFree(sku) ? (
                                        <span>
                                            {localization.free}
                                            <sup>∫</sup>
                                        </span>
                                    ) : (
                                        sku.listPrice
                                    )
                                }
                            />
                            {sku.valuePrice && (
                                <span
                                    css={styles.priceValue}
                                    data-at={Sephora.debug.dataAt('sku_item_price_value')}
                                >
                                    {sku.valuePrice.indexOf(localization.value) > -1
                                        ? ` ${sku.valuePrice}`
                                        : ` (${sku.valuePrice} ${localization.value})`}
                                </span>
                            )}
                        </>
                    )}
                </b>
            )
        );
    };

    /* eslint-disable-next-line complexity */
    render() {
        const {
            sku,
            imageSize,
            showAddButton,
            showRating,
            showPrice,
            showMarketingFlags,
            rank,
            showLovesButton,
            analyticsContext,
            hasVariationValue,
            parentTitle,
            useInternalTracking,
            isHorizontal,
            isSkeleton,
            isPageRenderImg,
            rootContainerName,
            showQuickLookOnMobile,
            ignoreTargetUrlForBox,
            componentName,
            onClick,
            position,
            outline,
            localization,
            isBIRBReward,
            hideQuicklook,
            showVerticlePrice,
            finalSale,
            openRewardsBazaarModal,
            showErrorModal,
            itemLevelBasketErrors,
            rougeBadgeText,
            urlImage,
            ctaTwoLines,
            triggerCmsEvent,
            isRougeExclusiveCarousel,
            isRewardItem,
            defaultRewardBiButton,
            isSharableList = false,
            listNames,
            loveButtonPosition,
            verticalPos,
            horizontalPos,
            labelFontSize,
            showOnlyFewLeft,
            isInCarousel,
            forceDisplayRating = false,
            invertPriceAndRatingOrder = false,
            customCSS,
            isAccountMenuBuyItAgain,
            pageName,
            ...rest
        } = this.props;

        if (!isSkeleton && !sku) {
            return null;
        }

        let hasErrors = false;

        if (itemLevelBasketErrors && itemLevelBasketErrors[sku.skuId] && showErrorModal) {
            hasErrors = true;
        }

        const {
            targetUrl, productId, productName, variationId, strategyId, listPrice, salePrice
        } = sku;

        const isConstructorContainer = !!strategyId;
        const constructorTrackingParameters = isConstructorContainer
            ? {
                'data-cnstrc-item-id': productId,
                'data-cnstrc-item-name': productName,
                'data-cnstrc-item-variation-id': variationId,
                'data-cnstrc-strategy-id': strategyId,
                'data-cnstrc-item-price': salePrice || listPrice
            }
            : {};

        const analyticsHandle = triggerCmsEvent ? this.triggerAnalyticsCms : this.triggerAnalytics;

        const componentTitle = parentTitle ? parentTitle.replace('\'', '') : '';

        const price = this.getPrice({
            sku,
            isHorizontal,
            isSkeleton,
            showPrice,
            localization,
            showVerticlePrice
        });

        const calculatedUrl = this.getTargetUrl({
            useInternalTracking,
            componentName,
            targetUrl,
            ignoreTargetUrlForBox
        });

        const outlineStyle = outlineStyles[outline];
        const marketingFlagsString = marketingFlagsUtil.getProductTileFlags(sku).join(' ');

        const imageProps = sku
            ? {
                id: sku.skuId,
                badge: sku.badge,
                altText: sku.badgeAltText,
                size: imageSize,
                isPageRenderImg: isPageRenderImg,
                skuImages: sku.skuImages
            }
            : {};

        if (urlImage && sku.gridImageURL) {
            imageProps.src = sku.gridImageURL;
        }

        const sizeAriaLabel = sku.size ? `Size: ${sku.size}` : '';
        const colorAriaLabel = sku.variationType === 'Color' ? `Color: ${sku.variationValue}` : '';
        const ariaLabel = `${marketingFlagsString} ${sku.brandName} ${sku.productName} ${sizeAriaLabel} ${colorAriaLabel} ${sku.valuePrice}`;

        return (
            <Box
                ref={this.ref}
                is={calculatedUrl ? 'a' : 'div'}
                baseCss={styles.root}
                display='flex'
                width='100%'
                fontSize='base'
                lineHeight='tight'
                backgroundColor='white'
                borderRadius={2}
                textAlign='left'
                position='relative'
                boxShadow={outlineStyle.boxShadow}
                overflow='hidden'
                paddingY={isHorizontal ? 4 : [3, 4]}
                paddingX={outlineStyle.paddingX}
                flexDirection={isHorizontal || 'column'}
                data-at={Sephora.debug.dataAt('product_item_container')}
                aria-label={ariaLabel}
                href={calculatedUrl}
                {...constructorTrackingParameters}
                onClick={event => {
                    event.preventDefault();
                    event.stopPropagation();

                    return calculatedUrl
                        ? this.onClick({
                            parentTitle,
                            analyticsContext,
                            componentTitle,
                            calculatedUrl,
                            productId,
                            onClick,
                            sku,
                            position,
                            openRewardsBazaarModal,
                            event
                        })
                        : null;
                }}
                {...rest}
            >
                <Box
                    position='relative'
                    marginX='auto'
                    width={imageSize}
                    maxWidth='100%'
                >
                    {isSkeleton ? (
                        <div css={[styles.skeleton.image, SKELETON_ANIMATION]} />
                    ) : (
                        <>
                            <ProductImage {...imageProps} />
                            {!hideQuicklook && (
                                <div className='ProductCard-ql'>
                                    <ProductQuicklook
                                        isShown={true}
                                        showQuickLookOnMobile={showQuickLookOnMobile}
                                        productStringContainerName={componentTitle || ''}
                                        rootContainerName={componentTitle}
                                        sku={sku}
                                        triggerAnalytics={analyticsHandle}
                                        podId={this.props.podId}
                                        isCarousel={this.props.isCarousel}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </Box>

                <div css={[styles.infoWrap, isHorizontal ? styles.infoWrapHorizontal : styles.infoWrapVertical, customCSS?.infoWrapPaddingX]}>
                    <div css={[styles.nameWrap, showAddButton && hasVariationValue && styles.nameAndVariationWrap]}>
                        <Text
                            display='block'
                            fontSize={'sm'}
                            marginBottom='.125em'
                            fontWeight='bold'
                            numberOfLines={1}
                            data-at={Sephora.debug.dataAt('product_brand_label')}
                            css={isSkeleton && [styles.skeleton.text, SKELETON_ANIMATION]}
                            dangerouslySetInnerHTML={{
                                __html: isSkeleton ? '&nbsp;' : sku.brandName
                            }}
                        />
                        <Text
                            fontSize={['sm', labelFontSize ? labelFontSize : 'base']}
                            numberOfLines={2}
                            data-at={Sephora.debug.dataAt('product_name_label')}
                            css={isSkeleton && [styles.skeleton.text, SKELETON_ANIMATION]}
                            dangerouslySetInnerHTML={{
                                __html: isSkeleton ? '&nbsp;' : sku.productName
                            }}
                        />
                        {((showAddButton && sku.variationValue) || this.props.variationString) && !isSkeleton && (
                            <Text
                                display='block'
                                color='gray'
                                marginTop='.25em'
                                fontSize='sm'
                                numberOfLines={1}
                                children={this.props.variationString || [sku.variationValue, sku.variationDesc && ` - ${sku.variationDesc}`]}
                            />
                        )}
                    </div>

                    {invertPriceAndRatingOrder && (
                        <ProductCardReview
                            {...{
                                isSkeleton,
                                sku,
                                showRating,
                                forceDisplayRating,
                                customCSS
                            }}
                        />
                    )}

                    {(!isHorizontal || showVerticlePrice) && price}

                    {finalSale && (
                        <Markdown
                            marginTop='0.5em'
                            color='red'
                            fontSize='sm'
                            content={finalSale}
                        />
                    )}

                    {showOnlyFewLeft && sku.isOnlyFewLeft && isInCarousel && <OnlyFewLeftFlag css={customCSS?.onlyAFewFlag} />}

                    {invertPriceAndRatingOrder || (
                        <ProductCardReview
                            {...{
                                isSkeleton,
                                sku,
                                showRating,
                                forceDisplayRating,
                                customCSS
                            }}
                        />
                    )}

                    {listNames && listNames.length > 0 && <SavedInLists listNames={listNames} />}
                    <ProductCardCTA
                        {...{
                            rootContainerName,
                            componentName,
                            analyticsContext,
                            pageName,
                            showAddButton,
                            sku,
                            isSkeleton,
                            isBIRBReward,
                            showErrorModal,
                            hasErrors,
                            ctaTwoLines,
                            isRougeExclusiveCarousel,
                            triggerAnalytics: analyticsHandle,
                            position: this?.props?.position || 0,
                            isConstructorContainer,
                            isRewardItem,
                            defaultRewardBiButton,
                            isSharableList,
                            customCSS,
                            isAccountMenuBuyItAgain
                        }}
                    />
                </div>

                {isHorizontal && !showVerticlePrice && price}

                <ProductCardMarketingFlags
                    {...{
                        showMarketingFlags,
                        isSkeleton,
                        sku,
                        rougeBadgeText,
                        isSharableList,
                        onlyAFewLeftText: localization.onlyAFewLeft,
                        isInCarousel,
                        showLovesButton
                    }}
                />

                <ProductCardLoveButton
                    {...{
                        showLovesButton,
                        rank,
                        isSkeleton,
                        sku,
                        productId,
                        isBIRBReward,
                        isConstructorContainer,
                        imageProps,
                        loveButtonPosition,
                        verticalPos,
                        horizontalPos
                    }}
                />

                {rank && !isSkeleton && (
                    <div css={styles.rank}>
                        <div
                            css={styles.rankNum}
                            children={`#${rank}`}
                        />
                    </div>
                )}
            </Box>
        );
    }
}

const styles = {
    root: {
        '& .ProductCard-ql': {
            opacity: 0,
            transition: 'opacity .2s'
        },
        '.no-touch a&': {
            transition: 'transform .2s',
            '&:hover': {
                transform: `translateY(-${space[1]}px)`
            }
        },
        '.no-touch &:hover, &:focus-within': {
            '& .ProductCard-ql': {
                opacity: 1
            }
        }
    },
    infoWrap: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1
    },
    infoWrapHorizontal: {
        paddingLeft: space[3],
        paddingRight: space[3]
    },
    infoWrapVertical: {
        paddingTop: space[3]
    },
    nameWrap: {
        minHeight: 45,
        [mediaQueries.sm]: {
            minHeight: 51
        }
    },
    nameAndVariationWrap: {
        minHeight: 63,
        [mediaQueries.sm]: {
            minHeight: 69
        }
    },
    priceHorizontal: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'right'
    },
    priceVertical: {
        display: 'block',
        marginTop: space[2],
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
        color: colors.red,
        order: -1
    },
    priceValue: {
        fontWeight: 'var(--font-weight-normal)',
        fontSize: '.75em'
    },
    ratingWrap: {
        display: 'flex',
        lineHeight: 1,
        marginTop: space[3],
        fontSize: fontSizes.sm
    },
    reviewCount: {
        marginLeft: '.375em',
        position: 'relative',
        top: '.0625em'
    },
    add: {
        paddingTop: space[3],
        marginTop: 'auto'
    },
    flags: {
        position: 'absolute',
        top: space[1],
        left: space[1],
        display: 'grid',
        gap: space[1],
        '> *': {
            marginRight: 'auto'
        }
    },
    love: {
        position: 'absolute'
    },
    rank: {
        position: 'absolute',
        top: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: '.75em',
        lineHeight: 1,
        color: colors.white,
        fontWeight: fontWeights.bold,
        width: '3.75em',
        height: '3.75em',
        background: `linear-gradient(to top right, transparent 0%, transparent 50%, ${colors.black} 50%, ${colors.black} 100%)`,
        fontSize: fontSizes.xs,
        [mediaQueries.sm]: {
            fontSize: fontSizes.md
        }
    },
    rankNum: {
        width: '60%',
        textAlign: 'center'
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
        },
        button: {
            borderRadius: radii.full,
            height: buttons.HEIGHT_SM,
            width: 68
        }
    }
};

ProductCard.propTypes = {
    sku: PropTypes.object,
    imageSize: PropTypes.oneOfType([PropTypes.number, PropTypes.array]).isRequired,
    showRating: PropTypes.bool,
    showPrice: PropTypes.bool,
    showMarketingFlags: PropTypes.bool,
    rank: PropTypes.number,
    showAddButton: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    showLovesButton: PropTypes.bool,
    isSkeleton: PropTypes.bool,
    rootContainerName: PropTypes.string,
    analyticsContext: PropTypes.string,
    hasVariationValue: PropTypes.bool,
    parentTitle: PropTypes.string,
    useInternalTracking: PropTypes.bool,
    isHorizontal: PropTypes.bool,
    isPageRenderImg: PropTypes.bool,
    showQuickLookOnMobile: PropTypes.bool,
    fireProductViewableImpressionTracking: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    outline: PropTypes.oneOf(['default', 'none']),
    showErrorModal: PropTypes.bool,
    isCarousel: PropTypes.bool,
    isSharableList: PropTypes.bool
};

ProductCard.defaultProps = {
    showRating: true,
    showPrice: true,
    showMarketingFlags: true,
    showAddButton: false,
    showLovesButton: false,
    isSkeleton: false,
    showQuickLookOnMobile: false,
    fireProductViewableImpressionTracking: false,
    outline: 'default',
    showErrorModal: false,
    isCarousel: false,
    isSharableList: false,
    customCSS: Empty.Object,
    isAccountMenuBuyItAgain: false
};

export default wrapComponent(ProductCard, 'ProductCard', true);
