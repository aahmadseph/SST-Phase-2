import { SET_BESTSELLERS_RECS, SET_BESTSELLERS_RECS_ERR, RESET_BESTSELLERS_RECS } from 'constants/actionTypes/sephoraML';

const ACTION_TYPES = { SET_BESTSELLERS_RECS, SET_BESTSELLERS_RECS_ERR, RESET_BESTSELLERS_RECS };

const labelBestsellersState = state => ({ bestSellers: state });

const initialState = labelBestsellersState({ fetchFailed: null });

const reducer = function (state = initialState, { type, payload }) {
    switch (type) {
        case SET_BESTSELLERS_RECS: {
            return labelBestsellersState({
                fetchFailed: false,
                ...payload
            });
        }

        case SET_BESTSELLERS_RECS_ERR: {
            return labelBestsellersState({
                fetchFailed: true,
                ...payload
            });
        }

        case RESET_BESTSELLERS_RECS: {
            return initialState;
        }

        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
