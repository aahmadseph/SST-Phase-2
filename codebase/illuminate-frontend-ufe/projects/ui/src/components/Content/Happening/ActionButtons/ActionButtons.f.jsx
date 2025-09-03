import React from 'react';

import { Flex, Button, Link } from 'components/ui';

import { mediaQueries } from 'style/config';

import { wrapFunctionalComponent } from 'utils/framework';
import {
    addToCalendar, getHoursDifference, showCountryMissMatchModal, isQuebec
} from 'utils/happening';
import { isWaitlist } from 'utils/happeningReservation';
import localeUtils from 'utils/LanguageLocale';
import locationUtils from 'utils/Location';

import sdnApi from 'services/api/sdn';

import HappeningBindings from 'analytics/bindingMethods/components/Content/Happening/HappeningBindings';
import ReservationsBindings from 'analytics/bindingMethods/pages/reservations/ReservationsBindings';

import anaUtils from 'analytics/utils';

import {
    HOURS_BEFORE_START_TIME,
    SERVICES_FAQ_URL,
    BEAUTY_SERVICES_FAQ_URL,
    VARIANT_STYLES,
    ORIGIN_PAGES
} from 'components/Content/Happening/ActionButtons/constants';
import { EXPERIENCES } from 'components/Content/Happening/ReservationDetails/constants';

const { getLocaleResourceFile, getCurrentCountry } = localeUtils;
const { deleteApptReservation } = sdnApi;

const prop55Map = {
    [EXPERIENCES.SERVICES]: 'happening:canceled booking:service',
    [EXPERIENCES.EVENTS]: 'happening:canceled booking:event'
};

const SOT_TRACKING_CALL_DEBOUNCE_TIME = 3000;

function ActionButtons({
    reservationDetails = {},
    calendarInfo,
    showInfoModal,
    showEDPConfirmRsvpModal,
    user,
    width = 186,
    size = 'md',
    buttons = [],
    commonButtonProps = {},
    wrapperProps = {},
    isGuestEventServicesEnabled,
    isBI,
    isGuestFlow,
    serviceName
}) {
    const getText = getLocaleResourceFile('components/Content/Happening/ActionButtons/locales', 'ActionButtons');

    const {
        confirmationNumber,
        artist: { employeeNumber } = {},
        store: { timeZone, storeId, address = {} },
        dayPeriod,
        isGuest
    } = reservationDetails;

    let activityId = '';

    if (calendarInfo.type === EXPERIENCES.SERVICES) {
        activityId = reservationDetails.serviceInfo.activityId;
    }

    if (calendarInfo.type === EXPERIENCES.EVENTS) {
        activityId = reservationDetails?.eventInfo?.activityId;
    }

    const startDateTime =
        reservationDetails && reservationDetails.startDateTime ? reservationDetails.startDateTime.replace('[UTC]', '') : reservationDetails.startDate;

    const localCountry = getCurrentCountry();

    const isSameCountry = address.country === localCountry;

    const handleOnOpenRsvpModal = e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (isGuestEventServicesEnabled && (isGuestFlow || isBI)) {
            HappeningBindings.guestBookingFlowCancelAction(serviceName);
        }

        HappeningBindings.actionButtonsCancelBookingLinkAnalytics(calendarInfo.activityName);

        showInfoModal({
            isOpen: true,
            title: getText('cancelRsvp'),
            message: getText('areYouSure'),
            buttonText: getText('no'),
            cancelText: getText('yes'),
            showCancelButton: true,
            cancelButtonCallback: handleCancelReservation
        });
    };

    const triggerSOTAnalytics = () => {
        const { activityName, type: activityType } = calendarInfo || reservationDetails;

        ReservationsBindings.reservationCancel({
            reservationName: activityName,
            activityType,
            activityId,
            storeId
        });

        return new Promise(resolve => setTimeout(resolve, SOT_TRACKING_CALL_DEBOUNCE_TIME));
    };

    const handleCancelReservation = async () => {
        const { activityName, type: activityType } = calendarInfo || reservationDetails;
        const { postalCode, country } = address;

        showInfoModal({ isOpen: false });

        try {
            await deleteApptReservation({ activityType, confirmationNumber });
            await triggerSOTAnalytics();

            if (locationUtils.isReservationDetailsPage()) {
                locationUtils.reload();
            } else {
                if (prop55Map[activityType]) {
                    anaUtils.setNextPageData({
                        prop55: `${prop55Map[activityType]}:${activityName.toLowerCase()}`
                    });
                }

                let confirmationUrl = `/happening/reservations/confirmation?id=${confirmationNumber}&zipCode=${postalCode}&country=${country}`;
                confirmationUrl += isGuest ? `&isGuest=${isGuest}` : '';
                locationUtils.navigateTo(null, confirmationUrl);
            }
        } catch (error) {
            Sephora.logger.error(`Error cancelling reservation ${confirmationNumber}:`, error);
        }
    };

    const showCancelModal = ({ message, cancelButtonCallback, cancelText = '', title = '' }) => {
        showInfoModal({
            isOpen: true,
            title,
            message,
            buttonText: getText('no'),
            cancelText,
            showCancelButton: true,
            cancelButtonCallback
        });
    };

    const redirectToBookingFlow = (isReschedule = false, isFindAnotherTime = false) => {
        const artistId = employeeNumber ? `&artistId=${employeeNumber}` : '';

        let rescheduleConfirmationNumber = '';
        let waitlistInfo = '';

        if (isReschedule) {
            rescheduleConfirmationNumber = `&rescheduleConfirmationNumber=${confirmationNumber}`;
            showInfoModal({ isOpen: false });
        }

        if (isFindAnotherTime) {
            waitlistInfo = `&waitlistConfirmationNumber=${confirmationNumber}&startDateTime=${startDateTime}&dayPeriod=${dayPeriod}`;
        }

        locationUtils.navigateTo(
            null,
            `happening/services/booking/${activityId}?storeId=${storeId}&zipCode=${address.postalCode}${rescheduleConfirmationNumber}${artistId}${waitlistInfo}`
        );
    };

    const redirectToReschedule = e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        redirectToBookingFlow(true);
    };

    const redirectToBookAgain = (e, callbackArgs = {}) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!isSameCountry) {
            showCountryMissMatchModal();

            return;
        }

        const { status } = callbackArgs;
        const {
            serviceInfo: { displayName = '', type }
        } = reservationDetails;

        if (isWaitlist(type) && status) {
            HappeningBindings.actionButtonBookAgainWaitlistLinkAnalytics(displayName, status);
        }

        redirectToBookingFlow();
    };

    const confirmEventRSVP = e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!isSameCountry) {
            showCountryMissMatchModal();

            return;
        }

        const { eventInfo = {}, store } = reservationDetails;

        showEDPConfirmRsvpModal({
            isOpen: true,
            user,
            timeZone,
            storeId,
            eventDisplayName: eventInfo.displayName,
            storeDisplayName: store.displayName,
            edpInfo: { ...eventInfo, type: 'event' },
            timeSlot: { startDateTime, durationMin: eventInfo.durationInt, bookingId: reservationDetails.bookingId }
        });
    };

    const getWithin24HoursMessage = (textKey, policiesUrl) => {
        const { serviceFees: { possibleCancellationFee = '' } = {} } = reservationDetails;

        return (
            <>
                {`${getText(textKey, [possibleCancellationFee])} `}
                <Link
                    color={'blue'}
                    css={{ textDecoration: 'underline' }}
                    href={policiesUrl}
                    children={getText('seePolicies')}
                />
                {` ${getText('moreDetails')}`}
            </>
        );
    };

    const handleReschedule = e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!isSameCountry) {
            showCountryMissMatchModal();

            return;
        }

        const hoursDifference = getHoursDifference(startDateTime, timeZone);

        if (hoursDifference > 0) {
            let message = getText('areYouSureReschedule');

            if (hoursDifference <= HOURS_BEFORE_START_TIME) {
                const isQuebecProvince = isQuebec(address);

                if (!isQuebecProvince) {
                    message = getWithin24HoursMessage('areYouSureRescheduleWithin24Hours', SERVICES_FAQ_URL);
                }
            }

            showCancelModal({
                message,
                cancelButtonCallback: redirectToReschedule,
                cancelText: getText('yesReschedule'),
                title: getText('rescheduleService')
            });
        }
    };

    const handleOnOpenCancelModal = e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!isSameCountry) {
            showCountryMissMatchModal();

            return;
        }

        const hoursDifference = getHoursDifference(startDateTime, timeZone);

        if (hoursDifference > 0) {
            let message = getText('areYouSureCancel');

            if (hoursDifference <= HOURS_BEFORE_START_TIME) {
                const isQuebecProvince = isQuebec(address);

                if (!isQuebecProvince) {
                    message = getWithin24HoursMessage('areYouSureWithin24Hours', BEAUTY_SERVICES_FAQ_URL);
                }
            }

            showCancelModal({ message, cancelButtonCallback: handleCancelReservation, cancelText: getText('yes'), title: getText('cancelService') });
        }

        const {
            serviceInfo: { displayName }
        } = reservationDetails;

        HappeningBindings.actionButtonsCancelBookingLinkAnalytics(displayName);
    };

    const handleAddToCalendar = e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const { activityName, storeName, duration, type } = calendarInfo;

        if (isGuestEventServicesEnabled && (isGuestFlow || isBI)) {
            HappeningBindings.guestBookingFlowAddToCalendarAction(serviceName);
        }

        HappeningBindings.actionButtonsAddToCalendarLinkAnalytics(activityName);

        addToCalendar(startDateTime, duration, activityName, storeName, {
            activityId: confirmationNumber,
            type
        });
    };

    const handleBeautyAdvisorRecsPage = e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        locationUtils.navigateTo(e, '/in-store-services');
    };

    const cancelWaitlist = () => {
        const {
            serviceInfo: { displayName }
        } = reservationDetails;

        HappeningBindings.actionButtonCancelWaitlistLinkAnalytics(displayName);

        showInfoModal({ isOpen: false });
    };

    const handleCancelWaitlist = e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        showInfoModal({
            isOpen: true,
            title: getText('cancelWaitlist'),
            message: getText('areYouSureCancelWaitlist'),
            buttonText: getText('no'),
            cancelText: getText('yes'),
            showCancelButton: true,
            cancelButtonCallback: cancelWaitlist
        });
    };

    const handleFindAnotherTime = e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const {
            serviceInfo: { displayName = '' }
        } = reservationDetails;

        const prop55 = `happening:find another time:${displayName.toLowerCase()}`;
        digitalData.page.attributes.previousPageData = {
            ...digitalData.page.attributes.previousPageData,
            linkData: prop55
        };
        anaUtils.setNextPageData({
            linkData: prop55
        });

        redirectToBookingFlow(null, true);
    };

    const declineAndCancelWaitlist = () => {
        const {
            serviceInfo: { displayName }
        } = reservationDetails;

        HappeningBindings.actionButtonCancelWaitlistLinkAnalytics(displayName);
        showInfoModal({ isOpen: false });
    };

    const handleDeclineAndCancelWaitlist = e => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        showInfoModal({
            isOpen: true,
            title: getText('declineCancelWaitlist'),
            message: getText('areYouSureDeclineAndCancel'),
            buttonText: getText('no'),
            cancelText: getText('yes'),
            showCancelButton: true,
            cancelButtonCallback: declineAndCancelWaitlist
        });
    };

    const handleBookNow = (e, callbackArgs = {}) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const {
            serviceInfo: { displayName = '' }
        } = reservationDetails;

        const { originPage } = callbackArgs;

        let prop55 = `happening:waitlist book now:${displayName.toLowerCase()}`;

        if (originPage === ORIGIN_PAGES.MY_RESERVATIONS_PAGE) {
            prop55 = `happening:book now:${displayName.toLowerCase()}`;
        }

        digitalData.page.attributes.previousPageData = {
            ...digitalData.page.attributes.previousPageData,
            linkData: prop55
        };
        anaUtils.setNextPageData({
            linkData: prop55
        });

        return locationUtils.navigateTo(e, `/happening/waitlist/booking/${confirmationNumber}`);
    };

    const padding = size === 'md' ? 20 : 12;

    const buttonsInventory = {
        addToCal: {
            download: 'zoom-meeting.ics',
            onClick: handleAddToCalendar
        },
        cancelRsvp: {
            onClick: handleOnOpenRsvpModal
        },
        reschedule: {
            onClick: handleReschedule
        },
        cancel: {
            onClick: handleOnOpenCancelModal
        },
        bookAgain: {
            onClick: redirectToBookAgain
        },
        productRecs: {
            onClick: handleBeautyAdvisorRecsPage
        },
        rsvp: {
            onClick: confirmEventRSVP
        },
        cancelWaitlist: {
            onClick: handleCancelWaitlist
        },
        bookNow: {
            onClick: handleBookNow
        },
        findAnotherTime: {
            onClick: handleFindAnotherTime
        },
        declineAndCancel: {
            onClick: handleDeclineAndCancelWaitlist
        },
        declineAndCancelWaitlist: {
            onClick: handleDeclineAndCancelWaitlist
        }
    };

    const handleOnClick = (onClick, callbackArgs) => e => {
        if (callbackArgs) {
            return onClick(e, callbackArgs);
        }

        return onClick(e);
    };

    const getButtonVariant = (index, variant) => {
        if (variant) {
            return variant;
        }

        if (index === 0) {
            return VARIANT_STYLES.PRIMARY;
        }

        return VARIANT_STYLES.SECONDARY;
    };

    return (
        <Flex
            display={'flex'}
            alignItems={'center'}
            flexDirection={['row']}
            flexWrap={['wrap', 'wrap', 'nowrap']}
            gap={2}
            {...wrapperProps}
        >
            {buttons.map(({ name, variant: variantStyle = null, callbackArgs = {}, ...buttonProps }, index) => {
                const { onClick, ...defaultButtonProps } = buttonsInventory[name];
                const variant = getButtonVariant(index, variantStyle);

                return (
                    <Button
                        key={`reservation-detail-btn-${name}-${index}`}
                        width={['100%', '100%', 'fit-content']}
                        minWidth={['100%', '100%', width]}
                        size={size}
                        paddingLeft={padding}
                        paddingRight={padding}
                        variant={variant}
                        onClick={handleOnClick(onClick, callbackArgs)}
                        {...defaultButtonProps}
                        {...commonButtonProps}
                        {...buttonProps}
                        css={{ ...styles[variant], ...commonButtonProps?.css, ...buttonProps?.css }}
                        children={getText(name)}
                    />
                );
            })}
        </Flex>
    );
}

const styles = {
    [VARIANT_STYLES.PRIMARY]: {
        border: 0,
        [mediaQueries.smMax]: {
            width: '100%'
        }
    },
    [VARIANT_STYLES.SECONDARY]: {
        [mediaQueries.smMax]: {
            flex: 1
        }
    },
    [VARIANT_STYLES.SPECIAL]: {
        border: 0,
        [mediaQueries.smMax]: {
            width: '100%'
        }
    },
    [VARIANT_STYLES.LINK]: {
        paddingLeft: 0,
        paddingRight: 0,
        minHeight: 0,
        textDecoration: 'none',
        '.no-touch &:hover, :active, &.is-active': {
            textDecoration: 'underline'
        }
    }
};

export default wrapFunctionalComponent(ActionButtons, 'ActionButtons');
