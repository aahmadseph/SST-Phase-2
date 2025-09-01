import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import olrApi from 'services/api/sdn';
import urlUtils from 'utils/Url';
import store from 'store/Store';
import Actions from 'actions/Actions';
import DateUtils from 'utils/Date';
import localeUtils from 'utils/LanguageLocale';
import ACTIVITY from 'constants/happening/activityConstants';
import DateTZ from 'utils/DateTZ';
import Location from 'utils/Location';
import storeUtils from 'utils/Store';
import decorators from 'utils/decorators';
import resourceWrapper from 'utils/framework/resourceWrapper';

const EXPERIENCE_DEFAULT_IMAGES = [
    '/img/ufe/olr/activity-card-default.png',
    '/img/ufe/olr/edp-default.png',
    '/contentimages/happening/experienceimage.jpg'
];

const HAPPENING_CONFIRMATION = '/happening/confirmation';

function getFirstBookableActivity(activities) {
    for (const activity of activities) {
        if (activity.timeSlots && activity.activityId && activity.timeSlots.length) {
            return activity;
        }
    }

    // if no timeSlots found -> return first non-empty activity
    const validActivities = activities.filter(activity => !!activity.activityId);

    return validActivities.length ? validActivities[0] : null;
}

function matchStoreOrder(list, storeList) {
    const storeIndexes = storeUtils.getStoreIndexes(storeList);
    const orderedList = [];
    list.forEach(item => (orderedList[storeIndexes[item.storeId]] = item));

    return orderedList.filter(element => !!element);
}

function getStartDateFromParam() {
    const startDateParam = urlUtils.getParamsByName('startDate');

    if (startDateParam && startDateParam[0]) {
        let startDate = null;

        if (DateUtils.isISODate(startDateParam[0], false)) {
            startDate = new Date(startDateParam[0]);
            // case for ISO Date without time: 2019-02-20
        } else if (DateUtils.isISODate(startDateParam[0], true)) {
            startDate = DateUtils.getDateObjectFromString(startDateParam[0]);
        }

        if (startDate) {
            const today = new Date();
            const yesterday = DateUtils.addDays(today, -1);
            const lastAvailableDay = DateUtils.addDays(today, ACTIVITY.ACTIVITIES_STARTDATE_MAX);

            return DateUtils.isDayBetween(startDate, yesterday, lastAvailableDay) ||
                // we need to enable "yesterday" local time for cases when user is +1 day Timezone from store time
                DateUtils.isSameDay(startDate, yesterday) ||
                DateUtils.isSameDay(startDate, lastAvailableDay)
                ? // we must return the startDateParam unmodified to avoid TZ issues
            // because we don't know the store timezone at this point
                startDateParam[0]
                : null;
        }
    }

    return null;
}

function getDefaultDateTimes(startDate, activityType) {
    const dateRange = activityType === ACTIVITY.TYPE.SERVICES || activityType === ACTIVITY.TYPE.CLASSES ? 7 : 14;

    //default start and end date times on page load
    const startDateTime = startDate || new Date();
    const endDateTime = new Date(startDateTime);
    endDateTime.setDate(endDateTime.getDate() + dateRange);

    return {
        start: startDateTime,
        end: endDateTime
    };
}

/*
    We need to handle 3 possible scenarios for dateTime:
    - Date: don't offset time
    - DateTZ: don't offset time but need to convert between timezones if timezone changed
    - ISOformat: offset it based on timezone
*/
function handleDateFormats(dateTime, timeZone) {
    let newDateTime;

    if (dateTime instanceof Date) {
        newDateTime = new DateTZ(dateTime, timeZone);
        newDateTime.setDateTime(dateTime);
    } else if (dateTime instanceof DateTZ) {
        newDateTime = dateTime.toISOString();
        newDateTime = new DateTZ(newDateTime, timeZone);
        newDateTime.setDateTime(dateTime);
    } else if (DateUtils.isISODate(dateTime)) {
        newDateTime = new DateTZ(dateTime, timeZone);
        // case for ISO Date without time: 2019-02-20
    } else if (DateUtils.isISODate(dateTime, true)) {
        const dateObj = DateUtils.getDateObjectFromString(dateTime);
        newDateTime = new DateTZ(dateObj, timeZone);
        newDateTime.setDateTime(dateObj);
    }

    return newDateTime || null;
}

function formatAPIDateTime(date, timeZone, isEndDate, addDays) {
    // if we pass a null/undefined date we should return undefined so that
    // JSON.stringify on the ufe call do not include it on the params
    if (!date) {
        return undefined;
    }

    //use Store date/time to request activities
    const dateTime = handleDateFormats(date, timeZone);
    //make all API calls from beginning of day store time
    dateTime.setHours(0, 0, 0);
    // for same day calls we need to make the startDateTime current store time + 2 hrs
    const todayStoreTime = new DateTZ(new Date(), timeZone);

    if (!isEndDate && DateUtils.isSameDay(dateTime, todayStoreTime)) {
        // Edge case: Do not add +2 if it's later than 21:59:59 to avoid a startDate
        // beyond endDate (23:59:59) since that would throw an API error
        let storeTimeHours = todayStoreTime.getHours();

        if (storeTimeHours < 21) {
            storeTimeHours += 2;
        }

        dateTime.setHours(storeTimeHours, todayStoreTime.getMinutes(), todayStoreTime.getSeconds());
    }

    //Always add +1 to end date to include last day;
    if (isEndDate) {
        dateTime.setDate(dateTime.getDate() + (addDays || 1));
        dateTime.setSeconds(-1);
    }

    return DateUtils.getShortenedISOString(dateTime);
}

/* eslint-disable no-param-reassign */
function getAllExperiencesByStores(storesRawList, filterParams = {}) {
    const storeIds = storesRawList.map(storeItem => storeItem.storeId);

    //move storeId provided as urlParam to front of list for call
    //so that we get activities for specific store on initial call.
    //it's necessary due to api limitation of 20 stores per call.
    const storeIdParam = urlUtils.getParamsByName('storeId');

    if (storeIdParam && storeIdParam.length) {
        const index = storeIds.indexOf(storeIdParam[0]);

        if (index > 0) {
            storeIds.splice(index, 1);
            storeIds.unshift(storeIdParam);
        }
    }

    const params = Object.assign(filterParams, { storeIds: storeIds.join(',') });
    const timeZone = storesRawList[0] && storesRawList[0].storeHours && storesRawList[0].storeHours.timeZone;

    if (params.startDateTime) {
        params.startDateTime = formatAPIDateTime(params.startDateTime, timeZone);
    }

    if (params.endDateTime) {
        params.endDateTime = formatAPIDateTime(params.endDateTime, timeZone, true);
    }

    params.locale = localeUtils.getCurrentLanguage()?.toLowerCase();
    params.country = localeUtils.getCurrentCountry();

    return olrApi.getExperiences(params).then(response => {
        if (response.responseStatus !== 200 || !response.storeActivities) {
            throw new Error('Invalid experiences response.');
        }

        //storeActivities are not returned in order of store ids passed in
        //need to sort by nearest store for carousels on hub page
        const orderedStoreActivities = [];
        const storeActivities = response.storeActivities;
        // this is super expensive operation
        storesRawList.forEach(storeItem => {
            storeActivities.forEach(storeActivity => {
                if (storeItem.storeId === storeActivity.storeId && storeActivity.activities.length) {
                    //need to sort activities within store bucket by nextAvailableDate
                    storeActivity.activities.sort(function (a, b) {
                        a = new Date(a.nextAvailable);
                        b = new Date(b.nextAvailable);

                        return a < b ? -1 : a > b ? 1 : 0;
                    });
                    storeActivity = Object.assign(storeActivity, {
                        storeName: storeItem.displayName,
                        timeZone: storeItem?.storeHours?.timeZone,
                        city: storeItem?.address?.city,
                        state: storeItem?.address?.state,
                        postalCode: storeItem?.address?.postalCode
                    });
                    orderedStoreActivities.push(storeActivity);
                }
            });
        });

        return {
            storeActivities: orderedStoreActivities,
            storeList: storesRawList,
            startDateTime: params.startDateTime || null
        };
    });
}
/* eslint-enable no-param-reassign */

function getAllExperiencesWithFilters(locationObj, filterParams) {
    const isUS = localeUtils.isUS();

    return storeUtils.getStores(locationObj, true, true, isUS).then(storesRawList => getAllExperiencesByStores(storesRawList, filterParams));
}

function bookReservation(activityId, reservationDetails, confirmationNumberToCancel = null) {
    if (!reservationDetails.channelId) {
        reservationDetails.channelId = 'web';
    }

    reservationDetails.locale = localeUtils.getCurrentLanguage()?.toLowerCase();
    reservationDetails.country = localeUtils.getCurrentCountry();

    return olrApi.bookReservation(activityId, reservationDetails).then(response => {
        if (response.responseStatus !== 200 || !response.confirmationNumber) {
            throw new Error('Invalid bookReservation response.');
        }

        if (confirmationNumberToCancel) {
            Storage.local.setItem(LOCAL_STORAGE.OLR_RESCHEDULE_EXPERIENCE_NUMBER, confirmationNumberToCancel);
        }

        /*
         *ILLUPH-115969 : bookingId as of now not available in response.
         * API team will update contract/response with booking id.
         */
        const params = 'id=' + response.confirmationNumber + '&activityId=' + activityId + '&bookingId=' + reservationDetails.bookingId;

        urlUtils.redirectTo(`${HAPPENING_CONFIRMATION}?${params}`);
    });
}

// This is the Create Reservation from new Reservation Services API
function createReservation(activityId, reservationDetails, confirmationNumberToCancel = null) {
    if (!reservationDetails.channelId) {
        reservationDetails.channelId = 'web';
    }

    reservationDetails.locale = localeUtils.getCurrentLanguage()?.toLowerCase();
    reservationDetails.country = localeUtils.getCurrentCountry();
    reservationDetails.clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return decorators
        .withInterstice(olrApi.createReservation)(reservationDetails)
        .then(response => {
            if (response.responseStatus !== 201 || !response.confirmationNumber) {
                throw new Error('Invalid bookReservation response.');
            }

            if (confirmationNumberToCancel) {
                Storage.local.setItem(LOCAL_STORAGE.OLR_RESCHEDULE_EXPERIENCE_NUMBER, confirmationNumberToCancel);
            }

            const params = 'id=' + response.confirmationNumber + '&activityId=' + activityId + '&bookingId=' + reservationDetails.bookingId;
            urlUtils.redirectTo('/happening/confirmation?' + params);
        });
}

function cancelReservationSuccess(data, rescheduleFlow) {
    if (data.responseStatus === 200) {
        if (!rescheduleFlow) {
            store.dispatch(Actions.showCancelReservationModal({ isOpen: false }));
            store.dispatch(Actions.updateConfirmationStatus(ACTIVITY.RESERVATION_STATUS.CANCELED));
        }
    }

    return data;
}

function cancelReservation({ confirmationNumber, rescheduleFlow }) {
    return olrApi
        .cancelReservation(confirmationNumber)
        .then(data => cancelReservationSuccess(data, rescheduleFlow))
        .catch(err => console.log(err)); // eslint-disable-line no-console
}

// This is the Cancel Reservation from new Reservation Services API
function updateReservation({ confirmationNumber, rescheduleFlow }) {
    return olrApi
        .updateReservation(confirmationNumber)
        .then(data => cancelReservationSuccess(data, rescheduleFlow))
        .catch(err => console.log(err)); // eslint-disable-line no-console
}

function redirectToHub() {
    urlUtils.redirectTo(ACTIVITY.OLR_URLS.LANDING_PAGE);
}

function getAMPMFormat(dateObj) {
    let hours = dateObj.getHours();
    const minutes = ('0' + dateObj.getMinutes()).slice(-2);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    return `${hours}:${minutes} ${ampm}`;
}

function getFullDateStoreTimeFormat(isoDateFormat, timeZone, durationMin = null, isVirtual, displayTimeZone = false, eventInProgressText = null) {
    const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Date');
    // For virtual services we need to use the user local time instead of store time
    const dateTime = isVirtual ? new Date(isoDateFormat) : new DateTZ(isoDateFormat, timeZone);
    const time = getAMPMFormat(dateTime);
    // For virtual services todayStoreTime becomes today user time
    const todayStoreTime = isVirtual ? new Date() : new DateTZ(new Date(), timeZone);
    const tomorrowStoreTime = DateUtils.addDays(todayStoreTime, 1);

    let dateString;

    //is today store time?
    if (DateUtils.isSameDay(dateTime, todayStoreTime)) {
        dateString = eventInProgressText ? eventInProgressText : getText('TODAY');
        //is tomorrow store time?
    } else if (DateUtils.isSameDay(dateTime, tomorrowStoreTime)) {
        dateString = getText('TOMORROW');
    } else {
        //Default date format: Fri, Jul 27, 11:00 AM
        const shortDay = DateUtils.getShortenedWeekdaysArray()[dateTime.getDay()];
        const shortMonth = DateUtils.getShortenedMonthArray()[dateTime.getMonth()];
        dateString = `${shortDay}, ${shortMonth} ${dateTime.getDate()}`;
    }

    if (!eventInProgressText) {
        dateString += `, ${time.toUpperCase()}`;
    }

    // if duration is passed, append endTime to the dateString
    // format: Fri, Jul 27, 11:00 AM - 11:30 AM
    const durationMinInt = parseInt(durationMin);

    if (durationMinInt) {
        const endDate = new DateTZ(isoDateFormat, timeZone);
        endDate.setMinutes(endDate.getMinutes() + durationMinInt);
        const endTime = getAMPMFormat(endDate);
        dateString += `${eventInProgressText ? ' ' : ' - '}${endTime.toUpperCase()}`;
    }

    if (displayTimeZone && timeZone) {
        // For TimeZone abbreviations
        const timeZoneAbbreviation = timeZone.substring(0, 3);
        dateString += ` ${timeZoneAbbreviation}`;
    }

    return dateString;
}

function getFullDateStoreFormat(isoDateFormat, timeZone, isVirtual) {
    const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Date');

    // For virtual services we need to use the user local time instead of store time
    const dateTime = isVirtual ? new Date(isoDateFormat) : new DateTZ(isoDateFormat, timeZone);

    // For virtual services todayStoreTime becomes today user time
    const todayStoreTime = isVirtual ? new Date() : new DateTZ(new Date(), timeZone);
    const tomorrowStoreTime = DateUtils.addDays(todayStoreTime, 1);

    let dateString;

    //is today store time?
    if (DateUtils.isSameDay(dateTime, todayStoreTime)) {
        dateString = getText('TODAY');
        //is tomorrow store time?
    } else if (DateUtils.isSameDay(dateTime, tomorrowStoreTime)) {
        dateString = getText('TOMORROW');
    } else {
        //Default date format: Friday, July 27, 2024
        const shortDay = DateUtils.getShortenedWeekdaysArray()[dateTime.getDay()];
        const shortMonth = DateUtils.getShortenedMonthArray()[dateTime.getMonth()];
        dateString = `${shortDay}, ${shortMonth} ${dateTime.getDate()}`;
    }

    return dateString;
}

function getFullTimeStoreFormat(isoDateFormat, timeZone, durationMin = null, isVirtual) {
    // For virtual services we need to use the user local time instead of store time
    const dateTime = isVirtual ? new Date(isoDateFormat) : new DateTZ(isoDateFormat, timeZone);
    const time = getAMPMFormat(dateTime);

    let dateString = time.toUpperCase();

    // if duration is passed, append endTime to the dateString
    // format: Fri, Jul 27, 11:00 AM - 11:30 AM
    const durationMinInt = parseInt(durationMin);

    if (durationMinInt) {
        const endDate = new DateTZ(isoDateFormat, timeZone);
        endDate.setMinutes(endDate.getMinutes() + durationMinInt);
        const endTime = getAMPMFormat(endDate);
        dateString += ' - ' + endTime.toUpperCase();
    }

    return dateString;
}

function getInitialReservationStatus(reservation) {
    if (reservation.bookingStatus && reservation.bookingStatus.toUpperCase() === ACTIVITY.BOOKING_STATUS.WAITLISTED) {
        return ACTIVITY.RESERVATION_STATUS.WAITLISTED;
    }

    // if not waitlisted, detect status by type
    return [ACTIVITY.TYPE.EVENTS, ACTIVITY.TYPE.ANNOUNCEMENTS].some(rsvpType => rsvpType === reservation.type)
        ? ACTIVITY.RESERVATION_STATUS.RSVPD
        : ACTIVITY.RESERVATION_STATUS.BOOKED;
}

function getEdpBreadcrumbs(activity) {
    const breadcrumbs = {
        items: [
            {
                displayName: ACTIVITY.SERVICE_AND_EVENTS,
                href: ACTIVITY.OLR_URLS.LANDING_PAGE
            }
        ]
    };

    if (activity.type) {
        const activityType = activity.type === ACTIVITY.TYPE.ANNOUNCEMENTS ? ACTIVITY.ANNOUNCEMENT_DISPLAY_TEXT : ACTIVITY.SEO_LABEL[activity.type];
        breadcrumbs.items.push({
            displayName: activityType,
            href: activity.type === ACTIVITY.TYPE.EVENTS ? ACTIVITY.OLR_URLS.EVENTS : `${ACTIVITY.OLR_URLS.LANDING_PAGE}?type=${activity.type}`
        });
    }

    return breadcrumbs;
}

function getEdpPageUrl(activity) {
    const location = Location.getLocation();

    return `${location.protocol}//${location.host}` + `/happening/${activity.type}/${activity.activityId}`;
}

function launchExperienceShareModal(subTitle, shareLink) {
    store.dispatch(Actions.showShareLinkModal(true, '', shareLink, subTitle));
}

// disable all days in past store time
function getDisabledDays(timeZone) {
    const today = new Date();
    const todayStoreTime = new DateTZ(today, timeZone);
    const disabledDays = [];
    let date = DateUtils.clone(today);

    while (DateUtils.isDayBefore(date, todayStoreTime)) {
        disabledDays.push(date);
        date = DateUtils.addDays(date, 1);
    }

    return disabledDays;
}

function getBookingModalDate(activityDetails, hasStoreName) {
    const showEndDate =
        activityDetails.selectedActivity.type === ACTIVITY.TYPE.EVENTS || activityDetails.selectedActivity.type === ACTIVITY.TYPE.ANNOUNCEMENTS;
    const isVirtual = activityDetails?.selectedActivity?.isVirtual;
    const selectedTimeSlot = activityDetails.selectedTimeSlot;
    const durationArg = showEndDate && selectedTimeSlot.durationMin ? selectedTimeSlot.durationMin : null;
    const dateTime = getFullDateStoreTimeFormat(selectedTimeSlot.startDateTime, activityDetails.timeZone, durationArg, isVirtual);
    const result = !hasStoreName ? dateTime : `${dateTime} at Sephora ${activityDetails.storeName}`;

    return result;
}

function getTelephoneUseAuthorization() {
    const getText = localeUtils.getLocaleResourceFile('utils/locales', 'ExperienceDetails');

    return getText('telephoneUseAuthorization');
}

function getEdpTelephoneUseAuthorization(comp) {
    const getText = resourceWrapper(localeUtils.getLocaleResourceFile('utils/locales', 'ExperienceDetails'));

    return getText('telephoneUseAuthorizationEDP', false, comp);
}

function getTextED(label, vars = []) {
    const getText = localeUtils.getLocaleResourceFile('utils/locales', 'ExperienceDetails');

    return getText(label, vars);
}

export default {
    EXPERIENCE_DEFAULT_IMAGES,
    getFirstBookableActivity,
    getAllExperiencesWithFilters,
    getAllExperiencesByStores,
    bookReservation,
    formatAPIDateTime,
    getStartDateFromParam,
    getDefaultDateTimes,
    cancelReservation,
    createReservation,
    updateReservation,
    redirectToHub,
    getFullDateStoreTimeFormat,
    getFullDateStoreFormat,
    getFullTimeStoreFormat,
    getInitialReservationStatus,
    getEdpBreadcrumbs,
    getEdpPageUrl,
    launchExperienceShareModal,
    getDisabledDays,
    getAMPMFormat,
    handleDateFormats,
    getBookingModalDate,
    getTelephoneUseAuthorization,
    getEdpTelephoneUseAuthorization,
    matchStoreOrder,
    getText: getTextED
};
