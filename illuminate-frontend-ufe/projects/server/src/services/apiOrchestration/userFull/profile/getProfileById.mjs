/* eslint-disable complexity */
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
import getProfileId from '#server/services/api/profile/getProfileId.mjs';
import getStoreCredits from '#server/services/api/profile/getStoreCredits.mjs';
import getSubscriptions from '#server/services/api/profile/getSubscriptions.mjs';
import getLinkedAccounts from '#server/services/api/profile/getLinkedAccounts.mjs';
import getPaymentProfileFlags from '#server/services/api/profile/getPaymentProfileFlags.mjs';
import getConfiguration from '#server/services/api/util/getConfiguration.mjs';
import getBankRewards from '#server/services/api/profile/getBankRewards.mjs';
import getPrescreenInfo from '#server/services/api/profile/getPrescreenInfo.mjs';
import getLocationStore from '#server/services/api/profile/getLocationStore.mjs';
import getRewards from '#server/services/api/profile/getRewards.mjs';
import { safelyParse } from '#server/utils/serverUtils.mjs';
import {
    sendAPI401Response,
    sendAPI403Response,
    sendAPI500Response,
    sendAPIJsonResponse,
    sendAPIStatusResponse
} from '#server/utils/sendAPIResponse.mjs';
import {
    biOptionsMap,
    getOptions,
    getDataFromObject,
    formatStoreCredits,
    formatBankRewards,
    formatPrescreenInfo,
    getProfileErrorData,
    transformAndMatchObjects,
    isError,
    isConciergeCurbsideEnabled,
    safeAsyncExecutor,
    isSDDRougeFreeShipEligible,
    handleSubscriptions,
    filterProfileProperties,
    handleLinkedAccounts,
    calculateDaysLeftToRedeem,
    defaultsByCountry,
    stringifyNumericProps,
    checkIsNonBiAccount,
    storeCreditsFormatExpirationDate,
    addCssColors,
    addStoreNameToList,
    getPreferredZipCodeOrDefault,
    setDefaultSALocationData
} from '#server/services/apiOrchestration/userFull/utils/utils.mjs';
import {
    CONFIGURATION_FIELDS,
    LOCATION_FIELDS,
    PAYMENT_PROFILE_FIELDS,
    ELIGIBLE_REWARDS_FIELDS,
    BI_CASH_LOCK_UP_MSG,
    CC_STATUS,
    BD_GIFT_LAST_DATE_TO_REDEEM,
    BIA_PROPS_TO_STRINGIFY
} from '#server/services/apiOrchestration/userFull/utils/constants.mjs';
import { COLORS_MAP } from '#server/services/apiOrchestration/userFull/utils/colorsMap.mjs';

async function getProfileById(request, response) {
    const startTimer = process.hrtime();

    try {
        const options = getOptions(request.apiOptions, request.headers);
        const {
            storeId,
            preferredZipCode,
            biAccountId
        } = options.parseQuery;
        const propertiesToSkip = (options.parseQuery?.propertiesToSkip || '').split(',');
        const profileIdInfo = await safeAsyncExecutor(getProfileId, options, request.headers);

        if (profileIdInfo?.reason?.statusCode === 404) {
            return sendAPI500Response(response, 'The profileId was not found on customer-lookup; statusCode: 404');
        }

        if (profileIdInfo.status === 'rejected') {
            response.statusCode = 404;
            return sendAPIJsonResponse(response, profileIdInfo.reason, profileIdInfo.reason);
        }

        const profileIdInfoParsed = safelyParse(profileIdInfo?.data, false) || {};
        const biAccountIdOrDefault = profileIdInfoParsed?.beautyInsiderAccount?.biAccountId || biAccountId;
        const skinTones = profileIdInfoParsed?.personalizedInformation?.skinTones || [];
        const prescreenInfo = await safeAsyncExecutor(getPrescreenInfo, {
            ...options,
            biAccountIdOrDefault
        }, request.headers);
        const prescreenInfoParsed = safelyParse(prescreenInfo?.data, false) || {};
        let bankRewardsInfo;
        let bankRewardsInfoParsed = {};
        // Need a store id for location service call to succeed
        const storeIdOrDefault = profileIdInfoParsed?.preferredStoreName || storeId || defaultsByCountry[options?.country || 'US'].storeId;
        const isNonBiAccount = checkIsNonBiAccount(profileIdInfoParsed?.accountType);

        profileIdInfoParsed.isSDUFeatureDown = false;

        const isBeautyInsiderAccount = !!profileIdInfoParsed?.beautyInsiderAccount;

        const apisToCall = [
            () => getStoreCredits({
                ...options,
                biAccountIdOrDefault
            }),
            getSubscriptions,
            () => getPaymentProfileFlags({
                ...options,
                biAccountIdOrDefault
            }),
            getConfiguration,
            () => getRewards({
                ...options,
                beautyInsiderAccount: profileIdInfoParsed?.beautyInsiderAccount
            }),
            profileIdInfoParsed?.partnerAccountPresent ? getLinkedAccounts : () => Promise.resolve({}),
            storeId ? () => getLocationStore({
                ...options,
                storeIdOrDefault
            }) : () => Promise.resolve({})
        ];

        if (profileIdInfo?.reason?.statusCode === 401) {
            return sendAPI401Response(response);
        }

        if (profileIdInfo?.reason?.statusCode === 403) {
            return sendAPI403Response(response, true);
        }

        if (profileIdInfo?.reason?.statusCode === 404){
            const {
                errorCode, errorMessage
            } = getProfileErrorData(profileIdInfo.reason.statusCode, options.profileId);

            return sendAPIStatusResponse(response, errorCode, errorMessage);
        }

        setDefaultSALocationData(profileIdInfoParsed, preferredZipCode, options);

        const dependentApiCalls = apisToCall.map(x => x({
            ...options,
            storeIdOrDefault
        }, request.headers));

        const [
            storeCreditsInfo,
            subscriptions,
            paymentProfileFlags,
            configuration,
            rewardsInfo,
            linkedAccounts,
            locationStoreInfo
        ] = await Promise.allSettled(dependentApiCalls);
        const endTime = getDiffTime(startTimer);
        logger.info(`It took ${endTime}ms to run getProfileById Call on Woody`);

        const locationStoreInfoParsed = safelyParse(locationStoreInfo?.value?.data, false) || {};
        const storeCreditsInfoParsed = safelyParse(storeCreditsInfo.value?.data, false) || {};
        const userSubscriptionsParsed = safelyParse(subscriptions.value?.data, false) || {};
        const biOptions = biOptionsMap[request.apiOptions.language];
        const paymentProfileFlagsParsed = safelyParse(paymentProfileFlags.value?.data, false) || {};
        const linkedAccountsParsed = safelyParse(linkedAccounts?.value?.data, false) || [];
        const configurationParsed = safelyParse(configuration.value?.data, false) || {};
        const rewardsInfoParsed = safelyParse(rewardsInfo.value?.data, false) || {};
        const isSubscriptionRejected = isError(subscriptions, userSubscriptionsParsed);
        const {
            enableSameDayShippingUS = false,
            enableSameDayShippingCA = false
        } = configurationParsed;
        const {
            personalizedInformation: {
                ...remainingPersonalizedInfo
            },
            ...remainingProfileIdInfoParsed
        } = profileIdInfoParsed || {};

        const profileWithoutPersonalizedInfo = filterProfileProperties(remainingProfileIdInfoParsed, locationStoreInfoParsed);

        if (prescreenInfoParsed?.ccAccountInfoLookUpOut?.ccStatus === CC_STATUS.ACTIVE &&
            prescreenInfoParsed?.ccAccountInfoLookUpOut?.ccAccountID) {
            bankRewardsInfo = await safeAsyncExecutor(getBankRewards, options, configurationParsed);
            bankRewardsInfoParsed = safelyParse(bankRewardsInfo?.data, false) || {};
        }

        if (BI_CASH_LOCK_UP_MSG in rewardsInfoParsed) {
            profileIdInfoParsed[BI_CASH_LOCK_UP_MSG] = rewardsInfoParsed[BI_CASH_LOCK_UP_MSG];
        }

        const skinTonesWithStoreNameAndColors = skinTones?.length
            ? addCssColors(addStoreNameToList(skinTones), COLORS_MAP)
            : [];

        const vibSegment = profileIdInfoParsed?.beautyInsiderAccount?.vibSegment.toUpperCase() === 'ROUGE' || false;

        if (isNonBiAccount) {
            delete profileWithoutPersonalizedInfo.beautyInsiderAccount;
            delete profileIdInfoParsed.beautyInsiderAccount;
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
                profileIdInfoParsed.beautyInsiderAccount,
                formatPrescreenInfo(prescreenInfo, prescreenInfoParsed),
                getDataFromObject(ELIGIBLE_REWARDS_FIELDS, rewardsInfoParsed),
                stringifyNumericProps(profileIdInfoParsed.beautyInsiderAccount, BIA_PROPS_TO_STRINGIFY),
                personalizedInformation ? { personalizedInformation } : {},
                skinTonesWithStoreNameAndColors?.length ? { skinTones: skinTonesWithStoreNameAndColors } : {},
                { linkedAccountDetails: handleLinkedAccounts(linkedAccounts, linkedAccountsParsed) }
            );

            profileWithoutPersonalizedInfo.beautyInsiderAccount = updatedBIAccount;
            delete profileIdInfoParsed.personalizedInformation;
        }

        if (isSubscriptionRejected && [500, 503].includes(subscriptions?.reason?.statusCode)) {
            profileIdInfoParsed.isSDUFeatureDown = true;
        }

        const preferredZipCodeOrDefault = getPreferredZipCodeOrDefault(preferredZipCode, options);

        const responseToUFE = {
            ...profileIdInfoParsed,
            ...profileWithoutPersonalizedInfo,
            ...formatStoreCredits(storeCreditsInfo, storeCreditsFormatExpirationDate(storeCreditsInfoParsed)),
            ...getDataFromObject(LOCATION_FIELDS, locationStoreInfoParsed),
            ...handleSubscriptions(subscriptions, userSubscriptionsParsed),
            ...getDataFromObject(PAYMENT_PROFILE_FIELDS, paymentProfileFlagsParsed),
            ...getDataFromObject(CONFIGURATION_FIELDS, configurationParsed),
            ...formatBankRewards(bankRewardsInfo, bankRewardsInfoParsed),
            isConciergeCurbsideEnabled: isConciergeCurbsideEnabled(options, configurationParsed),
            isSDDRougeFreeShipEligible: isSDDRougeFreeShipEligible({
                ...options,
                enableSameDayShippingUS,
                enableSameDayShippingCA,
                vibSegment
            }),
            preferredZipCode: preferredZipCodeOrDefault
        };

        if (propertiesToSkip.length) {
            propertiesToSkip.forEach(prop => delete responseToUFE[prop]);
        }

        return sendAPIJsonResponse(response, responseToUFE);
    } catch (e) {
        if (e.statusCode === 401) {
            return sendAPI401Response(response, true);
        }

        return sendAPIJsonResponse(response, {}, e);
    }
}

export default getProfileById;
