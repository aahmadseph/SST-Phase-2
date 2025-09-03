const socialInfoReducer = require('reducers/socialInfo').default;
const ACTION_TYPES = require('actions/SocialInfoActions').default.TYPES;

describe('social info reducer', () => {
    it('should set user social info', () => {
        const NEW_STATE_VALUE = { info: 'hello, world' };
        const newState = socialInfoReducer(
            {},
            {
                type: ACTION_TYPES.SET_USER_SOCIAL_INFO,
                socialInfo: NEW_STATE_VALUE
            }
        );
        expect(newState).toEqual(NEW_STATE_VALUE);
    });
});
