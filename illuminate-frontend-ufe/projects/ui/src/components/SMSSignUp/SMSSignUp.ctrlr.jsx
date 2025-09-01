import React from 'react';
import PropTypes from 'prop-types';
import { space } from 'style/config';
import HelperUtils from 'utils/Helpers';
import { Button, Box } from 'components/ui';
import BaseClass from 'components/BaseClass';
import FrameworkUtils from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import FormValidator from 'utils/FormValidator';
import MobilePhoneInput from 'components/Inputs/MobilePhoneInput/MobilePhoneInput';

const { wrapComponent } = FrameworkUtils;

class SMSSignUp extends BaseClass {
    mobileInput = React.createRef();

    state = {
        formattedPhone: '',
        mobile: ''
    };

    handleSignUp = e => {
        e.preventDefault();
        const {
            openSmsSigninModal, handleRedirect, isAnonymous, user, pageName, pageType
        } = this.props;

        if (this.isValid()) {
            if (user.isInitialized && !isAnonymous) {
                openSmsSigninModal(this.state.mobile, { pageName, pageType });
            } else {
                handleRedirect(this.state.mobile, pageName);
            }
        }
    };

    formatPhoneNumber = phoneNumber => {
        const inputValue = phoneNumber.replace(HelperUtils.specialCharacterRegex, '');
        const formattedPhone = FormValidator.getFormattedPhoneNumber(inputValue, e.inputType);
        this.setState({
            formattedPhone: formattedPhone,
            mobile: inputValue
        });
    };

    isValid = () => {
        const errors = FormValidator.getErrors([this.mobileInput]);

        return !errors.fields.length;
    };

    render() {
        const { localization } = this.props;
        const {
            continueBtn, mobile, signUp, emptyError, invalidError
        } = localization;
        const isFrench = localeUtils.isFrench();

        const { formattedPhone } = this.state;

        return (
            <Box marginBottom={6}>
                <label
                    htmlFor='SMSSignUpInput'
                    css={styles.label}
                    children={signUp}
                />
                <form
                    css={styles.form}
                    action=''
                    noValidate
                    onSubmit={this.handleSignUp}
                >
                    <div css={styles.inputWrap}>
                        <MobilePhoneInput
                            hideAsterisk={true}
                            name='mobilePhone'
                            required={true}
                            autoCorrect='off'
                            label={mobile}
                            value={formattedPhone}
                            onChange={this.formatPhoneNumber}
                            dataAtError={Sephora.debug.dataAt('error_msg')}
                            marginBottom={null}
                            knockout={true}
                            ref={mobileInput => {
                                if (mobileInput !== null) {
                                    this.mobileInput = mobileInput;
                                }
                            }}
                            validate={value => {
                                if (FormValidator.isEmpty(value)) {
                                    return emptyError;
                                }

                                if (value.length !== FormValidator.FIELD_LENGTHS.formattedPhone) {
                                    return invalidError;
                                }

                                return null;
                            }}
                        />
                    </div>
                    <Button
                        marginLeft={4}
                        variant='inverted'
                        children={continueBtn}
                        type='submit'
                        minWidth={isFrench ? 102 : 96}
                    />
                </form>
            </Box>
        );
    }
}

const styles = {
    label: {
        display: 'block',
        marginBottom: space[3],
        fontWeight: 'var(--font-weight-bold)'
    },
    form: {
        display: 'flex',
        alignItems: 'flex-start'
    },
    inputWrap: {
        flex: 1
    }
};

SMSSignUp.propTypes = {
    handleRedirect: PropTypes.func.isRequired,
    localization: PropTypes.shape({}).isRequired
};

export default wrapComponent(SMSSignUp, 'SMSSignUp', true);
