import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import locationUtils from 'utils/Location';

const { isGameDetailsPage, isGamesHubPage, isContentStorePage } = locationUtils;
const { ASYNC_PAGE_LOAD, PAGE_TYPES, PAGE_NAMES, Event } = anaConsts;

function getStateValue(status = 'n/a') {
    return status.toLowerCase().replace('_', ' ');
}

function getPromoIdValue(promoId = 'n/a') {
    return promoId.toLowerCase();
}

function getGameDetailsParams(data) {
    const { datasource, parameters } = data.layout?.content?.find(item => item.renderingType === 'gameDetails') || {};

    return {
        promoId: getPromoIdValue(datasource?.promoId),
        state: getStateValue(datasource?.statusForAnalytics),
        redeemPoints: parameters?.showRedeemPointsCta ? 1 : 0
    };
}

function setPageLoadAnalytics(content) {
    if (isGamesHubPage()) {
        digitalData.page.category.pageType = PAGE_TYPES.GAMIFICATION;
        digitalData.page.pageInfo.pageName = PAGE_NAMES.CHALLENGE_HUB;
        digitalData.page.attributes.world = '';
    } else if (isGameDetailsPage()) {
        const { promoId, state, redeemPoints } = getGameDetailsParams(content);

        digitalData.page.category.pageType = PAGE_TYPES.GAMIFICATION;
        digitalData.page.pageInfo.pageName = PAGE_NAMES.CHALLENGE_DETAIL;
        digitalData.page.attributes.world = '';
        digitalData.page.attributes.additionalPageInfo = `challenge=${promoId}&task=n/a&state=${state}`;
        digitalData.page.attributes.pageLoadEventStrings = [`${Event.OPEN_CHALLENGE_DETAIL}=${redeemPoints}`];
    } else if (isContentStorePage()) {
        const { breadcrumbs, slug } = content;

        if (!breadcrumbs || breadcrumbs?.length === 0) {
            digitalData.page.category.pageType = anaConsts.PAGE_TYPES.CONTENT_STORE;
            digitalData.page.pageInfo.pageName = slug;

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

            digitalData.page.category.pageType = anaConsts.PAGE_TYPES.CONTENT_STORE;
            digitalData.page.pageInfo.pageName = breadcrumbLabels[0];
            digitalData.page.attributes.world = world;
            digitalData.page.attributes.additionalPageInfo = breadcrumbLabels?.[3];
        }
    }
}

function fireChallengeJoinConfirmationAnalytics(promoId) {
    const eventData = {
        data: {
            pageName: `${PAGE_TYPES.GAMIFICATION}:${PAGE_NAMES.CHALLENGE_JOIN_CONFIRMATION}:n/a:*challenge=${promoId}&task=n/a&state=joined`
        }
    };

    processEvent.process(ASYNC_PAGE_LOAD, eventData);
}

function fireTaskDetailAnalytics({ gamePromoId, status, taskPromoId }) {
    const pageType = PAGE_TYPES.GAMIFICATION;
    const pageDetail = PAGE_NAMES.TASK_DETAIL;
    const pageName = `${pageType}:${pageDetail}:n/a:*challenge=${getPromoIdValue(gamePromoId)}&task=${getPromoIdValue(
        taskPromoId
    )}&state=${getStateValue(status)}`;

    const eventData = {
        data: {
            pageType,
            pageDetail,
            pageName
        }
    };

    processEvent.process(ASYNC_PAGE_LOAD, eventData);
}

function setTaskDetailCTAAnalytics({ taskPromoId, linkName, gamePromoId }) {
    anaUtils.setNextPageData({
        internalCampaign: `${PAGE_TYPES.GAMIFICATION}:beauty insider challenges:${getPromoIdValue(gamePromoId)}-${getPromoIdValue(
            taskPromoId
        )}:${getPromoIdValue(linkName)}`
    });
}

function fireLinkTrackingAnalytics(eventData) {
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: eventData
    });
}

export default {
    setPageLoadAnalytics,
    fireChallengeJoinConfirmationAnalytics,
    fireTaskDetailAnalytics,
    setTaskDetailCTAAnalytics,
    fireLinkTrackingAnalytics
};
