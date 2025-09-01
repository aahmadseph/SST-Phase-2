describe('Social Info Actions', () => {
    const socialInfoActions = require('actions/SocialInfoActions').default;
    let actionReturnValue;

    describe('Set users social info', () => {
        const userSocialInfo = 'The user social info';

        beforeEach(() => {
            actionReturnValue = socialInfoActions.setUserSocialInfo(userSocialInfo);
        });

        it('should return the action type', () => {
            expect(actionReturnValue.type).toEqual(socialInfoActions.TYPES.SET_USER_SOCIAL_INFO);
        });

        it('should set the user social information', () => {
            expect(actionReturnValue.socialInfo).toEqual(userSocialInfo);
        });
    });

    describe('Set lithium success status', () => {
        beforeEach(() => {
            actionReturnValue = socialInfoActions.setLithiumSuccessStatus(true);
        });

        it('should return the action type', () => {
            expect(actionReturnValue.type).toEqual(socialInfoActions.TYPES.SET_LITHIUM_SUCCESS_STATUS);
        });

        it('should set the status as true', () => {
            expect(actionReturnValue.isLithiumSuccessful).toBeTruthy();
        });

        it('should set status as false', () => {
            actionReturnValue = socialInfoActions.setLithiumSuccessStatus(false);
            expect(actionReturnValue.isLithiumSuccessful).toBeFalsy();
        });
    });
});
