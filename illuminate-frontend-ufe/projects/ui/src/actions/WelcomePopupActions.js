import welcomeMatReducer from 'reducers/welcomeMat';
const { ACTION_TYPES: TYPES } = welcomeMatReducer;

export default {
    TYPES,
    updateWelcome: function ({ welcomeMat, fromCache }) {
        return {
            type: TYPES.UPDATE_WELCOME,
            welcomeMat,
            fromCache
        };
    }
};
