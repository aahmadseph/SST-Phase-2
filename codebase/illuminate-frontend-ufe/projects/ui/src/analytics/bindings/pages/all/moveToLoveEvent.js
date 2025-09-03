import utils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';

export default function (data) {
    const currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);

    const attributes = {
        linkName: 'love',
        eventStrings: [anaConsts.Event.EVENT_4, anaConsts.Event.EVENT_27],
        productStrings: utils.buildProductStrings({ products: data.item }),
        productId: data?.productId
    };

    deepExtend(currentEvent, { eventInfo: { attributes: attributes } });
}
