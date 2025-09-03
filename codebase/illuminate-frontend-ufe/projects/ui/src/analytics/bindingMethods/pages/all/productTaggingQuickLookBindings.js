import replaceSpecialCharacters from 'utils/replaceSpecialCharacters';

export default (function () {
    //All Pages Binding Methods
    return {
        getInternalCampaign: function (data) {
            return ((data.rootContainerName || 'n/a') + ':' + data.product.productDetails.productId + ':quicklook').toLowerCase();
        },

        getFeatureString: function (product) {
            var featureStrings = [];

            /*
            If a product skuSelectorType is different than None (Image or Text) it will
            do have childSkus (regularChildSkus or onSaleChildSkus)
            */
            if (product.skuSelectorType !== 'None') {
                featureStrings.push('ql:swatch');
            }

            if (product.currentSku && product.currentSku.isOnlyFewLeft) {
                featureStrings.push('ql:only a few left');
            }

            return featureStrings.join(',');
        },

        getLinkData: function (data) {
            let linkData = '';

            if (data.platform) {
                linkData = 'cmnty:' + data.platform + ':product-tag-modal';
            }

            return linkData;
        },

        /**
         * Build the page name for a quicklook s.t call.
         * @param  {object} data Info on the product that was clicked
         * @return {string}      The quick look page name.
         */
        getPageName: function (data) {
            var world = this.getWorld(data.product);
            var productName =
                data.product.currentSku && data.product.currentSku.rewardsInfo
                    ? data.product.currentSku.rewardsInfo.productName
                    : data.product.productDetails.displayName;

            var name = [data.name];
            var nameData;

            nameData = [data.product.productDetails.productId, world, '*pname=' + productName];

            for (const item of nameData) {
                if (item) {
                    name.push(item);
                }
            }

            return replaceSpecialCharacters(name.join(':'));
        },

        getWorld: function (product) {
            var rootCategory = product;
            var world = product.rewardsInfo ? 'bi-rewards' : 'n/a';

            //Drill down until we get to the last parentCategory, this wil be 'world' (e.g. Makup)
            while (rootCategory.parentCategory) {
                world = rootCategory.parentCategory.displayName;
                rootCategory = rootCategory.parentCategory;
            }

            return world;
        }
    };
}());
