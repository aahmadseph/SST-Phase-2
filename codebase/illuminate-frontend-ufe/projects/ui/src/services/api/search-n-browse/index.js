// This module provides API call methods for Sephora Commerce
// Search & Browse APIs:
// https://jira.sephora.com/wiki/pages/viewpage.action?pageId=120041949

import getProductDetails from 'services/api/search-n-browse/getProductDetails';
import getProductDetailsLite from 'services/api/search-n-browse/getProductDetailsLite';
import getSkuDetails from 'services/api/search-n-browse/getSkuDetails';
import findInStore from 'services/api/search-n-browse/findInStore';
import searchProductsByKeywordApi from 'services/api/search-n-browse/searchProductsByKeyword';
import searchTypeAhead from 'services/api/search-n-browse/searchTypeAhead';
import getCategories from 'services/api/search-n-browse/getCategories';
import getSpecialSearchTermComponents from 'services/api/search-n-browse/getSpecialSearchTermComponents';
import getNthLevelCategoryApi from 'services/api/search-n-browse/getNthLevelCategory';
import getNthLevelBrandApi from 'services/api/search-n-browse/getNthLevelBrand';

const { searchProductsByKeyword, getProductsFromKeyword } = searchProductsByKeywordApi;
const { getNthLevelCategory, getCategory } = getNthLevelCategoryApi;
const { getNthLevelBrand, getBrand } = getNthLevelBrandApi;

export default {
    getProductDetails,
    getProductDetailsLite,
    getSkuDetails,
    findInStore,
    searchProductsByKeyword,
    getProductsFromKeyword,
    searchTypeAhead,
    getNthLevelCategory,
    getCategory,
    getCategories,
    getNthLevelBrand,
    getBrand,
    getSpecialSearchTermComponents
};
