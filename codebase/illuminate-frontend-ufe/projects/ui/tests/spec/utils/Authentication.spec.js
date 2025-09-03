const { createSpy } = jasmine;

describe('Authentication', () => {
    let authenticationUtils;
    let store;
    let userUtils;

    beforeEach(() => {
        authenticationUtils = require('utils/Authentication').default;
        store = require('Store').default;
        userUtils = require('utils/User').default;
    });

    describe('requireLoggedInAuthentication', () => {
        it('should be resolved for Authenticated user', async () => {
            // Arrange
            spyOn(userUtils, 'validateUserStatus').and.resolveTo({ auth: { profileStatus: 4 } });
            // Act
            await authenticationUtils.requireLoggedInAuthentication();

            // Assert
            // if reached, then method was resolved
            expect(true).toBeTruthy();
        });

        it('should open Sign In Modal for unrecognized user', async () => {
            // Arrange
            spyOn(userUtils, 'validateUserStatus').and.resolveTo({ auth: { profileStatus: 0 } });
            const showSignInModalWithPromoDecorationStub = spyOn(authenticationUtils, 'showSignInModalWithPromoDecoration').and.callFake(callback =>
                callback()
            );

            // Act
            await authenticationUtils.requireLoggedInAuthentication();

            // Assert
            expect(showSignInModalWithPromoDecorationStub).toHaveBeenCalledTimes(1);
        });

        it('should perform autoLogin for Recognized user', async () => {
            // Arrange
            spyOn(userUtils, 'validateUserStatus').and.resolveTo({ auth: { profileStatus: 2 } });
            const ssiService = require('services/api/ssi').default;

            const autoLoginStub = spyOn(ssiService, 'autoLogin').and.returnValue(
                Promise.resolve({
                    accessToken: 'mockAccessToken',
                    refreshToken: 'mockRefreshToken'
                })
            );
            Sephora.configurationSettings.isOptInSSIMWebEnabled = true;

            // Act
            await authenticationUtils.requireLoggedInAuthentication();

            // Assert
            expect(autoLoginStub).toHaveBeenCalledTimes(1);
        });

        it('should open Sign In Modal if recognized user has SSI off', async () => {
            // Arrange
            spyOn(userUtils, 'validateUserStatus').and.resolveTo({ auth: { profileStatus: 2 } });
            const showSignInModalWithPromoDecorationStub = spyOn(authenticationUtils, 'showSignInModalWithPromoDecoration').and.callFake(callback =>
                callback()
            );
            Sephora.configurationSettings.isOptInSSIMWebEnabled = false;

            // Act
            await authenticationUtils.requireLoggedInAuthentication();

            // Assert
            expect(showSignInModalWithPromoDecorationStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('requireAuthentication', () => {
        let callback;
        let fingerprintSpy;

        beforeEach(() => {
            callback = createSpy('callback');
            const fingerPrint = require('services/Fingerprint').default;
            fingerprintSpy = spyOn(fingerPrint, 'setupFingerprint').and.callThrough();
        });

        it('should call the callback immediately for signed in user', () => {
            spyOn(store, 'getState').and.returnValue({ auth: { profileStatus: 2 } });

            authenticationUtils.requireAuthentication().then(() => {
                callback();
                expect(callback).toHaveBeenCalled();
            });
        });

        it('should call the callback immediately for recognized user', () => {
            spyOn(store, 'getState').and.returnValue({ auth: { profileStatus: 4 } });

            authenticationUtils.requireAuthentication().then(() => {
                callback();
                expect(callback).toHaveBeenCalled();
            });
        });

        it('should require sign in for anonymous user', () => {
            spyOn(userUtils, 'validateUserStatus').and.returnValue({
                then: function (cb) {
                    cb({ profileStatus: 0 });
                }
            });
            const showSignInModalSpy = spyOn(require('Actions').default, 'showSignInModal');

            authenticationUtils.requireAuthentication().then(() => {
                callback();

                expect(callback).not.toHaveBeenCalled();
                expect(showSignInModalSpy).toHaveBeenCalled();
            });
        });

        it('should require sign in for recognized user', () => {
            const obj = { callback: function () {} };
            const callbackStub = spyOn(obj, 'callback');

            const validateStub = spyOn(userUtils, 'validateUserStatus').and.callThrough();

            authenticationUtils.requireLoggedInAuthentication(callbackStub).then(() => {
                expect(callbackStub).not.toHaveBeenCalled();
                expect(validateStub).toHaveBeenCalled();
            });
        });

        it('should call setupDevicefingerprint for signed in users', () => {
            authenticationUtils.requireLoggedInAuthentication().then(() => {
                fingerprintSpy.toHaveBeenCalledOnce();
            });
        });
    });
});
