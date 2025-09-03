import { compose } from 'redux';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import * as CatalogConstants from 'utils/CatalogConstants';
import channelSelector from 'selectors/page/templateInformation/channelSelector';
import { firstLevelCategorySelector } from 'viewModel/selectors/page/nthCategory/firstLevelCategorySelector';
import googleAdsConstants from 'constants/googleAds';
import historyLocationSelector from 'selectors/historyLocation/historyLocationSelector';
import NthBrandSelector from 'selectors/page/nthBrand/nthBrandSelector';
import { nthCategorySelector } from 'selectors/page/nthCategory/nthCategorySelector';
import PageTemplateType from 'constants/PageTemplateType';
import { productCategoriesArraySelector } from 'viewModel/selectors/page/product/productCategoriesArraySelector';
import { productSelector } from 'selectors/page/product/productSelector';
import { secondLevelCategorySelector } from 'viewModel/selectors/page/nthCategory/secondLevelCategorySelector';
import templateSelector from 'selectors/page/templateInformation/templateSelector';
import { thirdLevelCategorySelector } from 'viewModel/selectors/page/nthCategory/thirdLevelCategorySelector';
import withAfterSpaRendering from 'hocs/withAfterSpaRendering';

const { wrapHOC } = FrameworkUtils;
const { nthBrandSelector } = NthBrandSelector;

const googleAdsPageTypeSelector = createSelector(historyLocationSelector, ({ path: initialPath }) => {
    const path = initialPath.replace(/^\/ca\/(fr|en)/, '');

    if (path === '/' || !path) {
        return googleAdsConstants.PAGE_TYPES.HOME;
    }

    if (/\/shop\/.*/.test(path)) {
        return googleAdsConstants.PAGE_TYPES.SHOP;
    }

    if (/\/brand\/.*/.test(path)) {
        return googleAdsConstants.PAGE_TYPES.BRAND;
    }

    if (/\/brands-list.*/.test(path)) {
        return googleAdsConstants.PAGE_TYPES.BRANDS_LIST;
    }

    if (/\/search\/?.*/.test(path)) {
        return googleAdsConstants.PAGE_TYPES.SEARCH;
    }

    if (/\/product\/.*/.test(path)) {
        return googleAdsConstants.PAGE_TYPES.PRODUCT;
    }

    if (/\/happening\/.*/.test(path)) {
        return googleAdsConstants.PAGE_TYPES.HAPPENING;
    }

    if (/\/beauty\/.*/.test(path)) {
        return googleAdsConstants.PAGE_TYPES.BEAUTY;
    }

    if (/\/sale$/.test(path)) {
        return googleAdsConstants.PAGE_TYPES.SALE;
    }

    return null;
});

const googleAdsUnitPathSelector = createSelector(googleAdsPageTypeSelector, pageType => googleAdsConstants.AD_SLOTS_UNIT_PATHS[pageType]);

const googleAdsBlockIdBaseSelector = createSelector(googleAdsPageTypeSelector, pageType => googleAdsConstants.AD_BLOCK_ID_BASES[pageType]);

const googleAdsPtTargetingSelector = createSelector(googleAdsPageTypeSelector, pageType => googleAdsConstants.PAGE_TYPE_TARGETING[pageType]);

const isTopCategoryPageSelector = createSelector(
    nthCategorySelector,
    nthCategoryPage =>
        nthCategoryPage.pageType === CatalogConstants.PAGE_TYPES.TOP_CATEGORY ||
        nthCategoryPage.pageType === CatalogConstants.PAGE_TYPES.CATEGORY_PAGE
);

const googleAdsCt1TargetingSelector = createSelector(
    templateSelector,
    firstLevelCategorySelector,
    productCategoriesArraySelector,
    (template, firstLevelCat, productCategoryArray) => {
        if (template === PageTemplateType.ProductPage) {
            return productCategoryArray[0];
        }

        return firstLevelCat?.displayName;
    }
);

const googleAdsCt2TargetingSelector = createSelector(
    templateSelector,
    secondLevelCategorySelector,
    productCategoriesArraySelector,
    isTopCategoryPageSelector,
    (template, secondLevelCat, productCategoryArray, isTopCategoryPage) => {
        if (template === PageTemplateType.ProductPage) {
            return productCategoryArray[1];
        } else if (!isTopCategoryPage) {
            return secondLevelCat?.displayName;
        }

        return undefined;
    }
);

const googleAdsCt3TargetingSelector = createSelector(
    templateSelector,
    thirdLevelCategorySelector,
    productCategoriesArraySelector,
    isTopCategoryPageSelector,
    (template, thirdLevelCat, productCategoryArray, isTopCategoryPage) => {
        if (template === PageTemplateType.ProductPage) {
            return productCategoryArray[2];
        } else if (!isTopCategoryPage) {
            return thirdLevelCat?.displayName;
        }

        return undefined;
    }
);

const googleAdsBrTargetingSelector = createSelector(templateSelector, productSelector, nthBrandSelector, (template, productPage, nthBrandPage) => {
    if (template === PageTemplateType.ProductPage) {
        return productPage.productDetails?.brand?.displayName;
    } else if (template === PageTemplateType.BrandNthCategory) {
        return nthBrandPage.displayName;
    }

    return undefined;
});

const withGoogleAdsInfo = wrapHOC(
    connect(
        createStructuredSelector({
            historyLocation: historyLocationSelector,
            adUnitPath: googleAdsUnitPathSelector,
            adBlockIdBase: googleAdsBlockIdBaseSelector,
            adPtTargeting: googleAdsPtTargetingSelector,
            adCt1Targeting: googleAdsCt1TargetingSelector,
            adCt2Targeting: googleAdsCt2TargetingSelector,
            adCt3Targeting: googleAdsCt3TargetingSelector,
            adBrTargeting: googleAdsBrTargetingSelector,
            templateChannel: channelSelector
        })
    )
);

export default compose(withGoogleAdsInfo, withAfterSpaRendering);
