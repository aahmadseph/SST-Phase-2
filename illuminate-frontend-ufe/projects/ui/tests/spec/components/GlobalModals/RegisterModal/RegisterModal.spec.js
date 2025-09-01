const React = require('react');
const { objectContaining } = jasmine;
const { shallow } = require('enzyme');
const store = require('Store').default;
const Actions = require('Actions').default;
const RegisterModal = require('components/GlobalModals/RegisterModal/RegisterModal').default;

describe('RegisterModal component', () => {
    it('close modal should dispatch registerModal false', () => {
        // Arrange
        const dispatch = spyOn(store, 'dispatch');
        const showRegisterModal = spyOn(Actions, 'showRegisterModal');

        // Act
        shallow(<RegisterModal />)
            .instance()
            .requestClose();

        // Assert
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(showRegisterModal).toHaveBeenCalledWith(objectContaining({ isOpen: false }));
    });
});
