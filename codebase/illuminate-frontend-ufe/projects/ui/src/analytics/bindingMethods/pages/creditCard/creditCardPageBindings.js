import { USER_STATE } from 'constants/CreditCard';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import anaUtils from 'analytics/utils';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';
import { APPROVAL_STATUS } from 'constants/CreditCard';

const {
    ASYNC_PAGE_LOAD,
    LINK_TRACKING_EVENT,
    PAGE_TYPES: { USER_PROFILE },
    PAGE_DETAIL: { CREDIT_CARD },
    Event: {
        SC_CREDIT_CARD_SUBMIT, SC_CREDIT_CARD_APPROVED, SC_CREDIT_CARD_PENDING, SC_CREDIT_CARD_ERROR, EVENT_71
    },
    PAGE_NAMES: { CREDIT_CARD_APPLICATION_START, CREDIT_CARD_APPLICATION_APPROVED, CREDIT_CARD_APPLICATION_PENDING, CREDIT_CARD_APPLICATION_ERROR },
    ADDITIONAL_PAGE_INFO: { CARD_HOLDER },
    ACTION_INFO: { CREDIT_CARD_SUBMIT_APPLICATION }
} = anaConsts;

function setPageLoadAnalytics(userCreditCardStatus) {
    digitalData.page.category.pageType = USER_PROFILE;
    digitalData.page.pageInfo.pageName = CREDIT_CARD;

    if (userCreditCardStatus === USER_STATE.CARD_NO_REWARDS || userCreditCardStatus === USER_STATE.CARD_AND_REWARDS) {
        digitalData.page.attributes.additionalPageInfo = CARD_HOLDER;
    }
}

function setApplyPageLoadAnalytics() {
    digitalData.page.pageInfo.pageName = CREDIT_CARD_APPLICATION_START;
    digitalData.page.category.pageType = CREDIT_CARD;
}

function SubmitApplicationLinkTracking() {
    processEvent.process(LINK_TRACKING_EVENT, {
        data: {
            eventStrings: [SC_CREDIT_CARD_SUBMIT],
            linkName: CREDIT_CARD_SUBMIT_APPLICATION,
            actionInfo: CREDIT_CARD_SUBMIT_APPLICATION,
            pageDetail: CREDIT_CARD_APPLICATION_START
        }
    });
}

function getSuccessResponsePageName(response) {
    return response.status === APPROVAL_STATUS.APPROVED ? CREDIT_CARD_APPLICATION_APPROVED : CREDIT_CARD_APPLICATION_PENDING;
}

function fireResultPageAnalytics(response) {
    digitalData.page.pageInfo.pageName = getSuccessResponsePageName(response);

    let eventName = '';
    let creditCardStatus = '';
    let cardType = 'n/a';
    let pageDetail = '';
    let fireAnalytics = false;
    const status = response.status;

    if (status === APPROVAL_STATUS.APPROVED) {
        pageDetail = CREDIT_CARD_APPLICATION_APPROVED;
        eventName = SC_CREDIT_CARD_APPROVED;
        creditCardStatus = 'approval';
        cardType = response.cardType;
        fireAnalytics = true;
    } else if ([APPROVAL_STATUS.IN_PROGRESS, APPROVAL_STATUS.DECLINED].indexOf(status) > -1) {
        pageDetail = CREDIT_CARD_APPLICATION_PENDING;
        eventName = SC_CREDIT_CARD_PENDING;
        creditCardStatus = 'pending';
        fireAnalytics = true;
    } else if (status === APPROVAL_STATUS.ERROR || response.errorCode) {
        creditCardStatus = 'error';
        pageDetail = CREDIT_CARD_APPLICATION_ERROR;
        eventName = SC_CREDIT_CARD_ERROR;
        fireAnalytics = true;
    }

    if (fireAnalytics) {
        const data = {
            eventStrings: [eventName],
            pageName: `${CREDIT_CARD}:${pageDetail}:n/a:*`,
            pageDetail,
            pageType: CREDIT_CARD,
            creditCardStatus: 'creditcard:application ' + creditCardStatus + ':' + cardType,
            previousPageName: digitalData.page.attributes.sephoraPageInfo.pageName
        };
        processEvent.process(ASYNC_PAGE_LOAD, { data });

        // we have to assign previous page data here as we are not technically loading a new page,
        // but showing a different state of the same page as new page
        digitalData.page.attributes.previousPageData.pageName = digitalData.page.attributes.sephoraPageInfo.pageName;

        digitalData.page.attributes.sephoraPageInfo.pageName = `${CREDIT_CARD}:${pageDetail}:n/a:*`;
        anaUtils.setNextPageData({
            pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
            pageType: digitalData.page.category.pageType
        });
    }
}

function triggerErrorTracking(errorData) {
    errorData.fields[0] = `${CREDIT_CARD}:` + errorData.fields[0];
    errorData.messages[0] = `${CREDIT_CARD}:` + errorData.messages[0];
    const eventData = {
        data: {
            linkName: 'error',
            actionInfo: CREDIT_CARD_SUBMIT_APPLICATION,
            bindingMethods: linkTrackingError,
            eventStrings: [EVENT_71],
            fieldErrors: errorData.fields,
            errorMessages: errorData.messages
        }
    };
    processEvent.process(LINK_TRACKING_EVENT, eventData);
}

function triggerLinkTrackingEvent(actionInfo) {
    processEvent.process(LINK_TRACKING_EVENT, {
        data: {
            actionInfo,
            ...anaUtils.getLastAsyncPageLoadData()
        }
    });
}

export default {
    setPageLoadAnalytics,
    setApplyPageLoadAnalytics,
    SubmitApplicationLinkTracking,
    fireResultPageAnalytics,
    triggerErrorTracking,
    triggerLinkTrackingEvent
};
