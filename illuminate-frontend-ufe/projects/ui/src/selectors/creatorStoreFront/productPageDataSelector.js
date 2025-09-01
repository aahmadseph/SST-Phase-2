import { createSelector } from 'reselect';
import { creatorStoreFrontDataSelector } from 'selectors/creatorStoreFront/creatorStoreFrontDataSelector';
import { textResourcesSelector } from 'selectors/creatorStoreFront/textResourcesSelector';
import Empty from 'constants/empty';

/**
 * Returns the entire productsPageData slice safely
 */
const getProductsPageData = createSelector(creatorStoreFrontDataSelector, data => data.productsPageData || Empty.Object);

/**
 * Returns the normalized product page data values in one call
 */
export const getProductPageViewModelSelector = createSelector(getProductsPageData, textResourcesSelector, (productsPageData, textResources) => ({
    products: productsPageData.products || Empty.Array,
    contextId: productsPageData.contextId,
    textResources, // Use textResources directly from its selector
    pageType: productsPageData.pageType,
    creatorProfile: productsPageData.creatorProfile || Empty.Object,
    title: productsPageData.title || Empty.String,
    totalProductCount: productsPageData.totalProductCount || 0
}));
