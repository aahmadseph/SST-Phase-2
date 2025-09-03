import utils from 'analytics/utils';
import mountLinkTrakingAttributes from './linkTrackingAttributes';

export default function linkTrackingEvent(data) {
    const { usePreviousPageName, pageName } = data;

    if (!usePreviousPageName) {
        utils.savePageInfoName(pageName);
    }

    const attributes = mountLinkTrakingAttributes(data);

    /* All of this data is specific to this event and should therefor be
     ** passed in an event item rather than stored in digitalData. */
    const thisEvent = utils.addNewItemFromSpec('event', {
        eventInfo: {
            eventName: Sephora.analytics.constants.SOT_LINK_TRACKING_EVENT,
            type: Sephora.analytics.constants.SOT_LINK_TRACKING_EVENT,
            attributes: attributes
        }
    });

    //Turn this into a function later if we need it more often.
    if (!thisEvent.eventInfo.attributes.internalCampaign) {
        s && delete s.eVar75;
    }
}
