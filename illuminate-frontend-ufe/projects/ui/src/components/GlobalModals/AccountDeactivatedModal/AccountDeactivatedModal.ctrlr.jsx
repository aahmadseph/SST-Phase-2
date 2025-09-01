import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import { Button, Divider } from 'components/ui';

class AccountDeactivatedModal extends BaseClass {
    render() {
        const { isOpen, errorMessage, localization, closeDeactivatedAccountModal } = this.props;

        const { title, confirmText } = localization;

        return (
            <Modal
                isOpen={isOpen}
                width={0}
                isDrawer={true}
                onDismiss={closeDeactivatedAccountModal}
            >
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    lineHeight='tight'
                    paddingBottom={2}
                >
                    <div>{errorMessage}</div>
                </Modal.Body>
                <Divider margin={2} />
                <Modal.Footer
                    marginTop={2}
                    hasBorder={false}
                >
                    <Button
                        variant='primary'
                        onClick={closeDeactivatedAccountModal}
                        block={true}
                        children={confirmText}
                    />
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(AccountDeactivatedModal, 'AccountDeactivatedModal', true);
