const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const { showAddressVerificationModal } = require('actions/Actions').default;
const store = require('Store').default;
const AddressVerificationModal = require('components/GlobalModals/AddressVerificationModal/AddressVerificationModal').default;

describe('AddressVerificationModal component', () => {
    let props;
    let component;

    beforeEach(() => {
        props = { cancelCallback: createSpy('cancelCallback') };
        const wrapper = shallow(<AddressVerificationModal {...props} />);
        component = wrapper.instance();
    });

    describe('requestClose', () => {
        it('should call to dispatch', () => {
            // Arrange
            const dispatch = spyOn(store, 'dispatch');
            const action = showAddressVerificationModal({ isOpen: false });

            // Act
            component.requestClose(props.cancelCallback);

            // Assert
            expect(dispatch).toHaveBeenCalledWith(action);
        });

        it('should call to showAddressVerificationModal in the dispatch', () => {
            // Act
            component.requestClose(props.cancelCallback);

            // Assert
            expect(props.cancelCallback).toHaveBeenCalled();
        });
    });
});
