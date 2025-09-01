import quicklookModalUtils from 'utils/Quicklook';
import skuUtils from 'utils/Sku';
import analiticsConstant from 'analytics/constants';
const {
    COMPONENT_TITLE: { PRODUCTS_GRID, SKUGRID }
} = analiticsConstant;

export const handleQuicklookClick = (e, product, products) => {
    const sku = product?.currentSku || product;
    const clickTrackerId = product?.click_id || '';
    const impressionTrackerId = product?.impression_id || '';
    const impressionPayload = product?.impression_payload || '';
    const clickPayload = product?.click_payload || '';

    e.preventDefault();
    e.stopPropagation();

    const quickLookConfig = {
        productId: product?.productId,
        skuType: skuUtils.skuTypes.STANDARD,
        options: { addCurrentSkuToProductChildSkus: true },
        sku: sku,
        rootContainerName: PRODUCTS_GRID,
        productStringContainerName: SKUGRID,
        categoryProducts: products,
        clickTrackerId,
        impressionTrackerId,
        impressionPayload,
        clickPayload
    };

    // Dispatch the quicklook modal with the provided config
    quicklookModalUtils.dispatchQuicklook(quickLookConfig);
};
