import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import storeUtils from 'utils/Store';
import BaseClass from 'components/BaseClass';
import Modal from 'components/Modal/Modal';
import {
    Button, Image, Text, Link, Box
} from 'components/ui';
import StoreHours from 'components/Stores/StoreDetails/StoreHours';
import SpecialHours from 'components/Stores/StoreDetails/SpecialHours';
import languageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = languageLocaleUtils;
const getText = getLocaleResourceFile('pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/locales', 'CurbsidePickupCheckinModal');

class CurbsidePickupStoreClosedScreen extends BaseClass {
    render() {
        const { storeHours, curbsideHours } = this.props.storeDetails;
        const storeHoursDisplay = storeUtils.getStoreHoursDisplayArray(storeHours);
        const curbsideHoursDisplay = curbsideHours && storeUtils.getStoreHoursDisplayArray(curbsideHours);
        const specialCurbsideHours = curbsideHours && storeUtils.getSpecialHours(curbsideHours?.specialHours || []);
        const specialStoreHours = curbsideHours && storeUtils.getSpecialHours(storeHours?.specialHours || []);

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
                        lineHeight='tight'
                    >
                        {getText('unavailableLandingTitle')}
                    </Text>
                    {curbsideHoursDisplay?.length > 0 && (
                        <>
                            <Text
                                fontWeight='bold'
                                is='p'
                                marginTop={4}
                            >
                                {getText('curbsideHours')}
                            </Text>
                            <Box marginBottom={4}>
                                <StoreHours
                                    hasBoldedDay={false}
                                    displayTodayClosingTime={false}
                                    storeHoursDisplay={curbsideHoursDisplay}
                                />
                            </Box>
                            {specialCurbsideHours?.length > 0 && (
                                <Box marginBottom={4}>
                                    <SpecialHours
                                        hasBoldedDay={false}
                                        displayTodayClosingTime={false}
                                        storeHoursDisplay={specialCurbsideHours}
                                    />
                                </Box>
                            )}
                        </>
                    )}
                    <Text
                        fontWeight='bold'
                        is='p'
                        marginTop={4}
                    >
                        {getText('storeHours')}
                    </Text>
                    <Box marginBottom={4}>
                        <StoreHours
                            hasBoldedDay={false}
                            displayTodayClosingTime={false}
                            storeHoursDisplay={storeHoursDisplay}
                        />
                    </Box>
                    {specialStoreHours && specialStoreHours.length > 0 && (
                        <Box marginBottom={4}>
                            <SpecialHours
                                hasBoldedDay={false}
                                displayTodayClosingTime={false}
                                storeHoursDisplay={specialStoreHours}
                            />
                        </Box>
                    )}
                    {phone && (
                        <Text
                            is='p'
                            marginY={4}
                        >
                            {getText('storeInfoPrefix')}
                            <br />
                            Sephora {this.props.storeDetails?.displayName} {getText('duringStoreHours')}{' '}
                            <Link
                                color='blue'
                                underline={true}
                                href={`tel:${phoneLink}`}
                            >
                                {phone}
                            </Link>
                        </Text>
                    )}
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

export default wrapComponent(CurbsidePickupStoreClosedScreen, 'CurbsidePickupStoreClosedScreen');
