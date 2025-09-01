import cookiesUtils from 'utils/Cookies';

const AUTOMATION_RECAPTCHA_KEY = 'automation_recaptcha_key';
const PAUSE_RECAPTCHA_KEY = 'pause_recaptcha';

let reCaptchaLib = null;
let currentCallback = null;
let currentSiteKey = null;

export default {
    getReCaptchaLibrary: function () {
        if (currentSiteKey === this.getSiteKey()) {
            return reCaptchaLib;
        } else {
            return null;
        }
    },
    setReCaptchaLibrary: function (lib) {
        currentSiteKey = this.getSiteKey();
        reCaptchaLib = lib;
    },
    tokenCallback: function (token) {
        currentCallback && currentCallback(token);
        currentCallback = null;
    },
    execute: function (callback) {
        currentCallback = callback;
        reCaptchaLib && reCaptchaLib.execute();
    },
    reset: function () {
        reCaptchaLib && reCaptchaLib.reset();
    },
    getSiteKey: function () {
        return cookiesUtils.read(AUTOMATION_RECAPTCHA_KEY) || Sephora.configurationSettings.captchaSiteKey;
    },
    isPaused: function () {
        return cookiesUtils.read(PAUSE_RECAPTCHA_KEY);
    }
};
