/* eslint-disable no-case-declarations */
import { SET_RECOMMENDATIONS, SET_RECOMMENDATIONS_FAILURE } from 'constants/actionTypes/recommendationsService';

const initialState = {
    recommendations: {},
    error: null
};

export default function recommendationsService(state = initialState, action) {
    const payload = action.payload;

    switch (action.type) {
        case SET_RECOMMENDATIONS:
            const { resultId, response } = payload;
            const { id, displayName } = response?.pod;

            return Object.assign({}, state, {
                recommendations: {
                    ...state.recommendations,
                    [id]: {
                        displayName,
                        resultId,
                        recommendations: response?.results || [],
                        totalNumResults: response?.totalNumResults || response?.results?.length || 0,
                        podId: id
                    }
                }
            });

        case SET_RECOMMENDATIONS_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }
}
