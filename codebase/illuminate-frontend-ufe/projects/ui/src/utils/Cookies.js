import Crypto from 'utils/Crypto';
import Storage from 'utils/localStorage/Storage';
import gpcUtils from 'utils/gpc';
import locationUtils from 'utils/Location';

const KEYS = {
    GPC: 'gpc',
    CCPA_CONSENT_COOKIE: 'ccpaConsentCookie',
    DEVICE_TYPE: 'device_type',
    IS_PREVIEW_ENV_COOKIE: 'preview',
    PREVIEW_COOKIE: 'previewdate',
    SEPH_SESSION: 'SephSession',
    P13N_PRV: 'prv',
    QUEBEC_YES: 'quebec_yes',
    SEPHORA_CLARIP_CONSENT: 'sephora_clarip_consent',
    RCPS_PROFILE_SHIPPING_GROUP: 'rcps_profile_shipping_group',
    RCPS_PROFILE_ACCOUNT_GROUP: 'rcps_profile_account_group',
    RCPS_PROFILE_INFO_GROUP: 'rcps_profile_info_group',
    RCPS_FULL_PROFILE_GROUP: 'rcps_full_profile_group',
    RCPS_PROFILE_BI_GROUP: 'rcps_profile_bi_group',
    RCPS_CC: 'rcps_cc',
    RCPS_LL: 'rcps_ll',
    RCPS_CCAP: 'rcps_ccap',
    PREFERRED_STORE: 'preferredStore',
    PREVIEW_CUSTOMER: 'cust360',
    RCPS_SLS: 'rcps_sls',
    ILLINOIS_YES: 'illinois_yes',
    NGP_USERREG: 'ngp_userreg'
};

// Ignoring cookies related to atg decom: https://jira.sephora.com/browse/UA-2213
const ignoreATGDynAndJsessionId = Boolean(Sephora?.configurationSettings?.ignoreATGDynAndJsessionId) || false;

if (!ignoreATGDynAndJsessionId) {
    KEYS.SESSIONID = 'JSESSIONID';
    KEYS.DYN_USER_ID = 'DYN_USER_ID';
    KEYS.DYN_USER_CONFIRM = 'DYN_USER_CONFIRM';
}

const writeCookieMillis = (name, value, millis = 0, onTopDomain = false, shouldEncode) => {
    var cookieStr = shouldEncode ? encodeURIComponent(name) + '=' + encodeURIComponent(value) : name + '=' + value;

    if (typeof document === 'undefined' && typeof global.document === 'undefined') {
        return;
    }

    if (millis !== 0) {
        var now = new Date();
        var then = new Date(now.getTime() + millis);
        var exp = then.toGMTString();
        cookieStr += '; expires=' + exp;
    }

    cookieStr += '; path=/';

    if (onTopDomain) {
        var dom;
        var parts;

        if (isNaN(parseInt(document.domain.replace(/\./g, '')))) {
            parts = document.domain.split('.');
            dom = parts.slice(-2).join('.');
        } else {
            dom = document.domain;
        }

        cookieStr += ';domain=' + dom;
    }

    document.cookie = cookieStr + ';SameSite=Lax';
};

const recalculateCookiesSize = () => {
    const { size } = new Blob([document.cookie]);
    digitalData.performance.cookiesSize = size;
};

const writeCookie = (name, value, days = 365, top, shouldEncode = true) => {
    writeCookieMillis(name, value, days * 86400000, top, shouldEncode);
    recalculateCookiesSize();
};

const deleteCookie = (key, top) => {
    writeCookieMillis(key, null, -1, top);
};

const readCookie = key => {
    if (typeof document === 'undefined' && typeof global.document === 'undefined') {
        return null;
    }

    const cookies = ('' + global.document.cookie).split('; ');

    for (let i = 0; i < cookies.length; ++i) {
        const currentCookie = cookies[i].split(/\=(.+)/).filter(Boolean);

        if (currentCookie.length !== 2) {
            /* eslint no-continue: 0 */
            continue;
        }

        const name = global.decodeURIComponent(currentCookie[0]);

        if (key === name) {
            return global.decodeURIComponent(currentCookie[1]);
        }
    }

    return null;
};

/**
 * GPC compliance in this case is reading a globalPrivacyControl from the navigator
 * and sync it with the gpc cookie. If flag turns to true - set a cookie, remove 1st party
 * cookies except allowed and reload the page
 * @returns {void}
 */
const complyGPC = () => {
    // Reaction to the GPC (https://jira.sephora.com/browse/UTS-2841)
    const userAgentGPCFlag = window.navigator.globalPrivacyControl || false;
    const gpcCookie = readCookie(KEYS.GPC);

    if (userAgentGPCFlag && gpcCookie !== '1') {
        gpcUtils.deleteAllCookiesExceptAllowed();
        writeCookie(KEYS.GPC, 1);

        locationUtils.reload();
    } else if (!userAgentGPCFlag && gpcCookie) {
        deleteCookie(KEYS.GPC);
    }
};

/**
 * SephSession is a cookie that will live in between user sessions.
 * The cookie also persists on all pages.
 * The cookie will live for 2 years.
 * @returns {void}
 */
const initializeSessionCookie = () => {
    const key = 'SephSession';

    if (!readCookie(key)) {
        const uuid = Crypto.createRandomUUID();
        const expiryInDays = 730;
        const expiryInMilliseconds = expiryInDays * 24 * 60 * 60 * 1000;
        writeCookie(key, uuid, expiryInDays);
        Storage.db.setItem(key, uuid, expiryInMilliseconds);
    }
};

/**
 * Verifies if the CCPA or the GPC cookie enables the tracking of information.
 * True => Client doesn't allow tracking.
 * False => Client Allows tracking.
 * @returns {boolean}
 */
const isCCPAEnabled = () => {
    return readCookie(KEYS.CCPA_CONSENT_COOKIE) === '1' || readCookie(KEYS.GPC) === '1';
};

const isRCPShippingAPIEnabled = () => {
    return readCookie(KEYS.RCPS_PROFILE_SHIPPING_GROUP) === 'true';
};

const isRCPSAccountAPIEnabled = () => {
    return readCookie(KEYS.RCPS_PROFILE_ACCOUNT_GROUP) === 'true';
};

const isRCPSProfileInfoGroupAPIEnabled = () => {
    return readCookie(KEYS.RCPS_PROFILE_INFO_GROUP) === 'true';
};

const isRCPSProfileBiGroupAPIEnabled = () => {
    return readCookie(KEYS.RCPS_PROFILE_BI_GROUP) === 'true';
};

const isRCPSCCEnabled = () => {
    return readCookie(KEYS.RCPS_CC) === 'true';
};

const isRCPSLLEnabled = () => {
    return readCookie(KEYS.RCPS_LL) === 'true';
};

const isRCPSFullProfileGroup = () => {
    return readCookie(KEYS.RCPS_FULL_PROFILE_GROUP) === 'true';
};

const isRCPSCCAPEnabled = () => {
    return readCookie(KEYS.RCPS_CCAP) === 'true';
};

const isRCPSSLSEnabled = () => {
    return readCookie(KEYS.RCPS_SLS) === 'true';
};

const isNGPUserRegEnabled = () => {
    return readCookie(KEYS.NGP_USERREG) === 'true';
};

function initialize() {
    /* In future, if we want to depend only on Clarip for reading GPC signal, wrap complyGPC() in this condition - if (!Sephora.configurationSettings.isClaripPrivacyEnabled)
     */
    complyGPC();
    initializeSessionCookie();
}

export default {
    KEYS,
    initialize,
    write: writeCookie,
    delete: deleteCookie,
    read: readCookie,
    recalculateCookiesSize,
    isCCPAEnabled,
    isRCPShippingAPIEnabled,
    isRCPSAccountAPIEnabled,
    isRCPSProfileInfoGroupAPIEnabled,
    isRCPSProfileBiGroupAPIEnabled,
    isRCPSCCEnabled,
    isRCPSLLEnabled,
    isRCPSFullProfileGroup,
    isRCPSCCAPEnabled,
    isRCPSSLSEnabled,
    isNGPUserRegEnabled
};
