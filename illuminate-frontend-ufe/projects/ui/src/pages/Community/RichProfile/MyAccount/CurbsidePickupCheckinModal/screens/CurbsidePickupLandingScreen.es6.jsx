import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import {
    Button, Image, Text, Link
} from 'components/ui';
import languageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = languageLocaleUtils;
const getText = getLocaleResourceFile('pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/locales', 'CurbsidePickupCheckinModal');

class CurbsidePickupLandingScreen extends BaseClass {
    render() {
        const phone = this.props.storeDetails?.address?.phone;
        let phoneLink = '';

        if (phone) {
            phoneLink = `1-${phone.replace(/\s/g, '-').replace(/[\)\(]/g, '')}`;
        }

        const { hasBodyScroll } = this.props;

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
                        {getText('landingTitle')}
                    </Text>
                    <Text
                        is='p'
                        marginY={4}
                    >
                        {getText('landingSubtitle')}
                    </Text>
                    <Button
                        variant='primary'
                        width='100%'
                        onClick={this.props.goToNextScreen}
                    >
                        {getText('landingCta')}
                    </Button>
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
            </>
        );
    }
}

export default wrapComponent(CurbsidePickupLandingScreen, 'CurbsidePickupLandingScreen');
