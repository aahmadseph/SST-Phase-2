const React = require('react');
const { shallow } = require('enzyme');

describe('CheckoutCreditCardForm Component', () => {
    let CheckoutCreditCardForm;
    let wrapper;

    beforeEach(() => {
        CheckoutCreditCardForm = require('components/Checkout/Sections/Payment/CheckoutCreditCardForm/CheckoutCreditCardForm').default;
    });

    describe('should have data-at property', () => {
        let propsStub;
        beforeEach(() => {
            propsStub = { shippingAddress: true, creditCard: {} };
            wrapper = shallow(<CheckoutCreditCardForm {...propsStub} />);
        });

        it('should add data-at property for Use my shipping address Radio input element', () => {
            expect(wrapper.find('[data-at="use_my_shipping_address"]').length).toBe(1);
        });

        it('should add data-at property for Use a different address Radio input element', () => {
            expect(wrapper.find('[data-at="use_a_different_address"]').length).toBe(1);
        });
    });

    describe('data-at for address form elements ', () => {
        let propsStub;
        beforeEach(() => {
            propsStub = {
                isEditMode: false,
                isUseShippingAddressAsBilling: true,
                creditCard: {}
            };
            wrapper = shallow(<CheckoutCreditCardForm {...propsStub} />);
        });

        it('should render credit card number element with data-at attribute', () => {
            expect(wrapper.find('TextInput[data-at="card_number_input"]').length).toBe(1);
        });

        it('should render credit card expiry month element with data-at attribute', () => {
            expect(wrapper.find('TextInput[data-at="month_input"]').length).toBe(1);
        });

        it('should render credit card expiry year element with data-at attribute', () => {
            expect(wrapper.find('TextInput[data-at="year_input"]').length).toBe(1);
        });

        it('should render credit card expiry year element with data-at attribute', () => {
            expect(wrapper.find('TextInput[data-at="cvv_input"]').length).toBe(1);
        });

        it('should render first name element with data-at attribute', () => {
            expect(wrapper.find('TextInput[data-at="first_name_input"]').length).toBe(1);
        });

        it('should render last name element with data-at attribute', () => {
            expect(wrapper.find('TextInput[data-at="last_name_input"]').length).toBe(1);
        });
    });
});
