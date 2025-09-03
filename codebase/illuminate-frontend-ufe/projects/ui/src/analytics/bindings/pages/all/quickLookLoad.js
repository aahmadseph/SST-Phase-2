import quickLookBindings from 'analytics/bindingMethods/pages/all/quickLookBindings';
import utils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';
import locationUtils from 'utils/Location';

export default function (data) {
    const currentEvent = utils.getMostRecentEvent(anaConsts.ASYNC_PAGE_LOAD);

    // Adds the PLA sponsored products when available.
    const sponsoredProductInformation = data?.sponsoredProductInformation || {};

    const events = [anaConsts.Event.PRODUCT_VIEW, anaConsts.Event.EVENT_25];
    const eventStrings = data.eventStrings ? [...data.eventStrings, ...events] : events;

    if (locationUtils.isAutoreplenishPage() || data.rootContainerName === anaConsts.CAROUSEL_NAMES.ROUGE_REWARDS_CAROUSEL) {
        eventStrings.push(anaConsts.Event.EVENT_269);
    }

    const creatorStoreFrontPageName = `${anaConsts.PAGE_TYPES.QUICK_LOOK}:${anaConsts.PAGE_TYPES.CREATOR_STORE_FRONT}:n/a:*`;
    const pageName = locationUtils.isCreatorStoreFrontPage() ? creatorStoreFrontPageName : quickLookBindings.getQuickLookPageName(data);

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                context: anaConsts.PAGE_TYPES.QUICK_LOOK,
                eventName: anaConsts.QUICK_LOOK_LOAD,
                eVar63: null,
                eventStrings,
                pageName,
                previousPageName: data.previousPageName,
                pageType: anaConsts.PAGE_TYPES.QUICK_LOOK,
                pageDetail: data?.product?.productDetails?.productId,
                world: quickLookBindings.getQuickLookWorld(data),
                productStrings: quickLookBindings.buildProductString(data),
                urlWithoutQuery: null,
                internalCampaign: quickLookBindings.getQLInternalCampaign(data),
                featureStrings: quickLookBindings.getQuickLookFeatureString(data.product),
                rootContainerName: data.rootContainerName,
                productId: data?.product?.productDetails?.productId,
                skuId: data.sku && data.sku.skuId,
                sponsoredProductInformation,
                podId: data.podId
            }
        }
    });
}
