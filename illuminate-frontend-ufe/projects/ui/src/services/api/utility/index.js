// This module provides API call methods for Sephora Commerce Utility APIs:
// https://jira.sephora.com/wiki/display/ILLUMINATE/Utility+APIs

import storeLocator from 'services/api/utility/storeLocator';
import getAboutMeReviewQuestions from 'services/api/utility/getAboutMeReviewQuestions';
import getAdvocacyLandingPageContent from 'services/api/utility/getAdvocacyLandingPageContent';
import getAdvocacyLandingPageContentSDN from 'services/api/utility/getAdvocacyLandingPageContentSDN';
import addToPromotion from 'services/api/utility/addToPromotion';
import enrollCampaign from 'services/api/utility/enrollCampaign';
import getCountryList from 'services/api/utility/getCountryList';
import getShippingCountryList from 'services/api/utility/getShippingCountryList';
import getSubscriptionCancelReasons from 'services/api/utility/getSubscriptionCancelReasons';
import getGiftCardBalance from 'services/api/utility/getGiftCardBalance';
import getStateAndCityForZipCode from 'services/api/utility/getStateAndCityForZipCode';
import getStateList from 'services/api/utility/getStateList';
import getLocation from 'services/api/utility/getLocation';
import contactUs from 'services/api/utility/contactUs/contactUs';
import resetSessionExpiry from 'services/api/utility/resetSessionExpiry';
import validateAddress from 'services/api/utility/validateAddress';
import isUserEligible from 'services/api/utility/isUserEligible';
import getHighlightedReviews from 'services/api/utility/getHighlightedReviews';

import requestEmailNotification from 'services/api/utility/requestEmailNotification';
const { requestEmailNotificationForSubscriptionType, cancelEmailNotificationRequest } = requestEmailNotification;

export default {
    storeLocator,
    getAboutMeReviewQuestions,
    enrollCampaign,
    getAdvocacyLandingPageContent,
    getAdvocacyLandingPageContentSDN,
    addToPromotion,
    getCountryList,
    getShippingCountryList,
    getSubscriptionCancelReasons,
    getGiftCardBalance,
    getStateAndCityForZipCode,
    getStateList,
    getHighlightedReviews,
    requestEmailNotificationForSubscriptionType,
    cancelEmailNotificationRequest,
    getLocation,
    contactUs,
    resetSessionExpiry,
    validateAddress,
    isUserEligible
};
