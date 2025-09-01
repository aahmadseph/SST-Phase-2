import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text } from 'components/ui';
import Modal from 'components/Modal/Modal';
import store from 'store/Store';
import Actions from 'actions/Actions';
import resourceWrapper from 'utils/framework/resourceWrapper';
import localeUtils from 'utils/LanguageLocale';
import BiBarcode from 'components/BiBarcode/BiBarcode';

const { getLocaleResourceFile } = localeUtils;
const getText = resourceWrapper(getLocaleResourceFile('components/GlobalModals/BiCardModal/locales', 'BiCardModal'));

function BiCardModal({ isOpen, profileId, onBackBtnClick }) {
    return (
        <Modal
            isOpen={isOpen}
            isDrawer={true}
            onDismiss={() => store.dispatch(Actions.showBiCardModal({ isOpen: false }))}
        >
            <Modal.Header>
                <Modal.Title>{getText('barcodeTitle')}</Modal.Title>
                <Modal.Back onClick={onBackBtnClick} />
            </Modal.Header>
            <Modal.Body>
                <Text
                    is='p'
                    lineHeight='tight'
                    marginBottom={4}
                    children={getText('barcodeDesc')}
                />
                <BiBarcode profileId={profileId} />
            </Modal.Body>
        </Modal>
    );
}

export default wrapFunctionalComponent(BiCardModal, 'BiCardModal');
