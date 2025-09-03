const React = require('react');
const { shallow } = require('enzyme');

describe('GuestCheckoutMessaging component', () => {
    let GuestCheckoutMessaging;

    beforeEach(() => {
        GuestCheckoutMessaging = require('components/GlobalModals/SignInWithMessagingModal/GuestCheckoutMessaging/GuestCheckoutMessaging').default;
    });

    it('initializeGuestCheckout Method ApplePayFlow should call checkoutUtils.initializeCheckout method', () => {
        // Arrange
        const processEvent = require('analytics/processEvent').default;
        spyOn(processEvent, 'process');
        const checkoutUtils = require('utils/Checkout').default;
        const initializeCheckoutStub = spyOn(checkoutUtils, 'initializeCheckout').and.returnValue({ then: () => ({ catch: () => {} }) });
        const props = {
            isGuestCheckout: true,
            isApplePayFlow: true
        };

        // Act
        const component = new GuestCheckoutMessaging(props);
        component.initializeGuestCheckout();

        // Assert
        expect(initializeCheckoutStub).toHaveBeenCalledTimes(1);
    });

    it('showRegistrationModal methods should dispatch showRegisterModal action', () => {
        // Arrange
        const modalArguments = {
            isOpen: true,
            analyticsData: { linkData: 'sign-in_create-account_click' }
        };
        const props = {
            isGuestCheckout: true,
            isApplePayFlow: true
        };
        const actions = require('Actions').default;
        const showRegisterModalStub = spyOn(actions, 'showRegisterModal');

        // Act
        const component = new GuestCheckoutMessaging(props);
        component.showRegistrationModal();

        // Assert
        expect(showRegisterModalStub).toHaveBeenCalledWith(modalArguments);
    });

    it('should render the correct title', () => {
        // Arrange
        const expectedTitle = 'Create an Account';
        const props = {
            isGuestCheckout: true,
            isApplePayFlow: true
        };

        // Act
        const wrapper = shallow(<GuestCheckoutMessaging {...props} />, { disableLifecycleMethods: true });

        // Assert
        const textWrapper = wrapper.find('Text');
        const { children } = textWrapper.props();
        expect(children).toEqual(expectedTitle);
    });

    it('should render the correct text within the button', () => {
        // Arrange
        const expectedButtonText = 'Create Account';
        const props = {
            isGuestCheckout: true,
            isApplePayFlow: true
        };

        // Act
        const wrapper = shallow(<GuestCheckoutMessaging {...props} />, { disableLifecycleMethods: true });

        // Assert

        // Assert
        const buttonWrapper = wrapper.find('Button[data-at="create_account_button"]');
        const { children } = buttonWrapper.props();
        expect(children).toEqual(expectedButtonText);
    });
});
