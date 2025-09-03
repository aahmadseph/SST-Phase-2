import anaConsts from 'analytics/constants';

const {
    PAGE_TYPES: { CONTENT_STORE },
    PAGE_NAMES: { TARGETED_LANDING_PROMOTION }
} = anaConsts;

function setPageLoadAnaytics() {
    digitalData.page.category.pageType = CONTENT_STORE;
    digitalData.page.pageInfo.pageName = TARGETED_LANDING_PROMOTION;
}

export default { setPageLoadAnaytics };
