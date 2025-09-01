/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    colors, fontSizes, lineHeights, space
} from 'style/config';
import urlUtils from 'utils/Url';
import localeUtils from 'utils/LanguageLocale';
import { Button, Link } from 'components/ui';
import ProductDisplayName from 'components/Product/ProductDisplayName/ProductDisplayName';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductLove from 'components/Product/ProductLove';
import ProductLoveToggle from 'components/Product/ProductLove/ProductLoveToggle/ProductLoveToggle';
import ProductQuicklook from 'components/Product/ProductQuicklook/ProductQuicklook';
import StarRating from 'components/StarRating/StarRating';
import AddToBasketButton from 'components/AddToBasketButton';
import ProductBadges from 'components/Product/ProductBadges/ProductBadges';
import SeeProductDetails from 'components/SeeProductDetails';
import { CTA } from 'constants/constructorConstants';
import bccUtils from 'utils/BCC';
import SKU_TYPES from 'utils/Sku';
import basketUtils from 'utils/Basket';
import anaConsts from 'analytics/constants';
import marketingFlagsUtil from 'utils/MarketingFlags';
import { getImageAltText } from 'utils/Accessibility';
import Location from 'utils/Location';
import ReviewCount from 'components/Product/ReviewCount/ReviewCount';
import UpperFunnelProductTiles from 'components/Catalog/UpperFunnel/UpperFunnelProductTiles';

import anaUtils from 'analytics/utils';
const PRODUCT_ADD_REVIEWS_URL = '/addReview?productId=';
import Authentication from 'Authentication';
import UrlUtils from 'utils/Url';
import keyConsts from 'utils/KeyConstants';

// ILLUPH-124962 Code related to T&T
import processEvent from 'analytics/processEvent';
import replaceSpecialCharacters from 'utils/replaceSpecialCharacters';
import locationUtils from 'utils/Location';
import quicklookModalUtils from 'utils/Quicklook';

import skuUtils from 'utils/Sku';

const { getLink } = urlUtils;
const { IMAGE_SIZES } = bccUtils;
const ADD_BUTTON_TYPE = basketUtils.ADD_TO_BASKET_TYPES;

// prettier-ignore
const DATA_AT = {
    'basket_loves': 'loves_add_to_basket_btn'
};

const NUMBER_HEIGHT = 24;

const ProductItemCTA = ({
    useAddToBasket,
    isUseWriteReview,
    imageSize,
    isExternallySellable,
    styles,
    isCountryRestricted,
    closeParentModal,
    isAddButton,
    isCleanAtSephora,
    reviewOnClick,
    getText,
    btnProps
}) => {
    const atbButton = isExternallySellable ? (
        <SeeProductDetails
            variant={'secondary'}
            size={'sm'}
        />
    ) : (
        <AddToBasketButton
            {...btnProps}
            closeParentModal={closeParentModal}
            isAddButton={isAddButton}
            minHeight={isCleanAtSephora && 32}
            size={Sephora.isMobile() || imageSize === IMAGE_SIZES[97] || isCleanAtSephora ? 'sm' : null}
        />
    );

    if (!useAddToBasket && !isUseWriteReview) {
        return null;
    }

    return (
        (useAddToBasket || isUseWriteReview) && (
            <div css={styles.actionWrap}>
                {useAddToBasket ? (
                    isCountryRestricted ? (
                        <p css={styles.restricted}>
                            {getText('itemShip')}
                            {localeUtils.isCanada() ? getText('canada') : getText('us')}
                        </p>
                    ) : (
                        atbButton
                    )
                ) : (
                    <Button
                        variant='primary'
                        size='sm'
                        data-at={Sephora.debug.dataAt('write_review_btn')}
                        onClick={reviewOnClick}
                    >
                        {getText('writeReviewText')}
                    </Button>
                )}
            </div>
        )
    );
};

class ProductItem extends BaseClass {
    state = {
        hover: false
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Product/ProductItem/locales', 'ProductItem');
        const isTouch = Sephora.isTouch;
        const {
            showQuickLook = true,
            showMoreColors = true,
            hideBadges,
            hideProductName,
            onClick,
            origin,
            containerTitle,
            internalCampaignString,
            productReviewCount,
            productStringContainerName,
            imageSrc,
            checkedRefinements,
            pickupEligible,
            sameDayEligible,
            shipToHomeEligible,
            deliveryOptions,
            firstParentCategoryId,
            variationValue,
            variationDesc,
            isShadeFinderResults,
            showBasketQuickAdd,
            color,
            moreColors,
            moreColor,
            viewSimilarProductsText,
            podId,
            listPrice,
            salePrice,
            variationId,
            strategyId,
            productId,
            productName
        } = this.props;

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

        const { hover } = this.state;

        const currentSku = Object.assign({}, this.props, { type: SKU_TYPES.STANDARD });

        // remove Component props injected by lazyLoad
        delete currentSku.id;
        delete currentSku.comps;
        delete currentSku.componentClass;

        const isCountryRestricted = !!this.props.isCountryRestricted;

        let valuePrice = currentSku.valuePrice;

        if (valuePrice && this.props.formatValuePrice) {
            valuePrice = `(${valuePrice} ${getText('value')})`;
        }

        const rating = currentSku.starRatings !== undefined ? currentSku.starRatings : currentSku.primaryProduct && currentSku.primaryProduct.rating;

        const internalTrackProductString = internalCampaignString ? internalCampaignString : anaConsts.CAMPAIGN_STRINGS.DEFAULT_CAROUSEL_PARAM;

        const RootComp = isCountryRestricted || onClick ? 'div' : 'a';

        const onClickProps = onClick
            ? {
                role: 'button',
                onClick,
                tabIndex: 0,
                onKeyPress: this.onKeyPress
            }
            : {
                onClick: this.onClick
            };

        let originValue = '';
        const linkValues = [currentSku.rootContainerName, currentSku.productId];

        if (internalCampaignString || !(Location.isBrandNthCategoryPage() || Location.isNthCategoryPage())) {
            linkValues.push(internalTrackProductString);
        }

        if (origin) {
            linkValues.unshift(origin);
            originValue = `${origin}:${containerTitle}`;
        }

        this.isNullLink = isCountryRestricted || onClick || showBasketQuickAdd;
        this.linkValues = linkValues;

        const btnProps = {
            analyticsContext: this.props.analyticsContext,
            origin: this.props.origin,
            containerTitle: this.props.containerTitle,
            sku: currentSku,
            variant: ADD_BUTTON_TYPE.SECONDARY,
            ['data-at']: Sephora.debug.dataAt(DATA_AT[this.props.analyticsContext] || 'add_to_basket_btn'),
            basketType: this.props.basketType
        };

        // Check top parent category id for the New or Bestsellers category
        // Allows display name to vary without need for code updates
        const showViewSimilarLink = Sephora.isDesktop() && (firstParentCategoryId === '12800020' || firstParentCategoryId === '14300062');

        const colorDesc = variationValue ? `${color} ${variationValue}${variationDesc ? ` - ${variationDesc}` : ''}` : undefined;
        const { isBirthdayGiftSkuValidationEnabled } = Sephora.configurationSettings;
        const freeText = (
            <span>
                {currentSku.listPrice}
                <sup>∫</sup>
            </span>
        );
        const priceValue = skuUtils.isFree(currentSku) && isBirthdayGiftSkuValidationEnabled ? freeText : currentSku.listPrice;

        return (
            <RootComp
                css={[styles.root, onClick && { cursor: 'pointer' }]}
                aria-label={`${currentSku.brandName} ${currentSku.productName}`}
                href={this.isNullLink ? null : this.evaluateCurrentPage(currentSku.targetUrl)}
                onMouseEnter={!isTouch ? this.hoverOn : null}
                onFocus={!isTouch ? this.hoverOn : null}
                onMouseLeave={!isTouch ? this.hoverOff : null}
                onBlur={!isTouch ? this.hoverOff : null}
                {...constructorTrackingParameters}
                {...onClickProps}
            >
                <div
                    onClick={this.props.closeParentModal}
                    css={styles.relative}
                >
                    <div
                        css={[
                            {
                                position: 'relative',
                                marginRight: 'auto',
                                marginLeft: 'auto',
                                maxWidth: currentSku.imageSize,
                                maxHeight: this.props.isCleanAtSephora && currentSku.imageSize
                            },
                            !currentSku.showMarketingFlags ||
                                (!showBasketQuickAdd && {
                                    marginBottom: space[3]
                                })
                        ]}
                    >
                        <ProductImage
                            src={imageSrc}
                            id={currentSku.skuId}
                            size={currentSku.imageSize}
                            skuImages={currentSku.skuImages}
                            isPageRenderImg={currentSku.isPageRenderImg}
                            disableLazyLoad={currentSku.disableLazyLoad}
                            altText={getImageAltText(currentSku)}
                        />

                        {showQuickLook && (
                            <ProductQuicklook
                                isShown={hover}
                                containerTitle={this.props.containerTitle}
                                sku={currentSku}
                                origin={originValue}
                                analyticsContext={this.props.analyticsContext}
                                rootContainerName={currentSku.rootContainerName || this.props.rootName}
                                productStringContainerName={productStringContainerName}
                                podId={podId}
                                isCarousel={this.props.isCarousel}
                            />
                        )}
                        {currentSku.showLoves && !Sephora.isTouch && (
                            <div
                                css={styles.love}
                                style={{
                                    opacity: hover ? 1 : 0
                                }}
                            >
                                <ProductLove
                                    sku={currentSku}
                                    analyticsContext={this.props.analyticsContext}
                                    loveSource='productPage'
                                    productId={currentSku?.productId}
                                >
                                    <ProductLoveToggle
                                        productId={currentSku?.productId}
                                        size={20}
                                        width={24}
                                        height={24}
                                        {...(isConstructorContainer && {
                                            'data-cnstrc-btn': CTA.MOVE_TO_LOVES
                                        })}
                                    />
                                </ProductLove>
                            </div>
                        )}
                    </div>

                    {hideBadges || (
                        <ProductBadges
                            top={currentSku.displayNumber ? NUMBER_HEIGHT + space[2] : 0}
                            isSmall={true}
                            sku={currentSku}
                        />
                    )}

                    {currentSku.showMarketingFlags && (
                        <div
                            css={styles.flags}
                            data-marketing-flags='1'
                            data-at={Sephora.debug.dataAt('sku_item_flags')}
                        >
                            {marketingFlagsUtil.getFirstValidFlagText(currentSku)}
                        </div>
                    )}

                    {currentSku.displayNumber && (
                        <b
                            css={styles.number}
                            data-at={Sephora.debug.dataAt('product_num')}
                        >
                            <span css={{ fontSize: '.75em' }}>#</span>
                            {currentSku.displayNumber}
                        </b>
                    )}

                    {showBasketQuickAdd || (
                        <ProductDisplayName
                            numberOfLines={4}
                            brandName={currentSku.brandName}
                            productName={!hideProductName && currentSku.productName}
                            isHovered={hover && !isCountryRestricted}
                        />
                    )}

                    {currentSku.showPrice && (
                        <div css={styles.price}>
                            <span
                                data-at={Sephora.debug.dataAt('sku_item_price_list')}
                                css={currentSku.salePrice && styles.priceList}
                            >
                                {priceValue}
                            </span>
                            {currentSku.salePrice && (
                                <span
                                    css={styles.priceSale}
                                    data-at={Sephora.debug.dataAt('sku_item_price_sale')}
                                >
                                    {' '}
                                    {currentSku.salePrice}
                                </span>
                            )}
                            {valuePrice && (
                                <span
                                    css={styles.priceValue}
                                    data-at={Sephora.debug.dataAt('sku_item_price_value')}
                                >
                                    {' '}
                                    {valuePrice}
                                </span>
                            )}
                            {currentSku.wholeSalePrice && (
                                <span
                                    css={styles.priceValue}
                                    data-at={Sephora.debug.dataAt('sku_item_price_wholesale')}
                                >
                                    {' ' + currentSku.wholeSalePrice}
                                </span>
                            )}
                        </div>
                    )}

                    {isShadeFinderResults && colorDesc && !showBasketQuickAdd && (
                        <div
                            css={[styles.color, styles.truncate]}
                            children={colorDesc}
                        />
                    )}

                    {currentSku.moreColors > 0 && showMoreColors && (
                        <div css={styles.color}>
                            {currentSku.moreColors} {currentSku.moreColors > 1 ? moreColors : moreColor}
                        </div>
                    )}

                    {currentSku.showReviews && (
                        <div css={styles.ratingWrap}>
                            <StarRating rating={rating} />

                            <ReviewCount
                                css={styles.reviewCount}
                                productReviewCount={productReviewCount}
                            />
                        </div>
                    )}

                    {showViewSimilarLink && (
                        <div css={styles.similarLinkWrap}>
                            <Link
                                color='blue'
                                fontSize='sm'
                                padding={2}
                                margin={-2}
                                onClick={this.handleViewSimilarProductsClick}
                                style={{
                                    opacity: hover ? 1 : 0
                                }}
                                children={viewSimilarProductsText}
                                data-at={Sephora.debug.dataAt('view_similar_products_link')}
                            />
                        </div>
                    )}
                </div>
                <ProductItemCTA
                    useAddToBasket={currentSku.useAddToBasket}
                    isUseWriteReview={currentSku.isUseWriteReview}
                    imageSize={currentSku.imageSize}
                    isExternallySellable={currentSku.isExternallySellable}
                    styles={styles}
                    isCountryRestricted={isCountryRestricted}
                    closeParentModal={this.props.closeParentModal}
                    isAddButton={this.props.isAddButton}
                    isCleanAtSephora={this.props.isCleanAtSephora}
                    reviewOnClick={this.redirectToAddReviewPage}
                    getText={getText}
                    btnProps={btnProps}
                />

                {Location.isNthCategoryPage() && this.props.basketQuickLookModalShow && (
                    <div css={styles.actionWrap}>
                        <AddToBasketButton
                            {...btnProps}
                            isNthCategoryPage={true}
                            isExperiment={true}
                            isAddButton={true}
                            rootContainerName={currentSku.rootContainerName || this.props.rootName}
                            productStringContainerName={anaConsts.COMPONENT_TITLE.SKUGRID}
                            size='sm'
                            {...(isConstructorContainer && {
                                'data-cnstrc-btn': CTA.ADD_TO_CART
                            })}
                        />
                    </div>
                )}
                {deliveryOptions && (
                    <UpperFunnelProductTiles
                        checkedRefinements={checkedRefinements}
                        pickupEligible={pickupEligible}
                        sameDayEligible={sameDayEligible}
                        shipToHomeEligible={shipToHomeEligible}
                        deliveryOptions={deliveryOptions}
                    />
                )}
            </RootComp>
        );
    }

    hoverOn = () => {
        this.setState({ hover: true });
    };

    hoverOff = () => {
        this.setState({ hover: false });
    };

    evaluateCurrentPage = targetUrl => {
        const productUrl = getLink(targetUrl, this.linkValues);
        const resultURL = `${productUrl}&matchedSkuId=${this.props.skuId}`;

        return this.props.isShadeFinderResults ? resultURL : productUrl;
    };

    onClick = e => {
        const {
            productId,
            rootContainerName,
            analyticsContext,
            containerTitle,
            productStringContainerName,
            toggleMwebQuickLookIsHidden,
            targetUrl,
            position,
            podId,
            isCarousel
        } = this.props;

        anaUtils.saveProductClickAttributes({
            carouselProductIndex: position,
            listType: rootContainerName,
            productId
        });

        const currentSku = Object.assign({}, this.props, { type: SKU_TYPES.STANDARD });
        const showMobileQuickLook = Sephora.isMobile() && locationUtils.isNthCategoryPage() && toggleMwebQuickLookIsHidden === false;

        if (showMobileQuickLook) {
            e.preventDefault();

            quicklookModalUtils.dispatchQuicklook({
                productId,
                skuType: currentSku.type,
                options: { addCurrentSkuToProductChildSkus: true },
                sku: currentSku,
                rootContainerName,
                productStringContainerName,
                origin,
                analyticsContext,
                podId
            });
        }

        const recentEvent = anaUtils.getLastAsyncPageLoadData({
            pageType: analyticsContext
        });

        const isSavingsEventPage = Location.isSavingsEventPage();

        const nextPageData = {
            recInfo: {
                isExternalRec: !!podId,
                componentTitle: rootContainerName ? rootContainerName.replace('\'', '') : isSavingsEventPage ? containerTitle : '',
                podId
            },
            internalCampaign: isSavingsEventPage ? `${containerTitle}:${productId}:product` : null, // eVar75
            ...(isCarousel && { events: [anaConsts.Event.EVENT_269] })
        };

        for (const prop in recentEvent) {
            if (Object.prototype.hasOwnProperty.call(recentEvent, prop) && recentEvent[prop]) {
                nextPageData[prop] = recentEvent[prop];
            }
        }

        anaUtils.setNextPageData(nextPageData);

        if (!this.isNullLink) {
            const urlWithParams = UrlUtils.addInternalTracking(targetUrl, this.linkValues);

            Location.navigateTo(e, urlWithParams);
        }
    };

    onKeyPress = e => {
        switch (e.key) {
            case keyConsts.ENTER:
            case keyConsts.SPACE:
                e.preventDefault();
                e.stopPropagation();
                this.props.onClick(e);

                break;
            default:
                break;
        }
    };

    redirectToAddReviewPage = e => {
        e.preventDefault();
        Authentication.requireAuthentication(true)
            .then(() => {
                UrlUtils.redirectTo(PRODUCT_ADD_REVIEWS_URL + this.props.productId);
            })
            .catch(() => {});
    };

    handleViewSimilarProductsClick = e => {
        e.preventDefault();

        const {
            productId, productName, skuImages, rootContainerName, skuId, brandName, analyticsContext, showSimilarProductsModal
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
}

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        lineHeight: lineHeights.tight,
        textAlign: 'center'
    },
    relative: {
        position: 'relative'
    },
    love: {
        position: 'absolute',
        top: -3,
        right: 0,
        transition: 'opacity .15s'
    },
    flags: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: 'var(--font-weight-bold)',
        fontSize: fontSizes.xs,
        textTransform: 'lowercase',
        height: space[5],
        whiteSpace: 'nowrap'
    },
    price: {
        fontSize: fontSizes.sm,
        fontWeight: 'var(--font-weight-bold)',
        marginTop: space[1]
    },
    priceList: {
        textDecoration: 'line-through'
    },
    priceSale: {
        color: colors.red
    },
    priceValue: {
        fontWeight: 'var(--font-weight-normal)'
    },
    color: {
        color: colors.gray,
        fontSize: fontSizes.xs,
        marginTop: space[2]
    },
    truncate: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
    },
    ratingWrap: {
        display: 'flex',
        justifyContent: 'center',
        lineHeight: 1,
        marginTop: space[2]
    },
    reviewCount: {
        fontSize: fontSizes.sm,
        marginLeft: '.375em',
        position: 'relative',
        top: '.0625em'
    },
    similarLinkWrap: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: space[2]
    },
    actionWrap: {
        paddingTop: space[3],
        paddingBottom: space[1],
        marginTop: 'auto'
    },
    restricted: {
        color: colors.gray,
        fontSize: fontSizes.sm
    },
    number: {
        position: 'absolute',
        top: 0,
        left: 0,
        fontSize: fontSizes.md,
        lineHeight: `${NUMBER_HEIGHT}px`,
        backgroundImage: 'url(/img/ufe/number-bg.svg)',
        backgroundSize: 'cover',
        paddingLeft: '.375em',
        paddingRight: '.75em'
    }
};

export default wrapComponent(ProductItem, 'ProductItem', true);
