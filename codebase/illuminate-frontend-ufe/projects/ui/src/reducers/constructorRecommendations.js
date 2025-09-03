const ACTION_TYPES = {
    UPDATE_RECOMMENDATIONS: 'UPDATE_RECOMMENDATIONS',
    UPDATE_REQUEST_DATA: 'UPDATE_REQUEST_DATA',
    SET_LOADING: 'SET_LOADING'
};

const initialState = {
    constructorRecommendations: {},
    constructorRequestData: {
        params: {},
        podId: '',
        isCollection: false
    }
};

const reducer = function (state = initialState, action) {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_RECOMMENDATIONS: {
            const data = action.payload;
            const {
                podId, constructorTitle, constructorRecommendations, isError = false, isEmpty = false, totalResults, resultId
            } = data;

            return Object.assign({}, state, {
                constructorRecommendations: {
                    ...state.constructorRecommendations,
                    [podId]: {
                        constructorTitle,
                        constructorRecommendations,
                        isError,
                        isEmpty,
                        totalResults,
                        resultId,
                        isLoading: false
                    }
                }
            });
        }
        case ACTION_TYPES.UPDATE_REQUEST_DATA: {
            return Object.assign({}, state, {
                constructorRequestData: action.payload
            });
        }
        case ACTION_TYPES.SET_LOADING: {
            const { podId, isLoading } = action.payload;

            return Object.assign({}, state, {
                constructorRecommendations: {
                    ...state.constructorRecommendations,
                    [podId]: {
                        ...state.constructorRecommendations[podId],
                        isLoading
                    }
                }
            });
        }
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
