const React = require('react');
const { any, createSpy } = jasmine;
const { shallow } = require('enzyme');

describe('ForgotPasswordModal component', () => {
    let store;
    let Actions;
    let userActions;
    let anaConsts;
    let processEvent;
    let Location;
    let localeUtils;
    let ForgotPasswordModal;
    let getText;
    let props;
    let dispatchStub;
    let component;
    let event;
    let showInfoModalSpy;
    let forgotPasswordStub;
    let isOrderConfirmationPageSpy;

    beforeEach(() => {
        store = require('store/Store').default;
        Actions = require('Actions').default;
        userActions = require('actions/UserActions').default;
        anaConsts = require('analytics/constants').default;
        processEvent = require('analytics/processEvent').default;
        Location = require('utils/Location').default;
        localeUtils = require('utils/LanguageLocale').default;
        ForgotPasswordModal = require('components/GlobalModals/ForgotPasswordModal/ForgotPasswordModal').default;

        dispatchStub = spyOn(store, 'dispatch');
        showInfoModalSpy = spyOn(Actions, 'showInfoModal');
        forgotPasswordStub = spyOn(userActions, 'forgotPassword');
        isOrderConfirmationPageSpy = spyOn(Location, 'isOrderConfirmationPage');
        getText = localeUtils.getLocaleResourceFile('components/GlobalModals/ForgotPasswordModal/locales', 'ForgotPasswordModal');

        props = { presetLogin: 'a@b.com' };
        event = { preventDefault: createSpy() };
        digitalData.event = [
            {
                eventInfo: {
                    attributes: {
                        pageType: 'pageType',
                        pageName: 'pageName',
                        pageDetail: 'pageDetail',
                        previousPageName: 'previousPageName',
                        world: 'world'
                    },
                    eventName: 'asyncPageLoad'
                }
            }
        ];
    });

    describe('dispatchShowInfoModal', () => {
        let requestCloseSpy;

        beforeEach(() => {
            const wrapper = shallow(<ForgotPasswordModal {...props} />);
            component = wrapper.instance();
            requestCloseSpy = spyOn(component, 'requestClose');
            component.loginInput = { getValue: () => props.presetLogin };
            component.dispatchShowInfoModal('errorMessage');
        });

        it('should call requestClose once', () => {
            expect(requestCloseSpy).toHaveBeenCalledTimes(1);
        });

        it('should dispatch showInfoModal once', () => {
            expect(showInfoModalSpy).toHaveBeenCalledTimes(1);
        });

        it('should dispatch showInfoModal with', () => {
            expect(showInfoModalSpy).toHaveBeenCalledWith({
                isOpen: true,
                title: getText('resetPassword'),
                message: 'errorMessage',
                buttonText: getText('confirmButton'),
                bodyPaddingBottom: 4,
                isHtml: true
            });
        });
    });

    describe('submit', () => {
        beforeEach(() => {
            const wrapper = shallow(<ForgotPasswordModal {...props} />);
            component = wrapper.instance();
            component.loginInput = {
                validateError: () => {},
                getValue: () => props.presetLogin
            };
        });

        it('should check if order confirmation page once', () => {
            component.submit(event);
            expect(isOrderConfirmationPageSpy).toHaveBeenCalledTimes(1);
        });

        it('should dispatch forgotPassword with the login provided', () => {
            // Arrange
            const wrapper = shallow(<ForgotPasswordModal {...props} />);
            component = wrapper.instance();
            component.loginInput = {
                validateError: () => {},
                getValue: () => props.presetLogin
            };

            // Act
            component.submit(event);

            // Assert
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(forgotPasswordStub).toHaveBeenCalledWith(props.presetLogin, any(Function), any(Function), null);
        });

        it('should pass source argument with forgotPassword call', () => {
            // Arrange
            const wrapper = shallow(<ForgotPasswordModal {...props} />);
            component = wrapper.instance();
            component.loginInput = {
                validateError: () => {},
                getValue: () => props.presetLogin
            };
            isOrderConfirmationPageSpy.and.returnValue(true);

            // Act
            component.submit(event);

            // Assert
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(forgotPasswordStub).toHaveBeenCalledWith(props.presetLogin, any(Function), any(Function), 'orderConfirmation');
        });

        describe('invalid email address', () => {
            beforeEach(() => {
                props = { presetLogin: 'a@b' };
                component = shallow(<ForgotPasswordModal {...props} />).instance();
                component.loginInput = {
                    getValue: () => props.presetLogin
                };

                spyOn(component, 'isValid').and.returnValue(false);
                spyOn(component, 'setState');
            });

            it('should not dispatch forgotPassword', () => {
                component.submit(event);
                expect(dispatchStub).not.toHaveBeenCalled();
                expect(forgotPasswordStub).not.toHaveBeenCalled();
            });
        });
    });

    describe('isValid analytics', () => {
        it('should fire analytics with correct data if there are errors', () => {
            // Arrange
            const process = spyOn(processEvent, 'process');
            const wrapper = shallow(<ForgotPasswordModal {...props} />);
            component = wrapper.instance();
            component.loginInput = { validateError: createSpy('validateError').and.returnValue('error') };

            // Act
            component.isValid();

            // Assert
            expect(process).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    bindingMethods: any(Function),
                    eventStrings: ['event140', 'event141'],
                    fieldErrors: ['error'],
                    pageName: 'pageName',
                    previousPage: 'previousPageName',
                    pageDetail: 'pageDetail',
                    world: 'world'
                }
            });
        });

        it('should not fire analytics if there are no errors', () => {
            const processEventStub = spyOn(processEvent, 'process');
            const wrapper = shallow(<ForgotPasswordModal {...props} />);
            component = wrapper.instance();
            component.loginInput = { validateError: createSpy('validateError').and.returnValue('') };
            component.isValid();
            expect(processEventStub).not.toHaveBeenCalled();
        });
    });
});
