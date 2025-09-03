import productTaggingQuickLookBindings from 'analytics/bindingMethods/pages/all/productTaggingQuickLookBindings';
import utils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';

export default function (data) {
    const currentEvent = utils.getMostRecentEvent(anaConsts.ASYNC_PAGE_LOAD);

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                eventName: anaConsts.QUICK_LOOK_LOAD,
                eVar63: null,
                eventStrings: [data.event],
                pageName: productTaggingQuickLookBindings.getPageName(data),
                pageType: data.type,
                pageDetail: data?.product?.productDetails?.productId,
                world: productTaggingQuickLookBindings.getWorld(data.product),
                productStrings: utils.buildSingleProductString({ sku: data.sku }),
                urlWithoutQuery: null,
                linkData: productTaggingQuickLookBindings.getLinkData(data),
                internalCampaign: productTaggingQuickLookBindings.getInternalCampaign(data),
                featureStrings: productTaggingQuickLookBindings.getFeatureString(data.product),
                rootContainerName: data.rootContainerName,
                productId: data?.product?.productDetails?.productId
            }
        }
    });
}
