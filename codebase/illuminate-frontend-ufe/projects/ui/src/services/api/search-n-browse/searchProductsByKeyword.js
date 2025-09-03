import { KEYWORD_SALE, URL_KEYWORDS } from 'constants/Search';
import { PAGE_TYPES } from 'constants/sponsoredProducts';
import ufeApi from 'services/api/ufeApi';
import apiUtils from 'utils/Api';
import localeUtils from 'utils/LanguageLocale';
import rmnUtils from 'utils/rmn';
import urlUtils from 'utils/Url';

const { getAdServiceParams } = rmnUtils;
const { addRwdHeaders, addBrowseExperienceParams } = apiUtils;

// https://jira.sephora.com/wiki/display/ILLUMINATE/Keyword+Search+API

function searchProductsByKeyword(options) {
    const { catalogId, config = {}, ...opts } = options;

    const constructorSessionID = !!global.ConstructorioTracker && global.ConstructorioTracker.getSessionID();
    const constructorClientID = !!global.ConstructorioTracker && global.ConstructorioTracker.getClientID();
    const isNLPSearchEnabled = Sephora.configurationSettings.isNLPSearchEnabled;
    const isNLPInstrumentationEnabled = Sephora.configurationSettings.isNLPInstrumentationEnabled;

    let url = '/api/v2/catalog/search/';

    url = url + `?type=keyword&q=${catalogId}`;
    const getRefinement = function () {
        if (opts.ref && opts.ref.split(',').length) {
            opts.ref.split(',').forEach(refinement => (url += `&ref=${refinement}`));
            delete opts.ref;
        }
    };

    if (isNLPInstrumentationEnabled) {
        if (isNLPSearchEnabled && constructorSessionID && constructorClientID) {
            url = url + `&constructorSessionID=${constructorSessionID}&constructorClientID=${constructorClientID}&targetSearchEngine=nlp`;
            getRefinement();
        }
    } else {
        url = url + '&targetSearchEngine=nlp';
        getRefinement();
    }

    if (Object.keys(opts).length) {
        url += '&' + urlUtils.makeQueryString(opts);
    }

    return ufeApi.makeRequest(url, { method: 'GET' }, config).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export function getProductsFromKeyword({ headers: headersArg, config = {}, ...options }) {
    const constructorSessionID = !!global.ConstructorioTracker && global.ConstructorioTracker.getSessionID();
    const constructorClientID = !!global.ConstructorioTracker && global.ConstructorioTracker.getClientID();
    const isNLPSearchEnabled = Sephora.configurationSettings.isNLPSearchEnabled;
    const isNLPInstrumentationEnabled = Sephora.configurationSettings.isNLPInstrumentationEnabled;
    const SXSSearchEnabled = true;
    const isSearch = options.q !== KEYWORD_SALE;
    const hasFilters = !Object.keys(options).every(option => option === URL_KEYWORDS.KEYWORD || option === URL_KEYWORDS.NODE);

    let url = '/api/v2/catalog/search/';

    const queryStringObject = {
        type: 'keyword',
        content: true,
        includeRegionsMap: true,
        includeEDD: true,
        targetSearchEngine: 'nlp',
        countryCode: localeUtils.isCanada() ? localeUtils.COUNTRIES.CA : localeUtils.COUNTRIES.US,
        ...options
    };

    const bxConfig = {
        service: 'search',
        isSXSSearchEnabled: SXSSearchEnabled
    };

    addBrowseExperienceParams(queryStringObject, bxConfig);

    if (Object.keys(queryStringObject).length) {
        url += '?' + urlUtils.makeQueryString(queryStringObject);
    }

    if (isNLPInstrumentationEnabled) {
        if (isNLPSearchEnabled && constructorSessionID && constructorClientID) {
            url = url + `&constructorSessionID=${constructorSessionID}&constructorClientID=${constructorClientID}`;
        }
    }

    const headers = addRwdHeaders(headersArg);

    if (SXSSearchEnabled && isSearch && !hasFilters) {
        const adServiceParams = getAdServiceParams(PAGE_TYPES.SEARCH);
        const adServiceQueryParams = Object.keys(adServiceParams)
            .map(key => key + '=' + adServiceParams[key])
            .join('&');
        url += '&' + adServiceQueryParams;
    }

    return ufeApi
        .makeRequest(
            url,
            {
                method: 'GET',
                headers
            },
            config
        )
        .then(data => {
            return data.errorCode ? Promise.reject(data) : data;
        });
}

export default {
    searchProductsByKeyword,
    getProductsFromKeyword
};
