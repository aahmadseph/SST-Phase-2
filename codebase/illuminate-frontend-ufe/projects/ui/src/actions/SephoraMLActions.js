import { SET_BESTSELLERS_RECS, SET_BESTSELLERS_RECS_ERR, RESET_BESTSELLERS_RECS } from 'constants/actionTypes/sephoraML';
import getBeautyBestSellersML from 'services/api/SephoraML/getBeautyBestSellersML';

function updateBestSellersRecs(data) {
    return {
        type: SET_BESTSELLERS_RECS,
        payload: data
    };
}

function updateBestSellersRecsError(err) {
    return {
        type: SET_BESTSELLERS_RECS_ERR,
        payload: err
    };
}

function resetBestSellersRecsFetch() {
    return {
        type: RESET_BESTSELLERS_RECS
    };
}

function getBestSellersRecs({ userId, catId }) {
    return dispatch => {
        dispatch(resetBestSellersRecsFetch());

        return getBeautyBestSellersML({
            userId,
            catId
        })
            .then(data => dispatch(updateBestSellersRecs(data)))
            .catch(err => dispatch(updateBestSellersRecsError(err)));
    };
}

export default { getBestSellersRecs };
