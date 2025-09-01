import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

class storeSelectorModalBindings {
    static storeSwitcherLoad = entry => {
        const eventData = {
            pageName: 'buy online and pickup:store selection:n/a:*',
            ...(entry && { linkData: `${entry} entry` })
        };

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: eventData });
    };
    static triggerAnalytics = (stockStatus = null, storeId = '', skuId = '') => {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                actionInfo: `${anaConsts.ACTION_INFO.SEPHORA_KOHLS_EXIT_LINK}:${stockStatus}`,
                storeId,
                ...(skuId.length && {
                    productStrings: `;${skuId};;;;eVar26=${skuId}`
                })
            }
        });
    };
}

export default storeSelectorModalBindings;
