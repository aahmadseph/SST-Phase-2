import anaConsts from 'analytics/constants';
import generalBindings from 'analytics/bindingMethods/pages/all/generalBindings';

const { PAGE_TYPES } = anaConsts;

const layoutsWithSeperateAnalytics = ['LayoutCreditCardApplication', 'LayoutCreditCardPage', 'LayoutBeautyInsider', 'LayoutRewardsBazaar'];

function setSephoraPageInfo() {
    digitalData.page.attributes.sephoraPageInfo = {
        pageName: generalBindings.getSephoraPageName()
    };
}

function setPageLoadAnalytics(content) {
    const { breadcrumbs, slug, layout } = content;

    if (layoutsWithSeperateAnalytics.includes(layout?.type)) {
        setSephoraPageInfo();

        return;
    }

    if (!breadcrumbs || breadcrumbs?.length === 0) {
        digitalData.page.category.pageType = PAGE_TYPES.CONTENT_STORE;
        digitalData.page.pageInfo.pageName = slug;

        setSephoraPageInfo();

        return;
    }

    const breadcrumbLabels = [];
    breadcrumbs?.forEach(item => breadcrumbLabels.push(item.label));

    if (breadcrumbLabels.length) {
        let world = 'n/a';

        if (breadcrumbLabels.length === 2) {
            world = breadcrumbLabels[1];
        } else if (breadcrumbLabels.length >= 3) {
            world = `${breadcrumbLabels[1]}-${breadcrumbLabels[2]}`;
        }

        digitalData.page.category.pageType = PAGE_TYPES.CONTENT_STORE;
        digitalData.page.pageInfo.pageName = breadcrumbLabels[0];
        digitalData.page.attributes.world = world;
        digitalData.page.attributes.additionalPageInfo = breadcrumbLabels?.[3];

        setSephoraPageInfo();
    }
}

export default {
    setPageLoadAnalytics
};
