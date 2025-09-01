import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'components/Modal';
import Button from 'components/Button';
import { useAgentAwareContext } from 'hooks';
import { MODAL_NAMES } from 'constants/Modals';

const CloseNoteConfirmationModal = () => {
    const { showModal, dispatch, resetNoteInfo } = useAgentAwareContext();

    const discardNote = () => {
        dispatch(resetNoteInfo());
        showModal('');
    };

    const keepNote = () => {
        showModal(MODAL_NAMES.ADD_NOTE);
    };

    return (
        <Modal
            title='Are You Sure?'
            onClose={keepNote}
        >
            <ModalBody>
                <p>If you leave now, the message will not be saved.</p>
            </ModalBody>
            <ModalFooter>
                <Button onClick={discardNote}>Yes, Don’t Save</Button>
            </ModalFooter>
        </Modal>
    );
};

export default CloseNoteConfirmationModal;
