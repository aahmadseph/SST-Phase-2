import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    EVENT_NAMES: { PRODUCT_FINDER },
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

    static quizQuestion = ({ questionText, questionNumber }) => {
        const { QUIZ_QUESTION } = PRODUCT_FINDER;
        ForgotPasswordBindings.triggerSOTAnalytics({
            eventName: QUIZ_QUESTION,
            questionText,
            questionNumber
        });
    };
}

export default ForgotPasswordBindings;
