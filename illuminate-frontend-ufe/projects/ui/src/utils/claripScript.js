import { isUfeEnvProduction } from 'utils/Env';
import Location from 'utils/Location';
import gpcUtils from 'utils/gpc';
import locateUtils from 'utils/LanguageLocale';
import cookieUtils from 'utils/Cookies';

const CLARIP_CONSENT_ACCEPT_ALL = '0,1';
const CLARIP_CONSENT_ACCEPT_NECESSARY = '0';

const clientName = isUfeEnvProduction ? 'sephora' : 'sephora1';
let resourcesLoaded = false;
const isCanada = locateUtils.isCanada();
const isFrench = locateUtils.isFrench();
const claripScriptName = isCanada ? 'cookieconsent' : 'donotsell';
const claripCookieManagerIdentifier = isCanada
    ? isUfeEnvProduction
        ? isFrench
            ? '23c402bff0fdc1b8b03d'
            : '8be9b3199f0d4c23491a'
        : isFrench
            ? '2103f7c4af3731dc37de'
            : '6530f0a12af0a4194ad8'
    : '';

function initialize() {
    if (!Sephora.isNodeRender) {
        const claripHost = `${clientName}.clarip.com`;
        window.globalDnsDeployment = true;
        window.claripHost = claripHost;
        window.claripCdnHost = 'cdn.clarip.com';
        window.clientName = clientName;
        window.dnsControllerType = 'option-2';
        window.dnsSubmissionUrl = `https://${claripHost}/dsr/success`;
        window.standardDsrFormUrl = `https://${claripHost}/dsr/create?type=3`;
        window.createDoNotSellLink = 0;
        window.doNotSellLinkSelector = '#clarip-do-not-sell-link';
        window.doNotSellCookieName = 'ccpaConsentCookie';
        window.doNotSellCookieValue = '1';
        window.doNotSellCookieExpirationAge = 5475;
        window.enableEnforcementScope = false;
        window.dynamicDSRFormFieldsPrefill = true;

        // If user is in Canada, add claripCookieManagerIdentifier and claripCookieConsentSubmissionCallback
        if (isCanada) {
            window.claripCookieConsentHost = claripHost;
            window.claripClientName = clientName;
            window.claripCookieManagerIdentifier = claripCookieManagerIdentifier;
            window.claripCookieConsentSubmissionCallback = consentValue => {
                const consentValueString = consentValue ? consentValue.toString() : cookieUtils.read(cookieUtils.KEYS.SEPHORA_CLARIP_CONSENT);

                if (consentValueString === CLARIP_CONSENT_ACCEPT_NECESSARY) {
                    cookieUtils.write(cookieUtils.KEYS.CCPA_CONSENT_COOKIE, '1');
                }

                if (consentValueString === CLARIP_CONSENT_ACCEPT_ALL) {
                    cookieUtils.delete(cookieUtils.KEYS.CCPA_CONSENT_COOKIE);
                }

                resourcesLoaded = true;

                Location.reload();
            };
        } else {
            window.claripDNSSSubmissionWebCallback = () => {
                gpcUtils.deleteAllCookiesExceptAllowed();
                Location.reload();
                resourcesLoaded = true;
            };
        }
    }
}

function loadScripts(onload) {
    const consentScript = document.createElement('script');
    consentScript.type = 'text/javascript';
    consentScript.src = `https://cdn.clarip.com/${clientName}/${claripScriptName}/assets/js/${claripScriptName}.min.js`;
    consentScript.onload = onload;
    document.body.appendChild(consentScript);

    // If user is in Canada, adds this extra script provided by Clarip
    if (isCanada) {
        const managerScript = document.createElement('script');
        managerScript.type = 'text/javascript';
        managerScript.src = `https://cdn.clarip.com/${clientName}/${claripScriptName}/assets/js/clarip-cookie-manager.min.js`;
        managerScript.onload = onload;
        document.body.appendChild(managerScript);
    }
}

function loadStylesheets() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = isCanada
        ? `https://cdn.clarip.com/${clientName}/${claripScriptName}/assets/css/${claripScriptName}.min.css`
        : `https://cdn.clarip.com/${clientName}/${claripScriptName}/assets/css/${claripScriptName}-extended.min.css`;
    document.body.appendChild(link);
}

function load(onload) {
    if (!Sephora.isNodeRender) {
        if (!resourcesLoaded) {
            loadScripts(onload);
            loadStylesheets();
        }
    }
}

export {
    initialize, load, CLARIP_CONSENT_ACCEPT_ALL, CLARIP_CONSENT_ACCEPT_NECESSARY
};
