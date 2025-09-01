import { SET_USER_PUBLIC_GALLERY_PROFILE_CONTENT } from 'constants/actionTypes/userPublicGallery';
const data = {};

function setUserPublicGalleryContent(payload) {
    return {
        type: SET_USER_PUBLIC_GALLERY_PROFILE_CONTENT,
        payload
    };
}

const isNewPage = () => true;

const openPage =
    ({ events: { onPageUpdated, onDataLoaded, _onError } }) =>
        dispatch => {
            onDataLoaded(data);
            dispatch(setUserPublicGalleryContent(data));
            onPageUpdated(data);
        };

const updatePage = () => {};

export default {
    isNewPage,
    openPage,
    updatePage
};
