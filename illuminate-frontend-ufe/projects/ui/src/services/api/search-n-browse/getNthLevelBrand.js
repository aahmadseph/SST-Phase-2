import ufeApi from 'services/api/ufeApi';
import apiUtils from 'utils/Api';
import searchUtils from 'utils/Search';
import urlUtils from 'utils/Url';

const { handleSEOForCanada } = searchUtils;
const { addRwdHeaders, addBrowseExperienceParams } = apiUtils;

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Brand+Details+API

function getBrandAndCategorySeoNames(catalogSeoName) {
    let seoBrandName = catalogSeoName;
    let categorySeoName = null;
    const idx = catalogSeoName.indexOf('/');

    if (idx > -1) {
        seoBrandName = catalogSeoName.substring(0, idx);
        categorySeoName = catalogSeoName.substring(idx + 1);
    }

    return {
        seoBrandName,
        categorySeoName
    };
}

function getNthLevelBrand(options) {
    const {
        brandId, catalogId, catalogSeoName, headers, ...opts
    } = options;
    const catalogService = Sephora.Util.InflatorComps.services.CatalogService;
    const isRwd = Sephora.channel?.toUpperCase() === 'RWD';
    let url;
    const seoNames = getBrandAndCategorySeoNames(catalogSeoName);

    if (seoNames.categorySeoName) {
        opts.categorySeoName = seoNames.categorySeoName;
    }

    url = `/api/v2/catalog/brands/${seoNames.seoBrandName}/seo`;

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
        url += (isNLPCatalog ? '&' : '?') + urlUtils.makeQueryString(opts);
    }

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: addRwdHeaders(headers)
        })
        .then(data => {
            if (data.errorCode) {
                return Promise.reject(data);
            } else {
                catalogService.catalogEngine = data.responseSource;

                return handleSEOForCanada(data);
            }
        });
}

function getBrand(options) {
    const { catalogSeoName, headers, ...opts } = options;

    const seoNames = getBrandAndCategorySeoNames(catalogSeoName);

    if (seoNames.categorySeoName) {
        opts.categorySeoName = seoNames.categorySeoName;
    }

    let url = `/api/v2/catalog/brands/${seoNames.seoBrandName}/seo`;

    addBrowseExperienceParams(opts);

    if (Object.keys(opts).length) {
        url += '?' + urlUtils.makeQueryString(opts);
    }

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: addRwdHeaders(headers)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : handleSEOForCanada(data)));
}

export default {
    getNthLevelBrand,
    getBrand
};
