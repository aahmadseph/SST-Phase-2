import ufeApi from 'services/api/ufeApi';
import apiUtils from 'utils/Api';
import localeUtils from 'utils/LanguageLocale';
import searchUtils from 'utils/Search';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';

const { handleSEOForCanada } = searchUtils;
const { addRwdHeaders } = apiUtils;

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Nth+Level+Category+API

function getNthLevelCategory(options) {
    const { catalogId, catalogSeoName, headers, ...opts } = options;
    const catalogService = Sephora.Util.InflatorComps.services.CatalogService;
    let url;
    const isRwd = Sephora.channel?.toUpperCase() === 'RWD';
    url = `/api/catalog/categories/${catalogSeoName}/seo`;

    const constructorSessionID = !!global.ConstructorioTracker && global.ConstructorioTracker.getSessionID();
    const constructorClientID = !!global.ConstructorioTracker && global.ConstructorioTracker.getClientID();
    const isNLPCatalog = catalogService && catalogService.isNLPCatalog();
    const isNLPInstrumentationEnabled = Sephora.configurationSettings.isNLPInstrumentationEnabled;
    const getRefinement = function () {
        if (opts.ref && opts.ref.split(',').length) {
            opts.ref.split(',').forEach(refinement => (url += `&ref=${refinement}`));
            delete opts.ref;
        }
    };

    const removeDuplicate = function (fullUrl) {
        const query = fullUrl.split('?')[1];
        const params = query.split('&');
        const uniqueArray = params.filter(function (item, pos) {
            return params.indexOf(item) === pos;
        });
        let newUrl;
        newUrl = fullUrl.split('?')[0] + '?';
        newUrl += uniqueArray.join('&');

        return newUrl;
    };

    url = `/api/v2/catalog/categories/${catalogSeoName}/seo`;

    if (isNLPInstrumentationEnabled) {
        if (isNLPCatalog && constructorSessionID && constructorClientID) {
            const constructorArgs = isRwd ? '' : `constructorSessionID=${constructorSessionID}&constructorClientID=${constructorClientID}&`;
            url = `${url}?${constructorArgs}targetSearchEngine=${catalogService.catalogEngine}`;
            getRefinement();
        }
    } else {
        url = url + `?targetSearchEngine=${catalogService.catalogEngine}`;
        getRefinement();
    }

    addBrowseExperienceParams(opts);

    if (Object.keys(opts).length) {
        url += (isNLPCatalog ? '&' : url.indexOf('?') === -1 ? '?' : '&') + urlUtils.makeQueryString(opts);
    }

    url = removeDuplicate(url);

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: addRwdHeaders(headers)
        })
        .then(data => {
            if (data.errorCode) {
                return Promise.reject(data);
            } else {
                Sephora.Util.InflatorComps.services.CatalogService.catalogEngine = data.responseSource;

                return handleSEOForCanada(data);
            }
        });
}

const addBrowseExperienceParams = function (options) {
    const locale = `${localeUtils.getCurrentLanguage().toLowerCase()}-${localeUtils.getCurrentCountry()}`;
    options.loc = locale;
    options.ch = Sephora.channel?.toLowerCase();

    if (userUtils.isAnonymous()) {
        return;
    }

    const preferredStoreInfo = userUtils.getPreferredStoreId();
    const preferredZipCode = userUtils.getZipCode();

    if (preferredStoreInfo) {
        options.preferredStoreId = preferredStoreInfo;
    }

    if (preferredZipCode) {
        options.preferredSameDayZipCode = preferredZipCode;
    }
};

function getCategory(requestOptions) {
    const { catalogSeoName, headers, ...paramsList } = requestOptions;
    let url = `/api/v2/catalog/categories/${catalogSeoName}/seo`;

    addBrowseExperienceParams(paramsList);

    if (Object.keys(paramsList).length) {
        url += '?' + urlUtils.makeQueryString(paramsList);
    }

    const options = {
        method: 'GET',
        headers: addRwdHeaders(headers)
    };

    return ufeApi.makeRequest(url, options).then(data => (data.errorCode ? Promise.reject(data) : handleSEOForCanada(data)));
}

export default {
    getNthLevelCategory,
    getCategory
};
