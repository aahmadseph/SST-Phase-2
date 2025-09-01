import resetSessionExpiryReducer from 'reducers/resetSessionExpiry';
const { ACTION_TYPES: TYPES } = resetSessionExpiryReducer;

function resetSessionExpiry() {
    return { type: TYPES.RESET_SESSION_EXPIRY };
}

export default {
    TYPES,
    resetSessionExpiry
};
