import helperUtils from 'utils/Helpers';

const { getProp } = helperUtils;

function getImageAltText(sku, type) {
    const {
        brandName = '',
        heroImageAltText = '',
        badgeAltText = '',
        primaryProduct = {},
        imageAltText = '',
        productName = '',
        size = '',
        variationValue = '',
        variationType = ''
    } = sku;

    const isRewardOrSample = type === 'sample' || type === 'reward';
    let altText = '';

    if (imageAltText.length > 0 && !isRewardOrSample) {
        altText = `${imageAltText}`;
    } else {
        altText = `${brandName} ${productName}`;
    }

    if (variationType === 'Color') {
        altText = `${altText} ${variationValue}`;
    }

    if (size.length > 0) {
        altText = `${altText} ${size}`;
    }

    if (heroImageAltText || primaryProduct.heroImageAltText) {
        altText = `${altText} ${heroImageAltText ? heroImageAltText : primaryProduct.heroImageAltText}`;
    }

    return `${altText} ${badgeAltText}`.replace(/\s+/g, ' ').trim();
}

function supplementAltTextWithProduct(currentSku = {}, product = {}, skutype) {
    const sku = { ...currentSku };

    sku.imageAltText = sku.imageAltText || product?.productDetails?.imageAltText;
    sku.heroImageAltText = sku.heroImageAltText || product?.productDetails?.heroImageAltText;

    sku.productName = sku.productName || product?.productDetails?.displayName;
    sku.brandName = sku.brandName || getProp(product.productDetails, 'brand.displayName');

    sku.variationType = sku.variationType || getProp(product, 'currentSku.variationType');
    sku.variationValue = sku.variationValue || getProp(product, 'currentSku.variationValue');
    sku.size = sku.size || getProp(product, 'currentSku.size');

    return getImageAltText(sku, skutype);
}

export {
    getImageAltText, supplementAltTextWithProduct
};
