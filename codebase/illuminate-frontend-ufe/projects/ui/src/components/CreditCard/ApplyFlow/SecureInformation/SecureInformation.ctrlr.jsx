/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { forms } from 'style/config';
import { Box, Text } from 'components/ui';
import BiBirthdayForm from 'components/BiRegisterForm/BiBirthdayForm/BiBirthdayForm';
import TextInput from 'components/Inputs/TextInput/TextInput';
import FormValidator from 'utils/FormValidator';
import ErrorConstants from 'utils/ErrorConstants';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';
import ApplyFlowSection from 'components/CreditCard/ApplyFlow/ApplyFlowSection/ApplyFlowSection';
import ErrorsUtils from 'utils/Errors';
import HelperUtils from 'utils/Helpers';

class SecureInformation extends BaseClass {
    state = {
        annualIncome: ''
    };

    getFormattedAnnualIncome = (rawValue, inputType) => {
        if (!inputType && rawValue.indexOf('0') === 0) {
            // eslint-disable-next-line no-param-reassign
            rawValue = rawValue.replace('0', '');
        }

        if (rawValue && rawValue.length) {
            const annualIncome = [];
            const remainder = rawValue.length % 3;

            if (remainder !== 0) {
                annualIncome.push(rawValue.slice(0, remainder));
            }

            for (let i = remainder; i < rawValue.length; i = i + 3) {
                annualIncome.push(rawValue.slice(i, i + 3));
            }

            return `$${annualIncome.join(',')}`;
        }

        return null;
    };

    formatAnnualIncome = e => {
        const rawValue = e.target.value.replace(HelperUtils.specialCharacterRegex, '');
        this.setState({ annualIncome: this.getFormattedAnnualIncome(rawValue, e.inputType) });
    };

    validateForm = () => {
        const fieldsForValidation = [];

        fieldsForValidation.push(this.birthdayForm, this.socialSecurityInput, this.annualIncomeInput);
        ErrorsUtils.collectClientFieldErrors(fieldsForValidation);

        const isBirthdayValid = this.birthdayForm.validateForm(true);
        const isValidInfo = !ErrorsUtils.validate(fieldsForValidation) && isBirthdayValid;

        const error = isValidInfo ? null : ErrorConstants.ERRORS[ErrorConstants.ERROR_CODES.APPLY_FORM_SECTION].message;

        if (this.state.error !== error) {
            this.setState({ error });
        }

        return isValidInfo;
    };

    getData = () => {
        return {
            birthday: this.birthdayForm.getBirthday(true),
            socialSecurity: this.socialSecurityInput.getValue().replace(HelperUtils.specialCharacterRegex, ''),
            annualIncome: this.annualIncomeInput.getValue().replace(HelperUtils.specialCharacterRegex, '')
        };
    };

    render() {
        const getText = resourceWrapper(
            localeUtils.getLocaleResourceFile('components/CreditCard/ApplyFlow/SecureInformation/locales', 'SecureInformation')
        );

        const { birthday, isAdsRestricted } = this.props;

        const isMobile = Sephora.isMobile();

        const maxIncomeLengthVal = FormValidator.FIELD_LENGTHS.annualIncomeAdsRestricted;

        return (
            <ApplyFlowSection title={getText('secureInfoTitle')}>
                {this.state.error && (
                    <Text
                        is='p'
                        marginBottom={5}
                        role='alert'
                        color='error'
                        children={this.state.error}
                    />
                )}
                <Box maxWidth={isMobile || '60%'}>
                    <Box is='fieldset'>
                        <Text
                            is='legend'
                            fontWeight='bold'
                            marginBottom='.5em'
                        >
                            {getText('dateOfBirth')}
                        </Text>
                        <BiBirthdayForm
                            isRequired={true}
                            biData={birthday}
                            ageLimit={isAdsRestricted ? 18 : false}
                            ref={comp => {
                                if (comp !== null) {
                                    this.birthdayForm = comp;
                                }
                            }}
                        />
                    </Box>
                    <Box marginTop={forms.MARGIN_BOTTOM}>
                        <TextInput
                            autoOff={true}
                            inputMode='numeric'
                            pattern='\d*'
                            label={getText('socialSecurityNumberLabel')}
                            name='socialSecurityNumber'
                            infoText={getText('socialSecurityInfoText')}
                            onKeyDown={!isMobile && FormValidator.inputAcceptOnlyNumbers}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            onChange={e => {
                                FormValidator.replaceDotSeparator(e.target.value, this.socialSecurity);
                            }}
                            required={true}
                            maxLength={4}
                            ref={comp => {
                                if (comp !== null) {
                                    this.socialSecurityInput = comp;
                                }
                            }}
                            validateError={socialSecurity => {
                                if (socialSecurity.length !== 4) {
                                    return ErrorConstants.ERROR_CODES.SOCIAL_SECURITY_INVALID;
                                }

                                if (socialSecurity === '0000') {
                                    return ErrorConstants.ERROR_CODES.SOCIAL_SECURITY_ZEROS;
                                }

                                return null;
                            }}
                        />
                        <TextInput
                            autoOff={true}
                            type='tel'
                            label={getText('annualIncomeLabel')}
                            name='annualIncome'
                            required={true}
                            maxLength={maxIncomeLengthVal}
                            value={this.state.annualIncome}
                            onKeyDown={!isMobile && FormValidator.inputAcceptOnlyNumbers}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            onChange={this.formatAnnualIncome}
                            ref={comp => {
                                if (comp !== null) {
                                    this.annualIncomeInput = comp;
                                }
                            }}
                            validateError={income => {
                                if (FormValidator.isEmpty(income)) {
                                    return ErrorConstants.ERROR_CODES.ANNUAL_INCOME;
                                }

                                if (!FormValidator.isValidLength(income, 1, maxIncomeLengthVal)) {
                                    return ErrorConstants.ERROR_CODES.ANNUAL_INCOME_ADS_LONG;
                                }

                                return null;
                            }}
                        />
                    </Box>
                </Box>
                <Text
                    is='p'
                    marginBottom='1em'
                >
                    {getText('alimonyText')}
                </Text>
                <Text
                    is='p'
                    marginBottom='1em'
                >
                    {getText('marriedText', true)}
                </Text>
            </ApplyFlowSection>
        );
    }
}

export default wrapComponent(SecureInformation, 'SecureInformation');
