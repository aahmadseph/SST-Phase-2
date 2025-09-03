import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex, Text, Button } from 'components/ui';
import Modal from 'components/Modal/Modal';
import typography from 'style/typography';
import LanguageLocale from 'utils/LanguageLocale';

const getText = LanguageLocale.getLocaleResourceFile(
    'components/Content/Happening/StoreDetails/MakeMyStoreConfirmationModal/locales',
    'MakeMyStoreConfirmationModal'
);

const MakeMyStoreConfirmationModal = ({ isOpen, storeName, onSubmit, onDismiss }) => (
    <Modal
        isOpen={isOpen}
        isDrawer
        onDismiss={onDismiss}
        width={0}
    >
        <Modal.Header>
            <Modal.Title>{getText('changeStore')}</Modal.Title>
        </Modal.Header>
        <Modal.Body css={typography}>
            <Text dangerouslySetInnerHTML={{ __html: getText('body', [storeName]) }} />
        </Modal.Body>
        <Modal.Footer>
            <Flex
                justifyContent='space-evenly'
                alignItems='center'
            >
                <Button
                    variant='secondary'
                    height={0}
                    width='160px'
                    children={getText('cancel')}
                    onClick={onDismiss}
                />
                <Button
                    variant='primary'
                    height={0}
                    width='160px'
                    children={getText('ok')}
                    onClick={onSubmit}
                />
            </Flex>
        </Modal.Footer>
    </Modal>
);

export default wrapFunctionalComponent(MakeMyStoreConfirmationModal, 'MakeMyStoreConfirmationModal');
