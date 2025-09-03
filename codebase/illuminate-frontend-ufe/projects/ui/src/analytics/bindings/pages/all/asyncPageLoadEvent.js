import anaConsts from 'analytics/constants';

export default (function () {
    var asyncPageLoadBindings = function asyncPageLoadBindings(data) {
        /* All of this data is specific to this event and should therefor be
         ** passed in an event item rather than stored in digitalData. */
        Sephora.analytics.utils.addNewItemFromSpec('event', {
            eventInfo: {
                eventName: anaConsts.ASYNC_PAGE_LOAD,
                attributes: {
                    eventStrings: data.eventStrings, // should pass event in array here
                    pageDetail: data.pageDetail,
                    pageName: data.pageName,
                    pageType: data.pageType,
                    previousPageName: data.previousPageName,
                    productStrings: data.productStrings,
                    navigationInfo: data.navigationInfo,
                    linkData: data.linkData, // prop55
                    world: data.world,
                    categoryFilters: data.categoryFilters,
                    storeId: data.storeId,
                    internalCampaign: data.internalCampaign,
                    creditCardStatus: data.creditCardStatus,
                    keywordPurchased: data.keywordPurchased, //eVar27
                    overlayTiers: data.overlayTiers, //s.prop61
                    eVar54: data.eVar54, // LOYLS-1226
                    eVar129: data.eVar129,
                    eVar38: data.eVar38,
                    prop48: data.prop48,
                    actionInfo: data.actionInfo,
                    eVar130: data.eVar130,
                    productReviews: data.productReviews //prop32
                }
            }
        });
    };

    return asyncPageLoadBindings;
}());
