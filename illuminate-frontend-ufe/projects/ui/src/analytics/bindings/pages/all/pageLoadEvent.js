/* eslint-disable complexity */
/**
 * This module is a property of the Sephora.analytics object.
 * Its purpose is to hold methods which process data related
 * to analytics.
 *
 * Dependencies: DataLayer.js
 */
import utils from 'analytics/utils';
import dateUtils from 'utils/Date';
import urlUtils from 'utils/Url';
import deepExtend from 'utils/deepExtend';
import localeUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import watch from 'redux-watch';
import COOKIE_UTILS from 'utils/Cookies';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Location from 'utils/Location';
import userUtils from 'utils/User';
import mediaUtils from 'utils/Media';
import uiUtils from 'utils/UI';
import headerUtils from 'utils/Headers';
import analyticsConsts from 'analytics/constants';
import Empty from 'constants/empty';
import bindingMethods from 'analytics/bindingMethods/pages/all/generalBindings';
import 'analytics/dataLayer/preLoadEventBindings';

const { findBreakpointAtWidth } = mediaUtils;
const { setEventTimestampFBCapi, userXTimestampHeader } = headerUtils;

export default (function () {
    const now = new Date();
    const currentUser = store.getState().user;

    /**
     * These are the bindings that will take place on all pages when the
     * page load event occurs.
     */
    const pageLoadBindings = function pageLoadBindings() {
        Storage.local.getItem(LOCAL_STORAGE.CREATED_NEW_USER, false, true);

        //Populate prerequesite properties that other code depends on

        const basketContents = store.getState().basket;
        const digitalData = window.digitalData;

        const previousPageData = utils.getPreviousPageData(true);

        /* Used for:
         ** prop55 - Previous link data
         ** events - Event strings **/
        if (previousPageData) {
            //Merge into exisiting defaults if there was saved data
            deepExtend(digitalData.page.attributes.previousPageData, previousPageData);
        }

        //Account - SiteCatalyst :: Account ID
        digitalData.page.attributes.reportSuiteId = bindingMethods.getReportSuiteId();

        //Channel
        digitalData.page.pageInfo.sysEnv = bindingMethods.getChannel();

        //s.campaign - Campaign :: Marketing Channel
        digitalData.page.attributes.campaigns.marketingChannel = bindingMethods.getMarketingChannel(window.location.search, document.referrer) || '';

        //eVar44 - Campaign :: URS :: Channel
        digitalData.page.attributes.campaigns.ursTrackingCode = bindingMethods.getUrsTrackingCode(window.location.search, document.referrer) || '';

        //Page :: Experience
        digitalData.page.attributes.experience = Sephora.isDesktop() ? 'web' : 'mobile';

        //Page :: Platform
        digitalData.page.attributes.platform = bindingMethods.getPlatform();

        //Page :: Breakpoint
        digitalData.page.attributes.breakpoint = findBreakpointAtWidth(window.innerWidth);

        //eVar2 / eVar75 - Internal Campaign
        digitalData.page.attributes.internalCampaign = bindingMethods.getInternalCampaign(digitalData.page.attributes.previousPageData);

        //prop4 and prop5 if page is result of search redirect and not search results page
        const navigationInfo = digitalData.page.attributes.previousPageData.navigationInfo;
        const isTopNav = navigationInfo.startsWith('top');
        const isLeftNav = navigationInfo.startsWith('left');

        if (digitalData.page.attributes.previousPageData.searchTerm && !Location.isSearchPage()) {
            if (isTopNav || (isLeftNav && !digitalData.page.attributes.previousPageData.prevSearchType)) {
                //checks if user navigated using meganav while in search page
                digitalData.page.attributes.search.searchTerm = '';
                digitalData.page.attributes.search.numberOfResults = '';
            } else {
                digitalData.page.attributes.search.searchTerm = digitalData.page.attributes.previousPageData.searchTerm;
                digitalData.page.attributes.search.numberOfResults = 'redirect';
            }
        }

        //prop13 - Country of the page's content
        digitalData.page.attributes.sephoraPageInfo.contentCountry = 'content:' + Sephora.renderQueryParams.country.toLowerCase();

        //eVar39 - Page :: Day Name
        digitalData.page.attributes.date.dayName = dateUtils.getDayOfWeek(now);

        //eVar62 - Page :: Language/Locale
        digitalData.page.attributes.languageLocale = localeUtils.getCurrentCountry() + '-' + localeUtils.getCurrentLanguage();

        //c70 - Page :: Ship Country
        digitalData.page.pageInfo.country = userUtils.getShippingCountry().countryCode;

        // Get Previous and Current pages events
        const previousPageEvents = digitalData.page.attributes.previousPageData.events;
        const currentPageEvents = bindingMethods.getPageEvents(digitalData.page.pageInfo.pageName, digitalData.page.category.pageType);

        //Page :: Event Strings
        digitalData.page.attributes.eventStrings = previousPageEvents.concat(currentPageEvents);

        //Product String :: On-load
        bindingMethods.setProductStrings(digitalData.page.pageInfo.pageName);

        //prop25 - Page :: Date
        digitalData.page.attributes.date.localDate = dateUtils.getLocalDate(now);

        digitalData.page.attributes.date.timeZoneName = dateUtils.getTimeZoneName();

        digitalData.page.attributes.date.timeZone = dateUtils.getFormattedTimezone();

        /* prop8 - BI Status
         ** prop9 - ATG ID
         ** prop27 - Sign In Status */
        bindingMethods.setUserPropsWithCurrentData();

        const userWatch = watch(store.getState, 'user');

        store.subscribe(
            userWatch(() => {
                bindingMethods.setUserPropsWithCurrentData();
            }),
            { ignoreAutoUnsubscribe: true }
        );

        // prop36 - Community Profile Id
        // The nickname of the user whose community page you are viewing
        Sephora.analytics.utils.setIfPresent(
            digitalData.page.attributes,
            'othersCommunityProfileId',
            bindingMethods.getPageProfileId(location.href, currentUser) || null
        );

        //Epsilon Event ID
        const harmonyConversionId = urlUtils.getParamValueAsSingleString('emcampaign');

        if (harmonyConversionId) {
            digitalData.page.attributes.campaigns.harmonyConversionEventId = harmonyConversionId;
            Storage.local.setItem(LOCAL_STORAGE.HARMONY_CONVERSION_ID, harmonyConversionId);
        }

        //eVar35 - Affiliate Link ID
        digitalData.page.attributes.campaigns.affiliateId = urlUtils.getParamValueAsSingleString('c3nid');

        //evar36 - RCP cookies for Audience Segmentation
        digitalData.page.attributes.audienceSegmentation = bindingMethods.getAudienceSegmentation();

        //eVar45 - Epsilon Deployment ID
        digitalData.page.attributes.campaigns.emailHarmonyDeploymentId = urlUtils.getParamValueAsSingleString('emtc2');

        //eVar46 - Harmony Link ID
        digitalData.page.attributes.campaigns.emailHarmonyLinkId = urlUtils.getParamValueAsSingleString('emlid');

        //eVar47 - Harmony Customer Key
        digitalData.page.attributes.campaigns.emailHarmonyCustomerKey = urlUtils.getParamValueAsSingleString('emcid');

        //eVar48 - Campaign :: Email Tracking Code
        digitalData.page.attributes.campaigns.emailTrackingCode = urlUtils.getParamValueAsSingleString('emtc') || 'non-email source';

        //eVar49 - Sephora ATG Id
        digitalData.page.attributes.campaigns.emailATGID = urlUtils.getParamValueAsSingleString('ematg');

        //eVar87 - Bluecore Campaign ID
        digitalData.page.attributes.campaigns.bluecoreCampaignId = urlUtils.getParamValueAsSingleString('dpid');

        //eVar102 - Epsilon Audience ID
        digitalData.page.attributes.campaigns.epsilonAudienceId = urlUtils.getParamValueAsSingleString('emaid');

        //eVar103 - ATG Version ('A' or 'B', is ATG9, 'C' is ATG11)
        digitalData.page.attributes.atgVersion = COOKIE_UTILS.read('akamweb');

        //eVar117 - Page :: Experience Type
        digitalData.page.attributes.experienceType = `${uiUtils.isResponsiveLayout() ? 'responsive' : 'adaptive'} web design`;

        //eVar136 - Shop Your Store Global Vars (OMNX-7955)
        digitalData.page.attributes.eVar136 = bindingMethods.getShopYourStorePreferences();

        digitalData.cart.item = basketContents.items;

        digitalData.cart.itemsByBasket = basketContents.itemsByBasket;

        const { items, itemCount: itemsCount } = basketContents.pickupBasket || Empty.Object;

        if (itemsCount) {
            digitalData.cart.itemsByBasket.push({
                basketType: 'Pickup',
                items,
                itemsCount
            });
        }

        digitalData.cart.attributes.productIds = bindingMethods.getArrayOfPropValuesFromItems(basketContents.items, 'productId');

        digitalData.cart.attributes.skuIds = bindingMethods.getArrayOfPropValuesFromItems(basketContents.items, 'skuId');

        digitalData.cart.attributes.categories = bindingMethods.getCatName(basketContents.items, 'cat');

        digitalData.cart.attributes.subCategories = bindingMethods.getCatName(basketContents.items, 'subCat');

        // Page name for My_Sephora
        digitalData.page.attributes.sephoraPageInfo.pageName = bindingMethods.getPageNameMySephora(previousPageData);

        /*
         ** These bindings need to take place after the above bindings because they
         ** rely on the data set above.
         */
        utils.setNextPageData({
            pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
            pageType: digitalData.page.category.pageType,
            ...(digitalData.page.attributes.contentfulPersonalization?.length > 0 &&
                digitalData.page.pageInfo.pageName === analyticsConsts.PAGE_NAMES.HOMEPAGE && {
                contentfulPersonalization: digitalData.page.attributes.contentfulPersonalization
            }),
            ...(digitalData.page.attributes.p13nAnalyticsData?.length > 0 &&
                digitalData.page.pageInfo.pageName === analyticsConsts.PAGE_NAMES.HOMEPAGE && {
                p13nAnalyticsData: digitalData.page.attributes.p13nAnalyticsData
            })
        });

        /*
         ** Google Double Click Pixel Bindings
         */

        // DoubleClick :: Category
        digitalData.page.category.doubleClickCategory = utils.getDoubleClickCategory('footer');

        // This sets uuid  used on signal
        digitalData.page.attributes.uniqueId = setEventTimestampFBCapi();

        // This sets timestamp on page load for signal
        userXTimestampHeader();

        if (Location.isProductPage()) {
            digitalData.page.attributes.customerZipCode = userUtils.getZipCode();
        }

        digitalData.page.attributes.personalizedEmailCampaign = utils.getPersonalizedEmailCampaignString();

        if (
            digitalData.page.attributes.previousPageData.pageType === analyticsConsts.PAGE_NAMES.HOMEPAGE &&
            digitalData.page.pageInfo.pageName !== analyticsConsts.PAGE_NAMES.HOMEPAGE &&
            previousPageData?.contentfulPersonalization?.length > 0
        ) {
            digitalData.page.attributes.contentfulPersonalization = previousPageData?.contentfulPersonalization;
        }

        if (
            digitalData.page.attributes.previousPageData.pageType === analyticsConsts.PAGE_NAMES.HOMEPAGE &&
            digitalData.page.pageInfo.pageName !== analyticsConsts.PAGE_NAMES.HOMEPAGE &&
            previousPageData?.p13nAnalyticsData?.length > 0
        ) {
            digitalData.page.attributes.p13nAnalyticsData = previousPageData?.p13nAnalyticsData;
        }

        digitalData.page.attributes.overlayTiers = bindingMethods.getSDUSubscriptionType();
    };

    return pageLoadBindings;
}());
