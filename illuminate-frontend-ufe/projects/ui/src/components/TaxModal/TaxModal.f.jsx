import React from 'react';
import FrameworkUtils from 'utils/framework';
import resourceWrapper from 'utils/framework/resourceWrapper';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Modal from 'components/Modal/Modal';
import Markdown from 'components/Markdown/Markdown';
import { Button } from 'components/ui';

const { wrapFunctionalComponent } = FrameworkUtils;
const { getLocaleResourceFile } = LanguageLocaleUtils;

const getText = resourceWrapper(getLocaleResourceFile('components/TaxModal/locale', 'TaxModal'));

function TaxModal(props) {
    return (
        <Modal
            width={0}
            isOpen={props.isOpen}
            isDrawer={true}
            onDismiss={props.close}
        >
            <Modal.Header>
                <Modal.Title data-at={Sephora.debug.dataAt('estimated_tax_modal_title')}>{getText('taxModalTitle')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Markdown content={getText('taxModalText')} />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant='primary'
                    width={'100%'}
                    data-at={Sephora.debug.dataAt('estimated_tax_got_it_btn')}
                    onClick={props.close}
                >
                    {getText('gotIt')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default wrapFunctionalComponent(TaxModal, 'TaxModal');
