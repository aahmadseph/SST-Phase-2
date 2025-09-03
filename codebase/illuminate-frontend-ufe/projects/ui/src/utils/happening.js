import React from 'react';

import anaConsts from 'analytics/constants';

import { Link, Text } from 'components/ui';

import auth from 'utils/Authentication';
import dateUtils from 'utils/Date';
import calendarUtils from 'utils/Calendar';
import cookieUtils from 'utils/Cookies';
import experienceDetailsUtils from 'utils/ExperienceDetails';
import resourceWrapper from 'utils/framework/resourceWrapper';
import withLocationInfo from 'utils/HappeningLocation';
import isFunction from 'utils/functions/isFunction';
import javascriptUtils from 'utils/javascript';
import locationUtils from 'utils/Location';
import languageLocaleUtils from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';
import uiUtils from 'utils/UI';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';

import sdnApi from 'services/api/sdn';

import actions from 'actions/Actions';
import reduxStore from 'store/Store';

import Empty from 'constants/empty';
import { EDP_IMG_SIZES } from 'components/Content/Happening/HappeningEDP/EDPInfo/EDPMedia/constants';
import { SET_STORES_LIST, SET_CURRENT_LOCATION } from 'constants/actionTypes/events';
import { SET_HAPPENING, SET_HAPPENING_NON_CONTENT, RESET_HAPPENING_IS_INITIALIZED } from 'constants/actionTypes/happening';
import { HEADER_VALUE } from 'constants/authentication';

const { formatAPIDateTime, getEdpPageUrl } = experienceDetailsUtils;
const {
    getLocaleResourceFile,
    getCurrentLanguageCountryCode,
    getCurrentCountry,
    getCountryLongName,
    getCurrentLanguage,
    isFRCanada,
    isUS,
    COUNTRIES,
    isQuebecCanada
} = languageLocaleUtils;
const { navigateTo, getHappeningPathActivityInfo } = locationUtils;
const { getImagePath, getParams, getParamsByName, removeParam } = urlUtils;
const { showInfoModal, showInterstice } = actions;
const { dispatch } = reduxStore;
const {
    postApptReservation,
    getServiceBookingDates,
    getServiceBookingSlots,
    getActivitiesContent,
    getActivityEDPContent,
    getStoreDetailsContent,
    getUserReservations,
    getServiceBookingDetails,
    getApptConfirmationContent,
    getWaitlistBookingContent,
    getWaitlistConfirmationContent,
    getWaitlistReservationContent,
    getApptDetailsContent,
    getSeasonalContent
} = sdnApi;

const { SMUI_CAROUSEL_WIDTH, LGUI_CAROUSEL_WIDTH, ZOOM } = EDP_IMG_SIZES;
const {
    MEDIA_TYPE: { IMAGE }
} = anaConsts;

const LOCALES = {
    EN: 'en-US',
    FR: 'fr-CA'
};

const ACTIVITY_TYPES = {
    EVENTS: 'events',
    SERVICES: 'services'
};

const CALENDAR_DEFAULT_DAYS_LENGTH = 90;

function capitalizeWord(word = '') {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function getWaitListTimeOfTheDay(timeOfTheDay) {
    const getText = getLocaleResourceFile('utils/locales', 'happening');

    return getText(timeOfTheDay);
}

function buildEDPHeroImageSrc(item, isMobile = false) {
    let src = getImagePath(skuUtils.getImgSrc(ZOOM, item.media));
    const size = isMobile ? SMUI_CAROUSEL_WIDTH : LGUI_CAROUSEL_WIDTH;
    src = removeParam(src, 'pb');
    const symbol = Object.keys(getParams(src)).length ? '&' : '?';
    const imageSource = `${src + symbol}imwidth=${size}`;
    const imageSourceX2 = `${src + symbol}imwidth=${size * 2}`;

    return [imageSource, imageSourceX2];
}

function getMediaItems({ images = [], displayName = '', type = '' }) {
    const mediaListItems = images.map((item, index) => ({
        type: IMAGE,
        media: {
            ...item,
            altText: `${displayName} - ${type} image ${index + 1}`
        }
    }));

    // this helper will expnad for futere implementation of service videos

    return mediaListItems;
}

function formatArtistName(preferredName = '') {
    if (preferredName.indexOf(',') > -1) {
        let [lastName, firstName] = preferredName.split(',');

        firstName = firstName.replace(/\d/g, ''); // remove numeric characters
        firstName = capitalizeWord(firstName.trim());
        lastName = lastName.charAt(0).toLocaleUpperCase(); // return the first letter only

        return `${firstName} ${lastName}`;
    }

    return preferredName;
}

function createEventRSVP(options) {
    return postApptReservation(options).then(data => {
        const { responseStatus, confirmationNumber } = data;

        if (responseStatus !== 200 || !confirmationNumber) {
            throw new Error('Invalid Event RSVP response');
        }

        navigateTo(null, `/happening/events/confirmation/${confirmationNumber}`);
    });
}

function addToCalendar(startDateTime, duration, activityName, storeName, activity) {
    const icsUrl = calendarUtils.buildCalendarUrl(startDateTime, duration, activityName, {
        description: activityName,
        location: 'Sephora ' + storeName,
        url: getEdpPageUrl(activity)
    });

    icsUrl && urlUtils.redirectTo(icsUrl);
}

function getWaiverMediaPrefValues() {
    const waiverMediaInfo = Sephora?.configurationSettings?.waiverMediaInfo || Empty.Object;

    if (javascriptUtils.isObjectEmpty(waiverMediaInfo)) {
        return {};
    }

    const currentLanguageCountryCode = getCurrentLanguageCountryCode();
    const countryCode = getCurrentCountry();

    const prefId = waiverMediaInfo[`waiverMediaId-${countryCode}`];
    const prefName = waiverMediaInfo[`name-${currentLanguageCountryCode}`];

    return { prefId, prefName };
}

function getRebookingInfo() {
    const rebookingStoreId = getParamsByName('storeId')?.[0];
    const rebookingZipCode = getParamsByName('zipCode')?.[0];
    const rebookingArtistId = getParamsByName('artistId')?.[0];
    const rescheduleConfirmationNumber = getParamsByName('rescheduleConfirmationNumber')?.[0];
    const waitlistConfirmationNumber = getParamsByName('waitlistConfirmationNumber')?.[0];
    const startDateTime = getParamsByName('startDateTime')?.[0];
    const dayPeriod = getParamsByName('dayPeriod')?.[0];

    const waitlistInfo = waitlistConfirmationNumber && startDateTime && dayPeriod && { waitlistConfirmationNumber, startDateTime, dayPeriod };

    return {
        rebookingStoreId,
        rebookingZipCode,
        rebookingArtistId,
        rescheduleConfirmationNumber,
        waitlistInfo
    };
}

function ensureSephoraPrefix(storeName) {
    return storeName?.toLowerCase()?.startsWith('sephora') ? storeName : `Sephora ${storeName}`;
}

function buildCalendarDates(daysLength, startDate) {
    const datesList = [];

    const now = new Date();
    const currentDate = startDate ? startDate : now;

    const length = daysLength ?? CALENDAR_DEFAULT_DAYS_LENGTH;

    for (let i = 0; i < length; i++) {
        const date = dateUtils.addDays(currentDate, i);
        datesList.push(date);
    }

    return datesList;
}

function showSignInModal(cb, didUserClick) {
    const headerValue = didUserClick ? HEADER_VALUE.USER_CLICK : null;
    auth.requireAuthentication(true, null, null, null, false, headerValue)
        .then(() => isFunction(cb) && cb())
        .catch(() => {});
}

function showSignInModalWithContextOptions({ contextOptions, cb, didUserClick }) {
    const headerValue = didUserClick ? HEADER_VALUE.USER_CLICK : null;
    auth.requireAuthentication(true, null, null, null, false, headerValue, contextOptions)
        .then(() => isFunction(cb) && cb())
        .catch(() => {});
}

function showCountryMissMatchModal() {
    const getText = getLocaleResourceFile('utils/locales', 'happening');
    const getTextWithLink = resourceWrapper(getText);

    const handleClick = () => {
        setTimeout(() => uiUtils.scrollTo({ elementId: 'regionAndLanguage' }));

        return dispatch(showInfoModal({ isOpen: false }));
    };

    const countryName = isUS() ? getCountryLongName(COUNTRIES.CA) : getCountryLongName(COUNTRIES.US);

    const options = {
        isOpen: true,
        title: getText('changeCountry'),
        message: (
            <>
                <Text
                    is={'p'}
                    marginBottom={4}
                    children={getTextWithLink(
                        'changeCountryMessage',
                        false,
                        countryName,
                        <Link
                            color='blue'
                            underline
                            onClick={handleClick}
                            children={getText('bottomOfTheSite')}
                        />
                    )}
                />
                <Text
                    is={'p'}
                    children={getText('switchCountryBasketMessage', [countryName])}
                />
            </>
        ),
        buttonText: getText('ok'),
        buttonWidth: ['100%', null, 180],
        width: 2
    };

    return dispatch(showInfoModal(options));
}

/**
 *
 * @param {*} timeZone
 * @param {*} isoString
 * @param {*} customOptions
 * @param {*} isCustomWeekday
 * @returns { weekday, year, month, day, hour, minute, second, dayPeriod, isToday, isTomorrow }
 * @weekday as Today, Tomorrow or actual weekday
 * @dayPeriod as AM | PM
 * @isToday | @isTomorrow only set when @isCustomWeekday is true
 */
function getDateInTimeZoneFormattedParts(timeZone = null, isoString = null, customOptions = {}, isCustomWeekday = true) {
    const isCAFrench = isFRCanada();
    const getText = getLocaleResourceFile('utils/locales', 'Date');

    // Use the provided isoString or default to current date
    const inputDate = isoString ? new Date(isoString) : new Date();

    // Locale to format inputDate in
    const locale = isCAFrench ? LOCALES.FR : LOCALES.EN;

    // Options for formatting date and time
    const options = {
        ...(timeZone && { timeZone }),
        weekday: 'long', // e.g., Friday
        year: 'numeric', // e.g., 2024
        month: 'long', // e.g., August
        day: 'numeric', // e.g., 6
        hour: 'numeric', // e.g., 10
        minute: '2-digit', // e.g., 08
        second: '2-digit', // e.g., 06
        hour12: true, // 12-hour format returns dayPeriod as "AM or PM"
        ...customOptions
    };

    // Format the inputDate in the specified timezone and get its parts
    const parts = new Intl.DateTimeFormat(locale, options).formatToParts(inputDate);

    const dateParts = { isToday: false, isTomorrow: false };

    // Extract formatted date and time components
    for (const { type, value } of parts) {
        dateParts[type] = value;
    }

    // Override weekday returned value to Today or Tomorrow
    if (isCustomWeekday) {
        const formatInLocale = LOCALES.EN;

        const todayDate = new Date();
        const formattedToday = new Intl.DateTimeFormat(formatInLocale, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(todayDate);

        const tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const formattedTomorrow = new Intl.DateTimeFormat(formatInLocale, { year: 'numeric', month: '2-digit', day: '2-digit' }).format(tomorrowDate);

        const inputDateOptions = {
            ...(timeZone && { timeZone }),
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        };
        const formattedInputDate = new Intl.DateTimeFormat(formatInLocale, inputDateOptions).format(inputDate);

        // Determine if the formattedInputDate is equal to formattedToday or formattedTomorrow
        if (formattedInputDate === formattedToday) {
            dateParts.weekday = getText('TODAY');
            dateParts.isToday = true;
        } else if (formattedInputDate === formattedTomorrow) {
            dateParts.weekday = getText('TOMORROW');
            dateParts.isTomorrow = true;
        }
    }

    if (isCAFrench) {
        let customWeekday = dateParts.weekday.toLowerCase();
        customWeekday = customWeekday.replace('.', '');

        dateParts.weekday = customWeekday;
        dateParts.month = dateParts.month.toLowerCase();
        dateParts.dayPeriod = dateParts.dayPeriod === 'a.m.' ? 'AM' : 'PM';
    }

    return dateParts;
}

/**
 *
 * @param {*} timeZone
 * @param {*} isoString
 * @returns Date object based on (@isoString or current time) in specified @timeZone or user locale
 */
function getDateInTimeZone(timeZone, isoString) {
    const {
        year, month, day, hour, minute, second
    } = getDateInTimeZoneFormattedParts(
        timeZone,
        isoString,
        { month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false },
        false
    );

    // Construct a string representing the date and time in ISO format without timezone information
    const isoStringInTimezone = `${year}-${month}-${day}T${hour}:${minute}:${second}`;

    // Create a Date object from the ISO string in the specified timezone
    const dateInTimezone = new Date(isoStringInTimezone);

    return dateInTimezone;
}

/**
 *
 * @param {*} timeZone
 * @param {*} isoString
 * @param {*} isDateOnly
 * @returns 'Friday, August 16, 10:45 PM' | 'Friday, August 16' when @isDateOnly = true
 */
function getFormattedTimeSlot(timeZone, isoString, isDateOnly = false) {
    const {
        weekday, month, day, hour, minute, dayPeriod
    } = getDateInTimeZoneFormattedParts(timeZone, isoString);

    const monthDayPart = isFRCanada() ? `${day} ${month}` : `${month} ${day}`;
    const formattedDate = `${weekday}, ${monthDayPart}`;
    const formattedtime = `${hour}:${minute} ${dayPeriod}`;

    return isDateOnly ? formattedDate : `${formattedDate}, ${formattedtime}`;
}

/**
 *
 * @param {*} dateString
 * @param {*} timeZone
 * @returns 10:45 PM
 */
function getTimeSlotFormattedHours(isoString, timeZone) {
    const { hour, minute, dayPeriod } = getDateInTimeZoneFormattedParts(timeZone, isoString, null, false);

    return `${hour}:${minute} ${dayPeriod}`;
}

/**
 *
 * @param {*} dateString
 * @param {*} timeZone
 * @returns Tuesday, August 20, 2024
 */
function formatAppointmentDate(isoString, timeZone) {
    const { weekday, year, month, day } = getDateInTimeZoneFormattedParts(timeZone, isoString);

    const monthDayPart = isFRCanada() ? `${day} ${month}` : `${month} ${day}`;

    return `${weekday}, ${monthDayPart}, ${year}`;
}

/**
 *
 * @param {*} isoString
 * @param {*} timeZone
 * @param {*} durationMinutes
 * @param {*} isEndTimeOnly
 * @returns '9:00 AM - 9:30 AM' | '9:30 AM' when @isEndTimeOnly = true
 */
function formatAppointmentTimeFrame(isoString, timeZone, durationMinutes, isEndTimeOnly = false) {
    // Get endTimeZoneDate in the specified isoString & timeZone
    const endTimeZoneDate = getDateInTimeZone(timeZone, isoString);
    // Add the durationMinutes
    endTimeZoneDate.setMinutes(endTimeZoneDate.getMinutes() + durationMinutes);

    // Get end time parts from the specified endTimeZoneDate, no need for timeZone as it's already converted
    const { hour: endHour, minute: endMinute, dayPeriod: endDayPeriod } = getDateInTimeZoneFormattedParts(null, endTimeZoneDate, null, false);

    if (isEndTimeOnly) {
        return `${endHour}:${endMinute} ${endDayPeriod}`;
    }

    // Get start time parts from the specified isoString & timeZone
    const { hour: startHour, minute: startMinute, dayPeriod: startDayPeriod } = getDateInTimeZoneFormattedParts(timeZone, isoString, null, false);

    return `${startHour}:${startMinute} ${startDayPeriod} - ${endHour}:${endMinute} ${endDayPeriod}`;
}

/**
 *
 * @param {*} isoString
 * @param {*} timeZone
 * @param {*} durationMinutes
 * @returns Boolean
 */
function getIsEventInProgress(isoString, timeZone, durationMinutes) {
    const currentDateInTZ = getDateInTimeZone(timeZone);
    const startDateInTZ = getDateInTimeZone(timeZone, isoString);

    const endDateInTZ = getDateInTimeZone(timeZone, isoString);
    // Add the durationMinutes
    endDateInTZ.setMinutes(endDateInTZ.getMinutes() + durationMinutes);

    const isInProgress = startDateInTZ <= currentDateInTZ && currentDateInTZ <= endDateInTZ;

    return isInProgress;
}

/**
 *
 * @param {*} isoString
 * @param {*} timeZone
 * @param {*} durationMinutes
 * @param {*} isEventInProgress
 * @returns (Today|Tomorrow), 8:00 AM - 11:00 AM | Sat, Aug 31, 8:00 AM - 11:00 AM | Join us until 11:00 AM
 */
function getEventFormattedDate(isoString, timeZone, durationMinutes, isEventInProgress = false) {
    const getText = getLocaleResourceFile('utils/locales', 'happening');

    const {
        weekday, month, day, isToday, isTomorrow
    } = getDateInTimeZoneFormattedParts(timeZone, isoString, { weekday: 'short', month: 'short' });

    const timeFrame = formatAppointmentTimeFrame(isoString, timeZone, durationMinutes, isEventInProgress);

    if (isEventInProgress) {
        return `${getText('joinUsUntil')} ${timeFrame}`;
    }

    const monthDayPart = isFRCanada() ? `${day} ${month}` : `${month} ${day}`;
    const datePart = isToday || isTomorrow ? weekday : `${weekday}, ${monthDayPart}`;

    return `${datePart}, ${timeFrame}`;
}

/**
 *
 * @param {*} isoString
 * @param {*} timeZone
 * @param {*} durationMinutes
 * @param {*} isEventInProgress
 * @returns (Today|Tomorrow), 8:00 AM - 11:00 AM | Saturday, August 31, 8:00 AM - 11:00 AM
 */
function getEventFormattedFullDate(isoString, timeZone, durationMinutes) {
    const {
        weekday, month, day, isToday, isTomorrow
    } = getDateInTimeZoneFormattedParts(timeZone, isoString, null);

    const timeFrame = formatAppointmentTimeFrame(isoString, timeZone, durationMinutes);

    const monthDayPart = isFRCanada() ? `${day} ${month}` : `${month} ${day}`;
    const datePart = isToday || isTomorrow ? weekday : `${weekday}, ${monthDayPart}`;

    return `${datePart}, ${timeFrame}`;
}

/**
 *
 * @param {*} isoString
 * @param {*} timeZone
 * @returns exclusive hold until 10:00 PM on March 22, 2024
 */
function getWaitlistSpotFormattedExpiration(isoString, timeZone) {
    const getText = getLocaleResourceFile('utils/locales', 'happening');

    const {
        year, month, day, hour, minute, dayPeriod
    } = getDateInTimeZoneFormattedParts(timeZone, isoString);

    const monthDayPart = isFRCanada() ? `${day} ${month}` : `${month} ${day}`;

    return `${getText('exclusiveHoldUntil')} ${hour}:${minute} ${dayPeriod} ${getText('on')} ${monthDayPart}, ${year}`;
}

function isFutureEvent(isoString, timeZone, durationMinutes) {
    const currentDateInTZ = getDateInTimeZone(timeZone);

    const endDateInTZ = getDateInTimeZone(timeZone, isoString);
    // Add the durationMinutes
    endDateInTZ.setMinutes(endDateInTZ.getMinutes() + durationMinutes);

    return currentDateInTZ <= endDateInTZ;
}

/**
 *
 * @param {*} ymdString in format YYYY-MM-DD
 * @returns Date
 */
function getDateFromYMD(ymdString) {
    const [year, m, day] = ymdString.split('-').map(s => parseInt(s, 10));
    const month = m - 1; // Month (0-based index)

    return new Date(year, month, day);
}

/**
 *
 * @param {*} from
 * @param {*} to
 * @returns [Dates]
 */
function buildDatesRange(from, to) {
    const datesRange = [];
    const fromDate = new Date(from);

    // Add the first date to the array
    datesRange.push(new Date(fromDate));

    // Continue adding dates until we reach the 'to' date
    // eslint-disable-next-line no-unmodified-loop-condition
    while (fromDate < to) {
        fromDate.setDate(fromDate.getDate() + 1);
        datesRange.push(new Date(fromDate));
    }

    return datesRange;
}

/**
 *
 * @param {*} storeHours
 * @returns [0, 1, moreWeekdayNumbers...]
 */
function getStoreClosedDays(storeHours) {
    const storeWeekdaysMap = {
        sundayHours: 0,
        mondayHours: 1,
        tuesdayHours: 2,
        wednesdayHours: 3,
        thursdayHours: 4,
        fridayHours: 5,
        saturdayHours: 6
    };

    const closedDays = [];

    // Loop through the keys in storeWeekdaysMap
    for (const day in storeWeekdaysMap) {
        // Check if the day is not present in storeHours
        if (!Object.hasOwn(storeHours, day) || storeHours[day] == null) {
            // Add the day to the closedDays array
            closedDays.push(storeWeekdaysMap[day]);
        }
    }

    return closedDays;
}

/**
 *
 * @param {*} caledarDates[]
 * @param {*} selectedStore
 * @returns Date[]
 */
function getStoreClosedDates(caledarDates, selectedStore) {
    const storeHours = selectedStore?.storeHours || Empty.Object;
    const specialHours = storeHours?.specialHours || Empty.Array;

    // Get actual weekdays the store is closed
    const storeClosedDays = getStoreClosedDays(storeHours);

    // Filter the caledarDates that fall on the specified storeClosedDays
    const storeClosedDaysOnCalendarDates = storeClosedDays.length
        ? caledarDates.filter(date => storeClosedDays.includes(date.getDay()))
        : Empty.Array;

    // Build closed dates from specialHours startDate and endDate range
    const storeSpecialHoursDates = specialHours.length
        ? specialHours.reduce((datesArr, { startDate, endDate, storeHours: storeOpenHours }) => {
            // if storeHours is null means store is closed
            if (!storeOpenHours) {
                return [...datesArr, ...buildDatesRange(getDateFromYMD(startDate), getDateFromYMD(endDate))];
            }

            return datesArr;
        }, [])
        : Empty.Array;

    return [...storeClosedDaysOnCalendarDates, ...storeSpecialHoursDates];
}

/**
 *
 * @param {*} isoString
 * @param {*} timeZone
 * @returns Number
 */
function getHoursDifference(isoString, timeZone) {
    const currentDateInTZ = getDateInTimeZone(timeZone);
    const startDateInTZ = getDateInTimeZone(timeZone, isoString);

    const timeDifference = startDateInTZ - currentDateInTZ;
    const oneHourInMs = 1000 * 60 * 60;
    const hoursDifference = Math.floor(timeDifference / oneHourInMs);

    return hoursDifference;
}

/**
 *
 * @param {*} startDateTime
 * @param {*} timeZone
 * @returns Boolean
 */
function isEventStillUpcoming(isoString, timeZone) {
    const currentDateInTZ = getDateInTimeZone(timeZone);
    const currentDateInTZEpoch = currentDateInTZ.getTime();

    const startDateInTZ = getDateInTimeZone(timeZone, isoString);
    const startDateInTZEpoch = startDateInTZ.getTime();

    const isStillAvailable = currentDateInTZEpoch < startDateInTZEpoch;

    return isStillAvailable;
}

/**
 * @param {*} address
 * @returns boolean
 */
function isQuebec(address) {
    const { country, state } = address || Empty.Object;
    const isQuebecCookie = Boolean(cookieUtils.read(cookieUtils.KEYS.QUEBEC_YES));

    return isQuebecCookie || isQuebecCanada(country, state);
}

/**
 *
 * @param {*} getState
 * @returns  { isSignedIn, email }
 */
function getUserStatusData(getState) {
    const authData = getState().auth;
    const isSignedIn = userUtils.isSignedIn(authData);

    const user = getState().user;
    const email = user.login || user.email;

    return {
        isSignedIn,
        email
    };
}

/**
 *
 * @returns { country, language, activityId, activityType }
 */
function getCommonApiOptions() {
    const country = getCurrentCountry();
    const language = getCurrentLanguage();
    const { activityId, activityType } = locationUtils.getHappeningPathActivityInfo();

    return {
        country,
        language,
        ...(activityId && { activityId }),
        ...(activityType && { activityType })
    };
}

/**
 * Array of Happening API endpoints and actionTypes map
 * Objects must be in the following shape:
 * { pathRegex, actionType, getEndpointData, hasCompactHeaderAndFooter? }
 */
const API_ENDPOINTS_BY_PATH = [
    {
        pathRegex: /\/happening\/(events|services)$/,
        actionType: SET_HAPPENING,
        getEndpointData: async () => {
            return new Promise(resolve => {
                withLocationInfo(async (storeId, zipCode, storesList) => {
                    const options = {
                        ...getCommonApiOptions(),
                        storeId,
                        zipCode
                    };

                    const response = await getActivitiesContent(options);

                    const shouldPreDispatch = options?.activityType === ACTIVITY_TYPES.EVENTS && response?.data;

                    if (shouldPreDispatch) {
                        dispatch({
                            type: SET_STORES_LIST,
                            payload: storesList
                        });
                        dispatch({
                            type: SET_CURRENT_LOCATION,
                            payload: {
                                display: zipCode,
                                storeId
                            }
                        });
                    }

                    resolve(response?.data);
                });
            });
        }
    },
    {
        pathRegex: /\/happening\/stores\/\S+/,
        actionType: SET_HAPPENING,
        getEndpointData: async () => {
            const options = getCommonApiOptions();
            const response = await getStoreDetailsContent(options);

            return response?.data;
        }
    },
    {
        pathRegex: /\/happening\/(events|services)\/\b(?!(booking|confirmation|OLR.*|sephora-near-me))\b(\S+-activity-)?\S+/,
        actionType: SET_HAPPENING,
        getEndpointData: async (queryParams, getState) => {
            let options = getCommonApiOptions();

            if (options.activityType === ACTIVITY_TYPES.EVENTS) {
                const { storeId, zipCode } = queryParams;
                const { email } = getUserStatusData(getState);

                options = {
                    ...options,
                    storeId: storeId?.[0],
                    zipCode: zipCode?.[0],
                    ...(email && { email })
                };
            }

            const response = await getActivityEDPContent(options);

            return response?.data;
        }
    },
    {
        pathRegex: /\/happening\/services\/booking\/\S+/,
        actionType: SET_HAPPENING_NON_CONTENT,
        getEndpointData: async queryParams => {
            return new Promise(resolve => {
                withLocationInfo(async (storeId, zipCode) => {
                    const { storeId: rebookingStoreId, zipCode: rebookingZipCode } = queryParams;
                    const options = {
                        ...getCommonApiOptions(),
                        zipCode: rebookingZipCode?.[0] || zipCode,
                        selectedStoreId: rebookingStoreId?.[0] || storeId
                    };

                    const data = await getServiceBookingDetails(options);

                    resolve(data);
                });
            });
        }
    },
    {
        pathRegex: /\/happening\/(events|services)\/confirmation\/\S+/,
        actionType: SET_HAPPENING,
        getEndpointData: async () => {
            const options = getCommonApiOptions();
            const shouldCallWithLocationInfo = options?.activityType === ACTIVITY_TYPES.EVENTS;

            if (!shouldCallWithLocationInfo) {
                const response = await getApptConfirmationContent(options);

                return response?.data;
            }

            return new Promise(resolve => {
                withLocationInfo(async (_, zipCode) => {
                    const response = await getApptConfirmationContent({ ...options, zipCode });

                    resolve(response?.data);
                });
            });
        }
    },
    {
        pathRegex: /\/happening\/waitlist\/booking\/\S+/,
        actionType: SET_HAPPENING_NON_CONTENT,
        getEndpointData: async (_, getState) => {
            const { isRequestAppointmentEnabled } = Sephora.configurationSettings;

            if (!isRequestAppointmentEnabled) {
                // if we set data to null here then openPage > onError method will get triggered
                // then user is redirected to error page
                return Promise.resolve(null);
            }

            const { isSignedIn } = getUserStatusData(getState);

            if (isSignedIn) {
                const options = getCommonApiOptions();
                const data = await getWaitlistBookingContent(options);

                return data;
            }

            return Promise.resolve({ isDefaultData: true });
        },
        hasCompactHeaderAndFooter: true
    },
    {
        pathRegex: /\/happening\/waitlist\/confirmation\/\S+/,
        actionType: SET_HAPPENING,
        getEndpointData: async () => {
            const { isRequestAppointmentEnabled } = Sephora.configurationSettings;

            if (!isRequestAppointmentEnabled) {
                // if we set data to null here then openPage > onError method will get triggered
                // then user is redirected to error page
                return Promise.resolve(null);
            }

            const options = getCommonApiOptions();
            const response = await getWaitlistConfirmationContent(options);

            return response?.data;
        }
    },
    {
        pathRegex: /\/happening\/waitlist\/reservation\/\S+/,
        actionType: SET_HAPPENING,
        getEndpointData: async () => {
            const { isRequestAppointmentEnabled } = Sephora.configurationSettings;

            if (!isRequestAppointmentEnabled) {
                // if we set data to null here then openPage > onError method will get triggered
                // then user is redirected to error page
                return Promise.resolve(null);
            }

            const options = getCommonApiOptions();
            const response = await getWaitlistReservationContent(options);

            return response?.data;
        }
    },
    {
        pathRegex: /\/happening\/reservations$/,
        actionType: SET_HAPPENING_NON_CONTENT,
        getEndpointData: async (_, getState) => {
            const { isSignedIn, email } = getUserStatusData(getState);

            if (isSignedIn && email) {
                const options = {
                    ...getCommonApiOptions(),
                    email
                };

                const response = await getUserReservations(options);

                return { UPCOMING: response?.data || Empty.Array };
            }

            return Promise.resolve({ isDefaultData: true });
        }
    },
    {
        pathRegex: /\/happening\/reservations\/confirmation$/,
        actionType: SET_HAPPENING,
        getEndpointData: async queryParams => {
            const { id, zipCode, country } = queryParams;

            const options = {
                ...getCommonApiOptions(),
                confirmationNumber: id?.[0],
                zipCode: zipCode?.[0],
                reservationCountry: country?.[0]
            };

            const response = await getApptDetailsContent(options);

            dispatch({ type: RESET_HAPPENING_IS_INITIALIZED });

            return response?.data;
        }
    },
    {
        pathRegex: /\/happening\/seasonal$/,
        actionType: SET_HAPPENING,
        getEndpointData: async () => {
            return new Promise(resolve => {
                withLocationInfo(async (_, zipCode) => {
                    const options = {
                        ...getCommonApiOptions(),
                        zipCode
                    };

                    const response = await getSeasonalContent(options);

                    resolve(response?.data);
                });
            });
        }
    }
];

// Function to determine the correct API endpoint based on path
function getApiEndpointInfo(path) {
    for (const { pathRegex, ...apiEndpoint } of API_ENDPOINTS_BY_PATH) {
        if (pathRegex.test(path)) {
            return {
                isAvailable: true,
                ...apiEndpoint
            };
        }
    }

    return { isAvailable: false };
}

/**
 *
 * @param {*} getState
 * @param {*} newLocation
 * @returns { data, actionType }
 */
async function getDataForSPANavigation(getState, newLocation, setCompactHeaderAndFooter) {
    const { path, queryParams } = newLocation || Empty.Object;
    const { getEndpointData, actionType, hasCompactHeaderAndFooter, isAvailable } = getApiEndpointInfo(path);

    if (!isAvailable) {
        throw Error(`No valid endpoint was found for a happening route pattern on path: ${path}`);
    }

    // pre-dispatch here SET_COMPACT_HEADER_FOOTER on SPA page load
    dispatch(setCompactHeaderAndFooter(!!hasCompactHeaderAndFooter));

    const data = await getEndpointData(queryParams, getState);

    return { data, actionType };
}

async function getArtistsAvailabilityDates({ storeId }) {
    try {
        const { country, language } = Sephora.renderQueryParams;
        const { activityId: bookingId } = getHappeningPathActivityInfo();
        const data = await getServiceBookingDates({ country, language, bookingId, storeId });

        return data;
    } catch (error) {
        Sephora.logger.error('Error fetching availability dates:', error);

        return null;
    }
}

async function getArtistsAvailabilitySlots({ storeId, timeZone }, selectedDate, resourceIds, showLoader = true) {
    showLoader && dispatch(showInterstice(true));

    try {
        const { activityId: bookingId } = getHappeningPathActivityInfo();

        const startDateTime = formatAPIDateTime(selectedDate, timeZone);
        const endDateTime = formatAPIDateTime(selectedDate, timeZone, true);

        const data = await getServiceBookingSlots({
            bookingId,
            storeId,
            resourceIds,
            startDateTime,
            endDateTime
        });

        return data;
    } catch (error) {
        Sephora.logger.error('Error fetching availability slots:', error);

        return null;
    } finally {
        showLoader && dispatch(showInterstice(false));
    }
}

/**
 * Checks if the given day is within the next 90 days from today.
 * @param {Date} day - The day to check.
 * @param {number} daysRange - The number of days to check for.
 * @returns {boolean} - True if the date is within the next 90 days, false otherwise.
 */
function isWithinCalendarRange(day, daysRange = CALENDAR_DEFAULT_DAYS_LENGTH) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ninetyDaysFromToday = new Date();
    ninetyDaysFromToday.setDate(today.getDate() + daysRange);

    return day >= today && day <= ninetyDaysFromToday;
}

function showYouFoundAnotherTimeModal(waitlistInfo, timeZone, callback) {
    const getText = getLocaleResourceFile('utils/locales', 'happening');
    const { startDateTime, dayPeriod } = waitlistInfo || Empty.Object;

    const options = {
        isOpen: true,
        title: getText('youFoundAnotherTime'),
        message: getText('doYouWantToCancelPrevWaitlistAppt', [formatAppointmentDate(startDateTime, timeZone), getText(dayPeriod)]),
        buttonText: getText('yesCancel'),
        cancelText: getText('no'),
        showCancelButtonLeft: true,
        callback,
        cancelCallback: callback
    };

    return dispatch(showInfoModal(options));
}

function getFormattedStoreAddress(address = Empty.Object) {
    const addressString = [];

    const addressKeys = ['address1', 'address2', 'city', 'state', 'postalCode'];

    for (const key of addressKeys) {
        if (Object.hasOwn(address, key)) {
            const value = address[key];

            if (value) {
                addressString.push(value);
            }
        }
    }

    return addressString.join(', ');
}

export {
    buildEDPHeroImageSrc,
    getMediaItems,
    getIsEventInProgress,
    formatAppointmentDate,
    formatArtistName,
    createEventRSVP,
    getArtistsAvailabilityDates,
    getArtistsAvailabilitySlots,
    getHoursDifference,
    addToCalendar,
    isFutureEvent,
    getWaiverMediaPrefValues,
    getRebookingInfo,
    isEventStillUpcoming,
    ensureSephoraPrefix,
    buildCalendarDates,
    getTimeSlotFormattedHours,
    showSignInModal,
    showSignInModalWithContextOptions,
    showCountryMissMatchModal,
    getFormattedTimeSlot,
    formatAppointmentTimeFrame,
    getDateFromYMD,
    buildDatesRange,
    getEventFormattedDate,
    getEventFormattedFullDate,
    getWaitlistSpotFormattedExpiration,
    isQuebec,
    getUserStatusData,
    getDataForSPANavigation,
    getStoreClosedDates,
    getWaitListTimeOfTheDay,
    isWithinCalendarRange,
    showYouFoundAnotherTimeModal,
    getFormattedStoreAddress
};
