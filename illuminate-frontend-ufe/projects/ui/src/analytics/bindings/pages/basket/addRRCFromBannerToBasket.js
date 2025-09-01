import utils from 'analytics/utils';
import analyticsConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';
import basketUtils from 'utils/Basket';
import locationUtils from 'utils/Location';

export default function (data) {
    const currentEvent = utils.getMostRecentEvent(analyticsConsts.LINK_TRACKING_EVENT);
    const currentProductStrings = currentEvent.eventInfo.attributes.productStrings;
    const locationString = locationUtils.isBasketPage() ? 'basket' : 'bi tab';
    const newProductStrings = currentProductStrings + '|eVar72=' + locationString;
    const addText = 'add to basket';
    const rrcString = 'rouge reward card';
    const actionInfo = `${rrcString}:${locationString} banner:${addText}`;
    const internalCampaign = `${rrcString}-${locationString}-banner:${addText}`.replace(/\s/g, '-');

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                biRealTimePointStatus: basketUtils.getAvailableBiPoints(),
                biRewardType: data.sku.biType,
                actionInfo,
                internalCampaign,
                productStrings: newProductStrings
            }
        }
    });
}
