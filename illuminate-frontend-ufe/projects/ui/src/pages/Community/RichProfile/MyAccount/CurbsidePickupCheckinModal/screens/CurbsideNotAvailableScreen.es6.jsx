import React from 'react';

import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import { Button, Image, Text } from 'components/ui';
import languageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = languageLocaleUtils;
const getText = getLocaleResourceFile('pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/locales', 'CurbsidePickupCheckinModal');

class CurbsideNotAvailableScreen extends BaseClass {
    render() {
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
                        alt={getText('curbsideNotAvailableLandingTitle')}
                    />
                    <Text
                        fontWeight='bold'
                        fontSize='lg'
                        is='h2'
                        lineHeight='tight'
                    >
                        {getText('curbsideNotAvailableLandingTitle')}
                    </Text>
                    <Text
                        is='p'
                        marginTop={4}
                    >
                        {getText('curbsideNotAvailableSubtitle')}
                    </Text>
                    <Text
                        is='p'
                        marginTop={4}
                        marginBottom={6}
                    >
                        {getText('curbsideNotAvailableSubtitleSecondary')}
                    </Text>

                    <Button
                        variant='primary'
                        width='50%'
                        onClick={this.props.dismissModal}
                    >
                        {getText('gotIt')}
                    </Button>
                </Modal.Body>
            </>
        );
    }
}

export default wrapComponent(CurbsideNotAvailableScreen, 'CurbsideNotAvailableScreen');
