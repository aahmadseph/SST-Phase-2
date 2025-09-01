/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Modal from 'components/Modal/Modal';
import { Grid, Text, Image } from 'components/ui';

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
        this.unsubscribe = this.props.toggleCVCInfoModal(this);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    close = () => {
        this.props.showCVCInfoModal(false);
    };

    render() {
        const {
            cvcInfoTitle, visaCardCustomers, yourSecurityCodeMsg, backOfCard, amexCustomers, yourCodeAmexMsg, frontOfAmexCard
        } =
            this.props.locales;

        return (
            <Modal
                isOpen={this.state.isOpen}
                onDismiss={this.close}
            >
                <Modal.Header>
                    <Modal.Title>{cvcInfoTitle}</Modal.Title>
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
                                {visaCardCustomers}:
                            </Text>
                            <Text
                                is='p'
                                fontSize='sm'
                                marginBottom={4}
                            >
                                {yourSecurityCodeMsg}
                            </Text>
                            <Text
                                is='h3'
                                fontSize='xs'
                                fontWeight='bold'
                                marginBottom={1}
                            >
                                {backOfCard}
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
                                {amexCustomers}:
                            </Text>
                            <Text
                                is='p'
                                fontSize='sm'
                                marginBottom={4}
                                dangerouslySetInnerHTML={{
                                    __html: yourCodeAmexMsg
                                }}
                            />
                            <Text
                                is='h3'
                                fontSize='xs'
                                fontWeight='bold'
                                marginBottom={1}
                            >
                                {frontOfAmexCard}
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
