import React from 'react';

import {
    Box, Icon, Flex, Text, Button
} from 'components/ui';
import ActionButtons from 'components/Content/Happening/ActionButtons';
import { EVENT_BUTTONS } from 'components/Content/Happening/ActionButtons/constants';
import HappeningImg from 'components/SharedComponents/HappeningImg';

import { borders, colors, shadows } from 'style/config';

import FormValidator from 'utils/FormValidator';
import { wrapFunctionalComponent } from 'utils/framework';
import { formatAppointmentTimeFrame, formatAppointmentDate, ensureSephoraPrefix } from 'utils/happening';
import localeUtils from 'utils/LanguageLocale';
import Location from 'utils/Location';

import HappeningBindings from 'analytics/bindingMethods/components/Content/Happening/HappeningBindings';

const { getLocaleResourceFile } = localeUtils;

function EventConfirmationDetails({ reservationDetails }) {
    if (!reservationDetails) {
        return null;
    }

    const {
        smsPhoneNumber, imageUrl, activityName, confirmationNumber, clientEmail, startDateTime, duration, store = {}
    } = reservationDetails;
    const { displayName, storeId, timeZone } = store;

    const getText = getLocaleResourceFile('components/Content/Happening/EventRSVPConfirmationDetails/locales', 'EventRSVPConfirmationDetails');

    const [message, confirmationMethod] = smsPhoneNumber
        ? [getText('confirmationWithPhoneMsg'), FormValidator.getFormattedPhoneNumber(smsPhoneNumber)]
        : [getText('confirmationWithEmailMsg'), clientEmail];

    const eventDate = formatAppointmentDate(startDateTime, timeZone);
    const eventTimeRange = formatAppointmentTimeFrame(startDateTime, timeZone, duration);

    if (typeof window !== 'undefined') {
        HappeningBindings.eventRSVPConfirmationPageLoadAnalytics(activityName, storeId);
    }

    return (
        <Flex
            columnGap={6}
            marginTop={[25, null, 23]}
            width={['100%', null, '50%']}
        >
            <Flex
                position='relative'
                flexDirection={'column'}
                gap={[4, null, 6]}
                flex={1}
            >
                <Flex
                    flexDirection={'column'}
                    gap={4}
                >
                    <Flex>
                        <Icon
                            name={'circleCheck'}
                            size={22}
                            color={'green'}
                            marginRight={['8px']}
                        />
                        <Text
                            is={'h1'}
                            display={'inline-block'}
                            fontWeight={'bold'}
                            fontSize={[20, null, 24]}
                            lineHeight={['22px', null, '26px']}
                            children={getText('rsvpTitle')}
                        />
                    </Flex>
                    <Text
                        fontSize={14}
                        wordWrap={'break-word'}
                    >
                        {message}
                        <Text
                            is={'span'}
                            fontWeight={'bold'}
                        >
                            {confirmationMethod}.
                        </Text>
                    </Text>
                </Flex>
                <Flex
                    alignItems={'flex-start'}
                    gap={4}
                >
                    <HappeningImg
                        width={[105, null, 210]}
                        borderRadius={4}
                        atl={activityName}
                        src={imageUrl}
                    />
                    <Box flex={1}>
                        <Text
                            display='block'
                            fontWeight={'bold'}
                            lineHeight={'18px'}
                            wordWrap={'break-word'}
                            marginBottom={['2px']}
                            children={eventDate}
                        />
                        <Text
                            display='block'
                            fontWeight={'bold'}
                            lineHeight={'18px'}
                            wordWrap={'break-word'}
                            marginBottom={[2]}
                            children={eventTimeRange}
                        />
                        <Text
                            display='block'
                            lineHeight={'18px'}
                            wordWrap={'break-word'}
                            marginBottom={[2]}
                            children={activityName}
                        />
                        <Text
                            display='block'
                            lineHeight={'18px'}
                            wordWrap={'break-word'}
                            marginBottom={[2]}
                            children={ensureSephoraPrefix(displayName)}
                        />
                        <Text
                            display='block'
                            fontSize={'sm'}
                            lineHeight={'14px'}
                            wordWrap={'break-word'}
                            color={'gray'}
                            marginBottom={[4]}
                            children={`${getText('confirmationNum')}: ${confirmationNumber}`}
                        />
                        <ActionButtons
                            size='sm'
                            width={150}
                            calendarInfo={reservationDetails}
                            reservationDetails={reservationDetails}
                            buttons={EVENT_BUTTONS.UPCOMING}
                            commonButtonProps={{ maxWidth: [null, null, 150] }}
                        />
                    </Box>
                </Flex>
                <Box
                    paddingX={[4, null, 0]}
                    paddingY={[2, null, 0]}
                    position={['fixed', null, 'relative']}
                    right={0}
                    bottom={['calc(var(--bottomNavHeight) - 1px)', null, 0]}
                    left={0}
                    backgroundColor={[colors.white, null, 'inherit']}
                    zIndex={['var(--layer-flyout)', null, 'auto']}
                    borderBottom={[`${borders[1]} ${colors.lightGray}`, null, 'none']}
                    boxShadow={[shadows.light, null, 'none']}
                >
                    <Button
                        width={['100%', null, 203]}
                        variant='secondary'
                        children={getText('viewAll')}
                        onClick={e => {
                            Location.navigateTo(e, '/happening/reservations');
                        }}
                    />
                </Box>
            </Flex>
        </Flex>
    );
}

export default wrapFunctionalComponent(EventConfirmationDetails, 'EventConfirmationDetails');
