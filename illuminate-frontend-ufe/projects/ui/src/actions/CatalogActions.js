import historyLocationActions from 'actions/framework/HistoryLocationActions';
import catalog from 'reducers/catalog';
import { REFINEMENT_TYPES } from 'utils/CatalogConstants';
import catalogUtils from 'utils/Catalog';
import urlUtils from 'utils/Url';
import Location from 'utils/Location';
import sharedUtils from 'utils/Shared';

const { ACTION_TYPES: TYPES } = catalog;

const typesToQueryParamKeys = {
    [REFINEMENT_TYPES.CHECKBOXES]: 'ref',
    [REFINEMENT_TYPES.RADIOS]: 'ref',
    [REFINEMENT_TYPES.COLORS]: 'ref',
    [REFINEMENT_TYPES.SORT]: 'sortBy',
    [REFINEMENT_TYPES.RANGE]: 'pl&ph&ptype',
    [REFINEMENT_TYPES.CHECKBOXES_WITH_DROPDOWN]: 'ref'
};

const SupportedTypes = Object.keys(typesToQueryParamKeys);
const parametersFromUrl = Location.getLocation().search?.split('&');

const trueFalseRegEx = /^(true|false|n\/a)$/i;
const stringWordsRegEx = /([a-zA-Z0-9_\-+/]|n\/a)*/i;
const p13nRegex = /([a-zA-Z0-9\-;,/])*/i;
const numbersOrEmptyRegEx = /^(\d|n\/a)*$/i;
const wordsNotAllowed = /(javascript|data)/i;

/* eslint-disable camelcase */
const marketingParamsRegExObj = {
    $deep_link: trueFalseRegEx,
    _branch_referrer: stringWordsRegEx,
    _branch_match_id: numbersOrEmptyRegEx,
    om_mmc: stringWordsRegEx,
    icid2: stringWordsRegEx,
    referer: stringWordsRegEx,
    $3p: stringWordsRegEx,
    $web_only: trueFalseRegEx,
    emtc2: stringWordsRegEx,
    emcampaign: stringWordsRegEx,
    emlid: stringWordsRegEx,
    emaid: numbersOrEmptyRegEx,
    ematg: numbersOrEmptyRegEx,
    emcid: numbersOrEmptyRegEx,
    promo: numbersOrEmptyRegEx,
    utm_medium: stringWordsRegEx,
    utm_content: stringWordsRegEx,
    utm_source: stringWordsRegEx,
    utm_campaign: stringWordsRegEx,
    ScCid: stringWordsRegEx,
    p13n: p13nRegex
};
const ALLOWED_MARKETING_PARAMS = Object.keys(marketingParamsRegExObj);

function getMarketingParams() {
    const marketingParams = {};
    ALLOWED_MARKETING_PARAMS.forEach(param => {
        const encodedUrlParam = encodeURIComponent(param);
        let value = urlUtils.getParamsByName(encodedUrlParam) || urlUtils.getParamsByName(param);

        if (!value && parametersFromUrl.some(parameter => parameter.startsWith(encodedUrlParam))) {
            value = 'n/a';
        }

        const decodedValue = decodeURIComponent(value);

        if (value && !wordsNotAllowed.test(decodedValue) && marketingParamsRegExObj[param].test(decodedValue)) {
            marketingParams[encodedUrlParam] = value;
        }
    });
    sharedUtils.ALLOWED_FILTERS_BROWSER.forEach(filter => {
        const value = urlUtils.getParamValueAsSingleString(filter);

        if (value) {
            marketingParams[filter] = value;
        }
    });

    return marketingParams;
}

function dispatchMarketingParams() {
    return (dispatch, getState) => {
        const urlParams = urlUtils.getParams();
        const urlParamKeys = Object.keys(urlParams);
        const isMarketingParamPresent = urlParamKeys.some(key => ALLOWED_MARKETING_PARAMS.indexOf(decodeURIComponent(key)) !== -1);

        if (isMarketingParamPresent) {
            const currentQueryParams = getState().historyLocation.queryParams;
            const newQueryParams = { ...currentQueryParams };

            if (newQueryParams.keyword?.[0] === 'sale') {
                delete newQueryParams.keyword;
            }

            const isSearchPage = Location.isSearchPage();
            const isSalePage = Location.isSalePage();

            if (isSearchPage && !isSalePage && !Object.prototype.hasOwnProperty.call(newQueryParams, 'keyword')) {
                const keyword = urlUtils.getParamsByName('keyword');
                newQueryParams.keyword = [keyword];
            }

            const marketingParams = getMarketingParams();
            Object.keys(marketingParams).forEach(key => {
                newQueryParams[key] = marketingParams[key];
            });
            dispatch(historyLocationActions.goTo({ queryParams: newQueryParams }));
        }
    };
}

function applyFilters(filtersToApply = {}) {
    return (dispatch, getState) => {
        const queryParamsToApply = Object.keys(filtersToApply)
            .filter(type => SupportedTypes.indexOf(type) >= 0)
            .map(type => ({
                queryParamKeys: typesToQueryParamKeys[type]?.split('&'),
                values: filtersToApply[type].reduce((acc, v) => {
                    const value = type === REFINEMENT_TYPES.RANGE && v?.split('&').length > 1 ? v.split('&') : [v];

                    return [...acc, ...value];
                }, [])
            }))
            .reduce((acc, x) => {
                x.queryParamKeys.filter(key => !acc[key]).forEach(key => (acc[key] = []));
                x.values.forEach(value => {
                    const kv = x.queryParamKeys.length > 1 ? value?.split('=') : [value];
                    const v = kv.length > 1 ? kv[1] : kv[0];
                    const k = kv.length > 1 ? kv[0] : x.queryParamKeys[0];
                    acc[k] = acc[k] ? [...acc[k], v] : [v];
                });

                return acc;
            }, {});

        const currentQueryParams = getState().historyLocation.queryParams;
        const newQueryParams = { ...currentQueryParams };

        Object.keys(queryParamsToApply).forEach(queryParamKey => {
            newQueryParams[queryParamKey] = queryParamsToApply[queryParamKey];

            // If the filter value is empty remove the node
            if (newQueryParams[queryParamKey] && !newQueryParams[queryParamKey].length) {
                delete newQueryParams[queryParamKey];
            }
        });

        delete newQueryParams.currentPage;
        delete newQueryParams.ts;

        if (JSON.stringify(newQueryParams) !== JSON.stringify(currentQueryParams)) {
            if (newQueryParams.keyword && newQueryParams.keyword[0]) {
                newQueryParams.keyword = [catalogUtils.encodeDecodedParam(newQueryParams.keyword[0])];
            }

            if (newQueryParams.ref && newQueryParams.ref.length) {
                newQueryParams.ref = newQueryParams.ref.map(refinement => {
                    if ((refinement && refinement.includes('&')) || refinement.includes('+')) {
                        const [key, value] = refinement?.split('=');
                        const encodedRefinement = `${key}=${catalogUtils.encodeDecodedParam(value)}`;

                        return encodedRefinement;
                    }

                    return refinement;
                });
            }

            dispatch(historyLocationActions.goTo({ queryParams: newQueryParams }));
        }
    };
}

function setPageNumber(pageNumber) {
    return (dispatch, getState) => {
        const queryParams = Object.assign({}, getState().historyLocation.queryParams);
        queryParams.currentPage = pageNumber;
        dispatch(historyLocationActions.goTo({ queryParams }));
    };
}

function setFilterBarVisibility(payload) {
    return {
        type: TYPES.SET_FILTER_BAR_VISIBILITY,
        payload
    };
}

export default {
    TYPES,
    applyFilters,
    setPageNumber,
    dispatchMarketingParams,
    setFilterBarVisibility
};
