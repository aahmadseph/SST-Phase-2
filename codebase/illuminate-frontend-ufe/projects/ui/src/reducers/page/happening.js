import {
    SET_HAPPENING, SET_HAPPENING_NON_CONTENT, RESET_HAPPENING_IS_INITIALIZED, SET_FILTERED_EVENTS
} from 'constants/actionTypes/happening';
import ContentConstants from 'constants/content';

const { RENDERING_TYPE } = ContentConstants;

const initialState = {
    content: null,
    isInitialized: false
};

const reducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SET_HAPPENING: {
            return {
                content: payload?.data,
                isInitialized: true
            };
        }

        case SET_HAPPENING_NON_CONTENT: {
            return {
                content: payload?.data,
                isInitialized: true
            };
        }

        case SET_FILTERED_EVENTS: {
            const nextState = {
                ...state,
                content: {
                    ...state.content,
                    layout: {
                        ...state.content.layout,
                        content: state.content.layout?.content?.map(element =>
                            element.renderingType === RENDERING_TYPE.HAPPENING_EVENTS_GRID
                                ? {
                                    ...element,
                                    items: payload?.data?.items,
                                    refinements: payload?.data?.refinements
                                }
                                : element
                        )
                    }
                },
                isInitialized: true
            };

            return nextState;
        }

        case RESET_HAPPENING_IS_INITIALIZED: {
            return {
                ...state,
                isInitialized: false
            };
        }

        default: {
            return state;
        }
    }
};

export default {
    reducer,
    initialState
};
