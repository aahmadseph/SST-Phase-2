import constructorRecommendations from 'reducers/constructorRecommendations';
const { ACTION_TYPES: TYPES } = constructorRecommendations;

function updateConstructorRecommendations(recommendations) {
    return {
        type: TYPES.UPDATE_RECOMMENDATIONS,
        payload: recommendations
    };
}

function updateRequestData(requestData) {
    return {
        type: TYPES.UPDATE_REQUEST_DATA,
        payload: requestData
    };
}

function setLoading({ podId, isLoading }) {
    return {
        type: TYPES.SET_LOADING,
        payload: { podId, isLoading }
    };
}

export default {
    TYPES,
    updateConstructorRecommendations,
    updateRequestData,
    setLoading
};
