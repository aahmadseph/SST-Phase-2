/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import urlUtils from 'utils/Url';
import languageLocale from 'utils/LanguageLocale';
import BaseClass from 'components/BaseClass';
import { Button, Box } from 'components/ui';
import MobilePhoneInput from 'components/Inputs/MobilePhoneInput/MobilePhoneInput';
import ErrorMsg from 'components/ErrorMsg';
import SMSConfirmationModal from 'components/LandingPage/PhoneSubscriber/SMSConfirmationModal/SMSConfirmationModal';
import notifications from 'services/api/notifications';
import FormValidator from 'utils/FormValidator';
import userUtils from 'utils/User';

const getText = languageLocale.getLocaleResourceFile('components/LandingPage/PhoneSubscriber/locales', 'PhoneSubscriber');
const getErrorsText = languageLocale.getLocaleResourceFile('utils/locales', 'Errors');

const MAX_VISIBLE_PHONE_DIGITS = 3;

class PhoneSubscriber extends BaseClass {
    state = {
        phoneNumber: '',
        isModalOpen: false,
        showServerErrorMessage: false
    };

    closeModal = () => {
        this.setState({
            isModalOpen: false,
            phoneNumber: ''
        });
        this.mobilePhoneRef.empty();
    };

    continueShopping = () => {
        this.closeModal();
        urlUtils.redirectTo('/');
    };

    getHiddenPhoneNumber = () => {
        const { phoneNumber } = this.state;

        if (!phoneNumber || phoneNumber.length < MAX_VISIBLE_PHONE_DIGITS) {
            return '••• ••• ••••';
        }

        return `••• ••• •${phoneNumber.substr(phoneNumber.length - MAX_VISIBLE_PHONE_DIGITS)}`;
    };

    isValid = () => {
        this.setState({ submitErrors: [] });
        const errors = FormValidator.getErrors([this.mobilePhoneRef]);

        return !errors.fields.length;
    };

    subscribeUser = () => {
        if (this.isValid()) {
            notifications
                .smsSubscribe(this.state.phoneNumber)
                .then(() => this.setState({ isModalOpen: true }))
                .catch(error => {
                    if (userUtils.isPhoneRejectedError(error)) {
                        this.mobilePhoneRef.showError(getErrorsText('phoneNumberRejected'));
                    } else {
                        this.setState({ showServerErrorMessage: true });
                    }
                });
        }
    };

    onChangeHandler = (phoneNumber, cursorPosition) => {
        this.setState({ phoneNumber });

        if (!this.mobilePhoneRef.inputElementRef) {
            return;
        }

        let additionalSpacesAddedByFormatter = 0;

        if (phoneNumber.length === 4) {
            additionalSpacesAddedByFormatter = 3;
        } else if (phoneNumber.length === 7) {
            additionalSpacesAddedByFormatter = 1;
        }

        this.mobilePhoneRef.inputElementRef.selectionEnd = cursorPosition + additionalSpacesAddedByFormatter;
    };

    validatePhone = mobile => {
        if (FormValidator.isEmpty(mobile)) {
            return getText('mobilePhoneEmptyError');
        }

        if (mobile.length && !FormValidator.isValidPhoneNumber(mobile)) {
            return getText('mobilePhoneInvalidError');
        }

        return null;
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.showServerErrorMessage) {
            this.setState({ showServerErrorMessage: false });
        }
    }

    render() {
        return (
            <Box
                marginY={4}
                maxWidth={[null, 343]}
            >
                <MobilePhoneInput
                    ref={e => {
                        this.mobilePhoneRef = e;
                    }}
                    name='mobilePhone'
                    label={getText('inputLabel')}
                    onChange={this.onChangeHandler}
                    maxLength={FormValidator.FIELD_LENGTHS.formattedPhone}
                    validate={this.validatePhone}
                    dataAtError={Sephora.debug.dataAt('error_msg')}
                />

                {this.state.showServerErrorMessage && (
                    <ErrorMsg
                        marginBottom={4}
                        is='div'
                    >
                        {getText('serverErrorMessage')}
                    </ErrorMsg>
                )}

                <Button
                    onClick={this.subscribeUser}
                    children={getText('buttonLabel')}
                    variant='primary'
                    width={['100%', 'auto']}
                    hasMinWidth={true}
                    data-at={Sephora.debug.dataAt('subscribe_btn')}
                />
                <SMSConfirmationModal
                    isOpen={this.state.isModalOpen}
                    phoneNumber={this.getHiddenPhoneNumber()}
                    closeModal={this.closeModal}
                    continueShoppingCallBack={this.continueShopping}
                />
            </Box>
        );
    }
}

export default wrapComponent(PhoneSubscriber, 'PhoneSubscriber');
