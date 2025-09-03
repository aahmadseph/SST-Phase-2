const Storage = require('utils/localStorage/Storage').default;
const userUtils = require('utils/User').default;
const RrcTermsAndConditions = require('utils/RrcTermsAndConditions').default;
const Constants = require('utils/localStorage/Constants').default;

describe('RrcTermsAndConditions', () => {
    describe('method', () => {
        const userProfileId = '0';

        beforeEach(() => {
            spyOn(userUtils, 'getProfileId').and.returnValue(userProfileId);
        });

        describe('persistAcceptance', () => {
            const { persistAcceptance } = RrcTermsAndConditions;
            const localStorage = Storage.local;

            beforeEach(() => {
                localStorage.removeItem(Constants.RRC_TERMS_CONDITIONS_ACCEPTED);
            });

            it('should have called localStorage.setItem', () => {
                const setItemStub = spyOn(localStorage, 'setItem');
                persistAcceptance();

                expect(setItemStub).toHaveBeenCalled();
            });

            it('should have stored passed value in localStorage', () => {
                const value = true;
                persistAcceptance(value);

                const actual = localStorage.getItem(Constants.RRC_TERMS_CONDITIONS_ACCEPTED);
                const expected = {
                    isAccepted: value,
                    userProfileId: userProfileId
                };

                expect(actual).toEqual(expected);
            });
        });

        describe('persistAcceptanceCheck', () => {
            const { persistAcceptanceCheck } = RrcTermsAndConditions;
            const localStorage = Storage.local;

            beforeEach(() => {
                localStorage.removeItem(Constants.RRC_TERMS_CONDITIONS_CHECKED);
            });

            it('should have called localStorage.setItem', () => {
                const setItemStub = spyOn(localStorage, 'setItem');
                persistAcceptanceCheck();

                expect(setItemStub).toHaveBeenCalled();
            });

            it('should have stored passed value in localStorage', () => {
                const value = true;
                persistAcceptanceCheck(value);

                const actual = localStorage.getItem(Constants.RRC_TERMS_CONDITIONS_CHECKED);
                const expected = {
                    isChecked: value,
                    userProfileId: userProfileId
                };

                expect(actual).toEqual(expected);
            });
        });

        describe('areRRCTermsConditionsAccepted', () => {
            const { persistAcceptance, areRRCTermsConditionsAccepted } = RrcTermsAndConditions;
            beforeEach(() => {
                localStorage.removeItem(Constants.RRC_TERMS_CONDITIONS_ACCEPTED);
            });

            it('it should return false if value is not set on storage', () => {
                expect(areRRCTermsConditionsAccepted()).toBeFalsy();
            });

            it('it should return true if value is set on storage', () => {
                persistAcceptance(true);
                expect(areRRCTermsConditionsAccepted()).toBeTruthy();
            });
        });

        describe('areRRCTermsConditionsChecked', () => {
            const { persistAcceptanceCheck, areRRCTermsConditionsChecked } = RrcTermsAndConditions;
            beforeEach(() => {
                localStorage.removeItem(Constants.RRC_TERMS_CONDITIONS_CHECKED);
            });

            it('it should return false if value is not set on storage', () => {
                expect(areRRCTermsConditionsChecked()).toBeFalsy();
            });

            it('it should return true if value is set on storage', () => {
                persistAcceptanceCheck(true);
                expect(areRRCTermsConditionsChecked()).toBeTruthy();
            });
        });
    });
});
