import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import helpersUtils from 'utils/Helpers.js';

const { deferTaskExecution } = helpersUtils;

const {
    PAGE_TYPES: { USER_PROFILE },
    PAGE_DETAIL: { REWARDS_BAZAAR }
} = anaConsts;

function setPageLoadAnalytics() {
    digitalData.page.category.pageType = USER_PROFILE;
    digitalData.page.pageInfo.pageName = REWARDS_BAZAAR;
}

function fireLinkTrackingAnalytics(eventData) {
    deferTaskExecution(() =>
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: eventData
        })
    );
}

export default { setPageLoadAnalytics, fireLinkTrackingAnalytics };
