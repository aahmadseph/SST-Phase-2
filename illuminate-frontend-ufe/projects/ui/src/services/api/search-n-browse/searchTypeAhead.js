import ufeApi from 'services/api/ufeApi';
import apiUtils from 'utils/Api';
import urlUtils from 'utils/Url';

const { addBrowseExperienceParams } = apiUtils;

// https://jira.sephora.com/wiki/display/ILLUMINATE/Type+Ahead+Search+API

function searchTypeAhead(query, includeOnlyProducts = false, suggestions = {}) {
    const constructorSessionID = !!global.ConstructorioTracker && global.ConstructorioTracker.getSessionID();
    const constructorClientID = !!global.ConstructorioTracker && global.ConstructorioTracker.getClientID();
    const isNLPSearchEnabled = Sephora.configurationSettings.isNLPSearchEnabled;
    const isNLPInstrumentationEnabled = Sephora.configurationSettings.isNLPInstrumentationEnabled;
    const lastParam = includeOnlyProducts ? '&includeOnlyProducts=true' : '';
    const { productSuggestions = 6, searchSuggestions = 3, categorySuggestions = 5 } = suggestions;
    let url = '/api/v2/catalog/search/';

    const type = 'typeAhead';

    url =
        url +
        `?type=${type}&q=${encodeURIComponent(
            query
        )}${lastParam}&searchSuggestions=${searchSuggestions}&productSuggestions=${productSuggestions}&categorySuggestions=${categorySuggestions}`;

    if (isNLPInstrumentationEnabled) {
        if (isNLPSearchEnabled && constructorSessionID && constructorClientID) {
            url = url + `&constructorSessionID=${constructorSessionID}&constructorClientID=${constructorClientID}&targetSearchEngine=nlp`;
        }
    } else {
        url = url + '&targetSearchEngine=nlp';
    }

    const opts = {};
    const config = {
        service: 'search',
        isSXSSearchEnabled: true
    };

    addBrowseExperienceParams(opts, config);

    if (Object.keys(opts).length) {
        url += '&' + urlUtils.makeQueryString(opts);
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default searchTypeAhead;
