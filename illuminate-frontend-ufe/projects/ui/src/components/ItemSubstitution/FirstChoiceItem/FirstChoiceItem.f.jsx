import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import ProductCard from 'components/Product/ProductCard';
import skuUtils from 'utils/Sku';
import localeUtils from 'utils/LanguageLocale';
import MediaUtils from 'utils/Media';

const { Media } = MediaUtils;

const getText = localeUtils.getLocaleResourceFile('components/ItemSubstitution/FirstChoiceItem/locales', 'FirstChoiceItem');

function FirstChoiceItem(props) {
    const sizeVariation = props.item.sku.size ? `${getText('size')} ${props.item.sku.size}` : '';
    const colorVariation =
        props.item.sku.variationType === skuUtils.skuVariationType.COLOR ? `${getText('color')}: ${props.item.sku.variationValue}` : '';
    const variationString = `${sizeVariation}${sizeVariation && colorVariation ? ' • ' : ''}${colorVariation}`;
    const finalSale = !props.item.sku.isReturnable && getText('finalSale');
    const ProductCardComponent = React.memo(({ isHorizontal, ...rest }) => {
        return (
            <ProductCard
                sku={rest.item.sku}
                showAddButton={false}
                imageSize={isHorizontal ? 74 : 160}
                variationString={variationString}
                hasVariationValue={!!rest.item.sku.variationValue}
                hideQuicklook={true}
                ignoreTargetUrlForBox={true}
                isHorizontal={isHorizontal}
                showVerticlePrice={true}
                finalSale={finalSale}
                outline='none'
            />
        );
    });

    return (
        <div>
            <Media lessThan='md'>
                <ProductCardComponent
                    {...props}
                    isHorizontal={true}
                />
            </Media>
            <Media greaterThan='sm'>
                <ProductCardComponent
                    {...props}
                    isHorizontal={false}
                />
            </Media>
        </div>
    );
}

export default wrapFunctionalComponent(FirstChoiceItem, 'FirstChoiceItem');
