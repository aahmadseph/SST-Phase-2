import utils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';

export default function () {
    const currentEvent = utils.getMostRecentEvent(anaConsts.ASYNC_PAGE_LOAD);
    const pageType = 'reviews';
    const pageDetail = 'ratings&reviews-highly rated modal';
    const pageName = `${pageType}:${pageDetail}:n/a:*`;

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: {
                context: anaConsts.PAGE_TYPES.HIGHLIGHTED_REVIEWS,
                eventName: anaConsts.HIGHLIGHTED_REVIEWS_MODAL,
                pageName,
                pageType,
                pageDetail
            }
        }
    });
}
