import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal/Modal';
import { Button, Link, Text } from 'components/ui';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

class ResetPasswordConfirmationModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            emailSentSucess: false,
            emailSentError: false,
            errorMessage: ''
        };
    }

    sendEmail = () => {
        const { email, forgotPassword, emailResentTracking } = this.props;

        const successCallback = () => {
            emailResentTracking({ emailId: email });
            this.setState({ emailSentSucess: true });
        };

        const failureCallback = error => {
            const errors = error.errors || [];
            const errorMessage = errors[0]?.errorMessage;
            this.setState({
                errorMessage,
                emailSentError: true
            });
        };

        forgotPassword(email, successCallback, failureCallback);
    };

    render() {
        const { localization, email, onDismiss, isOpen } = this.props;
        const { emailSentSucess, emailSentError } = this.state;
        const modalTitle = emailSentError ? localization.error : localization.emailSent;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={onDismiss}
                isDrawer={true}
                width={1}
            >
                <Modal.Header>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    lineHeight='tight'
                    paddingBottom='4'
                >
                    {emailSentError ? (
                        <p>{this.state.errorMessage || localization.errorMessage}</p>
                    ) : (
                        <>
                            {localization.confirmationMessage} <strong>{email}</strong>
                            {'. '}
                            {localization.confirmationMessage2}
                            {!emailSentSucess && (
                                <Text
                                    display='block'
                                    marginTop={3}
                                >
                                    {localization.didntGetEmail}{' '}
                                    <Text
                                        is='span'
                                        css={{
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        <Link
                                            color='blue'
                                            display='inline'
                                            underline='true'
                                            onClick={this.sendEmail}
                                        >
                                            {localization.resend}
                                        </Link>
                                        .
                                    </Text>
                                </Text>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='primary'
                        onClick={onDismiss}
                        block={true}
                    >
                        {localization.confirmButton}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

ResetPasswordConfirmationModal.propTypes = {
    localization: PropTypes.object.isRequired,
    onDismiss: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    email: PropTypes.string
};

ResetPasswordConfirmationModal.defaultProps = {
    email: ''
};

export default wrapComponent(ResetPasswordConfirmationModal, 'ResetPasswordConfirmationModal');
