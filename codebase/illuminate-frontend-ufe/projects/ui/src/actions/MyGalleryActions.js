import { SET_GALLERY_PROFILE_CONTENT } from 'constants/actionTypes/myProfile';
const data = {};

function setGalleryProfileContent(payload) {
    return {
        type: SET_GALLERY_PROFILE_CONTENT,
        payload
    };
}

const isNewPage = () => true;

const openPage =
    ({ events: { onPageUpdated, onDataLoaded, _onError } }) =>
        dispatch => {
            onDataLoaded(data);
            dispatch(setGalleryProfileContent(data));
            onPageUpdated(data);
        };

const updatePage = () => {};

export default {
    isNewPage,
    openPage,
    updatePage
};
