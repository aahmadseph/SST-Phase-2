import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const { LINK_TRACKING_EVENT, ASYNC_PAGE_LOAD } = anaConsts;

class GiftCardsBindings {
    static triggerAsyncPageLoadAnalytics = eventData => {
        processEvent.process(ASYNC_PAGE_LOAD, { data: eventData });
    };

    static triggerLinkAnalytics = eventData => {
        processEvent.process(LINK_TRACKING_EVENT, { data: eventData });
    };

    static modalError = ({ error }) => {
        GiftCardsBindings.triggerLinkAnalytics({
            fieldErrors: ['gift card balance'], //prop28
            errorMessages: [`${error}`] //prop48
        });
    };
}

export default GiftCardsBindings;
