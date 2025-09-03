import React from 'react';

import {
    Box, Divider, Flex, Text
} from 'components/ui';

import HappeningImg from 'components/SharedComponents/HappeningImg';

import { wrapFunctionalComponent } from 'utils/framework';
import { getWaitlistSpotFormattedExpiration } from 'utils/happening';
import resourceWrapper from 'utils/framework/resourceWrapper';
import localeUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = localeUtils;

function BookingInfo({
    expirationDateTime, timeZone, serviceInfo, appointmentDetails, appointmentOptionalFields, isWaitlistSpot
}) {
    const {
        displayName, description, imageUrl, price, duration
    } = serviceInfo;

    const getText = getLocaleResourceFile('components/HappeningNonContent/ServiceBooking/BookingInfo/locales', 'BookingInfo');

    const servicePrice = <strong>{price ? price : getText('free')}</strong>;
    const serviceDuration = duration ? ` / ${duration}` : '';

    const getFormattedText = resourceWrapper(getText);

    const header = getText(isWaitlistSpot ? 'secureWaitlistSpotHeader' : appointmentDetails ? 'reviewAndPay' : 'bookAnAppointment');
    const subtitle = getText(appointmentDetails ? 'confirmAppointmentDetails' : 'yourService');

    return (
        <>
            <Flex
                flexDirection={'column'}
                gap={[4, null, appointmentDetails ? 6 : 5]}
            >
                <Flex
                    flexDirection={'column'}
                    gap={[4, null, 5]}
                >
                    <Text
                        is={'h1'}
                        fontSize={['lg', null, 'xl']}
                        fontWeight={'bold'}
                        lineHeight={['22px', null, '26px']}
                        children={header}
                    />
                    {isWaitlistSpot && (
                        <Text
                            is='p'
                            fontSize={'md'}
                            lineHeight={'20px'}
                            marginTop={[-2, null, -3]}
                            children={getFormattedText(
                                'secureWaitlistSpotBody',
                                false,
                                <Text
                                    fontWeight='bold'
                                    children={getWaitlistSpotFormattedExpiration(expirationDateTime, timeZone)}
                                />
                            )}
                        />
                    )}
                    <Text
                        is={'h3'}
                        fontSize={['md', null, 'lg']}
                        fontWeight={'bold'}
                        lineHeight={['20px', null, '22px']}
                        children={subtitle}
                    />
                    <Flex
                        alignItems={'flex-start'}
                        gap={3}
                    >
                        <HappeningImg
                            width={105}
                            borderRadius={2}
                            alt={displayName}
                            src={imageUrl}
                        />
                        <Box flex={1}>
                            {appointmentDetails && appointmentDetails}
                            {!appointmentDetails && (
                                <>
                                    <Text
                                        is={'h3'}
                                        fontSize={'md'}
                                        fontWeight={'bold'}
                                        lineHeight={'20px'}
                                        marginBottom={1}
                                        children={displayName}
                                    />
                                    <Text
                                        is={'p'}
                                        lineHeight={'18px'}
                                        marginBottom={2}
                                        children={description}
                                    />
                                </>
                            )}
                            <Text
                                is={'h3'}
                                fontSize={[null, null, 'md']}
                                lineHeight={'18px'}
                            >
                                {servicePrice}
                                {serviceDuration}
                            </Text>
                        </Box>
                    </Flex>
                </Flex>
                {appointmentOptionalFields && appointmentOptionalFields}
            </Flex>
            <Divider
                marginY={[5, null, 6]}
                thick={true}
                marginX={[-4, 0]}
                color={'nearWhite'}
            />
        </>
    );
}

BookingInfo.defaultProps = {
    serviceInfo: {},
    onClickEditAppointment: () => {}
};

export default wrapFunctionalComponent(BookingInfo, 'BookingInfo');
