import dateUtils from 'utils/Date';
import localeUtils from 'utils/LanguageLocale';
import DateTZ from 'utils/DateTZ';

function formatHours(hours) {
    return hours.split('-').map(hour => {
        const time = hour.replace(/ /g, '').replace(/[AP]/, ' $&');
        const [hourPart, minPeriodPart] = time.split(':');
        const formattedHour = parseInt(hourPart, 10).toString(); // Remove leading zero

        return `${formattedHour}:${minPeriodPart}`;
    });
}

function formatHoursRange(hours) {
    const hoursArray = hours ? formatHours(hours) : [];

    return hoursArray.length > 1 ? hoursArray.join(' - ') : hoursArray[0];
}

function getStoreClosingTime({ storeHours }) {
    return formatHoursRange(storeHours.split('-')[1]);
}

function getStoreHoursDisplayArray(storeHours, isCurbsideHours) {
    const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Date');
    const getHoursInfoText = localeUtils.getLocaleResourceFile(
        'components/Content/Happening/StoreDetails/HoursInformation/locales',
        'HoursInformation'
    );
    const SHORTENED_DAYS = getText('SHORTENED_DAYS');
    const closedMessage = isCurbsideHours ? getHoursInfoText('unavailable') : getHoursInfoText('storeClosed');
    let hoursArray = [
        {
            day: SHORTENED_DAYS[1],
            hours: storeHours.mondayHours || closedMessage
        },
        {
            day: SHORTENED_DAYS[2],
            hours: storeHours.tuesdayHours || closedMessage
        },
        {
            day: SHORTENED_DAYS[3],
            hours: storeHours.wednesdayHours || closedMessage
        },
        {
            day: SHORTENED_DAYS[4],
            hours: storeHours.thursdayHours || closedMessage
        },
        {
            day: SHORTENED_DAYS[5],
            hours: storeHours.fridayHours || closedMessage
        },
        {
            day: SHORTENED_DAYS[6],
            hours: storeHours.saturdayHours || closedMessage
        },
        {
            day: SHORTENED_DAYS[0],
            hours: storeHours.sundayHours || closedMessage
        }
    ];

    //Only have storeHours that exist in hoursArray
    hoursArray = hoursArray.filter(day => !!day.hours);

    if (hoursArray.length === 0) {
        return null;
    }

    //Determine shared hours and how we will display it.
    //I.E. Mon - Fri: 8:00 AM - 8:00 PM
    let currentHours = hoursArray[0].hours;
    let firstDay = hoursArray[0].day;
    let lastDay;
    const storeHoursDisplay = [];
    let display;

    for (let i = 1; i < hoursArray.length; i++) {
        let isClosed = hoursArray[i - 1]?.hours === closedMessage;

        if (hoursArray[i].hours === currentHours) {
            lastDay = hoursArray[i].day;
        } else {
            display = {
                label: lastDay ? `${firstDay} - ${lastDay}` : firstDay,
                value: isClosed ? currentHours : formatHoursRange(currentHours)
            };
            storeHoursDisplay.push(display);

            firstDay = hoursArray[i].day;
            lastDay = null;
            currentHours = hoursArray[i].hours;
        }

        //if we are on Sunday store hours push data to storeHoursDisplay array
        if (i === hoursArray.length - 1) {
            isClosed = hoursArray[i].hours === closedMessage;
            display = {
                label: lastDay ? `${firstDay} - ${lastDay}` : firstDay,
                value: isClosed ? currentHours : formatHoursRange(currentHours)
            };

            storeHoursDisplay.push(display);
        }
    }

    return storeHoursDisplay;
}

function isCurbsideEnabled(store, otherFlags = {}) {
    const flags = [store?.isBopisable, store?.isCurbsideEnabled, ...Object.values(otherFlags)];

    return flags.every(Boolean);
}

function formatTwentyFourHours(timeHours) {
    const amPm = timeHours.split(':')[1]?.slice(2);
    const hours = Number(timeHours.split(':')[0]);

    if (hours === 12) {
        return hours;
    } else if (amPm === 'PM') {
        return hours + 12;
    } else {
        return hours;
    }
}

function isStoreClosed({ storeHours, timeZone }) {
    if (!storeHours) {
        return true;
    }

    const [openingTime, closingTime] = storeHours.split('-');

    const todayOpeningHours = formatTwentyFourHours(openingTime);
    const todayOpeningMins = openingTime.split(':')[1]?.slice(0, 2);

    const todayClosingHours = formatTwentyFourHours(closingTime);
    const todayClosingMins = closingTime.split(':')[1]?.slice(0, 2);

    // Ideally the ultimate absolute UTC would be getting *now* from an API request
    // instead of deriving it from the users's computer
    const rawNowTZ = new DateTZ(new Date(), timeZone)._timeZoneTime;

    const openingTimeDateTZ = new Date(rawNowTZ);
    openingTimeDateTZ.setHours(todayOpeningHours);
    openingTimeDateTZ.setMinutes(todayOpeningMins);
    openingTimeDateTZ.setSeconds(0);

    const closingTimeDateTZ = new Date(rawNowTZ);
    closingTimeDateTZ.setHours(todayClosingHours);
    closingTimeDateTZ.setMinutes(todayClosingMins);
    closingTimeDateTZ.setSeconds(0);

    const openingTimeEpoch = openingTimeDateTZ.getTime();
    const closingTimeEpoch = closingTimeDateTZ.getTime();

    const nowTZ = new Date(rawNowTZ);
    const nowEpoch = nowTZ.getTime();

    const isOpen = nowEpoch > openingTimeEpoch && nowEpoch < closingTimeEpoch;
    const isClosed = nowEpoch < openingTimeEpoch || nowEpoch > closingTimeEpoch;

    return isClosed || !isOpen;
}

function getTodaySpacialStoreHours({ specialHours = [] }, timeZone) {
    const todayDate = new DateTZ(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), timeZone)._timeZoneTime;

    const todaySpecialHours = specialHours?.find(hoursDetail => {
        const [fromYear, fromMonth, fromDay] = hoursDetail.startDate.split('-');
        const [toYear, toMonth, toDay] = hoursDetail.endDate.split('-');
        const dateFrom = new DateTZ(new Date(fromYear, fromMonth - 1, fromDay), timeZone)._timeZoneTime;
        dateFrom.setHours(0, 0, 0, 0);
        const dateTo = new DateTZ(new Date(toYear, toMonth - 1, toDay), timeZone)._timeZoneTime;
        dateTo.setHours(23, 59, 59, 999);

        return dateFrom <= todayDate && dateTo >= todayDate;
    });

    return todaySpecialHours;
}

function isCurbsideAvailable({ curbsideHours, timeZone }) {
    if (!curbsideHours.storeHours) {
        return false;
    }

    return !isStoreClosed({ ...curbsideHours, timeZone });
}

const getSpecialHoursStatus = specialStoreHours => {
    const getText = localeUtils.getLocaleResourceFile('components/Content/Happening/StoreDetails/HoursInformation/locales', 'HoursInformation');

    if (specialStoreHours?.storeHours) {
        // Case 1: Special hours exist
        const storeHours = formatHoursRange(specialStoreHours.storeHours);

        return {
            value: storeHours,
            valueColor: 'black'
        };
    }

    // Case: Special reasons exist
    if (specialStoreHours?.reason) {
        return {
            value: specialStoreHours.reason,
            valueColor: 'red'
        };
    }

    // Case: Store Temporarily Closed
    return {
        value: getText('tempClosed'),
        valueColor: 'red'
    };
};

const getSpecialCurbsideHoursStatus = specialStoreHours => {
    const getText = localeUtils.getLocaleResourceFile('components/Content/Happening/StoreDetails/HoursInformation/locales', 'HoursInformation');

    if (specialStoreHours?.storeHours) {
        // Case: Special store hours exist
        const storeHours = formatHoursRange(specialStoreHours.storeHours);

        return {
            value: storeHours,
            valueColor: 'black'
        };
    }

    return {
        value: getText('unavailable'),
        valueColor: 'red'
    };
};

function sortByStartDate(arr) {
    return arr.slice().sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);

        // Handle invalid dates by placing them at the end
        const isValidDateA = !isNaN(dateA);
        const isValidDateB = !isNaN(dateB);

        if (!isValidDateA && !isValidDateB) {
            return 0;
        } // Both are invalid

        if (!isValidDateA) {
            return 1;
        } // 'a' is invalid, goes after 'b'

        if (!isValidDateB) {
            return -1;
        } // 'b' is invalid, goes after 'a'

        // Compare valid dates
        return dateA - dateB;
    });
}

function getSpecialHours(specialHoursArr = [], timeZone, isCurbsideSpecialHours = false) {
    return sortByStartDate(specialHoursArr).reduce((acc, curr) => {
        const startDate = new Date(curr.startDate.split('-').join(','));
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(curr.endDate.split('-').join(','));
        endDate.setHours(23, 59, 59, 999);

        const startMonth = startDate.getMonth() + 1;
        const startDay = startDate.getDate();

        endDate.setDate(endDate.getDate());

        const endMonth = endDate.getMonth() + 1;
        const endDay = endDate.getDate();

        const { value, valueColor } = isCurbsideSpecialHours ? getSpecialCurbsideHoursStatus(curr, timeZone) : getSpecialHoursStatus(curr, timeZone);

        acc.push({
            label:
                curr.startDate === curr.endDate
                    ? `${dateUtils.getShortenedMonth(endMonth)} ${endDay}`
                    : `${dateUtils.getShortenedMonth(startMonth)} ${startDay} - ${dateUtils.getShortenedMonth(endMonth)} ${endDay}`,
            value,
            valueColor
        });

        return acc;
    }, []);
}

function isStoreTypeKohls(store = {}) {
    const { storeType } = store;

    return storeType === 'SIKLS';
}

function getCurbsideHoursStatus(curbsideHours, storeHours, timeZone) {
    const getText = localeUtils.getLocaleResourceFile('components/Content/Happening/StoreDetails/HoursInformation/locales', 'HoursInformation');

    const status = {
        label: getText('curbsideHours'),
        isTitle: true
    };
    // Special hours exist for today

    const todaySecialCurbsidehours = getTodaySpacialStoreHours(curbsideHours, timeZone);

    if (todaySecialCurbsidehours) {
        const curbsideStoreHours = { curbsideHours: { storeHours: todaySecialCurbsidehours?.storeHours }, timeZone };
        const isAvailable = isCurbsideAvailable(curbsideStoreHours);

        if (todaySecialCurbsidehours?.storeHours && isAvailable) {
            // Case: Special Store Hours are defined and it's open
            const closeHour = getStoreClosingTime(todaySecialCurbsidehours);

            return {
                ...status,
                value: getText('availableUntil', [closeHour]),
                valueColor: 'green'
            };
        }

        // Curbside pickup not available for today
        return {
            ...status,
            value: getText('unavailable'),
            valueColor: 'red'
        };
    }

    const todaySpecialHours = getTodaySpacialStoreHours(storeHours, timeZone);

    if (todaySpecialHours) {
        if (todaySpecialHours?.storeHours && !isStoreClosed({ ...todaySpecialHours, timeZone })) {
            // Case: Special Store Hours are defined and it's open
            const closeHour = getStoreClosingTime(todaySpecialHours);

            return {
                ...status,
                value: getText('availableUntil', [closeHour]),
                valueColor: 'green'
            };
        }

        // Case: Other special reasons
        return {
            ...status,
            value: getText('unavailable'),
            valueColor: 'red'
        };
    }

    const todayDay = dateUtils.getDayOfWeek(new DateTZ(new Date(), timeZone)._timeZoneTime) + 'Hours';

    const currentDayHours = curbsideHours[todayDay];

    // Check if curbside pickup is available for today
    const curbsideStoreHours = { curbsideHours: { storeHours: currentDayHours }, timeZone };
    const isAvailable = isCurbsideAvailable(curbsideStoreHours);

    if (currentDayHours && isAvailable) {
        const closeHour = getStoreClosingTime({ storeHours: currentDayHours });

        return {
            ...status,
            value: getText('availableUntil', [closeHour]),
            valueColor: 'green'
        };
    }

    // Curbside pickup not available for today
    return {
        ...status,
        value: getText('unavailable'),
        valueColor: 'red'
    };
}

function getStoreStatus(storeHours, timeZone) {
    const getText = localeUtils.getLocaleResourceFile('components/Content/Happening/StoreDetails/HoursInformation/locales', 'HoursInformation');
    const todaySpecialHours = getTodaySpacialStoreHours(storeHours, timeZone);

    const status = {
        label: getText('storeHours'),
        isTitle: true
    };

    if (todaySpecialHours) {
        // Special hours exist
        if (todaySpecialHours?.storeHours) {
            if (!isStoreClosed({ ...todaySpecialHours, timeZone })) {
                // Case: Special Store Hours are defined and it's open
                const closeHour = getStoreClosingTime(todaySpecialHours);

                return {
                    ...status,
                    value: getText('openUntil', [closeHour]),
                    valueColor: 'green'
                };
            } else {
                return {
                    ...status,
                    value: getText('storeClosed'),
                    valueColor: 'red'
                };
            }
        }

        if (todaySpecialHours?.startDate && todaySpecialHours?.endDate) {
            return {
                ...status,
                value: getText('storeClosed'),
                valueColor: 'red'
            };
        }

        if (todaySpecialHours?.reason) {
            // Case: Special reasons exist
            return {
                ...status,
                value: todaySpecialHours.reason,
                valueColor: 'red'
            };
        }

        // Store is closed for the day
        return {
            ...status,
            value: getText('tempClosed'),
            valueColor: 'red'
        };
    }

    // Normal operating hours
    const todayDay = dateUtils.getDayOfWeek(new DateTZ(new Date(), timeZone)._timeZoneTime) + 'Hours';

    const currentDayHours = storeHours[todayDay];

    if (currentDayHours && !isStoreClosed({ storeHours: currentDayHours, timeZone })) {
        const closeHour = getStoreClosingTime({ storeHours: currentDayHours });

        return {
            ...status,
            value: getText('openUntil', [closeHour]),
            valueColor: 'green'
        };
    }

    // Store is closed for the day
    return {
        ...status,
        value: getText('storeClosed'),
        valueColor: 'red'
    };
}

const getStoreHoursDisplay = store => {
    const { storeHours, curbsideHours, timeZone } = store;

    const hours = {
        storeHoursDisplay: [],
        curbsideHoursDisplay: []
    };

    if (Object.keys(storeHours).length) {
        const hoursHeader = getStoreStatus(storeHours, timeZone);
        const storeHoursDisplay = getStoreHoursDisplayArray(storeHours);
        hours.storeHoursDisplay = [hoursHeader, ...storeHoursDisplay];
    }

    if (Object.keys(curbsideHours).length) {
        const hoursHeader = getCurbsideHoursStatus(curbsideHours, storeHours, timeZone);
        const curbsideHoursDisplay = getStoreHoursDisplayArray(curbsideHours, true);
        hours.curbsideHoursDisplay = [hoursHeader, ...curbsideHoursDisplay];
    }

    return hours;
};

const getSpecialStoreHours = store => {
    const getText = localeUtils.getLocaleResourceFile('components/Content/Happening/StoreDetails/HoursInformation/locales', 'HoursInformation');
    const { storeHours, curbsideHours, timeZone } = store;
    const specialHours = {
        specialStoreHours: [],
        curbsideSpecialStoreHours: []
    };

    if (storeHours?.specialHours?.length) {
        const specialStoreHours = getSpecialHours(storeHours.specialHours, timeZone);

        if (specialStoreHours?.length) {
            const rangeHeader = { label: getText('specialStoreHours'), isTitle: true };
            specialHours.specialStoreHours = [rangeHeader, ...specialStoreHours];
        }
    }

    if (curbsideHours?.specialHours?.length) {
        const curbsideSpecialStoreHours = getSpecialHours(curbsideHours.specialHours, timeZone, true);

        if (curbsideSpecialStoreHours?.length) {
            const rangeHeader = { label: getText('specialCurbsideHours'), isTitle: true };
            specialHours.curbsideSpecialStoreHours = [rangeHeader, ...curbsideSpecialStoreHours];
        }
    }

    return specialHours;
};

const getStoreSpecialMessage = (storeSpecialMessage, isKohlsStore) => {
    if (isKohlsStore) {
        const getText = localeUtils.getLocaleResourceFile('components/Content/Happening/StoreDetails/HoursInformation/locales', 'HoursInformation');

        return [
            {
                message: storeSpecialMessage || '',
                color: 'red'
            },
            {
                message: getText('kohlMessage'),
                color: 'black'
            }
        ];
    }

    if (!storeSpecialMessage) {
        return [];
    }

    return [
        {
            message: storeSpecialMessage,
            color: 'red'
        }
    ];
};

export default {
    isStoreTypeKohls,
    isCurbsideEnabled,
    getStoreHoursDisplay,
    getSpecialStoreHours,
    getStoreSpecialMessage,
    getStoreStatus
};
