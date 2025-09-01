import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import Modal from 'components/Modal/Modal';
import CommunityContent from 'components/Header/CommunityContent/CommunityContent';

function CommunityModal(props) {
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
                <CommunityContent
                    items={props.items}
                    firstLevel={'bottom nav'}
                    onDismiss={props.onDismiss}
                />
            </Modal.Body>
        </Modal>
    );
}

export default wrapFunctionalComponent(CommunityModal, 'CommunityModal');
