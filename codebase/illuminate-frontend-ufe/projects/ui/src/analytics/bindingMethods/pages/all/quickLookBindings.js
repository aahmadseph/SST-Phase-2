import testTargetUtils from 'utils/TestTarget';
import skuUtils from 'utils/Sku';
import constants from 'analytics/constants';
import productPageBindings from 'analytics/bindingMethods/pages/productPage/productPageBindings';
import replaceSpecialCharacters from 'utils/replaceSpecialCharacters';
import marketingFlagsUtil from 'utils/MarketingFlags';
import locationUtils from 'utils/Location';
import anaUtils from 'analytics/utils';

export default (function () {
    //All Pages Binding Methods
    return {
        getQLInternalCampaign: function (data) {
            const result = ((data.rootContainerName || 'n/a') + ':' + data.product.productDetails.productId + ':quicklook').toLowerCase();
            const pageSourceName = anaUtils.getCustomPageSourceName();

            if (pageSourceName) {
                return `${pageSourceName}:${result}`;
            }

            return result;
        },

        getQuickLookFeatureString: function (product) {
            var featureStrings = [];

            /*
             If a product skuSelectorType is different than None (Image or Text) it will
             do have childSkus (regularChildSkus or onSaleChildSkus)
             */
            if (product.currentSku && product.currentSku.isOnlyFewLeft) {
                featureStrings.push('ql:only a few left');
            }

            if (product.skuSelectorType !== 'None') {
                featureStrings.push('ql:swatch');
            }

            return featureStrings.join(',');
        },

        /**
         * Build the page name for a quicklook s.t call.
         * @param  {object} data Info on the product that was clicked
         * @return {string}      The quick look page name.
         */
        getQuickLookPageName: function (data) {
            const { product, sku } = data;
            const { productDetails = {} } = product;

            const isSample = skuUtils.isSample(product.currentSku);
            const sampleName = productDetails?.brand?.displayName || sku.variationValue;

            const world = this.getQuickLookWorld(data);
            const productName = product?.currentSku?.rewardsInfo
                ? product.currentSku.rewardsInfo.productName
                : isSample
                    ? sampleName
                    : productDetails.displayName;

            const name = [constants.PAGE_TYPES.QUICK_LOOK];
            const nameData = [data.product.productDetails.productId, world, '*pname=' + productName.trim()];

            for (const item of nameData) {
                if (item) {
                    name.push(item);
                }
            }

            return replaceSpecialCharacters(name.join(':'));
        },

        /*
         * Builds and returns the data that we want to know about this product
         * @param  {Object} currentProduct The product object to get data from
         * @return  {String} The analytics data for the product
         * Format: ;SKUID;;;;eVar26=SKUID|eVar37=[USE CASE#]|
         *         eVar52=Rec_PrevPgType_CarouselName_AudienceID_ExperienceID
         */
        buildProductString: function (data, podId) {
            const product = data.product || data;
            const podName = data.podId || podId;

            const digitalDataProductList = digitalData.product;

            testTargetUtils.updateDigitalProductObject(product, digitalDataProductList.length > 0);

            const previousPageType = data.previousPageType || digitalData.page.category.pageType;
            const customizableSets = productPageBindings.getCustomizableSetsKey(product);

            const productString = [
                ';' + (data.sku ? data.sku.skuId : data.currentSku.skuId) + ';;;;eVar26=' + (data.sku ? data.sku.skuId : data.currentSku.skuId)
            ];

            const buildeVar52 = productStringContainerName => {
                const recType = podName ? 'constructor' : 'sephora';

                return `${recType}_${previousPageType}_${productStringContainerName}_${podName || 'n/a'}`;
            };

            productString.push('eVar37=' + customizableSets);
            productString.push('eVar52=' + buildeVar52(data.productStringContainerName));

            if (locationUtils.isRewardsPage() || locationUtils.isBIRBPage()) {
                if (data.sku || data.currentSku) {
                    const marketingFlagsString = marketingFlagsUtil.getProductTileFlags(data.sku || data.currentSku).join(' ');

                    if (marketingFlagsString) {
                        productString.push('eVar134=' + marketingFlagsString);
                    }
                }
            }

            return productString.join('|').toLowerCase();
        },

        getQuickLookWorld: function (data) {
            let rootCategory = data.product || data;
            let world;

            if (data.rewardsInfo) {
                world = 'bi-rewards';
            } else if (data.world) {
                world = data.world;
            } else if (data.sku && data.sku.topCategory) {
                world = data.sku.topCategory;
            } else if (rootCategory.parentCategory) {
                while (rootCategory.parentCategory) {
                    world = rootCategory.parentCategory.displayName;
                    rootCategory = rootCategory.parentCategory;
                }
            } else {
                world = 'n/a';
            }

            return world.toLowerCase();
        }
    };
}());
