import React, { useState } from 'react';
import { Modal, ModalBody, ModalFooter } from 'components/Modal';
import Button from 'components/Button';
import { useAgentAwareContext } from 'hooks';
import { addNote } from 'utils/api';
import { MODAL_NAMES } from 'constants/Modals';

const AddNoteModal = () => {
    const {
        showModal, dispatch, state, addSaveNoteError, addNoteDescription
    } = useAgentAwareContext();
    const noteInfo = state.note;
    const [description, setDescription] = useState(noteInfo.description);

    const disabled = description.length < 1;

    const titles = {
        order: 'Add Order Notes',
        profile: 'Add Account Notes'
    };

    const placeholders = {
        order: 'Provide order details and contact method.',
        profile: 'Provide profile detail notes and contact method.'
    };

    const addNoteAction = async () => {
        try {
            await addNote(noteInfo.type, description);
            showModal(MODAL_NAMES.SUCCESS_NOTE);
        } catch (e) {
            dispatch(addNoteDescription(description));
            dispatch(addSaveNoteError('Message was not saved. Please try again.'));
        }
    };

    const onCloseModal = () => {
        if (description.length >= 1 || noteInfo.saveNoteError) {
            dispatch(addNoteDescription(description));
            showModal(MODAL_NAMES.CLOSE_NOTE_CONFIRMATION);
        } else {
            showModal('');
        }
    };

    const addNotesModalBodyTextAreaStyles = {
        width: '100%',
        height: '137px',
        borderRadius: '4px',
        border: '1px solid #CCCCCC',
        padding: '14px 12px',
        resize: 'none'
    };

    const addNotesModalBodyTextCounterStyles = {
        textAlign: 'right',
        color: '#666666'
    };

    const addNotesModalErrorText = {
        marginTop: '16px',
        color: '#CF112C'
    };

    return (
        <Modal
            onDismiss={onCloseModal}
            title={titles[noteInfo.type]}
            onClose={onCloseModal}
        >
            <ModalBody>
                <textarea
                    style={addNotesModalBodyTextAreaStyles}
                    placeholder={placeholders[noteInfo.type]}
                    value={description}
                    onChange={e => {
                        const value = e.currentTarget.value;
                        setDescription(value);
                    }}
                    maxLength='1000'
                />
                <p style={addNotesModalBodyTextCounterStyles}>{`${description.length}/ 1000 characters`}</p>
                <p style={addNotesModalErrorText}>{noteInfo.saveNoteError}</p>
            </ModalBody>
            <ModalFooter>
                <Button
                    type='secondary'
                    onClick={onCloseModal}
                >
                    Cancel
                </Button>
                <Button
                    type={disabled ? 'disabled' : 'primary'}
                    onClick={() => addNoteAction(noteInfo.type)}
                >
                    Save
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddNoteModal;
