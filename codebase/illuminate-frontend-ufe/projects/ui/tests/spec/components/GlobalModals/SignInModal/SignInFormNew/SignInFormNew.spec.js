/* eslint-disable no-unused-vars */
const React = require('react');
const { createSpy, objectContaining } = jasmine;
const { shallow } = require('enzyme');

describe('SignInFormNew component', () => {
    let store;
    let Actions;
    let watch;
    let auth;
    let processEvent;
    let anaConsts;
    let anaUtils;
    let formValidator;
    let UserActions;
    let localeUtils;
    let userUtils;
    let event;
    let SignInFormNew;
    let props;
    let component;
    let dispatchStub;
    let subscribeStub;
    let getStateStub;
    let showSignInModalStub;
    let showRegisterModalStub;
    let setStateStub;
    let pageLoadAnalyticsStub;
    let preventDefaultStub;
    let getLastAsyncPageLoadDataStub;
    let buildNavPathStub;
    let processStub;
    let getErrorsStub;
    let isValidStub;
    let signInStub;
    let showForgotPasswordModalStub;
    let getMostRecentEventStub;

    beforeEach(() => {
        store = require('Store').default;
        dispatchStub = spyOn(store, 'dispatch');
        subscribeStub = spyOn(store, 'subscribe');
        getStateStub = spyOn(store, 'getState').and.returnValue({
            user: {},
            auth: {},
            applePaySession: false
        });

        Actions = require('Actions').default;
        showSignInModalStub = spyOn(Actions, 'showSignInModal');
        showRegisterModalStub = spyOn(Actions, 'showRegisterModal');
        showForgotPasswordModalStub = spyOn(Actions, 'showForgotPasswordModal');

        watch = require('redux-watch');
        auth = require('utils/Authentication').default;

        processEvent = require('analytics/processEvent').default;
        processStub = spyOn(processEvent, 'process');

        anaConsts = require('analytics/constants').default;

        anaUtils = require('analytics/utils').default;
        getLastAsyncPageLoadDataStub = spyOn(anaUtils, 'getLastAsyncPageLoadData');
        buildNavPathStub = spyOn(anaUtils, 'buildNavPath');
        getMostRecentEventStub = spyOn(anaUtils, 'getMostRecentEvent');

        formValidator = require('utils/FormValidator').default;
        getErrorsStub = spyOn(formValidator, 'getErrors').and.returnValue({ fields: ['some'] });

        UserActions = require('actions/UserActions').default;
        signInStub = spyOn(UserActions, 'signIn');

        localeUtils = require('utils/LanguageLocale').default;
        userUtils = require('utils/User').default;

        SignInFormNew = require('components/GlobalModals/SignInModal/SignInFormNew/SignInFormNew').default;

        props = { presetLogin: 'a@b.com' };

        preventDefaultStub = createSpy('preventDefaultStub');
        event = { preventDefault: preventDefaultStub };
    });

    describe('componentDidMount method', () => {
        beforeEach(() => {
            component = new SignInFormNew(props);
            setStateStub = spyOn(component, 'setState');
            spyOn(component, 'loadThirdpartyScript');
            pageLoadAnalyticsStub = spyOn(component, 'pageLoadAnalytics');
            subscribeStub.and.callFake(() => {});
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
    });

    describe('pageLoadAnalytics method', () => {
        beforeEach(() => {
            props.analyticsData = { context: 'Some Value' };
            props.source = auth.SIGN_IN_SOURCES.ACCOUNT_GREETING;
            const wrapper = shallow(<SignInFormNew {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.pageLoadAnalytics();
        });

        it('should call getLastAsyncPageLoadData method', () => {
            expect(getLastAsyncPageLoadDataStub).toHaveBeenCalledTimes(1);
        });

        it('should call buildNavPath method', () => {
            expect(buildNavPathStub).toHaveBeenCalledTimes(1);
        });

        it('should call process method', () => {
            expect(processStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('handleCreateAccountClick method', () => {
        beforeEach(() => {
            const wrapper = shallow(<SignInFormNew {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.loginInput = { getValue: () => {} };
            component.handleCreateAccountClick(event);
        });

        it('should call dispatch method', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(2);
        });

        it('should call showSignInModal method', () => {
            expect(showSignInModalStub).toHaveBeenCalledTimes(1);
        });

        it('should call showRegisterModal method', () => {
            expect(showRegisterModalStub).toHaveBeenCalledTimes(1);
        });

        it('should call showRegisterModal method', () => {
            expect(showRegisterModalStub).toHaveBeenCalledWith(
                objectContaining({
                    isOpen: true,
                    callback: undefined,
                    errback: undefined
                })
            );
        });
    });

    describe('isValid method', () => {
        beforeEach(() => {
            const wrapper = shallow(<SignInFormNew {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.isValid();
        });

        it('should call getErrors method', () => {
            expect(getErrorsStub).toHaveBeenCalledTimes(1);
        });

        it('should call process method', () => {
            expect(processStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('signIn method', () => {
        beforeEach(() => {
            const wrapper = shallow(<SignInFormNew {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.loginInput = { getValue: () => {} };
            component.passwordInput = { getValue: () => {} };
            isValidStub = spyOn(component, 'isValid').and.returnValue(true);
            component.signIn();
        });

        it('should call isValid method', () => {
            expect(isValidStub).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should call signIn method', () => {
            expect(signInStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('closeModal method', () => {
        beforeEach(() => {
            const wrapper = shallow(<SignInFormNew {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.closeModal();
        });

        it('should call isValid method', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(1);
        });

        it('should call showSignInModal method', () => {
            expect(showSignInModalStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('forgotPassword method', () => {
        beforeEach(() => {
            const wrapper = shallow(<SignInFormNew {...props} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            component.loginInput = { getValue: () => {} };
            component.forgotPassword();
        });

        it('should call isValid method', () => {
            expect(dispatchStub).toHaveBeenCalledTimes(2);
        });

        it('should call showSignInModal method', () => {
            expect(showSignInModalStub).toHaveBeenCalledTimes(1);
        });

        it('should call showForgotPasswordModal method', () => {
            expect(showForgotPasswordModalStub).toHaveBeenCalledTimes(1);
        });

        it('should call getMostRecentEvent method', () => {
            expect(getMostRecentEventStub).toHaveBeenCalledTimes(1);
        });

        it('should call process method', () => {
            expect(processStub).toHaveBeenCalledTimes(1);
        });
    });
});
