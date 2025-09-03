/* eslint-disable class-methods-use-this */
import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Box, Grid, Link
} from 'components/ui';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import { colors, screenReaderOnlyStyle } from 'style/config';
import { getImageAltText } from 'utils/Accessibility';
import skuUtils from 'utils/Sku';
import LocaleUtils from 'utils/LanguageLocale';
const getText = LocaleUtils.getLocaleResourceFile('components/ItemSubstitution/SubstituteItem/locales', 'SubstituteItem');

function PriceSizeAndColor({ price, size, color }) {
    return (
        <Text
            is='p'
            fontSize='xs'
            color={colors.gray}
        >
            <Text fontWeight='bold'>{price}</Text>
            {size}
            {color}
        </Text>
    );
}

function SubstituteItem({ item, isBasket, onClickHandler, forceOutOfStockLabel }) {
    // If item is not present, it means that the user has selected "Do not substitute" option or
    // item substitution feature was not enabled during purchase and is not enabled now.
    const emptyItem = !item || Object.keys(item).length === 0;

    // Do not render the component if the item is empty and item substitution is not enabled, since
    // it would render an empty gray box otherwise.
    if (emptyItem && !Sephora.configurationSettings.isItemSubstitutionEnabled) {
        return null;
    }

    const doNotSubstituteLabel = `${getText('substituteOption')} ${getText('doNotSubstitute')}`;

    return (
        <Grid
            marginTop={isBasket ? 2 : 4}
            marginBottom={!isBasket && 1}
            paddingTop={2}
            gap={2}
            columns='auto 1fr auto'
            lineHeight='tight'
            borderRadius={!isBasket && 2}
            backgroundColor='nearWhite'
            paddingBottom={!isBasket && 2}
            paddingX={!isBasket && 3}
        >
            {emptyItem && Sephora.configurationSettings.isItemSubstitutionEnabled ? (
                <>
                    <Text
                        htmlFor='do-not-substitute'
                        css={screenReaderOnlyStyle}
                        children={doNotSubstituteLabel}
                        aria-label={doNotSubstituteLabel}
                    />
                    <Text
                        fontSize='sm'
                        fontWeight='bold'
                        id='do-not-substitute'
                    >
                        {getText('doNotSubstitute')}
                    </Text>
                </>
            ) : (
                !emptyItem && (
                    <SubstituteItemDisplay
                        item={item}
                        isBasket={isBasket}
                        onClickHandler={onClickHandler}
                        forceOutOfStockLabel={forceOutOfStockLabel}
                    />
                )
            )}
        </Grid>
    );
}

function SubstituteItemDisplay({ item, isBasket, forceOutOfStockLabel, onClickHandler }) {
    // If the call for order details comes from order details page itself, skuId is not present in the item object,
    // but there's an extra parameter sku, which contains the skuId.
    const skuId = item.skuId || item.sku?.skuId;

    const brandName = item.brandName || item.sku?.brandName;
    const productName = item.productName || item.sku?.productName;

    const price = item.salePrice || item.listPrice;
    const itemSize = item.size || item.sku?.size;
    const size = itemSize ? `  •  ${getText('size')} ${itemSize}` : '';
    const variationType = item.variationType || item.sku?.variationType;
    const variationValue = item.variationValue || item.sku?.variationValue;
    const color = variationType === skuUtils.skuVariationType.COLOR ? `  •  ${getText('color')}: ${variationValue}` : '';

    const ariaLabel = `${getText('substituteWith')}: ${brandName} ${productName} ${price} ${size} ${color}`;

    let title = '';

    if (!isBasket) {
        if (forceOutOfStockLabel) {
            title = getText('oufOfStock');
        } else {
            title = getText('substituteWith');
        }
    }

    return (
        <>
            <Text
                css={screenReaderOnlyStyle}
                htmlFor='substitute-item-info'
                children={ariaLabel}
                aria-label={ariaLabel}
            />
            <Box
                is='div'
                display='inline'
                position='relative'
            >
                <ProductImage
                    id={skuId}
                    size={36}
                    skuImages={item.skuImages}
                    altText={getImageAltText(item)}
                />
            </Box>
            <Box id='substitute-item-info'>
                <Text
                    fontSize='sm'
                    is='p'
                >
                    {title && <span css={{ fontWeight: 'bold' }}>{title}</span>}
                    {brandName} {productName}
                </Text>
                <PriceSizeAndColor
                    price={price}
                    size={size}
                    color={color}
                />
            </Box>
            {isBasket && (
                <Link
                    fontSize='sm'
                    color={colors.blue}
                    children={getText('edit')}
                    padding={2}
                    margin={-2}
                    onClick={onClickHandler}
                    aria-haspopup='dialog'
                />
            )}
        </>
    );
}

SubstituteItem.propTypes = {
    item: PropTypes.shape({}).isRequired,
    isBasket: PropTypes.bool,
    forceOutOfStockLabel: PropTypes.bool
};

SubstituteItem.defaultProps = {
    item: {},
    isBasket: false,
    forceOutOfStockLabel: false
};

export default wrapFunctionalComponent(SubstituteItem, 'SubstituteItem');
