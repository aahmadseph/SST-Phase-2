import utils from 'analytics/utils';
import analyticsConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';

export default function () {
    const currentEvent = utils.getMostRecentEvent(analyticsConsts.LINK_TRACKING_EVENT);
    const currentProductStrings = currentEvent.eventInfo.attributes.productStrings;
    const replenItemsCarouselTitle = 'restock past purchases';
    const addtoBasketSection = `${replenItemsCarouselTitle}:add to basket`;

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                actionInfo: addtoBasketSection,
                productStrings: currentProductStrings,
                linkName: 'Add To Basket'
            }
        }
    });
}
