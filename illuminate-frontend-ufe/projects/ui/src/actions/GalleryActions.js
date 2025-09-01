import { SET_GALLERY_CONTENT, SET_GALLERY_BANNER_CONTENT } from 'constants/actionTypes/gallery';
import { getContent } from 'services/api/Content/getContent';

const data = {};

function setGalleryContent(payload) {
    return {
        type: SET_GALLERY_CONTENT,
        payload
    };
}

function loadCmsContent(dispatch) {
    const { country, language } = Sephora.renderQueryParams;

    getContent({
        country,
        language,
        path: '/gallery/allGallery'
    }).then(response => {
        if (response.responseStatus === 200) {
            const { data: banner } = response;
            dispatch({ type: SET_GALLERY_BANNER_CONTENT, payload: { banner } });
        }
    });
}

const isNewPage = () => true;

const openPage =
    ({ events: { onPageUpdated, onDataLoaded, _onError } }) =>
        dispatch => {
            onDataLoaded(data);
            dispatch(setGalleryContent(data));
            onPageUpdated(data);
            loadCmsContent(dispatch);
        };

const updatePage = () => {};

export default {
    isNewPage,
    openPage,
    updatePage
};
