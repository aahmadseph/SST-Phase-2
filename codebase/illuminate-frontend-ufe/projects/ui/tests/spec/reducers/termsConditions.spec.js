const termsConditionsReducer = require('reducers/termsConditions').default;
const ACTION_TYPES = require('actions/TermsAndConditionsActions').default.TYPES;

describe('Terms and Conditions Reducer', () => {
    it('should return the initial state', () => {
        expect(termsConditionsReducer(undefined, {})).toEqual({
            isOpen: false,
            mediaId: '',
            title: '',
            message: '',
            isRRCTermsAndConditions: false,
            isRRCTermsAndConditionsChecked: false,
            callback: null
        });
    });

    it('should update the state to display the modal', () => {
        const initialState = {};

        const newState = termsConditionsReducer(initialState, {
            type: ACTION_TYPES.SHOW_TERMS_CONDITIONS_MODAL,
            isOpen: true,
            mediaId: '757575',
            title: 'TC Modal Title',
            message: '',
            callback: null
        });

        expect(newState).toEqual({
            isOpen: true,
            mediaId: '757575',
            title: 'TC Modal Title',
            callback: null
        });
    });

    it('should update the state to display the custom modal', () => {
        const initialState = {};

        const newState = termsConditionsReducer(initialState, {
            type: ACTION_TYPES.SHOW_CUSTOM_TERMS_CONDITIONS_MODAL,
            isOpen: true,
            mediaId: '',
            title: 'TC Modal Title',
            message: 'TC message'
        });

        expect(newState).toEqual({
            isOpen: true,
            title: 'TC Modal Title',
            message: 'TC message'
        });
    });
});
