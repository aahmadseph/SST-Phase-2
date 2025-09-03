describe('ResetSessionExpiry Actions', () => {
    const Actions = require('actions/ResetSessionExpiryActions').default;
    let result;

    describe('resetSessionExpiry', () => {
        beforeEach(() => {
            result = Actions.resetSessionExpiry();
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.RESET_SESSION_EXPIRY);
        });
    });
});
