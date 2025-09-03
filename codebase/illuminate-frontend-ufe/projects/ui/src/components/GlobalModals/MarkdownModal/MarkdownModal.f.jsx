import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import store from 'Store';
import Actions from 'Actions';

import Modal from 'components/Modal/Modal';
import Markdown from 'components/Markdown/Markdown';

function requestClose() {
    store.dispatch(Actions.showMarkdownModal({ isOpen: false }));
}

function MarkdownModal({ isOpen, title, text }) {
    return (
        <Modal
            isOpen={isOpen}
            onDismiss={requestClose}
            width={2}
        >
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Markdown content={text} />
            </Modal.Body>
        </Modal>
    );
}

export default wrapFunctionalComponent(MarkdownModal, 'MarkdownModal');
