const SpaUtils = require('utils/Spa').default;
const store = require('Store').default;
const userActions = require('actions/UserActions').default;

const { createSpy } = jasmine;

describe('SPA utils', () => {
    describe('getSpaTemplateInfoByUrl function', () => {
        it('should return info for the product page url', () => {
            // Arrange
            const url = '/product/alpha-beta-peel-extra-strength-daily-peel-P269122';

            // Act
            const result = SpaUtils.getSpaTemplateInfoByUrl(url);

            // Assert
            expect(result).toBeDefined();
        });

        it('should return info object for the brand page url', () => {
            // Arrange
            const url = '/brand/milk-makeup';

            // Act
            const result = SpaUtils.getSpaTemplateInfoByUrl(url);

            // Assert
            expect(result).toBeDefined();
        });
    });

    describe('isSpaNavigation', () => {
        beforeEach(() => {
            Sephora.isSPA = true;
            Sephora.configurationSettings.spaEnabled = true;
        });

        it('should return true if it is spa template, spaEnabled, both current and next pages are activeSpaPages', () => {
            spyOn(SpaUtils, 'currentPageIsActiveSpaPage').and.returnValue(true);
            spyOn(SpaUtils, 'nextPageIsActiveSpaPage').and.returnValue(true);
            const locationObj = {
                hostName: window.location.hostname,
                url: 'test url'
            };

            const result = SpaUtils.isSpaNavigation(locationObj);

            expect(result).toBeTrue();
        });

        it('should return false if it is spa template, spaEnabled, current page is activeSpaPage, but next not', () => {
            spyOn(SpaUtils, 'currentPageIsActiveSpaPage').and.returnValue(true);
            spyOn(SpaUtils, 'nextPageIsActiveSpaPage').and.returnValue(false);
            const locationObj = {
                hostName: window.location.hostname,
                url: 'test url'
            };

            const result = SpaUtils.isSpaNavigation(locationObj);

            expect(result).toBeFalse();
        });

        it('should return false if it is spa template, spaEnabled, next page is activeSpaPage, but current not', () => {
            spyOn(SpaUtils, 'currentPageIsActiveSpaPage').and.returnValue(false);
            spyOn(SpaUtils, 'nextPageIsActiveSpaPage').and.returnValue(true);
            const locationObj = {
                hostName: window.location.hostname,
                url: 'test url'
            };

            const result = SpaUtils.isSpaNavigation(locationObj);

            expect(result).toBeFalse();
        });

        it('should return false if it is spa template, both current and next pages are activeSpaPages, but spaEnabled is false,', () => {
            spyOn(SpaUtils, 'currentPageIsActiveSpaPage').and.returnValue(true);
            spyOn(SpaUtils, 'nextPageIsActiveSpaPage').and.returnValue(true);
            Sephora.configurationSettings.spaEnabled = false;
            const locationObj = {
                hostName: window.location.hostname,
                url: 'test url'
            };

            const result = SpaUtils.isSpaNavigation(locationObj);

            expect(result).toBeFalse();
        });

        it('should return false if it not spa template', () => {
            spyOn(SpaUtils, 'currentPageIsActiveSpaPage').and.returnValue(true);
            spyOn(SpaUtils, 'nextPageIsActiveSpaPage').and.returnValue(true);
            Sephora.isSPA = false;
            const locationObj = {
                hostName: window.location.hostname,
                url: 'test url'
            };

            const result = SpaUtils.isSpaNavigation(locationObj);

            expect(result).toBeFalse();
        });
    });

    describe('updateUserFull', () => {
        beforeEach(() => {
            spyOn(Sephora.Util, 'getCurrentUser').and.returnValue({});
            spyOn(Sephora.Util, 'getBasketCache').and.returnValue({});
            spyOn(Sephora.Util, 'getUserInfoCache').and.returnValue({});
            spyOn(Sephora.Util, 'shouldGetUserFull').and.returnValue(true);
            spyOn(Sephora.Util, 'shouldGetTargeters').and.returnValue(true);
            spyOn(Sephora.Util, 'shouldGetTargetedPromotion').and.returnValue(true);
            spyOn(store, 'dispatch');
            spyOn(userActions, 'getUserFull').and.returnValue('getUserFull');
        });

        it('should dispatch UserActions.getUserFull if shouldGetUserFull returns true and targetedPromotion is true', () => {
            SpaUtils.updateUserFull({});

            expect(store.dispatch).toHaveBeenCalledWith('getUserFull');
            expect(userActions.getUserFull).toHaveBeenCalledWith(
                {},
                null,
                { includeApis: 'targetedPromotion,profile,basket,loves,shoppingList,segments' },
                undefined,
                false
            );
        });

        it('should dispatch UserActions.getUserFull if shouldGetUserFull returns true and targetedPromotion is false', () => {
            Sephora.Util.shouldGetTargetedPromotion = createSpy().and.returnValue(false);

            SpaUtils.updateUserFull({});

            expect(store.dispatch).toHaveBeenCalledWith('getUserFull');
            expect(userActions.getUserFull).toHaveBeenCalledWith(
                {},
                null,
                { includeApis: 'profile,basket,loves,shoppingList,segments' },
                undefined,
                false
            );

            Sephora.Util.shouldGetTargetedPromotion = createSpy().and.returnValue(true);
        });

        it('should dispatch UserActions.getUserFull if shouldGetUserFull returns true with hideLoader', () => {
            SpaUtils.updateUserFull({}, undefined, { hideLoader: true });

            expect(store.dispatch).toHaveBeenCalledWith('getUserFull');
            expect(userActions.getUserFull).toHaveBeenCalledWith(
                {},
                null,
                { includeApis: 'targetedPromotion,profile,basket,loves,shoppingList,segments' },
                undefined,
                true
            );
        });

        it('should dispatch UserActions.getUserFull if shouldGetUserFull returns false but shouldGetTargeters is true', () => {
            Sephora.Util.shouldGetUserFull = createSpy().and.returnValue(false);
            Sephora.Util.shouldGetTargetedPromotion = createSpy().and.returnValue(true);
            SpaUtils.updateUserFull({ a: 'b' });

            expect(store.dispatch).toHaveBeenCalledWith('getUserFull');
            expect(userActions.getUserFull).toHaveBeenCalledWith({}, null, { includeApis: 'targetedPromotion' }, undefined, false);
        });

        it('should dispatch UserActions.getUserFull if shouldGetUserFull returns false but shouldGetTargeters is true with hideLoader', () => {
            Sephora.Util.shouldGetUserFull = createSpy().and.returnValue(false);
            Sephora.Util.shouldGetTargetedPromotion = createSpy().and.returnValue(true);

            SpaUtils.updateUserFull({}, { a: 'b' }, { hideLoader: true });

            expect(store.dispatch).toHaveBeenCalledWith('getUserFull');
            expect(userActions.getUserFull).toHaveBeenCalledWith({ a: 'b' }, null, { includeApis: 'targetedPromotion' }, undefined, true);
        });
    });

    describe('resetTestAndTarget', () => {
        it('should call TestAndTarget service', done => {
            // Arrange
            const testTargetService = require('services/TestTarget');
            const initialize = spyOn(testTargetService, 'initialize');

            // Act
            SpaUtils.resetTestAndTarget().then(() => {
                // Assert
                expect(initialize).toHaveBeenCalledTimes(1);
                done();
            });
        });

        it('should not reset T&T if already initialized', done => {
            // Arrange
            const testTargetService = require('services/TestTarget');
            const {
                OFFERS_READY_STATES: { ADOBE_TESTS_RECEIVED }
            } = require('actions/TestTargetActions').default;
            const initialize = spyOn(testTargetService, 'initialize');
            const testTarget = { readyState: ADOBE_TESTS_RECEIVED };
            const options = { doNotResetTestAndTarget: true };

            // Act
            SpaUtils.resetTestAndTarget(testTarget).then(() => {
                // Assert
                expect(initialize).toHaveBeenCalledWith(options);
                done();
            });
        });
    });
});
