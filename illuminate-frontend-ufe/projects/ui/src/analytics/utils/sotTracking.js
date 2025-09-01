import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const { SOT_LINK_TRACKING_EVENT, SOT_P13N_TRACKING_EVENT } = anaConsts;

const DEBOUNCE_TIME = 500;

const sendSOTLinkTrackingEvent = ({ eventData, callback, isClick = false }) => {
    processEvent.process(SOT_LINK_TRACKING_EVENT, {
        data: eventData,
        finishEventWithoutTimeout: isClick
    });

    if (callback) {
        setTimeout(callback, DEBOUNCE_TIME);
    }
};

const sendSOTP13nTrackingEvent = ({ eventData, callback, isClick = false, waitForPostPageLoad = false }) => {
    if (waitForPostPageLoad) {
        // This is required to for all the bindings from all components to be loaded before sending the event
        window.addEventListener('postPageLoad', () => {
            processEvent.process(SOT_P13N_TRACKING_EVENT, {
                data: eventData,
                finishEventWithoutTimeout: isClick
            });

            if (callback) {
                setTimeout(callback, DEBOUNCE_TIME);
            }
        });
    } else {
        // This will fire the tracking event for high priority components.
        // This might cause issues with the Page Title and other components that are not ready yet before the postPageLoad is reached.
        processEvent.process(SOT_P13N_TRACKING_EVENT, {
            data: eventData,
            finishEventWithoutTimeout: isClick
        });
    }
};

const sendSOTLinkTrackingClickEvent = ({ eventData, callback }) => {
    sendSOTLinkTrackingEvent({ eventData, callback, isClick: true });
};

const sendSOTP13nTrackingClickEvent = ({ eventData, callback }) => {
    sendSOTP13nTrackingEvent({ eventData, callback, isClick: true });
};

export {
    sendSOTLinkTrackingClickEvent, sendSOTLinkTrackingEvent, sendSOTP13nTrackingClickEvent, sendSOTP13nTrackingEvent, DEBOUNCE_TIME
};
