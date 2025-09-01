import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Modal from 'components/Modal';
import { Button, Text } from 'components/ui';

const MobileConfirmModal = props => {
    return (
        <Modal
            isOpen={props.isOpen}
            onDismiss={props.onContinue || props.redirectToHome}
            isDrawer={true}
            width={0}
        >
            <Modal.Header>
                <Modal.Title>{props.mobileModalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body lineHeight='tight'>
                <Text
                    is='h3'
                    fontWeight='bold'
                    fontSize='md'
                    marginBottom={2}
                    children={props.mobileModalSubtitle}
                />
                <Text
                    is='p'
                    marginBottom={5}
                >
                    {props.sent} <strong>{props.mobilePhone}</strong>
                </Text>
                <Button
                    variant='primary'
                    children={props.buttonContinue}
                    onClick={props.onContinue || props.redirectToHome}
                    hasMinWidth={true}
                />
            </Modal.Body>
        </Modal>
    );
};

export default wrapFunctionalComponent(MobileConfirmModal, 'MobileConfirmModal');
