module.exports = (function () {
    const Events = require('utils/framework/Events').default;
    const snbApi = require('services/api/search-n-browse').default;
    const Actions = require('actions/Actions').default;
    const store = require('store/Store').default;
    const skuUtils = require('utils/Sku').default;
    const skuType = skuUtils.skuTypes.STANDARD;
    const { ASYNC_PAGE_LOAD, LINK_TRACKING_EVENT, PRODUCT_TAGGING_PLATFORMS } = require('analytics/constants').default;
    const { process } = require('analytics/processEvent').default;
    const { Event } = require('analytics/constants').default;

    function fireQuickLookLinkTracking(skuId, platform) {
        const data = {
            linkName: 'D=c55',
            eventStrings: [Event.EVENT_160],
            productStrings: `;${skuId}`,
            actionInfo: 'cmnty:' + platform + ':product-tag-link-click'
        };

        if (platform === PRODUCT_TAGGING_PLATFORMS.GALLERY) {
            process(LINK_TRACKING_EVENT, { data });
        }
    }

    function fireQuickLookAsyncLoadTracking(product, platform) {
        const data = {
            product,
            bindingMethods: [require('analytics/bindings/pages/all/productTaggingQuickLookLoad')],
            sku: product.currentSku,
            name: 'product tag',
            type: 'cmnty',
            event: Event.EVENT_161,
            platform: platform
        };

        process(ASYNC_PAGE_LOAD, { data });
    }

    function dispatchQuickLook(type, productData, skuId, platform) {
        // Hide QuickLook Modal if already Open
        store.dispatch(Actions.showQuickLookModal({ isOpen: false }));
        // Show QuickLook Modal
        store.dispatch(Actions.updateQuickLookContent(productData, skuId));
        store.dispatch(
            Actions.showQuickLookModal({
                isOpen: true,
                skuType: type,
                sku: productData.currentSku,
                error: null,
                platform: platform
            })
        );

        // eslint-disable-next-line no-param-reassign
        skuId = skuId || productData.currentSku.skuId;

        fireQuickLookLinkTracking(skuId, platform);
        fireQuickLookAsyncLoadTracking(productData, platform);
    }

    function dispatchErrorQuickLook(type, errorData, platform) {
        store.dispatch(Actions.showQuickLookModal({ isOpen: false }));
        store.dispatch(Actions.updateQuickLookContent());
        store.dispatch(
            Actions.showQuickLookModal({
                isOpen: true,
                skuType: type,
                sku: null,
                error: errorData,
                platform: platform
            })
        );
    }

    /**
     * Listener that catches event trigger from thirdParty for QuickLookModal
     */
    window.addEventListener(Events.ShowQuickLookModal, requestData => {
        const { skuId, productId, platform } = requestData.detail.product;

        const options = { addCurrentSkuToProductChildSkus: true };

        if (productId) {
            snbApi
                .getProductDetails(productId, skuId, options)
                .then(data => {
                    // Show QuickLook Modal
                    dispatchQuickLook(skuType, data, skuId, platform);
                })
                .catch(errorData => dispatchErrorQuickLook(skuType, errorData, platform));
        } else if (skuId) {
            // Fetch Product Details from API
            snbApi
                .getSkuDetails(skuId)
                .then(skuData => {
                    snbApi.getProductDetails(skuData.primaryProduct.productId, skuId, options).then(productData => {
                        // Show QuickLook Modal
                        dispatchQuickLook(skuType, productData, skuId, platform);
                    });
                })
                .catch(errorData => dispatchErrorQuickLook(skuType, errorData, platform));
        } else {
            // @ToDo: Error Handling
        }
    });
}());
