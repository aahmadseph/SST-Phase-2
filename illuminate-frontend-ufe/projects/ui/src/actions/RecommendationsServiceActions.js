import { SET_RECOMMENDATIONS, SET_RECOMMENDATIONS_FAILURE } from 'constants/actionTypes/recommendationsService';
import getProductRecommendations from 'services/api/productRecommendations/getProductRecommendations';
import Empty from 'constants/empty';
import GraphQLException from 'exceptions/GraphQLException';

export function fetchRecommendations(payload = {}) {
    return async dispatch => {
        try {
            const { recommendations } = await getProductRecommendations(payload);

            dispatch({
                type: SET_RECOMMENDATIONS,
                payload: recommendations || Empty.Object
            });

            return recommendations || Empty.Object;
        } catch (error) {
            return dispatch({
                type: SET_RECOMMENDATIONS_FAILURE,
                payload: {
                    error:
                        error instanceof GraphQLException
                            ? error
                            : {
                                message: error.message || 'An error occurred while fetching product recommendations',
                                status: 500
                            }
                }
            });
        }
    };
}

export default {
    fetchRecommendations
};
