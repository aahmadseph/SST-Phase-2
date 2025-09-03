import { initialState } from 'reducers/page';
import { MERGE_PAGE_DATA, SET_PAGE_DATA, SHOW_SPA_PAGE_LOAD_PROGRESS } from 'constants/actionTypes/page';
import pageReducer from 'reducers/page';

describe('Page reducer', () => {
    test('should return a new state for SET_PAGE_DATA action', () => {
        // Arrange
        const action = {
            type: SET_PAGE_DATA,
            payload: { fieldOne: 'fieldOne' }
        };

        // Act
        const newState = pageReducer(initialState, action);

        // Assert
        expect(newState).toStrictEqual(action.payload);
    });

    test('should return a new state for MERGE_PAGE_DATA action', () => {
        // Arrange
        const mergePageDataAction = {
            type: SET_PAGE_DATA,
            payload: { fieldOne: 'fieldOne' }
        };
        const intermediateState = pageReducer(initialState, mergePageDataAction);
        const setPageDataAction = {
            type: MERGE_PAGE_DATA,
            payload: { fieldTwo: 'fieldTwo' }
        };
        const state = {
            ...mergePageDataAction.payload,
            ...setPageDataAction.payload
        };

        // Act
        const newState = pageReducer(intermediateState, setPageDataAction);

        // Assert
        expect(newState).toStrictEqual(state);
    });

    test('should return a new state for SHOW_SPA_PAGE_LOAD_PROGRESS action', () => {
        // Arrange
        const showPageLoadProgressAction = {
            type: SHOW_SPA_PAGE_LOAD_PROGRESS,
            payload: true
        };

        // Act
        const newState = pageReducer(initialState, showPageLoadProgressAction);

        // Assert
        expect(newState.showLoadSpaPageProgress).toBeTruthy();
    });
});
