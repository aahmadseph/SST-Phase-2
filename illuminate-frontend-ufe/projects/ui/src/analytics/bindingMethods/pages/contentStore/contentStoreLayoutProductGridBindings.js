import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import localeUtils from 'utils/LanguageLocale';

const {
    COMPONENT_TITLE: { SKUGRID }
} = anaConsts;

const getTopAndCurrentLevelNames = breadcrumbs => {
    let topLevelName = '',
        currentLevelName = '';

    if (breadcrumbs?.length) {
        topLevelName = breadcrumbs[0].label?.toLowerCase();
        const currentLevel = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 1] : {};
        currentLevelName = currentLevel && currentLevel.label ? currentLevel.label.toLowerCase() : '';
    }

    return [topLevelName, currentLevelName];
};

const setPageLoadAnalytics = breadcrumbs => {
    const [topLevelName, currentLevelName] = getTopAndCurrentLevelNames(breadcrumbs);
    digitalData.page.category.pageType = anaConsts.PAGE_TYPES.CONTENT_STORE;
    digitalData.page.pageInfo.pageName = `${topLevelName}${currentLevelName ? '-' : ''}${currentLevelName}`;
    digitalData.page.attributes.world = 'n/a';
};

const getNavigationInfo = (breadcrumbs, currentLevel) => {
    if (breadcrumbs?.length) {
        const topLevelName = breadcrumbs[0].label;

        return {
            navigationInfo: anaUtils.buildNavPath(['left nav', topLevelName?.toLowerCase(), currentLevel?.toLowerCase()])
        };
    }

    return null;
};

const getRootContainerName = breadcrumbs => {
    const [topLevelName, currentLevelName] = getTopAndCurrentLevelNames(breadcrumbs);

    if (topLevelName.length) {
        return `${topLevelName}${currentLevelName}_${localeUtils.getCurrentCountry()?.toLowerCase()}_${SKUGRID}_ufe`;
    }

    return null;
};

export default { setPageLoadAnalytics, getNavigationInfo, getRootContainerName };
