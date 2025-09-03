import React from 'react';
import Actions from 'Actions';
import store from 'store/Store';

import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import { Button, Image, Text } from 'components/ui';

import { wrapComponent } from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;

class PasskeysInfoModal extends BaseClass {
    constructor(props) {
        super(props);
    }

    requestClose = () => {
        store.dispatch(Actions.showPasskeysInfoModal({ isOpen: false }));
    };

    render() {
        const getText = getLocaleResourceFile('components/GlobalModals/PasskeysInfoModal/locales', 'PasskeysInfoModal');

        return (
            <Modal
                isDrawer={true}
                isOpen={this.props.isOpen}
                onDismiss={this.requestClose}
                width={0}
            >
                <Modal.Header>
                    <Modal.Title>{getText('howDoPasskeysWork')}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Image
                        display='block'
                        height={96}
                        marginBottom={4}
                        src='/img/ufe/passkey-modal-image.svg'
                        width={96}
                    />

                    <Text
                        is='h2'
                        fontWeight='bold'
                        marginBottom={1}
                    >
                        {getText('whatIsAPasskey')}
                    </Text>

                    <Text
                        is='p'
                        marginBottom={4}
                    >
                        {getText('passkeyDescription')}
                    </Text>

                    <Text
                        is='p'
                        marginBottom={3}
                    >
                        {getText('sephoraNeverReceivesYourData')}
                    </Text>

                    <Text
                        is='h2'
                        fontWeight='bold'
                        marginBottom={1}
                    >
                        {getText('howItWorks')}
                    </Text>

                    <Text
                        is='p'
                        marginBottom={4}
                    >
                        {getText('useFaceFingerprintPinOrDevicePassword')}
                    </Text>

                    <Text
                        is='p'
                        marginBottom={1}
                    >
                        {getText('yourPasskeyIsUnique')}
                    </Text>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        block={true}
                        onClick={this.requestClose}
                        variant='primary'
                    >
                        {getText('gotIt')}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default wrapComponent(PasskeysInfoModal, 'PasskeysInfoModal');
