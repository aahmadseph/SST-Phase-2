const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const store = require('Store').default;
const actions = require('actions/Actions').default;
const SignInModal = require('components/GlobalModals/SignInModal/SignInModal').default;

describe('SignInModal component', () => {
    describe('close modal', () => {
        it('should dispatch showSignInModal false', () => {
            // Arrange
            const dispatch = spyOn(store, 'dispatch');
            const showSignInModal = spyOn(actions, 'showSignInModal');

            // Act
            shallow(<SignInModal />)
                .instance()
                .requestClose();

            // Assert
            expect(dispatch).toHaveBeenCalledTimes(1);
            expect(showSignInModal).toHaveBeenCalledWith({ isOpen: false });
        });

        it('should call the errback if provided', () => {
            // Arrange
            const props = { errback: createSpy('errback') };

            // Act
            shallow(<SignInModal {...props} />)
                .instance()
                .requestClose();

            // Assert
            expect(props.errback).toHaveBeenCalledTimes(1);
        });
    });
});
