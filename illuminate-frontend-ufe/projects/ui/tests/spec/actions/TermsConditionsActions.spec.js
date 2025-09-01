describe('Terms and Conditions Actions', () => {
    const Actions = require('actions/TermsAndConditionsActions').default;
    let result;

    describe('update the terms and conditions object', () => {
        const modalId = '757575';
        const title = 'TC Modal Title';

        beforeEach(() => {
            result = Actions.showModal(true, modalId, title);
        });

        it('should return a TYPE of SHOW_TERMS_CONDITIONS_MODAL', () => {
            expect(result.type).toEqual(Actions.TYPES.SHOW_TERMS_CONDITIONS_MODAL);
        });

        it('should return the termsConditions paramenters', () => {
            expect(result.isOpen).toBeTruthy();
            expect(result.mediaId).toBe(modalId);
            expect(result.title).toBe(title);
        });
    });

    describe('Show custom modal', () => {
        const title = 'TC Custom Modal Title';
        const message = 'TC Custom Modal Message';

        beforeEach(() => {
            result = Actions.showCustomModal(true, title, message);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.SHOW_CUSTOM_TERMS_CONDITIONS_MODAL);
        });

        it('should set the modal title', () => {
            expect(result.title).toEqual(title);
        });

        it('should set the modal message', () => {
            expect(result.message).toEqual(message);
        });

        it('should open the modal', () => {
            expect(result.isOpen).toBeTruthy();
        });

        it('should close the modal', () => {
            result = Actions.showCustomModal(false);
            expect(result.isOpen).toBeFalsy();
        });
    });
});
