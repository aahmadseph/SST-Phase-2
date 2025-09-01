import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import enhancedContentPageBindings from 'analytics/bindingMethods/pages/enhancedContent/enhancedContentPageBindings';
import analyticsUtils from 'analytics/utils';
const { LINK_TRACKING_EVENT } = anaConsts;
class VenmoBindings {
    static triggerLinkAnalytics = eventData => {
        processEvent.process(LINK_TRACKING_EVENT, { data: eventData });
    };

    static inlineError = ({ error, genericErrorMessage }) => {
        const errorMessage = error?.errorMessages ? error?.errorMessages[0] : genericErrorMessage;

        enhancedContentPageBindings.fireLinkTrackingAnalytics({
            fieldErrors: ['payments'], //prop28
            errorMessages: `venmo:${errorMessage}` //prop48
        });
    };

    static modalError = ({ error, genericErrorMessage }) => {
        const errorMessage = error?.message || genericErrorMessage;

        enhancedContentPageBindings.fireLinkTrackingAnalytics({
            fieldErrors: ['payments'], //prop28
            errorMessages: `venmo:${errorMessage}` //prop48
        });
    };

    static placeOrderClick = ({ defaultPayment }) => {
        const venmo = 'venmo';
        const actionInfo = 'checkout:payment:continue with venmo';
        const checkoutWithExistingDefaultPayment = venmo === defaultPayment;
        const events = [anaConsts.Event.EVENT_71];

        if (defaultPayment || checkoutWithExistingDefaultPayment) {
            events.push('event252=1');
        }

        const eventData = {
            eventStrings: events,
            linkName: 'D=c55',
            actionInfo: actionInfo
        };

        const mostRecentAsyncLoadEvent = analyticsUtils.getMostRecentEvent('asyncPageLoad');

        if (mostRecentAsyncLoadEvent) {
            eventData.previousPage = mostRecentAsyncLoadEvent.eventInfo.attributes.previousPageName;
        }

        VenmoBindings.triggerLinkAnalytics(eventData);
    };

    static expressCheckoutClick = () => {
        const eventData = {
            actionInfo: 'basket:payment:venmo'
        };

        VenmoBindings.triggerLinkAnalytics(eventData);
    };
}

export default VenmoBindings;
