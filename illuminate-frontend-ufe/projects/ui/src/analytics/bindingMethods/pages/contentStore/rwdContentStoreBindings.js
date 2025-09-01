import anaConsts from 'analytics/constants';
import analyticsUtils from 'analytics/utils';
import replaceSpecialCharacters from 'utils/replaceSpecialCharacters';
import generalBindings from 'analytics/bindingMethods/pages/all/generalBindings';

function setPageLoadAnalytics(data) {
    const { breadcrumbs = [], ancestorHierarchy, isNoNav = false, analtyicsTitle = '' } = data;

    const previousPageData = analyticsUtils.getPreviousPageData();
    const isFinderResults = previousPageData?.pageName === anaConsts.PAGE_NAMES.SHADE_FINDER_RESULTS;
    const myRegex = new RegExp(`${anaConsts.PAGE_NAMES.SHADE_FINDER_MATCH_FOUND}`);
    const isFinderMatchFound = previousPageData?.pageName?.match(myRegex);
    const isFinderPage = isFinderResults || isFinderMatchFound;

    if (isFinderPage) {
        digitalData.page.category.pageType = 'product';
        digitalData.page.pageInfo.pageName = previousPageData.previousPageName;
        digitalData.page.attributes.world = previousPageData.world;
    } else if (isNoNav) {
        digitalData.page.category.pageType = anaConsts.PAGE_TYPES.CONTENT_STORE;
        digitalData.page.pageInfo.pageName = analtyicsTitle.toLowerCase();
    } else {
        const firstCrumb = breadcrumbs[0] || {};
        const lastCrumb = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 1] : {};
        const ancestorName = ancestorHierarchy && ancestorHierarchy[0].displayName;
        const topLevelName = firstCrumb.name || ancestorName || '';
        const childName = lastCrumb && lastCrumb.name ? `-${lastCrumb.name}` : '';
        const isBuyingGuideChild = Boolean(topLevelName === 'Quizzes & Buying Guides' && childName);

        digitalData.page.category.pageType = anaConsts.PAGE_TYPES.CONTENT_STORE;
        digitalData.page.pageInfo.pageName = replaceSpecialCharacters(`${topLevelName}${childName}`.toLowerCase());
        digitalData.page.attributes.world = isBuyingGuideChild ? breadcrumbs[1].name : '';
        digitalData.page.attributes.additionalPageInfo = '';
        const pageName = generalBindings.getSephoraPageName();

        if (!digitalData.page.attributes.sephoraPageInfo) {
            digitalData.page.attributes.sephoraPageInfo = { pageName };
        } else {
            digitalData.page.attributes.sephoraPageInfo.pageName = pageName;
        }
    }
}

export default { setPageLoadAnalytics };
