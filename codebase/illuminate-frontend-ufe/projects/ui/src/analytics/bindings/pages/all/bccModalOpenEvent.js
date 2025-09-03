import utils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';

export default function (data) {
    const currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
    const attributes = {
        linkName: data.bccComponentName,
        internalCampaign: data.bccComponentName,
        eventStrings: ['event71']
    };
    deepExtend(currentEvent, { eventInfo: { attributes: attributes } });
}
