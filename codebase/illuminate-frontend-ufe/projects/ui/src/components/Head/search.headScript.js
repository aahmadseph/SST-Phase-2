/* eslint-disable no-console */
/** WARNING: DO NOT USE ES6 IN THIS FILE **/
/* This file is not run through ES6 transpiler */

(function () {
    let constructorSessionID;
    let constructorClientID;
    const constructorioSessionIDLocalStorageKey = '_constructorio_search_session_id';
    const constructorioClientIDCookieName = 'ConstructorioID_client_id';

    let isConstructorEnabled = false;
    let isNLPInstrumentationEnabled = false;

    const SALE_PAGE_PATH = 'sale';
    const services = Sephora.Util.InflatorComps.services;
    services.SearchInfo = services.SearchInfo || {};
    const defaultParamsConfig = {
        content: [true],
        includeRegionsMap: [true],
        page: [60],
        currentPage: [1]
    };

    const SALE_KEYWORDS = [
        'sale',
        'sales',
        'solde',
        'soldes',
        'on sale',
        'discount',
        'discounts',
        'sale item',
        'sale items',
        'sale product',
        'sale products',
        'sale makeup',
        'makeup sale',
        'clearance sale',
        'clearence sale',
        'clearence',
        'clearance'
    ];

    const getKeyword = function () {
        const queryParams = Sephora.Util.getQueryStringParams();
        let keyword = '';

        if (queryParams.keyword && queryParams.keyword.length) {
            keyword = queryParams.keyword[0];
        }

        return keyword;
    };

    const createQueryString = function (obj) {
        const params = Object.keys(obj);
        let qs = '';

        params.forEach(function (param, i) {
            const paramValues = obj[param];
            let paramString = '';

            paramValues.forEach(function (value, j) {
                paramString += value;

                if (j < paramValues.length - 1) {
                    if (isConstructorEnabled) {
                        paramString += '&' + param + '=';
                    } else {
                        paramString += ',';
                    }
                }
            });

            qs = qs + param + '=' + paramString;

            if (i < params.length - 1) {
                qs += '&';
            }
        });

        return qs;
    };

    // ILLUPH-104184 - Add the rest of the queryString
    const getRemainingQueryString = function () {
        let queryStringParams = Sephora.Util.getQueryStringParams();
        delete queryStringParams.keyword;

        if (isConstructorEnabled) {
            queryStringParams = Sephora.Util.getConstructorQueryStringParams(queryStringParams);
        }

        const qs = createQueryString(queryStringParams);
        const defaultParams = createQueryString(defaultParamsConfig);

        if (qs) {
            return qs + '&' + defaultParams;
        } else {
            return defaultParams;
        }
    };

    const getRequestResponse = function () {
        let response = null;

        try {
            response = JSON.parse(this.responseText);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }

        return response;
    };

    const fetchSearchResponse = function () {
        const keyword = getKeyword();
        const response = sessionStorage.getItem(keyword);

        if (response) {
            const parsedResponse = JSON.parse(response);
            parsedResponse.data.contextId = Math.random().toString(36).substring(2);
            services.SearchInfo.data = parsedResponse.data;
            services.loadEvents.SearchInfoLoaded = true;
            sessionStorage.removeItem(keyword);
            window.dispatchEvent(new CustomEvent('SearchInfoLoaded', { detail: {} }));
        } else {
            fetchSearchData();
        }
    };

    const cookieStore = function () {
        const cookieMap = {};
        const cookies = ('' + document.cookie).split('; ');
        let currentCookie, cookieName, cookieValue;

        for (let x = 0, len = cookies.length; x < len; ++x) {
            try {
                currentCookie = cookies[x].split('=');
                cookieName = window.decodeURIComponent(currentCookie[0]);
                cookieValue = window.decodeURIComponent(currentCookie[1]);
                cookieMap[cookieName] = cookieValue;
            } catch (error) {
                console.error(error);
            }
        }

        return cookieMap;
    };

    const getCurrentCountry = function () {
        return (Sephora.renderQueryParams && Sephora.renderQueryParams.country && Sephora.renderQueryParams.country.toUpperCase()) || 'US';
    };

    const getCurrentLanguage = function () {
        return cookieStore()['site_language'];
    };

    const getAdServiceSXSQueryParams = function (keyword) {
        const queryStringParams = Sephora.Util.getQueryStringParams();
        const KEYWORD = 'keyword';
        const NODE = 'node';
        const SEPH_SESSION = 'SephSession';
        const hasFilters = !Object.keys(queryStringParams).every(param => param === KEYWORD || param === NODE);

        if (!SALE_KEYWORDS.includes(keyword) && !hasFilters) {
            const biAccountId = Sephora.Util.getCache('biAccountId') || '';
            const session = cookieStore()[SEPH_SESSION] || '';
            const adSvcSlot = `2${getCurrentCountry() === 'US' ? '5' : '6'}03${Sephora.isDesktop() ? '1' : '2'}11`;

            return `&callAdSvc=true&adSvcSlot=${adSvcSlot}&adSvcSession=${session}${biAccountId ? `&adSvcUser=${biAccountId}` : ''}`;
        }

        return '';
    };

    const fetchSearchData = function () {
        let keyword;

        if (Sephora.renderQueryParams.urlPath.includes(SALE_PAGE_PATH)) {
            keyword = 'sale';
        } else {
            keyword = getKeyword();
        }

        const remainingQueryString = getRemainingQueryString();

        if (SALE_KEYWORDS.includes(keyword) && Sephora.renderQueryParams.urlPath.includes('search')) {
            document.location.href = '/sale';
        }

        if (keyword) {
            const PREFERRED_ZIPCODE = 'preferredZipCode';
            const SELECTED_STORE = 'selectedStore';
            const preferredZipCode = sessionStorage.getItem(PREFERRED_ZIPCODE);
            const selectedStore = sessionStorage.getItem(SELECTED_STORE);
            const preferredZipCodeParsed = preferredZipCode
                ? JSON.parse(preferredZipCode).data?.preferredZipCode
                : selectedStore
                    ? JSON.parse(selectedStore).data.address?.postalCode
                    : null;
            const selectedStoreParsed = selectedStore ? JSON.parse(selectedStore).data.storeId : null;
            let url = '/api/v2/catalog/search/?type=keyword&q=';
            const currentCountry = getCurrentCountry();
            const currentLanguage = getCurrentLanguage();

            url = url + encodeURIComponent(keyword);

            if (preferredZipCodeParsed) {
                url = url + '&sddZipcode=' + preferredZipCodeParsed;
            }

            if (selectedStoreParsed) {
                url = url + '&pickupStoreId=' + selectedStoreParsed;
            }

            url += '&includeEDD=true';

            const isJerrySearch = Sephora.renderedData.catOrMouse === 'mouse';

            // ILLUPH-104184
            // append the rest of the queryString (sort, pagination, ref, price range)
            if (remainingQueryString) {
                url = url + '&' + remainingQueryString;
            }

            const adServiceSXSQueryParams = getAdServiceSXSQueryParams(keyword);
            url = url + '&loc=' + currentLanguage + '-' + currentCountry + '&ch=rwd' + '&countryCode=' + currentCountry + adServiceSXSQueryParams;

            if (isNLPInstrumentationEnabled) {
                if (isConstructorEnabled && constructorSessionID && constructorClientID) {
                    url = `${url}&constructorSessionID=${constructorSessionID}&constructorClientID=${constructorClientID}&targetSearchEngine=nlp`;
                }
            } else {
                url = url + `&targetSearchEngine=${isConstructorEnabled ? 'nlp' : 'endeca'}`;
            }

            const req = new window.XMLHttpRequest();

            req.withCredentials = true;
            req.open('GET', url, true);

            if (isJerrySearch) {
                req.setRequestHeader('x-requested-source', 'rwd');
            }

            req.timeout = 10000;

            req.onreadystatechange = function () {
                const DONE_STATE = 4;
                const OK_STATUS = 200;

                if (this.readyState === DONE_STATE && this.status === OK_STATUS) {
                    const response = getRequestResponse.call(this);

                    if (response) {
                        const redirectUrl =
                            response.searchRedirectTarget && (response.searchRedirectTarget.targetUrl || response.searchRedirectTarget.targetValue);

                        if (redirectUrl) {
                            document.location.href = redirectUrl;
                        } else {
                            response.contextId = Math.random().toString(36).substring(2);
                            services.SearchInfo.data = response;
                            services.loadEvents.SearchInfoLoaded = true;
                            window.dispatchEvent(new CustomEvent('SearchInfoLoaded', { detail: {} }));
                        }
                    }
                }
            };

            req.send();
        }
    };

    // get current clientID and sessionID from Constructor.IO storage
    const savedClientID = cookieStore()[constructorioClientIDCookieName];
    const savedSessionID = localStorage.getItem(constructorioSessionIDLocalStorageKey);

    if (savedClientID && savedSessionID && Sephora.configurationSettings) {
        constructorSessionID = savedSessionID;
        constructorClientID = savedClientID;
        isConstructorEnabled = Sephora.configurationSettings.isNLPSearchEnabled;
        isNLPInstrumentationEnabled = Sephora.configurationSettings.isNLPInstrumentationEnabled;
        fetchSearchResponse();
    } else {
        Sephora.Util.onLastLoadEvent(window, ['ConstructorBeaconInitialized'], function () {
            constructorSessionID = global.ConstructorioTracker && global.ConstructorioTracker.getSessionID();
            constructorClientID = global.ConstructorioTracker && global.ConstructorioTracker.getClientID();
            isConstructorEnabled = Sephora.configurationSettings.isNLPSearchEnabled;
            isNLPInstrumentationEnabled = Sephora.configurationSettings.isNLPInstrumentationEnabled;
            fetchSearchResponse();
        });

        Sephora.Util.onLastLoadEvent(window, ['ConstructorBeaconDisabled'], function () {
            isConstructorEnabled = Sephora.configurationSettings.isNLPSearchEnabled;
            isNLPInstrumentationEnabled = Sephora.configurationSettings.isNLPInstrumentationEnabled;
            fetchSearchResponse();
        });
    }
}());
