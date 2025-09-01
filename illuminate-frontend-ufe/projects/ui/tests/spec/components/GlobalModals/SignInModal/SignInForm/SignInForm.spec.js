/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const React = require('react');
const { any, createSpy, objectContaining } = jasmine;
const { shallow } = require('enzyme');

describe('SignInForm component', () => {
    let store;
    let userActions;
    let actions;
    let localeUtils;
    let userUtils;
    let ApplePay;
    let dispatchStub;
    let SignInForm;
    let props;
    let component;
    let event;
    let anaUtils;
    let anaConsts;
    let subscribeStub;
    let getStateStub;
    let preventDefaultStub;
    let signOutStub;
    let showSignInModalStub;
    let showSignInWithMessagingModalStub;
    let showRegisterModalStub;
    let setStateStub;
    let signInStub;
    let checkUserStub;
    let processEvent;
    let processEventStub;
    let errbackStub;
    let showAuthenticateModalStub;
    let getMostRecentEventStub;
    let showForgotPasswordModalStub;
    let pageLoadAnalyticsStub;
    let isRecognizedStub;
    let isMobileStub;
    let getCurrentCountryStub;
    let prepareSessionStub;
    let Storage;
    let LOCAL_STORAGE;

    beforeEach(() => {
        store = require('Store').default;
        dispatchStub = spyOn(store, 'dispatch');
        subscribeStub = spyOn(store, 'subscribe');
        getStateStub = spyOn(store, 'getState').and.returnValue({
            user: {},
            applePaySession: false
        });

        Storage = require('utils/localStorage/Storage').default;
        LOCAL_STORAGE = require('utils/localStorage/Constants').default;

        actions = require('actions/Actions').default;
        showSignInModalStub = spyOn(actions, 'showSignInModal');
        showSignInWithMessagingModalStub = spyOn(actions, 'showSignInWithMessagingModal');
        showRegisterModalStub = spyOn(actions, 'showRegisterModal');

        localeUtils = require('utils/LanguageLocale').default;
        getCurrentCountryStub = spyOn(localeUtils, 'getCurrentCountry');

        userActions = require('actions/UserActions').default;
        signOutStub = spyOn(userActions, 'signOut');
        signInStub = spyOn(userActions, 'signIn');
        checkUserStub = spyOn(userActions, 'checkUser');

        userUtils = require('utils/User').default;
        isRecognizedStub = spyOn(userUtils, 'isRecognized');

        processEvent = require('analytics/processEvent').default;
        processEventStub = spyOn(processEvent, 'process');
        anaUtils = require('analytics/utils').default;
        anaConsts = require('analytics/constants').default;

        ApplePay = require('services/ApplePay').default;

        preventDefaultStub = createSpy('preventDefaultStub');
        errbackStub = createSpy('errbackStub');

        isMobileStub = spyOn(Sephora, 'isMobile');

        SignInForm = require('components/GlobalModals/SignInModal/SignInForm/SignInForm').default;
        props = {
            presetLogin: 'a@b.com'
        };

        event = {
            preventDefault: preventDefaultStub
        };
    });

    describe('componentDidMount method', () => {
        let setItemStub;
        beforeEach(() => {
            props.isSignInWithMessaging = false;
            setItemStub = spyOn(Storage.local, 'setItem');
            component = new SignInForm(props);
            setStateStub = spyOn(component, 'setState');
            spyOn(component, 'loadThirdpartyScript');
            pageLoadAnalyticsStub = spyOn(component, 'pageLoadAnalytics');
            component.componentDidMount();
        });

        it('should call subscribe method', () => {
            expect(subscribeStub).toHaveBeenCalledTimes(1);
        });

        it('should call getState method', () => {
            expect(getStateStub).toHaveBeenCalled();
        });

        it('should call pageLoadAnalytics method', () => {
            expect(pageLoadAnalyticsStub).toHaveBeenCalledTimes(1);
        });

        it('should call setState method', () => {
            expect(setStateStub).toHaveBeenCalledTimes(1);
        });

        it('should set the SIGN_IN_SEEN localStorage', () => {
            expect(setItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.SIGN_IN_SEEN, true);
        });
    });

    // describe('resetAppleSignInEmail method', () => {
    //     beforeEach(() => {
    //         const wrapper = shallow(<SignInForm {...props} />);
    //         component = wrapper.instance();
    //         setStateStub = spyOn(component, 'setState');
    //         pageLoadAnalyticsStub = spyOn(component, 'pageLoadAnalytics');
    //         component.resetAppleSignInEmail();
    //     });

    //     it('should call setState method', () => {
    //         expect(setStateStub).toHaveBeenCalledTimes(1);
    //     });

    //     it('should call setState method with values', () => {
    //         expect(setStateStub).toHaveBeenCalledWith({ isEmailDisabled: false });
    //     });
    // });

    describe('applePaySignInOrRegister method', () => {
        let compSignInStub;
        beforeEach(() => {
            prepareSessionStub = spyOn(ApplePay, 'prepareSession');
            const wrapper = shallow(<SignInForm {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            setStateStub = spyOn(component, 'setState');
            compSignInStub = spyOn(component, 'signIn');
            component.registerForm.current = {
                validateCaptchaAndRegister: createSpy('validateCaptchaAndRegister')
            };
        });

        it('should call signIn method', () => {
            component.state = {
                userExists: true
            };
            component.applePaySignInOrRegister({});
            expect(compSignInStub).toHaveBeenCalledTimes(1);
        });

        xit('should call validateCaptchaAndRegister method', () => {
            component.state = {
                userExists: false,
                callback: () => {
                    return 'something';
                }
            };
            component.applePaySignInOrRegister({});
            expect(component.registerForm.current.validateCaptchaAndRegister).toHaveBeenCalledTimes(1);
        });

        it('should call validateCaptchaAndRegister method with value', () => {
            component.state = {
                userExists: false,
                callback: () => {
                    return 'something';
                }
            };
            component.applePaySignInOrRegister({ event: {} });
            expect(component.registerForm.current.validateCaptchaAndRegister).toHaveBeenCalledWith(any(Function));
        });
    });

    describe('signIn method', () => {
        let isValidStub;

        beforeEach(() => {
            const wrapper = shallow(<SignInForm {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            isValidStub = spyOn(component, 'isValid');
            component.loginInput.current = {
                getValue: () => {}
            };
            spyOn(component.loginInput.current, 'getValue').and.returnValue('a@b.com');
        });

        it('should call the isValid method', () => {
            component.signIn(event);
            expect(isValidStub).toHaveBeenCalledTimes(1);
        });
    });

    // describe('not you', () => {
    //     beforeEach(() => {
    //         const wrapper = shallow(<SignInForm {...props} />);
    //         component = wrapper.instance();
    //     });

    //     it('should dispatch showSignInModal false', () => {
    //         component.signOut(event);
    //         expect(dispatchStub).toHaveBeenCalledTimes(1);
    //         expect(signOutStub).toHaveBeenCalledTimes(1);
    //     });
    // });

    // describe('invalid input pre-api register call', () => {
    //     beforeEach(() => {
    //         const wrapper = shallow(<SignInForm {...props} />);
    //         component = wrapper.instance();

    //         setStateStub = spyOn(component, 'setState');
    //         component.ctrlr();

    //         const formValidator = require('utils/FormValidator').default;
    //         spyOn(formValidator, 'getErrors').and.returnValue({
    //             fields: ['username'],
    //             messages: ['Error']
    //         });

    //         component.loginInput = {
    //             getValue: () => {}
    //         };
    //     });

    //     it('store.dispatch should not be called', () => {
    //         component.signIn(event);
    //         expect(dispatchStub).not.toHaveBeenCalledTimes(1);
    //     });

    //     it('text input should display an error', () => {
    //         const result = component.isValid();
    //         expect(result).toBeFalsy();
    //     });
    // });

    // describe('existing user', () => {
    //     let CheckoutUtils;
    //     let getGuestProfileStub;

    //     beforeEach(() => {
    //         const wrapper = shallow(<SignInForm {...props} />);
    //         component = wrapper.instance();
    //         component.state.userExists = true;
    //         spyOn(component, 'isValid').and.returnValue(true);

    //         component.loginInput = {
    //             getValue: () => {}
    //         };
    //         spyOn(component.loginInput, 'getValue').and.returnValue('a@b.com');

    //         component.passwordInput = {
    //             getValue: () => {}
    //         };
    //         spyOn(component.passwordInput, 'getValue').and.returnValue('password');

    //         CheckoutUtils = require('utils/Checkout').default;
    //         getGuestProfileStub = spyOn(CheckoutUtils, 'getGuestProfile');
    //     });

    //     it('should call getGuestProfile once to check if guest sign in', () => {
    //         component.signIn(event);
    //         expect(getGuestProfileStub).toHaveBeenCalledTimes(1);
    //     });

    //     it('should signin', () => {
    //         // Arrange
    //         component.signIn(event);

    //         expect(dispatchStub).toHaveBeenCalledTimes(1);
    //         expect(signInStub).toHaveBeenCalledWith(
    //             'a@b.com',
    //             'password',
    //             true,
    //             true,
    //             any(Function),
    //             any(Function),
    //             false,
    //             null,
    //             undefined,
    //             undefined,
    //             undefined
    //         );
    //     });

    //     it('should signin with SSI', () => {
    //         // Arrange
    //         component.state.ssi = true;

    //         component.signIn(event);

    //         expect(dispatchStub).toHaveBeenCalledTimes(1);
    //         expect(signInStub).toHaveBeenCalledWith(
    //             'a@b.com',
    //             'password',
    //             true,
    //             true,
    //             any(Function),
    //             any(Function),
    //             false,
    //             null,
    //             undefined,
    //             undefined,
    //             undefined
    //         );
    //     });

    //     it('should signin guest user', () => {
    //         // Arrange
    //         getGuestProfileStub.and.returnValue({
    //             email: 'a@b.com'
    //         });

    //         // Act
    //         component.signIn(event);

    //         // Assert
    //         expect(dispatchStub).toHaveBeenCalledTimes(1);
    //         expect(signInStub).toHaveBeenCalledWith(
    //             'a@b.com',
    //             'password',
    //             true,
    //             false,
    //             any(Function),
    //             any(Function),
    //             true,
    //             null,
    //             undefined,
    //             undefined,
    //             undefined
    //         );
    //     });
    // });

    describe('new user', () => {
        beforeEach(() => {
            props.trackOpenRegisterModal = createSpy('trackOpenRegisterModal');

            const wrapper = shallow(<SignInForm {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.state.userExists = false;
            spyOn(component, 'isValid').and.returnValue(true);
            setStateStub = spyOn(component, 'setState');

            component.loginInput.current = {
                getValue: () => {}
            };
            spyOn(component.loginInput.current, 'getValue').and.returnValue('a@b.com');
        });

        it('should check if user already exists', () => {
            // Arrange/Act
            component.signIn(event);

            // Assert
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(checkUserStub).toHaveBeenCalledWith('a@b.com', any(Function), any(Function));
        });

        it('user already exists', () => {
            component.signIn(event);

            const successCallback = checkUserStub.calls.first().args[1];
            successCallback({
                isStoreBiMember: false
            });

            expect(setStateStub).toHaveBeenCalledWith({
                errorMessages: [
                    'An account already exists for the email address you’ve entered.' + ' Please sign in or choose another email address.'
                ]
            });
        });

        it('store bi user', () => {
            component.signIn(event);

            const successCallback = checkUserStub.calls.first().args[1];
            successCallback({
                isStoreBiMember: true
            });

            expect(showSignInModalStub).toHaveBeenCalledWith({ isOpen: false });
            expect(showRegisterModalStub).toHaveBeenCalledWith(objectContaining({ isOpen: true }));
        });

        it('user not found', () => {
            component.signIn(event);

            const successCallback = checkUserStub.calls.first().args[1];
            successCallback({
                isStoreBiMember: true
            });

            expect(showSignInModalStub).toHaveBeenCalledWith({ isOpen: false });
            expect(showRegisterModalStub).toHaveBeenCalledWith(objectContaining({ isOpen: true }));
        });
    });

    // TODO 2020.6: This describe block creates race-conditions, investigate and fix
    // describe('forgotPassword method', () => {
    //     beforeEach(() => {
    //         showAuthenticateModalStub = spyOn(actions, 'showAuthenticateModal');
    //         showForgotPasswordModalStub = spyOn(actions, 'showForgotPasswordModal');
    //         getMostRecentEventStub = spyOn(anaUtils, 'getMostRecentEvent');
    //     });

    //     describe('First If block', () => {
    //         beforeEach(() => {
    //             props.isSignInWithAuthenticateModal = true;
    //             const wrapper = shallow(<SignInForm {...props} />);
    //             component = wrapper.instance();
    //             component.loginInput = {
    //                 getValue: () => {
    //                     return 'someValue';
    //                 }
    //             };
    //             component.forgotPassword();
    //         });

    //         it('should call dispatch method', () => {
    //             expect(dispatchStub).toHaveBeenCalledTimes(2);
    //         });

    //         it('should call first dispatch method with value', () => {
    //             expect(dispatchStub).toHaveBeenCalledWith(showAuthenticateModalStub());
    //         });

    //         it('should call showAuthenticateModal method', () => {
    //             expect(showAuthenticateModalStub).toHaveBeenCalledTimes(1);
    //         });

    //         it('should call first showAuthenticateModal method with value', () => {
    //             expect(showAuthenticateModalStub).toHaveBeenCalledWith({ isOpen: false });
    //         });

    //         it('should call showForgotPasswordModal method', () => {
    //             expect(showAuthenticateModalStub).toHaveBeenCalledTimes(1);
    //         });

    //         it('should call first showForgotPasswordModal method with value', () => {
    //             expect(showForgotPasswordModalStub).toHaveBeenCalledWith(true, 'someValue');
    //         });
    //     });

    //     describe('Else If block', () => {
    //         beforeEach(() => {
    //             props.isSignInWithMessaging = true;
    //             const wrapper = shallow(<SignInForm {...props} />);
    //             component = wrapper.instance();
    //             component.loginInput = {
    //                 getValue: () => {
    //                     return 'someValue';
    //                 }
    //             };
    //             component.forgotPassword();
    //         });

    //         it('should call dispatch method', () => {
    //             expect(dispatchStub).toHaveBeenCalledTimes(2);
    //         });

    //         it('should call first dispatch method with value', () => {
    //             expect(dispatchStub).toHaveBeenCalledWith(showSignInWithMessagingModalStub());
    //         });

    //         it('should call showSignInWithMessagingModal method', () => {
    //             expect(showSignInWithMessagingModalStub).toHaveBeenCalledTimes(1);
    //         });

    //         it('should call first showSignInWithMessagingModal method with value', () => {
    //             expect(showSignInWithMessagingModalStub).toHaveBeenCalledWith({ isOpen: false });
    //         });
    //     });

    //     describe('Else block', () => {
    //         beforeEach(() => {
    //             const wrapper = shallow(<SignInForm {...props} />);
    //             component = wrapper.instance();
    //             component.loginInput = {
    //                 getValue: () => {
    //                     return 'someValue';
    //                 }
    //             };
    //             component.forgotPassword();
    //         });

    //         it('should call dispatch method', () => {
    //             expect(dispatchStub).toHaveBeenCalledTimes(2);
    //         });

    //         it('should call first dispatch method with value', () => {
    //             expect(dispatchStub).toHaveBeenCalledWith(showSignInModalStub());
    //         });

    //         it('should call showSignInModal method', () => {
    //             expect(showSignInModalStub).toHaveBeenCalledTimes(1);
    //         });

    //         it('should call first showSignInModal method with value', () => {
    //             expect(showSignInModalStub).toHaveBeenCalledWith({ isOpen: false });
    //         });

    //         it('should call second dispatch method with value', () => {
    //             expect(dispatchStub).toHaveBeenCalledWith(showForgotPasswordModalStub());
    //         });
    //     });

    //     describe('analytics tracking', () => {
    //         beforeEach(() => {
    //             getMostRecentEventStub.and.returnValue({
    //                 eventInfo: {
    //                     attributes: {
    //                         pageName: 'SomePageName'
    //                     }
    //                 }
    //             });
    //             const wrapper = shallow(<SignInForm {...props} />);
    //             component = wrapper.instance();
    //             component.loginInput = {
    //                 getValue: () => {
    //                     return 'someValue';
    //                 }
    //             };
    //             component.forgotPassword();
    //         });

    //         it('should call process method', () => {
    //             expect(processEventStub).toHaveBeenCalledTimes(2);
    //         });

    //         it('should call first process method with value', () => {
    //             const { SIGN_IN } = anaConsts.PAGE_TYPES;
    //             const { RESET_PASSWORD } = anaConsts.PAGE_DETAIL;

    //             expect(processEventStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, {
    //                 data: {
    //                     pageName: `${SIGN_IN}:${RESET_PASSWORD}:n/a:*`,
    //                     pageType: SIGN_IN,
    //                     pageDetail: RESET_PASSWORD,
    //                     previousPageName: 'SomePageName'
    //                 }
    //             });
    //         });
    //     });
    // });
});
