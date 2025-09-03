import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import {
    Flex, Box, Image, Text
} from 'components/ui';
import ActionButtons from 'components/Content/Happening/ActionButtons';
import HappeningImg from 'components/SharedComponents/HappeningImg';

import {
    isService,
    isPast,
    isCancelled,
    isUpcoming,
    isWaitlist,
    isWaitlistStatus,
    isWaitlistHold,
    isWaitlistExpired,
    isWaitlistCanceled,
    getStatusLabelAndIcon
} from 'utils/happeningReservation';
import {
    MY_RESERVATIONS_SERVICE_BUTTONS,
    MY_RESERVATIONS_EVENT_BUTTONS,
    MY_RESERVATIONS_WAITLIST_BUTTONS
} from 'components/Content/Happening/ActionButtons/constants';

import localeUtils from 'utils/LanguageLocale';
import locationUtils from 'utils/Location';
import {
    formatAppointmentDate, formatAppointmentTimeFrame, isFutureEvent, isEventStillUpcoming, ensureSephoraPrefix
} from 'utils/happening';

import keyConsts from 'utils/KeyConstants';

import { mediaQueries, shadows } from 'style/config';

const { getLocaleResourceFile } = localeUtils;

function ReservationCard({ reservation }) {
    const {
        type, status, subStatus, startDateTime, store
    } = reservation;
    const isServiceReservation = isService(type);
    const isWaitlistReservation = isWaitlist(type);
    const isUpcomingReservation = isUpcoming(status);
    const isPastReservation = isPast(status);
    const isCancelledReservation = isCancelled(status);

    const infoKey = isServiceReservation || isWaitlistReservation ? 'serviceInfo' : 'eventInfo';
    const reservationInfo = reservation[infoKey];
    const isReservationAfter = isFutureEvent(startDateTime, store.timeZone, reservationInfo.durationInt);

    const { confirmationNumber } = reservation;

    const getText = getLocaleResourceFile('components/HappeningNonContent/Reservations/ReservationCard/locales', 'ReservationCard');

    const price = reservationInfo?.price ? `${reservationInfo.price}` : getText('free');

    function onBoxClick(e) {
        const {
            store: {
                address: { postalCode, country }
            }
        } = reservation;

        const url = isWaitlistReservation
            ? `/happening/waitlist/reservation/${confirmationNumber}`
            : `/happening/reservations/confirmation?id=${confirmationNumber}&zipCode=${postalCode}&country=${country}`;

        locationUtils.navigateTo(e, url);
    }

    function renderServiceButtons() {
        if (isUpcomingReservation) {
            return MY_RESERVATIONS_SERVICE_BUTTONS.UPCOMING;
        }

        if (isPastReservation) {
            return MY_RESERVATIONS_SERVICE_BUTTONS.PAST;
        }

        if (isReservationAfter) {
            return MY_RESERVATIONS_SERVICE_BUTTONS.IS_DAY_AFTER;
        }

        if (isCancelledReservation) {
            return MY_RESERVATIONS_SERVICE_BUTTONS.CANCELLED;
        }

        return [];
    }

    const isReservationStillAvailable = isEventStillUpcoming(startDateTime, store.timeZone);

    function renderEventButtons() {
        if (isUpcomingReservation) {
            return MY_RESERVATIONS_EVENT_BUTTONS.UPCOMING;
        }

        if (isCancelledReservation && isReservationStillAvailable) {
            return MY_RESERVATIONS_EVENT_BUTTONS.CANCELLED;
        }

        return [];
    }

    function renderWaitlistButtons() {
        if (isWaitlistStatus(subStatus)) {
            return MY_RESERVATIONS_WAITLIST_BUTTONS.WAITLIST;
        }

        if (isWaitlistHold(subStatus)) {
            return MY_RESERVATIONS_WAITLIST_BUTTONS.WAITLIST_HOLD;
        }

        if (isWaitlistExpired(subStatus)) {
            return MY_RESERVATIONS_WAITLIST_BUTTONS.WAITLIST_EXPIRED;
        }

        if (isWaitlistCanceled(subStatus)) {
            return MY_RESERVATIONS_WAITLIST_BUTTONS.WAITLIST_CANCELED;
        }

        return [];
    }

    function getButtons() {
        if (isWaitlistReservation) {
            return renderWaitlistButtons();
        }

        return isServiceReservation ? renderServiceButtons() : renderEventButtons();
    }

    function getCalendarInfo() {
        if (isServiceReservation) {
            const {
                serviceInfo: { duration, displayName: activityName, type: serviceType },
                store: { displayName: storeName }
            } = reservation;

            return {
                activityName,
                storeName,
                confirmationNumber,
                startDateTime,
                duration,
                type: serviceType
            };
        }

        const {
            eventInfo: { duration, displayName: activityName, type: eventType },
            store: { displayName: storeName }
        } = reservation;

        return {
            activityName,
            storeName,
            confirmationNumber,
            startDateTime,
            duration,
            type: eventType
        };
    }

    function getCustomActionButtonsProps() {
        return {
            wrapperProps: {
                flexWrap: 'nowrap',
                width: ['100%', null, 'fit-content'],
                justifyContent: [null, null, 'flex-end']
            },
            commonButtonProps: {
                minWidth: ['50%', null, 162],
                css: {
                    width: 162,
                    [mediaQueries.smMax]: {
                        width: '50%'
                    },
                    [mediaQueries.md]: {
                        flex: 1
                    }
                }
            }
        };
    }

    function onKeyPress(e) {
        switch (e.key) {
            case keyConsts.ENTER:
            case keyConsts.SPACE:
                e.preventDefault();
                e.stopPropagation();
                onBoxClick(e);

                break;
            default:
                break;
        }
    }

    const image = isServiceReservation ? reservation.serviceInfo.imageUrl : reservation.eventInfo.image;
    const reservationDate = formatAppointmentDate(startDateTime, store.timeZone);
    const calendarInfo = getCalendarInfo();
    const buttons = getButtons();
    const customActionButtonsProps = getCustomActionButtonsProps();

    const { icon, statusLabel } = getStatusLabelAndIcon({
        status,
        type,
        subStatus,
        startDateTime,
        store,
        duration: reservationInfo.durationInt,
        serviceFees: reservation.serviceFees
    });

    const isPastOrUnavailableReservation = isPastReservation || (isCancelledReservation && !isReservationStillAvailable);

    return (
        <Flex
            is={'div'}
            gap={[3, 4]}
            padding={[3, 4, 4]}
            borderRadius={4}
            boxShadow={'light'}
            justifyContent={'space-between'}
            alignItems={'flex-start'}
            flexDirection={['column', 'column', 'row']}
            onClick={onBoxClick}
            role={'button'}
            tabIndex={0}
            onKeyPress={onKeyPress}
            css={{
                '&:hover': {
                    boxShadow: shadows.medium
                }
            }}
        >
            <div>
                <Flex
                    gap={1}
                    alignItems={'center'}
                >
                    <Image
                        height={12}
                        width={12}
                        src={`/img/ufe/${icon}`}
                    />
                    <Text
                        is={'p'}
                        fontSize={'sm'}
                        fontWeight={'normal'}
                        lineHeight={'14px'}
                        children={statusLabel}
                        color={'gray'}
                    />
                </Flex>
                <Text
                    is={'h3'}
                    fontSize={'md'}
                    fontWeight={'bold'}
                    lineHeight={'20px'}
                    marginTop={'2px'}
                    marginBottom={isPastOrUnavailableReservation ? 4 : 0}
                    children={reservationDate}
                />
                {!isPastOrUnavailableReservation && (
                    <Text
                        is={'h3'}
                        fontSize={'md'}
                        fontWeight={'bold'}
                        lineHeight={'20px'}
                        marginTop={'2px'}
                        marginBottom={[3, 4]}
                        children={formatAppointmentTimeFrame(startDateTime, store.timeZone, reservationInfo.durationInt)}
                    />
                )}
                <Flex
                    alignItems={'flex-start'}
                    gap={[3, 4]}
                >
                    <Box width={105}>
                        <HappeningImg
                            width={105}
                            borderRadius={2}
                            alt={reservation.activityDisplayName}
                            src={image}
                            css={{ objectFit: 'cover' }}
                        />
                    </Box>
                    <Box width={[205, null, null]}>
                        <Text
                            is={'h3'}
                            lineHeight={'18px'}
                            fontWeight={'normal'}
                            marginBottom={1}
                            children={`${reservationInfo.displayName} / ${price}`}
                        />
                        {reservation.artist && (
                            <Text
                                is={'h3'}
                                lineHeight={'18px'}
                                fontWeight={'normal'}
                                marginBottom={1}
                                children={reservation.artist.displayName ?? getText('noArtist')}
                            />
                        )}
                        <Text
                            is={'h3'}
                            fontWeight={'normal'}
                            lineHeight={'18px'}
                            color={'gray'}
                            marginBottom={1}
                            children={ensureSephoraPrefix(store.displayName)}
                        />
                    </Box>
                </Flex>
            </div>
            {buttons.length > 0 && (
                <Flex
                    gap={2}
                    width={['100%', '100%', 'auto']}
                >
                    <ActionButtons
                        calendarInfo={calendarInfo}
                        reservationDetails={reservation}
                        buttons={buttons}
                        size='sm'
                        width={185}
                        {...customActionButtonsProps}
                    />
                </Flex>
            )}
        </Flex>
    );
}

export default wrapFunctionalComponent(ReservationCard, 'ReservationCard', true);
