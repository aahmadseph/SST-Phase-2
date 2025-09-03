// This module provides API call methods for Sephora Commerce Profile APIs:
// https://jira.sephora.com/wiki/display/ILLUMINATE/Profile+APIs

import createUserApi from 'services/api/profile/createUser';
import getProfileFullInformation from 'services/api/profile/getProfileFullInformation';
import shoppingListApi from 'services/api/profile/shoppingList';
import getOrderHistory from 'services/api/profile/getOrderHistory';
import updateProfile from 'services/api/profile/updateProfile';
import removePayPalFromProfile from 'services/api/profile/removePayPalFromProfile';
import cancelSubscription from 'services/api/profile/cancelSubscription';
import setNickname from 'services/api/profile/setNickname';
import removeDefaultPaymentFromProfile from 'services/api/profile/removeDefaultPaymentFromProfile';
import getCreditCardsFromProfile from 'services/api/profile/creditCards/getCreditCardsFromProfile';
import setDefaultCreditCardOnProfile from 'services/api/profile/creditCards/setDefaultCreditCardOnProfile';
import addCreditCardToProfile from 'services/api/profile/creditCards/addCreditCardToProfile';
import updateCreditCardOnProfile from 'services/api/profile/creditCards/updateCreditCardOnProfile';
import removeCreditCardFromProfile from 'services/api/profile/creditCards/removeCreditCardFromProfile';
import getCustomerInformation from 'services/api/profile/creditCards/getCustomerInformation';
import submitCreditCardApplication from 'services/api/profile/creditCards/submitCreditCardApplication';
import promotionalEmails from 'services/api/profile/mailingPreferences/promotionalEmails';
const { getPromotionalEmailPreferences, setPromotionalEmailPreferences } = promotionalEmails;
import postalMail from 'services/api/profile/mailingPreferences/postalMail';
const { getPostalMailPreferences, setPostalMailPreferences } = postalMail;
import getUserSpecificProductDetails from 'services/api/profile/getUserSpecificProductDetails';
import enrollToSephoraEmails from 'services/api/profile/enrollToSephoraEmails';
import getLithiumSSOToken from 'services/api/profile/getLithiumSSOToken';
import addShippingAddress from 'services/api/profile/addresses/addShippingAddress';
import getShippingAddresses from 'services/api/profile/addresses/getShippingAddresses';
import removeShippingAddress from 'services/api/profile/addresses/removeShippingAddress';
import updateShippingAddress from 'services/api/profile/addresses/updateShippingAddress';
import setDefaultShippingAddress from 'services/api/profile/addresses/setDefaultShippingAddress';
import getProfileSamples from 'services/api/profile/getProfileSamples';
import switchCountry from 'services/api/profile/switchCountry';
import applySephoraCreditCard from 'services/api/profile/applySephoraCreditCard';
import getPreScreenDetails from 'services/api/profile/getPreScreenDetails';
import getProfileSettings from 'services/api/profile/getProfileSettings';
import getRealtimePreScreenDetails from 'services/api/profile/getRealtimePreScreenDetails';
import getTargetersContent from 'services/api/profile/getTargetersContent';
import switchPreferredStore from 'services/api/profile/reserveOnlinePickUpInStore/switchPreferredStore';
import getRopisSpecificProductDetails from 'services/api/profile/getRopisSpecificProductDetails';
import getSameDaySpecificProductDetails from 'services/api/profile/getSameDaySpecificProductDetails';
import updatePreferredZipCode from 'services/api/profile/updatePreferredZipCode';
import promotions from 'services/api/profile/promotions';
import updateBeautyPreferences from 'services/api/profile/updateBeautyPreferences';
import customerLimitQuery from 'services/api/profile/customerLimit/customerLimitQuery.js';
import addDefaultPaymentToProfile from 'services/api/profile/addDefaultPaymentToProfile';

import getProfile from 'services/api/profile/getProfile';

const { getPublicProfileByNickname, getCurrentProfileEmailSubscriptionStatus, lookupProfileByLogin, getProfileForPasswordReset } = getProfile;

import getProfileIdentifiers from 'services/api/profile/getProfileIdentifiers';

const { getProfileIdentifiersByNickname, getProfileIdentifiersByPublicId, getProfileIdentifiersByProfileId } = getProfileIdentifiers;

import notificationsAndReminders from 'services/api/profile/mailingPreferences/notificationsAndReminders';

const { getNotificationsAndRemindersPreferences, setNotificationsAndRemindersPreferences } = notificationsAndReminders;

import getCapEligibility from 'services/api/profile/getCapEligibility';

export default {
    createUser: createUserApi.createUser,

    getPublicProfileByNickname,
    getCurrentProfileEmailSubscriptionStatus,
    getProfileIdentifiersByNickname,
    getProfileIdentifiersByPublicId,
    getShoppingList: shoppingListApi.getShoppingList,
    addItemsToShoppingList: shoppingListApi.addItemsToShoppingList,
    removeItemsFromShoppingList: shoppingListApi.removeItemsFromShoppingList,
    renameSharableList: shoppingListApi.renameSharableList,
    addItemToSharableList: shoppingListApi.addItemToSharableList,
    removeItemFromSharableList: shoppingListApi.removeItemFromSharableList,
    getSkusFromAllLists: shoppingListApi.getSkusFromAllLists,
    lookupProfileByLogin,
    getProfileForPasswordReset,
    getProfileFullInformation,
    getProfileIdentifiersByProfileId,
    getOrderHistory,
    updateProfile,
    removePayPalFromProfile,
    cancelSubscription,
    setNickname,
    removeDefaultPaymentFromProfile,
    addDefaultPaymentToProfile,

    getCreditCardsFromProfile,
    setDefaultCreditCardOnProfile,
    addCreditCardToProfile,
    updateCreditCardOnProfile,
    removeCreditCardFromProfile,
    getCustomerInformation,
    submitCreditCardApplication,

    addShippingAddress,
    getShippingAddresses,
    removeShippingAddress,
    updateShippingAddress,
    setDefaultShippingAddress,

    getPromotionalEmailPreferences,
    setPromotionalEmailPreferences,
    getNotificationsAndRemindersPreferences,
    setNotificationsAndRemindersPreferences,
    getPostalMailPreferences,
    setPostalMailPreferences,

    getUserSpecificProductDetails,

    enrollToSephoraEmails,

    getLithiumSSOToken,

    getProfileSamplesByDSG: getProfileSamples.getProfileSamplesByDSG,

    switchCountry,

    applySephoraCreditCard,
    getPreScreenDetails,
    getProfileSettings,
    getRealtimePreScreenDetails,
    getTargetersContent,

    switchPreferredStore,
    getRopisSpecificProductDetails,

    getSameDaySpecificProductDetails,
    updatePreferredZipCode,

    getPersonalizedPromotions: promotions.getPersonalizedPromotions,
    updateBeautyPreferences,
    getCapEligibility,
    customerLimitQuery
};
