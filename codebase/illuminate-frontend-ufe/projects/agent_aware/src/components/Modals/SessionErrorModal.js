import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'components/Modal';
import Button from 'components/Button';
import { useAgentAwareContext, useUserData } from 'hooks';
import { logout } from 'utils/api';

const SessionErrorModal = () => {
    const { showModal } = useAgentAwareContext();
    const { data } = useUserData();
    const logoutAction = () => {
        logout(data.profile.login).then(() => {
            localStorage.clear();
            showModal('');
            // eslint-disable-next-line no-undef
            chrome.runtime.sendMessage({ message: 'CloseTab' });
        });
    };

    return (
        <Modal
            onDismiss={logoutAction}
            title='System Error'
            onClose={logoutAction}
        >
            <ModalBody>
                <p>A technical error has occurred. Please sign in again.</p>
            </ModalBody>
            <ModalFooter>
                <Button onClick={logoutAction}>OK</Button>
            </ModalFooter>
        </Modal>
    );
};

export default SessionErrorModal;
