/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const React = require('react');
const { any, createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('GuestCheckoutSection component', () => {
    let GuestCheckoutSection;
    let component;
    let props;

    beforeEach(() => {
        GuestCheckoutSection = require('components/OrderConfirmation/GuestCheckoutSection/GuestCheckoutSection').default;
    });

    describe('Initialization', () => {
        let setStateStub;
        let userUtils;
        let isSignedInStub;
        let store;
        let setAndWatchStub;
        let setBrazeUserDataStub;
        let brazeUtils;
        let toggleCompleteFormStub;

        beforeEach(() => {
            store = require('Store').default;
            setAndWatchStub = spyOn(store, 'setAndWatch');
            brazeUtils = require('analytics/utils/braze').default;
            setBrazeUserDataStub = spyOn(brazeUtils, 'setBrazeUserData');
            userUtils = require('utils/User').default;
            isSignedInStub = spyOn(userUtils, 'isSignedIn');
            props = {
                editStore: 'guestCheckoutStore',
                biFormTestType: 'default'
            };
            const wrapper = shallow(<GuestCheckoutSection {...props} />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
        });

        it('should call setAndWatch twice', () => {
            expect(setAndWatchStub).toHaveBeenCalledTimes(2);
        });

        it('should not call toggleCompleteForm on page load if biFormTestType is default', () => {
            toggleCompleteFormStub = spyOn(component, 'toggleCompleteForm');

            expect(toggleCompleteFormStub).not.toHaveBeenCalled();
        });

        it('should call setAndWatch for editData with correct args', () => {
            expect(setAndWatchStub).toHaveBeenCalledWith('editData.guestCheckoutStore', component, any(Function));
        });

        it('should call setAndWatch for user with correct args', () => {
            expect(setAndWatchStub).toHaveBeenCalledWith('user', component, any(Function));
        });

        it('should execute callback for editData setAndWatch', () => {
            setAndWatchStub.calls.first().args[2]({
                guestCheckoutStore: {}
            });
            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith(any(Function));
            //TODO: test deep extend call in setState func
        });

        it('should execute callback for user setAndWatch', () => {
            isSignedInStub.and.returnValue(true);
            setAndWatchStub.calls.argsFor(1)[2]();
            expect(isSignedInStub).toHaveBeenCalled();
            expect(setStateStub).toHaveBeenCalledTimes(1);
            expect(setBrazeUserDataStub).toHaveBeenCalledTimes(1);
            expect(setStateStub).toHaveBeenCalledWith(
                {
                    showSignIn: false,
                    showSignInConfirmation: true
                },
                any(Function)
            );
        });

        it('should not call setState in setAndWatch callback', () => {
            isSignedInStub.and.returnValue(false);
            setAndWatchStub.calls.argsFor(1)[2]();
            expect(isSignedInStub).toHaveBeenCalled();
            expect(setStateStub).not.toHaveBeenCalled();
        });
    });

    describe('initialize ctrlr for instore bi users', () => {
        let profileApi;
        let lookupProfileByLoginStub;
        let userUtils;
        let isDefaultBIBirthDayStub;
        let setStateStub;
        let userDataStub;
        let fakePromise;

        beforeEach(() => {
            profileApi = require('services/api/profile').default;
            lookupProfileByLoginStub = spyOn(profileApi, 'lookupProfileByLogin');

            userUtils = require('utils/User').default;
            isDefaultBIBirthDayStub = spyOn(userUtils, 'isDefaultBIBirthDay');

            props = {
                isStoreBIMember: true,
                guestEmail: 'guest@email.com'
            };
            const wrapper = shallow(<GuestCheckoutSection {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');

            userDataStub = {
                beautyInsiderAccount: {
                    birthMonth: '10',
                    birthDay: '20',
                    birthYear: '1804'
                },
                userData: 'userData'
            };
        });

        it('should call lookupProfileByLogin with guest email', done => {
            fakePromise = {
                then: function (resolve) {
                    resolve(userDataStub);
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };
            lookupProfileByLoginStub.and.returnValue(fakePromise);
            component.componentDidMount();
            expect(lookupProfileByLoginStub).toHaveBeenCalled();
            expect(lookupProfileByLoginStub).toHaveBeenCalledWith('guest@email.com');
        });

        it('should check if user birthday is default birthday', done => {
            fakePromise = {
                then: function (resolve) {
                    resolve(userDataStub);
                    expect(isDefaultBIBirthDayStub).toHaveBeenCalled();
                    expect(isDefaultBIBirthDayStub).toHaveBeenCalledWith(userDataStub.beautyInsiderAccount);
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };
            lookupProfileByLoginStub.and.returnValue(fakePromise);
            component.componentDidMount();
        });

        it('should set biData state to empty when user has default birthday', done => {
            isDefaultBIBirthDayStub.and.returnValue(true);
            fakePromise = {
                then: function (resolve) {
                    resolve(userDataStub);
                    expect(setStateStub).toHaveBeenCalledWith({
                        biData: {
                            bMon: '',
                            bDay: '',
                            bYear: ''
                        }
                    });
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };
            lookupProfileByLoginStub.and.returnValue(fakePromise);
            component.componentDidMount();
        });

        it('should set biData month and day if user birthday is not default but has default year', done => {
            isDefaultBIBirthDayStub.and.returnValue(false);
            fakePromise = {
                then: function (resolve) {
                    resolve(userDataStub);
                    expect(setStateStub).toHaveBeenCalledWith({
                        biData: {
                            bMon: '10',
                            bDay: '20',
                            bYear: ''
                        }
                    });
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };
            lookupProfileByLoginStub.and.returnValue(fakePromise);
            component.componentDidMount();
        });
    });

    describe('shouldDisplayPopover', () => {
        let shouldDisplayPopover;

        it('should return false for existing BI users', () => {
            props = {
                isExistingUser: true,
                isNonBIRegisteredUser: false
            };
            const wrapper = shallow(<GuestCheckoutSection {...props} />);
            component = wrapper.instance();
            shouldDisplayPopover = component.shouldDisplayPopover();
            expect(shouldDisplayPopover).toEqual(false);
        });

        it('should call return true for existing Non-BI users', () => {
            props = {
                isExistingUser: true,
                isNonBIRegisteredUser: true,
                biFormTestType: 'default'
            };
            const wrapper = shallow(<GuestCheckoutSection {...props} />);
            component = wrapper.instance();
            shouldDisplayPopover = component.shouldDisplayPopover();
            expect(shouldDisplayPopover).toEqual(true);
        });

        it('should return true for non existing users', () => {
            props = {
                isExistingUser: false,
                isNonBIRegisteredUser: false,
                biFormTestType: 'default'
            };
            const wrapper = shallow(<GuestCheckoutSection {...props} />);
            component = wrapper.instance();
            shouldDisplayPopover = component.shouldDisplayPopover();
            expect(shouldDisplayPopover).toEqual(true);
        });
    });

    describe('forgotPassword', () => {
        let e;
        let store;
        let dispatchStub;
        let actions;
        let showForgotPasswordModalStub;

        beforeEach(() => {
            e = {
                preventDefault: createSpy('preventDefault')
            };

            store = require('Store').default;
            dispatchStub = spyOn(store, 'dispatch');

            actions = require('Actions').default;
            showForgotPasswordModalStub = spyOn(actions, 'showForgotPasswordModal').and.returnValue('showForgotPasswordModal');

            props = {
                guestEmail: 'guest@email.com'
            };
            const wrapper = shallow(<GuestCheckoutSection {...props} />);
            component = wrapper.instance();
            component.forgotPassword(e);
        });

        it('should call e.preventDefault once', () => {
            expect(e.preventDefault).toHaveBeenCalled();
        });

        it('should dispatch showForgotPasswordModal', () => {
            expect(dispatchStub).toHaveBeenCalled();
            expect(dispatchStub).toHaveBeenCalledWith('showForgotPasswordModal');
        });

        it('should call showForgotPasswordModal with guest email', () => {
            expect(showForgotPasswordModalStub).toHaveBeenCalledWith(true, 'guest@email.com');
        });
    });

    describe('openRewardsModal', function () {
        let biApi;
        let getBiRewardsGroupForOrderConfStub;
        let fakePromise;

        beforeEach(() => {
            biApi = require('services/api/beautyInsider').default;
            getBiRewardsGroupForOrderConfStub = spyOn(biApi, 'getBiRewardsGroupForOrderConf');

            props = {
                guestProfileId: 'someProfileId'
            };
            const wrapper = shallow(<GuestCheckoutSection {...props} />);
            component = wrapper.instance();
        });

        it('should call getBiRewards api', done => {
            fakePromise = {
                then: function () {
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };
            getBiRewardsGroupForOrderConfStub.and.returnValue(fakePromise);
            component.openRewardsModal();
            expect(getBiRewardsGroupForOrderConfStub).toHaveBeenCalled();
        });
    });

    describe('updateEditStore', () => {
        let store;
        let getStateStub;
        let dispatchStub;
        let EditDataActions;
        let updateEditDataStub;

        beforeEach(() => {
            store = require('Store').default;
            dispatchStub = spyOn(store, 'dispatch');
            getStateStub = spyOn(store, 'getState').and.returnValue({
                editData: {
                    guestCheckoutStore: {}
                }
            });

            EditDataActions = require('actions/EditDataActions').default;
            updateEditDataStub = spyOn(EditDataActions, 'updateEditData').and.returnValue('updateEditData');

            props = {
                editStore: 'guestCheckoutStore'
            };
            const wrapper = shallow(<GuestCheckoutSection {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.updateEditStore('password', '123123');
        });

        it('should call store.getState once to get editstore data', () => {
            expect(getStateStub).toHaveBeenCalled();
        });

        it('should dispatch EditDataActions.updateEditData', () => {
            expect(dispatchStub).toHaveBeenCalled();
            expect(dispatchStub).toHaveBeenCalledWith('updateEditData');
        });

        it('should call updateEditData with updated password and editStore', () => {
            expect(updateEditDataStub).toHaveBeenCalledWith({ password: '123123' }, 'guestCheckoutStore');
        });
    });

    describe('toggleCompleteForm', () => {
        let setStateStub;

        beforeEach(() => {
            const wrapper = shallow(<GuestCheckoutSection />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
        });

        it('should call state to show complete form', () => {
            component.toggleCompleteForm();
            expect(setStateStub).toHaveBeenCalled();
            expect(setStateStub).toHaveBeenCalledWith({
                showRestOfForm: true
            });
        });

        it('should not call state since complete form already shown', () => {
            component.state = {
                showRestOfForm: true
            };
            component.toggleCompleteForm();
            expect(setStateStub).not.toHaveBeenCalled();
        });
    });

    describe('validateForm', () => {
        let ErrorsUtils;
        let clearErrorsStub;
        let collectClientFieldErrorsStub;
        let validateFormStub;

        beforeEach(() => {
            ErrorsUtils = require('utils/Errors').default;
            clearErrorsStub = spyOn(ErrorsUtils, 'clearErrors');
            collectClientFieldErrorsStub = spyOn(ErrorsUtils, 'collectClientFieldErrors');
        });

        describe('for existing BI user', () => {
            beforeEach(() => {
                props = {
                    isExistingUser: true,
                    isNonBIRegisteredUser: false
                };
                component.state = {
                    isMarketingEnabled: false
                };
                const wrapper = shallow(<GuestCheckoutSection {...props} />);
                component = wrapper.instance();
                component.passwordInput = 'passwordInput';
                component.mobilePhone = 'mobilePhone';
                validateFormStub = component.validateForm();
            });

            it('should call ErrorUtils.clearErrors', () => {
                expect(clearErrorsStub).toHaveBeenCalled();
            });

            it('should call ErrorUtils.collectClientFieldErrors with correct fields', () => {
                expect(collectClientFieldErrorsStub).toHaveBeenCalled();
                expect(collectClientFieldErrorsStub).toHaveBeenCalledWith(['passwordInput', 'mobilePhone']);
            });

            it('should return true', () => {
                expect(validateFormStub).toEqual(true);
            });
        });

        describe('for existing NonBI user', () => {
            beforeEach(() => {
                props = {
                    isExistingUser: true,
                    isNonBIRegisteredUser: true
                };
                const wrapper = shallow(<GuestCheckoutSection {...props} />);
                component = wrapper.instance();
                component.passwordInput = 'passwordInput';
                component.mobilePhone = 'mobilePhone';
                component.biRegForm = {
                    validateForm: createSpy('validateForm')
                };
                component.state = {
                    isMarketingEnabled: false
                };
                validateFormStub = component.validateForm();
            });

            it('should call ErrorUtils.clearErrors', () => {
                expect(clearErrorsStub).toHaveBeenCalled();
            });

            it('should call ErrorUtils.collectClientFieldErrors with correct fields', () => {
                expect(collectClientFieldErrorsStub).toHaveBeenCalled();
                expect(collectClientFieldErrorsStub).toHaveBeenCalledWith(['passwordInput', 'mobilePhone']);
            });

            it('should call biRegForm.validateForm once', () => {
                expect(component.biRegForm.validateForm).toHaveBeenCalled();
            });

            it('should return true', () => {
                expect(validateFormStub).toEqual(true);
            });
        });

        describe('for new user', () => {
            beforeEach(() => {
                props = {
                    isExistingUser: false,
                    isNonBIRegisteredUser: true
                };
                const wrapper = shallow(<GuestCheckoutSection {...props} />);
                component = wrapper.instance();
                component.passwordInput = 'passwordInput';
                component.mobilePhone = 'mobilePhone';
                component.biRegForm = {
                    validateForm: createSpy('validateForm')
                };
                component.state = {
                    isMarketingEnabled: false
                };
                validateFormStub = component.validateForm();
            });

            it('should call ErrorUtils.clearErrors', () => {
                expect(clearErrorsStub).toHaveBeenCalled();
            });

            it('should call ErrorUtils.collectClientFieldErrors with correct fields', () => {
                expect(collectClientFieldErrorsStub).toHaveBeenCalled();
                expect(collectClientFieldErrorsStub).toHaveBeenCalledWith(['passwordInput', 'mobilePhone']);
            });

            it('should call biRegForm.validateForm once', () => {
                expect(component.biRegForm.validateForm).toHaveBeenCalled();
            });

            it('should return true', () => {
                expect(validateFormStub).toEqual(true);
            });
        });
    });

    describe('guestCheckoutRegisterSuccess', () => {
        let store;
        let dispatchStub;
        let UserActions;
        let getUserFullStub;
        let processEvent;
        let anaConsts;
        let processStub;

        beforeEach(() => {
            store = require('Store').default;
            dispatchStub = spyOn(store, 'dispatch');
            processEvent = require('analytics/processEvent').default;
            anaConsts = require('analytics/constants').default;

            UserActions = require('actions/UserActions').default;
            getUserFullStub = spyOn(UserActions, 'getUserFull').and.returnValue('getUserFull');
            processStub = spyOn(processEvent, 'process');

            const successResponse = {
                beautyInsiderAccount: {
                    biAccountId: 'some bi id',
                    vibSegment: 'bi',
                    promotionPoints: 0
                },
                profileId: 'some profile id'
            };

            const wrapper = shallow(<GuestCheckoutSection />);
            component = wrapper.instance();
            component.guestCheckoutRegisterSuccess(successResponse);
        });

        it('should dispatch getUserFull once', () => {
            expect(dispatchStub).toHaveBeenCalled();
            expect(dispatchStub).toHaveBeenCalledWith('getUserFull');
            expect(getUserFullStub).toHaveBeenCalled();
        });

        it('should call process method', () => {
            expect(processStub).toHaveBeenCalled();
        });
    });

    describe('guestCheckoutSignInFailure', () => {
        let setStateStub;

        beforeEach(() => {
            const wrapper = shallow(<GuestCheckoutSection />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
        });

        it('should setState for errorMessage once if error', () => {
            component.guestCheckoutSignInFailure({ errorMessages: 'errorMessages' });
            expect(setStateStub).toHaveBeenCalled();
            expect(setStateStub).toHaveBeenCalledWith({
                errorMessages: 'errorMessages'
            });
        });

        it('should not setState if no errorMessages', () => {
            component.guestCheckoutSignInFailure({});
            expect(setStateStub).not.toHaveBeenCalled();
        });
    });

    describe('guestCheckoutRegisterFailure', () => {
        let ErrorsUtils;
        let collectAndValidateBackEndErrorsStub;
        let setStateStub;
        let resetRecaptchaStub;
        let errorResponse;

        beforeEach(() => {
            ErrorsUtils = require('utils/Errors').default;
            collectAndValidateBackEndErrorsStub = spyOn(ErrorsUtils, 'collectAndValidateBackEndErrors');
            errorResponse = {
                errors: 'errors',
                errorMessages: 'errorMessages'
            };

            const wrapper = shallow(<GuestCheckoutSection />);
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');

            resetRecaptchaStub = createSpy();
            component.reCaptcha = {
                reset: resetRecaptchaStub
            };
        });

        it('should collectAndValidateBackEndErrors once with component and response', () => {
            component.guestCheckoutRegisterFailure(errorResponse);
            expect(collectAndValidateBackEndErrorsStub).toHaveBeenCalled();
            expect(collectAndValidateBackEndErrorsStub).toHaveBeenCalledWith(errorResponse, component);
        });

        it('should should refresh the reCaptcha if any error is present', () => {
            component.guestCheckoutRegisterFailure(errorResponse);
            expect(resetRecaptchaStub).toHaveBeenCalled();
        });

        it('should setState to display the errorMessage', () => {
            component.guestCheckoutRegisterFailure(errorResponse);
            expect(setStateStub).toHaveBeenCalled();
            expect(setStateStub).toHaveBeenCalledWith({
                errorMessages: errorResponse.errorMessages
            });
        });
    });

    describe('guestCheckoutRegister', () => {
        let getBIDateStub;
        let profileDataStub;
        let localeUtils;
        let isCanadaStub;
        let store;
        let dispatchStub;
        let UserActions;
        let registerStub;
        let guestCheckoutRegisterSuccessStub;
        let guestCheckoutRegisterFailureStub;
        let getValueStub;

        beforeEach(() => {
            localeUtils = require('utils/LanguageLocale').default;
            isCanadaStub = spyOn(localeUtils, 'isCanada');

            store = require('Store').default;
            dispatchStub = spyOn(store, 'dispatch');

            UserActions = require('actions/UserActions').default;
            registerStub = spyOn(UserActions, 'register').and.returnValue('register');

            getBIDateStub = createSpy().and.returnValue({
                birthday: 'BI Birthday'
            });
            getValueStub = createSpy().and.returnValue(true);
        });

        describe('ReCaptcha', () => {
            let executeCaptchaStub;
            let resetRecaptchaStub;
            let guestCheckoutRegisterOrSignIn;

            beforeEach(() => {
                executeCaptchaStub = createSpy('executeCaptchaStub');
                resetRecaptchaStub = createSpy('resetRecaptchaStub');
                props = {
                    isExistingUser: false
                };
                const wrapper = shallow(<GuestCheckoutSection {...props} />);
                component = wrapper.instance();
                guestCheckoutRegisterOrSignIn = spyOn(component, 'guestCheckoutRegisterOrSignIn');

                component.reCaptcha = {
                    execute: executeCaptchaStub,
                    reset: resetRecaptchaStub
                };
            });

            it('should execute the captcha', () => {
                spyOn(component, 'validateForm').and.returnValue(true);
                component.validateCaptcha();
                expect(executeCaptchaStub).toHaveBeenCalled();
            });

            it('should call guestCheckoutRegisterOrSignIn once', () => {
                spyOn(component, 'validateForm').and.returnValue(false);
                component.validateCaptcha();
                expect(guestCheckoutRegisterOrSignIn).toHaveBeenCalled();
            });

            it('should pass the token to guestCheckoutRegister method', () => {
                component.onCaptchaTokenReady('token');
                expect(guestCheckoutRegisterOrSignIn).toHaveBeenCalledWith('token');
            });

            it('should reset the reCaptcha if the token is invalid', () => {
                component.onCaptchaTokenReady(undefined);
                expect(resetRecaptchaStub).toHaveBeenCalled();
            });
        });

        describe('for non pos users', () => {
            beforeEach(() => {
                props = {
                    guestEmail: 'guest@email.com'
                };
                const wrapper = shallow(<GuestCheckoutSection {...props} />);
                component = wrapper.instance();
                component.state = {
                    password: 'password',
                    captchaToken: 'token'
                };
                component.biRegForm = {
                    getBIDate: getBIDateStub,
                    state: {
                        isJoinBIChecked: true
                    }
                };
                component.subscribeEmail = {
                    getValue: getValueStub
                };
                guestCheckoutRegisterSuccessStub = spyOn(component, 'guestCheckoutRegisterSuccess');
                guestCheckoutRegisterFailureStub = spyOn(component, 'guestCheckoutRegisterFailure');

                profileDataStub = {
                    userDetails: {
                        password: 'password',
                        biAccount: {
                            birthday: 'BI Birthday'
                        },
                        phoneNumber: ''
                    },
                    registrationFrom: 'orderConfirmation',
                    isJoinBi: true,
                    captchaToken: 'token',
                    captchaLocation: 'REGISTRATION_POPUP',
                    subscription: {
                        subScribeToSms: false
                    }
                };
            });

            it('should call getBiDate from biRegForm', () => {
                component.guestCheckoutRegister();
                expect(getBIDateStub).toHaveBeenCalled();
            });

            it('should dispatch UserActions.register', () => {
                component.guestCheckoutRegister();
                expect(dispatchStub).toHaveBeenCalled();
                expect(dispatchStub).toHaveBeenCalledWith('register');
            });

            it('should call UserActions.register with correct arguments', () => {
                component.guestCheckoutRegister('token');
                expect(registerStub).toHaveBeenCalledWith(
                    profileDataStub,
                    guestCheckoutRegisterSuccessStub,
                    guestCheckoutRegisterFailureStub,
                    null,
                    'guest@email.com'
                );
            });

            it('should call UserActions.register with correct arguments for CA user', () => {
                isCanadaStub.and.returnValue(true);
                profileDataStub.subscription = {
                    subScribeToSms: false,
                    subScribeToEmails: true
                };
                component.guestCheckoutRegister('token');
                expect(registerStub).toHaveBeenCalledWith(
                    profileDataStub,
                    guestCheckoutRegisterSuccessStub,
                    guestCheckoutRegisterFailureStub,
                    null,
                    'guest@email.com'
                );
            });
        });

        describe('for pos users', () => {
            beforeEach(() => {
                props = {
                    guestEmail: 'guest@email.com',
                    isStoreBIMember: true
                };
                const wrapper = shallow(<GuestCheckoutSection {...props} />, { disableLifecycleMethods: true });
                component = wrapper.instance();
                component.state = {
                    password: 'password',
                    captchaToken: 'token'
                };
                component.biRegForm = {
                    getBIDate: getBIDateStub
                };
                component.subscribeEmail = {
                    getValue: getValueStub
                };
                guestCheckoutRegisterSuccessStub = spyOn(component, 'guestCheckoutRegisterSuccess');
                guestCheckoutRegisterFailureStub = spyOn(component, 'guestCheckoutRegisterFailure');

                component.inStoreUserData = {
                    firstName: 'first',
                    lastName: 'last',
                    profileId: 'profileId'
                };

                profileDataStub = {
                    userDetails: {
                        email: 'guest@email.com',
                        login: 'guest@email.com',
                        firstName: 'first',
                        lastName: 'last',
                        password: 'password',
                        confirmPassword: 'password',
                        profileId: 'profileId',
                        phoneNumber: '',
                        biAccount: {
                            birthday: 'BI Birthday'
                        }
                    },
                    registrationFrom: 'orderConfirmation',
                    isJoinBi: true,
                    captchaToken: 'token',
                    captchaLocation: 'REGISTRATION_POPUP',
                    subscription: {
                        subScribeToSms: false
                    }
                };
            });

            it('should call getBiDate from biRegForm', () => {
                component.guestCheckoutRegister();
                expect(getBIDateStub).toHaveBeenCalled();
            });

            it('should dispatch UserActions.register', () => {
                component.guestCheckoutRegister();
                expect(dispatchStub).toHaveBeenCalled();
                expect(dispatchStub).toHaveBeenCalledWith('register');
            });

            it('should call UserActions.register with correct arguments', () => {
                component.guestCheckoutRegister('token');
                expect(registerStub).toHaveBeenCalledWith(
                    profileDataStub,
                    guestCheckoutRegisterSuccessStub,
                    guestCheckoutRegisterFailureStub,
                    null,
                    'guest@email.com'
                );
            });

            it('should call UserActions.register with correct arguments for CA user', () => {
                isCanadaStub.and.returnValue(true);
                profileDataStub.subscription = {
                    subScribeToSms: false,
                    subScribeToEmails: true
                };
                component.guestCheckoutRegister('token');
                expect(registerStub).toHaveBeenCalledWith(
                    profileDataStub,
                    guestCheckoutRegisterSuccessStub,
                    guestCheckoutRegisterFailureStub,
                    null,
                    'guest@email.com'
                );
            });
        });
    });

    describe('guestCheckoutSignIn', () => {
        let getBIDateStub;
        let localeUtils;
        let isCanadaStub;
        let store;
        let dispatchStub;
        let UserActions;
        let signInStub;
        let guestCheckoutSignInFailureStub;
        let biAccountInfoStub;

        beforeEach(() => {
            localeUtils = require('utils/LanguageLocale').default;
            isCanadaStub = spyOn(localeUtils, 'isCanada');

            store = require('Store').default;
            dispatchStub = spyOn(store, 'dispatch');

            UserActions = require('actions/UserActions').default;
            signInStub = spyOn(UserActions, 'signIn').and.returnValue('signIn');

            getBIDateStub = createSpy().and.returnValue('BI Birthday');

            props = {
                guestEmail: 'guest@email.com'
            };
            const wrapper = shallow(<GuestCheckoutSection {...props} />);
            component = wrapper.instance();
            guestCheckoutSignInFailureStub = spyOn(component, 'guestCheckoutSignInFailure');
            component.biRegForm = {
                getBIDate: getBIDateStub
            };
            component.state = {
                password: 'password'
            };
            component.subscribeEmail = {
                getValue: createSpy().and.returnValue(true)
            };

            biAccountInfoStub = {
                isJoinBi: true,
                birthday: 'BI Birthday',
                subscription: {
                    subScribeToSms: false
                }
            };
        });

        it('should call getBiDate from biRegForm', () => {
            component.guestCheckoutSignIn(true);
            expect(getBIDateStub).toHaveBeenCalled();
        });

        it('should not call getBiDate from biRegForm', () => {
            component.guestCheckoutSignIn(false);
            expect(getBIDateStub).not.toHaveBeenCalled();
        });

        it('should dispatch UserActions.signIn', () => {
            component.guestCheckoutSignIn(true);
            expect(dispatchStub).toHaveBeenCalled();
            expect(dispatchStub).toHaveBeenCalledWith('signIn');
        });

        it('should call UserActions.signIn with correct arguments for non BI user', () => {
            component.guestCheckoutSignIn(true);
            expect(signInStub).toHaveBeenCalledWith(
                'guest@email.com',
                'password',
                null,
                null,
                any(Function),
                guestCheckoutSignInFailureStub,
                true,
                biAccountInfoStub
            );
        });

        it('should call UserActions.signIn with correct arguments for BI user', () => {
            component.guestCheckoutSignIn(false);
            expect(signInStub).toHaveBeenCalledWith(
                'guest@email.com',
                'password',
                null,
                null,
                any(Function),
                guestCheckoutSignInFailureStub,
                true,
                undefined
            );
        });

        it('should call UserActions.signIn with correct arguments for CA user', () => {
            isCanadaStub.and.returnValue(true);
            biAccountInfoStub.subscription = {
                subScribeToSms: false,
                subScribeToEmails: true
            };
            component.guestCheckoutSignIn(true);
            expect(signInStub).toHaveBeenCalledWith(
                'guest@email.com',
                'password',
                null,
                null,
                any(Function),
                guestCheckoutSignInFailureStub,
                true,
                biAccountInfoStub
            );
        });
    });

    describe('guestCheckoutRegisterOrSignIn', () => {
        let guestCheckoutRegisterStub;
        let guestCheckoutSignInStub;

        it('should call guestCheckoutRegister for new users', () => {
            props = {
                isExistingUser: false,
                isNonBIRegisteredUser: true
            };
            const wrapper = shallow(<GuestCheckoutSection {...props} />);
            component = wrapper.instance();
            guestCheckoutRegisterStub = spyOn(component, 'guestCheckoutRegister');
            component.guestCheckoutRegisterOrSignIn();
            expect(guestCheckoutRegisterStub).toHaveBeenCalled();
        });

        it('should call guestCheckoutSignIn for existing users', () => {
            props = {
                isExistingUser: true,
                isNonBIRegisteredUser: false
            };
            const wrapper = shallow(<GuestCheckoutSection {...props} />);
            component = wrapper.instance();
            guestCheckoutSignInStub = spyOn(component, 'guestCheckoutSignIn');
            component.guestCheckoutRegisterOrSignIn();
            expect(guestCheckoutSignInStub).toHaveBeenCalled();
            expect(guestCheckoutSignInStub).toHaveBeenCalledWith(false);
        });
    });

    describe('Layout of the component', () => {
        let isMobile;

        it('should have margin top for non-A/B test experience in mobile viewport ', () => {
            isMobile = spyOn(Sephora, 'isMobile').and.returnValue(true);
            const wrapper = shallow(<GuestCheckoutSection biFormTestType='default' />);
            component = wrapper.instance();
            component.state = {
                showSignIn: true
            };
            expect(wrapper.find('Box').at(0).prop('marginTop')).toEqual(['9em', 0]);
        });

        it('should not have margin top for A/B test experience in mobile viewport ', () => {
            isMobile = spyOn(Sephora, 'isMobile').and.returnValue(true);
            const wrapper = shallow(<GuestCheckoutSection biFormTestType='foobar' />);
            component = wrapper.instance();
            component.state = {
                showSignIn: true
            };
            expect(wrapper.find('Box').at(0).prop('marginTop')).toBeFalse();
        });

        it('should not have a BiRegisterForm component for A/B test type default ', () => {
            const wrapper = shallow(<GuestCheckoutSection biFormTestType='default' />);
            component = wrapper.instance();
            expect(wrapper.find('BiRegisterForm').length).toBe(0);
        });
    });
});
