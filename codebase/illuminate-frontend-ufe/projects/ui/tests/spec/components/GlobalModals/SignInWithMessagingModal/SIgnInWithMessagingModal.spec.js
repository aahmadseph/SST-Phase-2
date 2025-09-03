const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const store = require('Store').default;
const actions = require('actions/Actions').default;
const SignInWithMessagingModal = require('components/GlobalModals/SignInWithMessagingModal/SignInWithMessagingModal').default;

describe('SignInWithMessagingModal component', () => {
    describe('close modal', () => {
        it('should dispatch showSignInWithMessagingModal false', () => {
            // Arrange
            const dispatchStub = spyOn(store, 'dispatch');
            const showSignInWithMessagingModalStub = spyOn(actions, 'showSignInWithMessagingModal');

            // Act
            shallow(<SignInWithMessagingModal />)
                .instance()
                .requestClose();

            // Assert
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(showSignInWithMessagingModalStub).toHaveBeenCalledWith({ isOpen: false });
        });

        it('should call the errback if provided', () => {
            // Arrange
            const props = { errback: createSpy('errback') };

            // Act
            shallow(<SignInWithMessagingModal {...props} />)
                .instance()
                .requestClose();

            // Assert
            expect(props.errback).toHaveBeenCalledTimes(1);
        });
    });
});
