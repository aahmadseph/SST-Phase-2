const { any } = jasmine;
const { shallow } = require('enzyme');
const React = require('react');
const AddressActions = require('actions/AddressActions').default;
const withPostalCodeInputViewModel =
    require('components/GlobalModals/PaidReservationModal/PaymentSection/PaymentSectionContent/PaymentInfo/BillingAddressForm/withPostalCodeInputViewModel').default;

describe('withPostalCodeInputViewModel', () => {
    const Component = withPostalCodeInputViewModel(React.Component);

    it('should render not null', () => {
        // Act
        const wrapper = shallow(<Component />);
        // Assert
        expect(wrapper.isEmptyRender()).toBeFalsy();
    });

    describe('componentDidUpdate', () => {
        const props = { country: 'CA' };
        const newProps = { country: 'US' };

        it('should retrieve the states when the country changes', () => {
            // Arrange
            const getStateListSpy = spyOn(AddressActions, 'getStateList');
            // Act
            const wrapper = shallow(<Component {...props} />);
            wrapper.setProps(newProps);
            // Assert
            expect(getStateListSpy).toHaveBeenCalledWith('US', any(Function));
        });

        it('should setState with the new country states', () => {
            // Arrange
            const states = ['a', 'b', 'c'];
            const getStateListSpy = spyOn(AddressActions, 'getStateList');
            // Act
            const wrapper = shallow(<Component {...props} />);
            const instance = wrapper.instance();
            const setStateSpy = spyOn(instance, 'setState');
            wrapper.setProps(newProps);
            getStateListSpy.calls.argsFor(0)[1](states);
            // Assert
            expect(setStateSpy).toHaveBeenCalledWith({ states });
        });
    });
});
