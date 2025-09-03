import { SET_RMN_BANNERS_MAIN, CLEAR_RMN_BANNERS } from 'constants/actionTypes/rmnBanners';
import Empty from 'constants/empty';

const initialState = Empty.Object;

const reducer = function (state = initialState, action) {
    const { rmnBanners } = action.payload || Empty.Object;

    switch (action.type) {
        case SET_RMN_BANNERS_MAIN:
            return {
                ...state,
                contextId: rmnBanners.contextId,
                targets: rmnBanners?.data?.targets,
                [rmnBanners.slot]: {
                    ...rmnBanners.data
                }
            };
        case CLEAR_RMN_BANNERS:
            return initialState;
        default:
            return state;
    }
};

reducer.ACTION_TYPES = { SET_RMN_BANNERS_MAIN, CLEAR_RMN_BANNERS };

export default reducer;
