import utils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';
import Location from 'utils/Location';

export default function (data) {
    const { analyticsData } = data;
    const { containerTitle, productId, isAddFullSize } = analyticsData;
    const currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
    const existingEventStrings = currentEvent.eventInfo.attributes.eventStrings || [];

    let newEventStrings = [anaConsts.Event.EVENT_17];
    let productStrings;

    if (Location.isBasketPage()) {
        newEventStrings.push(anaConsts.Event.EVENT_61);
        newEventStrings.push(anaConsts.Event.EVENT_71);
        productStrings = `;${productId};;;;eVar26=${productId}|eVar72=basket`;
    }

    if (existingEventStrings.length) {
        newEventStrings = existingEventStrings.concat(newEventStrings);
    }

    /* ILLUPH-119839
     * According to JIRA and business, requirement is to have prop55 populate with
     * actionCampaignString listed below only for the products within the
     * purchases carousel on the profile lists page. (loves and services cannot have rewards)
     */
    let actionInfo = 'Add Sample To Basket';
    let linkName = 'D=c55';

    if (isAddFullSize && containerTitle === anaConsts.CAROUSEL_NAMES.PURCHASES) {
        actionInfo = `${containerTitle}:${productId}:add full size`;
        linkName = 'Add Full Size';
    }

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                actionInfo,
                linkName,
                eventStrings: newEventStrings,
                productStrings
            }
        }
    });
}
