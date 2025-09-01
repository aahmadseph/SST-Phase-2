import { makeRequest } from 'services/api/ufeApi';
import languageLocale from 'utils/LanguageLocale';
import rougeExclusiveUtils from 'utils/rougeExclusive';
import userUtils from 'utils/User';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const { getCurrentCountry, getCurrentLanguage } = languageLocale;

const SOURCE_TYPES = {
    CHECKOUT: 'checkout',
    PROFILE: 'profile',
    SNAPSHOT: 'snapshot',
    ORDER_CONFIRMATION: 'orderConfirmation'
};

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+BI+Rewards+Group+API
function _getBiRewardsGroup(source, options) {
    const { useLXSBiRewards = false } = Sephora.configurationSettings;
    const isUserAnonymous = userUtils.isAnonymous();
    const biAccountId = userUtils.getBiAccountId() || Storage.local.getItem(LOCAL_STORAGE.USER_DATA)?.profile?.beautyInsiderAccount?.biAccountId;
    let url = '/api/bi/rewards?source=' + source;
    let headers;

    if (useLXSBiRewards) {
        const baseUrl = '/gway/v1/lxs/rewards';
        const loyaltyIdParam = !isUserAnonymous && biAccountId ? `&loyaltyId=${biAccountId}` : '';
        const defaultSAZipCode = userUtils.getDefaultSAZipCode();
        const defaultSACountryCode = userUtils.getDefaultSACountryCode();

        url = `${baseUrl}?source=${source}${loyaltyIdParam}`;

        headers = {
            'x-requested-source': 'web',
            ...(defaultSAZipCode && { defaultSAZipCode }),
            ...(defaultSACountryCode && { defaultSACountryCode })
        };
    } else if (options?.userId) {
        const country = getCurrentCountry();
        const language = getCurrentLanguage();

        url = `/gapi/loyalty-rewards/${options.userId}/elegible-rewards?ch=web&loc=${language}-${country}`;
    }

    return makeRequest(url, { method: 'GET', headers }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

function getBiRewardsGroupForCheckout(options) {
    if (rougeExclusiveUtils.isRougeExclusiveEnabled) {
        return _getBiRewardsGroup(SOURCE_TYPES.CHECKOUT, options);
    }

    return _getBiRewardsGroup(SOURCE_TYPES.CHECKOUT);
}

function getBiRewardsGroupForProfile(options) {
    if (rougeExclusiveUtils.isRougeExclusiveEnabled) {
        return _getBiRewardsGroup(SOURCE_TYPES.PROFILE, options);
    }

    return _getBiRewardsGroup(SOURCE_TYPES.PROFILE);
}

function getBiRewardsGroupForSnapshot() {
    return _getBiRewardsGroup(SOURCE_TYPES.SNAPSHOT);
}

function getBiRewardsGroupForOrderConf() {
    return _getBiRewardsGroup(SOURCE_TYPES.ORDER_CONFIRMATION);
}

export default {
    getBiRewardsGroupForCheckout,
    getBiRewardsGroupForProfile,
    getBiRewardsGroupForSnapshot,
    getBiRewardsGroupForOrderConf
};
