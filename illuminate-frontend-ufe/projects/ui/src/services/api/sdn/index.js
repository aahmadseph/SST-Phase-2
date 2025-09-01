// This module provides API call methods for SDN store API endpoint:
// https://stage-developer.sephora.com/specs/v1/docs/store.html

const bvToken = 'BV_AUTH_TOKEN';
const ufeToken = 'UFE_AUTH_TOKEN';

import sdnToken from 'services/api/sdn/sdnToken';

import addPaymentCreditCard from 'services/api/happening/addPaymentCreditCard';
import getActivitiesContent from 'services/api/happening/getActivitiesContent';
import getActivityEDPContent from 'services/api/happening/getActivityEDPContent';
import getStoreDetailsContent from 'services/api/happening/getStoreDetailsContent';
import getUserReservations from 'services/api/happening/getUserReservations';
import getApptDetailsContent from 'services/api/happening/getApptDetailsContent';
import getServiceBookingDetails from 'services/api/happening/getServiceBookingDetails';
import getServiceBookingDates from 'services/api/happening/getServiceBookingDates';
import getServiceBookingSlots from 'services/api/happening/getServiceBookingSlots';
import getApptConfirmationContent from 'services/api/happening/getApptConfirmationContent';
import getWaitlistBookingContent from 'services/api/happening/getWaitlistBookingContent';
import getWaitlistConfirmationContent from 'services/api/happening/getWaitlistConfirmationContent';
import getWaitlistReservationContent from 'services/api/happening/getWaitlistReservationContent';
import postApptReservation from 'services/api/happening/postApptReservation';
import deleteApptReservation from 'services/api/happening/deleteApptReservation';
import deletePaymentCreditCard from 'services/api/happening/deletePaymentCreditCard';
import getPaymentOptions from 'services/api/happening/getPaymentOptions';
import updatePaymentCreditCard from 'services/api/happening/updatePaymentCreditCard';
import getUserPaymentInfo from 'services/api/happening/getUserPaymentInfo';
import getSeasonalContent from 'services/api/happening/getSeasonalContent';
import getShopMyStore from 'services/api/happening/getShopMyStore';
import getShopSameDay from 'services/api/happening/getShopSameDay';
import getShopStoreAndDeliverySLA from 'services/api/happening/getShopStoreAndDeliverySLA';

import getBrandsList from 'services/api/reverseLookUp/getBrandsList';
import getProductIdLab from 'services/api/reverseLookUp/getProductIdLab';
import getProductList from 'services/api/reverseLookUp/getProductList';
import getProductSkuList from 'services/api/reverseLookUp/getProductSkuList';
import getReverseLookUpSkuDetails from 'services/api/reverseLookUp/getReverseLookUpSkuDetails';
import getMultiMatch from 'services/api/reverseLookUp/getMultiMatch';
import getLABCodeDescription from 'services/api/reverseLookUp/getLABCodeDescription';

import notificationsApi from 'services/api/notifications';
import getFulfillmentOptions from 'services/api/upfunnel/getFulfillmentOptions';

import gameOptIn from 'services/api/gamification/gameOptIn';
import acknowledgeGameCompletion from 'services/api/gamification/acknowledgeGameCompletion';
import challengeMessage from 'services/api/gamification/challengeMessage';

import getItemSubstitutionProductRecs from 'services/api/itemSubstitution/getItemSubstitutionProductRecs';
import validatePromo from 'services/api/targetedLandingPage/validatePromo';

import contactUs from 'services/api/utility/contactUs/contactUsSDN';
import subjects from 'services/api/utility/contactUs/subjects';
import getDetailedClientSummary from 'services/api/beautyInsider/getDetailedClientSummary';
import { lookupEmailAndPhone } from 'services/api/profile/getProfile';

const withSdnToken = sdnToken.withSdnToken;

export default {
    addPaymentCreditCard,
    getActivitiesContent: withSdnToken(getActivitiesContent, ufeToken),
    getActivityEDPContent: withSdnToken(getActivityEDPContent, ufeToken),
    getStoreDetailsContent: withSdnToken(getStoreDetailsContent, ufeToken),
    getUserReservations: withSdnToken(getUserReservations, ufeToken),
    getApptDetailsContent: withSdnToken(getApptDetailsContent, ufeToken),
    getServiceBookingDetails: withSdnToken(getServiceBookingDetails, ufeToken),
    getServiceBookingDates: withSdnToken(getServiceBookingDates, ufeToken),
    getServiceBookingSlots: withSdnToken(getServiceBookingSlots, ufeToken),
    getApptConfirmationContent: withSdnToken(getApptConfirmationContent, ufeToken),
    getWaitlistBookingContent: withSdnToken(getWaitlistBookingContent, ufeToken),
    getWaitlistConfirmationContent: withSdnToken(getWaitlistConfirmationContent, ufeToken),
    getWaitlistReservationContent: withSdnToken(getWaitlistReservationContent, ufeToken),
    postApptReservation: withSdnToken(postApptReservation, ufeToken),
    deleteApptReservation: withSdnToken(deleteApptReservation, ufeToken),
    deletePaymentCreditCard,
    getPaymentOptions,
    updatePaymentCreditCard,
    getUserPaymentInfo: withSdnToken(getUserPaymentInfo, ufeToken),
    getSeasonalContent: withSdnToken(getSeasonalContent, ufeToken),
    getBrandsList: withSdnToken(getBrandsList, bvToken),
    getProductIdLab: withSdnToken(getProductIdLab, bvToken),
    getProductList: withSdnToken(getProductList, bvToken),
    getProductSkuList: withSdnToken(getProductSkuList, bvToken),
    getMultiMatch: withSdnToken(getMultiMatch, bvToken),
    getLABCodeDescription: withSdnToken(getLABCodeDescription, bvToken),
    getReverseLookUpSkuDetails,
    getFulfillmentOptions,
    gameOptIn: withSdnToken(gameOptIn.gameOptIn, ufeToken),
    acknowledgeGameCompletion: withSdnToken(acknowledgeGameCompletion.acknowledgeGameCompletion, ufeToken),
    challengeMessage: withSdnToken(challengeMessage.challengeMessage, ufeToken),
    getDetailedClientSummary: withSdnToken(getDetailedClientSummary, ufeToken),
    // Notification service
    notifyCurbsidePickup: withSdnToken(notificationsApi.curbsidePickupCheckin, ufeToken),
    getItemSubstitutionProductRecs: getItemSubstitutionProductRecs,
    validatePromo: withSdnToken(validatePromo, ufeToken),
    contactUs: withSdnToken(contactUs, ufeToken),
    subjects: withSdnToken(subjects, ufeToken),
    getShopMyStore: withSdnToken(getShopMyStore, ufeToken),
    getShopSameDay: withSdnToken(getShopSameDay, ufeToken),
    getShopStoreAndDeliverySLA: withSdnToken(getShopStoreAndDeliverySLA, ufeToken),
    lookupEmailAndPhone: withSdnToken(lookupEmailAndPhone, ufeToken)
};
