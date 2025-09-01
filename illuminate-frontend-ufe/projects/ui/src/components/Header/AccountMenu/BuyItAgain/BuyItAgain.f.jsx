import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    colors, fontSizes, space, fontWeights, lineHeights
} from 'style/config';
import {
    Box, Link, Text, Grid
} from 'components/ui';

import basketUtils from 'utils/Basket';
import AddToBasketButton from 'components/AddToBasketButton';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import Price from 'components/Product/Price/Price';
import ProductCardCarousel from 'components/ProductPage/ProductCardCarousel/ProductCardCarousel';

const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = basketUtils;
const MAX_ITEMS_TO_DISPLAY = 6;

function BuyItAgain({ purchaseHistory, localization, isSmallView, onDismiss }) {
    const items = purchaseHistory?.items?.slice(0, MAX_ITEMS_TO_DISPLAY) || [];
    const showViewAll = purchaseHistory?.items?.length > MAX_ITEMS_TO_DISPLAY;

    if (!items.length) {
        return null;
    }

    if (isSmallView) {
        const skus = items.map(item => item.sku);

        return (
            <ProductCardCarousel
                onClick={onDismiss}
                carouselContextId='buyItAgainAcoountMenu_Carousel'
                showAddToBasket
                isHorizontal
                isAccountMenuBuyItAgain={true}
                skus={skus}
            />
        );
    }

    return (
        <Box style={styles.buyItAgain.container}>
            <Box style={styles.buyItAgain.header}>
                <Text style={styles.buyItAgain.headingText}>
                    {localization.purchasesHeading}
                </Text>
                {showViewAll && (
                    <Link color={colors.blue} href='/purchase-history'>
                        {localization.purchasesViewAll}
                    </Link>
                )}
            </Box>

            {items.map(item => (
                <Link
                    display='block'
                    key={`menuPurchaseItem_${item.sku.skuId}`}
                    href={item.sku.targetUrl || '#'}
                    style={styles.buyItAgain.linkItem}
                    hoverSelector='.Link-target'
                    data-at={Sephora.debug.dataAt('loves_item')}
                >
                    <Grid columns='auto 1fr auto' alignItems='flex-start' gap={2}>
                        <ProductImage
                            id={item.sku.skuId}
                            skuImages={item.sku.skuImages}
                            size={60}
                            disableLazyLoad
                        />
                        <Box fontSize='xs'>
                            <Text is='p' fontWeight='bold' numberOfLines={1}>
                                {item.sku.brandName}
                            </Text>
                            <Text is='p'>{item.sku.productName}</Text>
                            <ProductVariation
                                sku={item.sku}
                                color={colors.gray}
                                fontSize='sm'
                                marginTop='.25em'
                                css={styles.skuDescription}
                            />
                            <AddToBasketButton
                                sku={item.sku}
                                variant={ADD_BUTTON_TYPE.SECONDARY}
                                size='sm'
                                isInlineLoves
                                isAddButton
                                customStyle={styles.addButtonStyle}
                            />
                        </Box>
                        <Price
                            style={styles.buyItAgain.price}
                            includeValue
                            sku={item.sku}
                            marginBottom='12px'
                        />
                    </Grid>
                </Link>
            ))}
        </Box>
    );
}

BuyItAgain.propTypes = {
    purchaseHistory: PropTypes.object.isRequired,
    localization: PropTypes.object.isRequired,
    isSmallView: PropTypes.bool,
    onDismiss: PropTypes.func
};

const styles = {
    skuDescription: {
        display: '-webkit-box',
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: '2'
    },
    addButtonStyle: {
        marginTop: space[3]
    },
    buyItAgain: {
        container: {
            maxWidth: 315,
            padding: `${space[2]}px ${space[5]}px`
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: space[6]
        },
        headingText: {
            fontWeight: fontWeights.bold,
            fontSize: fontSizes.md,
            lineHeight: lineHeights.tight
        },
        linkItem: {
            marginBottom: space[5]
        },
        price: {
            display: 'flex',
            flexDirection: 'column-reverse'
        }
    }
};

export default wrapFunctionalComponent(BuyItAgain, 'BuyItAgain');
