import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box } from 'components/ui';
import Flag from 'components/Flag/Flag';
import ProductSwatchGroup from 'components/Product/ProductSwatchGroup/ProductSwatchGroup';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import localeUtils from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';
import LocationUtils from 'utils/Location';
import marketingFlagsUtil from 'utils/MarketingFlags';
import { space, fontSizes, colors } from 'style/config';

const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/ChooseOptionsModal/locales', 'ChooseOptionsModal');

class ProductOptions extends BaseClass {
    getBadges = sku => {
        const flags = marketingFlagsUtil.getShadeFilterFlags(sku);

        return flags.length
            ? flags.map(({ text, backgroundColor }, index) => (
                <Flag
                    key={index.toString()}
                    data-at={Sephora.debug.dataAt('product_flag_label')}
                    children={text}
                    width='max-content'
                    backgroundColor={backgroundColor}
                    marginRight={1}
                />
            ))
            : null;
    };

    getSwatches = () => {
        const { product, currentSku, matchSku, updateCurrentSku } = this.props;

        return product?.currentSku != null &&
            product.skuSelectorType !== skuUtils.skuSwatchType.NONE &&
            (product.regularChildSkus !== undefined || product.onSaleChildSkus !== undefined) ? (
                <ProductSwatchGroup
                    showOnSaleOnly={LocationUtils.isSalePage() && product.onSaleChildSkus && product.onSaleChildSkus.length}
                    product={product}
                    currentSku={currentSku}
                    updateCurrentSku={updateCurrentSku}
                    matchSku={matchSku ? currentSku : null}
                />
            ) : null;
    };

    render() {
        const { product, currentSku, isSmallView } = this.props;
        const skuBadges = this.getBadges(currentSku);
        const hasBadges = skuBadges !== null;

        return (
            <>
                <Box style={styles.productInfoContainer}>
                    <ProductVariation
                        style={!isSmallView ? styles.productVariation : undefined}
                        display='inline-block'
                        hasMinHeight={false}
                        {...skuUtils.getProductVariations({
                            parentProductFromProps: product,
                            sku: currentSku
                        })}
                    />

                    <Box style={hasBadges ? styles.productBadges : styles.productBadgesEmpty}>{skuBadges}</Box>

                    <Box
                        marginBottom={3}
                        style={styles.sizeContainer}
                    >
                        {currentSku.size &&
                            currentSku.variationType &&
                            currentSku.variationType !== skuUtils.skuVariationType.SIZE &&
                            getText('size', [currentSku.size])}
                    </Box>
                </Box>

                {this.getSwatches()}
            </>
        );
    }
}

const styles = {
    productVariation: {
        display: 'inline'
    },
    productInfoContainer: {
        minHeight: `${space[8]}px`
    },
    productBadges: {
        display: 'inline',
        fontSize: `${fontSizes.sm}px`,
        padding: '1px',
        borderRadius: `${space[1]}px`,
        marginLeft: `${space[2]}px`,
        color: `${colors.white}`,
        lineHeight: '14px',
        verticalAlign: 'text-top'
    },
    productBadgesEmpty: {
        display: 'inline',
        fontSize: `${fontSizes.sm}px`,
        marginLeft: `${space[2]}px`,
        color: `${colors.white}`,
        lineHeight: '14px'
    },
    sizeContainer: {
        minHeight: '21px'
    }
};

export default wrapComponent(ProductOptions, 'ProductOptions', true);
