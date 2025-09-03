import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import {
    Button, Grid, Link, Text
} from 'components/ui';
import PropTypes from 'prop-types';
import React from 'react';
import { wrapComponent } from 'utils/framework';

class CheckYourEmailModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            emailSentSucess: false,
            emailSentError: false,
            tokenValidationError: !!props.token,
            email: props.email
        };
    }

    sendEmail = (isInitialEmailTrigger = false) => {
        return () => {
            const { token, sendVerificationEmail } = this.props;
            const { email } = this.state;

            sendVerificationEmail(email, token)
                .then(() => {
                    // Ignore API response and do not update UI when isInitialEmailTrigger is true
                    if (!isInitialEmailTrigger) {
                        this.setState({ emailSentSucess: true, emailSentError: false, tokenValidationError: false });
                    }
                })
                .catch(() => {
                    // Ignore API errors and do not update UI when isInitialEmailTrigger is true
                    if (!isInitialEmailTrigger) {
                        this.setState({ emailSentError: true, tokenValidationError: false });
                    }
                });
        };
    };

    componentDidMount() {
        const { pageLoadAnalytics, token, isResetPasswordFlow } = this.props;

        if (!token && !isResetPasswordFlow) {
            this.sendEmail(true)();
        }

        pageLoadAnalytics();
    }

    render() {
        const { localization, onDismiss, isOpen, isResetPasswordFlow } = this.props;
        const { emailSentSucess, emailSentError, tokenValidationError, email } = this.state;
        const modalTitle = emailSentSucess ? localization.success : emailSentError || tokenValidationError ? localization.error : localization.title;
        const showSecondaryButton = emailSentError || tokenValidationError;
        const isInitialScreen = !emailSentSucess && !emailSentError && !tokenValidationError;
        const showAcountSetupMessage = isInitialScreen && !isResetPasswordFlow;
        const showResetPasswordMessage = isInitialScreen && isResetPasswordFlow;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={onDismiss}
                isDrawer={true}
                width={0}
            >
                <Modal.Header>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    lineHeight='tight'
                    paddingBottom='4'
                >
                    {emailSentSucess && <p>{localization.emailResent}</p>}
                    {emailSentError && <p>{localization.emailResentError}</p>}
                    {tokenValidationError && <p>{localization.tokenValidationError}</p>}
                    {showAcountSetupMessage && (
                        <>
                            {localization.clickVerificationLink1}{' '}
                            <Text
                                display='inline'
                                fontWeight='bold'
                            >
                                {email}
                            </Text>{' '}
                            {localization.clickVerificationLink2}.
                            <Text
                                display='block'
                                marginTop={3}
                            >
                                {localization.didntGetIt}{' '}
                                <Link
                                    color='blue'
                                    display='inline'
                                    underline='true'
                                    onClick={this.sendEmail(false)}
                                >
                                    {localization.resend}
                                </Link>
                                .
                            </Text>
                        </>
                    )}
                    {showResetPasswordMessage && (
                        <>
                            {localization.completeAccountSetup}
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
                                        onClick={this.sendEmail(false)}
                                    >
                                        {localization.resend}
                                    </Link>
                                    .
                                </Text>
                            </Text>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Grid columns={showSecondaryButton ? 2 : 1}>
                        <Button
                            variant={showSecondaryButton ? 'secondary' : 'primary'}
                            onClick={onDismiss}
                        >
                            {localization.confirmButton}
                        </Button>
                        {showSecondaryButton && (
                            <Button
                                variant={'primary'}
                                onClick={this.sendEmail(false)}
                                css={{ textTransform: 'capitalize' }}
                            >
                                {localization.resend}
                            </Button>
                        )}
                    </Grid>
                </Modal.Footer>
            </Modal>
        );
    }
}

CheckYourEmailModal.propTypes = {
    localization: PropTypes.object.isRequired,
    onDismiss: PropTypes.func.isRequired,
    pageLoadAnalytics: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    email: PropTypes.string,
    token: PropTypes.string,
    isResetPasswordFlow: PropTypes.bool
};

CheckYourEmailModal.defaultProps = {
    email: '',
    token: '',
    isResetPasswordFlow: false
};

export default wrapComponent(CheckYourEmailModal, 'CheckYourEmailModal');
