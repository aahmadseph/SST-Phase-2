import React from 'react';
import FrameworkUtils from 'utils/framework';
import resourceWrapper from 'utils/framework/resourceWrapper';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Modal from 'components/Modal/Modal';
import { Button, Link } from 'components/ui';

const { wrapFunctionalComponent } = FrameworkUtils;
const { getLocaleResourceFile } = LanguageLocaleUtils;

const getText = resourceWrapper(getLocaleResourceFile('components/PaymentModal/locale', 'PaymentModal'));

function PaymentModal(props) {
    return (
        <Modal
            width={0}
            isOpen={props.isOpen}
            isDrawer={true}
            onDismiss={props.close}
        >
            <Modal.Header>
                <Modal.Title data-at={Sephora.debug.dataAt('payment_modal_title')}>{getText('paymentModalTitle')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    {getText('paymentModalText')}
                    <Link
                        display='inline'
                        color='blue'
                        underline={true}
                        data-at={Sephora.debug.dataAt('payment_methods_lnk')}
                        href='/beauty/payment-methods'
                    >
                        {getText('paymentMethods')}
                    </Link>
                    {getText('forMoreDetails')}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant='primary'
                    block={true}
                    data-at={Sephora.debug.dataAt('payment_got_it_btn')}
                    onClick={props.close}
                >
                    {getText('gotIt')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default wrapFunctionalComponent(PaymentModal, 'PaymentModal');
