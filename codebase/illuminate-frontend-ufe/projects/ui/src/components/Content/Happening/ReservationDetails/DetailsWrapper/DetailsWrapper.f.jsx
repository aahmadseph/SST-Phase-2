/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import {
    Text, Flex, Image, Box, Divider, Button
} from 'components/ui';
import { colors } from 'style/config';
import HappeningImg from 'components/SharedComponents/HappeningImg';
import HappeningBindings from 'analytics/bindingMethods/components/Content/Happening/HappeningBindings';

import { formatAppointmentTimeFrame, formatAppointmentDate } from 'utils/happening';
import localeUtils from 'utils/LanguageLocale';
import { getStatusLabelAndIcon } from 'utils/happeningReservation';
import { EDP_IMG_SIZES } from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/constants';
import { STATUS } from 'components/Content/Happening/ReservationDetails/constants';

const { getLocaleResourceFile } = localeUtils;

const { SMUI_SINGLE_HEIGHT, LGUI_SINGLE_HEIGHT, SMUI_EVENTS_SINGLE_HEIGHT, LGUI_EVENTS_SINGLE_HEIGHT } = EDP_IMG_SIZES;

function DetailsWrapper({ children, details = {} }) {
    const getText = getLocaleResourceFile('components/Content/Happening/ReservationDetails/DetailsWrapper/locales', 'DetailsWrapper');
    const {
        status,
        type,
        subStatus,
        serviceFees,
        startDateTime,
        duration,
        imageUrl,
        store,
        description,
        experienceType = 'event',
        appointmentTime = null,
        price,
        isGuest,
        isBI,
        isGuestEventServicesEnabled,
        showBiRegisterModal,
        showSignInModal,
        clientInfo,
        isSignedIn
    } = details;

    const { icon, statusLabel } = getStatusLabelAndIcon({
        status,
        type,
        subStatus,
        serviceFees,
        startDateTime,
        store,
        duration
    });

    const imageHeightLGUI = type === 'events' ? LGUI_EVENTS_SINGLE_HEIGHT : LGUI_SINGLE_HEIGHT;
    const imageHeightSMUI = type === 'events' ? SMUI_EVENTS_SINGLE_HEIGHT : SMUI_SINGLE_HEIGHT;

    const isCancelled = status === STATUS.CANCELLED;

    const getPoints = priceToFormatt => {
        return priceToFormatt.replace('$', '');
    };

    const getClientFirstAndLastName = () => {
        const name = clientInfo?.name;

        if (!name) {
            return { firstName: '', lastName: '' };
        }

        const parts = name.trim().split(/\s+/);

        if (parts.length === 1) {
            return { firstName: parts[0], lastName: '' };
        }

        return {
            firstName: parts[0],
            lastName: parts[parts.length - 1]
        };
    };

    const showGuestRegistration = () => {
        if (isGuestEventServicesEnabled && isGuest) {
            HappeningBindings.setCreateAccountOnGuestReservation();
        }

        const { firstName, lastName } = getClientFirstAndLastName();

        showBiRegisterModal({
            isOpen: true,
            extraParams: {
                isBooking: true,
                isExistingUser: false,
                isNonBIRegisteredUser: false,
                guestEmail: clientInfo?.email,
                biPoints: getPoints(price),
                biFormTestType: 'popupModalWithPasswordFieldAndBI',
                firstName,
                lastName
            }
        });
    };

    const showSignInForBI = () => {
        showSignInModal({ isOpen: true });
    };

    return (
        <Flex
            paddingTop={[null, null, 4]}
            flexDirection={'column'}
            gap={[5, null, 6]}
        >
            <Flex
                gap={[4, null, 7]}
                flexDirection={['column', null, 'row']}
                alignItems={[null, null, 'flex-start']}
            >
                <HappeningImg
                    width={['100vw', null, '100%']}
                    height={[imageHeightSMUI, null, imageHeightLGUI]}
                    maxWidth={[null, null, 624]}
                    marginX={[-4, null, 0]}
                    css={{ flex: 1, objectFit: 'cover' }}
                    src={imageUrl}
                />
                <Box width={[null, null, 565]}>
                    <Flex
                        alignItems={'center'}
                        gap={1}
                    >
                        <Image
                            height={12}
                            width={12}
                            src={`/img/ufe/${icon}`}
                        />
                        <Text
                            is={'p'}
                            fontSize={'sm'}
                            color={'gray'}
                            children={statusLabel}
                        />
                    </Flex>
                    <Text
                        is={'h1'}
                        fontSize={'xl'}
                        fontWeight={'bold'}
                        marginBottom={4}
                        children={getText('reservationDetails')}
                    />
                    <Flex
                        gap={4}
                        marginBottom={3}
                    >
                        <Box width={105}>
                            <Text
                                fontWeight={'bold'}
                                lineHeight={'18px'}
                                children={getText('dateAndTime')}
                            />
                        </Box>
                        <Box width={[215, null, null]}>
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                children={formatAppointmentDate(startDateTime, store.timeZone)}
                            />
                            <Text
                                is={'p'}
                                lineHeight={'18px'}
                                children={appointmentTime || formatAppointmentTimeFrame(startDateTime, store.timeZone, duration)}
                            />
                        </Box>
                    </Flex>
                    {children}
                </Box>
            </Flex>
            <Divider color={colors.nearWhite} />
            {!isCancelled && isGuestEventServicesEnabled && isGuest && isBI && !isSignedIn && (
                <Flex
                    alignItems='start'
                    flexDirection='column'
                    justifiedContent='start'
                    gap={2}
                    marginBotom={5}
                >
                    <Flex
                        alignItems={'flex-start'}
                        gap={1}
                        flexWrap='wrap'
                    >
                        <Text>
                            {getText('dontMissOutForSignInPart1')}
                            <Text
                                as='span'
                                fontWeight='bold'
                                display='inline'
                            >
                                {getText('points', [getPoints(price)])}
                            </Text>
                            {getText('dontMissOutForSignInPart2')}
                        </Text>
                    </Flex>
                    <Button
                        width={['100%', null, 203]}
                        variant='primary'
                        children={getText('singInButton')}
                        onClick={showSignInForBI}
                    />
                </Flex>
            )}
            {!isCancelled && isGuestEventServicesEnabled && isGuest && !isBI && !isSignedIn && (
                <Flex
                    alignItems='start'
                    flexDirection='column'
                    justifiedContent='start'
                    gap={2}
                    marginBotom={5}
                >
                    <Flex
                        alignItems={'flex-start'}
                        gap={1}
                        flexWrap='wrap'
                    >
                        <Text>
                            {getText('dontMissOutForCreateAcountPart1')}
                            <Text
                                as='span'
                                fontWeight='bold'
                                display='inline'
                            >
                                {getText('points', [getPoints(price)])}
                            </Text>
                            {getText('dontMissOutForCreateAcountPart2')}
                        </Text>
                    </Flex>
                    <Button
                        width={['100%', null, 203]}
                        variant='primary'
                        children={getText('createAccountButton')}
                        onClick={showGuestRegistration}
                    />
                </Flex>
            )}
            <Box maxWidth={824}>
                <Text
                    is={'h2'}
                    fontWeight={'bold'}
                    fontSize={['md', null, 'lg']}
                    lineHeight={['20px', null, '22px']}
                    marginBottom={2}
                    children={getText(`${experienceType}Description`)}
                />
                <Text
                    is={'p'}
                    lineHeight={[null, null, '18px']}
                    children={description}
                />
            </Box>
        </Flex>
    );
}

export default wrapFunctionalComponent(DetailsWrapper, 'DetailsWrapper');
