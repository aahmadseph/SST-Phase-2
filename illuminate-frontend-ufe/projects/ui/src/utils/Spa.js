/* eslint-disable complexity */
import stringUtils from 'utils/String';
import { HeadscriptRuntime, Immediate, EventType } from 'constants/events';
import {
    OPEN_SPA_PAGE_API_LOADED,
    OPEN_SPA_PAGE_DOM_UPDATED,
    OPEN_SPA_PAGE_IMAGES_PRELOADED,
    OPEN_SPA_PAGE_IMAGES_PRELOADING,
    OPEN_SPA_PAGE_START,
    OPEN_SPA_SEARCH_PAGE_API_LOADED,
    OPEN_SPA_SEARCH_PAGE_API_START
} from 'constants/performance/marks';
import compConstants from 'components/constants';
import { SpaTemplatesInfo } from 'constants/SpaTemplatesInfo';
import bccUtil from 'utils/BCC';
import getStoreLocations from 'services/api/utility/storeLocator/getStoreLocations';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import LocationUtils from 'utils/Location';
import PageTemplateType from 'constants/PageTemplateType';
import Storage from 'utils/localStorage/Storage';
import store from 'store/Store';
import storeUtils from 'utils/Store';
import UrlUtils from 'utils/Url';
import UserActions from 'actions/UserActions';
import localeUtils from 'utils/LanguageLocale';
import { seo } from 'constants/seo';
import watch from 'redux-watch';
import userUtils from 'utils/User';
import CookieUtils from 'utils/Cookies';
import RCPSCookies from 'utils/RCPSCookies';
import Empty from 'constants/empty';
import { translatePageToLocale } from 'utils/buy/translateBuyPages';
const { getCurrentCountry, COUNTRIES, getCurrentLanguageCountryCode, getCurrentLanguage } = localeUtils;
import { updateBasket as createUpdateBasketAction, refreshBasket } from 'actions/RwdBasketActions';
import anaConsts from 'analytics/constants';

const { capitalize } = stringUtils;
const { read: readCookie } = CookieUtils;
const {
    SEPHORA_URL: { DESKTOP }
} = compConstants;

const LocalePathPrefix = /(?:\/ca\/[e | f][n | r])*/;

const SIX_HOURS = 6 * 60 * 60 * 1000;
let _forcePageHardReload = false;

//Timeout to hard reload after 6 hours
if (!Sephora.isNodeRender) {
    setTimeout(() => (_forcePageHardReload = true), SIX_HOURS);
}

const SpaUtils = {
    replaceContentAreaTargeters: function (currentData = {}, newData = {}) {
        let allPageTargeterNames = Sephora.targetersToInclude.substr('?includeTargeters='.length);
        allPageTargeterNames = decodeURIComponent(allPageTargeterNames).split(',');

        // remove old content area targeters
        const currentTargeterNames = bccUtil.extractTargeters(currentData);

        for (const targeterName of currentTargeterNames) {
            const index = allPageTargeterNames.indexOf(targeterName);

            if (index !== -1) {
                allPageTargeterNames.splice(index, 1);
            }
        }

        // add new content area targeters
        const newTargeterNames = bccUtil.extractTargeters(newData);
        allPageTargeterNames = allPageTargeterNames.concat(newTargeterNames);
        Sephora.targetersToInclude = bccUtil.buildTargetersQueryParams(allPageTargeterNames);
    },

    updateUserFull: function (data, productPageData = {}, options = {}) {
        const currentUser = Sephora.Util.getCurrentUser();
        const basketCache = Sephora.Util.getBasketCache(currentUser);
        const userInfoCache = Sephora.Util.getUserInfoCache();
        const cachedProfileStatus = Storage.local.getItem(LOCAL_STORAGE.PROFILE_SECURITY_STATUS);
        const isAnonymousUser = userUtils.isAnonymous({ profileStatus: cachedProfileStatus });

        let shouldGetUserFull = false;
        let userFullOptions = undefined;

        let apiToInclude;

        if (Sephora.Util.shouldGetTargeters() && Sephora.Util.shouldGetTargetedPromotion()) {
            apiToInclude = ['targetedPromotion'];
            userFullOptions = { includeApis: apiToInclude };
            shouldGetUserFull = true;
        }

        if (Sephora.Util.shouldGetUserFull(basketCache, currentUser, userInfoCache)) {
            shouldGetUserFull = true;

            if (!userFullOptions) {
                userFullOptions = { includeApis: [] };
            }

            userFullOptions.includeApis.push('profile', 'basket', 'loves', 'shoppingList', 'segments');
        }

        // do not make userFull call for anonymous users, they will get tokens from /v2/session call
        if (RCPSCookies.isRCPSAuthEnabled() && isAnonymousUser) {
            shouldGetUserFull = false;
        }

        if (shouldGetUserFull) {
            store.dispatch(
                UserActions.getUserFull(
                    productPageData,
                    null,
                    userFullOptions
                        ? {
                            ...userFullOptions,
                            includeApis: userFullOptions.includeApis.join(',')
                        }
                        : undefined,
                    undefined,
                    options.hideLoader || false
                )
            );
        }
    },

    // refresh or update basket on SPA navigation when we have rcps_full_profile_group cookie is true
    updateBasket: function () {
        if (!RCPSCookies.isRCPSFullProfileGroup()) {
            return;
        }

        const cachedBasket = Storage.local.getItem(LOCAL_STORAGE.BASKET);
        const isCacheBasketValid = !!cachedBasket;
        const isBasketNotEmpty = isCacheBasketValid && cachedBasket.items.length > 0;
        const isUserLoggedIn = Sephora.Util.getCurrentUser().isRecognized;

        if ((!isCacheBasketValid && isUserLoggedIn) || (!isUserLoggedIn && isBasketNotEmpty) || (isUserLoggedIn && !cachedBasket.profileId)) {
            store.dispatch(refreshBasket());
        } else {
            store.dispatch(createUpdateBasketAction({ newBasket: cachedBasket, shouldCalculateRootBasketType: true }));
        }
    },

    updatePreferredStoreDetails: function (user) {
        const cachedStoreData = Storage.session.getItem(LOCAL_STORAGE.SELECTED_STORE);

        if (user?.preferredStore && !cachedStoreData) {
            getStoreLocations(user.preferredStore).then(data => {
                const preferredStoreInfo = data.stores[0];
                storeUtils.cacheStoreData(preferredStoreInfo);
                store.dispatch(UserActions.updatePreferredStore({ preferredStoreInfo }));
            });
        }
    },

    resetDigitalData: function () {
        digitalData.lastRefresh = 'soft';
        digitalData.page.attributes.featureVariantKeys = [];
        digitalData.page.attributes.personalizedEmailCampaign = '';
        digitalData.page.attributes.previousPageData.recInfo = {};
        delete digitalData.page.renderTime;
        delete digitalData.page.SpaApiCallTime;
        delete digitalData.performance.renderTime;
        delete digitalData.performance.spaAPITime;
        delete digitalData.performance.spaDOMUpdateTime;
        delete digitalData.performance.spaDOMUpdateWithoutAPITime;
        delete digitalData.performance.spaPreloadImagesTime;
        delete digitalData.page.attributes.previousPageData.linkData;
        delete digitalData.page.attributes.event267;
        delete digitalData.page.attributes.productReviews;

        //remove internal search event from previous page data, to not track it on search results page during any SPA interaction (sorting, filtering)
        digitalData.page.attributes.previousPageData.events = digitalData.page.attributes.previousPageData.events.filter(
            item => item !== anaConsts.Event.INTERNAL_SEARCH
        );

        digitalData.product = [];
    },

    updateDigitalData: (eventName, eventTime) => {
        switch (eventName) {
            case `${HeadscriptRuntime} ${EventType.Applied}`: {
                const measure = performance.measure(
                    HeadscriptRuntime,
                    `${HeadscriptRuntime} ${EventType.Loaded}`,
                    `${HeadscriptRuntime} ${EventType.Applied}`
                );
                let duration;

                // In Firefox performance.measure() does not return PerformanceMeasure entry according MDN documentation.
                // See https://developer.mozilla.org/en-US/docs/Web/API/Performance/measure#return_value for more info.
                // It's Firefox issue!
                // Code in else branch is workaround for this scenario.
                if (measure) {
                    duration = measure.duration;
                } else {
                    const measureEntries = performance.getEntriesByName(HeadscriptRuntime, 'measure');
                    const lastMeasure = measureEntries[measureEntries.length - 1];
                    duration = lastMeasure.duration;
                }

                digitalData.performance.headScriptRuntime = duration;

                break;
            }
            case `${Immediate} ${EventType.Ready}`: {
                digitalData.performance.applicationStart = eventTime;

                break;
            }
            case 'HydrationFinished': {
                digitalData.performance.hydrationFinished = eventTime;

                break;
            }
            case 'Post Load Rendered': {
                digitalData.performance.postLoadRendered = eventTime;

                break;
            }
            case 'InPageComps Service Ctrlrs Applied': {
                digitalData.performance.inPageCompsApplied = eventTime;

                break;
            }
            case 'UserInfo Service Ctrlrs Applied': {
                const loadedEvent = Sephora.performance.renderTime.getFirstEventOrDefault('UserInfo Loaded');
                const appliedEvent = Sephora.performance.renderTime.getFirstEventOrDefault(eventName);
                digitalData.performance.userInfoLoaded = loadedEvent.startTime;
                digitalData.performance.userInfoApplied = appliedEvent.startTime;

                break;
            }
            case 'TestTarget Service Ctrlrs Applied': {
                const loadedEvent = Sephora.performance.renderTime.getFirstEventOrDefault('TestTarget Loaded');
                const appliedEvent = Sephora.performance.renderTime.getFirstEventOrDefault(eventName);
                digitalData.performance.testTargetLoaded = loadedEvent.startTime;
                digitalData.performance.testTargetApplied = appliedEvent.startTime;

                break;
            }
            case 'Page Rendered': {
                Sephora.Util.InflatorComps.totalReactTimeOnPageRender = Sephora.Util.InflatorComps.totalRenderTime;
                const startEvent = Sephora.performance.renderTime.getFirstEventOrDefault(OPEN_SPA_PAGE_START);
                digitalData.performance.renderTime = eventTime - startEvent.startTime;
                // Delete the line below after stop using mPulse
                // Also it's used in Signal => Async :: Page Load Time
                // https://hub.signal.co/sites/szZFBFc/data/1568015/inputs
                digitalData.page.renderTime = digitalData.performance.renderTime;

                break;
            }
            case OPEN_SPA_PAGE_API_LOADED: {
                const startEvent = Sephora.performance.renderTime.getFirstEventOrDefault(OPEN_SPA_PAGE_START);

                // since the Search API is called before the page is loaded,
                // we need to calculate the time difference between the start search API event and the loaded search API event
                const startSearchEvent = Sephora.performance.renderTime.getFirstEventOrDefault(OPEN_SPA_SEARCH_PAGE_API_START);
                const loadedSearchEvent = Sephora.performance.renderTime.getFirstEventOrDefault(OPEN_SPA_SEARCH_PAGE_API_LOADED);

                if (startSearchEvent.startTime === 0) {
                    digitalData.performance.spaAPITime = eventTime - startEvent.startTime;
                } else {
                    digitalData.performance.spaAPITime = loadedSearchEvent.startTime - startSearchEvent.startTime;
                    performance.clearMarks(OPEN_SPA_SEARCH_PAGE_API_START);
                    performance.clearMarks(OPEN_SPA_SEARCH_PAGE_API_LOADED);
                }

                // Delete the line below after stop using mPulse
                digitalData.page.SpaApiCallTime = digitalData.performance.spaAPITime;

                break;
            }
            case OPEN_SPA_PAGE_IMAGES_PRELOADED: {
                const startEvent = Sephora.performance.renderTime.getFirstEventOrDefault(OPEN_SPA_PAGE_IMAGES_PRELOADING);
                digitalData.performance.spaPreloadImagesTime = eventTime - startEvent.startTime;

                break;
            }
            case OPEN_SPA_PAGE_DOM_UPDATED: {
                const startEvent = Sephora.performance.renderTime.getFirstEventOrDefault(OPEN_SPA_PAGE_START);
                const apiEvent = Sephora.performance.renderTime.getFirstEventOrDefault(OPEN_SPA_PAGE_API_LOADED);
                digitalData.performance.spaDOMUpdateTime = eventTime - startEvent.startTime;
                digitalData.performance.spaDOMUpdateWithoutAPITime = eventTime - apiEvent.startTime;

                break;
            }
            default: {
                // Do nothing.
            }
        }
    },

    resetTestAndTarget: async (testTarget, notPreBasket = false) => {
        const { default: TestTargetServiceReady } = await import(/* webpackMode: "eager" */ 'utils/framework/Events');
        const { default: TestTargetActions } = await import(/* webpackMode: "eager" */ 'actions/TestTargetActions');
        const testTargetService = await import(/* webpackMode: "eager" */ 'services/TestTarget');

        const {
            OFFERS_READY_STATES: { ADOBE_TESTS_RECEIVED }
        } = TestTargetActions;
        const doNotResetTestAndTarget = testTarget?.readyState === ADOBE_TESTS_RECEIVED;
        const options = { doNotResetTestAndTarget };

        if (notPreBasket) {
            options.notPreBasket = true;
        }

        if (!doNotResetTestAndTarget) {
            Sephora.Util.InflatorComps.services.loadEvents[TestTargetServiceReady] = false;
        }

        testTargetService.initialize(options);
    },

    updateHeaderTags: (data, nextPageTemplate) => {
        const template = store.getState().page?.templateInformation?.template;
        const templateToCheck = nextPageTemplate || template;
        const isBuyPage = templateToCheck === PageTemplateType.RwdBuyPage;
        const isProductPage = templateToCheck === PageTemplateType.ProductPage;
        const productPageSeoDataFromATG =
            data?.content && Object.keys(data.content).length > 0 && Object.keys(data.content).some(value => value?.includes('seo'));

        const seoParams = isProductPage && productPageSeoDataFromATG ? data?.content : isBuyPage ? data?.rawBuyPageInfo : data;
        const isSalePage = LocationUtils.isSalePage();
        const isHomepage = LocationUtils.isHomepage();

        if (!seoParams) {
            return;
        }

        let { seoCanonicalUrl, seoMetaDescription, seoTitle } = seoParams;

        if (seoParams.seo) {
            const { pageTitle, metaDescription, canonicalUrl } = seoParams.seo;
            seoTitle = pageTitle;
            seoMetaDescription = metaDescription;
            seoCanonicalUrl = canonicalUrl;
        }

        if (isBuyPage) {
            const currentLanguage = getCurrentLanguage();
            const currentCountry = getCurrentCountry();
            const translatedBuyData = translatePageToLocale(data?.rawBuyPageInfo, currentLanguage) || {};
            const { title, metaDescription, slug } = translatedBuyData;

            seoTitle = capitalize(`${title} | Sephora ${currentCountry === COUNTRIES.CA ? 'Canada' : ''}` || '');
            seoMetaDescription = metaDescription
                ? metaDescription
                : `${title} are available now at Sephora! Shop ${title} and find the best fit for your beauty routine. Free shipping and samples available.`;
            seoCanonicalUrl = `/buy/${slug}`;
        }

        if (isSalePage) {
            const versions = seo.find(x => x.url === '/sale').localeVersions;
            const localizedSaleSEO = versions.find(x => x.locale === getCurrentLanguageCountryCode()) || versions.find(x => x.locale === 'en_US');
            seoTitle = localizedSaleSEO.seoTitle;
            seoMetaDescription = localizedSaleSEO.seoMetaDescription;
            seoCanonicalUrl = localizedSaleSEO.seoMetaDescription;
        }

        document.title = SpaUtils.getPageTitle(seoTitle, template);

        if (seoTitle) {
            document.getElementById('metaOgTitle')?.setAttribute('content', seoTitle);
        }

        if (seoMetaDescription) {
            document.getElementById('metaDescription')?.setAttribute('content', seoMetaDescription);
            document.getElementById('metaOgDescription')?.setAttribute('content', seoMetaDescription);
        }

        if (seoCanonicalUrl) {
            const link = `${seoCanonicalUrl && DESKTOP}${isHomepage ? '/' : seoCanonicalUrl}`;
            const url = UrlUtils.getLink(link);
            document.getElementById('seoCanonicalUrl')?.setAttribute('href', url);
            document.getElementById('metaOgUrl')?.setAttribute('content', url);
        }
    },

    getPageTitle: (seoTitle, template) => {
        let title = 'Sephora';

        if (seoTitle) {
            title = seoTitle;
        } else if (LocationUtils.getPageTitle(template)) {
            const postfix = template.indexOf('Community') === -1 ? ' | Sephora' : '';
            title = `${LocationUtils.getPageTitle(template)}${postfix}`;
        }

        return title;
    },

    isNavigatingToNonRWDSpaPage: pageTemplate => {
        const nonRWDSpaTemplates = [];

        return nonRWDSpaTemplates.includes(pageTemplate);
    },

    setChannelForSpaLoad: pageTemplate => {
        if (SpaUtils.isNavigatingToNonRWDSpaPage(pageTemplate)) {
            const deviceType = CookieUtils.read(CookieUtils.KEYS.DEVICE_TYPE) === 'desktop' ? 'FS' : 'MW';
            Sephora.channel = deviceType || 'FS';
        } else {
            Sephora.channel = 'RWD';
        }
    },

    isSpaNavigation: ({ hostName, path }) => {
        return (
            !_forcePageHardReload &&
            hostName === window.location.hostname &&
            Sephora.isSPA &&
            Sephora.configurationSettings.spaEnabled &&
            SpaUtils.currentPageIsActiveSpaPage() &&
            SpaUtils.nextPageIsActiveSpaPage(path)
        );
    },

    currentPageIsActiveSpaPage: () => {
        const { pathname } = LocationUtils.getLocation();
        const templateInfo = SpaUtils.getSpaTemplateInfoByUrl(pathname);

        if (!templateInfo) {
            return false;
        }

        return SpaUtils.getKillSwitchValueOrDefault(templateInfo);
    },

    nextPageIsActiveSpaPage: nextPageUrl => {
        const templateInfo = SpaUtils.getSpaTemplateInfoByUrl(nextPageUrl);

        if (!templateInfo) {
            return false;
        }

        return SpaUtils.calculateKillswitchAndCookie(templateInfo, nextPageUrl);
    },

    calculateKillswitchAndCookie: (templateInfo, nextPageUrl) => {
        const abCookieValue = SpaUtils.getABTestValues(templateInfo, false);
        const killSwitchValue = SpaUtils.getKillSwitchValueOrDefault(templateInfo, nextPageUrl);

        if (abCookieValue === null) {
            return killSwitchValue;
        }

        return abCookieValue && killSwitchValue;
    },

    getABTestValues: templateInfo => {
        const abCookieName = templateInfo?.abCookieName;
        const abKillswitchName = templateInfo?.abKillswitchName;

        // Global feature flag should precede AB cookie check
        if (abKillswitchName && !Sephora.configurationSettings[abKillswitchName]) {
            return null;
        }

        if (!abCookieName) {
            // cookie is optional so we do not want to return a default a boolean
            return null;
        }

        return readCookie(abCookieName) === 'true';
    },

    getKillSwitchValueOrDefault: (templateInfo = Empty.Object, nextPageUrl) => {
        const killSwitchName = templateInfo.killSwitchName;
        let result = SpaUtils.getURLBasedKillSwitchValue(templateInfo, nextPageUrl);

        if (result) {
            if (killSwitchName && Object.prototype.hasOwnProperty.call(Sephora.configurationSettings, killSwitchName)) {
                result = Sephora.configurationSettings[killSwitchName];
            } else {
                result = true;
            }
        }

        return result;
    },

    getURLBasedKillSwitchValue: (templateInfo, nextPageUrl) => {
        const { urlBasedKillSwitches = Empty.Object } = templateInfo;
        const killSwitchNames = Object.keys(urlBasedKillSwitches);

        for (const killSwitchName of killSwitchNames) {
            if (Sephora.configurationSettings[killSwitchName] === true) {
                const urls = urlBasedKillSwitches[killSwitchName] || Empty.Array;

                for (const url of urls) {
                    if (url instanceof RegExp && url.test(nextPageUrl)) {
                        return false;
                    }
                }
            }
        }

        return true;
    },

    getSpaTemplateInfoByTemplate: template => SpaTemplatesInfo.find(x => x.template === template),

    normalizePath: path => path.replace(LocalePathPrefix, ''),

    getSpaTemplateInfoByUrl: pageUrl => {
        const normalizedPath = SpaUtils.normalizePath(pageUrl);

        const templates = SpaTemplatesInfo.reduce((acc, info) => {
            const match = info.routes.find(route => {
                const isRegExp = route instanceof RegExp;
                const isRouteMapped = (isRegExp && route.test(normalizedPath)) || (!isRegExp && normalizedPath.startsWith(route));

                return isRouteMapped;
            });

            if (match) {
                acc.push(info);
            }

            return acc;
        }, []);

        if (templates.length === 2) {
            const abChallenger = templates.find(template => template.abCookieName != null);

            if (abChallenger) {
                const abChallengerIsEnabled = SpaUtils.getABTestValues(abChallenger);

                if (abChallengerIsEnabled) {
                    return abChallenger;
                }

                return templates.find(template => template.abCookieName == null);
            } else {
                throw new Error('if two templates share a path, one must be an abCookieName');
            }
        }

        return templates[0];
    },

    isSpaTemplate: template => SpaTemplatesInfo.some(x => x.template === template),

    tryToForceSignIn: () => {
        if (userUtils.isSignedIn()) {
            document.documentElement.classList.add('isRecognized');
        } else {
            // forcing sign in for guest user on SPA load
            const { data: { profile: { welcomeMat } = {} } = {} } = Sephora.Util.InflatorComps.services.UserInfo;

            if (!welcomeMat) {
                //CRMTS-2000 need to wait for test and target offers before kicking off forced sign in
                const { testTarget } = store.getState();

                if (testTarget.readyState === 2) {
                    userUtils.forceSignIn();
                } else {
                    const watcher = watch(store.getState, 'testTarget');
                    const unsubscribe = store.subscribe(
                        watcher(({ readyState }) => {
                            if (readyState === 2) {
                                userUtils.forceSignIn();
                                unsubscribe();
                            }
                        })
                    );
                }
            }
        }
    }
};

export default SpaUtils;
