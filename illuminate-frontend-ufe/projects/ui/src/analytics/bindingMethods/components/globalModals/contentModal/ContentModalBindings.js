import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

class ContentModalBindings {
    static trackAnalyticsForPrescreenModal = (actiontext = '') => {
        const pageType = anaConsts.PAGE_TYPES.CREDIT_CARD;
        const pageDetail = anaConsts.PAGE_DETAIL.PRESCREEN_BANNER;
        const link = `${pageType}:${pageDetail}:${actiontext?.toLowerCase()}`;
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                pageName: `${pageType}:${pageDetail}:n/a:*`,
                pageType,
                pageDetail,
                linkName: link,
                internalCampaign: link
            }
        });
    };
}

export default ContentModalBindings;
