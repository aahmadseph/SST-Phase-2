/* eslint-disable comma-dangle */
import RwdBasketpageBasket from 'pages/Basket/RwdBasketpage';
import BrandNthCategoryBrands from 'pages/Brands/BrandNthCategory';
import ReferrerCampaigns from 'pages/Campaigns/Referrer';
import NthCategoryCategory from 'pages/Category/NthCategory';
import ContentStoreContentStore from 'pages/ContentStore/ContentStore';
import ContentStoreNoNavContentStore from 'pages/ContentStore/ContentStoreNoNav';
import HomepageHomepage from 'pages/Homepage/Homepage';
import ProductPageProduct from 'pages/Product/ProductPage';
import SearchSearch from 'pages/Search/Search';

const pages = {
    'Basket/RwdBasketpage': RwdBasketpageBasket,
    'Brands/BrandNthCategory': BrandNthCategoryBrands,
    'Campaigns/Referrer': ReferrerCampaigns,
    'Category/NthCategory': NthCategoryCategory,
    'ContentStore/ContentStore': ContentStoreContentStore,
    'ContentStore/ContentStoreNoNav': ContentStoreNoNavContentStore,
    'Homepage/Homepage': HomepageHomepage,
    'Product/ProductPage': ProductPageProduct,
    'Search/Search': SearchSearch
};

export default pages;
