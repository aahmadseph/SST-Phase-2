/* eslint-disable object-curly-newline */
const React = require('react');
const { any, objectContaining, arrayContaining, createSpy, anything } = jasmine;
const { shallow } = require('enzyme');

describe('RegisterForm component', () => {
    let store;
    let ErrorsUtils;
    let actions;
    let userActions;
    let localeUtils;
    let processEvent;
    let analyticsUtils;
    let RegisterForm;
    let CheckoutUtils;
    let Storage;
    let LOCAL_STORAGE;
    let brazeUtils;
    let userUtils;
    const SIGN_IN = 'sign in:sign in:n/a:*';
    let dispatchStub;
    let showInfoModalStub;
    let showRegisterModalStub;
    let registerStub;
    let preventDefaultStub;
    let event;
    let component;
    let setStateStub;
    let getCurrentCountryStub;
    let isMobileStub;
    let props;
    let inStoreHandlerStub;
    let errbackStub;
    let setItemStub;

    beforeEach(() => {
        store = require('store/Store').default;
        ErrorsUtils = require('utils/Errors').default;
        actions = require('Actions').default;
        userActions = require('actions/UserActions').default;
        localeUtils = require('utils/LanguageLocale').default;
        processEvent = require('analytics/processEvent').default;
        analyticsUtils = require('analytics/utils').default;
        RegisterForm = require('components/GlobalModals/RegisterModal/RegisterForm/RegisterForm').default;
        CheckoutUtils = require('utils/Checkout').default;
        Storage = require('utils/localStorage/Storage').default;
        LOCAL_STORAGE = require('utils/localStorage/Constants').default;
        brazeUtils = require('analytics/utils/braze').default;
        userUtils = require('utils/User').default;

        dispatchStub = spyOn(store, 'dispatch');
        showInfoModalStub = spyOn(actions, 'showInfoModal');
        showRegisterModalStub = spyOn(actions, 'showRegisterModal');
        registerStub = spyOn(userActions, 'register');
        getCurrentCountryStub = spyOn(localeUtils, 'getCurrentCountry').and.returnValue('us');
        spyOn(processEvent, 'process');
        setItemStub = spyOn(Storage.local, 'setItem');
        spyOn(store, 'setAndWatch');
        spyOn(analyticsUtils, 'getMostRecentEvent').and.callFake((_eventType, filter) => {
            switch (filter.pageType) {
                case 'sign in':
                    return { eventInfo: { attributes: { pageName: SIGN_IN } } };
                default:
                    return { eventInfo: { attributes: { pageName: 'register:register:n/a:*' } } };
            }
        });
        preventDefaultStub = createSpy('preventDefaultStub');
        event = {
            preventDefault: preventDefaultStub
        };
        const setCustomUserAttributeStub = createSpy('setCustomUserAttributeStub');
        global.braze = {
            getUser: () => ({ setCustomUserAttribute: setCustomUserAttributeStub })
        };
    });

    describe('componentDidMount', () => {
        beforeEach(() => {
            const wrapper = shallow(<RegisterForm />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            spyOn(component, 'updateEditStore');
            spyOn(component, 'loadThirdpartyScript');
            spyOn(component, 'pageLoadAnalytics');
        });

        it('should set the SIGN_IN_SEEN localStorage', () => {
            component.componentDidMount();
            expect(setItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.SIGN_IN_SEEN, true);
        });
    });

    describe('submit register form', () => {
        beforeEach(() => {
            const wrapper = shallow(<RegisterForm />, { disableLifecycleMethods: true });
            component = wrapper.instance();

            component.subscribeEmail = { getValue: () => {} };
        });

        it('dispatch register info to store if there are no errors', () => {
            registerStub.and.returnValue('unique_string');
            spyOn(component, 'validateForm').and.returnValue(false);
            spyOn(component, 'getOptionParams').and.returnValue({});
            component.register(event);
            expect(dispatchStub).toHaveBeenCalledWith('unique_string');
        });
    });

    describe('close modal', () => {
        beforeEach(() => {
            errbackStub = createSpy('errbackStub');
            props = { errback: errbackStub };
            const wrapper = shallow(<RegisterForm {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
        });

        it('should dispatch RegisterForm false', () => {
            component.requestClose();
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(showRegisterModalStub).toHaveBeenCalledWith(objectContaining({ isOpen: false }));
        });

        it('should call the errback if provided', () => {
            component.requestClose();
            expect(errbackStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('ReCaptcha', () => {
        let hideModalStub;
        let executeCaptchaStub;
        let resetCaptchaStub;
        let compRegisterStub;

        beforeEach(() => {
            hideModalStub = createSpy('hideModalStub');
            executeCaptchaStub = createSpy('executeCaptchaStub');
            resetCaptchaStub = createSpy('resetCaptchaStub');
            const newProps = {
                hideModal: hideModalStub,
                isCaptchaEnabled: true
            };
            const wrapper = shallow(<RegisterForm {...newProps} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.reCaptcha.current = {
                execute: executeCaptchaStub,
                reset: resetCaptchaStub
            };
            compRegisterStub = spyOn(component, 'register');
            createSpy(component, 'validateForm').and.returnValue(false);
            setStateStub = spyOn(component, 'setState');
        });

        it('should hide the modal when captcha challenger appears', () => {
            component.onChallengerShow();
            expect(hideModalStub).toHaveBeenCalledWith(true);
        });

        it('should show the modal back when captcha challenger was dismissed', () => {
            component.onChallengerDismiss();
            expect(hideModalStub).toHaveBeenCalledWith(false);
        });

        it('should execute the captcha', () => {
            const getState = store.getState;
            spyOn(store, 'getState').and.returnValue({
                ...getState(),
                errors: {
                    GLOBAL: {},
                    FORM: {},
                    FIELD: {}
                }
            });
            component.validateCaptchaAndRegister();
            expect(executeCaptchaStub).toHaveBeenCalledTimes(1);
        });

        it('should provide the callback for the register call via captcha', () => {
            const callbackStub = createSpy('callbackStub');
            component.validateCaptchaAndRegister(callbackStub);
            expect(setStateStub).toHaveBeenCalledWith({ callback: callbackStub }, any(Function));
        });

        it('should pass the token to register method', () => {
            component.onCaptchaTokenReady('token');
            expect(compRegisterStub).toHaveBeenCalledWith('token');
        });

        it('should reset the captcha if there was no token provided', () => {
            component.onCaptchaTokenReady();
            expect(resetCaptchaStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('invalid input pre-api register call', () => {
        beforeEach(() => {
            const wrapper = shallow(<RegisterForm />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');

            component.emailInput = {
                getValue: () => {}
            };
            component.subscribeEmail = {
                getValue: () => {}
            };

            spyOn(component, 'validateForm').and.returnValue(true);

            component.register({
                preventDefault: () => {}
            });
        });

        it('store.dispatch should not to be called', () => {
            expect(dispatchStub).not.toHaveBeenCalled();

            expect(setStateStub).toHaveBeenCalledWith({
                errorMessageAndSignInHere: '',
                errorMessages: null
            });
        });
    });

    describe('track errors when present', () => {
        let errorData = {};
        const fieldError = ['email'];
        const errorMessage = ['Please enter your email address.'];

        beforeEach(() => {
            props = { analyticsData: { context: 'sign in' } };
            const wrapper = shallow(<RegisterForm {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();

            errorData = component.trackErrors({
                somerror: {
                    name: fieldError[0],
                    message: errorMessage[0],
                    location: {}
                }
            });
        });

        it('should return an object with errorMessages', () => {
            expect(errorData.data.errorMessages).toEqual(errorMessage);
        });

        it('should return an object with fieldErrors', () => {
            expect(errorData.data.fieldErrors).toEqual(fieldError);
        });

        it('should set pageName as register for tracking', () => {
            expect(errorData.data.pageName).toEqual('register:register:n/a:*');
        });
    });

    describe('register new user', () => {
        const payload = {
            lastName: 'My Custom Text',
            inStoreUser: true
        };

        beforeEach(() => {
            const wrapper = shallow(<RegisterForm />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            spyOn(component, 'validateForm').and.returnValue(false);
            spyOn(component, 'getOptionParams').and.returnValue(payload);

            component.subscribeEmail = {
                getValue: () => {}
            };
        });

        it('should dispatch action to register new user', () => {
            component.register(event);
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should register new user', () => {
            // Arrange/Act
            component.register(event);

            // Assert
            expect(registerStub).toHaveBeenCalledWith(payload, any(Function), any(Function), undefined, null, undefined);
        });
    });

    describe('click join bi checkbox', () => {
        let updateEditStoreStub;

        beforeEach(() => {
            const wrapper = shallow(<RegisterForm />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.subscribeEmail = {
                getValue: () => {},
                setChecked: () => {}
            };
            updateEditStoreStub = spyOn(component, 'updateEditStore');
        });

        it('should call setChecked for subscribe to sephora mail', () => {
            getCurrentCountryStub.and.returnValue('us');
            component.handleJoinBIClick(true);
            expect(updateEditStoreStub).toHaveBeenCalledWith('subscribeSephoraEmail', true);
            expect(updateEditStoreStub).toHaveBeenCalledWith('sephoraEmailDisabled', true);
        });

        it('should unset state for subscribe to sephora mail', () => {
            getCurrentCountryStub.and.returnValue('us');
            component.handleJoinBIClick(false);
            expect(updateEditStoreStub).toHaveBeenCalledWith('subscribeSephoraEmail', true);
            expect(updateEditStoreStub).toHaveBeenCalledWith('sephoraEmailDisabled', false);
        });
    });

    describe('check/uncheck subscribe sephora email', () => {
        let updateEditStoreStub1;

        beforeEach(() => {
            const wrapper = shallow(<RegisterForm />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.subscribeEmail = {
                getValue: () => {},
                setChecked: () => {}
            };
            updateEditStoreStub1 = spyOn(component, 'updateEditStore');
        });

        it('should set state for subscribe to sephora mail', () => {
            event.target = { checked: true };
            component.handleSubscribeSephoraEmail(event);
            expect(updateEditStoreStub1).toHaveBeenCalledWith('subscribeSephoraEmail', true);
        });

        it('should unset state for subscribe to sephora mail', () => {
            event.target = { checked: false };
            component.handleSubscribeSephoraEmail(event);
            expect(updateEditStoreStub1).toHaveBeenCalledWith('subscribeSephoraEmail', false);
        });
    });

    // describe('reset form inputs', () => {
    //     beforeEach(() => {
    //         const newProps = { isCaptchaEnabled: true };
    //         const wrapper = shallow(<RegisterForm {...newProps} />);
    //         component = wrapper.instance();
    //         setStateStub = spyOn(component, 'setState');
    //         component.handleReset();
    //     });
    // });

    describe('register success callback', () => {
        let setBrazeUserDataStub;

        beforeEach(() => {
            setBrazeUserDataStub = spyOn(brazeUtils, 'setBrazeUserData');
            const wrapper = shallow(<RegisterForm />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            wrapper.setProps({ openPostBiSignUpModal: false });
            isMobileStub = spyOn(Sephora, 'isMobile');
            spyOn(userUtils, 'isBI').and.returnValue(false);
            global.braze = {};
        });

        it('should call braze sendRegistration method', () => {
            component.registerSuccess({}, true);
            expect(setBrazeUserDataStub).toHaveBeenCalledTimes(1);
        });

        it('should invoke the dispatch method', () => {
            component.registerSuccess({}, true);
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should close the modal', () => {
            component.registerSuccess({}, true);
            expect(showRegisterModalStub).toHaveBeenCalledWith(objectContaining({ isOpen: false }));
        });

        it('should dispatch action to show confirmation modal', () => {
            isMobileStub.and.returnValue(true);
            showInfoModalStub.and.returnValue('My Confirmation Modal');
            component.registerSuccess({}, false);
            expect(dispatchStub).toHaveBeenCalledWith('My Confirmation Modal');
        });

        it('should show non-bi customer registration message', () => {
            isMobileStub.and.returnValue(true);
            component.registerSuccess({}, false);
            expect(showInfoModalStub).toHaveBeenCalledWith({
                isOpen: true,
                title: 'Registration Complete',
                message: 'Thank you for registering with Sephora',
                buttonText: 'Continue'
            });
        });

        it('should show bi customer registration message', () => {
            isMobileStub.and.returnValue(true);
            component.registerSuccess({}, true);
            expect(showInfoModalStub).toHaveBeenCalledWith({
                isOpen: true,
                title: 'Registration Complete',
                message: 'Congratulations! You are now a Beauty Insider',
                buttonText: 'Continue'
            });
        });
    });

    /** @ToDo: Find reason of tests failing */
    describe('register failure callback', () => {
        let collectAndValidateBackEndErrorsStub;
        beforeEach(() => {
            collectAndValidateBackEndErrorsStub = spyOn(ErrorsUtils, 'collectAndValidateBackEndErrors');
            component = shallow(<RegisterForm />, { disableLifecycleMethods: true }).instance();
            inStoreHandlerStub = spyOn(component, 'inStoreUserHandler');
        });

        it('should call store user handler method', () => {
            component.registerFailure({
                errorCode: 202,
                data: 'my data'
            });
            expect(inStoreHandlerStub).toHaveBeenCalledWith('my data');
        });

        it('should set error for captcha', () => {
            const errors = {
                errorMessages: arrayContaining(['My Error Message']),
                errors: objectContaining({
                    challengeAnswer: arrayContaining(['Captcha error is returned'])
                })
            };
            component.registerFailure(errors);
            expect(collectAndValidateBackEndErrorsStub).toHaveBeenCalledWith(objectContaining(errors), anything());
        });

        it('should set error for bi birthday', () => {
            component.biRegForm = {
                current: {
                    setErrorState: () => {}
                }
            };
            const setErrorStateStub = spyOn(component.biRegForm.current, 'setErrorState');

            component.registerFailure({
                errorMessages: ['My Error Message'],
                errors: {
                    biBirthDayInput: ['bi birthday error is returned']
                }
            });
            expect(setErrorStateStub).toHaveBeenCalledWith('bi birthday error is returned');
        });

        it('should show custom error and ‘sign in here’ link for registration fraud error', () => {
            component.registerFailure({
                errorMessages: ['Please sign in with your existing account.'],
                errors: {
                    'profile.account.registrationFraudError': ['Please sign in with your existing account.']
                }
            });

            expect(component.state.errorMessageAndSignInHere.indexOf('Please sign in with your existing account.') > -1).toBeTruthy();
            expect(component.state.errorMessages).toBeNull();
        });

        it('should show error from api', () => {
            component.registerFailure({
                errorMessages: ['My Error Message'],
                errors: {
                    invalidInput: ['Some error occurred']
                }
            });
            expect(component.state.errorMessages.indexOf('My Error Message') > -1).toBeTruthy();
        });
    });

    /** @ToDo: Find reason of tests failing */
    describe('in store user handler', () => {
        let setStateStub3, updateEditStoreStub;

        beforeEach(() => {
            const wrapper = shallow(<RegisterForm />, { disableLifecycleMethods: true });
            component = wrapper.instance();

            component.passwordInput = {
                empty: () => {}
            };
            component.firstNameInput = {
                setValue: () => {}
            };
            component.lastNameInput = {
                setValue: () => {}
            };
            component.profileIdHidden = {
                setValue: () => {}
            };
            component.inStoreEmail = {
                setValue: () => {}
            };

            component.biRegForm = {
                current: {
                    setState: () => {}
                }
            };
            setStateStub3 = spyOn(component.biRegForm.current, 'setState');
            updateEditStoreStub = spyOn(component, 'updateEditStore');
            component.inStoreUserHandler({
                userName: 'myuser@mymail.com',
                profileId: '1234567',
                firstName: 'firstName',
                lastName: 'lastName',
                beautyInsiderAccount: {
                    birthMonth: '01',
                    birthDay: '01',
                    birthYear: '1804'
                }
            });
        });

        it('should set values for store user', () => {
            expect(updateEditStoreStub).toHaveBeenCalledWith('inStoreUser', true);
            expect(updateEditStoreStub).toHaveBeenCalledWith('storeUserEmail', 'myuser@mymail.com');
        });

        it('should set values of store user to bi reg form', () => {
            expect(setStateStub3).toHaveBeenCalledWith({
                isJoinBIChecked: true,
                isJoinBIDisabled: true,
                biMonth: '01',
                biDay: '01',
                biYear: '1804'
            });
        });
    });

    describe('getOptionParams', () => {
        let biFormDataStub;
        let getGuestProfileStub;

        beforeEach(() => {
            biFormDataStub = {
                birthDay: 'BIRTHDAY'
            };
            getGuestProfileStub = spyOn(CheckoutUtils, 'getGuestProfile');
        });

        //TODO: Normal Register Flow

        describe('for guest checkout register', () => {
            beforeEach(() => {
                props = {
                    isCheckout: false,
                    applePayEmailInput: null,
                    isCaptchaEnabled: true,
                    isBIAutoEnroll: false
                };
                const wrapper = shallow(<RegisterForm {...props} />, { disableLifecycleMethods: true });
                component = wrapper.instance();
                component.state = {
                    presetLogin: 'email@email.com',
                    captchaToken: 'CAPTCHA',
                    profileId: null,
                    firstName: 'first',
                    lastName: 'last',
                    password: '123123',
                    confirmPassword: '123123',
                    mobilePhone: '(123) 456-7890'
                };
            });

            it('should call getGuestProfile once to check if register from guest checkout', () => {
                component.getOptionParams(biFormDataStub, true);
                expect(getGuestProfileStub).toHaveBeenCalledTimes(1);
            });

            it('should return optionParams with registrationFrom as orderConfirmation since guestProfile email is the same as email input', () => {
                getGuestProfileStub.and.returnValue({
                    email: 'email@email.com'
                });
                expect(component.getOptionParams(biFormDataStub, true, 'CAPTCHA')).toEqual({
                    userDetails: {
                        email: 'email@email.com',
                        login: 'email@email.com',
                        firstName: 'first',
                        lastName: 'last',
                        password: '123123',
                        confirmPassword: '123123',
                        phoneNumber: '1234567890',
                        biAccount: biFormDataStub
                    },
                    registrationFrom: 'orderConfirmation',
                    captchaToken: 'CAPTCHA',
                    captchaLocation: 'REGISTRATION_POPUP',
                    isJoinBi: true,
                    subscription: {
                        subScribeToEmails: true
                    }
                });
            });

            it('should return optionParams with registerForm as RegisterNormal since guestprofile email is not the same as email input', () => {
                expect(component.getOptionParams(biFormDataStub, true, 'CAPTCHA')).toEqual({
                    userDetails: {
                        email: 'email@email.com',
                        login: 'email@email.com',
                        firstName: 'first',
                        lastName: 'last',
                        password: '123123',
                        confirmPassword: '123123',
                        phoneNumber: '1234567890',
                        biAccount: biFormDataStub
                    },
                    registrationFrom: 'RegisterNormal',
                    captchaToken: 'CAPTCHA',
                    captchaLocation: 'REGISTRATION_POPUP',
                    isJoinBi: true,
                    subscription: {
                        subScribeToEmails: true
                    }
                });
            });

            it('should pass the proper captcha value', () => {
                const testCaptcha = 'TEST_CAPTCHA';
                expect(component.getOptionParams(biFormDataStub, true, testCaptcha)).toEqual({
                    userDetails: {
                        email: 'email@email.com',
                        login: 'email@email.com',
                        firstName: 'first',
                        lastName: 'last',
                        password: '123123',
                        confirmPassword: '123123',
                        phoneNumber: '1234567890',
                        biAccount: biFormDataStub
                    },
                    registrationFrom: 'RegisterNormal',
                    captchaToken: testCaptcha,
                    captchaLocation: 'REGISTRATION_POPUP',
                    isJoinBi: true,
                    subscription: {
                        subScribeToEmails: true
                    }
                });
            });

            it('should not pass a captcha values if not presented', () => {
                expect(component.getOptionParams(biFormDataStub, true)).toEqual({
                    userDetails: {
                        email: 'email@email.com',
                        login: 'email@email.com',
                        firstName: 'first',
                        lastName: 'last',
                        password: '123123',
                        confirmPassword: '123123',
                        phoneNumber: '1234567890',
                        biAccount: biFormDataStub
                    },
                    registrationFrom: 'RegisterNormal',
                    isJoinBi: true,
                    subscription: {
                        subScribeToEmails: true
                    }
                });
            });
        });
    });

    it('Phone text input should have the right translated label for the placeholder', () => {
        // Arrange
        spyOn(Sephora, 'isMobile').and.returnValue(false);
        spyOn(Sephora, 'isDesktop').and.returnValue(true);
        // spyOn(component, 'pageLoadAnalytics').and.returnValue(true);

        // Act
        const wrapper = shallow(<RegisterForm isRegisterModal={true} />, { disableLifecycleMethods: true });

        // Assert
        const phoneField = wrapper.find('TextInput[name="mobilePhone"]');
        expect(phoneField.props().label).toBe('Phone Number');
    });
});
