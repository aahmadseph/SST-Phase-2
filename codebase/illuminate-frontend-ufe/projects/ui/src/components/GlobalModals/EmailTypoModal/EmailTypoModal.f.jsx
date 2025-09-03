import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'components/Modal/Modal';
import { Button, Text } from 'components/ui';

import { wrapFunctionalComponent } from 'utils/framework';

function EmailTypoModal(props) {
    const {
        isOpen, onDismiss, onCancel, onContinue, localization
    } = props;

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={onDismiss}
            isDrawer={true}
            width={1}
        >
            <Modal.Header hasBorder={false}>
                <Modal.Title>{localization.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Text
                    is='p'
                    fontSize='md'
                    dangerouslySetInnerHTML={{
                        __html: localization.message
                    }}
                />
            </Modal.Body>
            <Modal.Footer
                hasBorder={false}
                display={'flex'}
                justifyContent='center'
                gap={4}
            >
                <Button
                    variant='primary'
                    width={['100%', null, 164]}
                    children={localization.cancel}
                    onClick={onCancel}
                />
                <Button
                    variant='secondary'
                    width={['100%', null, 164]}
                    children={localization.ok}
                    onClick={onContinue}
                />
            </Modal.Footer>
        </Modal>
    );
}

EmailTypoModal.propTypes = {
    localization: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
    onDismiss: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onContinue: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(EmailTypoModal, 'EmailTypoModal');
