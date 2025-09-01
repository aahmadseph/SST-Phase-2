import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal/Modal';
import {
    Box, Button, Image, Divider, Text
} from 'components/ui';
import Markdown from 'components/Markdown/Markdown';
import InputEmail from 'components/Inputs/InputEmail/InputEmail';
import ErrorsUtils from 'utils/Errors';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

class EmailLookupModal extends BaseClass {
    validateForm = () => {
        ErrorsUtils.clearErrors();
        const fieldsForValidation = [this.emailInput];
        ErrorsUtils.collectClientFieldErrors(fieldsForValidation);

        return !ErrorsUtils.validate(fieldsForValidation);
    };

    onSubmit = event => {
        event.preventDefault();
        const isValid = this.validateForm();
        const { checkUser } = this.props;

        if (isValid) {
            const email = this.emailInput.getValue();
            const showInputLevelErrorCb = this.emailInput.showError;
            checkUser(email, showInputLevelErrorCb);
        }
    };

    componentDidMount() {
        const { pageLoadAnalytics, originalArgumentsObj: { analyticsData = {} } = {} } = this.props;
        pageLoadAnalytics(analyticsData);
    }

    render() {
        const {
            isOpen, onDismiss, showSignInModal, localization, originalArgumentsObj
        } = this.props;

        const isBookingFlow = originalArgumentsObj?.extraParams?.isBookingFlow ?? false;

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={onDismiss}
                width={1}
            >
                <Modal.Body>
                    <Box
                        lineHeight='tight'
                        is='form'
                        onSubmit={this.onSubmit}
                        noValidate
                    >
                        <Text
                            is='h2'
                            fontWeight='bold'
                            fontSize='md'
                            marginTop={2}
                            children={localization.title}
                        />
                        <Image
                            alt='Beauty Insider'
                            disableLazyLoad={true}
                            display='block'
                            src='/img/ufe/bi/logo-beauty-insider.svg'
                            width={194}
                            height={32}
                            marginBottom={4}
                            marginTop={5}
                        />
                        <Markdown
                            marginBottom={4}
                            content={isBookingFlow ? localization.joinBookingBiProgram : localization.joinBiProgram}
                        />
                        <InputEmail
                            marginBottom={4}
                            required={true}
                            name='email'
                            label={localization.email}
                            login={originalArgumentsObj.userEmail}
                            ref={comp => (this.emailInput = comp)}
                            hideAsterisk={true}
                        />
                        <Button
                            variant='primary'
                            width='100%'
                            type='submit'
                        >
                            {localization.confirmButton}
                        </Button>
                        <Divider marginY={4} />
                        <b>{localization.alreadyHaveAccount}</b>
                        <Button
                            width='172'
                            display='block'
                            variant='secondary'
                            marginTop={3}
                            onClick={showSignInModal}
                        >
                            {localization.signIn}
                        </Button>
                    </Box>
                </Modal.Body>
            </Modal>
        );
    }
}

EmailLookupModal.propTypes = {
    localization: PropTypes.object.isRequired,
    onDismiss: PropTypes.func.isRequired,
    showSignInModal: PropTypes.func.isRequired,
    checkUser: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    originalArgumentsObj: PropTypes.object,
    pageLoadAnalytics: PropTypes.func.isRequired
};

EmailLookupModal.defaultProps = {
    originalArgumentsObj: {}
};

export default wrapComponent(EmailLookupModal, 'EmailLookupModal', true);
