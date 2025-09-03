import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    EVENT_NAMES: { SIGN_IN },
    SOT_LINK_TRACKING_EVENT
} = anaConsts;

class ForgotPasswordBindings {
    static triggerSOTAnalytics = ({ eventName, ...data }) => {
        const eventData = {
            data: {
                linkName: eventName,
                actionInfo: eventName,
                specificEventName: eventName,
                ...data
            }
        };

        processEvent.process(SOT_LINK_TRACKING_EVENT, eventData);
    };

    static emailSent = ({ emailId }) => {
        const { EMAIL_SENT } = SIGN_IN;
        ForgotPasswordBindings.triggerSOTAnalytics({
            eventName: EMAIL_SENT,
            emailId
        });
    };

    static emailResent = ({ emailId }) => {
        const { EMAIL_RESENT } = SIGN_IN;
        ForgotPasswordBindings.triggerSOTAnalytics({
            eventName: EMAIL_RESENT,
            emailId
        });
    };
}

export default ForgotPasswordBindings;
