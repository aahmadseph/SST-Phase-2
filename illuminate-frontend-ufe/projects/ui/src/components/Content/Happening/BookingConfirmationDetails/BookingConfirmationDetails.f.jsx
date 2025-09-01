import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import {
    Box, Button, Flex, Grid, Image, Text
} from 'components/ui';
import ActionButtons from 'components/Content/Happening/ActionButtons';
import HappeningImg from 'components/SharedComponents/HappeningImg';
import formValidatorUtils from 'utils/FormValidator';
import localeUtils from 'utils/LanguageLocale';
import locationUtils from 'utils/Location';
import { formatAppointmentDate, formatAppointmentTimeFrame, ensureSephoraPrefix } from 'utils/happening';
import resourceWrapper from 'utils/framework/resourceWrapper';
import { borders, colors, shadows } from 'style/config';
import { SERVICE_BUTTONS } from 'components/Content/Happening/ActionButtons/constants';
import HappeningBindings from 'analytics/bindingMethods/components/Content/Happening/HappeningBindings';
import anaUtils from 'analytics/utils';

const { getLocaleResourceFile } = localeUtils;

function BookingConfirmationDetails(props) {
    const getText = getLocaleResourceFile('components/Content/Happening/BookingConfirmationDetails/locales', 'BookingConfirmationDetails');
    const isGuestEventServicesEnabled = Sephora.configurationSettings.isGuestEventServicesEnabled;
    const { showBiRegisterModal, showSignInModal } = props;

    const {
        artist,
        confirmationNumber,
        email,
        startDateTime,
        store,
        serviceInfo = {},
        selectedFeatureToFocus,
        smsEnabled,
        smsPhoneNumber,
        specialRequests,
        isBI,
        isGuest,
        firstName,
        lastName
    } = props.bookingInfo;
    const {
        duration, durationInt, displayName: activityName, type, imageUrl, price, guestEmail
    } = serviceInfo;
    const { isSignedIn } = props.user;
    const storeName = store?.displayName;
    const artistName = artist?.displayName;
    const formattedDate = formatAppointmentDate(startDateTime, store.timeZone);
    const formattedTime = formatAppointmentTimeFrame(startDateTime, store.timeZone, durationInt);
    const existingData = anaUtils.getPreviousPageData();

    const getCalendarInfo = () => {
        return {
            activityName,
            storeName,
            confirmationNumber,
            startDateTime,
            duration,
            type
        };
    };

    const getFormattedText = resourceWrapper(getText);

    const confirmationMethod = smsEnabled && smsPhoneNumber ? 'phoneConfirmation' : 'emailConfirmation';
    const confirmationValue = smsEnabled && smsPhoneNumber ? formValidatorUtils.getFormattedPhoneNumber(smsPhoneNumber) : email;

    const sendAnalytics = () => {
        if (isGuestEventServicesEnabled && isGuest) {
            if (existingData?.isRescheduling) {
                HappeningBindings.guestBookingFlowConfirmationPageLoadOnReschedule(activityName, store?.storeId);
            } else {
                HappeningBindings.guestBookingFlowConfirmationPageLoad(activityName, store?.storeId);
            }
        } else {
            HappeningBindings.serviceBookingConfirmationPageLoadAnalytics(activityName, store?.storeId);
        }
    };

    if (typeof window !== 'undefined') {
        sendAnalytics();
    }

    const getPoints = () => {
        return price?.replace(/\$/g, '') ?? '0';
    };

    const potentialBiPoints = `${getPoints()}`;

    const showBiRegistration = () => {
        if (isGuestEventServicesEnabled && isGuest) {
            HappeningBindings.guestBookingFlowCreateAccountAction();
        }

        showBiRegisterModal({
            isOpen: true,
            extraParams: {
                isBooking: true,
                confirmationId: props.bookingInfo?.confirmationNumber,
                isExistingUser: false,
                isNonBIRegisteredUser: false,
                guestEmail: guestEmail ?? email,
                biPoints: potentialBiPoints,
                biFormTestType: 'popupModalWithPasswordFieldAndBI',
                firstName,
                lastName
            }
        });
    };

    const showBISignIn = () => {
        showSignInModal({
            isOpen: true,
            email,
            extraParams: {
                keepMeSignedIn: true,
                isEmailDisabled: true,
                showOptionToCreateAccount: false,
                potentialBiPoints
            }
        });
    };

    return (
        <Flex
            flexDirection='column'
            gap={[5, null, 5]}
            marginTop={4}
        >
            <Grid gap={[2, 4]}>
                <Flex
                    alignItems='center'
                    gap={2}
                >
                    <Image
                        size={24}
                        src='/img/ufe/filled-checkmark.svg'
                    />
                    <Text
                        is='h1'
                        fontSize={['lg', null, 'xl']}
                        fontWeight='bold'
                        children={getText('youAreBookedTitle')}
                    />
                </Flex>
                <Text
                    is='p'
                    children={getFormattedText(
                        confirmationMethod,
                        false,
                        <Text
                            fontWeight='bold'
                            children={confirmationValue}
                        />
                    )}
                />
            </Grid>
            {isGuestEventServicesEnabled && isGuest && isBI && !isSignedIn && (
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
                                {getText('points', [potentialBiPoints])}
                            </Text>
                            {getText('dontMissOutForSignInPart2')}
                        </Text>
                    </Flex>
                    <Button
                        width={['100%', null, 203]}
                        variant='primary'
                        children={getText('singInButton')}
                        onClick={showBISignIn}
                    />
                </Flex>
            )}
            {isGuestEventServicesEnabled && isGuest && !isBI && !isSignedIn && (
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
                                {getText('points', [potentialBiPoints])}
                            </Text>
                            {getText('dontMissOutForCreateAcountPart2')}
                        </Text>
                    </Flex>
                    <Button
                        width={['100%', null, 203]}
                        variant='primary'
                        children={getText('createAccountButton')}
                        onClick={showBiRegistration}
                    />
                </Flex>
            )}
            <Flex
                alignItems={'flex-start'}
                gap={3}
            >
                <HappeningImg
                    borderRadius={2}
                    width={['100%', null, 210]}
                    maxWidth={[105, null, '100%']}
                    alt={activityName}
                    src={imageUrl}
                />
                <Flex
                    gap={4}
                    flexDirection='column'
                >
                    <Grid gap={2}>
                        <div>
                            <Text
                                fontWeight='bold'
                                is='p'
                                children={formattedDate}
                            />
                            <Text
                                fontWeight='bold'
                                is='p'
                                children={formattedTime}
                            />
                        </div>
                        <Text
                            is='p'
                            children={activityName}
                        />
                        <div>
                            <Text
                                is='p'
                                children={getText('artist', [artistName])}
                            />
                            {selectedFeatureToFocus && (
                                <Text
                                    is='p'
                                    children={getText('selectedFeature', [selectedFeatureToFocus])}
                                />
                            )}
                            {specialRequests && (
                                <Text
                                    is='p'
                                    children={getText('specialRequests', [specialRequests])}
                                />
                            )}
                            <Text
                                is='p'
                                children={ensureSephoraPrefix(storeName)}
                            />
                        </div>
                        <Text
                            fontSize='sm'
                            is='p'
                            color={colors.gray}
                            children={`${getText('confirmationNumber')}: ${confirmationNumber}`}
                        />
                    </Grid>
                    <ActionButtons
                        size='sm'
                        width={120}
                        calendarInfo={getCalendarInfo()}
                        reservationDetails={props.bookingInfo}
                        buttons={SERVICE_BUTTONS.UPCOMING}
                        commonButtonProps={{ minWidth: [109, null, 120], maxWidth: [null, null, 120] }}
                        isGuestEventServicesEnabled={isGuestEventServicesEnabled}
                        isBI={isBI}
                        isGuestFlow={isGuest}
                        serviceName={activityName}
                    />
                </Flex>
            </Flex>
            {(!isGuestEventServicesEnabled || isSignedIn) && (
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
                        children={getText('viewAllReservations')}
                        onClick={e => {
                            locationUtils.navigateTo(e, '/happening/reservations');
                        }}
                    />
                </Box>
            )}
        </Flex>
    );
}

export default wrapFunctionalComponent(BookingConfirmationDetails, 'BookingConfirmationDetails');
