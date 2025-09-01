import { SET_USER_FAVORITE_BRANDS } from 'constants/actionTypes/brandsList';

function setUserFavoriteBrandIDs(userFavoriteBrandIDs) {
    return {
        type: SET_USER_FAVORITE_BRANDS,
        payload: { userFavoriteBrandIDs }
    };
}

export default { setUserFavoriteBrandIDs };
