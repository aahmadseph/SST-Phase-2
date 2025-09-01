import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

class EmailLookupModalBindings {
    static triggerAnalytics = (type, analyticsData) => {
        const { USER_PROFILE, MY_ACCOUNT_2, BI_LOOKUP } = anaConsts.PAGE_TYPES;
        const payload = {
            data: {
                pageName: `${USER_PROFILE}:${MY_ACCOUNT_2}:${BI_LOOKUP}`,
                ...analyticsData
            }
        };

        processEvent.process(type, payload);
    };

    static pageLoad = analyticsData => {
        EmailLookupModalBindings.triggerAnalytics(anaConsts.ASYNC_PAGE_LOAD, analyticsData);
    };
}

export default EmailLookupModalBindings;
