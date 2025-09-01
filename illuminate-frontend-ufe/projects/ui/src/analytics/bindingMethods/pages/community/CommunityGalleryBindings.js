import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const {
    EVENT_NAMES: { GALLERY },
    SOT_LINK_TRACKING_EVENT
} = anaConsts;

class CommunityGalleryBindings {
    static triggerSOTAnalytics = ({ eventName, ...data }) => {
        const eventData = {
            data: {
                linkName: eventName,
                actionInfo: eventName,
                specificEventName: eventName,
                ...data
            }
        };

        processEvent.process(SOT_LINK_TRACKING_EVENT, eventData);
    };

    static reportPhoto = ({ photoId }) => {
        const { REPORT_PHOTO } = GALLERY;
        CommunityGalleryBindings.triggerSOTAnalytics({
            eventName: REPORT_PHOTO,
            photoId
        });
    };

    static deletePhoto = ({ photoId }) => {
        const { DELETE_PHOTO } = GALLERY;
        CommunityGalleryBindings.triggerSOTAnalytics({
            eventName: DELETE_PHOTO,
            photoId
        });
    };

    static ugcNext = () => {
        const { PHOTO_CHANGE } = GALLERY;
        CommunityGalleryBindings.triggerSOTAnalytics({
            eventName: PHOTO_CHANGE
        });
    };

    static ugcScrollMore = () => {
        const { SCROLL } = GALLERY;
        CommunityGalleryBindings.triggerSOTAnalytics({
            eventName: SCROLL
        });
    };

    static ugcProductSwipe = () => {
        const { SWIPE } = GALLERY;
        CommunityGalleryBindings.triggerSOTAnalytics({
            eventName: SWIPE
        });
    };

    static ugcImageClick = () => {
        const { IMAGE_CLICK } = GALLERY;
        CommunityGalleryBindings.triggerSOTAnalytics({
            eventName: IMAGE_CLICK
        });
    };
}

export default CommunityGalleryBindings;
