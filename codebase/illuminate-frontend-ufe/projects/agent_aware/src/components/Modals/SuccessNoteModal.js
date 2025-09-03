import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'components/Modal';
import Button from 'components/Button';
import { useAgentAwareContext } from 'hooks';

const SuccessNoteModal = () => {
    const { showModal, dispatch, state, resetNoteInfo } = useAgentAwareContext();
    const noteInfo = state.note;

    const successMessages = {
        order: 'The client\'s order note has been saved and can be viewed under their account in C3.',
        profile: 'The client\'s profile note has been saved and can be viewed under their account in C3.'
    };

    const onCloseModal = () => {
        showModal('');
        dispatch(resetNoteInfo());
    };

    return (
        <Modal
            onDismiss={onCloseModal}
            title='Your Note has been Saved!'
            onClose={onCloseModal}
        >
            <ModalBody>
                <p>{successMessages[noteInfo.type]}</p>
            </ModalBody>
            <ModalFooter>
                <Button onClick={onCloseModal}>OK</Button>
            </ModalFooter>
        </Modal>
    );
};

export default SuccessNoteModal;
