import anaConsts from 'analytics/constants';
import generalBindings from 'analytics/bindingMethods/pages/all/generalBindings';

class HomePageBindings {
    static setPageLoadAnalytics = () => {
        digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.HOMEPAGE;
        digitalData.page.category.pageType = anaConsts.PAGE_TYPES.HOMEPAGE;
        digitalData.page.attributes.world = 'n/a';
        digitalData.page.attributes.additionalPageInfo = '';
        digitalData.page.attributes.sephoraPageInfo = {
            pageName: generalBindings.getSephoraPageName()
        };
    };
}

export default HomePageBindings;
