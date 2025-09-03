import { Component, createRef } from 'react';
import AddressActions from 'actions/AddressActions';
import ApiUtility from 'services/api/utility';
import HelperUtils from 'utils/Helpers';
import LanguageLocale from 'utils/LanguageLocale';
import React from 'react';

const {
    COUNTRIES: { US }
} = LanguageLocale;

const withPostalCodeInputViewModel = WrappedComponent => {
    class PostalCodeInput extends Component {
        state = { states: [] };
        postalCodeRef = createRef();

        get postalCode() {
            return this.postalCodeRef.current;
        }

        componentDidUpdate(prevProps) {
            const { country } = this.props;

            if (prevProps.country !== country) {
                AddressActions.getStateList(country, states => this.setState({ states }));
            }
        }

        render() {
            const { country } = this.props;

            return (
                <WrappedComponent
                    {...this.props}
                    {...this.state}
                    ref={this.postalCodeRef}
                    getCityAndState={this.getCityAndState}
                    isUS={country === US}
                />
            );
        }

        getCityAndState = zipCode => {
            const { country } = this.props;
            const result = ApiUtility.getStateAndCityForZipCode(country, zipCode)
                // eslint-disable-next-line object-curly-newline
                .then(({ city, state }) => ({
                    city: HelperUtils.titleCase(city),
                    state
                }))
                .catch(() => ({
                    city: '',
                    state: ''
                }));

            return result;
        };

        validate = () => this.postalCode.validate();
    }

    PostalCodeInput.displayName = `PostalCodeInput(${WrappedComponent.displayName})`;

    return PostalCodeInput;
};

export default withPostalCodeInputViewModel;
