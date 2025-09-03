/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import FormValidator from 'utils/FormValidator';
import HelperUtils from 'utils/Helpers';
import MobilePhoneInput from 'components/Inputs/MobilePhoneInput/MobilePhoneInput';
import Modal from 'components/Modal';
import { Button, Text, Link } from 'components/ui';
import ErrorList from 'components/ErrorList';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import anaConsts from 'analytics/constants';
import userUtils from 'utils/User';

const { isCanada } = LanguageLocaleUtils;
const getErrorsText = LanguageLocaleUtils.getLocaleResourceFile('utils/locales', 'Errors');

const {
    SMS: { BRAND_LAUNCH_PAGENAME }
} = anaConsts;

const MAX_VISIBLE_PHONE_DIGITS = 3;
class SMSSignInModal extends BaseClass {
    state = {
        formattedPhone: '',
        isSignupTextNotifChecked: false,
        mobile: '',
        errorMessagesSms: [],
        displayErrorSms: false
    };

    mobileInput = React.createRef();

    handleClick = () => {
        const maskedPhoneNumber = this.getHiddenPhoneNumber();
        const { pageName, pageType } = this.props.extraParams;

        this.props.onSMSSignup(this.state.mobile, pageName, maskedPhoneNumber, this.smsSignUpErrorCallback, pageType || BRAND_LAUNCH_PAGENAME);
    };

    getHiddenPhoneNumber = () => {
        const { mobile } = this.state;

        if (!mobile || mobile.length < MAX_VISIBLE_PHONE_DIGITS) {
            return '••• ••• ••••';
        }

        return `••• ••• •${mobile.substr(mobile.length - MAX_VISIBLE_PHONE_DIGITS)}`;
    };

    validatePhone = mobile => {
        const { invalidNumberErrorMessage } = this.props;
        const isValidLength = this.state.formattedPhone?.length === FormValidator.FIELD_LENGTHS.formattedPhone;
        this.setState({
            displayErrorSms: false,
            errorMessagesSms: []
        });

        if (FormValidator.isEmpty(mobile) || !isValidLength) {
            return invalidNumberErrorMessage;
        }

        return null;
    };

    formatPhoneNumber = phoneNumber => {
        const inputValue = phoneNumber.replace(HelperUtils.specialCharacterRegex, '');
        const formattedPhone = FormValidator.getFormattedPhoneNumber(inputValue, e.inputType);
        this.setState({
            formattedPhone: formattedPhone,
            mobile: inputValue
        });
    };

    smsSignUpErrorCallback = err => {
        const { genericErrorMessage } = this.props;
        let errorMessages = '';

        if (userUtils.isPhoneRejectedError(err)) {
            errorMessages = [getErrorsText('phoneNumberRejected')];
        } else {
            errorMessages = err.errorMessages?.length ? err.errorMessages : [genericErrorMessage];
        }

        this.setState({
            displayErrorSms: true,
            errorMessagesSms: errorMessages
        });
    };

    render() {
        const {
            isOpen,
            smsSignInModalTitle,
            greetingText,
            ModalTextHeading,
            ModalTextInputHeading,
            TermsAndConditon,
            TermsAndConditonCA,
            TermsAndConditon2,
            TermsAndConditon3,
            TermsAndConditon4,
            TermsAndConditon5,
            notice,
            textTerms,
            privacyPolicy,
            enterMobileNumber,
            signUpNow,
            onDismissModal,
            phoneNumber
        } = this.props;

        const { formattedPhone, errorMessagesSms, displayErrorSms } = this.state;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={onDismissModal}
                width={0}
                isDrawer={true}
            >
                <Modal.Header>
                    <Modal.Title>{smsSignInModalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body lineHeight='tight'>
                    <>
                        <Text
                            is='h4'
                            fontWeight='bold'
                        >
                            {greetingText}
                        </Text>
                        <Text
                            is='h2'
                            fontWeight='bold'
                            fontSize='lg'
                            marginBottom={2}
                            children={ModalTextHeading}
                        />
                        <Text is='p'>
                            <Text
                                is='span'
                                role='text'
                            >
                                <Text
                                    is='span'
                                    display='block'
                                    marginBottom={4}
                                    children={ModalTextInputHeading}
                                />
                            </Text>
                        </Text>

                        <Text is='p'>
                            <Text
                                is='span'
                                role='text'
                            >
                                <Text
                                    is='span'
                                    display='block'
                                    fontSize='sm'
                                    marginBottom={4}
                                >
                                    {isCanada() ? TermsAndConditonCA : TermsAndConditon}
                                    <Link
                                        color='blue'
                                        fontWeight='bold'
                                        target='_blank'
                                        href={'/beauty/sms-terms-and-conditions'}
                                        children={textTerms}
                                        display='inline'
                                    />
                                    {TermsAndConditon2}
                                    <Link
                                        color='blue'
                                        fontWeight='bold'
                                        target='_blank'
                                        href={'/beauty/privacy-policy'}
                                        children={privacyPolicy}
                                        display='inline'
                                    />

                                    {isCanada() ? '.' : ''}

                                    {isCanada() ? '' : TermsAndConditon3}

                                    {isCanada() ? (
                                        ''
                                    ) : (
                                        <Link
                                            color='blue'
                                            fontWeight='bold'
                                            target='_blank'
                                            href={'/beauty/privacy-policy#notice-incentive'}
                                            children={notice}
                                            display='inline'
                                        />
                                    )}

                                    {`${TermsAndConditon4}${isCanada() ? TermsAndConditon5 : ''}`}
                                </Text>
                            </Text>
                        </Text>

                        <MobilePhoneInput
                            ref={this.mobileInput}
                            name='mobilePhone'
                            required={true}
                            value={formattedPhone}
                            initialValue={phoneNumber}
                            autoCorrect='off'
                            label={enterMobileNumber}
                            maxLength={FormValidator.FIELD_LENGTHS.formattedPhone}
                            onChange={this.formatPhoneNumber}
                            validate={this.validatePhone}
                            dataAtError={Sephora.debug.dataAt('error_msg')}
                            invalid={errorMessagesSms.length > 0}
                        />
                        {displayErrorSms && <ErrorList errorMessages={errorMessagesSms} />}
                        <Button
                            variant='primary'
                            onClick={this.handleClick}
                            block={true}
                            children={signUpNow}
                        />
                    </>
                </Modal.Body>
                <Modal.Footer hasBorder={true}></Modal.Footer>
            </Modal>
        );
    }
}
SMSSignInModal.defaultProps = {};

SMSSignInModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    smsSignInModalTitle: PropTypes.string.isRequired,
    greetingText: PropTypes.string.isRequired,
    ModalTextHeading: PropTypes.string.isRequired,
    ModalTextInputHeading: PropTypes.string.isRequired,
    TermsAndConditon: PropTypes.string.isRequired,
    TermsAndConditonCA: PropTypes.string.isRequired,
    TermsAndConditon2: PropTypes.string.isRequired,
    TermsAndConditon3: PropTypes.string.isRequired,
    TermsAndConditon4: PropTypes.string.isRequired,
    TermsAndConditon5: PropTypes.string.isRequired,
    textTerms: PropTypes.string.isRequired,
    privacyPolicy: PropTypes.string.isRequired,
    notice: PropTypes.string.isRequired,
    signUpNow: PropTypes.string.isRequired,
    extraParams: PropTypes.object
};

export default wrapComponent(SMSSignInModal, 'SMSSignInModal', true);
