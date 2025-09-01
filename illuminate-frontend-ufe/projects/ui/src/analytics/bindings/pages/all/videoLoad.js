import productPageLinkTracking from 'analytics/bindings/pages/product/productPageLinkTracking';
import deepExtend from 'utils/deepExtend';
import anaUtils from 'analytics/utils';
import anaConsts from 'analytics/constants';

export default (function () {
    var videoLoadBindings = function (data) {
        var currentEvent = anaUtils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);

        /* Extend the base event object with these specifics */
        deepExtend(currentEvent, {
            eventInfo: {
                attributes: {
                    eVar63: 'D=g',
                    experience: digitalData.page.attributes.experience,
                    pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
                    previousPage: digitalData.page.attributes.previousPageData.pageName,
                    platform: digitalData.page.attributes.platform,
                    videoName: [digitalData.page.attributes.sephoraPageInfo.pageName, data.videoName[0], data.videoName[1]].join('_'),
                    internalCampaign: [digitalData.page.category.pageType, digitalData.page.attributes.world || 'n/a', 'video'].join('_'),
                    urlWithoutQuery: window.location.host
                }
            }
        });
    };

    var productVideoPromise = Sephora.analytics.promises.getCustomPromise(productPageLinkTracking.SPEC_EVENT_NAME.VIDEO);

    if (productVideoPromise) {
        return [videoLoadBindings, productVideoPromise];
    }

    return [videoLoadBindings];
}());
