/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import FormValidator from 'utils/FormValidator';
import HelperUtils from 'utils/Helpers';
import StringUtils from 'utils/String';
import MobilePhoneInput from 'components/Inputs/MobilePhoneInput/MobilePhoneInput';
import Modal from 'components/Modal';
import { Button, Text, Link } from 'components/ui';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import ErrorList from 'components/ErrorList';
import { globalModals, renderModal } from 'utils/globalModals';

const { PRIVACY_POLICY } = globalModals;

class SMSSignupModal extends BaseClass {
    state = {
        formattedPhone: '',
        isSignupTextNotifChecked: false,
        mobile: '',
        errorMessagesSms: [],
        displayErrorSms: false,
        displayCheckboxNotCheckedError: false,
        errorCheckboxMessagesSms: [],
        textTerms: true,
        showConfirmationScreen: false
    };

    mobileInput = React.createRef();

    handleClick = () => (this.state.showConfirmationScreen ? this.props.onDismissModal() : this.smsSignUp());

    handleSignupTextNotif = e => {
        const isChecked = e.target.checked;
        this.setState({
            displayCheckboxNotCheckedError: false,
            errorCheckboxMessagesSms: [],
            isSignupTextNotifChecked: isChecked
        });
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

    isValidPhoneOnly = () => {
        const fieldsForValidation = [this.mobileInput.current];
        const errors = FormValidator.getErrors(fieldsForValidation);

        if (errors.fields.length) {
            this.props.fireErrorAnalytics(errors.messages);
        }

        return !errors.fields.length;
    };

    smsSignUpSuccessCallback = () => {
        this.props.fireAnalytics(true);
        this.props.SMSSignupConfirmation();

        this.setState({
            displayErrorSms: false,
            showConfirmationScreen: true
        });
    };

    smsSignUpErrorCallback = err => {
        const { genericErrorMessage, fireErrorAnalytics } = this.props;
        const errorMessages = err.errorMessages?.length ? err.errorMessages : [genericErrorMessage];
        this.setState({
            displayErrorSms: true,
            errorMessagesSms: errorMessages
        });
        fireErrorAnalytics(errorMessages);
    };

    smsSignUp = event => {
        event?.preventDefault();

        const { onSMSSignup, textTermsErrorMessage, fireErrorAnalytics } = this.props;
        const { isSignupTextNotifChecked, mobile } = this.state;

        if (!isSignupTextNotifChecked) {
            this.setState({
                displayCheckboxNotCheckedError: true,
                errorCheckboxMessagesSms: [textTermsErrorMessage]
            });
            fireErrorAnalytics([textTermsErrorMessage]);
        }

        if (!this.isValidPhoneOnly()) {
            this.setState({
                displayErrorSms: true
            });
        } else if (isSignupTextNotifChecked) {
            this.setState({
                displayErrorSms: false,
                displayCheckboxNotCheckedError: false,
                errorMessagesSms: [],
                errorCheckboxMessagesSms: []
            });
            onSMSSignup(mobile, this.smsSignUpSuccessCallback, this.smsSignUpErrorCallback);
        }
    };

    componentDidMount() {
        this.props.fireAnalytics();
        this.props.SMSButtonClick();
    }

    renderPrivacyModal = () => {
        renderModal(this.props.globalModals[PRIVACY_POLICY], () => {
            this.props.showPrivacyPolicy();
        });
    };

    render() {
        const {
            isOpen,
            smsSignupModalTitle,
            greetingText,
            smsSignupModalTextHeading,
            smsSignupModalTextInputHeading,
            smsSignUpModalTerms1,
            smsSignUpModalTerms2,
            textTerms,
            privacyPolicy,
            enterMobileNumber,
            signupTextNotifText,
            signUpNow,
            gotIt,
            smsSignupConfirmationHeading,
            smsSignupConfirmationText,
            showTextOfTerms,
            onDismissModal
        } = this.props;

        const {
            mobile,
            showConfirmationScreen,
            isSignupTextNotifChecked,
            formattedPhone,
            errorMessagesSms,
            errorCheckboxMessagesSms,
            displayErrorSms,
            displayCheckboxNotCheckedError
        } = this.state;
        const last3Digits = mobile.substring(mobile.length - 3);
        const smsConfirmationSuccessText = StringUtils.format(smsSignupConfirmationText, last3Digits);
        const buttonText = showConfirmationScreen ? gotIt : signUpNow;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={onDismissModal}
                width={0}
            >
                <Modal.Header>
                    <Modal.Title>{smsSignupModalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body lineHeight='tight'>
                    {showConfirmationScreen ? (
                        <>
                            <Text
                                is='h2'
                                fontWeight='bold'
                                fontSize='lg'
                                marginBottom={2}
                                children={smsSignupConfirmationHeading}
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
                                        children={smsConfirmationSuccessText}
                                    />
                                </Text>
                            </Text>
                        </>
                    ) : (
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
                                children={smsSignupModalTextHeading}
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
                                        children={smsSignupModalTextInputHeading}
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
                                        {smsSignUpModalTerms1}
                                        <Link
                                            color='blue'
                                            underline={true}
                                            onClick={showTextOfTerms}
                                            children={textTerms}
                                            display='inline'
                                        />
                                        {smsSignUpModalTerms2}
                                        <Link
                                            color='blue'
                                            underline={true}
                                            onClick={this.renderPrivacyModal}
                                            children={privacyPolicy}
                                            display='inline'
                                        />
                                        {'.'}
                                    </Text>
                                </Text>
                            </Text>
                            <MobilePhoneInput
                                ref={this.mobileInput}
                                name='mobilePhone'
                                required={true}
                                value={formattedPhone}
                                autoCorrect='off'
                                label={enterMobileNumber}
                                maxlength={FormValidator.FIELD_LENGTHS.formattedPhone}
                                onChange={this.formatPhoneNumber}
                                validate={this.validatePhone}
                                dataAtError={Sephora.debug.dataAt('error_msg')}
                                invalid={errorMessagesSms.length > 0}
                            />
                            {displayErrorSms && <ErrorList errorMessages={errorMessagesSms} />}
                            <Checkbox
                                fontWeight='bold'
                                checked={isSignupTextNotifChecked}
                                onChange={this.handleSignupTextNotif}
                                name='signup_text_notif'
                            >
                                {' '}
                                {signupTextNotifText}
                            </Checkbox>
                            {displayCheckboxNotCheckedError && <ErrorList errorMessages={errorCheckboxMessagesSms} />}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer hasBorder={true}>
                    <Button
                        variant='primary'
                        onClick={this.handleClick}
                        block={true}
                        children={buttonText}
                    />
                </Modal.Footer>
            </Modal>
        );
    }
}
SMSSignupModal.defaultProps = {};

SMSSignupModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    smsSignupModalTitle: PropTypes.string.isRequired,
    greetingText: PropTypes.string.isRequired,
    smsSignupModalTextHeading: PropTypes.string.isRequired,
    smsSignupModalTextInputHeading: PropTypes.string.isRequired,
    smsSignUpModalTerms1: PropTypes.string.isRequired,
    smsSignUpModalTerms2: PropTypes.string.isRequired,
    textTerms: PropTypes.string.isRequired,
    privacyPolicy: PropTypes.string.isRequired,
    noticeOfFinacialIncentive: PropTypes.string.isRequired,
    signupTextNotifText: PropTypes.string.isRequired,
    signUpNow: PropTypes.string.isRequired,
    invalidNumberErrorMessage: PropTypes.string.isRequired,
    genericErrorMessage: PropTypes.string.isRequired,
    enterMobileNumber: PropTypes.string.isRequired,
    gotIt: PropTypes.string.isRequired,
    smsSignupConfirmationHeading: PropTypes.string.isRequired,
    smsSignupConfirmationText: PropTypes.string.isRequired
};

export default wrapComponent(SMSSignupModal, 'SMSSignupModal', true);
