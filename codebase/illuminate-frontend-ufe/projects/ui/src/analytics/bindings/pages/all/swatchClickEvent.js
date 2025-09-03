import utils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';

export default function (data) {
    const currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                actionInfo: data.actionInfo ? 'quicklook_' + data.actionInfo : '',
                urlWithoutQuery: null,
                linkName: 'quicklook_' + data.linkName
            }
        }
    });
}
