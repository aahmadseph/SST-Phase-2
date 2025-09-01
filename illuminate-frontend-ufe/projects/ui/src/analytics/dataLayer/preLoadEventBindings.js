//Bind Data that needs to be ready before the 'load' event which triggers all the rest

/* This is also in loadAnalytics.js so order is explicit, but its also here in-case this file
 ** is ever required before that file runs. */
import 'analytics/dataLayer/digitalData';

import bindingMethods from 'analytics/bindingMethods/pages/all/generalBindings';
import localeUtils from 'utils/LanguageLocale';
import ApplePay from 'services/ApplePay';
import store from 'store/Store';

import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

import marketingReferrer from 'analytics/utils/marketingReferrer';
const { storeReferrer } = marketingReferrer;

const currentUser = store.getState().user;
const digitalData = window.digitalData;

/* Prerequisites *
 ** These need to be set first because some bindings depend on them.
 ** The order of these prerequisites matters as well, and they are numbered accordingly */

// Don't try to set pageName if it already exists
if (!digitalData.page.pageInfo.pageName) {
    digitalData.page.pageInfo.pageName = bindingMethods.getPageName(digitalData.page.attributes.path, {
        user: currentUser,
        rawPagePath: Sephora.analytics.backendData.pageType
    });
}

if (!digitalData.page.attributes.additionalPageInfo) {
    digitalData.page.attributes.additionalPageInfo = bindingMethods.getAdditionalPageInfo(digitalData.page.attributes.path);
}

digitalData.page.pageInfo.language = localeUtils.getCurrentLanguage();

/**** End Prerequisites *****/

if (!digitalData.page.attributes.sephoraPageInfo.pageName) {
    digitalData.page.attributes.sephoraPageInfo.pageName = bindingMethods.getSephoraPageName();
}

bindingMethods.setUserPropsWithCurrentData();

//Account - SiteCatalyst :: Account ID
digitalData.page.attributes.reportSuiteId = bindingMethods.getReportSuiteId();

//Check for Apple Pay Eligibility
if (Sephora.isMobile()) {
    // The first time the site loads, we don't get the value por Apple Pay Eligibility
    // beacause of a timing issue, but it is saved in the store to work around that
    // on subsequent page loads.
    let isEligible = Storage.local.getItem(LOCAL_STORAGE.APPLE_PAY_ELIGIBILITY);

    digitalData.page.attributes.eligibility.applePayEligibility = isEligible || 'not eligible';

    ApplePay.checkApplePayments(canMakePayments => {
        isEligible = canMakePayments === ApplePay.TYPES.ENABLED ? 'eligible' : 'not eligible';

        // Mapping of eVar101 to Apply Pay Eligibility is done in Signal
        digitalData.page.attributes.eligibility.applePayEligibility = isEligible;
        Storage.local.setItem(LOCAL_STORAGE.APPLE_PAY_ELIGIBILITY, isEligible);
    });
}

// Marketing Referrer
storeReferrer();
