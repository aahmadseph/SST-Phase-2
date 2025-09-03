import utils from 'analytics/utils';
import deepExtend from 'utils/deepExtend';
import anaConsts from 'analytics/constants';

const LINK_INFO = {
    CLICK_SIZE: 'product:alt-image:swatch:size',
    CLICK_COLOR: 'product:alt-image:swatch:click',
    VIEW_MORE: 'product:alt-image:view more',
    VIEW_LESS: 'product:alt-image:view less'
};

const SPEC_EVENT_NAME = {
    VIDEO: 'video_click'
};

export default (function () {
    const pageToggleColorSwatchBindings = function (data) {
        const currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
        deepExtend(currentEvent, {
            eventInfo: {
                attributes: {
                    linkName: 'D=c55',
                    actionInfo: data.isExpand ? LINK_INFO.VIEW_MORE : LINK_INFO.VIEW_LESS,
                    eventStrings: [anaConsts.Event.EVENT_71]
                }
            }
        });
    };

    const modalVideoClickBindings = function (videoItem, specificEventName) {
        return {
            specificEventName,
            linkName: anaConsts.LinkData.VIDEO_POPUP,
            actionInfo: anaConsts.LinkData.VIDEO_POPUP,
            eventStrings: [anaConsts.Event.EVENT_71, anaConsts.Event.EVENT_102],
            videoName: [digitalData.page.attributes.sephoraPageInfo.pageName, videoItem.videoTitle, videoItem.filePath].join('_'),
            eVar63: 'D=g',
            internalCampaign: 'product_' + digitalData.product[0].attributes.world + '_video'
        };
    };

    return {
        pageToggleColorSwatchBindings,
        modalVideoClickBindings,
        LINK_INFO: LINK_INFO,
        SPEC_EVENT_NAME: SPEC_EVENT_NAME
    };
}());
