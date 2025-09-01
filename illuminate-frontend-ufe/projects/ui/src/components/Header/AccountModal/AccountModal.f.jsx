import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import Modal from 'components/Modal/Modal';
import AccountGreeting from 'components/Header/AccountGreeting';
import AccountMenu from 'components/Header/AccountMenu';

function AccountModal({ onDismiss, ...props }) {
    return (
        <Modal
            isFlyout={true}
            isOpen={true}
            onDismiss={onDismiss}
        >
            <Modal.Header
                isLeftAligned={true}
                paddingX={[4, 4]}
            >
                <AccountGreeting onDismiss={onDismiss} />
            </Modal.Header>
            <Modal.Body
                paddingTop={null}
                paddingX={null}
            >
                <AccountMenu
                    isSmallView={true}
                    onDismiss={onDismiss}
                    isBottomNav={props.isBottomNav}
                />
            </Modal.Body>
        </Modal>
    );
}

export default wrapFunctionalComponent(AccountModal, 'AccountModal');
