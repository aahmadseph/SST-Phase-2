/**
 * These are the bindings that will take place on the product page when the
 * page load event occurs.
 */

import store from 'store/Store';
import utils from 'analytics/utils';
import basketUtils from 'utils/Basket';
import localeUtils from 'utils/LanguageLocale';
import bindingMethods from 'analytics/bindingMethods/pages/productPage/productPageBindings';
import generalBindingMethods from 'analytics/bindingMethods/pages/all/generalBindings';
import anaConsts from 'analytics/constants';

export default (function () {
    const pageLoadBindings = function () {
        const totalBasketCount = basketUtils.getTotalBasketCount();
        const primaryProduct = digitalData.product[0];

        /* Prerequisites *
         ** These need to be set first because some bindings depend on them. */

        if (primaryProduct) {
            const product = store.getState().page.product;
            const { currentSku, productDetails } = product;
            //product:[PID]:[WORLD]:*
            digitalData.page.pageInfo.pageName = primaryProduct.productInfo.productID;
            digitalData.page.attributes.world = primaryProduct.attributes.world;
            digitalData.page.attributes.brand = primaryProduct.productInfo.manufacturer;
            digitalData.page.attributes.sephoraPageInfo.pageName = generalBindingMethods.getSephoraPageName();
            digitalData.page.attributes.isOutOfStock = primaryProduct.attributes.isOutOfStock;
            digitalData.page.attributes.totalBasketCount = totalBasketCount;

            //Page :: Event Strings
            digitalData.page.attributes.eventStrings = bindingMethods.getPageEvents();

            //Product String :: On-load
            digitalData.page.attributes.productStrings = bindingMethods.getProductStrings(primaryProduct, currentSku);

            //Prop44
            if (primaryProduct.attributes.isOutOfStock) {
                digitalData.page.attributes.outOfStock = anaConsts.Event.YES_STANDARD;
            }

            //Prop32
            digitalData.page.attributes.productReviews = productDetails?.reviews || 'none';
        }

        //evar6 if not entry page set as pageName.
        digitalData.page.attributes.sephoraPageInfo.productFindingMethod = bindingMethods.getProductFindingValue();
        /*
         ** These bindings need to take place after the above bindings because they
         ** rely on the data set above.
         */
        utils.setNextPageData({
            pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
            pageType: digitalData.page.category.pageType
        });

        const breadcrumbsDisplayNames = (digitalData.page.pageInfo.breadcrumbs || []).map(item => item.displayName);
        let productPageViewData = bindingMethods.buildBreadCrumbsForBraze(breadcrumbsDisplayNames);

        if (primaryProduct) {
            productPageViewData = {
                ...productPageViewData,
                brandName: digitalData.page.attributes.brand,
                skuId: primaryProduct.attributes.skuId,
                quantity: 1,
                country: localeUtils.getCurrentCountry(),
                productName: primaryProduct.productInfo.productName
            };
        }

        if (Sephora.configurationSettings?.enableSOTEventsPhase1 === true) {
            Sephora.analytics.promises.brazeIsReady
                .then(() => {
                    global.braze && braze.logCustomEvent('productPageView', productPageViewData);
                })
                .catch(error => Sephora.logger.error('Braze SDK error:', error));
        }
    };

    return pageLoadBindings;
}());
