import React from 'react';
import Actions from 'Actions';
import store from 'store/Store';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import { Button, Divider, Text } from 'components/ui';
import { wrapComponent } from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import TaxFormValidator from 'components/RichProfile/MyAccount/TaxClaim/utils/TaxFormValidator';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const { DOCUMENT_NOT_UPLOADED, UNSUPPORTED_DOCUMENT_TYPE, ORDER_NOT_FOUND, GENERIC_TAX_API_ERROR } = TaxFormValidator.VALIDATION_CONSTANTS;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/TaxClaim/locales', 'TaxClaim');

class TaxclaimErrorModal extends BaseClass {
    constructor(props) {
        super(props);
    }

    determineModalErrorHeader = errorType => {
        // Check if the errorType matches any of the specific constants
        if ([DOCUMENT_NOT_UPLOADED, UNSUPPORTED_DOCUMENT_TYPE, ORDER_NOT_FOUND, GENERIC_TAX_API_ERROR].includes(errorType)) {
            return getText('submissionError'); // Return a consistent message for these errors
        }

        // For any other errorType, you can return a generic or default message
        return getText('genericTaxApiError');
    };

    requestClose = () => {
        store.dispatch(Actions.showTaxclaimErrorModal({ isOpen: false }));
    };

    render() {
        const { errorType, errorTypeLocaleMessage } = this.props;
        const modalHeader = this.determineModalErrorHeader(errorType);

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={0}
            >
                <Modal.Header>
                    <Modal.Title>{modalHeader}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Text
                        is='p'
                        marginBottom={1}
                    >
                        {errorTypeLocaleMessage}
                    </Text>
                    <Divider marginY={3} />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        block={true}
                        onClick={this.requestClose}
                        variant='primary'
                    >
                        {getText('modalButtonTextReview')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(TaxclaimErrorModal, 'TaxclaimErrorModal');
