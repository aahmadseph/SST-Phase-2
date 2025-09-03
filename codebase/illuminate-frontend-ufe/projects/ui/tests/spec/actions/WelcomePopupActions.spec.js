describe('Welcome Popup Actions', () => {
    const Actions = require('actions/WelcomePopupActions').default;
    describe('update welcomeMat object', () => {
        let result;

        const welcomeMat = { country: 'CR' };

        beforeEach(() => {
            result = Actions.updateWelcome({ welcomeMat });
        });

        it('should return a TYPE of UPDATE_WELCOME', () => {
            expect(result.type).toEqual(Actions.TYPES.UPDATE_WELCOME);
        });

        it('should return the welcomeMat object', () => {
            expect(result.welcomeMat).toEqual(welcomeMat);
        });
    });
});
