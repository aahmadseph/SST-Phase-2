/* eslint-disable object-curly-newline */

import { Fragment, createRef } from 'react';
import { Grid, Text } from 'components/ui';
import AddressUtils from 'utils/Address';
import BaseClass from 'components/BaseClass';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorsUtils from 'utils/Errors';
import FormValidator from 'utils/FormValidator';
import LanguageLocale from 'utils/LanguageLocale';
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'components/Inputs/Select/Select';
import TextInput from 'components/Inputs/TextInput/TextInput';
import { wrapComponent } from 'utils/framework';

const { FIELD_LENGTHS, isValidZipCode } = FormValidator;
const {
    ERROR_CODES: { CITY_LONG, CITY, STATE, ZIP_CODE_NON_US, ZIP_CODE_US }
} = ErrorConstants;

class PostalCodeInput extends BaseClass {
    postalCodeRef = createRef();
    cityRef = createRef();
    stateRef = createRef();

    render() {
        const {
            country,
            getText,
            isUS,
            states,
            value: { city, postalCode, state }
        } = this.props;

        const postalCodeElement = (
            <TextInput
                key='postalCode'
                autoComplete='postal-code'
                autoCorrect='off'
                label={isUS ? getText('zipPostalCode') : getText('postalCode')}
                maxLength={isUS ? FIELD_LENGTHS.zipCode : FIELD_LENGTHS.postalCode}
                name='postalCode'
                onChange={this.onChange}
                onKeyDown={isUS ? FormValidator.inputAcceptOnlyNumbers : null}
                ref={this.postalCodeRef}
                required
                type={isUS ? 'tel' : 'text'}
                value={postalCode}
                validate={postalCodeString => {
                    if (FormValidator.isEmpty(postalCodeString)) {
                        return ErrorsUtils.getMessage(isUS ? ZIP_CODE_US : ZIP_CODE_NON_US);
                    }

                    return null;
                }}
            />
        );

        const showZipCodeInstructions = !isValidZipCode(postalCode, country);

        return (
            <Fragment>
                <Grid
                    gap={showZipCodeInstructions ? 4 : 0}
                    columns={`1fr ${showZipCodeInstructions ? '1fr' : 'auto'}`}
                >
                    {postalCodeElement}
                    {showZipCodeInstructions && <Text display='block'>{getText('enterZipCode')}</Text>}
                </Grid>
                {showZipCodeInstructions || (
                    <Fragment>
                        <TextInput
                            autoComplete='address-level2'
                            autoCorrect='off'
                            label={getText('city')}
                            maxLength={FIELD_LENGTHS.city}
                            name='city'
                            onChange={this.onChange}
                            ref={this.cityRef}
                            required
                            value={city || ''}
                            validate={cityString => {
                                if (FormValidator.isEmpty(cityString)) {
                                    return ErrorsUtils.getMessage(CITY);
                                }

                                if (!FormValidator.isValidLength(cityString, 1, FIELD_LENGTHS.city)) {
                                    return ErrorsUtils.getMessage(CITY_LONG);
                                }

                                return null;
                            }}
                        />
                        <Select
                            autoComplete='address-level1'
                            label={getText('stateRegion')}
                            name='state'
                            onChange={this.onChange}
                            ref={this.stateRef}
                            required
                            value={state}
                            validate={() => {
                                if (!LanguageLocale.isCountryInternational(country) && !state) {
                                    return ErrorsUtils.getMessage(STATE);
                                }

                                return null;
                            }}
                        >
                            {(states || []).map(({ name, description }, index) => {
                                if (index === 0) {
                                    return null;
                                }

                                return (
                                    <option
                                        key={name}
                                        value={name}
                                    >
                                        {description}
                                    </option>
                                );
                            })}
                        </Select>
                    </Fragment>
                )}
            </Fragment>
        );
    }

    onChange = ({ target: { name, value } }) => {
        const { getCityAndState, onChange, isUS, country } = this.props;
        const { COUNTRIES } = LanguageLocale;
        const isCA = country === COUNTRIES.CA;
        let postalCode = value;
        let extra;

        if (name === 'postalCode') {
            if (isUS) {
                postalCode = AddressUtils.formatZipPostalCode(value, '-', 5, 9);
            } else if (isCA) {
                postalCode = AddressUtils.formatZipPostalCode(value.toUpperCase(), ' ', 3, 6);
            }

            if (isValidZipCode(postalCode, country)) {
                getCityAndState(postalCode).then(({ city, state }) => {
                    onChange({
                        target: {
                            name: 'postalCode',
                            value: {
                                postalCode,
                                city,
                                state
                            }
                        }
                    });
                });
            } else {
                extra = {
                    city: '',
                    state: ''
                };
            }
        }

        onChange({
            target: {
                name: 'postalCode',
                value: {
                    ...this.props.value,
                    [name]: postalCode,
                    ...extra
                }
            }
        });
    };

    validate = () => {
        const errors = FormValidator.getErrors([this.cityRef.current, this.postalCodeRef.current, this.stateRef.current]);

        return errors;
    };
}

PostalCodeInput.defaultProps = { country: '' };
PostalCodeInput.propTypes = {
    country: PropTypes.string,
    getCityAndState: PropTypes.func.isRequired,
    getText: PropTypes.func.isRequired,
    isUS: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    states: PropTypes.array,
    value: PropTypes.shape({
        city: PropTypes.string,
        postalCode: PropTypes.string.isRequired,
        state: PropTypes.string
    }).isRequired
};

export default wrapComponent(PostalCodeInput, 'PostalCodeInput');
