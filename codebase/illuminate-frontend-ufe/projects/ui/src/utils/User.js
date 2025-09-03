import watch from 'redux-watch';
import skuUtils from 'utils/Sku';
import cookieUtils from 'utils/Cookies';
import localeUtils from 'utils/LanguageLocale';
import helperUtils from 'utils/Helpers';
import UrlUtils from 'utils/Url';
import Storage from 'utils/localStorage/Storage';
import store from 'store/Store';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import auth from 'utils/Authentication';
import { APPROVAL_STATUS } from 'constants/CreditCard';
import locationUtils from 'utils/Location';
import RCPSCookies from 'utils/RCPSCookies';
import { BASKET_TYPES } from 'actions/ActionsConstants';
import { sephoraEmployeeSelector } from 'selectors/user/sephoraEmployeeSelector';
import Empty from 'constants/empty';
import beautyPreferencesUtils from 'utils/BeautyPreferences';

const SHIP_COUNTRY_COOKIE = 'ship_country';

const PROFILE_STATUS = {
    LOGGED_IN: 4,
    RECOGNIZED: 2,
    RECOGNIZED_SSI: 3,
    ANONYMOUS: 0
};
PROFILE_STATUS.RECOGNIZED_STATUSES = [PROFILE_STATUS.RECOGNIZED, PROFILE_STATUS.RECOGNIZED_SSI];

// for futher information check this:
// https://jira.sephora.com/browse/ILLUPH-53610?focusedCommentId=296956&page=com.atlassian.jira.plugin.system.issuetabpanels%3Acomment-tabpanel#comment-296956
const LOGIN_STATUS = {
    GENERAL_LOGIN: 0,
    AUTO_LOGIN: 1
};

const USER_DATA_EXPIRY = Storage.HOURS * 1;

const getRewardsLabelsObj = () => {
    const getText = localeUtils.getLocaleResourceFile('utils/locales/User', 'User');

    return {
        CELEBRATION_GIFT: {
            TITLE: getText('celebrationGiftTitle'),
            SUBTITLE: getText('celebrationGiftSubtitle')
        },
        REWARDS: { TITLE: getText('rewardsTitle') },
        BIRTHDAY_GIFT: {
            TITLE: getText('birthdayGiftTitle'),
            SUBTITLE: getText('birthdayGiftSubtitle')
        }
    };
};

const getInfoModalWarningTitle = () => {
    const getText = localeUtils.getLocaleResourceFile('utils/locales/User', 'User');

    return getText('infoModalWarningTitle');
};

const EMAIL_PHONE_VALIDATION_FAILURE_CODES = {
    isErrorCodePresent: (errorData = Empty.Object, code) => {
        return (
            Object.hasOwn(errorData, 'errors') &&
            Array.isArray(errorData.errors) &&
            errorData.errors.findIndex(error => error?.errorCode === code) > -1
        );
    },
    REJECT: 'fms.verify.email.reject',
    TYPO: 'fms.verify.email.typo',
    VERIFY: 'fms.verify.email.verify',
    PHONE_REJECT: 'fms.verify.phone.reject'
};

const userUtils = {
    SHIP_COUNTRY_COOKIE,

    PROFILE_STATUS,

    LOGIN_STATUS,

    USER_DATA_EXPIRY,

    rewardsLabels: getRewardsLabelsObj(),

    INFO_MODAL_WARNING_TITLE: getInfoModalWarningTitle(),

    types: {
        NON_BI: 'NON_BI',
        BI: 'BI',
        VIB: 'VIB',
        ROUGE: 'ROUGE',
        BI_DOWN: 'BI_DOWN',
        LOGGED_IN: 'loggedin',
        RECOGNIZED: 'recognized',
        UNRECOGNIZED: 'unrecognized'
    },

    isSDDRougeFreeShipEligible: function () {
        const user = store.getState().user;

        if (RCPSCookies.isRCPSFullProfileGroup()) {
            const basket = store.getState().basket;
            const { isSDDRougeFreeShipEligible = false } = user;
            const { itemsByBasket = [], SDDRougeTestThreshold } = basket;

            if (SDDRougeTestThreshold) {
                const [sddItems] = itemsByBasket.filter(item => item.basketType === BASKET_TYPES.SAMEDAY_BASKET);

                const totalPriceOfSddItems = sddItems?.itemsCount
                    ? sddItems.items.reduce((acc, item) => acc + skuUtils.parsePrice(item.listPriceSubtotal), 0)
                    : 0;
                const isAboveThreshold = totalPriceOfSddItems > SDDRougeTestThreshold;

                return isSDDRougeFreeShipEligible && isAboveThreshold;
            }

            return isSDDRougeFreeShipEligible;
        }

        return user.isSDDRougeFreeShipEligible || false;
    },

    getBiAccountId: function () {
        const user = store.getState().user;

        return user?.beautyInsiderAccount?.biAccountId || Storage.local.getItem(LOCAL_STORAGE.BI_ACCOUNT_ID);
    },

    getBiStatus: function () {
        const user = store.getState().user;

        return user.beautyInsiderAccount ? user.beautyInsiderAccount.vibSegment : this.types.NON_BI;
    },

    getRealTimeBiStatus: function () {
        const user = store.getState().user;

        return user.beautyInsiderAccount ? user.beautyInsiderAccount.realTimeVIBStatus : this.types.NON_BI;
    },

    getBiAccountInfo: function (userData) {
        const user = userData || store.getState().user;

        return user.beautyInsiderAccount;
    },

    getBiStatusText: function (status) {
        const biStatus = status || this.getBiStatus();

        switch (biStatus) {
            case this.types.VIB:
                return 'VIB';
            case this.types.ROUGE:
                return 'Rouge';
            case this.types.BI:
                return 'Insider';
            default:
                return this.types.NON_BI;
        }
    },

    isCelebrationEligible: function (beautyInsiderAccount) {
        const biAccount = beautyInsiderAccount || store.getState().user.beautyInsiderAccount || {};

        return biAccount.eligibleForCelebrationGift;
    },

    isBirthdayGiftEligible: function (user) {
        const biAccount = (user || store.getState().user).beautyInsiderAccount;

        return !!(biAccount && biAccount.eligibleForBirthdayGift);
    },

    getProfileId: function () {
        const user = store.getState().user;

        return user.profileId;
    },

    getPublicId: function () {
        const user = store.getState().user;

        return user.publicId;
    },

    getProfileStatus: function () {
        const authData = store.getState().auth;

        return authData.profileStatus;
    },

    getProfileFirstName: function () {
        const user = store.getState().user;

        return user.firstName;
    },

    getProfileLastName: function () {
        const user = store.getState().user;

        return user.lastName;
    },

    getProfileEmail: function () {
        const user = store.getState().user;

        return user?.login || user.beautyInsiderAccount?.email;
    },

    /**
     * Formats the user's registration date into an ISO 8601 string with a timezone offset.
     *
     * This function retrieves the signup date from the Redux store (or uses the current date if unavailable).
     * It converts the date into a UTC-based string (YYYY-MM-DDTHH:mm:ss+/-HH:mm), including the user's local timezone offset.
     *
     * @returns {string} The user's registration date in ISO 8601 format with timezone offset.
     */

    formatUserRegistrationDate: function () {
        const user = store.getState().user;
        const signupDate = user?.profile?.beautyInsiderAccount?.signupDate || Date.now();

        const date = new Date(signupDate);

        // Get the components of the date in UTC
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');

        // Calculate timezone offset (in minutes)
        const timezoneOffset = date.getTimezoneOffset(); // Offset in minutes (e.g., -480 for UTC-8)
        const sign = timezoneOffset > 0 ? '-' : '+';
        const offsetHours = String(Math.abs(Math.floor(timezoneOffset / 60))).padStart(2, '0');
        const offsetMinutes = String(Math.abs(timezoneOffset % 60)).padStart(2, '0');
        const timezone = `${sign}${offsetHours}:${offsetMinutes}`;

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezone}`;
    },

    /**
     *
     * @returns Boolean
     */
    isSephoraEmployee: function () {
        return sephoraEmployeeSelector(store.getState()) === 'Y';
    },

    getUserPhoneNumber: function () {
        const user = store.getState().user;

        return user.phoneNumber;
    },

    isPreApprovedForCreditCard: function () {
        const biInfo = this.getBiAccountInfo();

        return biInfo && biInfo.ccAccountandPrescreenInfo && biInfo.ccAccountandPrescreenInfo.preScreenStatus;
    },

    getSephoraCreditCardInfo: function (user) {
        const biInfo = this.getBiAccountInfo(user);

        return biInfo && biInfo.ccAccountandPrescreenInfo;
    },

    isSephoraCreditCardHolder: function () {
        const sephoraCreditCardInfo = this.getSephoraCreditCardInfo();

        return sephoraCreditCardInfo?.ccApprovalStatus === APPROVAL_STATUS.APPROVED;
    },

    getCreditCardType: function () {
        const user = store.getState().user;

        return user.ccCardType;
    },

    getBankRewards: function () {
        const user = store.getState().user;

        return user.ccRewards?.bankRewards || {};
    },

    getRewardsAmount: function (bankRewards) {
        return bankRewards && bankRewards.rewardsTotal ? bankRewards.rewardsTotal : 0;
    },

    getGiftLastDateToRedeem: function () {
        const beautyInsiderAccount = store.getState().user.beautyInsiderAccount;

        return beautyInsiderAccount ? beautyInsiderAccount.bdGiftLastDateToRedeem : null;
    },

    getZipCode: function () {
        const SELECTED_STORE = 'selectedStore';
        const selectedStore = Storage.session.getItem(SELECTED_STORE);
        const postalCode = selectedStore ? selectedStore.address?.postalCode : null;

        return store.getState().user?.preferredZipCode || postalCode;
    },

    getDefaultSAZipCode: function () {
        return store.getState().user?.defaultSAZipCode || Empty.String;
    },

    getDefaultSACountryCode: function () {
        return store.getState().user?.defaultSACountryCode || Empty.String;
    },

    getZipCodeOfPrefferedStore: function () {
        const SELECTED_STORE = 'selectedStore';
        const selectedStore = Storage.session.getItem(SELECTED_STORE);
        const postalCode = selectedStore ? selectedStore.address?.postalCode : null;

        return postalCode;
    },

    getPreferredStoreId: function () {
        const SELECTED_STORE = 'selectedStore';
        const selectedStore = Storage.session.getItem(SELECTED_STORE);
        const selectedStoreId = selectedStore ? selectedStore.storeId : null;

        return store.getState().user?.preferredStoreInfo?.storeId || selectedStoreId;
    },

    getPreferredStoreInfo: function () {
        const SELECTED_STORE = 'selectedStore';
        const selectedStore = Storage.session.getItem(SELECTED_STORE);
        const selectedStoreItem = selectedStore ? selectedStore : null;

        return store.getState().user?.preferredStoreInfo || selectedStoreItem;
    },

    isBI: function () {
        return this.getBiStatus() !== this.types.NON_BI;
    },

    isInsider: function () {
        return this.getBiStatus() === this.types.BI;
    },

    isRouge: function () {
        return this.getBiStatus() === this.types.ROUGE;
    },

    isVIB: function () {
        return this.getBiStatus() === this.types.VIB;
    },

    isAnonymous: function (data) {
        const authData = data || store.getState().auth;

        return typeof authData.profileStatus === 'undefined' || authData.profileStatus === PROFILE_STATUS.ANONYMOUS;
    },

    isSignedIn: function (data) {
        const authData = data || store.getState().auth;

        return authData.profileStatus === PROFILE_STATUS.LOGGED_IN;
    },

    isRecognized: function () {
        return PROFILE_STATUS.RECOGNIZED_STATUSES.includes(store.getState().auth.profileStatus);
    },

    isRecognizedSSI: function (data) {
        const authData = data || store.getState().auth;

        return authData.profileStatus === PROFILE_STATUS.RECOGNIZED_SSI;
    },

    isUserAtleastRecognized: function () {
        const profileStatus = store.getState().auth.profileStatus;

        return profileStatus === PROFILE_STATUS.LOGGED_IN || this.isRecognized();
    },

    isBiLevelQualifiedFor: function (sku) {
        const biTierMatrix = {
            none: 0,
            bi: 1,
            vib: 2,
            rouge: 3,
            /*eslint-disable camelcase*/
            non_bi: 0
        };

        //if sku is a bi reward and exclusive level is none, then reward is lowest level (bi)
        //biExclusiveLevel is set to vib or rouge when reward can only be purchased by those tiers
        const skuTier = skuUtils.isBiReward(sku) && sku.biExclusiveLevel === 'none' ? 'bi' : (sku.biExclusiveLevel || 'none').toLowerCase();
        const userTier = this?.getBiStatus()?.toLowerCase();
        const isTierMet = biTierMatrix[userTier] >= biTierMatrix[skuTier];

        return isTierMet;
    },

    isBiPointsBiQualifiedFor: function (sku) {
        const basket = store.getState().basket;
        const skuPoints = skuUtils.getBiPoints(sku);

        // bday gift, welcome kit, etc dont require points to be added to cart
        if (!skuPoints) {
            return true;
        } else {
            return skuPoints <= basket.availableBiPoints - basket.redeemedBiPoints;
        }
    },

    isRewardEligible: function (sku) {
        //checks sku BI level against users
        if (!this.isBiLevelQualifiedFor(sku)) {
            return false;
        }

        //checks the points of BI user against reward item
        return this.isBiPointsBiQualifiedFor(sku);
    },

    //Gets the current logged in user
    getUser: function () {
        return new Promise(resolve => {
            const userData = store.getState('user');
            const userWatch = watch(store.getState, 'user');

            if (userData.user && userData.user.profileId) {
                resolve(userData.user);
            } else {
                // Here, we're acting on a premise that the user can change only
                // once, i.e. on sign in. The page is supposed to get reloaded
                // always when user signs out.
                const unsubscribe = store.subscribe(
                    userWatch(user => {
                        resolve(user);
                        unsubscribe();
                    }),
                    this
                );
            }
        });
    },

    /**
     * Validates that user state has been set
     * @returns {Promise}
     */
    validateUserStatus: function () {
        return new Promise(resolve => {
            const user = store.getState('user').user;
            const authData = store.getState('auth').auth;
            const userWatch = watch(store.getState, ['user', 'auth']);

            if (user.profileLocale) {
                resolve({ user, auth: authData });
            } else {
                // Here, we're acting on a premise that the user can change only
                // once, i.e. on sign in. The page is supposed to get reloaded
                // always when user signs out.
                const unsubscribe = store.subscribe(
                    userWatch(data => {
                        resolve(data);
                        unsubscribe();
                    }),
                    this
                );
            }
        });
    },

    /** cleans up the various nested BI personalization information for display purposes.
     * params: personalizedInformation object from the beautyInsiderAccount object inside of user
     * returns either cleaned up information or an empty object
     **/
    biPersonalInfoDisplayCleanUp: function (personalizedInfo) {
        const personalInfo = Object.assign({}, personalizedInfo);
        const cherryPickInfo = function (objArray) {
            const newArray = [];
            objArray.forEach(obj => {
                if (Object.prototype.hasOwnProperty.call(obj, 'isSelected')) {
                    newArray.push(obj.displayName);
                }
            });

            if (newArray.length === 1) {
                return newArray[0];
            } else if (newArray.length === 0) {
                return null;
            } else {
                return newArray.join(', ');
            }
        };

        for (const key in personalInfo) {
            if (Object.prototype.hasOwnProperty.call(personalInfo, key)) {
                const newDisplayValue = cherryPickInfo(personalInfo[key]);

                if (newDisplayValue) {
                    personalInfo[key] = newDisplayValue;
                } else {
                    personalInfo[key] = null;
                }
            }
        }

        return personalInfo;
    },

    getBeautyPreferenceDisplayValues: function (userBeautyPreferences, communityVisiblePreferences) {
        const dynamicRefinements = beautyPreferencesUtils.getDynamicRefinements();
        let savedBeautyPreferences = {};

        Object.keys(userBeautyPreferences).forEach(key => {
            if (communityVisiblePreferences.includes(key)) {
                const beautyPref = { [key]: userBeautyPreferences[key] };
                savedBeautyPreferences = { ...savedBeautyPreferences, ...beautyPref };
            }
        });

        let beautyPreferencesDisplayValues = {};

        dynamicRefinements.forEach(refinement => {
            const currentBeautyPreference = savedBeautyPreferences[refinement.key];

            if (Object.keys(savedBeautyPreferences).includes(refinement?.key)) {
                refinement.items.forEach(item => {
                    if (currentBeautyPreference.includes(item?.key)) {
                        let beautyPrefDisplayNames;

                        if (refinement?.key in beautyPreferencesDisplayValues) {
                            beautyPreferencesDisplayValues[refinement.key] = [...beautyPreferencesDisplayValues[refinement?.key], item?.value];
                        } else {
                            beautyPrefDisplayNames = { [refinement?.key]: [item?.value] };
                        }

                        beautyPreferencesDisplayValues = { ...beautyPreferencesDisplayValues, ...beautyPrefDisplayNames };
                    }
                });
            }
        });

        return beautyPreferencesDisplayValues;
    },

    /** if all the keys in the cleaned up bi personal info are empty except for gender
     * (because gender is always provided upon BI registration as true for female),
     * indicating that the user has not chosen any personalized information, return true
     **/
    isBiPersonalInfoEmpty: function (personalInfo) {
        let isEmpty = true;

        for (const key in personalInfo) {
            if (key !== 'gender' && personalInfo[key]) {
                isEmpty = false;
            }
        }

        return isEmpty;
    },

    //converts number for display with k for thousands and m for millions
    //param: number
    formatSocialCount: function (num) {
        switch (true) {
            case num >= 1000000:
                return (
                    helperUtils
                        .decimalFloor(num / 1000000, -1)
                        .toString()
                        .replace(/\.0$/, '') + 'm'
                );
            case num >= 1000:
                return (
                    helperUtils
                        .decimalFloor(num / 1000, -1)
                        .toString()
                        .replace(/\.0$/, '') + 'k'
                );
            default:
                return num;
        }
    },

    getShippingCountry: function () {
        const countryCode = cookieUtils.read(SHIP_COUNTRY_COOKIE) || localeUtils.getCurrentCountry() || '';

        return {
            countryCode: countryCode.toUpperCase(),
            countryLongName: localeUtils.getCountryLongName(countryCode),
            countryFlagImage: localeUtils.getCountryFlagImage(countryCode)
        };
    },

    setShippingCountry: function (country) {
        if (country && country.countryCode) {
            cookieUtils.write(SHIP_COUNTRY_COOKIE, country.countryCode);
        }
    },

    refreshShippingCountry: function () {
        this.setShippingCountry(this.getShippingCountry());
    },

    isSocial: function () {
        return !!store.getState().user.nickName;
    },

    getNickname: function () {
        return store.getState().user.nickName;
    },

    needsSocialReOpt: function () {
        return !store.getState().user.isSocialEnabled;
    },

    displayBiStatus: function (vibSegment) {
        switch (vibSegment) {
            case this.types.VIB:
                return 'VIB';
            case this.types.ROUGE:
                return 'ROUGE';
            default:
                return 'INSIDER';
        }
    },

    getSocialInfo: function () {
        const socialInfoWatch = watch(store.getState, 'socialInfo');

        return new Promise((resolve, reject) => {
            const lithiumSuccessCheck = function (socialInfo) {
                if (socialInfo.isLithiumSuccessful) {
                    resolve(socialInfo);
                } else {
                    // eslint-disable-next-line prefer-promise-reject-errors
                    reject();
                }
            };

            // Per Hanah Yendler:
            // 1. Get initial social info from store.
            // 2. If isLithiumSuccessful flag has not been updated to have
            // either true or false, subscribe to watch the social info.
            // 3. Once the value has been added, handle the outcome in
            // lithiumSuccessCheck.
            const initialSocialInfo = store.getState().socialInfo;

            if (initialSocialInfo.isLithiumSuccessful !== null) {
                lithiumSuccessCheck(initialSocialInfo);
            } else {
                const unsubscribe = store.subscribe(
                    socialInfoWatch(newSocialInfo => {
                        unsubscribe();
                        lithiumSuccessCheck(newSocialInfo);
                    }),
                    { ignoreAutoUnsubscribe: true }
                );
            }
        });
    },

    getUserSkinTones: function () {
        const userSkinTones = [];

        // If there's a shade_code url param, use it for Anonymous user
        const urlShadeCodeParam = UrlUtils.getParamsByName('shade_code');

        if (userUtils.isAnonymous() && urlShadeCodeParam) {
            return urlShadeCodeParam;
        }

        const { beautyInsiderAccount } = store.getState().user;

        const skinTones = beautyInsiderAccount ? beautyInsiderAccount.skinTones : [];

        if (skinTones && skinTones.length > 0) {
            skinTones.forEach(tone => {
                if (tone.labValue) {
                    userSkinTones.push(tone.labValue);
                }
            });
        }

        return userSkinTones;
    },

    checkForNoBankRewards: function (bankRewards) {
        return (
            !bankRewards ||
            !bankRewards.rewardCertificates ||
            (Array.isArray(bankRewards.rewardCertificates) && !bankRewards.rewardCertificates.length > 0)
        );
    },

    isDefaultBIBirthDay: function (biAccount) {
        const birthday = biAccount || store.getState().user.beautyInsiderAccount;

        return birthday && parseInt(birthday.birthMonth) === 1 && parseInt(birthday.birthDay) === 1 && parseInt(birthday.birthYear) === 1804;
    },

    isEligibleForRRC: function () {
        const biAccount = store.getState().user.beautyInsiderAccount;

        return !!biAccount && biAccount.isEligibleForRRC;
    },

    //set global variables for Snapchat and Twitter Conversion pixels
    setSignUpData: function ({ isJoinBi, inStoreUser }) {
        digitalData.user[0].profile[0].profileInfo.inStoreUser = inStoreUser;
        digitalData.user[0].profile[0].profileInfo.isJoinBi = isJoinBi;
    },

    forceSignIn: function () {
        const { isRichProfilePage, isVendorLoginPage, isPreviewSettings, isVendorGenericLogin } = locationUtils;
        const SignInSeen = Storage.local.getItem(LOCAL_STORAGE.SIGN_IN_SEEN);
        const pageDisplayCount = Storage.local.getItem(LOCAL_STORAGE.PAGE_DISPLAY_COUNT);

        // If we don't have PAGE_DISPLAY_COUNT localStorage it means it's the 1st page load
        // PAGE_DISPLAY_COUNT=1 means we've already seen 1 page
        // We can ignore for subsequent page loads
        if (!pageDisplayCount) {
            Storage.local.setItem(LOCAL_STORAGE.PAGE_DISPLAY_COUNT, 1);
        }

        if (
            Sephora.isDesktop() &&
            this.isAnonymous() &&
            !SignInSeen &&
            !pageDisplayCount &&
            !isRichProfilePage() &&
            !isVendorLoginPage() &&
            !isPreviewSettings() &&
            !isVendorGenericLogin()
        ) {
            auth.requireAuthentication(true, null, null).catch(() => {});
        }
    },

    birthdayRewardDaysLeft: function (bdayDaysLeftText = '') {
        return (bdayDaysLeftText.match(/(\d+)/) || '')[0];
    },

    getNextTierUser: function () {
        if (this.isInsider()) {
            return this.types.VIB;
        } else if (this.isVIB()) {
            return this.types.ROUGE;
        }

        return null;
    },

    /**
     * Aggregates previous purchase data for a specific product from purchase history
     * @param {Array} purchaseHistory - Complete purchase history array (grouped by product with full item data preserved)
     * @param {string} productId - The product ID to search for
     * @returns {Object|null} - Object with times, lastPurchase, variationType, and variationData, or null if no purchases found
     */
    getPreviousPurchaseData: function (purchaseHistory, productId) {
        // Handle different data structures:
        // 1. Root purchasedItems format: { purchasedItems: [...] }
        // 2. Direct array from Redux store: [{ productId, transactionDate, ... }] (processed data)
        // 3. Direct array with sku structure: [{ sku: { productId }, transactionDate, quantity }] (full data preserved)

        let itemsToSearch = purchaseHistory;

        // If purchase history has a purchasedItems property, use that array
        if (purchaseHistory.purchasedItems && Array.isArray(purchaseHistory.purchasedItems)) {
            itemsToSearch = purchaseHistory.purchasedItems;
        }

        const productPurchases = itemsToSearch.filter(item => {
            // Handle different data structures:
            // 1. Item has direct productId property (processed data from Redux)
            // 2. Item has sku.productId property (full API data)
            const itemProductId = item.productId || (item.sku && item.sku.productId);
            const hasValidProductId = itemProductId === productId;

            return hasValidProductId;
        });

        if (productPurchases.length === 0) {
            return null;
        } // Since groupPurchasedItems now preserves full data and keeps only the most recent purchase per product,
        // we should typically have only one item per product, but handle multiple items just in case

        // Calculate total times purchased (sum of quantities or purchasedItemsCount)
        const totalTimes = productPurchases.reduce((sum, purchase) => {
            return sum + (purchase.frequency || purchase.purchasedItemsCount || 1);
        }, 0);

        // Get most recent purchase date (items should already be the most recent due to grouping)
        // Handle both top-level transactionDate and sku.transactionDate for compatibility
        const sortedPurchases = productPurchases.sort((a, b) => {
            const dateA = a.transactionDate || (a.sku && a.sku.transactionDate);
            const dateB = b.transactionDate || (b.sku && b.sku.transactionDate);

            return new Date(dateB) - new Date(dateA);
        });
        const lastPurchase = sortedPurchases[0].transactionDate || (sortedPurchases[0].sku && sortedPurchases[0].sku.transactionDate);

        // Get the first purchase to extract variation information
        const firstPurchase = sortedPurchases[0];
        const firstSku = firstPurchase.sku || firstPurchase; // Handle both structures

        const result = {
            times: totalTimes,
            lastPurchase,
            transactionDate: lastPurchase,
            productId: productId,
            frequency: totalTimes,
            variationTypeDisplayName: firstSku.variationTypeDisplayName,
            variationValue: firstSku.variationValue,
            variationDesc: firstSku.variationDesc
        };

        return result;
    },

    isEmailDisposableError: function (errorData) {
        const { isErrorCodePresent, REJECT } = EMAIL_PHONE_VALIDATION_FAILURE_CODES;

        return isErrorCodePresent(errorData, REJECT);
    },

    isEmailTypoError: function (errorData) {
        const { isErrorCodePresent, TYPO } = EMAIL_PHONE_VALIDATION_FAILURE_CODES;

        return isErrorCodePresent(errorData, TYPO);
    },

    isEmailVerifyError: function (errorData) {
        const { isErrorCodePresent, VERIFY } = EMAIL_PHONE_VALIDATION_FAILURE_CODES;

        return isErrorCodePresent(errorData, VERIFY);
    },

    isPhoneRejectedError: function (errorData) {
        const { isErrorCodePresent, PHONE_REJECT } = EMAIL_PHONE_VALIDATION_FAILURE_CODES;

        return isErrorCodePresent(errorData, PHONE_REJECT);
    }
};

export default userUtils;
