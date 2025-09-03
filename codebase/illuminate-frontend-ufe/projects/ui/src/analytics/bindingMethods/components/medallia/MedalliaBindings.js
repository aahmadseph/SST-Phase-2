import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    EVENT_NAMES: { MEDALLIA },
    SOT_LINK_TRACKING_EVENT
} = anaConsts;

class MedalliaBindings {
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

    static feedbackClick = () => {
        const { FEEDBACK_CLICK } = MEDALLIA;
        MedalliaBindings.triggerSOTAnalytics({
            eventName: FEEDBACK_CLICK
        });
    };

    static formDisplayed = ({ formType, formId }) => {
        const { FORM_DISPLAYED } = MEDALLIA;
        MedalliaBindings.triggerSOTAnalytics({
            eventName: FORM_DISPLAYED,
            formType,
            formId
        });
    };

    static formDismissed = ({ formType, formId }) => {
        const { FORM_DISMISSED } = MEDALLIA;
        MedalliaBindings.triggerSOTAnalytics({
            eventName: FORM_DISMISSED,
            formType,
            formId
        });
    };

    static formSubmitted = ({ formType, formId }) => {
        const { FORM_SUBMITTED } = MEDALLIA;
        MedalliaBindings.triggerSOTAnalytics({
            eventName: FORM_SUBMITTED,
            formType,
            formId
        });
    };
}

export default MedalliaBindings;
