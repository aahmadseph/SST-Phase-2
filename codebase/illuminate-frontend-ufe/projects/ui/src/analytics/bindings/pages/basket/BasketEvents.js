/* eslint-disable camelcase */
function basketEvents({
    sku, skuUtils, analyticsData, digitalData, addToCartPixels, fireGABeginCheckout, anaUtils, quantity
}) {
    const isRestrictedForPixel = skuUtils.isGiftCard(sku) || skuUtils.isBiRewardGwpSample(sku);
    let totalAmount = anaUtils.removeCurrencySymbol(sku.salePrice || sku.listPrice);
    totalAmount = anaUtils.convertToUSD(totalAmount);
    const manufacturer = digitalData?.product[0] ? digitalData.product[0].productInfo.manufacturer : '';
    const brand = sku.brandName || manufacturer;

    const googleAnalyticsAddToBasketData = {
        id: sku.skuId,
        name: analyticsData.productName,
        brand: brand || sku?.configurableOptions?.groupedSkuOptions[0]?.groupProduct?.brand?.displayName,
        category: analyticsData.category || '',
        variant: sku.variationValue || '',
        skuType: sku.type,
        quantity: quantity || 1,
        price: totalAmount,
        currency: 'USD'
    };

    // AddToCart PIXELS should not fire for Gift Card, Samples, GWP & Rewards
    if (!isRestrictedForPixel) {
        Sephora.analytics.promises.tagManagementSystemReady.then(() => {
            const lineItems = [];
            lineItems.push({
                product_name: analyticsData.productName,
                product_id: sku.skuId,
                product_price: totalAmount,
                product_quantity: quantity
            });
            const eventData = {
                totalAmount: totalAmount,
                quantity: quantity,
                currency: 'USD',
                lineItems: lineItems
            };
            addToCartPixels.pinterestAddToCartEvent(eventData);

            addToCartPixels.snapChatAddToCartEvent(totalAmount, quantity, 'USD', [sku.skuId]);
        });
    }

    addToCartPixels.googleAnalyticsAddToBasketEvent(googleAnalyticsAddToBasketData);
    fireGABeginCheckout(googleAnalyticsAddToBasketData, 'addItem');

    const facebookAddToBasketData = {
        id: sku.skuId,
        quantity: quantity || 1,
        price: totalAmount,
        currency: 'USD'
    };
    digitalData.cart.isRestrictedForPixel = skuUtils.isBiRewardGwpSample(sku);
    addToCartPixels.facebookAddToBasketEvent(facebookAddToBasketData);
}

export default basketEvents;
