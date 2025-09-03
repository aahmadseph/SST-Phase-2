import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

const {
    PAGE_TYPES: { CONTENT_STORE },
    PAGE_DETAIL: { BEAUTY_OFFERS }
} = anaConsts;

function fireModalTracking(internalCampaign) {
    const world = 'see detail modal';
    const pageName = `${CONTENT_STORE}:${BEAUTY_OFFERS}:${world}:*`;
    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
        data: {
            pageName,
            pageType: 'contentstore',
            pageDetail: 'beauty-offers',
            world: 'see detail modal',
            internalCampaign
        }
    });
}

export default { fireModalTracking };
