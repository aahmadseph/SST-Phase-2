var profileReducer = require('reducers/profile').default;
import { UPDATE_BI_ACCOUNT, SET_CUSTOMER_LIMIT } from 'constants/actionTypes/profile';

describe('profile reducer', () => {
    it('should return the initial state', () => {
        expect(profileReducer(undefined, {})).toEqual({
            biAccount: null,
            accountHistorySlice: null,
            showSavedMessage: false,
            customerLimit: {
                currency: null,
                balance: {
                    initial: null,
                    initialExpiryDate: null,
                    totalSpend: null,
                    available: null
                },
                error: null // Updated to reflect the new error structure in the reducer
            }
        });
    });

    it('should update Bi Account in state', () => {
        const initialState = { biAccount: [0, 1, 2] };
        const newState = profileReducer(initialState, {
            type: UPDATE_BI_ACCOUNT,
            biAccount: [2, 1, 0],
            showSavedMessage: true
        });
        expect(newState).toEqual({ biAccount: [2, 1, 0] });
    });

    it('should set customer limit in state', () => {
        const initialState = { customerLimit: {} };
        const newState = profileReducer(initialState, {
            type: SET_CUSTOMER_LIMIT,
            payload: {
                currency: 'USD',
                balance: {
                    initial: 1000,
                    initialExpiryDate: '2024-12-31',
                    totalSpend: 500,
                    available: 500
                }
            }
        });

        expect(newState).toEqual({
            ...initialState,
            customerLimit: {
                currency: 'USD',
                balance: {
                    initial: 1000,
                    initialExpiryDate: '2024-12-31',
                    totalSpend: 500,
                    available: 500
                },
                error: null // Ensuring error is null on successful fetch
            }
        });
    });
});
