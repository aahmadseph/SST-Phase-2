import anaUtils from 'analytics/utils';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import helperUtils from 'utils/Helpers';

const { getProp } = helperUtils;

function handleAnalyticCallback(actionInfoStr) {
    const actionInfo = anaConsts.ACTION_INFO.ADDRESS_VERIFICATION;
    const currentEventData = anaUtils.getLastAsyncPageLoadData();
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            linkName: 'D=c55',
            actionInfo: actionInfo.replace('{0}', actionInfoStr),
            eventStrings: [anaConsts.Event.EVENT_71],
            ...currentEventData
        }
    });
}

function handleAnalyticAsyncLoad(pageType, pageDetail) {
    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
        data: {
            pageType,
            pageName: `${pageType}:${pageDetail}:n/a:*`,
            pageDetail: pageDetail,
            previousPageName: getProp(digitalData, 'page.attributes.sephoraPageInfo.pageName')
        }
    });
}

export default {
    handleAnalyticCallback,
    handleAnalyticAsyncLoad
};
