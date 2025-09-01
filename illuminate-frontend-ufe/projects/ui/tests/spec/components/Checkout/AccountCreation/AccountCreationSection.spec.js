/* eslint-disable no-unused-vars */
/* eslint-disable object-curly-newline */
const React = require('react');
const { any, createSpy } = jasmine;
const { shallow } = require('enzyme');
const { INTERSTICE_DELAY_MS } = require('components/Checkout/constants');

describe('AccountCreationSection component', () => {
    let OrderActions;
    let AccountCreationSection;
    let store;
    let Location;
    let anaUtils;
    let userUtils;
    let anaConsts;
    let component;
    let mockProps;

    beforeEach(() => {
        OrderActions = require('actions/OrderActions').default;
        store = require('Store').default;
        Location = require('utils/Location').default;
        anaUtils = require('analytics/utils').default;
        userUtils = require('utils/User').default;
        anaConsts = require('analytics/constants').default;
        AccountCreationSection = require('components/Checkout/Sections/AccountCreation/Section/AccountCreationSection').default;
    });

    describe('Store Bi Member Processing', () => {
        let setStateStub;
        let inStoreUserHandlerStub;
        let handlerResultStub;

        beforeEach(() => {
            mockProps = {
                profile: {
                    isStoreBiMember: true
                }
            };
            const wrapper = shallow(<AccountCreationSection {...mockProps} />, { disableLifecycleMethods: true });
            component = wrapper.instance();
            handlerResultStub = createSpy();
            inStoreUserHandlerStub = createSpy().and.returnValue(handlerResultStub);
            component.registerForm = {
                inStoreUserHandler: inStoreUserHandlerStub
            };
            setStateStub = spyOn(component, 'setState').and.callFake((...args) => typeof args[1] === 'function' && args[1]());
            component.componentDidMount();
        });

        it('should toggle component to Store User mode', () => {
            expect(setStateStub).toHaveBeenCalledWith({ inStoreUser: true }, handlerResultStub);
        });

        it('should pass profile data to Store user handler of Register Form', () => {
            expect(inStoreUserHandlerStub).toHaveBeenCalledWith(mockProps.profile);
        });
    });

    describe('Create Account', () => {
        let registerStub;
        let dispatchStub;
        let sectionSavedStub;
        let sectionSavedResultStub;
        let getLocationStub;

        beforeEach(() => {
            mockProps = { profile: {} };
            dispatchStub = spyOn(store, 'dispatch');
            sectionSavedResultStub = createSpy();
            getLocationStub = spyOn(Location, 'getLocation').and.returnValue({
                pathname: 'pathname'
            });
            sectionSavedStub = spyOn(OrderActions, 'sectionSaved').and.returnValue(sectionSavedResultStub);
            const wrapper = shallow(<AccountCreationSection {...mockProps} />);
            component = wrapper.instance();
            registerStub = createSpy().and.callFake(arg0 => typeof arg0 === 'function' && arg0());
            component.registerForm = {
                validateCaptchaAndRegister: registerStub
            };

            component.createAccount();
        });

        it('should call register method with interstice delay specified', () => {
            // Arrange
            const wrapper = shallow(<AccountCreationSection {...mockProps} />);
            component = wrapper.instance();
            component.registerForm = {
                validateCaptchaAndRegister: createSpy('validateCaptchaAndRegister')
            };

            // Act
            component.createAccount();

            // Assert
            expect(component.registerForm.validateCaptchaAndRegister).toHaveBeenCalledWith(any(Function), INTERSTICE_DELAY_MS);
        });

        it('should get url from current location', () => {
            expect(getLocationStub).toHaveBeenCalled();
        });

        it('should use current url to switch the section', () => {
            expect(sectionSavedStub).toHaveBeenCalledWith('pathname');
        });

        it('should fire an action to switch the section', () => {
            expect(dispatchStub).toHaveBeenCalledWith(sectionSavedResultStub);
        });
    });
});
