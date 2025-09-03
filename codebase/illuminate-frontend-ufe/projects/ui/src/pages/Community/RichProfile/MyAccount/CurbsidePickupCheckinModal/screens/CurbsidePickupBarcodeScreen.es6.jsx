/* eslint-disable class-methods-use-this */
import React from 'react';
import framework from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import {
    Button, Image, Text, Link
} from 'components/ui';
import Barcode from 'components/Barcode/Barcode';
import languageLocaleUtils from 'utils/LanguageLocale';

const { wrapComponent } = framework;
const { getLocaleResourceFile } = languageLocaleUtils;
const getText = getLocaleResourceFile('pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/locales', 'CurbsidePickupCheckinModal');

class CurbsidePickupBarcodeScreen extends BaseClass {
    render() {
        const { storeDetails, orderId, hasBodyScroll } = this.props;

        const phone = storeDetails?.address?.phone;
        let phoneLink = '';

        if (phone) {
            phoneLink = `1-${phone.replace(/\s/g, '-').replace(/[\)\(]/g, '')}`;
        }

        return (
            <>
                <Modal.Body hasBodyScroll={hasBodyScroll}>
                    <Image
                        display='block'
                        marginBottom={4}
                        src='/img/ufe/order/curbsideConfirmation.svg'
                        width={120}
                        height={120}
                        alt={getText('landingTitle')}
                    />
                    <Text
                        fontWeight='bold'
                        fontSize='lg'
                        is='h2'
                    >
                        {getText('confirmationTitle')}
                    </Text>
                    <Text
                        is='p'
                        marginTop={4}
                    >
                        {getText('confirmationSubtitle')}
                    </Text>
                    <Text
                        is='p'
                        marginY={4}
                    >
                        {getText('confirmationSubtitleSecondary')}
                    </Text>

                    <Barcode
                        id={`BP-${orderId}`}
                        code={'CODE128'}
                        border={1}
                    />

                    <Text
                        is='p'
                        fontSize='md'
                        lineHeight='none'
                        marginY={2}
                        fontWeight='bold'
                        textAlign='center'
                    >
                        {getText('pickUpOrderNumber')}: {orderId}
                    </Text>

                    {phone && (
                        <Text
                            is='p'
                            marginY={4}
                        >
                            {getText('storeInfoPrefix')}
                            <br />
                            Sephora {this.props.storeDetails?.displayName}{' '}
                            <Link
                                color='blue'
                                underline={true}
                                href={`tel:${phoneLink}`}
                            >
                                {phone}
                            </Link>
                        </Text>
                    )}
                </Modal.Body>
                <Modal.Footer hasBodyScroll={hasBodyScroll}>
                    <Button
                        variant='primary'
                        width='100%'
                        onClick={this.props.dismissModal}
                    >
                        Done
                    </Button>
                </Modal.Footer>
            </>
        );
    }
}

export default wrapComponent(CurbsidePickupBarcodeScreen, 'CurbsidePickupBarcodeScreen');
