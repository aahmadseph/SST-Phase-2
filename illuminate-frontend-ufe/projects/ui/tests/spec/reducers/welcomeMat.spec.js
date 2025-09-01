const welcomeMatReducer = require('reducers/welcomeMat').default;
const ACTION_TYPES = require('actions/WelcomePopupActions').default.TYPES;

describe('Welcome Mat Reducer', () => {
    it('should return the initial state', () => {
        expect(welcomeMatReducer(undefined, {})).toEqual({});
    });

    it('should update the state with a welcomeMat object', () => {
        const initialState = {};

        const newState = welcomeMatReducer(initialState, {
            type: ACTION_TYPES.UPDATE_WELCOME,
            welcomeMat: { country: 'CR' },
            fromCache: false
        });

        expect(newState).toEqual({ country: 'CR', fromCache: false });
    });
});
