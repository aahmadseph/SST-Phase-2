import dateUtils from 'utils/Date';
import localeUtils from 'utils/LanguageLocale';
import storeLocator from 'services/api/utility/storeLocator';
import urlUtils from 'utils/Url';
import deepExtend from 'utils/deepExtend';
import DateTZ from 'utils/DateTZ';
import * as storeConstants from 'constants/Store';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const { STORE_TYPES } = storeConstants;

const STORES_LIST = {
    params: null,
    data: []
};

function specialHours(hours) {
    if (!hours) {
        return {};
    }

    let todaySpecialHours;

    if (hours.specialHours?.length > 0) {
        const todayDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

        todaySpecialHours = hours.specialHours?.filter(hoursDetail => {
            const [fromYear, fromMonth, fromDay] = hoursDetail.startDate.split('-');
            const [toYear, toMonth, toDay] = hoursDetail.endDate.split('-');
            const dateFrom = new Date(fromYear, fromMonth - 1, fromDay);
            const dateTo = new Date(toYear, toMonth - 1, toDay);

            return dateFrom <= todayDate && dateTo >= todayDate;
        });
    }

    const todayDay = dateUtils.getDayOfWeek(new Date()) + 'Hours';
    const storeHours = todaySpecialHours && todaySpecialHours.length > 0 ? { ...todaySpecialHours[0] } : { storeHours: hours[todayDay] };

    return storeHours;
}

function formatHoursRange(hours) {
    const hoursArray = hours ? hours.split('-').map(hour => hour.replace(/ /g, '').replace(/[AP]/, ' $&')) : [];

    return hoursArray.length > 1 ? hoursArray.join(' - ') : hoursArray[0];
}

function getStoreClosingTime({ storeHours }) {
    return formatHoursRange(storeHours.split('-')[1]);
}

function getStoreTodayClosingTime(storeHours, considerSpecialHours = true) {
    if (!storeHours) {
        return null;
    }

    const todayDay = dateUtils.getDayOfWeek(new Date()) + 'Hours';
    let todayOpenHoursString = storeHours?.[todayDay] ?? null;
    let todayClosingTime;

    if (considerSpecialHours) {
        const todaySpecialHours = specialHours(storeHours);

        if (todaySpecialHours?.reason || todaySpecialHours?.storeHours) {
            todayOpenHoursString = todaySpecialHours?.storeHours;
        }
    }

    if (todayOpenHoursString) {
        const todayOpenHoursArray = todayOpenHoursString.split('-');
        todayClosingTime = todayOpenHoursArray[1] ? todayOpenHoursArray[1].trim() : todayOpenHoursString;
    }

    // Guard clause for when the store is closed
    if (!todayClosingTime) {
        return null;
    }

    return todayClosingTime === 'Closed' ? todayClosingTime : formatHoursRange(todayClosingTime);
}

function getStoreTodayOpeningTime(storeHours) {
    const todayDay = dateUtils.getDayOfWeek(new Date()) + 'Hours';
    const todayOpenHoursString = storeHours[todayDay];
    const todayOpeningTime = todayOpenHoursString.split('-')[0];

    return formatHoursRange(todayOpeningTime);
}

function getStoreHoursDisplayArray(storeHours, isCurbsideHours) {
    const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Date');
    const getStoreText = localeUtils.getLocaleResourceFile('components/GlobalModals/FindInStore/FindInStoreAddress/locales', 'FindInStoreAddress');
    const getCurbsideText = localeUtils.getLocaleResourceFile('components/Stores/StoreDetails/locales', 'CombinedHoursListing');
    const SHORTENED_DAYS = getText('SHORTENED_DAYS');
    const closedMessage = isCurbsideHours ? getCurbsideText('unavailableToday') : getStoreText('storeClosed');
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
                dayRange: lastDay ? `${firstDay} - ${lastDay}` : firstDay,
                hours: isClosed ? currentHours : formatHoursRange(currentHours)
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
                dayRange: lastDay ? `${firstDay} - ${lastDay}` : firstDay,
                hours: isClosed ? currentHours : formatHoursRange(currentHours)
            };

            storeHoursDisplay.push(display);
        }
    }

    return storeHoursDisplay;
}

function updateStoreListBasedOnUrlParam(storeList) {
    if (storeList) {
        //check for specific store id in the url params
        //if it's there then we want to display that store info first
        let storeIdToLoadFirst = urlUtils.getParamsByName('storeId');

        if (storeIdToLoadFirst && storeIdToLoadFirst.length) {
            storeIdToLoadFirst = storeIdToLoadFirst[0];

            for (let i = 0; i < storeList.length; i++) {
                if (storeIdToLoadFirst === storeList[i].storeId) {
                    //move store with id up to front of list to load first
                    // eslint-disable-next-line no-param-reassign
                    storeList = storeList
                        .slice(i, i + 1)
                        .concat(storeList.slice(0, i))
                        .concat(storeList.slice(i + 1));

                    break;
                }
            }
        }
    }

    return storeList;
}

function getStores(locationObj, excludeNonSephoraStores, isCheckForStoreUrlParam, includeVirtualStores, showContent, includeRegionsMap) {
    const params = {
        latitude: locationObj.lat,
        longitude: locationObj.lon,
        radius: localeUtils.getCountrySearchRadius(),
        excludeNonSephoraStores,
        includeVirtualStores,
        showContent,
        includeRegionsMap
    };

    const paramsKey = Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join();
    const getStoresCopy = () => {
        const stores = STORES_LIST.data.map(el => deepExtend({}, el));

        //do not check for storeId url param in case that user is on StoreLocator page
        return isCheckForStoreUrlParam ? updateStoreListBasedOnUrlParam(stores) : stores;
    };

    return STORES_LIST.data.length && STORES_LIST.params === paramsKey
        ? Promise.resolve(getStoresCopy())
        : storeLocator.getStoreLocations(null, params).then(response => {
            if (response.responseStatus !== 200 || !response.stores) {
                throw new Error('Invalid store availabilities response.');
            }

            STORES_LIST.params = paramsKey;
            STORES_LIST.data = response.stores;

            return getStoresCopy();
        });
}

function getStoreIndexes(storeList) {
    return storeList.reduce(
        (acc, item, index) => ({
            ...acc,
            [item.storeId]: index
        }),
        {}
    );
}

function getStoresFromActivities(activities, storeList) {
    const storeIndexes = getStoreIndexes(storeList);

    return activities.map(activity => storeList[storeIndexes[activity.storeId]]);
}

function isCurbsideEnabled(store, otherFlags = {}) {
    const { isBOPISEnabled } = Sephora.configurationSettings;
    const flags = [isBOPISEnabled, store?.isBopisable, store?.isCurbsideEnabled, ...Object.values(otherFlags)];

    return flags.every(flag => Boolean(flag) === true);
}

function isConciergeCurbsideEnabled(store, otherFlags = {}) {
    const { isBOPISEnabled, isConciergePurchaseEnabled } = Sephora.configurationSettings;
    const flags = [isBOPISEnabled, isConciergePurchaseEnabled, store?.isBopisable, store?.isConciergeCurbsideEnabled, ...Object.values(otherFlags)];

    return flags.every(flag => !!flag);
}

function formatTwentyFourHours(timeHours) {
    const amPm = timeHours.split(':')[1].slice(2);
    const hours = Number(timeHours.split(':')[0]);

    if (hours === 12) {
        return hours;
    } else if (amPm === 'PM') {
        return hours + 12;
    } else {
        return hours;
    }
}

function getTodayStoreStatus(storeInfo) {
    const { storeHours, curbsideHours } = storeInfo;
    const todayStoreHours = specialHours(storeHours);
    const todayCurbsideHours = specialHours(curbsideHours);

    return {
        storeHours: { ...todayStoreHours },
        curbsideHours: { ...todayCurbsideHours },
        storeTimezone: storeInfo?.storeHours?.timeZone,
        curbsideTimezone: storeInfo?.curbsideHours?.timeZone
    };
}

function getReasonClosed({ storeHours }) {
    const getStoreText = localeUtils.getLocaleResourceFile('components/Stores/StoreDetails/locales', 'CombinedHoursListing');
    const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/FindInStore/FindInStoreAddress/locales', 'FindInStoreAddress');

    if (!storeHours.storeHours) {
        return storeHours.reason ? storeHours.reason : getText('storeClosed');
    }

    return storeHours.reason ? storeHours.reason : getStoreText('tempClosed');
}

function getReasonCurbsideUnavailable({ curbsideHours }) {
    const getText = localeUtils.getLocaleResourceFile('components/Stores/StoreDetails/locales', 'CombinedHoursListing');

    if (!curbsideHours.storeHours) {
        return curbsideHours.reason ? curbsideHours.reason : getText('unavailableToday');
    }

    return curbsideHours.reason ? curbsideHours.reason : getText('tempUnavailable');
}

function isStoreClosed({ storeHours, curbsideTimezone }) {
    if (!storeHours) {
        return true;
    }

    const [openingTime, closingTime] = storeHours.split('-');

    const todayOpeningHours = formatTwentyFourHours(openingTime);
    const todayOpeningMins = openingTime.split(':')[1].slice(0, 2);

    const todayClosingHours = formatTwentyFourHours(closingTime);
    const todayClosingMins = closingTime.split(':')[1].slice(0, 2);

    // Ideally the ultimate absolute UTC would be getting *now* from an API request
    // instead of deriving it from the users's computer
    const now = new Date();

    const openingTimeDateTZ = new DateTZ(now, curbsideTimezone);
    openingTimeDateTZ.setHours(todayOpeningHours);
    openingTimeDateTZ.setMinutes(todayOpeningMins);

    const closingTimeDateTZ = new DateTZ(now, curbsideTimezone);
    closingTimeDateTZ.setHours(todayClosingHours);
    closingTimeDateTZ.setMinutes(todayClosingMins);

    const openingTimeEpoch = new Date(openingTimeDateTZ.toLocaleString()).getTime();
    const closingTimeEpoch = new Date(closingTimeDateTZ.toLocaleString()).getTime();

    const nowTZ = new DateTZ(now, curbsideTimezone);
    const nowEpoch = new Date(nowTZ.toLocaleString()).getTime();

    const isOpen = nowEpoch > openingTimeEpoch && nowEpoch < closingTimeEpoch;
    const isClosed = nowEpoch < openingTimeEpoch || nowEpoch > closingTimeEpoch;

    return isClosed || !isOpen;
}

function isCurbsideAvailable({ curbsideHours, curbsideTimezone }) {
    if (!curbsideHours.storeHours) {
        return false;
    }

    const curbsideHoursWithTimezone = {
        ...curbsideHours,
        curbsideTimezone
    };

    return !isStoreClosed(curbsideHoursWithTimezone);
}

function getSpecialHours(specialHoursArr) {
    const today = new Date();
    const todayDate = today.getDate();
    const latestDate = new Date();
    latestDate.setDate(todayDate + 30);

    return specialHoursArr.reduce((acc, curr) => {
        const endDate = new Date(curr.endDate.split('-').join(','));
        const startDate = new Date(curr.startDate.split('-').join(','));

        if (endDate <= latestDate) {
            const startMonth = startDate.getMonth() + 1;
            const startDay = startDate.getDate();

            endDate.setDate(endDate.getDate());

            const endMonth = endDate.getMonth() + 1;
            const endDay = endDate.getDate();

            acc.push({
                dateRange:
                    curr.startDate === curr.endDate
                        ? `${dateUtils.getShortenedMonth(endMonth)} ${endDay}`
                        : `${dateUtils.getShortenedMonth(startMonth)} ${startDay} - ${dateUtils.getShortenedMonth(endMonth)} ${endDay}`,
                textColor: curr.textColor?.toLowerCase(),
                reason: curr.reason,
                storeHours: formatHoursRange(curr.storeHours)
            });
        }

        return acc;
    }, []);
}

function getCurbsidePickupInstructions(store) {
    const curbsideInstructionTab = store?.content?.regions?.curbsideInstructionTab;
    const curbsideMapImageTab = store?.content?.regions?.curbsideMapImageTab;

    return [curbsideInstructionTab, curbsideMapImageTab];
}

function getConciergePickupInstructions(store) {
    return store?.content?.regions?.curbsideInstructionTab;
}

function getStoreDisplayName(storeDetails = {}, forcePrependSephora = false) {
    const storeTypesToPrependSephora = STORE_TYPES.PREPEND_SEPHORA;

    let displayName = storeDetails.displayName;
    const shouldPrependSephora = storeTypesToPrependSephora.includes(storeDetails.storeType);

    if (forcePrependSephora || shouldPrependSephora) {
        displayName = `Sephora ${displayName}`;
    }

    return displayName;
}

function getStoreDisplayNameWithSephora(storeDetails = {}) {
    const forcePrependSephora = true;

    return getStoreDisplayName(storeDetails, forcePrependSephora);
}

function isKohlsStore(store = {}) {
    const { storeType } = store;

    return STORE_TYPES.PREPEND_SEPHORA.includes(storeType);
}

function cacheStoreData(data = {}, expiryInMinutes = storeConstants.EXPIRY_MINUTES) {
    const expiry = Storage.MINUTES * expiryInMinutes;
    Storage.session.setItem(LOCAL_STORAGE.SELECTED_STORE, data, expiry);
}

function addSephoraAtStart(theStoreName = '') {
    const hasSephoraAtStart = theStoreName.toLowerCase().includes('sephora');
    const hasKohlsInName = theStoreName.toLowerCase().includes('kohl’s');

    return !hasSephoraAtStart && hasKohlsInName ? `Sephora ${theStoreName}` : theStoreName;
}

function removePrepAtStartForKohls(theStoreName = '') {
    const hasKohlsInName = theStoreName.toLowerCase().includes('kohl’s');
    const hasPrepAtInName = theStoreName.toLowerCase().includes('at');

    return hasKohlsInName && hasPrepAtInName ? theStoreName.replace('at', '') : theStoreName;
}

function isStoreTypeKohls(store = {}) {
    const { storeType } = store;

    return storeType === 'SIKLS';
}

export default {
    getStores,
    getStoreIndexes,
    formatHoursRange,
    getStoresFromActivities,
    getTodayStoreStatus,
    getReasonClosed,
    getStoreClosingTime,
    getReasonCurbsideUnavailable,
    isCurbsideAvailable,
    getStoreTodayClosingTime,
    getStoreTodayOpeningTime,
    getStoreHoursDisplayArray,
    isCurbsideEnabled,
    isConciergeCurbsideEnabled,
    getCurbsidePickupInstructions,
    getConciergePickupInstructions,
    updateStoreListBasedOnUrlParam,
    isStoreClosed,
    getSpecialHours,
    getStoreDisplayName,
    getStoreDisplayNameWithSephora,
    isKohlsStore,
    cacheStoreData,
    addSephoraAtStart,
    removePrepAtStartForKohls,
    isStoreTypeKohls
};
