import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import Modal from 'components/Modal/Modal';
import StoresContent from 'components/Header/StoresContent/StoresContent';

function StoresModal(props) {
    return (
        <Modal
            isFlyout={true}
            isOpen={true}
            onDismiss={props.onDismiss}
        >
            <Modal.Header>
                <Modal.Title children={props.title} />
            </Modal.Header>
            <Modal.Body paddingX={null}>
                <StoresContent
                    items={props.items}
                    onDismiss={props.onDismiss}
                    firstLevel={props.firstLevel}
                    withCallbackNavigation={true}
                />
            </Modal.Body>
        </Modal>
    );
}

export default wrapFunctionalComponent(StoresModal, 'StoresModal');
