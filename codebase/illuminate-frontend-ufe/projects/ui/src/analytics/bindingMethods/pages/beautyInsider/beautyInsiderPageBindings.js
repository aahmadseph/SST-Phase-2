import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    LINK_TRACKING_EVENT,
    PAGE_TYPES: { USER_PROFILE },
    PAGE_NAMES: { BI_SIGNED_IN, BI_ANONYMOUS }
} = anaConsts;

function setPageLoadAnalytics(isUserAtleastRecognized) {
    digitalData.page.category.pageType = USER_PROFILE;
    digitalData.page.pageInfo.pageName = isUserAtleastRecognized ? BI_SIGNED_IN : BI_ANONYMOUS;
}

function fireLinkTracking(actionInfo) {
    processEvent.process(LINK_TRACKING_EVENT, {
        data: {
            actionInfo
        }
    });
}

export default { setPageLoadAnalytics, fireLinkTracking };
