import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

const events = {
    trackEvent: anaConsts.LINK_TRACKING_EVENT,
    asyncPageLoad: anaConsts.ASYNC_PAGE_LOAD
};

function modalLoadTracking({
    pageDetail, description = '', eventStrings = [], reportIssueCode, orderId
}) {
    const pageType = anaConsts.PAGE_TYPES.ORDER_DETAIL_REPORT_ISSUE;
    const linkData = `${pageType}:${description}`;

    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
        data: {
            pageName: `${pageType}:${pageDetail}:n/a:*`,
            pageDetail,
            pageType,
            linkData,
            eventStrings,
            reportIssueReason: description,
            reportIssueCode,
            orderId
        }
    });
}

function trackingEvent(dataToInclude = {}, type = 'trackEvent') {
    processEvent.process(events[type], {
        data: { ...dataToInclude }
    });
}

export default {
    modalLoadTracking,
    trackingEvent
};
