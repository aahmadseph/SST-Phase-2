const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const store = require('Store').default;
const actions = require('actions/Actions').default;
const CreditCardApplyMessaging =
    require('components/GlobalModals/SignInWithMessagingModal/CreditCardApplyMessaging/CreditCardApplyMessaging').default;

describe('CreditCardApplyMessaging component', () => {
    it('register handler should dispatch showSignInWithMessagingModalStub and showRegisterModal true', () => {
        // Arrange
        const dispatchStub = spyOn(store, 'dispatch');
        const showSignInWithMessagingModalStub = spyOn(actions, 'showSignInWithMessagingModal');
        const showRegisterModalStub = spyOn(actions, 'showRegisterModal');
        const callbackStub = createSpy('callbackStub');
        const errbackStub = createSpy('errbackStub');
        const props = {
            callback: callbackStub,
            errback: errbackStub
        };

        // Act
        shallow(<CreditCardApplyMessaging {...props} />)
            .instance()
            .registerHandler();

        // Assert
        expect(dispatchStub).toHaveBeenCalledTimes(2);
        expect(showSignInWithMessagingModalStub).toHaveBeenCalledWith({ isOpen: false });
        expect(showRegisterModalStub).toHaveBeenCalledWith({
            isOpen: true,
            callback: callbackStub,
            errback: errbackStub,
            isCreditCardApply: true
        });
    });
});
