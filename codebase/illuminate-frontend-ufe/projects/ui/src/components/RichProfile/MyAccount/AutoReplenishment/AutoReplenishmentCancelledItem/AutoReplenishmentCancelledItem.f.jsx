import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';

import { getImageAltText } from 'utils/Accessibility';
import StringUtils from 'utils/String';
import ProductLove from 'components/Product/ProductLove';
import ProductLoveToggle from 'components/Product/ProductLove/ProductLoveToggle';
import {
    space, colors, fontSizes, lineHeights, mediaQueries, fontWeights
} from 'style/config';
import {
    Grid, Box, Text, Button, Divider
} from 'components/ui';
import ProductImage from 'components/Product/ProductImage';
import basketConstants from 'constants/Basket';
const { DELIVERY_OPTIONS } = basketConstants;
const SM_IMG_SIZE = '100%';
const SM_IMG_GAP = space[1];
const sourceParam = DELIVERY_OPTIONS.AUTO_REPLENISH.toLowerCase();

function AutoReplenishmentCancelledItem(props) {
    const {
        localization, displayItemVariation, listPrice, discountRate, subscriptionEndDate, item
    } = props;

    const imageProps = {
        id: item.skuId,
        skuImages: item.skuImages,
        disableLazyLoad: true,
        altText: getImageAltText(item)
    };

    return (
        <Box
            css={styles.itemContainer}
            key={item.skuId}
        >
            <Divider marginY={0} />
            <Grid
                gap={[`${SM_IMG_GAP}px`, 4]}
                css={styles.gridContainer}
            >
                <Box>
                    <ProductImage
                        id={item.skuId}
                        size={[SM_IMG_SIZE, 97]}
                        skuImages={item.skuImages}
                        disableLazyLoad={true}
                        altText={getImageAltText(item)}
                    />
                </Box>

                <Box>
                    <Text
                        is='p'
                        css={styles.title}
                        children={item.brandName}
                    />
                    <Text
                        is='p'
                        css={styles.subtitle}
                        children={item.productName}
                    />
                    {displayItemVariation && (
                        <Box css={styles.detailsContainer}>
                            <Text
                                is='p'
                                css={styles.detailsText}
                            >
                                {`${item.variationType}: ${item.variationValue}`}
                            </Text>
                        </Box>
                    )}
                    {!!subscriptionEndDate && (
                        <Text
                            is='p'
                            css={styles.cancelDateText}
                        >
                            {StringUtils.format(localization.cancelledOn, subscriptionEndDate)}
                        </Text>
                    )}
                </Box>
                <Box css={styles.priceContainer}>
                    <div>
                        <Text
                            is='del'
                            css={styles.listPrice}
                        >
                            {listPrice}
                        </Text>
                        <Text
                            is='p'
                            css={styles.salePrice}
                        >
                            {item.discountedPrice}
                        </Text>
                        <Text
                            is='p'
                            css={styles.salePrice}
                        >
                            {StringUtils.format(localization.discountRate, discountRate)}
                        </Text>
                    </div>
                </Box>
                <Box css={styles.ctaContainer}>
                    <Button
                        size='sm'
                        variant='secondary'
                        css={styles.secondaryCta}
                        href={`/product/${item.productId}?skuId=${item.skuId}&source=${sourceParam}`}
                    >
                        {localization.viewProductDetails}
                    </Button>
                </Box>
                <Box
                    marginTop={2}
                    css={styles.productLoveContainer}
                >
                    <ProductLove
                        sku={item}
                        loveSource='productPage'
                        productId={item?.productId}
                        imageProps={imageProps}
                    >
                        <ProductLoveToggle
                            productId={item?.productId}
                            size={20}
                            width={30}
                            height={30}
                        />
                    </ProductLove>
                </Box>
            </Grid>
        </Box>
    );
}

const styles = {
    itemContainer: {
        padding: `${space[3]}px ${space[4]}px 0 0`
    },
    heading: {
        display: 'inline-block',
        verticalAlign: 'middle',
        paddingTop: `${space[2]}px`,
        paddingBottom: `${space[3]}px`,
        fontSize: `${fontSizes.md}px`,
        fontWeight: `${fontWeights.bold}`,
        maxWidth: '85%',
        lineHeight: `${lineHeights.tight}em`
    },
    subheading: {
        fontWeight: `${fontWeights.normal}`,
        fontSize: `${fontSizes.sm}px`,
        display: 'block',
        whiteSpace: 'nowrap'
    },
    gridContainer: {
        gridTemplateColumns: `auto min(240px) max(${space[8]}px) 1fr max(${space[6]}px)`,
        padding: `${space[4]}px 0`,
        lineHeight: `${fontSizes.md}px`,
        alignItems: 'start',
        [mediaQueries.smMax]: { gridTemplateColumns: `auto min(177px) max(${space[8]}px)` }
    },
    content: {
        gap: `${space[2]}px`,
        gridTemplateColumns: '1fr auto'
    },
    title: {
        fontSize: `${fontSizes.base}px`,
        fontWeight: `${fontWeights.bold}`,
        marginBottom: `${space[1]}px`
    },
    subtitle: {
        fontSize: `${fontSizes.base}px`,
        marginBottom: `${space[1]}px`,
        lineHeight: `${space[4]}px`
    },
    detailsContainer: {
        color: `${colors.gray}`,
        fontSize: `${fontSizes.sm}px`,
        marginBottom: `${space[1]}px`
    },
    detailsText: {
        display: 'inline-block',
        lineHeight: `${space[4]}px`
    },
    detailsSeparator: {
        margin: '0 .5em'
    },
    priceContainer: {
        textAlign: 'right'
    },
    salePrice: {
        fontWeight: `${fontWeights.bold}`,
        color: `${colors.red}`
    },
    listPrice: {
        color: `${colors.black}`,
        fontWeight: `${fontWeights.bold}`
    },
    cancelDateText: {
        fontSize: `${space[3]}px`,
        lineHeight: 'normal'
    },
    ctaContainer: {
        marginTop: `${space[2]}px`,
        textAlign: 'right',
        [mediaQueries.smMax]: { gridColumn: '2', textAlign: 'left' }
    },
    secondaryCta: {
        borderWidth: '1px',
        fontWeight: `${fontWeights.normal}`
    },
    productLoveContainer: {
        [mediaQueries.smMax]: { textAlign: 'center', paddingLeft: `${space[4]}` }
    }
};

AutoReplenishmentCancelledItem.propTypes = {
    displayItemVariation: PropTypes.bool.isRequired,
    item: PropTypes.object.isRequired,
    listPrice: PropTypes.string.isRequired,
    localization: PropTypes.object.isRequired,
    subscription: PropTypes.object.isRequired
};

export default wrapFunctionalComponent(AutoReplenishmentCancelledItem, 'AutoReplenishmentCancelledItem');
