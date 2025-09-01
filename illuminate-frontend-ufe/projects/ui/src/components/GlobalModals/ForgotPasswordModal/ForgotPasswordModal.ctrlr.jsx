import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import store from 'store/Store';
import Actions from 'Actions';
import UserActions from 'actions/UserActions';
import Location from 'utils/Location';
import anaUtils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import ForgotPasswordBindings from 'analytics/bindingMethods/components/globalModals/forgotPasswordModal/ForgotPasswordBindings';
import { Text, Button, Link } from 'components/ui';
import Modal from 'components/Modal/Modal';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import ErrorList from 'components/ErrorList';
import localeUtils from 'utils/LanguageLocale';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';

const POS_ACCOUNT_ERROR = 'ERR_400004';
const { getLocaleResourceFile } = localeUtils;

class ForgotPasswordModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            errorMessages: this.props.messages
        };

        this.loginInput = null;
    }
    requestClose = () => {
        store.dispatch(Actions.showForgotPasswordModal(false));
    };

    isValid = () => {
        const loginError = this.loginInput.validateError();

        //Analytics
        const fieldsToCheck = [loginError];
        const errors = fieldsToCheck.filter(value => !!value);

        if (errors.length) {
            processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    bindingMethods: linkTrackingError,
                    eventStrings: ['event140', 'event141'],
                    fieldErrors: errors,
                    ...anaUtils.getLastAsyncPageLoadData()
                }
            });
        } //End analytics

        return fieldsToCheck.filter(value => !!value).length === 0;
    };

    dispatchShowInfoModal = errorMsg => {
        const getText = getLocaleResourceFile('components/GlobalModals/ForgotPasswordModal/locales', 'ForgotPasswordModal');

        if (errorMsg) {
            store.dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    title: getText('resetPassword'),
                    message: errorMsg,
                    buttonText: getText('confirmButton'),
                    bodyPaddingBottom: 4,
                    isHtml: true
                })
            );
        } else {
            const login = this.loginInput.getValue();
            store.dispatch(Actions.showResetPasswordConfirmationModal({ isOpen: true, email: login }));
        }

        this.requestClose();
    };

    submit = () => {
        const email = this.loginInput.getValue();

        const successCallback = () => {
            this.dispatchShowInfoModal();
            ForgotPasswordBindings.emailSent({ emailId: email });

            anaUtils.setNextPageData({ events: ['event140', 'event100'] });
        };

        const failureCallback = async response => {
            const getText = getLocaleResourceFile('components/GlobalModals/ForgotPasswordModal/locales', 'ForgotPasswordModal');
            const errorMsg = response.errorMessage || (response.errors || [])[0]?.errorMessage || getText('fallbackErrorMsg');
            const errorCode = (response.errors || [])[0]?.errorCode;

            if (errorCode === POS_ACCOUNT_ERROR) {
                store.dispatch(Actions.showCheckYourEmailModal({ isOpen: true, email, isResetPasswordFlow: true }));
            } else {
                this.dispatchShowInfoModal(errorMsg);
            }

            response.errorMessages &&
                processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        bindingMethods: await import('analytics/bindings/pages/all/linkTrackingError'),
                        errorMessages: response.errorMessages,
                        eventStrings: ['event140', 'event141'],
                        ...anaUtils.getLastAsyncPageLoadData()
                    }
                });
        };

        if (this.isValid()) {
            const source = Location.isOrderConfirmationPage() ? 'orderConfirmation' : null;

            store.dispatch(UserActions.forgotPassword(email, successCallback, json => failureCallback(json), source));
        }
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/ForgotPasswordModal/locales', 'ForgotPasswordModal');

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={1}
            >
                <Modal.Header>
                    <Modal.Title>{getText('modalTitle')}</Modal.Title>
                </Modal.Header>
                <Modal.Body lineHeight='tight'>
                    <Text
                        is='p'
                        marginBottom={3}
                    >
                        {getText('resetPasswordMessage')}
                    </Text>

                    <form
                        noValidate
                        onSubmit={e => {
                            e.preventDefault();
                            this.submit();
                        }}
                    >
                        <ErrorList errorMessages={this.state.errorMessages} />

                        <InputEmail
                            label={getText('emailLabel')}
                            id='forgotAnswer_email'
                            login={this.props.presetLogin}
                            ref={c => {
                                if (c !== null) {
                                    this.loginInput = c;
                                }
                            }}
                            hideAsterisk={true}
                        />

                        <Button
                            variant='primary'
                            type='submit'
                            hasMinWidth={true}
                        >
                            {getText('sendEmailButton')}
                        </Button>
                    </form>

                    <Text
                        is='p'
                        color='gray'
                        marginTop={5}
                        fontSize='sm'
                    >
                        <b>{getText('stillHavingTroublesMsg')}</b>
                        <br />
                        {getText('unableResetPasswordMessage')}{' '}
                        <Link
                            color='blue'
                            underline={true}
                            href='tel:1-877-737-4672'
                        >
                            {getText('sephoraPhoneNumber')}
                        </Link>{' '}
                        {getText('phoneNumberTTY')}
                        {' | '}
                        {getText('forAssistanceMessage')}{' '}
                        <Link
                            color='blue'
                            underline={true}
                            href='/beauty/accessibility'
                        >
                            {getText('accessibility')}
                        </Link>
                        .
                    </Text>
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(ForgotPasswordModal, 'ForgotPasswordModal', true);
