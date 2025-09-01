import { createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/CreatorStoreFront/locales', 'CreatorStoreFront');

export const textResourcesSelector = createStructuredSelector({
    share: getTextFromResource(getText, 'share'),
    sharePost: getTextFromResource(getText, 'sharePost'),
    shareProfile: getTextFromResource(getText, 'shareProfile'),
    shareCollection: getTextFromResource(getText, 'shareCollection'),
    copyLinkText: getTextFromResource(getText, 'copyLinkText'),
    copy: getTextFromResource(getText, 'copy'),
    copied: getTextFromResource(getText, 'copied'),
    allProducts: getTextFromResource(getText, 'allProducts'),
    featuredHeader: getTextFromResource(getText, 'featuredHeader'),
    featured: getTextFromResource(getText, 'featured'),
    products: getTextFromResource(getText, 'products'),
    collections: getTextFromResource(getText, 'collections'),
    posts: getTextFromResource(getText, 'posts'),
    viewDetails: getTextFromResource(getText, 'viewDetails'),
    showMoreCollections: getTextFromResource(getText, 'showMoreCollections'),
    items: getTextFromResource(getText, 'items'),
    addToBasket: getTextFromResource(getText, 'addToBasket'),
    moreFrom: getTextFromResource(getText, 'moreFrom'),
    viewAll: getTextFromResource(getText, 'viewAll'),
    shopWith: getTextFromResource(getText, 'shopWith'),
    goToProfile: getTextFromResource(getText, 'goToProfile'),
    postsOf: getTextFromResource(getText, 'postsOf', ['{0}']),
    commissionableLinks: getTextFromResource(getText, 'commissionableLinks')
});
