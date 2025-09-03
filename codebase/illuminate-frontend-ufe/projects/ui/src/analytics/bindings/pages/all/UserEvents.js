function registerErrorEvent({
    processEvent, anaUtils, anaConsts, linkTrackingError, reason
}) {
    processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
        data: {
            bindingMethods: linkTrackingError,
            errorMessages: reason.errorMessages,
            ...anaUtils.getLastAsyncPageLoadData()
        }
    });
}

function signInErrorEvent({
    anaConsts, anaUtils, processEvent, linkTrackingError, reason, scEvent = {}, isTestNTarget
}) {
    const { SIGN_IN } = anaConsts.PAGE_TYPES;
    const { SIGN_IN_AND_REGISTER } = anaConsts.PAGE_DETAIL;

    const recentEvent = anaUtils.getLastAsyncPageLoadData({ pageType: anaConsts.PAGE_TYPES.SIGN_IN });

    const analyticData = {
        bindingMethods: linkTrackingError,
        errorMessages: reason.errorMessages,
        eventStrings: [scEvent.SIGN_IN_ATTEMPT, scEvent.SIGN_IN_FAILED],
        ...recentEvent
    };

    if (isTestNTarget) {
        analyticData.pageName = `${SIGN_IN}:${SIGN_IN_AND_REGISTER}:n/a:*`;
        analyticData.pageType = SIGN_IN;
        analyticData.pageDetail = SIGN_IN_AND_REGISTER;
        analyticData.linkName = 'signin:modal:error';
    }

    processEvent.process(anaConsts.LINK_TRACKING_EVENT, { data: analyticData });
}

export {
    registerErrorEvent, signInErrorEvent
};
