import languageLocaleUtils from 'utils/LanguageLocale';

const { isCanada, getLocaleResourceFile } = languageLocaleUtils;

const getAccessPointModalText = getLocaleResourceFile('components/Checkout/Shared/AccessPointButton/AccessPointModal/locales', 'AccessPointModal');
const getFetchLocationHoursText = getLocaleResourceFile('components/SharedComponents/AccessPoint/FetchLocationHours/locales', 'FetchLocationHours');

function getCurrentDayOfWeek() {
    // Returns number Sunday - Saturday : 0 - 6
    // SDN Sunday is mapped as #7
    const date = new Date();
    const weekDay = date.getDay();
    const sundaySDN = 7;

    return weekDay === 0 ? sundaySDN : weekDay;
}

function hasOpeningTimes(operatingHours = []) {
    return operatingHours.every(t => t.openAt !== null && t.closeAt !== null);
}

function formatAmPmHours(time) {
    // 08:00:00 --> 08:00 AM
    // 19:00:00 --> 09:00 PM
    if (!time) {
        return '';
    }

    const padded = (value, max = 2, fill = '0') => {
        return String(value).padStart(max, fill);
    };
    const hours = Number(time.split(':')[0]);
    const minutes = Number(time.split(':')[1]);

    if (hours === 12) {
        return `${hours}:${padded(minutes)} ${getAccessPointModalText('PM')}`;
    } else if (hours > 12 && hours < 24) {
        return `${padded(hours - 12)}:${padded(minutes)} ${getAccessPointModalText('PM')}`;
    } else {
        return `${padded(hours)}:${padded(minutes)} ${getAccessPointModalText('AM')}`;
    }
}

function getOpensTillTime(operatingHours = []) {
    return formatAmPmHours(operatingHours.find(day => day?.dayType === getCurrentDayOfWeek())?.closeAt);
}

function splitAndPadZipCode(zipcode) {
    // pad with 0 to 5 digit zipcode as per API requirement
    return zipcode ? (!isCanada() ? String(zipcode).split('-')[0].padStart(5, '0') : zipcode) : null;
}

function getZipCode({ order = {}, user = {} }) {
    const defaultShipAddressZipCode = splitAndPadZipCode(order?.addressList?.find(address => address?.isDefault)?.postalCode);
    const orderShipAddressZipCode = splitAndPadZipCode(
        order?.orderDetails?.shippingGroups?.shippingGroupsEntries[0]?.shippingGroup?.address?.postalCode
    );
    const preferredStoreZipCode = splitAndPadZipCode(user?.preferredStoreInfo?.address?.postalCode);
    const preferredZipCode = splitAndPadZipCode(user?.preferredZipCode);

    return defaultShipAddressZipCode || orderShipAddressZipCode || preferredStoreZipCode || preferredZipCode || null;
}

function getLocationHoursText(operatingHours = []) {
    const todaysLocationHours = hasOpeningTimes(operatingHours) ? operatingHours.find(day => day?.dayType === getCurrentDayOfWeek()) : null;
    const locationHoursText = todaysLocationHours
        ? `${getFetchLocationHoursText('todaysLocationHours')} ${formatAmPmHours(todaysLocationHours.openAt)} - ${formatAmPmHours(
            todaysLocationHours.closeAt
        )}`
        : '';

    return locationHoursText;
}

function getUserInputRequestParams(locationObj = {}) {
    const { display, lat, lon } = locationObj;

    const isZipCode = isNaN(Number(display));
    const zipCode = !isZipCode ? splitAndPadZipCode(display) : null;
    const [city, state] = isZipCode ? String(display).split(',') : [];

    if (zipCode) {
        return {
            zipCode
        };
    } else if (city && state) {
        return {
            city: city.trim(),
            state: state.trim()
        };
    }

    return {
        longitude: lon,
        latitude: lat
    };
}

function computeOperatingHours(operatingHours = []) {
    if (!operatingHours.length) {
        return [];
    }

    const result = [];
    const daysTransKeys = {
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday',
        7: 'sunday'
    };
    const daysCount = Object.keys(daysTransKeys).length;

    // Indexing the array of operatingHours
    const operatingHoursObj = {};

    for (const day of operatingHours) {
        operatingHoursObj[day.dayType] = day;
    }

    let rangeStartDayName;
    const separator = getAccessPointModalText('daysRangeSeparator');

    for (let index = 1; index <= daysCount; index++) {
        const currentWeekDay = operatingHoursObj[index];
        const currentWeekDayName = getAccessPointModalText(daysTransKeys[index]);
        const nextWeekDay = operatingHoursObj[index + 1];

        if (!currentWeekDay) {
            result.push({
                label: currentWeekDayName,
                value: getAccessPointModalText('noLocationHours')
            });
        } else {
            const nextDayHasSameWorkingHours = currentWeekDay.openAt === nextWeekDay?.openAt && currentWeekDay.closeAt === nextWeekDay?.closeAt;

            if (nextWeekDay && nextDayHasSameWorkingHours) {
                rangeStartDayName = rangeStartDayName || currentWeekDayName;
            } else {
                const label = `${rangeStartDayName ? `${rangeStartDayName} ${separator} ` : ''}${currentWeekDayName}`;
                const value = `${formatAmPmHours(currentWeekDay?.openAt)} - ${formatAmPmHours(currentWeekDay?.closeAt)}`;
                result.push({
                    label,
                    value
                });
                rangeStartDayName = '';
            }
        }
    }

    /*
    OUTPUT EXAMPLE:
    [
        { label: 'Mon', value: '12:00 PM - 04:00 PM' },
        { label: 'Tue - Sat', value: '09:00 AM - 09:00 PM' },
        { label: 'Sun', value: 'No location hours' }
    ]
    */
    return result;
}

export {
    getCurrentDayOfWeek,
    hasOpeningTimes,
    formatAmPmHours,
    getOpensTillTime,
    getZipCode,
    getLocationHoursText,
    getUserInputRequestParams,
    computeOperatingHours
};
