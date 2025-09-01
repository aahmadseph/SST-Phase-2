import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

class CheckYourEmailModalBindings {
    static triggerAnalytics = type => {
        const { REGISTER, CHECK_EMAIL } = anaConsts.PAGE_TYPES;
        const payload = {
            data: {
                pageName: `${REGISTER}:${CHECK_EMAIL}:n/a:*`
            }
        };

        processEvent.process(type, payload);
    };

    static pageLoad = () => {
        CheckYourEmailModalBindings.triggerAnalytics(anaConsts.ASYNC_PAGE_LOAD);
    };
}

export default CheckYourEmailModalBindings;
