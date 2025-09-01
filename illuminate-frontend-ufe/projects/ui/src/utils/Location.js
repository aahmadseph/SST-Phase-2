// this will not work for Header and Footer on legacy pages, as they are considered
// to be the same on all pages and their `location` is considered as `home page` always

import localeUtils from 'utils/LanguageLocale';
import PageTemplateType from 'constants/PageTemplateType';

const basketURL = /^\/basket*/;
const buyPageUrl = /^\/buy\/*/;
const rewardsURL = /^\/rewards*/;
const addReviewPageURL = /^\/addReview*/;
const CUSTOM_SETS_HASH = '#customsets';
const referrerURL = /^\/share/;
const happeningServices = /^\/happening\/services*/;

import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const NavigationType = {
    NonSPA: 'NonSPA',
    SPA: 'SPA',
    None: 'None'
};

function sanitizePathname(location) {
    const locationCopy = { ...location };
    locationCopy.pathname = locationCopy.pathname && locationCopy.pathname.replace(/ca\/en\/|ca\/fr\//g, '');

    return locationCopy;
}

function getWindowLocation(sanitize = false) {
    if (sanitize) {
        return sanitizePathname(window.location);
    } else {
        return window.location;
    }
}

function getLocation(sanitize = false) {
    return Sephora.location
        ? sanitize
            ? sanitizePathname(Sephora.location)
            : Sephora.location
        : !Sephora.isNodeRender
            ? getWindowLocation(sanitize)
            : { pathname: '' };
}

function setLocation(url) {
    const location = Location.getLocation();
    location.href = url;
}

function navigateTo(event, targetURL) {
    // middle click or open in new tab
    if (event && (event.button === 2 || event.metaKey || event.ctrlKey)) {
        return NavigationType.None;
    } else {
        // Dependency resolution "deadlock" (module will be resolved with an empty object) happens
        // when 2 below require statements are defined in the beginning of the file.
        const History = require('services/History').default;
        const SpaUtils = require('utils/Spa').default;
        const locationObj = History.splitURL(targetURL);

        if (SpaUtils.isSpaNavigation(locationObj)) {
            event?.preventDefault();
            History.doSPANavigation(locationObj);

            return NavigationType.SPA;
        } else {
            Location.setLocation(targetURL);

            return NavigationType.NonSPA;
        }
    }
}

function isHappeningServices(url) {
    if (url) {
        return !!url.match(happeningServices);
    } else {
        const location = Location.getLocation(true);

        return location.pathname && !!location.pathname.match(happeningServices);
    }
}

function isBasketPage() {
    const location = Location.getLocation(true);

    return location.pathname && !!location.pathname.match(basketURL);
}

function isBuyPage(url) {
    if (url) {
        return !!url.match(buyPageUrl);
    } else {
        const location = Location.getLocation(true);

        return location.pathname && !!location.pathname.match(buyPageUrl);
    }
}

function isRewardsPage() {
    const location = Location.getLocation(true);

    return Sephora.pagePath === PageTemplateType.Rewards || (location.pathname && !!location.pathname.match(rewardsURL));
}

function isOffersPage() {
    const location = Location.getLocation(true);

    return Sephora.renderQueryParams.urlPath === '/beauty/beauty-offers' || location.pathname.indexOf('/beauty/beauty-offers') !== -1;
}

function isHolidayPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/beauty/holiday-sale') !== -1;
}

function isAtRiskPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/beauty/ways-to-save') !== -1;
}

function isPickupDeliveryOptionsPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/beauty/pick-up-delivery-options') !== -1;
}

function isAddReviewPage() {
    const location = Location.getLocation(true);

    return location.pathname && !!location.pathname.match(addReviewPageURL);
}

function isGalleryPage() {
    return Sephora.pagePath === PageTemplateType.Gallery || Sephora.pagePath === PageTemplateType.GalleryPage;
}

function isGalleryAlbumPage() {
    const location = Location.getLocation(true);

    return /\/gallery\/album\/.*/.test(location.pathname);
}

function isCustomSets(hash) {
    return new RegExp(CUSTOM_SETS_HASH).test(hash || Location.getLocation().hash);
}

function isMyProfilePage() {
    const location = Location.getLocation();

    return location.pathname.indexOf('/profile/me') !== -1;
}

function isMyAccountPage() {
    return Sephora.pagePath === PageTemplateType.MyAccount;
}

function isAccountPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/account') === 0 || location.pathname.indexOf('/profile/MyAccount') === 0;
}

function isReplacementOrderPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/profile/MyAccount/replacementOrder') === 0;
}

function isRichProfilePage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/profile') === 0;
}

function isCheckout() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/checkout') === 0;
}

function isPreview() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/preview') === 0;
}

function isPreviewSettings() {
    return Sephora.pagePath === PageTemplateType.PreviewSettings;
}

function isProd() {
    const location = Location.getLocation();

    return location.href.match(/(www|m)\.sephora\.com/) !== null;
}

function isPreviewEnvironment() {
    const location = Location.getLocation();

    return location.href.includes('preview');
}

function isBrandNthCategoryPage() {
    return Sephora.pagePath === PageTemplateType.BrandNthCategory;
}

function isHomepage() {
    return Sephora.pagePath === PageTemplateType.Homepage;
}

function isRootCategoryPage() {
    return Sephora.pagePath === PageTemplateType.Category;
}

function isNthCategoryPage() {
    return Sephora.pagePath === PageTemplateType.NthCategory;
}

function isProductPage() {
    return Sephora.pagePath === PageTemplateType.ProductPage;
}

function isRwdContentStorePage() {
    return Sephora.pagePath === PageTemplateType.RwdContentStore;
}

function isPublicLovesPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/lovelist') === 0;
}

function isOrderConfirmationPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/checkout/confirmation') === 0;
}

function isGalleryProfilePage() {
    const location = Location.getLocation(true);

    return (
        location.pathname === '/myprofile' ||
        location.pathname === '/myprofile/photos' ||
        location.pathname === '/gallery/myprofile/photos' ||
        location.pathname === '/gallery/myprofile/loved'
    );
}

function isContentStorePage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/beauty/') === 0 && !Location.isContactUsPage() && !Location.isOrderStatusPage();
}

function isRwdCreditCardPage() {
    const location = Location.getLocation(true);

    return (
        location.pathname.indexOf('/beauty/CreditCard') === 0 ||
        location.pathname.indexOf('/creditcard') === 0 ||
        location.pathname.indexOf('/profile/creditcard') === 0
    );
}

function isCreditCardApplyPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/creditcard-apply') === 0 || location.pathname.indexOf('/creditcard/apply') === 0;
}

function isCreditCardTabPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/profile/CreditCard') === 0;
}

function isCreditCardMarketingPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/creditcard') === 0;
}

function isSearchPage() {
    return Sephora.pagePath === PageTemplateType.Search;
}

function isBIPage() {
    return Sephora.pagePath === PageTemplateType.BeautyInsider || location.pathname.toLowerCase().indexOf('/beautyinsider') === 0;
}

function isTargetedLandingPage() {
    return Sephora.pagePath === PageTemplateType.BeautyWinPromo || location.pathname.toLowerCase().indexOf('/beauty-win-promo') === 0;
}

function isBIRBPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/rewards') === 0;
}

function isSalePage() {
    const salePathRegExp = /^.*\/sale\?*$/i;
    const location = Location.getLocation(true);

    return location.pathname.match(salePathRegExp) !== null;
}

function isOnlineReservationLandingPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/happening/home') === 0;
}

function isContactUsPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/beauty/contact-us') === 0;
}

function isCustomerServicePage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/beauty/customer-service') === 0;
}

function isOrderStatusPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/beauty/order-status') === 0;
}

function isPurchaseHistoryPage() {
    return Sephora.pagePath === PageTemplateType.PurchaseHistory;
}

function isLovesListPage() {
    return Sephora.pagePath === PageTemplateType.ShoppingList;
}

function isReferrerPage() {
    const location = Location.getLocation(true);

    return location.pathname && !!location.pathname.match(referrerURL);
}

function isContentPage() {
    return Sephora.pagePath === PageTemplateType.Content;
}

function isAutoreplenishPage() {
    return Sephora.pagePath === PageTemplateType.AutoReplenishment;
}

function reload() {
    window.location.reload();
}

function isExperienceDetailsPage() {
    const location = Location.getLocation(true);

    return (
        location.pathname.indexOf('/happening/classes') === 0 ||
        location.pathname.indexOf('/happening/services') === 0 ||
        location.pathname.indexOf('/happening/events') === 0 ||
        location.pathname.indexOf('/happening/announcements') === 0
    );
}

function isMySephoraPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/profile/BeautyPreferences') === 0;
}

function isColorIQSpokeEntryPoint() {
    const location = Location.getLocation(true);

    return (
        location.pathname.indexOf('/shop/foundation-makeup') === 0 ||
        location.pathname.indexOf('/beauty/best-foundations') === 0 ||
        location.pathname.indexOf('/beauty/makeup-color-match') === 0
    );
}

function isSavingsEventPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/beauty/savings-event') !== -1;
}

function getPageTitle(template) {
    const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Location');

    const pagesTitles = {
        [PageTemplateType.RwdBasket]: getText('basket'),
        [PageTemplateType.BrandsList]: getText('brandsList'),
        [PageTemplateType.Lists]: getText('lists'),
        [PageTemplateType.ShoppingList]: getText('lovesList'),
        [PageTemplateType.PurchaseHistory]: getText('purchaseHistory'),
        [PageTemplateType.InstoreServices]: getText('inStoreServices'),
        [PageTemplateType.AddReviewPage]: getText('writeAReview'),
        [PageTemplateType.Confirmation]: getText('orderConfirmation'),
        [PageTemplateType.OrderDetails]: getText('orderDetail'),
        [PageTemplateType.Profile]: getText('profile'),
        [PageTemplateType.BeautyInsider]: getText('beautyInsider'),
        [PageTemplateType.MyAccount]: getText('myAccount'),
        [PageTemplateType.Orders]: getText('recentOrders'),
        [PageTemplateType.AutoReplenishment]: getText('autoReplenishment'),
        [PageTemplateType.Addresses]: getText('savedAddresses'),
        [PageTemplateType.PaymentMethods]: getText('paymentsAndCredits'),
        [PageTemplateType.EmailPostal]: getText('emailAndMailPreferences'),
        [PageTemplateType.Community]: getText('beautyForum'),
        [PageTemplateType.Gallery]: getText('gallery'),
        [PageTemplateType.AddPhoto]: getText('addPhoto'),
        [PageTemplateType.Departments]: getText('sitemapDepartments'),
        [PageTemplateType.BeautyPreferences]: getText('beautyPreferences')
    };

    return pagesTitles[template];
}

function isVendorLoginPage() {
    return Sephora.pagePath === PageTemplateType.VendorLogin;
}

function isVendorGenericLogin() {
    return Sephora.pagePath === PageTemplateType.VendorGenericLogin;
}

async function updateSeoCanonicalUrl(seoCanonicalUrl) {
    const { SEPHORA_URL } = (await import('components/constants')).default;
    const { getLink } = (await import('utils/Url')).default;

    const seoCanonicalUrlLink = document.getElementById('seoCanonicalUrl');

    if (seoCanonicalUrlLink) {
        seoCanonicalUrlLink.setAttribute('href', getLink(`${SEPHORA_URL.DESKTOP}${seoCanonicalUrl}`));
    }
}

function isConstructorEnabledPage() {
    const constructorDisabledPages = [
        PageTemplateType.Checkout,
        PageTemplateType.MyAccount,
        PageTemplateType.PaymentMethods,
        PageTemplateType.Addresses
    ];

    return constructorDisabledPages.indexOf(Sephora.pagePath) === -1;
}

function isCaliforniaConsumer() {
    const isCaliforniaConsumerDetected = Storage.session.getItem(LOCAL_STORAGE.IS_CALIFORNIA_CONSUMER);

    if (isCaliforniaConsumerDetected === null) {
        const isCalifornia = Storage.session.getItem(LOCAL_STORAGE.SELECTED_STORE)?.address?.state === 'CA';
        Storage.session.setItem(LOCAL_STORAGE.IS_CALIFORNIA_CONSUMER, isCalifornia);

        return isCalifornia;
    }

    return isCaliforniaConsumerDetected;
}

function isCheckoutGiftCardShipping() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/checkout/giftcardshipping') !== -1;
}

function isOrdersPage() {
    return Sephora.pagePath === PageTemplateType.Orders;
}

function isOrderDetailsPage() {
    return Sephora.pagePath === PageTemplateType.OrderDetails;
}

function isGameDetailsPage() {
    const location = Location.getLocation(true);

    return /\/beauty\/challenges-.*/.test(location.pathname);
}

function isGamesHubPage() {
    const location = Location.getLocation(true);

    return /\/beauty\/challenges(?!-)/.test(location.pathname);
}

function isServiceLandingPage() {
    const location = Location.getLocation(true);

    return /\/happening\/services$/.test(location.pathname);
}

function isEventsLandingPage() {
    const location = Location.getLocation(true);

    return /\/happening\/events$/.test(location.pathname);
}

function isSeasonalPage() {
    const location = Location.getLocation(true);

    return /\/happening\/seasonal$/.test(location.pathname);
}

function isEventDetailsPage() {
    const location = Location.getLocation(true);

    return /\/happening\/events\/\b(?!confirmation)\b\S+/.test(location.pathname);
}

function isServiceBookingPage() {
    const location = Location.getLocation(true);

    return /\/happening\/services\/booking\/\S+/.test(location.pathname);
}

function isBookingConfirmationPage() {
    const location = Location.getLocation(true);

    return /\/happening\/services\/confirmation\/\S+/.test(location.pathname);
}

function isWaitlistBookingPage() {
    const location = Location.getLocation(true);

    return /\/happening\/waitlist\/booking\/\S+/.test(location.pathname);
}

function isWaitlistConfirmationPage() {
    const location = Location.getLocation(true);

    return /\/happening\/waitlist\/confirmation\/\S+/.test(location.pathname);
}

function isWaitlistReservationPage() {
    const location = Location.getLocation(true);

    return /\/happening\/waitlist\/reservation\/\S+/.test(location.pathname);
}

function isRSVPConfirmationPage() {
    const location = Location.getLocation(true);

    return /\/happening\/events\/confirmation\/\S+/.test(location.pathname);
}

function isStoreDetailsPage() {
    const location = Location.getLocation(true);

    return /\/happening\/stores\/\S+/.test(location.pathname) && !!Sephora.configurationSettings.isRedesignStoreDetailsEnabled;
}

function isMyReservationsPage() {
    const location = Location.getLocation(true);

    return /\/happening\/reservations$/.test(location.pathname);
}

function isReservationDetailsPage() {
    const location = Location.getLocation(true);

    return /\/happening\/reservations\/confirmation$/.test(location.pathname);
}

function getHappeningPathActivityInfo() {
    const location = Location.getLocation(true);
    const activityIdRegex =
        // eslint-disable-next-line max-len
        /\/happening\/(?:events\/confirmation|services\/(booking|confirmation)|waitlist\/(booking|confirmation|reservation)|events|services|stores)\/(\S+-activity-)?(\S+)/;
    const activityTypeRegex = /\/happening\/(events|services)(?:\/|$)/;

    return {
        activityId: activityIdRegex.exec(location.pathname)?.[4],
        activityType: activityTypeRegex.exec(location.pathname)?.[1]
    };
}

function isChallengeFAQPage() {
    const location = Location.getLocation(true);

    return /\/beauty\/challenge-faq/.test(location.pathname);
}

function isChallengeTermsPage() {
    const location = Location.getLocation(true);

    return /\/beauty\/challenge-terms-conditions/.test(location.pathname);
}

function isCommunityGalleryPage() {
    return [PageTemplateType.GalleryPage, PageTemplateType.MyGalleryPage, PageTemplateType.CommunityUserPublicGallery].includes(Sephora.pagePath);
}

function isBeautyTextAlertsPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/beauty/text-alerts') !== -1;
}

function isAppDownloadPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/beauty/app') !== -1;
}

function isRougePreviewPage() {
    const location = Location.getLocation(true);

    return location.pathname.indexOf('/beauty/rouge-preview') !== -1;
}

function isBirthdayGiftPage() {
    const location = Location.getLocation(true);

    return /\/beauty\/birthday-gift/.test(location.pathname);
}

function isListsPage() {
    return Sephora.pagePath === PageTemplateType.Lists;
}

function isCommunityProfilePage() {
    return Sephora.pagePath === PageTemplateType.Profile;
}

function isFrictionlessCheckoutPage() {
    return Sephora.pagePath === PageTemplateType.FSCheckout;
}

function isShopMyStorePage() {
    return Sephora.pagePath === PageTemplateType.ShopMyStore;
}

function isShopSameDayPage() {
    return Sephora.pagePath === PageTemplateType.ShopSameDay;
}

function hasAnchor(anchor = '') {
    if (!anchor) {
        return false;
    }

    const cleanHash = (Location.getLocation().hash || '').replace('#', '');
    const cleanAnchor = anchor.replace('#', '');

    return cleanHash === cleanAnchor;
}

function getMyCustomListId() {
    const location = Location.getLocation(true);
    const myCustomListIdRegex = /\/profile\/Lists\/(\S+)/;

    return myCustomListIdRegex.exec(location.pathname)?.[1];
}

/**
 * Check if current page is a Creator StoreFront page
 * @returns {boolean}
 */
function isCreatorStoreFrontPage() {
    if (typeof window === 'undefined') {
        return false;
    }

    const pathname = window.location.pathname || '';

    return pathname.startsWith('/creators/');
}

function isMyCustomListPage() {
    return Sephora.pagePath === PageTemplateType.MyCustomList;
}

function isMyListsPage() {
    return Sephora.pagePath === PageTemplateType.MyLists;
}

function getSharedListToken() {
    const location = Location.getLocation(true);
    const myCustomListTokenRegex = /\/lovelist\/([^\/?#]+)/;

    return myCustomListTokenRegex.exec(location.pathname)?.[1];
}

function getFirstNameFromSharedListToken() {
    const location = Location.getLocation(true);

    const match = location.href.match(/[?&]fn=([^&#]+)/);

    try {
        return atob(match ? decodeURIComponent(match[1]) : '');
    } catch {
        return '';
    }
}

const Location = {
    isHappeningServices,
    isAccountPage,
    isAutoreplenishPage,
    isMyAccountPage,
    isBasketPage,
    isBuyPage,
    isRewardsPage,
    isOffersPage,
    isBrandNthCategoryPage,
    isAddReviewPage,
    isMyProfilePage,
    isRichProfilePage,
    isRootCategoryPage,
    isNthCategoryPage,
    isPreview,
    isProd,
    isCheckout,
    isOrderStatusPage,
    isPurchaseHistoryPage,
    isHomepage,
    isGalleryPage,
    isProductPage,
    isRwdContentStorePage,
    isGalleryProfilePage,
    isContentStorePage,
    isSearchPage,
    isGalleryAlbumPage,
    isOrderConfirmationPage,
    isPublicLovesPage,
    isCustomSets,
    isBIPage,
    isBIRBPage,
    getLocation,
    getWindowLocation,
    setLocation,
    isCreditCardApplyPage,
    isCreditCardTabPage,
    isCreditCardMarketingPage,
    isSalePage,
    isOnlineReservationLandingPage,
    isTargetedLandingPage,
    isContactUsPage,
    isCustomerServicePage,
    isLovesListPage,
    isReferrerPage,
    isContentPage,
    reload,
    isExperienceDetailsPage,
    PAGES: { CUSTOM_SETS_HASH: CUSTOM_SETS_HASH },
    getPageTitle,
    sanitizePathname,
    isVendorLoginPage,
    isVendorGenericLogin,
    updateSeoCanonicalUrl,
    isPreviewSettings,
    isConstructorEnabledPage,
    isHolidayPage,
    isCaliforniaConsumer,
    isCheckoutGiftCardShipping,
    isAtRiskPage,
    isPickupDeliveryOptionsPage,
    isMySephoraPage,
    isReplacementOrderPage,
    isSavingsEventPage,
    NavigationType,
    navigateTo,
    isColorIQSpokeEntryPoint,
    isOrdersPage,
    isOrderDetailsPage,
    isPreviewEnvironment,
    isGamesHubPage,
    isServiceLandingPage,
    isEventsLandingPage,
    isEventDetailsPage,
    isBookingConfirmationPage,
    isWaitlistBookingPage,
    isWaitlistConfirmationPage,
    isWaitlistReservationPage,
    isServiceBookingPage,
    getHappeningPathActivityInfo,
    isStoreDetailsPage,
    isGameDetailsPage,
    isChallengeFAQPage,
    isChallengeTermsPage,
    isCommunityGalleryPage,
    isBeautyTextAlertsPage,
    isAppDownloadPage,
    isRougePreviewPage,
    hasAnchor,
    isRwdCreditCardPage,
    isMyReservationsPage,
    isRSVPConfirmationPage,
    isReservationDetailsPage,
    isSeasonalPage,
    isBirthdayGiftPage,
    isListsPage,
    isCommunityProfilePage,
    getMyCustomListId,
    isFrictionlessCheckoutPage,
    isCreatorStoreFrontPage,
    isShopMyStorePage,
    isShopSameDayPage,
    isMyCustomListPage,
    isMyListsPage,
    getSharedListToken,
    getFirstNameFromSharedListToken
};

export default Location;
