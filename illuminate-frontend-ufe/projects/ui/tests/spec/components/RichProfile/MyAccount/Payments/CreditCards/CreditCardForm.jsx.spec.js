describe('Credit Card Form JSX', () => {
    let React;
    let CreditCardForm;
    let shallowComponent;
    let props;

    beforeEach(() => {
        React = require('react');
        CreditCardForm = require('components/RichProfile/MyAccount/Payments/CreditCards/CreditCardForm/CreditCardForm').default;
        props = { creditCard: { cardType: '' } };
    });
    it('should render Cancel button with appropriate data-at value', () => {
        shallowComponent = enzyme.shallow(<CreditCardForm />);
        expect(shallowComponent.find(`Button[data-at="${Sephora.debug.dataAt('cc_cancel_btn')}"]`).exists()).toEqual(true);
    });
    it('should render Save button with appropriate data-at value if adding new card', () => {
        shallowComponent = enzyme.shallow(<CreditCardForm />);
        expect(shallowComponent.find(`Button[data-at="${Sephora.debug.dataAt('cc_save_btn')}"]`).exists()).toEqual(true);
    });
    it('should render Update button with appropriate data-at value if editing existing card', () => {
        props.isEditMode = true;
        shallowComponent = enzyme.shallow(<CreditCardForm {...props} />);
        expect(shallowComponent.find(`Button[data-at="${Sephora.debug.dataAt('cc_update_btn')}"]`).exists()).toEqual(true);
    });
    it('should render Delete button with appropriate data-at value if editing existing card', () => {
        props.isEditMode = true;
        shallowComponent = enzyme.shallow(<CreditCardForm {...props} />);
        expect(shallowComponent.find(`[data-at="${Sephora.debug.dataAt('cc_delete_btn')}"]`).exists()).toEqual(true);
    });
});
