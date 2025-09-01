import { Component, createRef } from 'react';
import ApiUtility from 'services/api/utility';
import React from 'react';

const withBillingAddressFormViewModel = WrappedComponent => {
    class BillingAddressForm extends Component {
        state = { countries: [] };
        billingAddressFormRef = createRef();

        get billingAddressForm() {
            return this.billingAddressFormRef.current;
        }

        componentDidMount() {
            ApiUtility.getCountryList().then(countries => this.setState({ countries }));
        }

        render() {
            const { countries = [] } = this.state;

            return (
                <WrappedComponent
                    {...this.props}
                    ref={this.billingAddressFormRef}
                    countries={countries}
                />
            );
        }

        validate = () => this.billingAddressForm.validate();

        getAddress = () => this.billingAddressForm.getAddress();
    }

    BillingAddressForm.displayName = `BillingAddressForm(${WrappedComponent.displayName})`;

    return BillingAddressForm;
};

export default withBillingAddressFormViewModel;
