import CommunityPageBindings from 'analytics/bindingMethods/pages/community/CommunityPageBindings';
import anaConsts from 'analytics/constants';

const {
    Event: {
        EVENT_102, EVENT_103, EVENT_104, EVENT_105, EVENT_106, EVENT_107
    }
} = anaConsts;
const playerEvents = {};
const initialEvents = {
    PLAY: false,
    PERCENT_25: false,
    PERCENT_50: false,
    PERCENT_75: false,
    PERCENT_100: false
};
const videoEventListener = activeItem => {
    const video = document.getElementById(activeItem?.album_photo_id);

    if (video) {
        playerEvents[activeItem?.album_photo_id] = { ...initialEvents };
        const {
            album_photo_id: albumId, content_type: contentType, user_name: userName, source, products, loves, categories, title
        } = activeItem;
        const eVar129Params = {
            albumId,
            contentType,
            isIncentivized: categories?.includes('Incentivized'),
            userName,
            source,
            products,
            loves: loves?.count || 0
        };
        let isVideoSeeking = false;
        video.addEventListener('seeking', () => {
            isVideoSeeking = true;
        });
        video.addEventListener('seeked', () => {
            isVideoSeeking = false;
        });
        video.addEventListener('timeupdate', data => {
            if (!isVideoSeeking) {
                const currentTime = data.target.currentTime;
                const duration = data.target.duration;
                const progress = Math.floor((currentTime / duration) * 100);
                const currentEvents = playerEvents[activeItem?.album_photo_id];

                switch (progress) {
                    case 0:
                    case 1:
                        if (!currentEvents.PLAY) {
                            currentEvents.PLAY = true;
                            CommunityPageBindings.setVideoPlayAnalytics(title, albumId, eVar129Params, [EVENT_102, EVENT_107]);
                        }

                        break;

                    case 25:
                    case 26:
                        if (!currentEvents.PERCENT_25) {
                            currentEvents.PERCENT_25 = true;
                            CommunityPageBindings.setVideoPlayAnalytics(title, albumId, eVar129Params, [EVENT_103]);
                        }

                        break;

                    case 50:
                    case 51:
                        if (!currentEvents.PERCENT_50) {
                            currentEvents.PERCENT_50 = true;
                            CommunityPageBindings.setVideoPlayAnalytics(title, albumId, eVar129Params, [EVENT_104]);
                        }

                        break;

                    case 75:
                    case 76:
                        if (!currentEvents.PERCENT_75) {
                            currentEvents.PERCENT_75 = true;
                            CommunityPageBindings.setVideoPlayAnalytics(title, albumId, eVar129Params, [EVENT_105]);
                        }

                        break;

                    case 99:
                    case 100:
                        if (!currentEvents.PERCENT_100) {
                            currentEvents.PERCENT_100 = true;
                            CommunityPageBindings.setVideoPlayAnalytics(title, albumId, eVar129Params, [EVENT_106]);
                        }

                        break;

                    default:
                        break;
                }
            }
        });
    }
};

export default {
    videoEventListener
};
