import {
    ERROR_FIELDS,
    FULL_PROFILE_ERROR_FIELDS,
    ISO_CURRENCY,
    MILISECONDS_IN_A_DAY,
    NON_BI,
    PROFILE_FIELDS,
    COUNTRIES
} from '#server/services/apiOrchestration/userFull/utils/constants.mjs';
import { safelyParse } from '#server/utils/serverUtils.mjs';
import { BI_OPTIONS_EN } from '#server/services/apiOrchestration/userFull/utils/bi_options_en.mjs';
import { BI_OPTIONS_CA } from '#server/services/apiOrchestration/userFull/utils/bi_options_ca.mjs';

function isError(service, parsedData) {
    return !!((
        (service?.status === 'rejected' || !service?.status)
            || (service.status === 'fulfilled' && parsedData?.errorCode))
        || (service.status === 'fulfilled' && !Object.keys(parsedData).length));
}

function getOptions(options, reqHeaders) {
    const { ...optionsCloned } = options;

    const profileId = options.url.match(/users\/profiles\/(\d+)/)?.[1];

    if (profileId) {
        optionsCloned.profileId = profileId;
    }

    optionsCloned.headers['seph-access-token'] = reqHeaders['seph-access-token'];
    optionsCloned.headers['x-api-key'] = reqHeaders['x-api-key'];
    optionsCloned.timeout = 2000;

    return optionsCloned;
}

function getDataFromObject(fields, data) {
    const result = {};

    fields.forEach(x => {
        if (x in data) {
            result[x] = data[x] ?? '';
        }
    });

    return result;
}

function getErrors(errors) {
    return errors.reduce((errAcc, [result, data]) => {
        if (isError(result, data)) {
            const errorParsed = safelyParse(result?.reason, false) || {};
            errAcc.push(getDataFromObject(ERROR_FIELDS, errorParsed));
        }

        return errAcc;
    }, []);
}

function formatFault(data) {
    return {
        errorMessages: [data.faultstring],
        errorCode: data.detail.errorcode
    };
}

function formatError(errorData) {
    const data = errorData.data || '{}';
    const jsonData = safelyParse(data, false) || {};
    let error;

    if (jsonData.errors) {
        error = jsonData.errors[0];

        if (error.errorMessage) {
            error.errorMessages = [error.errorMessage];
        }
    }

    if (jsonData.fault) {
        error = formatFault(jsonData.fault);
    }

    if (jsonData.error) {
        error = {
            errorMessages: [jsonData.error],
            errorCode: errorData.statusCode
        };
    }

    if (!error && !jsonData.errorMessages && errorData.err) {
        error = {
            errorMessages: [errorData.err],
            errorCode: errorData.statusCode
        };
    }

    if (error?.errorCode && isNaN(error.errorCode)) {
        error.errorCode = errorData.statusCode;
    }

    return getDataFromObject(FULL_PROFILE_ERROR_FIELDS, error || jsonData);
}

function extractError(data) {
    const {
        service, parsedData, field
    } = data;
    const errors = getErrors([[service, parsedData]]);

    if (errors.length > 0 && Object.keys(errors[0]).length > 0) {
        const formattedError = formatError(errors[0]);

        return field ? { [field]: formattedError } : formattedError;
    }

    return null;
}

function formatStoreCredits(service, parsedData) {
    const error = extractError({
        service,
        parsedData,
        field: PROFILE_FIELDS.STORE_CREDITS
    });

    if (error) {
        return error;
    }

    let { storeCredits } = parsedData;

    if (!storeCredits || storeCredits.length === 0){
        return {
            storeCredits: []
        };
    }

    storeCredits = storeCredits.map((credit) => {
        const amount = credit.currency === ISO_CURRENCY.US ? `$${credit.amount}` : `$${credit.amount} ${credit.currency}`;

        return {
            amount,
            expirationDate: credit.expirationDate || null,
            currency: credit.currency || null
        };
    });

    return {
        storeCredits
    };
}

function handleSubscriptions(service, parsedData) {
    const error = extractError({
        service,
        parsedData,
        field: 'userSubscriptions'
    });

    return error ? {} : parsedData;
}

function formattedISODate(dateString) {
    const date = new Date(dateString);

    return `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}/${date.getFullYear()}`;
}

function handleLinkedAccounts(service, parsedData) {
    const error = extractError({
        service,
        parsedData
    });
    const { LinkedAccountDetails = [] } = parsedData;
    const updatedLinkedAccountDetails = LinkedAccountDetails.map(item => ({
        ...item,
        linkedDate: formattedISODate(item.linkedDate)
    }));

    return error || !!updatedLinkedAccountDetails.length ? updatedLinkedAccountDetails : null;
}

function formatBankRewards(service, parsedData) {
    const { bankRewards } = parsedData;
    const error = extractError(
        {
            service,
            parsedData: bankRewards,
            field: PROFILE_FIELDS.BANK_REWARDS
        });

    if (error) {
        return error;
    }

    if (bankRewards == null) {
        return {};
    }

    const ccCardType = bankRewards.ccCardType;

    if (bankRewards.upcomingRewardCertificates?.length === 0) {
        delete bankRewards.upcomingRewardCertificates;
    }

    return {
        bankRewards,
        ccCardType
    };
}

function isEmptyObject(value) {
    return value && Object.keys(value).length === 0 && value.constructor === Object;
}

function formatPrescreenInfo(service, prescreenInfo) {
    const error = extractError(
        {
            service,
            parsedData: prescreenInfo,
            field: PROFILE_FIELDS.PRESCREEN_INFO
        });

    if (error) {
        return error;
    }

    if (isEmptyObject(prescreenInfo)) {
        return {};
    }

    const ccApprovalStatus = prescreenInfo.ccAccountInfoLookUpOut?.ccApprovalStatus;
    const {
        preScreenStatus, realTimePrescreenInProgress, prescreenedCardType
    } = prescreenInfo;

    return {
        ccAccountandPrescreenInfo: {
            ccApprovalStatus,
            preScreenStatus,
            realTimePrescreenInProgress,
            ...(prescreenedCardType ? { prescreenedCardType } : {})
        }
    };
}

const errorsTextsMap = {
    403: 'You are not authorized to view profile with id:',
    404: 'There is no matching profile for the'
};

function getProfileErrorData(statusCode, profileId) {
    return {
        errorCode: statusCode,
        errorMessage: `${errorsTextsMap[statusCode]} ${profileId}`
    };
}

function handleAPIResult(apiName, response, defValue = {}) {
    const parsedData = safelyParse(response?.value?.data, false) || defValue;

    return parsedData[apiName] || parsedData;
}

function formatShippingAddress(shippingAddress) {
    const {
        address1 = '',
        address2 = '',
        addressId = '',
        addressType = '',
        city = '',
        country = '',
        firstName = '',
        isDefault = '',
        isPOBoxAddress = '',
        lastName = '',
        state = '',
        digitalAddressId = '',
        phone: phoneNumber = '',
        postalCode: zipcode = ''
    } = shippingAddress;

    const shippingAddressFormated = {
        address1,
        address2,
        addressId,
        addressType,
        city,
        county: country,
        firstName,
        isDefault,
        isPOBoxAddress,
        lastName,
        state,
        digitalAddressId,
        phoneNumber,
        zipcode
    };

    return shippingAddressFormated;
}

function formatPayment(paymentDetails) {
    const CREDIT_CARD_TYPES = new Map([
        ['sephora', 'Sephora Card'],
        ['plcc', 'Sephora Card'],
        ['visa', 'VISA'],
        ['mastercard', 'MasterCard'],
        ['americanexpress', 'American Express'],
        ['cbvi', 'Sephora VISA Card'],
        ['discover', 'Discover']
    ]);

    const {
        address: {
            address1 = '',
            address2 = '',
            country = '',
            phoneNumber = '',
            postalCode: zipcode = '',
            city = '',
            addressId = '',
            state = ''
        },
        atgPaymentId: paymentId = '',
        cardTokenNumber = '',
        cardType = '',
        expiryMonth: expirationMonth = '',
        expiryYear: expirationYear = '',
        firstName = '',
        lastName = '',
        isMigrated = ''
    } = paymentDetails;

    const paymentFormated = {
        address1,
        address2,
        county: country,
        phoneNumber,
        zipcode,
        city,
        addressId,
        state,
        paymentId,
        cardTokenNumber,
        cardType: CREDIT_CARD_TYPES.get(cardType.toLowerCase()),
        expirationMonth,
        expirationYear,
        firstName,
        lastName,
        isMigrated
    };

    return paymentFormated;
}

function getConfigSetting(configurationSettings, settingName) {
    return configurationSettings && configurationSettings[settingName] ?
        configurationSettings[settingName] :
        false;
}

function isConciergeCurbsideEnabled(options, configurationSettings) {
    const { country = '' } = options;
    const enableConciergePickupKey = `enableConciergePickup${country}`;

    return getConfigSetting(configurationSettings, enableConciergePickupKey);
}

function isSDDRougeFreeShipEligible(options) {
    const {
        country = '',
        vibSegment,
        isSDDRougeTestEnabled
    } = options;

    if (!isSDDRougeTestEnabled) {
        return false;
    }

    const enableSameDayShippingKey = `enableSameDayShipping${country}`;
    const enableSameDayShipping = options ? options[enableSameDayShippingKey] : null;

    return enableSameDayShipping === true && vibSegment === true;
}

function constructFavoriteBrands(favoriteBrands, brands = []) {
    if (!favoriteBrands) {
        return undefined;
    }

    const brandsMap = brands.reduce((acc, brand) => {

        acc[brand.brandId] = {
            normalizedBrandName: brand?.shortName || '',
            ...brand
        };

        return acc;
    }, {});

    const formattedFavoriteBrands = favoriteBrands
        .filter(({ value }) => value !== 'noPreferenceFB')
        .map(({ value }) => brandsMap[value]);

    return formattedFavoriteBrands || [];
}

function constructBiPoints(profileInfo) {
    return (profileInfo?.beautyInsiderAccount && profileInfo?.profileLocale)
        ? {
            biStatus: profileInfo.beautyInsiderAccount?.vibSegment || '',
            profileLocale: profileInfo.profileLocale,
            profileStatus: profileInfo.profileStatus,
            realTimeVIBStatus: profileInfo.beautyInsiderAccount?.realTimeVIBStatus || '',
            vibSpendingForYear: profileInfo.beautyInsiderAccount?.vibSpendingForYear ?? '',
            beautyBankPoints: profileInfo.beautyInsiderAccount?.promotionPoints || 0
        }
        : {};
}

function getFormattedDate(date) {
    const epochMillis = date && date * 1000; // epoch timestamp in milliseconds
    const currentDate = epochMillis ? new Date(epochMillis).toISOString() : new Date().toISOString();

    return currentDate.split('.')[0].replace('T', ' ');
}

const PROP_NAME_INDEX = 0;

function parseErrorResponse(error, parsedData) {
    const data = error.data || '{}';
    const jsonData = safelyParse(data, false) || {};

    return [
        parsedData[PROP_NAME_INDEX],
        getDataFromObject(FULL_PROFILE_ERROR_FIELDS, jsonData.fault ? formatFault(jsonData.fault) : jsonData)];
}

function transformAndMatchObjects(baseObject = {}, matchObject = {}) {
    const newObject = {};

    Object.keys(baseObject).forEach(property => {
        newObject[property] = [];
        const map = new Map((matchObject[property === 'skinConcerns' ? 'skinCare' : property] || []).map(obj => {
            const value = obj?.value?.toLowerCase();
            const objKey = value === 'skincare' ? 'skinconcerns' : value;

            return [objKey, obj];
        }));

        Object.keys(baseObject[property]).forEach(key => {
            const newItem = {
                displayName: baseObject[property][key],
                value: key
            };

            if (map.get(key.toLowerCase())) {
                newItem.isSelected = true;
            }

            newObject[property].push(newItem);
        });
    });

    return newObject;
}

function transformBeautyPreferences(baseObject = {}) {
    const newObject = {};
    const propertiesWithSingularValue = [
        'skinType',
        'skinTone',
        'hairColor',
        'eyeColor',
        'ageRange',
        'gender'
    ];

    Object.keys(baseObject).forEach(property => {
        if (property !== 'favoriteBrands') {
            if (propertiesWithSingularValue.includes(property)) {
                newObject[property] = baseObject[property][0].value;
            } else {
                if (property !== 'skinTones') {
                    newObject[property === 'skinCare' ? 'skinConcerns' : property] =
                        baseObject[property].reduce((acc, prop) => {
                            acc.push(prop.value);

                            return acc;
                        }, []);
                }
            }
        }
    });

    return newObject;
}

function addCssColors(skinTones, colorsMap) {
    return skinTones.map(item => ({
        ...item,
        cssColor: colorsMap[item.shadeCode]
    }));
}

const biOptionsMap = {
    en: BI_OPTIONS_EN,
    fr: BI_OPTIONS_CA
};

async function safeAsyncExecutor(fn, ...params) {
    try {
        const res = await fn(...params);

        return res;
    } catch (error){
        return {
            status: 'rejected',
            reason: error
        };
    }
}

const addStoreNameToList = (listOfObj) => listOfObj.map(obj => {
    const updatedObj = {
        ...obj,
        storeName: obj.StoreName || ''
    };
    delete updatedObj.StoreName;

    return updatedObj;
});

const filterProfileProperties = (profile) => {
    const filteredProfile = { ...profile };

    // Remove signup store information and profileStatus from the profile
    delete filteredProfile.signupStore;
    delete filteredProfile.profileStatus;

    if (filteredProfile?.beautyInsiderAccount?.signupDate) {
        filteredProfile.beautyInsiderAccount.signupDate = Date.parse(filteredProfile?.beautyInsiderAccount?.signupDate);
    }

    return filteredProfile;
};

function calculateDaysLeftToRedeem(lastDateToRedeem) {
    try {
        const [day, month, year] = lastDateToRedeem.split('-');
        const parsedDate = Date.UTC(year, month - 1, day, 23, 59, 59, 0);
        const currentDate = Date.now();
        const diffInMs = parsedDate - currentDate;
        const daysLeft = Math.max(0, Math.ceil(diffInMs / MILISECONDS_IN_A_DAY));

        return `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left to redeem`;
    } catch {
        return '';
    }
}

function filterResponseToUFE(responseToUFE, includeApis, skipApis) {
    const responseToUFECloned = Object.assign({}, responseToUFE);
    const allProperties = !includeApis
        ? 'profile,shoppingList,beautyPreference,personalizedPromotions,availableRRCCoupons,segments,smsStatus,tax,biPoints'
        : includeApis;

    if (allProperties) {
        for (const prop in responseToUFECloned) {
            if (!(allProperties.split(',').includes(prop)) && prop !== 'profile') {
                delete responseToUFECloned[prop];
            }
        }
    }

    if (skipApis) {
        for (const prop in responseToUFECloned) {
            if ((skipApis.split(',').includes(prop))) {
                delete responseToUFECloned[prop];
            }
        }
    }

    return responseToUFECloned;
}

const defaultsByCountry = {
    US: {
        preferredZipCode: '20147',
        storeId: '1876'
    },
    CA: {
        preferredZipCode: 'M5B 2H1',
        storeId: '0500'
    }
};

const stringifyNumericProps = (obj, properties)=> properties.reduce((acc, curr)=>{
    if (curr in obj && typeof obj[curr] === 'number') {
        acc[curr] = obj[curr].toString();
    }

    return acc;
}, {});

const checkIsNonBiAccount = (accountType) => accountType === NON_BI;


function formatExpirationDate(expirationDate) {
    if (!expirationDate) {
        return null;
    }

    const date = new Date(expirationDate);

    // Extract date components
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    // Format the date
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.0`;
}

function storeCreditsFormatExpirationDate({ storeCredits }) {
    if (!storeCredits?.length) {
        return { storeCredits: [] };
    }

    const updatedStoreCredits = storeCredits.map(item => {
        if (item?.expirationDate) {
            item.expirationDate = formatExpirationDate(item.expirationDate);
        }

        return item;
    });

    return { storeCredits: updatedStoreCredits };
}

function isAccessTokenExpired(response) {
    const parsedResponse = safelyParse(response, false);
    const errorReason = safelyParse(response?.reason, false) || {};

    if (isError(response, parsedResponse) && errorReason?.statusCode === 401) {
        return true;
    }

    return false;
}

const usaZipCodeRegEx = /^\d{5}(-\d{4})?$/;
const canadaZipCodeRegEx = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/i;

function isValidZipCode(value, locale) {
    if (locale === 'CA') {
        return canadaZipCodeRegEx.test(value);
    } else {
        return usaZipCodeRegEx.test(value);
    }
}

function getPreferredZipCodeOrDefault (preferredZipCode, options) {
    return preferredZipCode
        ? isValidZipCode(preferredZipCode, options?.country)
            ? preferredZipCode
            : defaultsByCountry[options?.country || 'US'].preferredZipCode
        : defaultsByCountry[options?.country || 'US'].preferredZipCode;
}

function getCountryByZipCodeOrDefault(preferredZipCode, options = {}) {
    if (canadaZipCodeRegEx.test(preferredZipCode)) {
        return COUNTRIES.CA;
    }

    if (usaZipCodeRegEx.test(preferredZipCode)) {
        return COUNTRIES.US;
    }

    return options.country || COUNTRIES.US;
}

function setDefaultSALocationData(profileIdInfoParsed, preferredZipCode, options) {
    profileIdInfoParsed.defaultSACountryCode ||= getCountryByZipCodeOrDefault(preferredZipCode, options);
    profileIdInfoParsed.defaultSAZipCode ||= getPreferredZipCodeOrDefault(preferredZipCode,
        { country: profileIdInfoParsed.defaultSACountryCode });
}

function isValidProfileId(profileId) {
    if (profileId === null ||
        profileId === undefined ||
        profileId === 'null' ||
        profileId === 'undefined') {
        return false;
    }

    const profileStr = String(profileId).trim();

    // Users who signed up since 2007 have a alphanumeric profile id
    // Users who signed up after 2007 have a numeric profile id
    return profileStr !== '' && /^[a-zA-Z0-9]+$/.test(profileStr);
}

export {
    isError,
    isEmptyObject,
    isConciergeCurbsideEnabled,
    isSDDRougeFreeShipEligible,
    getErrors,
    getOptions,
    getDataFromObject,
    getFormattedDate,
    getConfigSetting,
    formatStoreCredits,
    formatBankRewards,
    formatPrescreenInfo,
    getProfileErrorData,
    handleAPIResult,
    formatShippingAddress,
    formatPayment,
    constructFavoriteBrands,
    constructBiPoints,
    safeAsyncExecutor,
    parseErrorResponse,
    transformAndMatchObjects,
    biOptionsMap,
    addCssColors,
    transformBeautyPreferences,
    addStoreNameToList,
    filterProfileProperties,
    formatError,
    handleSubscriptions,
    handleLinkedAccounts,
    calculateDaysLeftToRedeem,
    filterResponseToUFE,
    defaultsByCountry,
    stringifyNumericProps,
    checkIsNonBiAccount,
    storeCreditsFormatExpirationDate,
    isAccessTokenExpired,
    formattedISODate,
    getPreferredZipCodeOrDefault,
    getCountryByZipCodeOrDefault,
    setDefaultSALocationData,
    isValidProfileId
};
