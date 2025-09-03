/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import { Grid, Text, Image } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import OrderActions from 'actions/OrderActions';
import { TOGGLE_CVC_INFO_MODAL } from 'constants/actionTypes/order';

class CVCInfoModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    componentDidMount() {
        //watch for action so we can open or close cvc modal since we can open from
        //payment section and checkout credit card form
        store.watchAction(TOGGLE_CVC_INFO_MODAL, data => {
            this.setState({ isOpen: data.isOpen });
        });
    }

    close = () => {
        store.dispatch(OrderActions.showCVCInfoModal(false));
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/Section/locales', 'PaymentSection');

        return (
            <Modal
                isOpen={this.state.isOpen}
                onDismiss={this.close}
            >
                <Modal.Header>
                    <Modal.Title>{getText('cvcInfoTitle')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Grid
                        gap={[5, 4]}
                        columns={[null, 2]}
                    >
                        <div>
                            <Text
                                is='h2'
                                fontWeight='bold'
                                marginBottom={1}
                            >
                                {getText('visaCardCustomers')}:
                            </Text>
                            <Text
                                is='p'
                                fontSize='sm'
                                marginBottom={4}
                            >
                                {getText('yourSecurityCodeMsg')}
                            </Text>
                            <Text
                                is='h3'
                                fontSize='xs'
                                fontWeight='bold'
                                marginBottom={1}
                            >
                                {getText('backOfCard')}
                            </Text>
                            <Image
                                display='block'
                                src='/img/ufe/payments/img-card-visa.jpg'
                                width={238}
                                height={171}
                            />
                        </div>
                        <div>
                            <Text
                                is='h2'
                                fontWeight='bold'
                                marginBottom={1}
                            >
                                {getText('amexCustomers')}:
                            </Text>
                            <Text
                                is='p'
                                fontSize='sm'
                                marginBottom={4}
                                dangerouslySetInnerHTML={{
                                    __html: getText('yourCodeAmexMsg')
                                }}
                            />
                            <Text
                                is='h3'
                                fontSize='xs'
                                fontWeight='bold'
                                marginBottom={1}
                            >
                                {getText('frontOfAmexCard')}
                            </Text>
                            <Image
                                display='block'
                                src='/img/ufe/payments/img-card-amex.jpg'
                                width={238}
                                height={171}
                            />
                        </div>
                    </Grid>
                </Modal.Body>
            </Modal>
        );
    }
}

export default wrapComponent(CVCInfoModal, 'CVCInfoModal');
