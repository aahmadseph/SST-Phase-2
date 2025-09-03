import {
    STATUS,
    CANCELLED_SUBSTATUS,
    STATUS_ICONS,
    EXPERIENCES,
    WAITLIST_STATUS,
    WAITLIST_STATUS_ICONS
} from 'components/Content/Happening/ReservationDetails/constants';
import localeUtils from 'utils/LanguageLocale';
import { formatAppointmentTimeFrame } from 'utils/happening';
const { getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('utils/locales', 'happeningReservation');

function getStatusIcon(status) {
    switch (status) {
        case STATUS.UPCOMING:
            return STATUS_ICONS.UPCOMING;
        case STATUS.PAST:
            return STATUS_ICONS.PAST;
        case STATUS.CANCELLED:
        case STATUS.NO_SHOW:
            return STATUS_ICONS.CANCELLED;
        default:
            return STATUS_ICONS.NO_SHOW;
    }
}

function getWaitlistStatusIcon(subStatus) {
    switch (subStatus) {
        case WAITLIST_STATUS.WAITLIST:
            return WAITLIST_STATUS_ICONS.WAITLIST;
        case WAITLIST_STATUS.WAITLIST_HOLD:
            return WAITLIST_STATUS_ICONS.WAITLIST_HOLD;
        case WAITLIST_STATUS.WAITLIST_EXPIRED:
            return WAITLIST_STATUS_ICONS.WAITLIST_EXPIRED;
        case WAITLIST_STATUS.WAITLIST_CANCELED:
            return WAITLIST_STATUS_ICONS.WAITLIST_CANCELED;
        default:
            return WAITLIST_STATUS_ICONS.WAITLIST_CANCELED;
    }
}

function isEvent(type) {
    return type === EXPERIENCES.EVENTS;
}

function isService(type) {
    return type === EXPERIENCES.SERVICES || type === EXPERIENCES.WAITLIST;
}

function isWaitlist(type) {
    return type === EXPERIENCES.WAITLIST;
}

function isUpcoming(status) {
    return status === STATUS.UPCOMING;
}

function isPast(status) {
    return status === STATUS.PAST;
}

function isCancelled(status) {
    return status === STATUS.CANCELLED;
}

function isNoShow(subStatus) {
    return subStatus === CANCELLED_SUBSTATUS.NO_SHOW;
}

function isLateCancellation(subStatus) {
    return subStatus === CANCELLED_SUBSTATUS.LATE_CANCELLATION;
}

function isWaitlistStatus(subStatus) {
    return subStatus === WAITLIST_STATUS.WAITLIST;
}

function isWaitlistHold(subStatus) {
    return subStatus === WAITLIST_STATUS.WAITLIST_HOLD;
}

function isWaitlistExpired(subStatus) {
    return subStatus === WAITLIST_STATUS.WAITLIST_EXPIRED;
}

function isWaitlistCanceled(subStatus) {
    return subStatus === WAITLIST_STATUS.WAITLIST_CANCELED;
}

function getWaitlistStatusLabel(subStatus, waitlistHoldUntil = '') {
    if (isWaitlistStatus(subStatus)) {
        return getText(subStatus);
    }

    if (isWaitlistHold(subStatus)) {
        return getText(subStatus, [waitlistHoldUntil]);
    }

    if (isWaitlistExpired(subStatus)) {
        return getText(subStatus);
    }

    if (isWaitlistCanceled(subStatus)) {
        return getText(subStatus);
    }

    return WAITLIST_STATUS.WAITLIST_CANCELED;
}

function getStatusLabel(reservation) {
    const {
        type, status, subStatus, serviceFees = {}, waitlistHoldUntil = ''
    } = reservation;

    if (isWaitlist(type)) {
        return getWaitlistStatusLabel(subStatus, waitlistHoldUntil);
    }

    if (isCancelled(status)) {
        if (isService(type)) {
            let fee = '$0';

            if (isNoShow(subStatus)) {
                fee = serviceFees?.noShowFee || fee;

                return `${getText(subStatus)} ${getText('fee', [fee])}`;
            }

            if (isLateCancellation(subStatus)) {
                fee = serviceFees?.cancellationFee || fee;

                return `${getText(subStatus)} ${getText('fee', [fee])}`;
            }
        }

        // Events and Services Canceled
        return getText(CANCELLED_SUBSTATUS[subStatus] || CANCELLED_SUBSTATUS.CANCELLED);
    }

    return getText(status);
}

function getStatusLabelAndIcon({
    status, type, subStatus, startDateTime, store, serviceFees = {}, duration = 0
}) {
    const icon = isWaitlist(type) ? getWaitlistStatusIcon(subStatus) : getStatusIcon(status);
    const statusLabel = getStatusLabel({
        status,
        type,
        subStatus,
        serviceFees,
        waitlistHoldUntil: isWaitlistHold(subStatus) ? formatAppointmentTimeFrame(startDateTime, store.timeZone, duration, true) : ''
    });

    return {
        icon,
        statusLabel
    };
}

function mergePropsWithItems(items, additionalProps) {
    return items.map(item => ({
        ...item,
        ...additionalProps
    }));
}

export {
    getStatusIcon,
    isUpcoming,
    isPast,
    isCancelled,
    isEvent,
    isService,
    getStatusLabel,
    isNoShow,
    isLateCancellation,
    isWaitlist,
    isWaitlistStatus,
    isWaitlistHold,
    isWaitlistExpired,
    isWaitlistCanceled,
    getWaitlistStatusIcon,
    getStatusLabelAndIcon,
    mergePropsWithItems
};
