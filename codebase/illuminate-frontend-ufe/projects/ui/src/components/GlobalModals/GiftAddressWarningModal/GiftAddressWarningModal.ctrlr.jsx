import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import { Flex, Button, Text } from 'components/ui';

class GiftAddressWarningModal extends BaseClass {
    handleClick = () => {
        const { closeGiftAddressWarningModal, placeOrderCallback } = this.props;

        closeGiftAddressWarningModal();
        placeOrderCallback();
    };

    render() {
        const { localization, closeGiftAddressWarningModal } = this.props;

        return (
            <Modal
                isOpen
                onDismiss={closeGiftAddressWarningModal}
                isDrawer
                width={0}
            >
                <Modal.Header>
                    <Modal.Title>{localization.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Text
                        is='p'
                        marginBottom={3}
                    >
                        {localization.warningMessage1}
                    </Text>
                    <Text
                        is='p'
                        marginBottom={3}
                    >
                        {localization.warningMessage2}
                        <strong>{` ${localization.both} `}</strong>
                        {localization.warningMessage3}
                    </Text>
                    <Text is='p'>{localization.warningMessage4}</Text>
                </Modal.Body>
                <Modal.Footer>
                    <Flex
                        justifyContent='space-between'
                        gap={2}
                    >
                        <Button
                            variant='secondary'
                            onClick={closeGiftAddressWarningModal}
                            block
                        >
                            {localization.cancelButtonText}
                        </Button>
                        <Button
                            variant='special'
                            onClick={this.handleClick}
                            block
                        >
                            {localization.buttonText}
                        </Button>
                    </Flex>
                </Modal.Footer>
            </Modal>
        );
    }
}

GiftAddressWarningModal.propTypes = {
    closeGiftAddressWarningModal: PropTypes.func.isRequired,
    placeOrderCallback: PropTypes.func.isRequired,
    localization: PropTypes.shape({
        title: PropTypes.string.isRequired,
        buttonText: PropTypes.string.isRequired,
        cancelButtonText: PropTypes.string.isRequired,
        warningMessage1: PropTypes.string.isRequired,
        warningMessage2: PropTypes.string.isRequired,
        both: PropTypes.string.isRequired,
        warningMessage3: PropTypes.string.isRequired,
        warningMessage4: PropTypes.string.isRequired
    }).isRequired
};

export default wrapComponent(GiftAddressWarningModal, 'GiftAddressWarningModal');
