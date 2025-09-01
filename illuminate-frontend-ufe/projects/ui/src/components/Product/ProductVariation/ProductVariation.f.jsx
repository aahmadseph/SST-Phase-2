import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { fontSizes, lineHeights } from 'style/config';
import { Text } from 'components/ui';
import skuUtils from 'utils/Sku';
import languageLocale from 'utils/LanguageLocale';
import basketUtils from 'utils/Basket';

const getText = languageLocale.getLocaleResourceFile('components/Product/ProductVariation/locales', 'ProductVariation');

function getOnlyFewLeftLabel(sku) {
    const isDCBasket = basketUtils.isDCBasket();

    if (Sephora.isMobile()) {
        return null;
    }

    return !isDCBasket && sku.isOnlyFewLeft ? (
        <Text
            fontSize='sm'
            display='inline'
            fontWeight='bold'
            marginRight={1}
        >
            {getText('onlyAFewLeft')}
        </Text>
    ) : null;
}

function ProductVariation(props) {
    const {
        product, sku, hasMinHeight, fontSize, lineHeight, ...restProps
    } = props;
    const getVariationTypeDisplayName =
        product && product.variationTypeDisplayName ? product.variationTypeDisplayName : sku && sku.variationTypeDisplayName;

    return (product?.variationType !== skuUtils.skuVariationType.NONE || sku?.variationType !== skuUtils.skuVariationType.NONE) &&
        sku?.variationValue ? (
            <Text
                {...restProps}
                fontSize={fontSize}
                lineHeight={lineHeight}
                minHeight={hasMinHeight && lineHeights[lineHeight] * fontSizes[fontSize] * 2}
                data-at={Sephora.debug.dataAt('item_variation_type')}
            >
                {getOnlyFewLeftLabel(sku)}
                {getVariationTypeDisplayName && !skuUtils.isFragrance(product, sku) && `${getVariationTypeDisplayName}: `}
                {sku.variationValue}
                {sku.variationDesc && ` - ${sku.variationDesc}`}
            </Text>
        ) : (
            getOnlyFewLeftLabel(sku)
        );
}

ProductVariation.defaultProps = {
    display: 'block',
    fontSize: 'base',
    lineHeight: 'tight'
};

export default wrapFunctionalComponent(ProductVariation, 'ProductVariation');
