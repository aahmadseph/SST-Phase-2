import utils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';

export default function (data) {
    const currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
    const linkName = data.linkName
        ? data.linkName
        : data?.sephoraCheckout
            ? anaConsts.LinkData.SEPHORA_CHECKOUT_BUTTON
            : anaConsts.LinkData.CHECKOT_BUTTON_STANDARD;

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                linkName,
                eventStrings: [anaConsts.Event.EVENT_71],
                actionInfo: linkName,
                previousPage: data.previousPageName,
                pageDetail: data.pageDetail,
                pageName: data.pageName
            }
        }
    });
}
