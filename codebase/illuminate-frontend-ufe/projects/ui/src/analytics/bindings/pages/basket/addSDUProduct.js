import utils from 'analytics/utils';
import analyticsConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';

export default function () {
    const currentEvent = utils.getMostRecentEvent(analyticsConsts.LINK_TRACKING_EVENT);
    const productStrings = currentEvent.eventInfo.attributes.productStrings;
    const attributes = {
        linkName: 'same-day unlimited:add to basket', // pev2
        actionInfo: 'same-day unlimited:add to basket', // prop55
        eventStrings: 'scAdd', // events
        internalCampaign: 'same-day unlimited:add to basket', // evar75
        productStrings // products
    };

    deepExtend(currentEvent, {
        eventInfo: { attributes }
    });
}
