import Actions from 'Actions';
import GalleryConstants from 'utils/GalleryConstants';
import CommunityGalleryBindings from 'analytics/bindingMethods/pages/community/CommunityGalleryBindings';

const { loveInteractions } = GalleryConstants;

const displayGalleryLightBoxModal = ({
    isGalleryCarousel, display, activeItem, galleryItems, isPdpCarousel, sharedItem = null
}) => {
    return Actions.showGalleryLightBoxModal({
        isGalleryCarousel,
        isOpen: display,
        activeItem,
        galleryItems,
        isPdpCarousel,
        sharedItem
    });
};
const dispatchGalleryGridData = payload => {
    return {
        type: 'SET_GALLERY_GRID_DATA',
        payload
    };
};

const dispatchCarouselGalleryData = payload => {
    return {
        type: 'SET_CAROUSEL_GALLERY_DATA',
        payload
    };
};

const dispatchActiveGalleryItemIndex = payload => {
    return {
        type: 'SET_ACTIVE_GALLERY_ITEM_INDEX',
        payload
    };
};

const dispatchSetLoveCountCarousel = payload => {
    return {
        type: 'SET_LOVE_COUNT_IN_CAROUSEL',
        payload
    };
};

const dispatchSetLoveCountGrid = payload => {
    return {
        type: 'SET_LOVE_COUNT_GALLERY_ITEM',
        payload
    };
};

const setActiveGalleryItemIndex = data => dispatch => {
    dispatch(dispatchActiveGalleryItemIndex(data));
};

const setCarouselGallery = data => dispatch => {
    dispatch(dispatchCarouselGalleryData(data));
};

const toggleGalleryLightBox = data => dispatch => {
    dispatch(displayGalleryLightBoxModal(data));
};

const setLovesOnItems =
    ({ currentItem, action, isGalleryCarousel }) =>
        dispatch => {
            let updatedItem = {};

            if (action === loveInteractions.LOVE) {
                updatedItem = {
                    ...currentItem,
                    loves: {
                        count: (currentItem.loves?.count || 0) + 1,
                        isLovedByCurrentUser: true
                    }
                };
            } else if (action === loveInteractions.UNLOVE) {
                updatedItem = {
                    ...currentItem,
                    loves: {
                        count: (currentItem.loves?.count || 0) - 1,
                        isLovedByCurrentUser: false
                    }
                };
            }

            if (isGalleryCarousel) {
                dispatch(dispatchSetLoveCountCarousel(updatedItem));
            } else {
                dispatch(dispatchSetLoveCountGrid(updatedItem));
            }
        };

const setGalleryGridItems = data => dispatch => {
    dispatch(dispatchGalleryGridData(data));
};

const showItemZoomModal = mediaItems => dispatch => {
    dispatch(Actions.showProductMediaZoomModal(true, undefined, 0, mediaItems, true));
};

const toggleGalleryLightBoxKebabModal =
    ({ isOpen, photoId = '', isLoggedInUserPhoto = false }) =>
        dispatch => {
            dispatch(displayGalleryLightBoxModal({ display: false }));
            dispatch(
                Actions.showGalleryLightBoxKebabModal({
                    isOpen,
                    photoId,
                    isLoggedInUserPhoto
                })
            );
        };

const shareLink = (url, shareSubTitle) => dispatch => {
    dispatch(
        Actions.showGalleryLightBoxKebabModal({
            isOpen: false
        })
    );
    dispatch(Actions.showShareLinkModal(true, '', url, shareSubTitle, true));
};

const toggleReportContentModal = ({ isOpen, shareUrl = '', photoId }) => {
    if (isOpen) {
        CommunityGalleryBindings.reportPhoto({ photoId });
    }

    return dispatch => {
        dispatch(
            Actions.showGalleryLightBoxKebabModal({
                isOpen: false
            })
        );
        dispatch(Actions.showReportContentModal({ isOpen, shareUrl }));
    };
};

const deleteContentModal = (title, message, buttonText, cancelText, callback) => dispatch => {
    dispatch(
        Actions.showGalleryLightBoxKebabModal({
            isOpen: false
        })
    );
    dispatch(Actions.showReportContentModal({ isOpen: false }));
    dispatch(
        Actions.showInfoModal({
            isOpen: true,
            title,
            message,
            buttonText,
            showCancelButton: true,
            cancelText,
            callback
        })
    );
};

const trackDeletion = ({ photoId }) => {
    CommunityGalleryBindings.deletePhoto({ photoId });
};

const deleteContentModalConfirmation = (title, message, buttonText) => dispatch => {
    dispatch(
        Actions.showInfoModal({
            isOpen: true,
            title,
            message,
            buttonText
        })
    );
};

export default {
    toggleGalleryLightBox,
    setGalleryGridItems,
    setCarouselGallery,
    setActiveGalleryItemIndex,
    showItemZoomModal,
    setLovesOnItems,
    toggleGalleryLightBoxKebabModal,
    shareLink,
    toggleReportContentModal,
    deleteContentModal,
    deleteContentModalConfirmation,
    trackDeletion
};
