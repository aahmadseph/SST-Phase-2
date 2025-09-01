import utils from 'analytics/utils';
import analyticsConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';
import helperUtils from 'utils/Helpers';

const { getProp } = helperUtils;

export default function (data) {
    const currentEvent = utils.getMostRecentEvent(analyticsConsts.LINK_TRACKING_EVENT);
    const lastQuickLookEvent = utils.getMostRecentEvent(analyticsConsts.ASYNC_PAGE_LOAD, {
        context: analyticsConsts.CONTEXT.QUICK_LOOK
    });

    const attributesToAdd = {
        actionInfo: data.actionInfo,
        linkName: data.linkName,
        internalCampaign: utils.safelyReadProperty('eventInfo.attributes.internalCampaign', currentEvent) || null
    };

    if (attributesToAdd.productStrings && data.analyticsData && data.analyticsData.platform) {
        attributesToAdd.productStrings += `|eVar72=cmnty:${data.analyticsData.platform}:product-tag`;
    }

    const productStringsPropPath = 'eventInfo.attributes.productStrings';
    const currentProductStrings = getProp(currentEvent, productStringsPropPath, false);
    const lastProductStrings = getProp(lastQuickLookEvent, productStringsPropPath, false);

    if (!currentProductStrings && lastProductStrings) {
        attributesToAdd.productStrings = lastProductStrings;
    }

    deepExtend(currentEvent, { eventInfo: { attributes: utils.removeUndefinedItems(attributesToAdd) } });
}
