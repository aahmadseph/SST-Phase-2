/* eslint-disable object-curly-newline */
import { Fragment, createRef } from 'react';
import Address2Input from 'components/GlobalModals/PaidReservationModal/PaymentSection/PaymentSectionContent/PaymentInfo/BillingAddressForm/Address2Input';
import BaseClass from 'components/BaseClass';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorsUtils from 'utils/Errors';
import FormValidator from 'utils/FormValidator';
import HelperUtils from 'utils/Helpers';
import LanguageLocale from 'utils/LanguageLocale';
import LocaleUtils from 'utils/LanguageLocale';
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'components/Inputs/Select/Select';
import TextInput from 'components/Inputs/TextInput/TextInput';
import withPostalCodeInputViewModel from 'components/GlobalModals/PaidReservationModal/PaymentSection/PaymentSectionContent/PaymentInfo/BillingAddressForm/withPostalCodeInputViewModel';
import PostalCodeInputComponent from 'components/GlobalModals/PaidReservationModal/PaymentSection/PaymentSectionContent/PaymentInfo/BillingAddressForm/PostalCodeInput';
import { wrapComponent } from 'utils/framework';

const PostalCodeInput = withPostalCodeInputViewModel(PostalCodeInputComponent);

const {
    ERROR_CODES: { ADDRESS1_LONG, ADDRESS1, PHONE_NUMBER_INVALID, PHONE_NUMBER }
} = ErrorConstants;

const { FIELD_LENGTHS } = FormValidator;

const getText = LocaleUtils.getLocaleResourceFile(
    'components/GlobalModals/PaidReservationModal/PaymentSection/PaymentSectionContent/PaymentInfo/BillingAddressForm/locales',
    'BillingAddressForm'
);

class BillingAddressForm extends BaseClass {
    state = { address: { postalCode: '' } };
    phoneRef = createRef();
    address1Ref = createRef();
    postalCodeRef = createRef();

    get postalCode() {
        return this.postalCodeRef.current;
    }

    componentDidMount() {
        const {
            address,
            address: { country }
        } = this.state;
        const { creditCardToEdit } = this.props;

        if (creditCardToEdit) {
            this.setState({ address: creditCardToEdit.address });
        } else if (!country) {
            this.setState({
                address: {
                    ...address,
                    country: LanguageLocale.isUS() ? 'US' : 'CA'
                }
            });
        }
    }

    render() {
        const { countries = [], addressLineTwoColor } = this.props;
        const {
            address: { address1, address2, city, country, isInternational, phone, postalCode, state }
        } = this.state;

        return (
            <Fragment>
                <Select
                    autoComplete='country'
                    label={getText('country')}
                    name='country'
                    onChange={this.onFieldChanged}
                    required
                    value={country}
                >
                    {countries.map?.(({ countryCode, countryLongName }) => (
                        <option
                            key={countryCode}
                            value={countryCode}
                        >
                            {countryLongName}
                        </option>
                    ))}
                </Select>
                <TextInput
                    autoComplete='tel'
                    autoCorrect='off'
                    label={getText('phone')}
                    maxLength={isInternational ? FIELD_LENGTHS.internationalPhone : FIELD_LENGTHS.formattedPhone}
                    name='phone'
                    onChange={this.onFieldChanged}
                    onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                    ref={this.phoneRef}
                    required
                    type='tel'
                    value={this.getFormatedPhoneValue(phone)}
                    validate={phoneString => {
                        if (FormValidator.isEmpty(phoneString)) {
                            return ErrorsUtils.getMessage(PHONE_NUMBER);
                        }

                        if (!isInternational && phoneString.length !== FIELD_LENGTHS.formattedPhone) {
                            return ErrorsUtils.getMessage(PHONE_NUMBER_INVALID);
                        }

                        return null;
                    }}
                />
                <TextInput
                    autoComplete='address-line1'
                    autoCorrect='off'
                    label={getText('streetAddress')}
                    maxLength={FIELD_LENGTHS.address}
                    name='address1'
                    onChange={this.onFieldChanged}
                    ref={this.address1Ref}
                    required
                    value={address1}
                    validate={address1String => {
                        if (FormValidator.isEmpty(address1String)) {
                            return ErrorsUtils.getMessage(ADDRESS1);
                        }

                        if (!FormValidator.isValidLength(address1String, 1, FIELD_LENGTHS.address)) {
                            return ErrorsUtils.getMessage(ADDRESS1_LONG);
                        }

                        return null;
                    }}
                />
                <Address2Input
                    getText={getText}
                    onChange={this.onFieldChanged}
                    value={address2}
                    addressLineTwoColor={addressLineTwoColor}
                />
                <PostalCodeInput
                    country={country}
                    getText={getText}
                    onChange={this.onFieldChanged}
                    ref={this.postalCodeRef}
                    value={{
                        postalCode,
                        state,
                        city
                    }}
                />
            </Fragment>
        );
    }

    getFormatedPhoneValue = value => {
        const {
            address: { isInternational }
        } = this.state;
        let formattedPhone = value;
        let rawValue = '';

        if (value) {
            rawValue = value.replace(HelperUtils.specialCharacterRegex, '');
            formattedPhone = isInternational ? rawValue : FormValidator.getFormattedPhoneNumber(rawValue);
        }

        return formattedPhone || rawValue;
    };

    onFieldChanged = ({ target: { name, value } }) => {
        let newValue;
        let extra;

        switch (name) {
            case 'country': {
                newValue = value;
                extra = {
                    isInternational: LanguageLocale.isCountryInternational(value),
                    state: '',
                    city: '',
                    postalCode: '',
                    phone: '',
                    formattedPhone: ''
                };

                break;
            }
            case 'postalCode': {
                const { postalCode, city, state } = value;
                newValue = postalCode;
                extra = {
                    city,
                    state
                };

                break;
            }
            case 'phone': {
                newValue = value.replace(HelperUtils.specialCharacterRegex, '');

                break;
            }
            default: {
                newValue = value;

                break;
            }
        }

        this.setState({
            address: {
                ...this.state.address,
                [name]: newValue,
                ...extra
            }
        });
    };

    validate = () => {
        const errors = FormValidator.getErrors([this.address1Ref.current, this.phoneRef.current]);
        const postalCodeErrors = this.postalCode.validate();
        // Merge current BillingAddressFormErrors with PostalCodeErrors
        errors.fields = errors.fields.concat(postalCodeErrors.fields);
        errors.messages = errors.messages.concat(postalCodeErrors.messages);

        return errors;
    };

    getAddress = () => {
        const { address } = this.state;

        return address;
    };
}

BillingAddressForm.defaultProps = {};
BillingAddressForm.propTypes = {
    countries: PropTypes.array.isRequired,
    addressLineTwoColor: PropTypes.string
};

export default wrapComponent(BillingAddressForm, 'BillingAddressForm', true);
