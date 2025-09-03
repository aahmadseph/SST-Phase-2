const { createSpy } = jasmine;

describe('Community', () => {
    let community;
    let isBIStub,
        isSocialStub,
        needSocialReOptStub,
        requireRecognizedAuthenticationStub,
        requireLoggedInAuthenticationStub,
        showBiRegisterModalStub,
        showSocialRegistrationModalStub,
        showSocialReOptModalStub;

    let failRequireRecognized;
    let failRequireLoggedIn;

    beforeEach(() => {
        failRequireRecognized = false;
        failRequireLoggedIn = false;

        const authentication = require('utils/Authentication').default;

        requireRecognizedAuthenticationStub = spyOn(authentication, 'requireRecognizedAuthentication').and.returnValue({
            then: callback => {
                callback();

                return {
                    catch: catchCallback => {
                        if (failRequireRecognized) {
                            catchCallback();
                        }
                    }
                };
            }
        });

        const userUtils = require('utils/User').default;

        // Return false by default so we can check the main body of the method
        isBIStub = spyOn(userUtils, 'isBI').and.returnValue(false);

        isSocialStub = spyOn(userUtils, 'isSocial').and.returnValue(true);
        needSocialReOptStub = spyOn(userUtils, 'needsSocialReOpt').and.returnValue(false);

        community = require('utils/Community').default;
    });

    describe('ensureUserIsReadyForSocialAction', () => {
        it('should require the user to be recognized', () => {
            isBIStub.and.returnValue(true);

            community.ensureUserIsReadyForSocialAction(community.PROVIDER_TYPES.bv);

            expect(requireRecognizedAuthenticationStub).toHaveBeenCalledTimes(1);
        });

        describe('user is Social, but not BI', () => {
            beforeEach(() => {
                const authentication = require('utils/Authentication').default;

                requireLoggedInAuthenticationStub = spyOn(authentication, 'requireLoggedInAuthentication').and.returnValue({
                    then: () => {
                        showBiRegisterModalStub();

                        return {
                            catch: catchCallback => {
                                if (failRequireLoggedIn) {
                                    catchCallback();
                                }
                            }
                        };
                    }
                });

                showBiRegisterModalStub = createSpy(community, 'showBiRegisterModal').and.returnValue(false);
            });

            it('should require the user to sign in', () => {
                community.ensureUserIsReadyForSocialAction(community.PROVIDER_TYPES.bv);

                expect(requireLoggedInAuthenticationStub).toHaveBeenCalled();
            });

            it('should call showBiRegisterModal to launch bi register modal', () => {
                community.ensureUserIsReadyForSocialAction(community.PROVIDER_TYPES.bv);

                expect(showBiRegisterModalStub).toHaveBeenCalled();
            });
        });

        describe('user is BI, but not Social', () => {
            beforeEach(() => {
                const authentication = require('utils/Authentication').default;

                requireLoggedInAuthenticationStub = spyOn(authentication, 'requireLoggedInAuthentication').and.returnValue({
                    then: () => {
                        showSocialRegistrationModalStub();

                        return {
                            catch: catchCallback => {
                                if (failRequireLoggedIn) {
                                    catchCallback();
                                }
                            }
                        };
                    }
                });

                showSocialRegistrationModalStub = createSpy(community, 'showSocialRegistrationModal').and.returnValue(false);

                isBIStub.and.returnValue(true);
                isSocialStub.and.returnValue(false);
            });
            it('should require the user to sign in', () => {
                community.ensureUserIsReadyForSocialAction(community.PROVIDER_TYPES.bv);

                expect(requireLoggedInAuthenticationStub).toHaveBeenCalled();
            });

            it('should call showSocialRegistrationModal to launch social register modal', () => {
                community.ensureUserIsReadyForSocialAction(community.PROVIDER_TYPES.bv);

                expect(showSocialRegistrationModalStub).toHaveBeenCalled();
            });
        });

        describe('user is Bi, is Social, but not opted in', () => {
            beforeEach(() => {
                const authentication = require('utils/Authentication').default;

                requireLoggedInAuthenticationStub = spyOn(authentication, 'requireLoggedInAuthentication').and.returnValue({
                    then: () => {
                        showSocialReOptModalStub();

                        return {
                            catch: catchCallback => {
                                if (failRequireLoggedIn) {
                                    catchCallback();
                                }
                            }
                        };
                    }
                });

                showSocialReOptModalStub = createSpy(community, 'showSocialReOptModal').and.returnValue(false);

                isBIStub.and.returnValue(true);
                needSocialReOptStub.and.returnValue(true);
            });

            it('should require the user to sign in', () => {
                community.ensureUserIsReadyForSocialAction(community.PROVIDER_TYPES.bv);

                expect(requireLoggedInAuthenticationStub).toHaveBeenCalled();
            });

            it('should call showSocialReOptModal to launch social reopt modal', () => {
                community.ensureUserIsReadyForSocialAction(community.PROVIDER_TYPES.bv);

                expect(showSocialReOptModalStub).toHaveBeenCalled();
            });
        });
    });
});
