/* eslint-disable class-methods-use-this */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'Store';
import Actions from 'Actions';

import { Text } from 'components/ui';
import Modal from 'components/Modal/Modal';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;

class ExtendSessionFailureModal extends BaseClass {
    state = {
        isOpen: false
    };

    requestClose = () => {
        store.dispatch(Actions.showExtendSessionFailureModal(false));
    };

    render() {
        const getText = getLocaleResourceFile('components/GlobalModals/locales', 'modals');

        return (
            <Modal
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={1}
            >
                <Modal.Header>
                    <Modal.Title>{getText('oops')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Text
                        is='p'
                        lineHeight='tight'
                    >
                        {getText('cannotExtendText')}
                    </Text>
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(ExtendSessionFailureModal, 'ExtendSessionFailureModal');
