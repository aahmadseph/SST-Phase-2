import deepEqual from 'deep-equal';
import jsUtils from 'utils/javascript';
import urlUtils from 'utils/Url';
import LocaleUtils from 'utils/LanguageLocale';
import store from 'store/Store';
import watch from 'redux-watch';
import historyLocationActions from 'actions/framework/HistoryLocationActions';

function rememberState(chunkId, state) {
    const locationState = window.history.state ? window.history.state : {};

    locationState.timestamp = new Date().toString();
    locationState[chunkId] = state;

    window.history.replaceState(locationState, window.document.title);
}

function getState(chunkId) {
    return window.history.state && window.history.state[chunkId];
}

function _normalizePath(pathStr) {
    // Making sure path has a single slash at the beginning.
    const result = '/' + pathStr.replace(/^\/+/, '');

    return result;
}

function _normalizeQueryParams(queryParamsObj) {
    /* eslint-disable guard-for-in */
    const result = {};

    // Making sure that every query param is an array, because in the store
    // (historyLocation.queryParams) they all are. And since we're going
    // to compare them with the stored in the store ones...
    for (const paramName in queryParamsObj) {
        let value = queryParamsObj[paramName];

        if (value !== undefined) {
            if (!(value instanceof Array)) {
                value = [value.toString()];
            }

            result[paramName] = value;
        }
    }

    return result;
}

function _normalizeAnchor(anchorStr) {
    let result;

    // Making sure anchor has a hash sign at the beginning.
    if (anchorStr[0] !== '#' && anchorStr.length > 0) {
        result = '#' + anchorStr;
    } else {
        result = anchorStr;
    }

    return result;
}

/**
 * @param locationObj object The { path, queryParams, anchor } object
 *
 * If any of the three parts is falsy, it's replaced with the valid part from
 * the current window.location
 */
function normalizeLocation(locationObj) {
    const prevPath = window.location.pathname;
    const { path, queryParams, anchor } = locationObj;

    let newPath, newQueryParams, newAnchor;

    if (typeof path === 'string') {
        newPath = _normalizePath(path);
    } else {
        newPath = window.location.pathname;
    }

    if (queryParams) {
        newQueryParams = _normalizeQueryParams(queryParams);
    } else {
        newQueryParams = urlUtils.getParams(window.location.search);
    }

    if (typeof anchor === 'string') {
        newAnchor = _normalizeAnchor(anchor);
    } else {
        newAnchor = window.location.hash;
    }

    return {
        path: newPath,
        queryParams: newQueryParams,
        anchor: newAnchor,
        prevPath: prevPath
    };
}

/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** * * * *
  *                                                                          *

 █████╗ ████████╗████████╗███████╗███╗   ██╗████████╗██╗ ██████╗ ███╗   ██╗  ██╗
██╔══██╗╚══██╔══╝╚══██╔══╝██╔════╝████╗  ██║╚══██╔══╝██║██╔═══██╗████╗  ██║  ██║
███████║   ██║      ██║   █████╗  ██╔██╗ ██║   ██║   ██║██║   ██║██╔██╗ ██║  ██║
██╔══██║   ██║      ██║   ██╔══╝  ██║╚██╗██║   ██║   ██║██║   ██║██║╚██╗██║  ╚═╝
██║  ██║   ██║      ██║   ███████╗██║ ╚████║   ██║   ██║╚██████╔╝██║ ╚████║  ██╗

  *                                                                          *
  *          Please never use _updateLocation method directly.               *
  *      Instead, use pushToLocation or replaceLocation respectively!        *
  *                                                                          *
  *    Please avoid modifying this method unless YOU KNOW what you're doing, *
  *  as there's no way to test it other than manually as window.location and *
  *      window.history are read-only properties and cannot be stubbed.      *
  *                                                                          *
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * ** * * * */

function _updateLocation(normalizedLocation, isReplaceState) {
    const { path, queryParams, anchor } = normalizedLocation;

    const doesPathChange = window.location.pathname !== path;
    const currentQueryParams = urlUtils.getParams(window.location.search);
    const doQueryParamsChange = !deepEqual(currentQueryParams, queryParams);
    const doesAnchorChange = window.location.hash !== anchor;

    const shouldUpdate = doesPathChange || doQueryParamsChange || doesAnchorChange;

    if (window.history && shouldUpdate) {
        const newQueryString = urlUtils.buildQuery(jsUtils.buildMap(queryParams));
        const newUrl = window.location.origin + path + newQueryString + anchor;

        if (isReplaceState) {
            window.history.replaceState({}, null, newUrl);
        } else {
            window.history.pushState({}, null, newUrl);
        }
    }
}

function pushToLocation(location) {
    _updateLocation(location, false);
}

function replaceLocation(location) {
    _updateLocation(location, true);
}

/**
 * @param e the onClick event object
 * @param locationObj object representing { path, queryParams, anchor }
 * path is a string with '/' at the front
 * queryParams should be an object with param names as keys, and related values as an array
 * or as a single string
 *  {
 *      paramName: ['param1', 'param2'],
 *      otherParam: 'other1'
 *  }
 * anchor is a string with '#'
 */

function loadSpa(newLocation, previousLocation) {
    const shouldScrollPageToTop = navigationTriggeredByUser;

    require.ensure(
        [],
        async function () {
            // Load all pages so components chunk can be used in the SPA loads
            const IndexPages = (await import(/* webpackChunkName: "components" */ 'pages/index')).default;
            const PriorityIndex = (await import(/* webpackChunkName: "priority" */ 'pages/priorityIndex')).default;
            Sephora.combinedPages = { ...IndexPages, ...PriorityIndex };

            await import(/* webpackMode: "eager" */ 'actions/framework').then(({ default: { openOrUpdatePage } }) => {
                const openOrUpdatePageAction = openOrUpdatePage(newLocation, previousLocation, shouldScrollPageToTop);
                store.dispatch(openOrUpdatePageAction);
            });
        },
        'components'
    );
}

let navigationTriggeredByUser = false;

function doSPANavigation(locationObj) {
    const shouldPrependURLWithFrenchLocale =
        Sephora.isSEOForCanadaEnabled &&
        LocaleUtils.isCanada() &&
        !locationObj.path.startsWith('/ca/') &&
        (locationObj.path.startsWith('/sale') || urlUtils.SEOForCanadaPages.some(path => locationObj.path.startsWith(`/${path}/`)));

    if (shouldPrependURLWithFrenchLocale) {
        let countryPrefix = '/ca';

        if (LocaleUtils.isFrench()) {
            countryPrefix += '/fr';
        } else {
            countryPrefix += '/en';
        }

        locationObj.path = `${countryPrefix}${locationObj.path}`;
    }

    const goToAction = historyLocationActions.goTo(locationObj);
    navigationTriggeredByUser = true;
    store.dispatch(goToAction);
    navigationTriggeredByUser = false;
}

function initFrontEndRouter() {
    if (!Sephora.isNodeRender) {
        window.addEventListener('popstate', () => {
            const path = window.location.pathname,
                queryParams = urlUtils.getParams(window.location.search),
                anchor = window.location.hash,
                browserBtnNav = true;

            store.dispatch(
                historyLocationActions.replaceLocation({
                    path,
                    queryParams,
                    anchor,
                    browserBtnNav
                })
            );

            // TODO 18.1: ILLUPH-100660 - Fire analytics as per a page load
        });

        // Add url pathname, url query params and all page load cookies to the store
        store.dispatch(
            historyLocationActions.replaceLocation({
                path: window.document.location.pathname,
                queryParams: urlUtils.getParams(window.location.search),
                anchor: window.document.location.hash
            })
        );

        // Load SPA when history location changes in the store
        if (Sephora.isSPA) {
            const locationWatcher = watch(store.getState, 'historyLocation');

            store.subscribe(
                locationWatcher((location, prevLocation) => {
                    loadSpa(location, prevLocation);
                }),
                { ignoreAutoUnsubscribe: true }
            );
        }
    }
}

/**
 * Splits the url into constituent pieces so that it can be used as a target by
 * the front end router
 * @param url The URL that needs to be split
 */
function splitURL(urlString) {
    if (!urlString) {
        // eslint-disable-next-line no-param-reassign
        urlString = location.href;
    }

    const url = new URL(urlString, window.location.origin),
        queryParams = {};

    url.searchParams.forEach(function (value, key) {
        queryParams[key] = value;
    });

    return {
        hostName: url.hostname,
        path: url.pathname,
        queryParams: queryParams,
        anchor: url.hash
    };
}

export default {
    doSPANavigation,
    getState,
    initFrontEndRouter,
    loadSpa,
    normalizeLocation,
    pushToLocation,
    rememberState,
    replaceLocation,
    splitURL
};
