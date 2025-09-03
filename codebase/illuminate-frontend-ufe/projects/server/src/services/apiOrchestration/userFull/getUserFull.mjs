import {
    resolve,
    basename
} from 'path';
const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);
import {
    getDiffTime
} from '#server/utils/serverUtils.mjs';
import { safelyParse } from '#server/utils/serverUtils.mjs';
import {
    sendAPIJsonResponse,
    sendAPI401Response,
    sendAPI403Response,
    sendAPI404Response
} from '#server/utils/sendAPIResponse.mjs';
import {
    biOptionsMap,
    constructFavoriteBrands,
    parseErrorResponse,
    getOptions,
    handleAPIResult,
    isError,
    transformBeautyPreferences,
    transformAndMatchObjects,
    getDataFromObject,
    safeAsyncExecutor,
    constructBiPoints,
    addCssColors,
    addStoreNameToList,
    filterProfileProperties,
    formatBankRewards,
    formatStoreCredits,
    isConciergeCurbsideEnabled,
    isSDDRougeFreeShipEligible,
    handleSubscriptions,
    calculateDaysLeftToRedeem,
    formatPrescreenInfo,
    filterResponseToUFE,
    defaultsByCountry,
    stringifyNumericProps,
    checkIsNonBiAccount,
    storeCreditsFormatExpirationDate,
    handleLinkedAccounts,
    isEmptyObject,
    getProfileErrorData,
    getPreferredZipCodeOrDefault,
    setDefaultSALocationData
} from '#server/services/apiOrchestration/userFull/utils/utils.mjs';
import {
    BI_CASH_LOCK_UP_MSG,
    ELIGIBLE_REWARDS_FIELDS,
    CC_STATUS,
    CONFIGURATION_FIELDS,
    PAYMENT_PROFILE_FIELDS,
    LOCATION_FIELDS,
    BD_GIFT_LAST_DATE_TO_REDEEM,
    BIA_PROPS_TO_STRINGIFY,
    DEFAULT_AVAILABLE_RRC_COUPONS,
    DEFAULT_PERSONALIZED_PROMOTIONS
} from '#server/services/apiOrchestration/userFull/utils/constants.mjs';
import getPromotions from '#server/services/api/profile/getPromotions.mjs';
import getProfileId from '#server/services/api/profile/getProfileId.mjs';
import getSegments from '#server/services/api/profile/getSegments.mjs';
import getShoppingList from '#server/services/api/profile/getShoppingList.mjs';
import getAvailableRRCCoupons from '#server/services/api/profile/getAvailableRRCCoupons.mjs';
import getBrands from '#server/services/api/profile/getBrands.mjs';
import getLocationStore from '#server/services/api/profile/getLocationStore.mjs';
import { COLORS_MAP } from '#server/services/apiOrchestration/userFull/utils/colorsMap.mjs';
import getRewards from '#server/services/api/profile/getRewards.mjs';
import getLinkedAccounts from '#server/services/api/profile/getLinkedAccounts.mjs';
import getConfiguration from '#server/services/api/util/getConfiguration.mjs';
import getSubscriptions from '#server/services/api/profile/getSubscriptions.mjs';
import getStoreCredits from '#server/services/api/profile/getStoreCredits.mjs';
import getPaymentProfileFlags from '#server/services/api/profile/getPaymentProfileFlags.mjs';
import getPrescreenInfo from '#server/services/api/profile/getPrescreenInfo.mjs';
import getBankRewards from '#server/services/api/profile/getBankRewards.mjs';

//apis map. key is a name of field in userFull obj
const apisCallsMap = {
    personalizedPromotions: getPromotions,
    segments: getSegments,
    shoppingList: getShoppingList,
    availableRRCCoupons: getAvailableRRCCoupons
};

//map with specific result handlers for every api. By default 'handleAPIResult' is used
const apisSpecialHandlersMap = {};

/* eslint-disable-next-line complexity */
async function getUserFull(request, response) {
    const startTimerFirstBadge = process.hrtime();
    const startTimerSecondBadge = process.hrtime();
    try {
        const {
            skipApis,
            includeApis,
            preferredZipCode,
            storeId,
            biAccountId,
            preferenceStruct
        } = request.apiOptions.parseQuery;

        // Check for values before splitting/filtering to prevent silent error
        let apis = [];
        const allApis = 'profile,shoppingList,personalizedPromotions,availableRRCCoupons,segments';

        apis = skipApis
            ? allApis.split(',').filter(api => !skipApis.includes(api))
            : allApis.split(',');

        const options = getOptions(request.apiOptions, request.headers);
        const profileIdInfo = await safeAsyncExecutor(getProfileId, options, request.headers);

        if (profileIdInfo?.reason?.statusCode === 401) {
            return sendAPI401Response(response);
        }

        if (profileIdInfo?.reason?.statusCode === 403) {
            return sendAPI403Response(response, true);
        }

        if (profileIdInfo?.reason?.statusCode === 404) {
            return sendAPI404Response(response, 'The profileId was not found on customer-lookup; statusCode: 404');
        }

        if (profileIdInfo.status === 'rejected') {
            return sendAPI404Response(response, profileIdInfo.reason);
        }

        const profileIdInfoParsed = safelyParse(profileIdInfo?.data, false) || {};
        const biAccountIdOrDefault = biAccountId || profileIdInfoParsed?.beautyInsiderAccount?.biAccountId;
        const prescreenInfo = await safeAsyncExecutor(getPrescreenInfo, {
            ...options,
            biAccountIdOrDefault
        }, request.headers);
        const prescreenInfoParsed = safelyParse(prescreenInfo?.data, false) || {};
        let bankRewardsInfo;
        let bankRewardsInfoParsed = {};
        const {
            isSMSOptInAvailable = false, isUserSMSOptedIn = false, taxExemptionExpiryDate, taxExemptCategory
        } = profileIdInfoParsed || {};

        setDefaultSALocationData(profileIdInfoParsed, preferredZipCode, options);

        const taxInfo = {};

        if (taxExemptCategory) {
            taxInfo.tax = {
                taxExemptionExpiryDate,
                taxExemptCategory
            };

            delete profileIdInfoParsed.taxExemptCategory;
            delete profileIdInfoParsed.taxExemptionExpiryDate;
            delete profileIdInfoParsed.beautyInsiderAccount.taxExemptCategory;
            delete profileIdInfoParsed.beautyInsiderAccount.taxExemptionExpiryDate;
        }

        const smsStatus = {
            isSMSOptInAvailable,
            isUserOptedIn: isUserSMSOptedIn
        };

        const storeIdOrDefault = profileIdInfoParsed?.preferredStoreName || storeId || defaultsByCountry[options?.country || 'US'].storeId;
        const isNonBiAccount = checkIsNonBiAccount(profileIdInfoParsed?.accountType);

        const [
            brandsInfo,
            configuration,
            locationStoreInfo,
            rewardsInfo,
            linkedAccounts,
            subscriptions,
            storeCreditsInfo,
            paymentProfileFlags
        ] = await Promise.allSettled([
            getBrands(options),
            getConfiguration(options),
            getLocationStore({
                ...options,
                storeIdOrDefault
            }),
            getRewards({
                ...options,
                beautyInsiderAccount: profileIdInfoParsed?.beautyInsiderAccount
            }),
            profileIdInfoParsed?.partnerAccountPresent ? getLinkedAccounts(options) : () => Promise.resolve({}),
            getSubscriptions(options),
            getStoreCredits({
                ...options,
                biAccountIdOrDefault
            }),
            getPaymentProfileFlags({
                ...options,
                biAccountIdOrDefault
            })
        ]);
        const endTimeFirstBadge = getDiffTime(startTimerFirstBadge);
        logger.info(`It took ${endTimeFirstBadge}ms to run the first API endpoints for getFullProfile Call on Woody`);

        const brandsInfoParsed = safelyParse(brandsInfo?.value?.data, false) || {};
        const locationStoreInfoParsed = safelyParse(locationStoreInfo?.value?.data, false) || {};
        const rewardsInfoParsed = safelyParse(rewardsInfo.value?.data, false) || {};
        const linkedAccountsParsed = safelyParse(linkedAccounts?.value?.data, false) || [];
        const configurationSettings = safelyParse(configuration.value?.data, false) || {};
        const biOptions = biOptionsMap[request.apiOptions.language];
        const userSubscriptionsParsed = safelyParse(subscriptions.value?.data, false) || [];
        const isSubscriptionRejected = isError(subscriptions, userSubscriptionsParsed);
        const storeCreditsInfoParsed = safelyParse(storeCreditsInfo.value?.data, false) || {};
        const paymentProfileFlagsParsed = safelyParse(paymentProfileFlags.value?.data, false) || {};
        const configurationParsed = safelyParse(configuration.value?.data, false) || {};
        const {
            enableSameDayShippingUS = false,
            enableSameDayShippingCA = false,
            isSDDRougeTestEnabled = false
        } = configurationParsed;

        // Sets to Bool T or F, no longer undefined if false
        profileIdInfoParsed.isSDUFeatureDown =
        isSubscriptionRejected && (subscriptions?.reason?.statusCode === 500 || subscriptions?.reason?.statusCode === 503);

        if (prescreenInfoParsed?.ccAccountInfoLookUpOut?.ccStatus === CC_STATUS.ACTIVE &&
            prescreenInfoParsed?.ccAccountInfoLookUpOut?.ccAccountID) {
            bankRewardsInfo = await safeAsyncExecutor(getBankRewards, options, request.headers);
            bankRewardsInfoParsed = safelyParse(bankRewardsInfo?.data, false) || {};
        }


        const favoriteBrands = constructFavoriteBrands(profileIdInfoParsed.personalizedInformation?.favoriteBrands, brandsInfoParsed.brands);
        const updatedRemainingPersonalizedInfo = transformBeautyPreferences(profileIdInfoParsed.personalizedInformation);

        const {
            personalizedInformation: {
                skinTones = [],
                ...remainingPersonalizedInfo
            } = {},
            ...remainingProfileIdInfoParsed
        } = profileIdInfoParsed || {};

        const skinTonesWithStoreNameAndColors = skinTones?.length
            ? addCssColors(addStoreNameToList(skinTones), COLORS_MAP)
            : [];

        const beautyPreference = {
            ...updatedRemainingPersonalizedInfo,
            ...(favoriteBrands && { favoriteBrands }),
            ...(skinTonesWithStoreNameAndColors?.length ? { colorIQ: skinTonesWithStoreNameAndColors } : {})
        };


        const profileWithoutPersonalizedInfo = filterProfileProperties(remainingProfileIdInfoParsed);
        const isBeautyInsiderAccount = !!profileWithoutPersonalizedInfo.beautyInsiderAccount;
        const vibSegment = profileIdInfoParsed?.beautyInsiderAccount?.vibSegment?.toUpperCase() === 'ROUGE' || false;

        if (isNonBiAccount) {
            delete profileWithoutPersonalizedInfo.beautyInsiderAccount;
        } else {
            if (!isBeautyInsiderAccount) {
                profileWithoutPersonalizedInfo.beautyInsiderAccount = {};
            }

            if (BD_GIFT_LAST_DATE_TO_REDEEM in rewardsInfoParsed) {
                const lastDateToRedeem = rewardsInfoParsed[BD_GIFT_LAST_DATE_TO_REDEEM];
                rewardsInfoParsed[BD_GIFT_LAST_DATE_TO_REDEEM] = calculateDaysLeftToRedeem(lastDateToRedeem);
            }

            const personalizedInformation = transformAndMatchObjects(biOptions, remainingPersonalizedInfo);
            const updatedBIAccount = Object.assign(
                {},
                profileWithoutPersonalizedInfo.beautyInsiderAccount,
                formatPrescreenInfo(prescreenInfo, prescreenInfoParsed),
                getDataFromObject(ELIGIBLE_REWARDS_FIELDS, rewardsInfoParsed),
                stringifyNumericProps(profileWithoutPersonalizedInfo.beautyInsiderAccount, BIA_PROPS_TO_STRINGIFY),
                personalizedInformation ? { personalizedInformation } : {},
                skinTonesWithStoreNameAndColors?.length ? { skinTones: skinTonesWithStoreNameAndColors } : {},
                { linkedAccountDetails: handleLinkedAccounts(linkedAccounts, linkedAccountsParsed) }
            );

            profileWithoutPersonalizedInfo.beautyInsiderAccount = updatedBIAccount;
        }

        if (BI_CASH_LOCK_UP_MSG in rewardsInfoParsed) {
            profileWithoutPersonalizedInfo[BI_CASH_LOCK_UP_MSG] = rewardsInfoParsed[BI_CASH_LOCK_UP_MSG];
        }

        //construct an array of apis and response handlers
        const dependentApiCalls = apis.reduce((arr, apiName) => {
            const apiCall = apisCallsMap[apiName];
            const handler = apisSpecialHandlersMap[apiName] || handleAPIResult;

            if (apiCall) {
                arr.push({
                    apiCall: apiCall({
                        ...options,
                        biAccountIdOrDefault
                    }, configurationSettings),
                    handler: result => [apiName, handler(apiName, result)]
                });
            }

            return arr;
        }, []);

        const biPoints = !isNonBiAccount ? constructBiPoints(profileIdInfoParsed): {};
        const shouldUseNewBeautyPreferenceFormat = !!preferenceStruct;

        const responseToUFE = {
            ...(!shouldUseNewBeautyPreferenceFormat && { beautyPreference }),
            biPoints,
            profile: {
                ...profileWithoutPersonalizedInfo,
                ...handleSubscriptions(subscriptions, userSubscriptionsParsed),
                ...formatStoreCredits(storeCreditsInfo, storeCreditsFormatExpirationDate(storeCreditsInfoParsed)),
                ...getDataFromObject(PAYMENT_PROFILE_FIELDS, paymentProfileFlagsParsed),
                ...getDataFromObject(CONFIGURATION_FIELDS, configurationParsed),
                ...formatBankRewards(bankRewardsInfo, bankRewardsInfoParsed),
                ...getDataFromObject(LOCATION_FIELDS, locationStoreInfoParsed),
                isConciergeCurbsideEnabled: isConciergeCurbsideEnabled(options, configurationParsed),
                isSDDRougeFreeShipEligible: isSDDRougeFreeShipEligible({
                    ...options,
                    enableSameDayShippingUS,
                    enableSameDayShippingCA,
                    vibSegment
                }),
                isSDDRougeTestEnabled
            },
            smsStatus,
            ...taxInfo
        };

        return Promise.allSettled(dependentApiCalls.map(call => call.apiCall)).then(results => {
            const endTimeSecondBadge = getDiffTime(startTimerSecondBadge);
            logger.info(`It took ${endTimeSecondBadge}ms to run the last API endpoints for getFullProfile Call on Woody`);
            const apiResponses = [];
            let isAccessTokenExpired = false;

            //iterate through the results and call the corresponding result handler for every api
            results.forEach((result, index) => {
                const parsedData = dependentApiCalls[index].handler(result);

                if (isError(result, parsedData)) {
                    const errorReason = safelyParse(result?.reason, false) || {};

                    if (!isAccessTokenExpired && errorReason.statusCode === 401) {
                        isAccessTokenExpired = true;
                    }

                    apiResponses.push(parseErrorResponse(errorReason, parsedData));
                } else {
                    apiResponses.push(parsedData);
                }
            });

            //construct obj for UFE
            const apiResponsesObject = Object.fromEntries(apiResponses);

            if (isEmptyObject(apiResponsesObject.availableRRCCoupons)){
                apiResponsesObject.availableRRCCoupons = DEFAULT_AVAILABLE_RRC_COUPONS;
            }

            if (isEmptyObject(apiResponsesObject.personalizedPromotions)) {
                apiResponsesObject.personalizedPromotions = DEFAULT_PERSONALIZED_PROMOTIONS;
            }

            const preferredZipCodeOrDefault = getPreferredZipCodeOrDefault(preferredZipCode, options);

            Object.assign(responseToUFE.profile, {
                preferredZipCode: preferredZipCodeOrDefault
            });

            Object.assign(responseToUFE, apiResponsesObject);


            if ([403, 404].includes(profileIdInfo?.reason?.statusCode)){
                const {
                    errorCode, errorMessage
                } = getProfileErrorData(profileIdInfo.reason.statusCode, options.profileId);
                Object.assign(responseToUFE.profile, {
                    errorCode,
                    errorMessage
                });
            }

            const filteredResponseToUFE = filterResponseToUFE(responseToUFE, includeApis, skipApis);

            return sendAPIJsonResponse(response, filteredResponseToUFE);
        }).catch(e => {
            return sendAPIJsonResponse(response, {}, e);
        });
    } catch (error) {
        return sendAPIJsonResponse(response, {}, error);
    }
}

export default getUserFull;
