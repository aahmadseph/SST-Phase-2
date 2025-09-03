import { FETCH_PREFERENCES_SUCCESS } from 'constants/actionTypes/mailingPrefs';

const initialState = {
    mailingPreferences: {
        notificationsAndReminders: null,
        postalMail: null,
        promotionalEmail: null
    }
};

const reducer = function (state = initialState, action = {}) {
    switch (action.type) {
        case FETCH_PREFERENCES_SUCCESS:
            return {
                ...state,
                mailingPreferences: action.payload.mailingPreferences
            };
        default:
            return state;
    }
};

export default reducer;
