import { SET_TLP_PAGE } from 'constants/actionTypes/tlp';
const data = {};

function setTlpPageData(payload) {
    return {
        type: SET_TLP_PAGE,
        payload
    };
}

const isNewPage = () => true;

const openPage =
    ({ events: { onPageUpdated, onDataLoaded, _onError } }) =>
        dispatch => {
            onDataLoaded(data);
            dispatch(setTlpPageData(data));
            onPageUpdated(data);
        };

const updatePage = () => {};

export default {
    isNewPage,
    openPage,
    updatePage
};
