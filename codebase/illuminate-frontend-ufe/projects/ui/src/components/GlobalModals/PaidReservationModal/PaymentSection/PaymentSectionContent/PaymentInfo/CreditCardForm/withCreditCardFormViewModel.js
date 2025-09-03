import { Component, createRef } from 'react';
import OrderActions from 'actions/OrderActions';
import React from 'react';
import Store from 'Store';

const withCreditCardFormViewModel = WrappedComponent => {
    class CreditCardForm extends Component {
        creditCardFormRef = createRef();

        get creditCardForm() {
            return this.creditCardFormRef.current;
        }

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    ref={this.creditCardFormRef}
                    showCVCHelp={this.showCVCHelp}
                />
            );
        }

        showCVCHelp = event => {
            event.preventDefault();
            const action = OrderActions.showCVCInfoModal(true);
            Store.dispatch(action);
        };

        validate = () => this.creditCardForm.validate();

        getCreditCard = () => this.creditCardForm.getCreditCard();
    }

    CreditCardForm.displayName = `CreditCardForm(${WrappedComponent.displayName})`;

    return CreditCardForm;
};

export default withCreditCardFormViewModel;
