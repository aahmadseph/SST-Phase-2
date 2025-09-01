import AddToBasketButton from 'components/AddToBasketButton';
import BaseClass from 'components/BaseClass';
import Flag from 'components/Flag/Flag';
import ProductImage from 'components/Product/ProductImage';
import ProductLove from 'components/Product/ProductLove';
import ProductLoveToggle from 'components/Product/ProductLove/ProductLoveToggle/ProductLoveToggle';
import ReviewCount from 'components/Product/ReviewCount';
import StarRating from 'components/StarRating/StarRating';
import { Box, Text } from 'components/ui';
import PropTypes from 'prop-types';
import React from 'react';
import {
    buttons, colors, fontSizes, mediaQueries, radii, space
} from 'style/config';
import basketUtils from 'utils/Basket';
import Location from 'utils/Location';
import uiUtils from 'utils/UI';
import { wrapComponent } from 'utils/framework';
import anaConsts from 'analytics/constants';

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

function ProductCardLoveButton({
    showLovesButton, isSkeleton, sku, productId, imageProps
}) {
    return (
        showLovesButton &&
        !isSkeleton && (
            <div css={styles.love}>
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
                    />
                </ProductLove>
            </div>
        )
    );
}

function ProductCardReview({ isSkeleton, sku, showRating }) {
    return (
        showRating && (
            <div css={styles.ratingWrap}>
                {isSkeleton ? (
                    <div css={[styles.skeleton.rating, SKELETON_ANIMATION]} />
                ) : (
                    <>
                        <StarRating rating={sku.primaryProduct.rating} />
                        <ReviewCount
                            data-at={Sephora.debug.dataAt('review_count')}
                            css={styles.reviewCount}
                            productReviewCount={sku.primaryProduct.reviews || sku.productReviewCount || sku.reviewsCount}
                        />
                    </>
                )}
            </div>
        )
    );
}

function ProductCardMarketingFlags({ showMarketingFlags, isSkeleton, onlyAFewLeft }) {
    return (
        showMarketingFlags &&
        !isSkeleton && (
            <div css={styles.flags}>
                <Flag
                    children={onlyAFewLeft}
                    css={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                    marginRight={space[6]}
                    backgroundColor={colors.red}
                />
            </div>
        )
    );
}

class FavouriteProductCard extends BaseClass {
    ref = React.createRef();

    render() {
        const {
            isSkeleton, sku, showAddButton, showMarketingFlags, showLovesButton, showRating, isHorizontal, imageSize, outline, localization
        } =
            this.props;

        const { onlyAFewLeft } = localization;

        if (!isSkeleton && !sku) {
            return null;
        }

        const { targetUrl, productId, listPrice } = sku;

        const outlineStyle = outlineStyles[outline];

        const imageProps = sku
            ? {
                id: sku.skuId,
                badge: sku.badge,
                altText: sku.badgeAltText,
                size: imageSize,
                skuImages: sku.skuImages
            }
            : {};

        const sizeAriaLabel = sku.size ? `Size: ${sku.size}` : '';
        const colorAriaLabel = sku.variationType === 'Color' ? `Color: ${sku.variationValue}` : '';
        const ariaLabel = `${sku.brandName} ${sku.productName} ${sizeAriaLabel} ${colorAriaLabel} ${sku.valuePrice}`;

        return (
            <Box
                ref={this.ref}
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
                onClick={e => {
                    e.preventDefault();
                    Location.navigateTo(e, targetUrl);
                }}
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
                        </>
                    )}
                </Box>

                <div css={[styles.infoWrap, isHorizontal ? styles.infoWrapHorizontal : styles.infoWrapVertical]}>
                    <div css={[styles.nameWrap, showAddButton && styles.nameAndVariationWrap]}>
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
                            fontSize={['sm', 'base']}
                            numberOfLines={2}
                            data-at={Sephora.debug.dataAt('product_name_label')}
                            css={isSkeleton && [styles.skeleton.text, SKELETON_ANIMATION]}
                            dangerouslySetInnerHTML={{
                                __html: isSkeleton ? '&nbsp;' : sku.productName
                            }}
                        />
                        <Text
                            display='block'
                            color='gray'
                            marginTop='.25em'
                            fontSize={['sm', 'base']}
                            numberOfLines={1}
                            children={this.props.variationString || [sku.variationValue, sku.variationDesc && ` - ${sku.variationDesc}`]}
                        />

                        <ProductCardMarketingFlags
                            {...{
                                showMarketingFlags,
                                isSkeleton,
                                onlyAFewLeft
                            }}
                        />

                        <ProductCardReview
                            {...{
                                isSkeleton,
                                sku,
                                showRating
                            }}
                        />
                    </div>

                    <div css={styles.atbWrap}>
                        <>
                            <AddToBasketButton
                                sku={sku}
                                variant={ADD_BUTTON_TYPE.SECONDARY}
                                size='sm'
                                analyticsContext={anaConsts.PAGE_NAMES.MY_LISTS}
                            />

                            <ProductCardLoveButton
                                {...{
                                    showLovesButton,
                                    isSkeleton,
                                    sku,
                                    productId,
                                    imageProps
                                }}
                            />
                        </>
                    </div>
                </div>
                <Text
                    fontSize={'sm'}
                    fontWeight='bold'
                >
                    {listPrice}
                </Text>
            </Box>
        );
    }
}

const styles = {
    root: {
        '.no-touch &': {
            transition: 'transform .2s',
            '&:hover': {
                transform: `translateY(-${space[1]}px)`
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
        marginTop: space[1],
        fontSize: fontSizes.sm
    },
    atbWrap: {
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

FavouriteProductCard.propTypes = {
    sku: PropTypes.object,
    imageSize: PropTypes.oneOfType([PropTypes.number, PropTypes.array]).isRequired,
    showRating: PropTypes.bool,
    showPrice: PropTypes.bool,
    showMarketingFlags: PropTypes.bool,
    showAddButton: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    showLovesButton: PropTypes.bool,
    isSkeleton: PropTypes.bool,
    rootContainerName: PropTypes.string,
    isHorizontal: PropTypes.bool,
    outline: PropTypes.oneOf(['default', 'none'])
};

FavouriteProductCard.defaultProps = {
    showRating: true,
    showPrice: true,
    showMarketingFlags: true,
    showAddButton: false,
    showLovesButton: false,
    isSkeleton: false,
    outline: 'default'
};

export default wrapComponent(FavouriteProductCard, 'FavouriteProductCard', true);
