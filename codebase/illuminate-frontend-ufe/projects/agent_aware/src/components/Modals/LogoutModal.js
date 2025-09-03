import React from 'react';
import { Modal, ModalBody, ModalFooter } from 'components/Modal';
import { useUserData, useAgentAwareContext } from 'hooks';
import Button from 'components/Button';
import { logout } from 'utils/api';

const LogoutModal = () => {
    const { showModal } = useAgentAwareContext();
    const { data } = useUserData();
    const onClose = () => showModal('');
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
            onDismiss={onClose}
            title='Are you sure you want to exit?'
            onClose={onClose}
        >
            <ModalBody>
                <p>{`Exiting client view will end your session as client ${data.profile.firstName} ${data.profile.lastName} (${data.profile.login}).`}</p>
            </ModalBody>
            <ModalFooter>
                <Button
                    type='secondary'
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button onClick={logoutAction}>Yes</Button>
            </ModalFooter>
        </Modal>
    );
};

export default LogoutModal;
