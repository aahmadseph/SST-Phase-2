import userUtils from 'utils/User';
import basketUtils from 'utils/Basket';
import skuUtils from 'utils/Sku';
import urlUtils from 'utils/Url';
import actions from 'actions/Actions';
import targetedPromotionActions from 'actions/TargetedPromotionActions';
import personalizedPromotionsActions from 'actions/PersonalizedPromotionsActions';
import rrcCouponsActions from 'actions/RrcCouponsActions';
import smsStatusActions from 'actions/smsStatusActions';
import beautyPreferenceActions from 'actions/BeautyPreferencesActions';
import BrandsListActions from 'actions/BrandsListActions';
import updateProfile from 'services/api/profile/updateProfile';
import getProfileFullInformation from 'services/api/profile/getProfileFullInformation';
import getCreditCardsRewards from 'services/api/profile/creditCards/getCreditCardRewards';
import { createUser } from 'services/api/profile/createUser';
import { lookupProfileByLogin, getProfileForPasswordReset } from 'services/api/profile/getProfile';
import sdnApi from 'services/api/sdn';
import helperUtils from 'utils/Helpers';
import anaUtils from 'analytics/utils';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import localeUtils from 'utils/LanguageLocale';
import Location from 'utils/Location';
import cookieUtils from 'utils/Cookies';
import RCPSCookies from 'utils/RCPSCookies';
import gpcUtils from 'utils/gpc';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { KEYS as GENAI_LOCAL_STORAGE } from 'ai/utils/sessionStorage';
import Flush from 'utils/localStorage/Flush';
import fingerPrint from 'services/Fingerprint';
import createBiAccount from 'services/api/beautyInsider/createBiAccount';
import mergeBasket from 'services/api/basket/mergeBasket';
import authenticationApi from 'services/api/authentication';
import authenticationUtils from 'utils/Authentication';
import SocialInfoActions from 'actions/SocialInfoActions';
import lithiumApi from 'services/api/thirdparty/Lithium';
import getLithiumSSOToken from 'services/api/profile/getLithiumSSOToken';
import Storage from 'utils/localStorage/Storage';
import userLocationUtils from 'utils/UserLocation';
import cacheConcern from 'services/api/cache';
import catalogUtils from 'utils/Catalog';
import store from 'store/Store';
import { STORE_ID_REFINEMENTS, ZIP_CODE_REFINEMENTS } from 'constants/UpperFunnel';
import { CATALOG_API_CALL } from 'constants/Search';
import targetersActions from 'actions/targetersActions';
import BIApi from 'services/api/beautyInsider';
import bccEmailSMSOptInService from 'services/api/bccEmailSmsOptIn';
import backInStockSMSOptInService from 'services/api/backInStockSmsOptIn';
import { getProfileSamplesByDSG } from 'services/api/profile/getProfileSamples';
import TaxClaimActions from 'actions/TaxClaimActions';
import segmentsActions from 'actions/segmentsActions';
import homepageActions from 'actions/HomepageActions';
import ProductActions from 'actions/ProductActions';
import linkTrackingError from 'analytics/bindings/pages/all/linkTrackingError';
import CreditCardActions from 'actions/CreditCardActions';
import LoveActions from 'actions/LoveActions';
import decorators from 'utils/decorators';
import profileApi from 'services/api/profile';
import isCCREnabled from 'utils/ccRewards';
import SpaUtils from 'utils/Spa';
import CookieUtils from 'utils/Cookies';
import pazeUtils from 'utils/Paze';
import DefaultStoreZipCode from 'constants/defaultStoreZipCode';
import Empty from 'constants/empty';
import { updateBasket } from 'actions/RwdBasketActions';
import beautyInsiderActions from 'actions/BeautyInsiderActions';
import getStoreLocations from 'services/api/utility/storeLocator/getStoreLocations';
import storeUtils from 'utils/Store';
import { PREFERENCE_TYPES } from 'constants/beautyPreferences';
import myListsUtils from 'utils/MyLists';
import historyLocationActions from 'actions/framework/HistoryLocationActions';
import { removeSuperChatConfig } from 'ai/utils/sessionStorage';
import getLocation from 'services/api/utility/getLocation';

const { DEFAULT_STORE_ID, DEFAULT_ZIP_CODE } = DefaultStoreZipCode;
const { setUserSocialInfo, setLithiumSuccessStatus } = SocialInfoActions;
const { isAuthServiceEnabled, updateProfileStatus, storeAuthTokens } = authenticationUtils;
const { getProp, specialCharacterRegex, deferTaskExecution } = helperUtils;
const { setUserFavoriteBrandIDs } = BrandsListActions;
const { Event: scEvent } = anaConsts;
const getText = localeUtils.getLocaleResourceFile('actions/locales', 'UserActions');

const LITHIUM_SESSION_KEY_COOKIE_NAME = 'LiSESSIONID';
const LITHIUM_SSO_TOKEN_COOKIE_NAME = 'lithiumSSO:sephora.qa';

const { handleRealtimePrescreen, getCreditCardTargeters } = CreditCardActions;

const REGISTER_EXPIRY = Storage.HOURS * 2;
const PURCHASE_HISTORY_CACHE_EXPIRY = Storage.HOURS * 4;

// (!) Until that issue is solved, AVOID USING DECORATORS in this module bc/ of
// the circular dependency on the Store that make a number of tests red.
// TODO Figure out what's wrong and how to address it properly.
// TODO After the above problem is solved, leverage withInterstice to eliminate
// actions.showInterstice repetitions.
// import { withInterstice } from 'utils/decorators';
// --------------------------------------------------------------------------------------------------------------

import {
    UPDATE,
    DRAFT_STORE_DETAILS,
    DRAFT_ZIP_CODE,
    CLEAR_UPPER_FUNNEL_DRAFT,
    STORE_CHANGED_FROM_HEADER,
    ZIP_CODE_CHANGED_FROM_HEADER,
    TOGGLE_SELECT_AS_DEFAULT_PAYMENT,
    ADD_SUBSCRIBED_EMAIL,
    ADD_CC_REWARDS,
    SHOW_EMAIL_SENT_MODAL,
    UPDATE_DEFAULT_SA_DATA
} from 'constants/actionTypes/user';

const ERROR_CODES = { STORE_REGISTERED_ERROR_CODE: 202, STORE_REGISTERED_NEW_AUTH_ERROR_CODE: 201, ACCOUNT_DEACTIVATED_ERROR_CODE: -1056, FMS: 400 };

const MESSAGE_TYPES = { MERGED_BASKET: 'orderMergedMsg' };

const FROM_SITE = { CREATED_FROM_SITE: ['SEPHORA .COM MDC', 'SEPHORA .CA'] };

const FRAGMENT_FOR_UPDATE = {
    NAME: 'NAME',
    EMAIL: 'EMAIL',
    PASSWORD: 'PASSWORD',
    PHONE: 'PHONE',
    EMAIL_SUBSCRIPTION: 'EMAIL_SUBSCRIPTION'
};

// Advocacy: Save this flag on Sephora object as we just need it in the same page
function setReferrerData(reset) {
    if (Location.isReferrerPage) {
        Sephora.referrer = { hasRegister: reset ? null : true };
    }
}

/**
 * Updates user profile information in local storage subsequently updates store.
 * @param  {object} data - user profile object
 * @param  {boolean} purgeUserCache - Whether to clear user data cache. This is set to true by
 * default except when the data comes from processUserFull, which is the cache's source of data.
 */
function update(data, purgeUserCache = true) {
    if (purgeUserCache) {
        Flush.flushUser();
    }

    const nextData = {
        ...data,
        isInitialized: true
    };

    return {
        type: UPDATE,
        data: nextData
    };
}

function updateCCRewards(data) {
    return {
        type: ADD_CC_REWARDS,
        data: data
    };
}

function updatePreferredStore(userProfile, purgeUserCache = false, isCustomerSelected = false) {
    const preferredStoreObject = Object.assign(
        {},
        {
            preferredStoreInfo: {
                ...userProfile.preferredStoreInfo,
                isCustomerSelected
            }
        }
    );

    if (isCustomerSelected) {
        basketUtils.cachePickupStore(preferredStoreObject?.preferredStoreInfo, isCustomerSelected);
    }

    if (preferredStoreObject.preferredStoreInfo) {
        preferredStoreObject.preferredStore = preferredStoreObject.preferredStoreInfo.storeId;
        preferredStoreObject.preferredStoreName = preferredStoreObject.preferredStoreInfo.displayName;
    }

    return dispatch => {
        dispatch(update(preferredStoreObject, purgeUserCache));
    };
}

/**
 * makes api call to update specific parts user profile information
 * @param  {object} optionParams - object containing specific user data to update
 * @param  {func} succsesCallback - function called after succcessfully updating user info
 * @param  {func} failureCallback - function called after failing to update user itinfo
 *
 * function is called when updating small areas of user information such as email,
 * password, first and last name, social status, and email subscription info.
 *
 * after call is made successfully we need to update the store by dispatching the update func
 * so that updated values are reflected across the page.
 */
function updateUserFragment(optionParams, successCallback, failureCallback) {
    return dispatch => {
        dispatch(actions.showInterstice(true));

        updateProfile(optionParams)
            .then(data => {
                const fragmentForUpdate = optionParams.fragmentForUpdate;

                if (fragmentForUpdate === FRAGMENT_FOR_UPDATE.EMAIL) {
                    data.login = optionParams.email;
                } else if (fragmentForUpdate === FRAGMENT_FOR_UPDATE.NAME) {
                    data.firstName = optionParams.firstName;
                    data.lastName = optionParams.lastName;
                } else if (fragmentForUpdate === FRAGMENT_FOR_UPDATE.EMAIL_SUBSCRIPTION) {
                    data.emailSubscriptionInfo = optionParams.emailSubscriptionInfo;
                } else if (fragmentForUpdate === FRAGMENT_FOR_UPDATE.PHONE) {
                    data.primaryPhone = optionParams.primaryPhone;
                }

                if (data.accessToken && data.refreshToken) {
                    authenticationUtils.updateProfileStatus({
                        profileSecurityStatus: [data.profileSecurityStatus],
                        accessToken: [data.accessToken, data.atExp],
                        refreshToken: [data.refreshToken, data.rtExp]
                    });
                }

                // note: for password, there is nothing in the user store to update
                dispatch(update(data));
                successCallback(data);
            })
            .catch(error => failureCallback(error))
            .finally(() => dispatch(actions.showInterstice(false)));
    };
}

function getLithiumUserData(userInfoData) {
    return dispatch => {
        const profile = userInfoData.profile;
        const nickName = profile?.nickName;

        // Check that user has nickname before making any lithium calls
        // except on Checkout where it is not needed
        if (!nickName || Location.isCheckout()) {
            return;
        }

        // Grab existing lithium token when nickname is set. @see generateLithiumSsoToken.js
        // otherwise from full profile for now (full wont be used after ATG mig.)
        const lithSsoToken = Storage.local.getItem(LOCAL_STORAGE.LITHIUM_API_TOKEN) ?? profile.lithiumSsoToken;

        // when there is no token, set the one that came through on generateToken || user Full
        Storage.local.setItem(LOCAL_STORAGE.LITHIUM_API_TOKEN, lithSsoToken);
        lithSsoToken && cookieUtils.write(LITHIUM_SSO_TOKEN_COOKIE_NAME, lithSsoToken, null, true, false);

        const LithiumCache = Storage.local.getItem(LOCAL_STORAGE.LITHIUM_DATA);

        if (LithiumCache) {
            dispatch(setUserSocialInfo(LithiumCache));

            return;
        }

        lithiumApi
            .getAuthenticatedUserSocialInfo(nickName)
            .then(data => {
                data.isLithiumSuccessful = true;
                dispatch(setUserSocialInfo(data));
            })
            .catch(reason => {
                /* eslint-disable-next-line no-console */
                console.debug('Lithium failed post user full call: ', reason);

                //make call to get a new sso token when lithium call fails
                //to address issue of when sso token expires so that user can still view
                //community pages
                getLithiumSSOToken(profile.profileId)
                    .then(token => {
                        Storage.local.setItem(LOCAL_STORAGE.LITHIUM_API_TOKEN, token);

                        //update cookie to new token for lithiums side
                        cookieUtils.write(LITHIUM_SSO_TOKEN_COOKIE_NAME, token, null, true, false);
                    })
                    .then(() => {
                        lithiumApi.getAuthenticatedUserSocialInfo(nickName).then(data => {
                            data.isLithiumSuccessful = true;
                            dispatch(setUserSocialInfo(data));
                        });
                    })
                    .catch(() => {
                        dispatch(setLithiumSuccessStatus(false));
                    });
            });
    };
}

function getUserCreditCardRewards(userInfo) {
    const ccrEnabled = isCCREnabled();
    const { basket } = store.getState();

    // If CCR is not enabled, we don't need to make the API call to the new SCC service,
    // and we are going to use the old implementation
    let ccRewards;

    if (!ccrEnabled) {
        if (!RCPSCookies.isRCPSFullProfileGroup()) {
            ccRewards = {
                bankRewards: userInfo.profile.bankRewards,
                ccFirstTimeDiscountExpireDate: userInfo.basket.creditCardPromoDetails?.couponExpirationDate,
                firstPurchaseDiscountEligible: !!userInfo.basket.creditCardPromoDetails,
                firstPurchaseDiscountCouponCode: userInfo.basket.creditCardPromoDetails?.creditCardCouponCode,
                firstPurchaseDiscountPercentOff: parseInt(userInfo.basket.creditCardPromoDetails?.shortDisplayName)
            };
        } else {
            ccRewards = {
                bankRewards: userInfo.profile.bankRewards,
                ccFirstTimeDiscountExpireDate: basket.creditCardPromoDetails?.couponExpirationDate,
                firstPurchaseDiscountEligible: !!basket.creditCardPromoDetails,
                firstPurchaseDiscountCouponCode: basket.creditCardPromoDetails?.creditCardCouponCode,
                firstPurchaseDiscountPercentOff: parseInt(basket.creditCardPromoDetails?.shortDisplayName)
            };
        }

        return dispatch => dispatch(updateCCRewards(ccRewards));
    }

    const loyaltyId = userInfo?.profile?.beautyInsiderAccount?.biAccountId;

    // BI is a precondition to have Sephora credit card (hence rewards)
    // CCR only applies for US
    if (localeUtils.isCanada() || !loyaltyId) {
        return () => {};
    }

    return dispatch => {
        return getCreditCardsRewards({ loyaltyId })
            .then(data => {
                dispatch(updateCCRewards(data));
            })
            .catch(() => {});
    };
}

function readClaripConsent(profile) {
    const { userConsent = {} } = profile;
    const marketingOptOut = Object.prototype.hasOwnProperty.call(userConsent, 'Marketing_Opt_Out') && userConsent.Marketing_Opt_Out;
    const ccpaConsentCookie = cookieUtils.read(cookieUtils.KEYS.CCPA_CONSENT_COOKIE);

    if (marketingOptOut === true && (!ccpaConsentCookie || ccpaConsentCookie !== '1')) {
        gpcUtils.deleteAllCookiesExceptAllowed();
        cookieUtils.write(cookieUtils.KEYS.CCPA_CONSENT_COOKIE, '1');
        Location.reload();
    }
}

const ENABLE_FULL_PROFILE_GROUP = 'enablefullProfileGroup';
const RCPS_FULL_PROFILE_GROUP = 'rcps_full_profile_group';

function setFullProfileGroupInLocalStorage() {
    try {
        const isRCPSFullProfileGroup = RCPSCookies.isRCPSFullProfileGroup();
        const { enablefullProfileGroup = false } = Sephora.configurationSettings;

        Storage.local.setItem(ENABLE_FULL_PROFILE_GROUP, enablefullProfileGroup, userUtils.USER_DATA_EXPIRY);
        Storage.local.setItem(RCPS_FULL_PROFILE_GROUP, isRCPSFullProfileGroup, userUtils.USER_DATA_EXPIRY);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
}

/**
 * process user full get api request, set new target information.
 * it's possible userInfoData comes from api response or local storage cache.
 * @param  {object} userInfoData - user profile object
 * @param  {boolean} dataIsFromCache - if data is coming from api or cache
 */
function processUserFull(userInfoData, dataIsFromCache = false) {
    /* eslint-disable-next-line complexity */
    return dispatch => {
        const { isRealtimePrescreenEnabled } = Sephora.fantasticPlasticConfigurations;

        const {
            profile, basket, product, shoppingList, targetedPromotion, personalizedPromotions, availableRRCCoupons, smsStatus, segments, tax
        } =
            userInfoData;

        const { userBeautyPreference, colorIq } = profile;
        const beautyPreferences = { ...userBeautyPreference, colorIQ: colorIq ?? [] };

        /**
         * Cache response for 1 hour if data does not originate from cache
         */
        if (!dataIsFromCache) {
            const previousData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA);

            if (!previousData) {
                Storage.local.setItem(LOCAL_STORAGE.USER_DATA, userInfoData, userUtils.USER_DATA_EXPIRY);
            } else {
                Object.keys(previousData).forEach(key => {
                    if (userInfoData[key]) {
                        previousData[key] = userInfoData[key];
                    }
                });
                setFullProfileGroupInLocalStorage();
                Storage.local.setItem(LOCAL_STORAGE.USER_DATA, previousData, userUtils.USER_DATA_EXPIRY);
            }
        }

        // If Killsitch is off, we need to overwrite the profileStatus, taking it from
        // the userFull API call, otherwise it will come from generateToken call
        if (!RCPSCookies.isRCPSFullProfileGroup() && userInfoData?.profile?.profileStatus) {
            updateProfileStatus({
                profileSecurityStatus: [userInfoData.profile.profileStatus]
            });
        }

        if (Sephora.configurationSettings.setZipStoreCookie && profile?.preferredStore) {
            cookieUtils.write(cookieUtils.KEYS.PREFERRED_STORE, profile?.preferredStore, null, false, false);
        }

        //TODO with UML-556
        if (targetedPromotion && !targetedPromotion.errorCode) {
            dispatch(targetedPromotionActions.updateTargetedPromotion(targetedPromotion));
        }

        // need to keep profile data in store up to date IF profile is in response
        if (profile) {
            dispatch(update(profile, false));
        }

        /*
         * We need to update the preferredStore in the store if the user has a preferred store
         * Also, we are just getting the storeId from userFull call, that's why we need to call
         * getStoreLocations to get the store details and update it in sessionStorage
         */
        if (profile.preferredStoreName && profile.preferredStore) {
            getStoreLocations(profile.preferredStore).then(data => {
                const preferredStoreInfo = data.stores[0];
                storeUtils.cacheStoreData(preferredStoreInfo);
                store.dispatch(updatePreferredStore({ preferredStoreInfo }));
            });
        }

        /**
         * if basket data is returned in userFull call, i.e. on initial call, or
         * after updating users basket (adding, removing, updating quantity)
         * then dispatch action to keep basket up to date in the store
         */
        if (basket) {
            dispatch(updateBasket({ newBasket: basket, shouldCalculateRootBasketType: true }));
        }

        if (personalizedPromotions) {
            dispatch(personalizedPromotionsActions.updatePersonalizedPromotions(personalizedPromotions));
        }

        if (availableRRCCoupons) {
            dispatch(rrcCouponsActions.updateRrcCoupons(availableRRCCoupons));
        }

        if (smsStatus) {
            dispatch(smsStatusActions.updateSmsStatus(smsStatus));
        }

        if (beautyPreferences && profile?.profileId && userUtils.isBI()) {
            const favoriteBrandIds = beautyPreferences[PREFERENCE_TYPES.FAVORITE_BRANDS] || [];
            dispatch(setUserFavoriteBrandIDs(favoriteBrandIds));

            // store.beautyPreferences
            dispatch(beautyPreferenceActions.setInitialBeautyPreferences(beautyPreferences));
            dispatch(beautyPreferenceActions.setProfileCompletionPercentage(beautyPreferences));
        }

        if (segments) {
            dispatch(segmentsActions.updateSegments(segments));
        }

        if (tax) {
            dispatch(TaxClaimActions.updateTaxStatus(tax));
        }

        /**
         * if lovesData is present either in the userCache or in the userFull call
         * need to dispatch action to keep loves list up to date in store, that way
         * potential loved products on page reflect current user loves list.
         */

        const isSharableListEnabled = myListsUtils.isSharableListEnabled();

        if (isSharableListEnabled) {
            if (dataIsFromCache) {
                Storage.db
                    .getItem(LOCAL_STORAGE.LOVED_ITEMS_SKU_ONLY)
                    .then(cached => {
                        const lovesData = cached || Empty.Object;
                        dispatch(LoveActions.setLovesList(lovesData));
                    })
                    .catch(err => {
                        Sephora.logger.error('IndexedDB read error', err);
                        dispatch(LoveActions.setLovesList({}));
                    });
            } else {
                Storage.db
                    .getItem(LOCAL_STORAGE.LOVED_ITEMS_SKU_ONLY)
                    .then(cached => {
                        const toDispatch = cached && cached.totalLovesListItemsCount > 0 ? cached : shoppingList;
                        dispatch(LoveActions.setLovesList(toDispatch));

                        return toDispatch;
                    })
                    .then(dataToStore => Storage.db.setItem(LOCAL_STORAGE.LOVED_ITEMS_SKU_ONLY, dataToStore))
                    .catch(err => {
                        Sephora.logger.error('IndexedDB error', err);
                        dispatch(LoveActions.setLovesList(shoppingList));
                        Storage.db
                            .setItem(LOCAL_STORAGE.LOVED_ITEMS_SKU_ONLY, shoppingList)
                            .catch(e => Sephora.logger.error('IndexedDB write error', e));
                    });
            }
        } else {
            if (dataIsFromCache) {
                const cached = Storage.local.getItem(LOCAL_STORAGE.LOVES_DATA);
                const lovesData = cached || Empty.Object;
                dispatch(LoveActions.setLovesList(lovesData));
            } else {
                dispatch(LoveActions.setLovesList(shoppingList));
            }
        }

        /** TODO ILLUPH-106359
         * revisit whether or not we need to updateCurrentUserSpecificProduct
         * here, as a result of a user signing in (therefore the data is not from the cache).
         * Doing a check to see if the data is from the cache, because if it is, we don't want
         * to be setting user specific product information from the cache as it's stale or
         * potentially not even related to the current page
         */
        !dataIsFromCache && product && dispatch(ProductActions.updateCurrentUserSpecificProduct(product));

        /**
         * when cc realtime prescreen is enabled on the site,
         * and a beauty insider user is fully logged in
         * dispatch action which will determine whether or not user has been
         * prescreened in real time; which will launch cc real time prescreen
         * modal.
         */
        if (profile && isRealtimePrescreenEnabled && profile.profileId && profile.beautyInsiderAccount?.biAccountId) {
            handleRealtimePrescreen(
                RCPSCookies.isRCPSCCAP() ? profile.beautyInsiderAccount.biAccountId : profile.profileId,
                profile.beautyInsiderAccount.ccAccountandPrescreenInfo
            );
        }

        /* Save for 15 minutes the preferred pickup store set on CE side */
        const pickupStore = basket?.pickupBasket?.storeDetails;

        if (pickupStore) {
            basketUtils.cachePickupStore(pickupStore);
        } else if (!basket) {
            basketUtils.removePickupStore();
        }
    };
}

/**
 * api call for full user profile. returns a promise so that during sign in, analytics
 * can sequentially get updated user info.
 * @param {*} [productPageData=null]
 * @param {*} callback
 * @param {*} [options={}] By default (without specified options) we will receive responses from all APIs.
 * But if specific API specified in includeApis, we'll receive only response for that specific API and only that API response will be cached
 * and it overwrites all previously cached API responses!
 * Example: if we have [basket,profile,targetedPromotions] cashed, [profile] will overwrite cache object, so we'll have only [profile] and we lose [basket,targetedPromotions]
 * @param {*} referral
 * @param {boolean} [hideLoader=false]
 * @return {Promise}
 */
function getUserFull(productPageData = null, callback, options = {}, referral, hideLoader = false) {
    // Remove preferredZipCode. If the user has one, it's set after userfull call.
    // If the user does not have a preferred zipcode, we might have saved it in local
    // storage by getting location data, but we don't want to use that saved code as
    // preferred zipcode
    Storage.session.removeItem(LOCAL_STORAGE.PREFERRED_ZIP_CODE);
    Storage.local.getItem(LOCAL_STORAGE.CREATED_NEW_USER, false, true);
    const profileId = Storage.local.getItem(LOCAL_STORAGE.PROFILE_ID) || 'current';

    return dispatch => {
        // need to get lithiumSsoToken for community authentication for user full call
        const requestOptions = Object.assign({ propertiesToInclude: 'lithiumSsoToken' }, options);

        // we need to return user specific product data when making user full call
        if (productPageData) {
            const { productDetails = {} } = productPageData;
            requestOptions.productId = productDetails.productId;
            requestOptions.preferedSku = productPageData.skuId;
        }

        if (Sephora.Util.shouldGetTargetedPromotion() === false) {
            requestOptions.skipApis = ['targetedPromotion'];
        } else {
            requestOptions.skipApis = [];
        }

        // Always skip targeters as they're moved to a different call
        requestOptions.skipApis.push('targetersResult');

        //skip basket from full call when we have rcps_full_profile_group cookie set as true
        if (RCPSCookies.isRCPSFullProfileGroup()) {
            requestOptions.skipApis.push('basket');
        }

        if (Location.isMyAccountPage()) {
            requestOptions.forceLinkedAccountDetails = true;
        }

        // Make call to update basket during full call to account for
        // basket being removed when rcps_full_profile_cookie is true.
        if (CookieUtils.isRCPSFullProfileGroup()) {
            SpaUtils.updateBasket();
        }

        /**
         * dispatch interstice loading flame before call is made
         * make api call to get all user data, see getProfileFullInformation.js.
         * after successfull user full call: update store with all necessary info
         * returned from call, update store with all lithium(community) specific data,
         * execute callback function if passed in.
         * whether call is successful or fails, dispatch action to remove interstice
         * loading flame.
         */
        if (!hideLoader) {
            dispatch(actions.showInterstice(true));
        }

        requestOptions.skipApis = requestOptions.skipApis.join(',');

        return getProfileFullInformation(profileId, requestOptions)
            .then(data => {
                dispatch(processUserFull(data, false));

                // Set the preferred zipcode for same day delivery proper functioning
                if (data?.profile?.preferredZipCode) {
                    userLocationUtils
                        .setPreferredZipCodeOnSession(data.profile.preferredZipCode, true)
                        .then(zipCodeData => {
                            Storage.local.setItem(LOCAL_STORAGE.SAME_DAY_DELIVERY_AVAILABLE, zipCodeData?.sameDayAvailable);

                            // If there is no nearby zipcode with sameDay availability, we get no zipCode,
                            // so same day is unavaialable
                            if (zipCodeData.zipCode) {
                                const zipData = {
                                    preferredZipCode: zipCodeData.zipCode,
                                    encryptedStoreIds: zipCodeData.encryptedStoreIds
                                };
                                dispatch(userActions.update(zipData, false));
                                Storage.session.setItem(LOCAL_STORAGE.PREFERRED_ZIP_CODE, zipData);
                            }
                        })
                        // SameDay not available for user's location
                        .catch(() => {});
                }

                dispatch(getLithiumUserData(data));
                callback && callback();
                dispatch(actions.showInterstice(false));
                dispatch(getUserCreditCardRewards(data));
            })
            .catch(() => {
                dispatch(actions.showInterstice(false));
            });
    };
}

function initPaze(email) {
    const isPazeLocaleEnabled = localeUtils.isCanada()
        ? Sephora.configurationSettings.globalCAPazeOptionEnabled
        : Sephora.configurationSettings.globalUSPazeOptionEnabled;

    if (!email || !isPazeLocaleEnabled) {
        return;
    }

    pazeUtils
        .initDynamicPaze({ email })
        .then(({ consumerPresent }) => {
            const shouldShowPaze = pazeUtils.isPazeEnabled();

            if (shouldShowPaze && (consumerPresent || !Sephora.configurationSettings.isPazeDynamic)) {
                Storage.local.setItem(LOCAL_STORAGE.CAN_CHECKOUT_PAZE, true);
            } else {
                Storage.local.setItem(LOCAL_STORAGE.CAN_CHECKOUT_PAZE, false);
            }
        })
        .catch(err => {
            console.error(err); // eslint-disable-line no-console
        });
}

function updateUserInformation(updatedInfo, successCallback, failureCallback) {
    return dispatch => {
        dispatch(actions.showInterstice(true));

        updateProfile(updatedInfo)
            .then(data => {
                dispatch(actions.showInterstice(false));
                successCallback(data);
            })
            .catch(reason => {
                failureCallback(reason);
            });
    };
}

function getCommonAnalytics(analyticsData, isBI, eventType) {
    const { nextPageContext } = analyticsData || {};
    const nextPageDataEvent =
        (nextPageContext && anaUtils.getLastAsyncPageLoadData({ pageType: nextPageContext }, eventType === anaConsts.ASYNC_PAGE_LOAD)) || {};

    let {
        pageName = getProp(digitalData, 'page.attributes.sephoraPageInfo.pageName'),
        // eslint-disable-next-line prefer-const
        pageType = getProp(digitalData, 'page.category.pageType'),
        pageDetail = getProp(digitalData, 'page.pageInfo.pageName')
    } = nextPageDataEvent;

    const { MY_BEAUTY_INSIDER, SIGNED_IN, BENEFITS } = anaConsts.PAGE_NAMES;

    if (Location.isBIPage()) {
        // After successful sign in/register on BI page,
        // we need to update the page's pageName according to UML-494
        pageDetail = `${MY_BEAUTY_INSIDER}-${isBI ? SIGNED_IN : BENEFITS}`;
        pageName = `${pageType}:${pageDetail}:n/a:*`;
        // This is a valid exception to manually setting up digitalData prop on a modal
        // Successful sign in/register should trigger a fake load
        digitalData.page.attributes.sephoraPageInfo.pageName = pageName;
        digitalData.page.pageInfo.pageName = pageDetail;
        anaUtils.setNextPageData({ pageName });
    }

    return {
        pageName,
        pageType,
        pageDetail
    };
}

function register(profileData, successCallback, failureCallback, intersticeDelayMs, guestLogin, analyticsData) {
    let signupStore;

    return new Promise(resolve => {
        fingerPrint.setupFingerprint(deviceFingerprint => {
            const authProfileData = {
                ...profileData,
                deviceFingerprint
            };

            resolve((dispatch, getState) => {
                const login = guestLogin || (authProfileData && authProfileData.userDetails && authProfileData.userDetails.login);
                let anonymousToken = null;
                const userprofile = getState().auth.profileStatus;
                const basketWithItems = getState().basket.items || getState().basket.pickupBasket.items;

                if (userprofile === 0 && basketWithItems && cookieUtils.isRCPSCCEnabled()) {
                    anonymousToken = Storage.local.getItem(LOCAL_STORAGE['AUTH_ACCESS_TOKEN']);
                }

                Storage.local.removeItem(LOCAL_STORAGE['AUTH_ACCESS_TOKEN']);
                // We only need the `inStoreUser` value to add it to `digitalData`
                // then we delete it from authProfileData to avoid sending it to the service/backend
                const { inStoreUser } = authProfileData;

                // Advocacy
                setReferrerData();

                decorators
                    .withInterstice(
                        createUser,
                        intersticeDelayMs
                    )(authProfileData)
                    .then(data => {
                        if (isAuthServiceEnabled()) {
                            const { accessToken, refreshToken, atExp, rtExp } = data;
                            storeAuthTokens({ accessToken, refreshToken, accessTokenExpiry: atExp, refreshTokenExpiry: rtExp });
                        }

                        if (Array.isArray(data?.errors)) {
                            failureCallback(data);
                            dispatch(actions.showInterstice(false));

                            return false;
                        }

                        const mergePromise = anonymousToken
                            ? mergeBasket(anonymousToken)
                                .then(() => {
                                    Promise.resolve();
                                })
                                .catch(err => {
                                    Sephora.logger.error('Error merging basket:', err);

                                    return null;
                                })
                            : Promise.resolve();

                        // eslint-disable-next-line complexity
                        return mergePromise.then(() => {
                            if (data?.profileWarnings) {
                                Storage.local.setItem(LOCAL_STORAGE.LOGIN_PROFILE_WARNINGS, data.profileWarnings);
                            }

                            if (data.responseStatus === ERROR_CODES.STORE_REGISTERED_ERROR_CODE) {
                                decorators
                                    .withInterstice(
                                        lookupProfileByLogin,
                                        intersticeDelayMs
                                    )(login)
                                    .then(data2 => {
                                        failureCallback({
                                            errorCode: ERROR_CODES.STORE_REGISTERED_ERROR_CODE,
                                            data: data2
                                        });
                                    });
                            } else {
                                if (!guestLogin) {
                                    data.firstName = authProfileData.userDetails.firstName;
                                    data.lastName = authProfileData.userDetails.lastName;
                                    data.login = authProfileData.userDetails.login;
                                }

                                if (isAuthServiceEnabled()) {
                                    updateProfileStatus({
                                        profileSecurityStatus: [data?.profileStatus || data?.profileSecurityStatus],
                                        accessToken: [data?.accessToken, data?.atExp],
                                        refreshToken: [data?.refreshToken, data?.rtExp],
                                        userEmail: [data?.login]
                                    });
                                }

                                if (Sephora.configurationSettings.globalPazeOptionEnabled) {
                                    initPaze(data?.login);
                                }

                                // Store profileId and biAccountId for full call
                                const biAccountId = data?.biAccountId;
                                Storage.local.setItem(LOCAL_STORAGE.PROFILE_ID, data?.profileId);
                                Storage.local.setItem(LOCAL_STORAGE.BI_ACCOUNT_ID, biAccountId);

                                dispatch(update(data));
                                dispatch(LoveActions.getLovesList(data.profileId));

                                dispatch(getCreditCardTargeters(true));

                                dispatch(targetersActions.requestAndSetTargeters(true));

                                // Analytics
                                const eventStrings = [scEvent.REGISTRATION_SUCCESSFUL];

                                if (authProfileData.isJoinBi) {
                                    eventStrings.push(scEvent.REGISTRATION_WITH_BI);
                                } else {
                                    eventStrings.push(scEvent.REGISTRATION_WITHOUT_BI);
                                }

                                if (authProfileData.captchaToken) {
                                    eventStrings.push(scEvent.CAPTCHA_PRESENT);
                                }

                                if (authProfileData.subscription && authProfileData.subscription.subScribeToEmails) {
                                    eventStrings.push(scEvent.EMAIL_OPT_IN);
                                }

                                if (authProfileData.userDetails.primaryPhone && authProfileData.userDetails.primaryPhone !== '') {
                                    eventStrings.push(scEvent.REGISTRATION_PHONE_SUBMITTED);
                                }

                                if (authProfileData.subscription && authProfileData.subscription.subScribeToSms) {
                                    eventStrings.push(scEvent.REGISTRATION_PHONE_OPT_IN);
                                }

                                const registerLoadEvent = anaUtils.getLastAsyncPageLoadData({ pageType: anaConsts.PAGE_TYPES.REGISTER });

                                const initialData = getCommonAnalytics(analyticsData, authProfileData.isJoinBi, anaConsts.ASYNC_PAGE_LOAD);

                                processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                                    data: {
                                        ...initialData,
                                        eventStrings: eventStrings,
                                        linkData: authProfileData.isKeepSignedIn ? anaConsts.LinkData.SSI : null,
                                        navigationInfo: null,
                                        previousPageName: registerLoadEvent.pageName
                                    }
                                });

                                const signUpOptions = {
                                    isJoinBi: authProfileData.isJoinBi,
                                    inStoreUser: inStoreUser
                                };

                                userUtils.setSignUpData(signUpOptions);

                                if (data.signupStore) {
                                    signupStore = data.signupStore.trim();
                                } else if (data.beautyInsiderAccount && data.beautyInsiderAccount.signupStore) {
                                    signupStore = data.beautyInsiderAccount.signupStore.trim();
                                }

                                const hasUserLoggedIn = Storage.local.getItem(LOCAL_STORAGE.HAS_PREVIOUSLY_LOGGED_IN);

                                /**
                             signupStore is undefined when user is registered without BI.
                             signupStore is SEPHORA .COM MDC if registered US user registered with BI.
                             signupStore is SEPHORA .CA if regiestered CA user registered with BI,
                             CA user cannot register without BI.
                             store registered cannot be registered without BI.
                             **/
                                const userHasBeenCreatedFrom =
                                    signupStore !== undefined && FROM_SITE.CREATED_FROM_SITE.indexOf(signupStore) > -1 ? 'fromSite' : 'fromStore';

                                Storage.local.setItem(LOCAL_STORAGE.CREATED_NEW_USER, userHasBeenCreatedFrom, REGISTER_EXPIRY);

                                if (!hasUserLoggedIn) {
                                    Storage.local.setItem(LOCAL_STORAGE.HAS_PREVIOUSLY_LOGGED_IN, true);
                                }

                                //after account is created, need to get current/updated user full data
                                dispatch(userActions.getUserFull(null, null, {})).then(function () {
                                    successCallback(data);
                                    dispatch(actions.showInterstice(false));
                                });
                            }
                        });
                    })
                    .catch(reason => {
                        if (
                            reason.errorCode === ERROR_CODES.FMS ||
                            (reason.errorMessages && reason.errorCode !== ERROR_CODES.ACCOUNT_DEACTIVATED_ERROR_CODE)
                        ) {
                            failureCallback(reason);

                            import(/* webpackMode: "eager" */ 'analytics/bindings/pages/all/UserEvents').then(analytics => {
                                analytics.registerErrorEvent({
                                    processEvent,
                                    anaUtils,
                                    anaConsts,
                                    linkTrackingError,
                                    reason
                                });
                            });
                        } else if (reason.errorCode === ERROR_CODES.ACCOUNT_DEACTIVATED_ERROR_CODE) {
                            dispatch(actions.showRegisterModal({ isOpen: false }));
                            dispatch(
                                actions.showAccountDeactivatedModal({
                                    isOpen: true,
                                    errorMessage: reason.errors?.closedAccount
                                })
                            );
                        }

                        dispatch(actions.showInterstice(false));
                    });
            });
        });
    });
}

/**
 * creates bi account for user who decides to register for beauty insider
 * @param  {object} biData - object containing specific user data for creating BI account
 * @param  {func} succsesCallback - function called after succcessfully updating user info
 * @param  {func} failureCallback - function called after failing to update user info
 */
function biRegister(biData, successCallback, failureCallback, analyticsData) {
    return dispatch => {
        //show interstice loading flame
        dispatch(actions.showInterstice(true));

        // Advocacy
        setReferrerData();

        return createBiAccount(biData)
            .then(data => {
                if (data?.biAccountId) {
                    Storage.local.setItem(LOCAL_STORAGE.BI_ACCOUNT_ID, data.biAccountId);
                }

                //after bi account is created, need to get current/updated user full data
                dispatch(userActions.getUserFull(null, null, {})).then(function () {
                    /**
                     * since only beauty insiders can have a Sephora credit card
                     * dispatch specific getCreditCardTargeters action to determine
                     * which Credit Card banners to display for user.
                     * Banners are located on basket, checkout, and inside of inline basket.
                     */
                    dispatch(getCreditCardTargeters(true));

                    dispatch(targetersActions.requestAndSetTargeters(true));

                    successCallback(data);

                    //analytics call for bi registration success
                    const registerLoadEvent = anaUtils.getLastAsyncPageLoadData({ pageType: anaConsts.PAGE_TYPES.REGISTER });
                    const initialData = getCommonAnalytics(analyticsData, biData.isJoinBi, anaConsts.ASYNC_PAGE_LOAD);
                    const asyncPageLoadEvent = {
                        data: {
                            ...initialData,
                            eventStrings: [scEvent.REGISTRATION_WITH_BI, scEvent.REGISTRATION_SUCCESSFUL],
                            previousPageName: registerLoadEvent.pageName
                        }
                    };
                    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, asyncPageLoadEvent);

                    const signUpOptions = {
                        isJoinBi: biData.isJoinBi,
                        inStoreUser: false
                    };
                    userUtils.setSignUpData(signUpOptions);

                    //hide interstice loading flame
                    dispatch(actions.showInterstice(false));
                });
            })
            .catch(reason => {
                if (reason.errorMessages) {
                    failureCallback(reason);
                }

                //hide interstice loading flame
                dispatch(actions.showInterstice(false));
            });
    };
}

// This function groups purchased items by productId and retains the most recent purchase with all its data.
function groupPurchasedItems(purchasedItems) {
    const uniquePurchases = purchasedItems.reduce((acc, item) => {
        const productId = item.sku.productId;
        const rawTransactionDate = item.sku.transactionDate;
        const dateObj = new Date(rawTransactionDate);
        const currentTimestamp = dateObj.getTime();

        // If the product isn't added yet or the current transactionDate is more recent, keep the full item
        if (!acc[productId] || currentTimestamp > acc[productId].rawTimestamp) {
            acc[productId] = {
                ...item, // Keep all original item data
                transactionDate: rawTransactionDate, // Ensure transactionDate is available at top level for compatibility
                rawTimestamp: currentTimestamp // Add timestamp for comparison
            };
        }

        return acc;
    }, {});

    // Convert the lookup object into an array of full item objects (remove the helper timestamp)
    return Object.values(uniquePurchases).map(({ rawTimestamp, ...item }) => item);
}

function fetchCompletePurchaseHistory({ userId }, options = {}) {
    const { showPreviouslyPurchasedPdp = false, useIndexedDB = false, cacheKey = '', cacheTime = PURCHASE_HISTORY_CACHE_EXPIRY } = options;

    if (userId === null) {
        return null;
    }

    return async dispatch => {
        const fetchData = () =>
            BIApi.getCompletePurchaseHistory(userId, {
                sortBy: 'recently',
                groupBy: 'frequencyAndDate',
                itemsPerPage: showPreviouslyPurchasedPdp ? 1000 : 100,
                excludeSamples: true,
                excludeRewards: true,
                showPreviouslyPurchasedPdp
            });

        const processData = ({ purchasedItems }) => {
            const filteredItems = groupPurchasedItems(purchasedItems);

            return dispatch(actions.updateCompletePurchaseHistoryItems(filteredItems));
        };

        const handleError = err => {
            Sephora.logger.error('[fetchCompletePurchaseHistory Error]:', err);

            return dispatch(actions.updateCompletePurchaseHistoryItems(Empty.Array));
        };

        if (useIndexedDB) {
            try {
                // First, check IndexedDB cache for existing data
                const cachedData = await Storage.db.getItem(cacheKey);

                if (cachedData) {
                    // Check if cached data has the expected structure
                    if (cachedData.purchasedItems) {
                        // Cache hit with full API response - use cached data

                        return processData(cachedData);
                    } else if (Array.isArray(cachedData)) {
                        // Cache hit with processed/simplified data - use directly

                        return dispatch(actions.updateCompletePurchaseHistoryItems(cachedData));
                    }
                }

                // Cache miss - fetch from API and cache the result
                const apiData = await fetchData();

                // Cache the full API response (including purchasedItems structure)
                await Storage.db.setItem(cacheKey, apiData, cacheTime);

                return processData(apiData);
            } catch (err) {
                return handleError(err);
            }
        } else {
            // Use direct API call without caching
            return fetchData().then(processData).catch(handleError);
        }
    };
}

function signInSuccess(dispatch, response, getState, successCallback, biAccountInfo = {}, analyticsData, anonymousToken = null) {
    // Analytics
    const signInModalEvent = anaUtils.getLastAsyncPageLoadData({ pageType: anaConsts.SIGN_IN_PAGE_TYPE_DETAIL });
    const isBi = !!(response.beautyInsiderAccount && response.beautyInsiderAccount.biAccountId);
    const initialData = getCommonAnalytics(analyticsData, isBi, anaConsts.ASYNC_PAGE_LOAD);
    const analyticsObj = {
        ...initialData,
        eventStrings: [scEvent.SIGN_IN_ATTEMPT, scEvent.SIGN_IN_SUCCESS],
        linkData: response.ssiToken ? anaConsts.LinkData.SSI : null,
        previousPageName: signInModalEvent.pageName
    };

    // Adds the event for Sitecat (Adobe Analytics) indicating the user selected to be kept signed in.
    if (analyticsData && analyticsData?.SSI) {
        analyticsObj.eventStrings.push('event57');
    }

    if (biAccountInfo && biAccountInfo.isJoinBi) {
        analyticsObj.eventStrings.push(scEvent.REGISTRATION_WITH_BI);

        //Snapchat/Twitter SignUp Pixel
        userUtils.setSignUpData({
            isJoinBi: biAccountInfo.isJoinBi,
            inStoreUser: false
        });
    }

    // Merge cart for anonymous user if basket is not empty
    const mergePromise = anonymousToken
        ? mergeBasket(anonymousToken)
            .then(() => {
                Promise.resolve();
            })
            .catch(err => {
                Sephora.logger.error('Error merging basket:', err);

                return null;
            })
        : Promise.resolve();

    return mergePromise.then(() => {
        // We must wait for userFull so that things like basket.items and user specific product details
        // are up to date
        const productPageData = skuUtils.getProductPageData();
        const { country, language } = Sephora.renderQueryParams;
        const basket = getState().basket;
        dispatch(beautyInsiderActions.getBeautyOffers(country, language));
        dispatch(userActions.getUserFull(productPageData, null, {})).then(function () {
            if (typeof successCallback === 'function') {
                successCallback(response);
            }

            dispatch(getCreditCardTargeters(true));

            dispatch(targetersActions.requestAndSetTargeters(true));

            const profile = getState().user;

            if (profile) {
                readClaripConsent(profile);
                dispatch(homepageActions.getPersonalizedEnabledComponents());
            }

            // Fetch complete purchase history for signed-in BI users if the A/B test is enabled
            const showPreviouslyPurchasedPdp = getState()?.testTarget?.offers?.previouslyPurchasedPdp?.show || false;

            if (isBi && profile?.profileId && showPreviouslyPurchasedPdp) {
                dispatch(
                    fetchCompletePurchaseHistory(
                        { userId: profile.profileId },
                        {
                            showPreviouslyPurchasedPdp: showPreviouslyPurchasedPdp,
                            useIndexedDB: true,
                            cacheKey: `purchaseHistory_${profile.profileId}`
                        }
                    )
                ).catch(err => {
                    // Don't fail the sign-in process if purchase history fetch fails
                    Sephora.logger.error('[SignIn Purchase History Fetch Error]:', err);
                });
            }

            //Enrich data if basket merge occurred
            /* eslint-disable array-callback-return */
            response.profileWarnings &&
                response.profileWarnings.map(warning => {
                    if (warning.messageContext === MESSAGE_TYPES.MERGED_BASKET) {
                        if (digitalData.page.pageInfo.pageName === anaConsts.PAGE_NAMES.BASKET) {
                            analyticsObj.eventStrings = analyticsObj.eventStrings.concat([anaConsts.Event.SC_VIEW, anaConsts.Event.EVENT_37]);
                            analyticsObj.productStrings = anaUtils.buildProductStrings({
                                products: basket.items,
                                basket
                            });
                        }
                    }
                });
            /* eslint-enable array-callback-return */

            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: analyticsObj });
            anaUtils.fireEventForTagManager(anaConsts.Event.SIGN_IN_RELOAD);
        });
    });
}

function getProfileWarningModalTexts({ profileWarnings }) {
    const { messages: message } = profileWarnings.reduce((acc, next) => {
        return acc.messages[0] + ' ' + next.messages[0];
    });
    const messageContext = profileWarnings[0].messageContext || '';

    return {
        message: message[0],
        messageContext
    };
}

function signIn(
    login,
    password,
    isKeepSignedIn,
    loginForCheckout,
    successCallback,
    failureCallback,
    isOrderConfirmation,
    biAccountInfo,
    isTestNTarget,
    isSignInWithMessaging,
    analyticsData,
    extraParams
) {
    setReferrerData(true);

    return (dispatch, getState) => {
        const options = {
            loginForCheckout,
            isKeepSignedIn,
            isOrderConfirmation,
            biAccountInfo,
            extraParams
        };
        options.offers = getState()?.testTarget?.offers;

        if (!isKeepSignedIn && isAuthServiceEnabled()) {
            CookieUtils.delete('SSIT');
        }

        // Sets the Stay Signed In value for analytics use.
        if (analyticsData) {
            analyticsData.SSI = isKeepSignedIn;
        }

        dispatch(actions.showInterstice(true));

        let anonymousToken = null;
        const userprofile = getState().auth.profileStatus;
        const basketWithItems = getState().basket.items || getState().basket.pickupBasket.items;

        if (userprofile === 0 && basketWithItems && cookieUtils.isRCPSCCEnabled()) {
            anonymousToken = Storage.local.getItem(LOCAL_STORAGE['AUTH_ACCESS_TOKEN']);
        }

        const executeLogin = deviceFingerprint =>
            authenticationApi
                .login({
                    deviceFingerprint,
                    login,
                    password,
                    options
                })
                // eslint-disable-next-line complexity
                .then(data => {
                    Storage.local.removeItem(LOCAL_STORAGE['AUTH_ACCESS_TOKEN']);

                    if (Sephora.configurationSettings.globalPazeOptionEnabled) {
                        initPaze(data.userName);
                    }

                    // Show any warnings that occurred
                    if (data.profileWarnings) {
                        const { message, messageContext } = getProfileWarningModalTexts(data);

                        const redirect = () => {
                            if (data.redirectPath) {
                                urlUtils.redirectTo(data.redirectPath);
                            } else {
                                urlUtils.redirectTo(window.location.pathname);
                            }
                        };

                        dispatch(
                            actions.showInfoModal({
                                isOpen: true,
                                title: userUtils.INFO_MODAL_WARNING_TITLE,
                                message: message,
                                dataAtMessageContext: messageContext,
                                callback: redirect
                            })
                        );
                    }

                    Storage.local.setItem(LOCAL_STORAGE.STAY_SIGN_IN, !!isKeepSignedIn);

                    /** Reload if a different locale.  Profile locale does not exist on POS user,
                     * so do not want to trigger page reload
                     */
                    if (!data.isStoreBiMember && data.profileLocale !== getState().user.profileLocale) {
                        Storage.session.removeItem(LOCAL_STORAGE.SELECTED_STORE);
                        //Set successful login/BI registration analytics events before reloading
                        const events = [scEvent.SIGN_IN_ATTEMPT, scEvent.SIGN_IN_SUCCESS];
                        biAccountInfo && biAccountInfo.isJoinBi && events.push(scEvent.REGISTRATION_WITH_BI);
                        anaUtils.setNextPageData({ events });

                        if (data.warnings && data.warnings.length) {
                            if (isSignInWithMessaging) {
                                dispatch(actions.showSignInWithMessagingModal({ isOpen: false }));
                            } else {
                                dispatch(actions.showSignInModal({ isOpen: false }));
                            }

                            dispatch(
                                actions.showInfoModal({
                                    isOpen: true,
                                    title: userUtils.INFO_MODAL_WARNING_TITLE,
                                    message: data.warnings.join(' '),
                                    callback: Location.reload
                                })
                            );
                        } else {
                            if (typeof successCallback === 'function') {
                                successCallback(data, { isProfileLocaleChanged: true });
                            }
                        }

                        const storage = Storage.local.getItem(LOCAL_STORAGE.HAS_PREVIOUSLY_LOGGED_IN);

                        if (!storage) {
                            Storage.local.setItem(LOCAL_STORAGE.HAS_PREVIOUSLY_LOGGED_IN, true);
                        }

                        if (isAuthServiceEnabled()) {
                            updateProfileStatus({
                                profileSecurityStatus: [data?.tokens?.profileSecurityStatus],
                                accessToken: [data?.tokens?.accessToken, data?.tokens?.atExp],
                                refreshToken: [data?.tokens?.refreshToken, data?.tokens?.rtExp],
                                userEmail: [data?.userName],
                                hasIdentity: [data?.hasIdentity]
                            });
                            signInSuccess(dispatch, data, getState, successCallback, biAccountInfo, analyticsData, anonymousToken);
                        }
                    } else if (data.shouldTriggerEmailVerification) {
                        dispatch(actions.showSignInModal({ isOpen: false }));
                        dispatch(actions.showCheckYourEmailModal({ isOpen: true, email: login }));
                    } else if (
                        (data.responseStatus === ERROR_CODES.STORE_REGISTERED_ERROR_CODE ||
                            data.responseStatus === ERROR_CODES.STORE_REGISTERED_NEW_AUTH_ERROR_CODE) &&
                        data.isStoreBiMember
                    ) {
                        // Launch registration if in store user attempts to sign in with password
                        const biData = data.beautyInsiderAccount;
                        biData.profileId = data.profileId;
                        biData.userEmail = biData.email;
                        dispatch(actions.showSignInWithMessagingModal({ isOpen: false }));
                        dispatch(actions.showSignInModal({ isOpen: false }));
                        dispatch(
                            actions.showRegisterModal({
                                isOpen: true,
                                callback: successCallback,
                                userEmail: data.userName,
                                isStoreUser: true,
                                biData: biData,
                                analyticsData: {
                                    ...analyticsData,
                                    context: anaConsts.PAGE_TYPES.SIGN_IN
                                },
                                skipEmailLookup: true
                            })
                        );
                    } else {
                        if (!data.isStoreBiMember) {
                            if (isAuthServiceEnabled()) {
                                authenticationUtils.updateProfileStatus({
                                    profileSecurityStatus: [data?.tokens?.profileSecurityStatus],
                                    accessToken: [data?.tokens?.accessToken, data?.tokens?.atExp],
                                    refreshToken: [data?.tokens?.refreshToken, data?.tokens?.rtExp],
                                    hasIdentity: [data?.hasIdentity]
                                });

                                Storage.local.setItem(LOCAL_STORAGE.USER_EMAIL, data?.userName);
                            }

                            signInSuccess(dispatch, data, getState, successCallback, biAccountInfo, analyticsData, anonymousToken);
                            const hasPreviouslyLoggedIn = Storage.local.getItem(LOCAL_STORAGE.HAS_PREVIOUSLY_LOGGED_IN);

                            if (!hasPreviouslyLoggedIn) {
                                Storage.local.setItem(LOCAL_STORAGE.HAS_PREVIOUSLY_LOGGED_IN, true);
                            }
                        }
                    }

                    dispatch(actions.showInterstice(false));
                })
                .catch(reason => {
                    if (isAuthServiceEnabled() && reason.errorCode !== ERROR_CODES.ACCOUNT_DEACTIVATED_ERROR_CODE) {
                        reason.errorMessages = [reason?.errorMessage];
                    }

                    if (reason.errorCode === ERROR_CODES.ACCOUNT_DEACTIVATED_ERROR_CODE) {
                        dispatch(actions.showSignInModal({ isOpen: false }));
                        dispatch(
                            actions.showAccountDeactivatedModal({
                                isOpen: true,
                                errorMessage: reason.errors.message[0]
                            })
                        );
                    }

                    failureCallback(reason);

                    import(/* webpackMode: "eager" */ 'analytics/bindings/pages/all/UserEvents').then(analytics => {
                        analytics.signInErrorEvent({
                            processEvent,
                            anaUtils,
                            anaConsts,
                            linkTrackingError,
                            reason
                        });
                    });

                    dispatch(actions.showInterstice(false));
                });

        if (isKeepSignedIn) {
            fingerPrint.setupFingerprint(executeLogin);
        } else {
            executeLogin();
        }
    };
}

function signOut(redirect, confirmed = false, removeRedirect = false, successCallback, xCausedHeader) {
    return dispatch => {
        // Analytics tracking when signout is initiated.
        if (!anaUtils.checkLogoutEventIsAlreadyTracked()) {
            anaUtils.trackLogoutEvent();
        }

        // Throw a warning modal that the basket will be lost if only samples/rewards < 750 point
        if (!confirmed && !basketUtils.isEmpty() && basketUtils.isOnlySamplesRewardsInBasket(true)) {
            return dispatch(
                actions.showInfoModal({
                    isOpen: true,
                    title: getText('signOutInfoModalTitle'),
                    message: getText('signOutInfoModalMessage'),
                    buttonText: getText('signOutInfoModalButtonText'),
                    callback: () => {
                        dispatch(signOut(redirect, true));
                        dispatch(actions.showInfoModal({ isOpen: false }));
                    },
                    showCancelButton: true
                })
            );
        }

        const flush = () => {
            /*
             ** Explicitly clearing cached TestTarget && user data so TestTarget service can
             ** accurately validate when loading if it depends on the
             ** userInfo service to execute.
             */
            Flush.flushUser();
            Flush.flushBiAccountAndProfileId();
            Flush.flushBasket();
            Flush.flushUserAdditionalData();
            Flush.flushMyListsData();
            Flush.flushLoginProfileWarnings();
            Flush.flushP13nData();
            Flush.flushBeautyOffers();

            if (isAuthServiceEnabled()) {
                Flush.flushAuthTokens();
            }
        };

        const clearCookies = () => {
            //set lithium session key to 0, to mimic delete
            cookieUtils.write(LITHIUM_SESSION_KEY_COOKIE_NAME, 0);
            cookieUtils.write(cookieUtils.KEYS.PREVIEW_CUSTOMER, 0);
        };

        const clearStorage = () => {
            const { local, session } = Storage;
            local.removeItem('jStorage');
            local.removeItem('jStorage_update');
            local.removeItem(LOCAL_STORAGE.STAY_SIGN_IN);
            local.removeItem(GENAI_LOCAL_STORAGE.GENAI_ANONYMOUS_ID_KEY);
            local.removeItem(GENAI_LOCAL_STORAGE.GENAI_SESSION_KEY);
            session.removeItem('selectedStore');
            session.removeItem('lastDataForBraze');
            session.removeItem('preferredZipCode');
            session.removeItem('maxAddressValidationCount');
            session.removeItem(LOCAL_STORAGE.DISABLE_BEAUTY_PREFERENCES_SPOKE);
            dispatch(targetersActions.flushTargeterCache());
        };

        const { logout } = authenticationApi;
        const redirectUrl = !redirect || redirect === '' ? '/' : redirect;
        const { redirectTo } = urlUtils;

        return logout(xCausedHeader)
            .then(() => {
                flush();
                clearCookies();
                clearStorage();

                !removeRedirect && redirectTo(redirectUrl);
                typeof successCallback === 'function' && successCallback();
            })
            .catch(() => {
                // TODO: dispatch error
            });
    };
}

function checkUser(login, successCallback, failureCallback) {
    return dispatch => {
        dispatch(actions.showInterstice(true));

        lookupProfileByLogin(login, 'lookup', 'signup')
            .then(data => successCallback(data))
            .catch(error => failureCallback(error))
            .finally(() => dispatch(actions.showInterstice(false)));
    };
}

function checkEmailAndPhone(email, phone, successCallback, failureCallback) {
    return dispatch => {
        dispatch(actions.showInterstice(true));
        sdnApi
            .lookupEmailAndPhone(email, phone)
            .then(data => {
                if (data.fault || !data.responseStatus || data.responseStatus >= 400) {
                    failureCallback(data);
                } else {
                    successCallback(data);
                }
            })
            .catch(error => failureCallback(error))
            .finally(() => dispatch(actions.showInterstice(false)));
    };
}

function sendForgotPassword(dispatch, login, successCallback, failureCallback, source) {
    dispatch(actions.showInterstice(true));
    authenticationApi
        .resetPasswordByLogin(login, source)
        .then(() => {
            successCallback();
            dispatch(actions.showInterstice(false));
        })
        .catch(reason => {
            failureCallback(reason);
            dispatch(actions.showInterstice(false));
        });
}

function forgotPassword(login, successCallback, failureCallback, source) {
    return dispatch => {
        dispatch(actions.showInterstice(true));

        getProfileForPasswordReset(login)
            .then(() => {
                sendForgotPassword(dispatch, login, successCallback, failureCallback, source);
                dispatch(actions.showInterstice(false));
            })
            .catch(reason => {
                failureCallback(reason);
                dispatch(actions.showInterstice(false));
            });
    };
}

function setZipStoreCookie(data) {
    if (Sephora.configurationSettings.setZipStoreCookie) {
        cookieUtils.write(cookieUtils.KEYS.PREFERRED_STORE, DEFAULT_STORE_ID[data.profileLocale], null, false, false);
        cookieUtils.write('sameDayZipcodeCookie', DEFAULT_ZIP_CODE[data.profileLocale], null, false, false);
    }
}

async function setPreferredStoreLocation({ callback }) {
    try {
        const location = await getLocation();
        const preferredStore = location?.stores?.[0] || Empty.Object;

        if (preferredStore?.storeId) {
            storeUtils.cacheStoreData(preferredStore);
            cookieUtils.write('sameDayZipcodeCookie', preferredStore?.address.postalCode, null, false, false);
            await userLocationUtils.updatePreferredZipCode({ postalCode: preferredStore?.address.postalCode });
        }
    } catch (error) {
        Sephora.logger.error(error);
    } finally {
        if (typeof callback === 'function') {
            callback();
        }
    }
}

function switchCountry(ctry, lang) {
    return dispatch => {
        profileApi.switchCountry(ctry || localeUtils.COUNTRIES.US, lang || localeUtils.LANGUAGES.EN).then(data => {
            if (data) {
                //Analytics
                anaUtils.setNextPageData({
                    navigationInfo: anaUtils.buildNavPath([
                        'toolbar',
                        'change country',
                        data.profileLocale.toLowerCase() + '-' + data.profileLanguage.toLowerCase()
                    ])
                });
            }

            /**
             * Clear basket and category data cache whenever user switches country due to
             * restrictions that may appear per locale.
             */
            Flush.flushUser();
            Flush.flushBasket();
            Flush.flushPersonalizedPromotions();
            Flush.flushCatNav();
            Flush.flushMyListsData();
            Storage.session.removeItem('selectedStore');
            Storage.session.removeItem('preferredZipCode');
            // Remove SuperChat config when language/country changes as it's language-specific
            removeSuperChatConfig();
            cookieUtils.write(userUtils.SHIP_COUNTRY_COOKIE, (ctry || localeUtils.COUNTRIES.US).toUpperCase());

            const isRCPSFullProfileGroup = RCPSCookies.isRCPSFullProfileGroup();

            if (isRCPSFullProfileGroup) {
                localeUtils.setCurrentLanguage(data.profileLanguage.toLowerCase());
                localeUtils.setCurrentCountry(data.profileLocale.toLowerCase());
            }

            const redirect = () => {
                setZipStoreCookie(data);

                if (data.redirectPath) {
                    urlUtils.redirectTo(data.redirectPath);
                } else if (window.location.search) {
                    urlUtils.redirectTo(window.location.pathname + window.location.search);
                } else {
                    urlUtils.redirectTo(window.location.pathname);
                }
            };

            // Show any warnings that occurred
            if (data.profileWarnings) {
                const { message, messageContext } = getProfileWarningModalTexts(data);

                dispatch(actions.showCountrySwitcherModal(false));
                dispatch(
                    actions.showInfoModal({
                        isOpen: true,
                        title: userUtils.INFO_MODAL_WARNING_TITLE,
                        message: message,
                        dataAtMessageContext: messageContext,
                        callback: redirect
                    })
                );
            } else {
                setPreferredStoreLocation({ callback: redirect });
            }
        });
    };
}

function draftStoreDetails(storeDetails) {
    const action = {
        type: DRAFT_STORE_DETAILS,
        payload: storeDetails
    };

    return action;
}

function draftZipCode(zipCode) {
    const action = {
        type: DRAFT_ZIP_CODE,
        payload: zipCode
    };

    return action;
}

function clearUpperFunnelDraft() {
    const action = {
        type: CLEAR_UPPER_FUNNEL_DRAFT
    };

    return action;
}

function storeChangedFromHeader(payload) {
    const action = {
        type: STORE_CHANGED_FROM_HEADER,
        payload: payload
    };

    return action;
}

function zipCodeChangedFromHeader(payload) {
    const action = {
        type: ZIP_CODE_CHANGED_FROM_HEADER,
        payload: payload
    };

    return action;
}

function addSubscribedEmail(data) {
    const action = {
        type: ADD_SUBSCRIBED_EMAIL,
        payload: data
    };

    return action;
}

function updateQueryParams(queryParams, targetRefinements, isAvailable, newValue) {
    const prevRefinements = queryParams?.ref || [];
    const nextRefinements = [];

    // Availability is based on BOPIS or SDD options.
    // If either BOPIS or SDD is available, refinements are updated
    // using the selected store ID or zip code (newValue).
    // If neither is available for the selected store or zip code,
    // the corresponding refinements are removed from the query params.
    if (isAvailable) {
        for (const refinement of prevRefinements) {
            const [key] = refinement.split('=');

            if (targetRefinements.includes(key)) {
                nextRefinements.push(`${key}=${newValue}`);
            } else {
                nextRefinements.push(refinement);
            }
        }
    } else {
        for (const refinement of prevRefinements) {
            const [key] = refinement.split('=');

            if (!targetRefinements.includes(key)) {
                nextRefinements.push(refinement);
            }
        }
    }

    const nextQueryParams = {
        ...queryParams,
        ref: nextRefinements
    };

    // Force a SPA page update even when the 'ref' query param hasn't changed
    if (prevRefinements.join() === nextRefinements.join()) {
        const ts = Math.round(new Date().getTime() / 1000);
        nextQueryParams.ts = ts;
    }

    return nextQueryParams;
}

function refreshPageResults(queryParams) {
    return dispatch => {
        function clearCache() {
            // This returns true for both Search and Sale pages,
            // since they share the same underlying template.
            const isSearchOrSalePage = Location.isSearchPage();
            const { template } = SpaUtils.getSpaTemplateInfoByUrl(Location.getLocation().pathname) || Empty.Object;

            const cacheNameSpace = isSearchOrSalePage ? CATALOG_API_CALL.SEARCH : catalogUtils.catalogInstanceOptions[template]?.catalogApiCall;

            if (cacheNameSpace) {
                cacheConcern.clearCache(cacheNameSpace);
            }
        }

        deferTaskExecution(() => {
            clearCache();
            dispatch(historyLocationActions.goTo({ queryParams }));
        });
    };
}

function onStoreChangedFromHeader() {
    return (dispatch, getState) =>
        store.watchAction(STORE_CHANGED_FROM_HEADER, action => {
            const queryParams = getState().historyLocation.queryParams;
            const { payload } = action;
            const isAvailable = payload?.isBopisable;
            const newValue = payload?.storeId;

            const nextQueryParams = updateQueryParams(queryParams, STORE_ID_REFINEMENTS, isAvailable, newValue);

            dispatch(refreshPageResults(nextQueryParams));
        });
}

function onZipCodeChangedFromHeader() {
    return (dispatch, getState) =>
        store.watchAction(ZIP_CODE_CHANGED_FROM_HEADER, action => {
            const queryParams = getState().historyLocation.queryParams;
            const { payload } = action;
            const isAvailable = payload?.sameDayAvailable;
            const newValue = payload?.zipCode;

            const nextQueryParams = updateQueryParams(queryParams, ZIP_CODE_REFINEMENTS, isAvailable, newValue);

            dispatch(refreshPageResults(nextQueryParams));
        });
}

function _sortPurchasesByDate(userPurchases) {
    userPurchases.sort((firstPurchase, secondPurchase) => {
        return new Date(secondPurchase.transactionDate) - new Date(firstPurchase.transactionDate);
    });

    return userPurchases;
}

function _sortPurchasesByFrequency(userPurchases) {
    userPurchases.sort((firstPurchase, secondPurchase) => {
        return secondPurchase.frequency - firstPurchase.frequency;
    });

    return userPurchases;
}

function fetchPurchaseHistory(
    { userId, requiredData: { purchaseHistory } },
    showBuyItAgainImagesOnAccountMenu,
    switchBuyItAgainImagesLogic,
    showAccountMenuBuyItAgain
) {
    if (!purchaseHistory || userId == null) {
        return null;
    }

    return dispatch => {
        return BIApi.getPurchaseHistory(userId, {
            sortBy: 'recently',
            groupBy: switchBuyItAgainImagesLogic ? 'frequencyAndDate' : 'none',
            itemsPerPage: switchBuyItAgainImagesLogic || showAccountMenuBuyItAgain ? 21 : showBuyItAgainImagesOnAccountMenu ? 5 : 4,
            excludeSamples: showBuyItAgainImagesOnAccountMenu || switchBuyItAgainImagesLogic || showAccountMenuBuyItAgain,
            excludeRewards: showBuyItAgainImagesOnAccountMenu || switchBuyItAgainImagesLogic || showAccountMenuBuyItAgain
        })
            .then(({ purchasedItems }) => {
                if (switchBuyItAgainImagesLogic) {
                    const sortedPurchases = _sortPurchasesByFrequency(_sortPurchasesByDate(purchasedItems)).slice(0, 5);

                    return dispatch(actions.updatePurchasedHistoryItems(sortedPurchases));
                }

                return dispatch(actions.updatePurchasedHistoryItems(purchasedItems));
            })
            .catch(err => {
                console.error(err); // eslint-disable-line no-console

                return dispatch(actions.updatePurchasedHistoryItems([]));
            });
    };
}

function submitSMSOptInForm(rawPhoneNumber, pageName, formattedPhone, failureCallback, pageType, requestOrigin = null, successCallback) {
    return dispatch => {
        const phoneNumber = rawPhoneNumber.replace(specialCharacterRegex, '');
        const locale = localeUtils.getCurrentLanguageCountryCode();
        const TYPE_VALUE = 'SMS';

        let options = {
            type: TYPE_VALUE,
            phoneNumber
        };

        if (requestOrigin) {
            options = {
                ...options,
                requestOrigin
            };
        }

        if (pageType) {
            options = {
                ...options,
                locale,
                pageName,
                pageType
            };
        }

        return bccEmailSMSOptInService
            .submitEmailSMSOptInForm(options)
            .then(() => {
                if (pageType === 'SMS_optout' && typeof successCallback === 'function') {
                    successCallback();
                } else {
                    // Fire s.t() call when user successfully subscribes to SMS
                    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                        data: {
                            pageName: `${anaConsts.PAGE_TYPES.TEXT_MODAL}:${anaConsts.PAGE_DETAIL.SUBSCRIBE_TEXT_IS_ON_THE_WAY}:n/a:*`,
                            pageType: anaConsts.PAGE_TYPES.TEXT_MODAL,
                            pageDetail: anaConsts.PAGE_DETAIL.SUBSCRIBE_TEXT_IS_ON_THE_WAY,
                            eventStrings: [anaConsts.Event.REGISTRATION_PHONE_OPT_IN]
                        }
                    });
                    dispatch(actions.showMobileConfirmModal(true, formattedPhone, successCallback));
                }
            })
            .catch(err => {
                if (typeof failureCallback === 'function') {
                    failureCallback(err);
                }
            });
    };
}

function submitBackInStockSMSOptInForm(phoneNumber, skuId, subscriptionType, successCallback, failureCallBack) {
    return () => {
        const TYPE_VALUE = 'SMS';

        return backInStockSMSOptInService
            .backInStockSMSOptInForm(
                {
                    notificationType: TYPE_VALUE,
                    phoneNumber,
                    skuId
                },
                subscriptionType
            )
            .then(successCallback)
            .catch(failureCallBack);
    };
}

function submitBackInStockMarketingAlerts(phoneNumber, successCallback, failureCallBack) {
    return () => {
        const TYPE_VALUE = 'SMS';

        return bccEmailSMSOptInService
            .submitEmailSMSOptInForm({
                phoneNumber,
                type: TYPE_VALUE,
                requestOrigin: 'OOSNotification'
            })
            .then(successCallback)
            .catch(failureCallBack);
    };
}

function fetchBeautyRecommendations({ userId, requiredData: { beautyRecommendations } }) {
    if (!beautyRecommendations || userId == null) {
        return null;
    }

    return dispatch => {
        return getProfileSamplesByDSG(userId, {
            limit: 4,
            includeInactiveSkus: true,
            itemsPerPage: 4
        })
            .then(skus => {
                dispatch(actions.addBeautyRecommendations(skus));
            })
            .catch(err => {
                console.error(err); // eslint-disable-line no-console

                return dispatch(actions.addBeautyRecommendations([]));
            });
    };
}

function toggleSelectAsDefaultPayment(paymentName) {
    return {
        type: TOGGLE_SELECT_AS_DEFAULT_PAYMENT,
        payload: {
            paymentName
        }
    };
}

function validateUserStatus(callback = Empty.Function) {
    return () => {
        userUtils.validateUserStatus().then(callback);
    };
}

function loginForPreview(login, password, successCallback, failureCallBack) {
    return (dispatch, getState) => {
        const userprofile = getState().auth.profileStatus;
        const signInForPreview = () => {
            dispatch(signIn(login, password, false, true, successCallback, failureCallBack));
        };

        if (userprofile === 0) {
            signInForPreview();
        } else {
            dispatch(
                signOut(false, false, true, async () => {
                    await Sephora.Util.RefreshToken.getAnonymousToken();
                    signInForPreview();
                })
            );
        }
    };
}

function sendVerificationEmail(email, token) {
    return decorators
        .withInterstice(authenticationApi.emailVerificationStoreBI)(email, token)
        .then(response => {
            return {
                type: SHOW_EMAIL_SENT_MODAL,
                ...response
            };
        });
}

const updateStoreDefaultShippingAddressData = payload => ({
    type: UPDATE_DEFAULT_SA_DATA,
    payload
});

Sephora.Util.showSignInModal = (isOpen = true, options = {}) => {
    store.dispatch(actions.showSignInModal({ isOpen, options }));
};

Sephora.Util.showRegisterModal = (isOpen = true, options = {}) => {
    store.dispatch(actions.showRegisterModal({ isOpen, options }));
};

const userActions = {
    ERROR_CODES,
    FRAGMENT_FOR_UPDATE,
    register,
    biRegister,
    update,
    signIn,
    signOut,
    processUserFull,
    getLithiumUserData,
    checkUser,
    checkEmailAndPhone,
    forgotPassword,
    switchCountry,
    updateUserInformation,
    updateUserFragment,
    getUserFull,
    getUserCreditCardRewards,
    getCommonAnalytics,
    updatePreferredStore,
    draftStoreDetails,
    draftZipCode,
    clearUpperFunnelDraft,
    storeChangedFromHeader,
    zipCodeChangedFromHeader,
    onZipCodeChangedFromHeader,
    onStoreChangedFromHeader,
    fetchPurchaseHistory,
    fetchCompletePurchaseHistory,
    submitSMSOptInForm,
    fetchBeautyRecommendations,
    toggleSelectAsDefaultPayment,
    submitBackInStockSMSOptInForm,
    submitBackInStockMarketingAlerts,
    addSubscribedEmail,
    validateUserStatus,
    initPaze,
    loginForPreview,
    sendVerificationEmail,
    updateStoreDefaultShippingAddressData
};

export default userActions;
