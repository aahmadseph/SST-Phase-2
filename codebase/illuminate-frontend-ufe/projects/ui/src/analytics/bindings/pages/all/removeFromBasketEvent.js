import utils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';
import basketUtils from 'utils/Basket';
import skuUtils from 'utils/Sku';
import locationUtils from 'utils/Location';
import anaUtils from 'analytics/utils';

export default function (data) {
    const { isBIRBPageRewardModal } = data;

    const currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);

    const actionEvent = isBIRBPageRewardModal ? 'Remove From Basket' : anaUtils.safelyReadProperty('eventInfo.attributes.actionInfo', currentEvent);

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                biRealTimePointStatus:
                    !isBIRBPageRewardModal && locationUtils.isBIRBPage() && skuUtils.isBiReward(data.sku) ? basketUtils.getAvailableBiPoints() : null,
                // Should anything be added to the removeFromBasket link
                // tracking event or removed from it, please do that here.
                biRewardType: data.sku.biType,
                actionInfo: actionEvent
            }
        }
    });
}
