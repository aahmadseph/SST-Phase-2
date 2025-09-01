/* eslint-disable object-curly-newline */
import fs from 'fs';
import {
    createRequire
} from 'module';
import process from 'node:process';
import os from 'os';
import {
    basename,
    resolve
} from 'path';
import querystring from 'querystring';
const require = createRequire(import.meta.url);

import includeAPIs from '#server/services/apiOrchestration/index.mjs';
import agentAwareMiddleware from '#server/services/middleware/agentAwareMiddleware.mjs';
import apiOptionsMiddleware from '#server/services/middleware/apiOptionsMiddleware.mjs';
import blazemeterMiddleware from '#server/services/middleware/blazemeterMiddleware.mjs';
import {
    bodySaver
} from '#server/services/middleware/bodySaverMiddleware.mjs';
import configCacheMiddleware from '#server/services/middleware/configCacheMiddleware.mjs';
import countryLanguageMiddleware from '#server/services/middleware/countryLanguageMiddleware.mjs';
import cspMiddleware from '#server/services/middleware/cspMiddleware.mjs';
import decodeURIErrorMiddleware from '#server/services/middleware/decodeURIErrorMiddleware.mjs';
import defaultErrorHandlerMiddleware from '#server/services/middleware/defaultErrorHandlerMiddleware.mjs';
import fixRWDchannelMiddleware from '#server/services/middleware/fixRWDchannelMiddleware.mjs';
import healthCheckMiddleware from '#server/services/middleware/healthCheckMiddleware.mjs';
import mobileSwitchMiddleware from '#server/services/middleware/mobileSwitchMiddleware.mjs';
import previewMiddleware from '#server/services/middleware/previewMiddleware.mjs';
import requestIDMiddleware from '#server/services/middleware/requestIDMiddleware.mjs';
import seoRedirectMiddleware from '#server/services/middleware/seoRedirectMiddleware.mjs';
import serverSideABTestMiddleware from '#server/services/middleware/serverSideABTestMiddleware.mjs';
import {
    timingMiddleware
} from '#server/services/middleware/timingMiddleware.mjs';
import updateConfigs from '#server/services/routing/configurationUpdate.mjs';
import mimeTypes from '#server/services/utils/mimeTypes.mjs';
import {
    sendPermRedirect,
    sendTempRedirect
} from '#server/utils/sendRedirect.mjs';

import {
    categoryPageSEORedirect
} from '#server/services/routing/categoryPageSEORedirect.mjs';
import {
    productPageSEORedirect
} from '#server/services/routing/productPageSEORedirect.mjs';
import {
    getConfigurationValue
} from '#server/services/utils/configurationCache.mjs';
import {
    sendLocalFile
} from '#server/services/utils/routerUtils.mjs';

import basketPage from '#server/services/orchestration/basketPage.mjs';
import brandPages from '#server/services/orchestration/brandPages.mjs';
import brandsListPage from '#server/services/orchestration/brandsListPage.mjs';
import buyPage from '#server/services/orchestration/buyPage.mjs';
import categoryPages from '#server/services/orchestration/categoryPages.mjs';
import clientSidePage from '#server/services/orchestration/clientSidePage.mjs';
import renderHomepage from '#server/services/orchestration/homepage.mjs';
import productPages from '#server/services/orchestration/productPages.mjs';
import storeList from '#server/services/orchestration/storeList.mjs';
import taxClaimPage from '#server/services/orchestration/taxClaimPage.mjs';
import {
    MEDIA_IDS
} from '#server/config/Constants.mjs';
import {
    AGENT_AWARE_SITE_ENABLED,
    BUILD_MODE,
    ENABLE_PREVIEW,
    ENABLE_SEO,
    ENABLE_SPEEDSCALE,
    SERVER_HOME,
    UFE_ENV,
    isUfeEnvLocal
} from '#server/config/envConfig.mjs';
import {
    API_HOST,
    API_PORT,
    API_ROUTER_SERVER_NAME,
    API_ROUTER_SERVER_PORT,
    CLUSTER_WORKERS,
    DISABLE_REDIS_CLUSTER_MODE,
    DISABLE_SSL,
    ENABLE_CONFIGURATION_UPDATE,
    ENABLE_MEMORY_CACHE,
    ENABLE_REDIS,
    JERRI_USE_WOODY,
    PROXY_HOST,
    PROXY_PORT,
    REDIS_CONFIG,
    ROUTER_SERVER_NAME,
    ROUTER_SERVER_PORT,
    SDN_API_HOST,
    SDN_API_PORT,
    SIMPLE_CACHE_MAX_SIZE,
    SSL_CERT,
    SSL_KEY
} from '#server/config/envRouterConfig.mjs';
import {
    initPrometheusClient
} from '#server/libs/prometheusMetrics.mjs';
import checkoutPage from '#server/services/orchestration/checkoutPage.mjs';
import lookupContentPages from '#server/services/orchestration/contentPages.mjs';
import galleryPage from '#server/services/orchestration/galleryPage.mjs';
import happeningPages from '#server/services/orchestration/happeningPages.mjs';
import myGalleryPage from '#server/services/orchestration/myGalleryPage.mjs';
import previewPage from '#server/services/orchestration/previewPage.mjs';
import shopYourStorePage from '#server/services/orchestration/shopYourStorePage.mjs';
import sitemapDepartments from '#server/services/orchestration/sitemapDepartments.mjs';
import smartSkinScanPages from '#server/services/orchestration/smartSkinScanPages.mjs';
import userPublicGalleryPage from '#server/services/orchestration/userPublicGalleryPage.mjs';
import {
    loadStatusURLs
} from '#server/services/routing/healthchecks.mjs';
import {
    CHANNELS,
    ERROR_404
} from '#server/services/utils/Constants.mjs';
import {
    PAGE_TYPE
} from '#server/services/utils/handleErrorResponse.mjs';
import proxyRequest from '#server/services/utils/proxyRequest.mjs';
import {
    uncaughtExceptionHandler
} from '#server/utils/exceptionHandling.mjs';
import {
    safelyParse,
    getError
} from '#server/utils/serverUtils.mjs';
import seoRedirect from '#server/services/api/seoService/seoRedirect.mjs';

const filename = basename(resolve(import.meta.url));

import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const express = require('express'),
    cookieParser = require('cookie-parser');

uncaughtExceptionHandler();

// SpeedScale
if (ENABLE_SPEEDSCALE) {
    require('global-agent/bootstrap');
}

if (ENABLE_CONFIGURATION_UPDATE) {
    updateConfigs();
}

const PROMETHEUS_APP_NAME = 'jerri';

// express changed it regexp
// this works but could also match /ca/en/ca/fr
// and that will just 404 :)
const CA_EN_FR = '{/ca/en}{/ca/fr}';

initPrometheusClient(PROMETHEUS_APP_NAME);

const app = express();

app.set('query parser', (qs) => {
    return querystring.parse(qs);
});

// disable telling people what we are
app.disable('x-powered-by');

const https = DISABLE_SSL ? require('http') : require('https');

const httpsOptions = (DISABLE_SSL ? undefined : {
    key: fs.readFileSync(`${SERVER_HOME}/${SSL_KEY}`),
    cert: fs.readFileSync(`${SERVER_HOME}/${SSL_CERT}`)
});

// add unique id to each request as a header
app.use(requestIDMiddleware);

// default error handler code
app.use(defaultErrorHandlerMiddleware);

// express URIDecode error handling
app.use(decodeURIErrorMiddleware);

// middleware for timing to track how long requests are taking
// NOTE: this should be the first thing
app.use(timingMiddleware);

// makes cookies request.cookies
app.use(cookieParser());

// body parser for middle ware
// express has one and there is body-parser but neither worked
app.use(bodySaver);

// this is the CSP middleware
// CSP is content security policy middleware
// this is used to prevent pages from being embeded via iframe
// only pages that need full path are root pages like /submitAnswer
// all other pages should be setup as base path like /shop/{*splat}
// ONLY pages that are SEO friendly URLs for Canada
// should be prefixed with ${CA_EN_FR} like product and shop pages
// updated middleware to exclude
// - JERRI_NONE_PAGE_ROUTES or WOODY_NONE_PAGE_ROUTES
// - also exclude known healthcheck urls
app.use(cspMiddleware);

// UML-781
app.use(mobileSwitchMiddleware);

// makes api options request.apiOptions
app.use(countryLanguageMiddleware);
app.use(apiOptionsMiddleware('JERRI'));
app.use(healthCheckMiddleware);
app.use(blazemeterMiddleware);
app.use(agentAwareMiddleware);
app.use(configCacheMiddleware);

// preview middleware
app.use(previewMiddleware);

//SEO Redirect middleware
app.use(seoRedirectMiddleware);

// ------ server side AB testing start ------
// Enables serverside AB testing for category, brand and brandList pages
app.use(`${CA_EN_FR}/shop/{*splat}`, serverSideABTestMiddleware);
app.use(`${CA_EN_FR}/product/{*splat}`, serverSideABTestMiddleware);
app.use(`${CA_EN_FR}/brand/{*splat}`, serverSideABTestMiddleware);
app.use(`${CA_EN_FR}/brands-list`, serverSideABTestMiddleware);
app.use(`${CA_EN_FR}/basket{*splat}`, serverSideABTestMiddleware);
app.use(`${CA_EN_FR}/beauty/beauty-offers`, serverSideABTestMiddleware);
app.use(['/checkout', '/checkout/{*splat}'], serverSideABTestMiddleware);
// ------ server side AB testing end ------

// ------ management URLS start  ------
loadStatusURLs(app);
// ------ management URLS end  ------

// // ------ page routing start ------

// ------ API local setup start ------
// all api routes should be setup in the apiOrchestrion folder
// and included in includeAPIs
if (JERRI_USE_WOODY) {
    app.all('/gapi/{*splat}', (request, response) => {
        proxyRequest(API_ROUTER_SERVER_NAME, API_ROUTER_SERVER_PORT, request, response, request.url, {
            rejectUnauthorized: false
        });
    });
    app.all('/gway/{*splat}', (request, response) => {
        proxyRequest(PROXY_HOST, PROXY_PORT, request, response, request.url, {
            rejectUnauthorized: false,
            ciphers: 'DEFAULT:@SECLEVEL=0'
        });
    });
    app.all('/api{*splat}', (request, response) => {
        proxyRequest(API_ROUTER_SERVER_NAME, API_ROUTER_SERVER_PORT, request, response, request.url, {
            rejectUnauthorized: false
        });
    });
} else {
    includeAPIs(app);
}
// ------ API local setup end ------

app.get(`${CA_EN_FR}/shop/cat{*splat}`, categoryPageSEORedirect);
app.get(`${CA_EN_FR}/shop/search{*splat}`, (request, response) => {
    const url = request.apiOptions.apiPath;
    const keywords = url.replace('/shop/search', '').replace('/', '');
    sendPermRedirect(response, undefined, `/search?keyword=${keywords}`);
});
app.get(`${CA_EN_FR}/shop/{*splat}`, categoryPages);

app.get(`${CA_EN_FR}/brand/{*splat}`, brandPages);

app.get(`${CA_EN_FR}/brands-list`, brandsListPage);

app.get(`${CA_EN_FR}/buy/{*splat}`, buyPage);

app.use(`${CA_EN_FR}/beauty/glossier-at-sephora`, fixRWDchannelMiddleware);
app.use(`${CA_EN_FR}/beauty/lady-gaga`, fixRWDchannelMiddleware);

app.use(`${CA_EN_FR}/beauty/beauty-offers`, fixRWDchannelMiddleware);

app.get(`${CA_EN_FR}/beauty/challenges{*splat}`, (request, response) => {
    request.apiOptions.channel = CHANNELS.RWD;
    clientSidePage(request, response, 'Content/EnhancedContent', {}, {
        seoURL: request.apiOptions.apiPath,
        enableNoindexMetaTag: false
    });
});

app.get(`${CA_EN_FR}/beauty/{*splat}`, (request, response) => lookupContentPages(request, response));

app.get('/basket{*splat}', basketPage);
app.get(['/checkout', '/checkout/{*splat}'], checkoutPage);

// ------ HAPPENING pages routing start ------

app.get('/happening/error', (request, response) => {
    clientSidePage(request, response, 'Happening/GenericError', null, {
        enableNoindexMetaTag: false
    });
});
app.get(['/happening/classes', '/happening/home'], (request, response) => {
    happeningPages(request, response, null, {
        isPermRedirect: true,
        redirectUrl: '/happening/services'
    });
});
app.get(['/happening/events', '/happening/services'], (request, response) => {
    happeningPages(request, response, 'Happening/Happening', {
        getSeoData: true
    });
});
app.get('/happening/events/confirmation/{*splat}', (request, response) => {
    happeningPages(request, response, 'Happening/Happening');
});
app.get('/happening/events/{*splat}', (request, response) => {
    happeningPages(request, response, 'Happening/Happening', {
        getSeoData: true,
        isPermRedirect: request.apiOptions.apiPath.indexOf('OLR-') > -1,
        redirectUrl: '/happening/events'
    });
});
app.get('/happening/reservations/confirmation', (request, response) => {
    happeningPages(request, response, 'Happening/Happening');
});
app.get('/happening/reservations', (request, response) => {
    happeningPages(request, response, 'Happening/HappeningNonContent');
});
app.get('/happening/seasonal', (request, response) => {
    happeningPages(request, response, 'Happening/Happening');
});
app.get('/happening/services-faq', (request, response) => {
    happeningPages(request, response, null, {
        isPermRedirect: true,
        redirectUrl: '/beauty/beauty-services-faq'
    });
});
app.get('/happening/services/booking/{*splat}', (request, response) => {
    happeningPages(request, response, 'Happening/HappeningNonContent');
});
app.get('/happening/services/confirmation/{*splat}', (request, response) => {
    happeningPages(request, response, 'Happening/Happening');
});
app.get(['/happening/waitlist/confirmation/{*splat}', '/happening/waitlist/reservation/{*splat}'], (request, response) => {
    happeningPages(request, response, 'Happening/Happening', {
        isPermRedirect: !getConfigurationValue(request.apiOptions, 'isRequestAppointmentEnabled', false),
        redirectUrl: '/happening/error'
    });
});
app.get('/happening/waitlist/booking/{*splat}', (request, response) => {
    happeningPages(request, response, 'Happening/HappeningNonContent', {
        isPermRedirect: !getConfigurationValue(request.apiOptions, 'isRequestAppointmentEnabled', false),
        redirectUrl: '/happening/error'
    });
});
app.get('/happening/services/:activity', (request, response) => {
    const {
        activity
    } = request.params;
    happeningPages(request, response, 'Happening/Happening', {
        getSeoData: true,
        isSSRPage: true,
        isServicesEDP: true,
        apiPageIdentifier: 'servicesEDPContentAPI',
        apiPageOptions: {
            activityId: activity.replace(/\S+-activity-/, '')
        },
        isPermRedirect: activity.indexOf('OLR-') > -1,
        redirectUrl: '/happening/services',
        errorPageType: PAGE_TYPE.HAPPENING_SERVICES_EDP
    });
});
app.get('/happening/storelist', storeList);
app.get('/happening/stores/sephora-near-me', (request, response) => {
    clientSidePage(request, response, 'Store/StoreLocator', null, {
        cmsPath: '/sephora-near-me',
        enableNoindexMetaTag: false
    });
});

app.get('/happening/stores/:storeName', (request, response) => {
    happeningPages(request, response, 'Happening/Happening', {
        getSeoData: true,
        isSSRPage: true,
        isStoreDetailsPage: true,
        apiPageIdentifier: 'storeDetailsContentAPI',
        apiPageOptions: {
            activityId: request.params.storeName
        }
    });
});

app.get('/happening/shop-my-store', (request, response) => {
    shopYourStorePage(request, response, {
        isStorePage: true
    });
});

app.get('/happening/shop-same-day', (request, response) => {
    shopYourStorePage(request, response, {
        isZipCodePage: true
    });
});

app.get('/happening/{*splat}', (request, response) => {
    clientSidePage(request, response, 'Happening/GenericError', {}, {
        seoName: ERROR_404,
        is404Page: true,
        statusCode: 404
    });
});

// ------ HAPPENING pages routing end ------

// Routes for creator storefront project
app.use('/creators/{*splat}', fixRWDchannelMiddleware);
app.get([
    [
        '/creators/:handle',
        '/creators/:handle/products',
        '/creators/:handle/collections',
        '/creators/:handle/collections/:collectionId',
        '/creators/:handle/posts',
        '/creators/:handle/posts/:postId'
    ]
], (request, response) => {
    const csfRootConfig = getConfigurationValue(request.apiOptions, 'csf', false);
    const isCsfGloballyEnabled = csfRootConfig?.global?.isEnabled;

    if (!isCsfGloballyEnabled) {
        sendPermRedirect(response, undefined, ERROR_404);
    } else {
        clientSidePage(request, response, 'CreatorStoreFront/CreatorStoreFront', {}, {
            enableNoindexMetaTag: true
        });
    }
});

app.get(/^(\/ca\/en|\/ca\/fr)?\/product\/(.*)-P\d+\/?$/, productPages);
app.get(/^(\/ca\/en|\/ca\/fr)?\/product\/P\d+\/?$/, productPageSEORedirect);
// pdp pages that don't match correct syntax we can just 404
// all those pesky /product/null or /product/....json and so on
app.get(`${CA_EN_FR}/product/{*splat}`, (request, response) => {
    clientSidePage(request, response, 'ErrorPages/NotFound404', {}, {
        seoName: ERROR_404,
        is404Page: true,
        statusCode: 404
    });
});

app.get(`${CA_EN_FR}/submitQuestion`, (request, response) => {
    request.apiOptions.channel = CHANNELS.RWD;
    clientSidePage(request, response, 'Product/SubmitQuestion', {}, {
        seoName: '/submitQuestion'
    });
});

app.use(`${CA_EN_FR}/submitAnswer`, fixRWDchannelMiddleware);
app.get(`${CA_EN_FR}/submitAnswer`, (request, response) => {
    request.apiOptions.channel = CHANNELS.RWD;
    clientSidePage(request, response, 'Product/SubmitAnswer', {}, {
        seoName: '/submitAnswer'
    });
});

app.get(`${CA_EN_FR}/unsubscribe-question`, (request, response) => {
    request.apiOptions.channel = CHANNELS.RWD;
    clientSidePage(request, response, 'Product/UnsubscribeQuestion', {}, {
        seoName: '/unsubscribe-question'
    });
});

// ------ SEARCH / SALE pages routing start ------
app.get('/search{*splat}', (request, response) => {
    request.apiOptions.channel = CHANNELS.RWD;
    clientSidePage(request, response, 'Search/Search', {}, {
        enableNoFollowMetaTag: true
    });
});

app.get('/sale{*splat}', (request, response) => {
    request.apiOptions.channel = CHANNELS.RWD;
    clientSidePage(request, response, 'Search/Search', {}, {
        seoName: '/sale',
        enableNoindexMetaTag: false
    });
});
// ------ SEARCH and SALE pages routing end ------

// ------ PROFILE page routing start ------
app.get('/profile/MyAccount/replacementOrder', (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/MyAccount/ReplacementOrder', {});
});

app.get('/profile/MyAccount/replacementOrderStatus', (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/MyAccount/ReplacementOrderStatus', {});
});

app.get('/profile/MyAccount/AutoReplenishment', (request, response) => {
    request.apiOptions.channel = CHANNELS.RWD;
    clientSidePage(request, response, 'Community/RichProfile/MyAccount/AutoReplenishment');
});

app.get('/profile/MyAccount/Taxclaim', (request, response) => {
    request.apiOptions.channel = CHANNELS.RWD;
    taxClaimPage(request, response);
});

app.get('/profile/BeautyPreferences', (request, response) => {
    request.apiOptions.channel = CHANNELS.RWD;
    const template = 'BeautyPreferences/BeautyPreferencesRedesigned';

    clientSidePage(request, response, template);
});

app.get('/profile/BeautyPreferences/{*splat}', (request, response) => {
    request.apiOptions.channel = CHANNELS.RWD;
    clientSidePage(request, response, 'BeautyPreferences/BeautyPreferencesWorld');
});

app.get('/profile/invoice', (request, response) => {
    request.apiOptions.channel = CHANNELS.RWD;
    clientSidePage(request, response, 'Invoice/Invoice', {}, {});
});

app.get('/profile/MyAccount/SameDayUnlimited', (request, response) => {
    request.apiOptions.channel = CHANNELS.RWD;
    clientSidePage(request, response, 'Community/RichProfile/MyAccount/SameDayUnlimited');
});

app.get(`${CA_EN_FR}/profile/BeautyInsider`, (request, response) => {
    lookupContentPages(request, response, () => {
        function bccFallback() {
            clientSidePage(request, response, 'Community/RichProfile/BeautyInsider', null, {
                mediaId: MEDIA_IDS.BEAUTY_INSIDER,
                enableNoindexMetaTag: false,
                seoName: '/profile/BeautyInsider'
            });
        }

        function contentfulRedirect() {
            sendTempRedirect(response, undefined, '/BeautyInsider');
        }

        return {
            bccFallback,
            contentfulRedirect
        };
    });
});

app.get(`${CA_EN_FR}/BeautyInsider`, (request, response) => lookupContentPages(request, response));

app.get(`${CA_EN_FR}/profile/BeautyInsider/MyPoints`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/BeautyInsider/MyPoints');
});

app.get(`${CA_EN_FR}/in-store-services`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/InstoreServices');
});

app.get(`${CA_EN_FR}/profile/Lists`, (request, response) => {
    const sharableLists = getConfigurationValue(request.apiOptions, 'sharableLists', {});
    const killswitchCountry = sharableLists && sharableLists?.['sharableLists' + request.apiOptions.country]?.isEnabled;
    let template = 'Community/RichProfile/Lists';

    if (killswitchCountry) {
        template = 'Community/RichProfile/MyLists';
        request.apiOptions.channel = CHANNELS.RWD;
    }
    clientSidePage(request, response, template);
});

app.get(`${CA_EN_FR}/profile/Lists/{*splat}`, (request, response) => {
    const template = 'Community/RichProfile/MyCustomList';

    request.apiOptions.channel = CHANNELS.RWD;

    clientSidePage(request, response, template);
});

app.get(`${CA_EN_FR}/profile/MyAccount`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/MyAccount');
});

app.get(`${CA_EN_FR}/profile/MyAccount/Addresses`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/MyAccount/Addresses');
});

app.get(`${CA_EN_FR}/profile/MyAccount/EmailPostal`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/MyAccount/EmailPostal');
});

app.get(`${CA_EN_FR}/profile/orderdetail/{*splat}`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/MyAccount/OrderDetails');
});

app.get(`${CA_EN_FR}/profile/MyAccount/Orders`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/MyAccount/Orders');
});

app.get(`${CA_EN_FR}/profile/MyAccount/PaymentMethods`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/MyAccount/PaymentMethods');
});

app.get(`${CA_EN_FR}/profile/forgotpassword/resetPasswordCheck`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/MyAccount/ResetPassword');
});

app.get(`${CA_EN_FR}/profile/me/followers`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/Profile/Followers');
});

app.get(`${CA_EN_FR}/profile/me/following`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/Profile/Following');
});

app.get(`${CA_EN_FR}/profile/me`, (request, response) => {
    request.apiOptions.channel = CHANNELS.RWD;
    clientSidePage(request, response, 'Community/RichProfile/Profile');
});

app.get(`${CA_EN_FR}/users/public`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/Profile');
});

app.get(`${CA_EN_FR}/users/default/followers`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/Profile/Followers');
});

app.get(`${CA_EN_FR}/users/default/following`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/Profile/Following');
});

app.get(`${CA_EN_FR}/purchase-history`, (request, response) => {
    clientSidePage(request, response, 'Community/RichProfile/PurchaseHistory');
});

app.get(`${CA_EN_FR}/shopping-list`, (request, response) => {
    const sharableLists = getConfigurationValue(request.apiOptions, 'sharableLists', {});
    const killswitchCountry = sharableLists && sharableLists?.['sharableLists' + request.apiOptions.country]?.isEnabled;
    const queryString = (request.url.match(/\?(.*)/) || [])[1] || '';

    if (killswitchCountry) {
        sendPermRedirect(response, undefined, `/profile/Lists${queryString ? '?' + queryString : ''}`);
    } else {
        clientSidePage(request, response, 'Community/RichProfile/ShoppingList');
    }
});

app.get(`${CA_EN_FR}/lovelist/{*splat}`, (request, response) => {
    const sharableLists = getConfigurationValue(request.apiOptions, 'sharableLists', {});
    const killswitchCountry = sharableLists && sharableLists?.['sharableLists' + request.apiOptions.country]?.isEnabled;
    let template = 'Community/RichProfile/ShoppingList';

    if (killswitchCountry) {
        template = 'Community/RichProfile/MyCustomList';
    }

    clientSidePage(request, response, template);
});

// ------ PROFILE page routing end ------

// ------ COMMUNITY page routing start ------

app.get(`${CA_EN_FR}/community`, (request, response) => {
    clientSidePage(request, response, 'Community/Community');
});

app.use(`${CA_EN_FR}/community/gallery`, fixRWDchannelMiddleware);
app.get(`${CA_EN_FR}/community/gallery`, galleryPage);

app.get(`${CA_EN_FR}/community/gallery/add-photo`, (request, response) => {
    clientSidePage(request, response, 'Community/Gallery/AddPhoto');
});

app.use(`${CA_EN_FR}/community/gallery/mygallery`, fixRWDchannelMiddleware);
app.get(`${CA_EN_FR}/community/gallery/mygallery`, myGalleryPage);

app.use(`${CA_EN_FR}/community/gallery/users/:userId`, fixRWDchannelMiddleware);
app.get(`${CA_EN_FR}/community/gallery/users/:userId`, userPublicGalleryPage);

// ------ COMMUNITY page routing end ------

// ------ SMART SKIN SCAN page routing start ------

app.use(`${CA_EN_FR}/virtual/smart-skin-scan`, fixRWDchannelMiddleware);
app.get(`${CA_EN_FR}/virtual/smart-skin-scan`, smartSkinScanPages);

app.use(`${CA_EN_FR}/virtual/smart-skin-scan/photo-capture`, fixRWDchannelMiddleware);
app.get(`${CA_EN_FR}/virtual/smart-skin-scan/photo-capture`, smartSkinScanPages);

// ------ SMART SKIN SCAN page routing end ------
app.get(`${CA_EN_FR}${ERROR_404}`, (request, response) => {
    clientSidePage(request, response, 'ErrorPages/NotFound404', {}, {
        seoName: ERROR_404,
        is404Page: true,
        statusCode: 404
    });
});
// ------ page routing end ------

// ------ misc page routing start ------
if (ENABLE_PREVIEW || isUfeEnvLocal) {
    app.get('/{*splat}/p.js', (_request, response) => {
        response.end('');
    });
}
app.get('/js/ufe/{*splat}', function (request, response) {
    sendLocalFile(request, response);
});

app.get('/img/ufe/{*splat}', function (request, response) {
    mimeTypes(request, response);
    sendLocalFile(request, response);
});

// TODO get a favicon :)
app.get('/favicon.ico', function (request, response) {
    mimeTypes(request, response);
    sendLocalFile(request, response, undefined, {
        fileLocation: 'projects/ui/img/favicon.ico'
    }, {
        removeCookies: true
    });
});

app.get('/contentimages/{*splat}', function (request, response) {
    proxyRequest(PROXY_HOST, PROXY_PORT, request, response, request.url, {
        removeCookies: true
    });
});

app.get('/productimages/{*splat}', function (request, response) {
    logger.debug(`API request to ${request.url}.`);
    proxyRequest(PROXY_HOST, PROXY_PORT, request, response, request.url, {
        removeCookies: true
    });
});

app.get(`${CA_EN_FR}/share/{*splat}`, (request, response) => {
    const isAdvocacyContentfulEnabled = getConfigurationValue(request.apiOptions, 'isAdvocacyContentfulEnabled', false);

    if (isAdvocacyContentfulEnabled) {
        request.apiOptions.channel = CHANNELS.RWD;
    }
    // akamai does this already, but there are some misses
    request.apiOptions.apiPath = '/share/public';

    clientSidePage(request, response, 'Campaigns/Referrer');
});

app.get(`${CA_EN_FR}/addReview`, (request, response) => {
    clientSidePage(request, response, 'Product/AddReviewPage');
});

app.get(`${CA_EN_FR}/rewards`, (request, response) => {
    lookupContentPages(request, response, () => {
        function bccFallback() {
            clientSidePage(request, response, 'Rewards/Rewards', null, {
                mediaId: MEDIA_IDS.REWARDS
            });
        }

        return {
            bccFallback
        };
    });
});

app.get(`${CA_EN_FR}/sitemap/departments`, sitemapDepartments);

app.get(`${CA_EN_FR}/vendorlogin`, (request, response) => {
    clientSidePage(request, response, 'ThirdParty/VendorGenericLogin');
});

app.get(`${CA_EN_FR}/preview`, (request, response) => {
    if (ENABLE_PREVIEW) {
        previewPage(request, response);
    } else {
        clientSidePage(request, response, 'ErrorPages/NotFound404', {}, {
            seoName: ERROR_404,
            is404Page: true,
            statusCode: 404
        });
    }
});

app.get(`${CA_EN_FR}/affiliatesgateway`, (request, response) => {
    clientSidePage(request, response, 'ThirdParty/Affiliates');
});

app.get(`${CA_EN_FR}/beauty-win-promo`, (request, response) => {
    clientSidePage(request, response, 'Content/TargetedLandingPage', null, {
        cmsPath: '/beauty-win-promo',
        enableNoindexMetaTag: false
    });
});

if (!AGENT_AWARE_SITE_ENABLED) {
    app.get(`${CA_EN_FR}/credit-card-approved`, (request, response) => {
        clientSidePage(request, response, 'ContentStore/ContentStore', null, {
            cmsPath: '/credit-card-approved',
            enableNoindexMetaTag: false
        });
    });

    app.get(`${CA_EN_FR}/profile/CreditCard`, (request, response) => {
        lookupContentPages(request, response, () => {
            function bccFallback() {
                clientSidePage(request, response, 'Community/RichProfile/CreditCard');
            }

            function contentfulRedirect() {
                sendTempRedirect(response, undefined, '/creditcard');

            }

            return {
                bccFallback,
                contentfulRedirect
            };
        });
    });

    app.get(`${CA_EN_FR}/creditcard-apply`, (request, response) => {
        lookupContentPages(request, response, () => {
            return {
                bccFallback: () => clientSidePage(request, response, 'CreditCard/Apply'),
                contentfulRedirect: () => sendTempRedirect(response, undefined, '/creditcard/apply')
            };
        });
    });

    app.get(`${CA_EN_FR}/creditcard/apply`, (request, response) => {
        lookupContentPages(request, response, () => {
            return {
                bccFallback: () => sendTempRedirect(response, undefined, '/creditcard-apply')
            };
        });
    });

    app.get(`${CA_EN_FR}/creditcard`, (request, response) => {
        lookupContentPages(request, response, () => {
            return {
                bccFallback: () => {
                    clientSidePage(request, response, 'CreditCard/CreditCard', {}, {
                        seoName: '/creditcard',
                        enableNoindexMetaTag: false
                    });
                }
            };
        });
    });
}

// ------ misc page routing end ------

app.get(`${CA_EN_FR}/emailVerification`, (request, response) => {
    request.apiOptions.apiPath = '/';
    renderHomepage(request, response);
});
app.get(`${CA_EN_FR}/`, renderHomepage);

app.get('{*splat}', (request, response) => {
    const enableAutomaticRedirects = getConfigurationValue(request.apiOptions, 'enableAutomaticRedirects', false);
    if (enableAutomaticRedirects) {
        const url = request.apiOptions.apiPath;
        const options = {
            ...request.apiOptions,
            url
        };
        seoRedirect(options).then(apiResponse => {
            const redirectData = safelyParse(apiResponse.data, false);
            if (redirectData?.targetUrl && redirectData?.targetUrl !== url) {
                sendPermRedirect(response, undefined, redirectData?.targetUrl);
            } else {
                logger.error('seo route lookup returned nothing');
                clientSidePage(request, response, 'ErrorPages/NotFound404', {}, {
                    seoName: ERROR_404,
                    is404Page: true,
                    statusCode: 404
                });
            }
        }).catch(e => {
            logger.error(`seo route lookup error: ${getError(e)}`);
            clientSidePage(request, response, 'ErrorPages/NotFound404', {}, {
                seoName: ERROR_404,
                is404Page: true,
                statusCode: 404
            });
        });
    } else {
        clientSidePage(request, response, 'ErrorPages/NotFound404', {}, {
            seoName: ERROR_404,
            is404Page: true,
            statusCode: 404
        });
    }
});

const server = (DISABLE_SSL ? https.createServer(app) :
    https.createServer(httpsOptions, app));

if (ROUTER_SERVER_NAME) {
    server.listen(ROUTER_SERVER_PORT, ROUTER_SERVER_NAME);
} else {
    server.listen(ROUTER_SERVER_PORT);
}

//require(`${baseDir}/server/services/dumpRoutes`)(app, CA_EN_FR);

logger.info(`${os.EOL}
 _____ _____ _____ _____ _
|__ __| ____| ___ | ___ | |
  | | | _|  |   __|   __| |
 _| | | |___| |\\ \\| |\\ \\| |
|___| |_____|_| \\_\\_| \\_\\_|
`, {
    'noJSONParse': true
});

logger.info(`Server listening on port ${ROUTER_SERVER_PORT}.`);

logger.info(`Startup Environment
    PROXY_HOST: ${PROXY_HOST}
    ROUTER_SERVER_PORT: ${ROUTER_SERVER_PORT}
    BUILD_MODE: ${BUILD_MODE}
    API_HOST: ${API_HOST}
    API_PORT: ${API_PORT}
    SDN_API_HOST: ${SDN_API_HOST}
    SDN_API_PORT: ${SDN_API_PORT}
    ENABLE_REDIS: ${ENABLE_REDIS}
    DISABLE_REDIS_CLUSTER_MODE: ${DISABLE_REDIS_CLUSTER_MODE}
    REDIS_CONFIG: ${REDIS_CONFIG}
    DISABLE_SSL: ${DISABLE_SSL}
    SIMPLE_CACHE_MAX_SIZE: ${SIMPLE_CACHE_MAX_SIZE}
    CLUSTER_WORKERS: ${CLUSTER_WORKERS}
    ENABLE_SEO: ${ENABLE_SEO}
    ENABLE_PREVIEW: ${ENABLE_PREVIEW}
    ENABLE_MEMORY_CACHE: ${ENABLE_MEMORY_CACHE}
    ENABLE_CONFIGURATION_UPDATE: ${ENABLE_CONFIGURATION_UPDATE}
    JERRI_USE_WOODY: ${JERRI_USE_WOODY}
    AGENT_AWARE_SITE_ENABLED: ${AGENT_AWARE_SITE_ENABLED}
    UFE_ENV: ${UFE_ENV}
`, {
    'noJSONParse': true
});

export {
    process,
    server
};
