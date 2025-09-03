import ufeApi from 'services/api/ufeApi';
const { makeRequest } = ufeApi;
import urlUtils from 'utils/Url';
import javascriptUtils from 'utils/javascript';
import languageLocaleUtils from 'utils/LanguageLocale';
import helpersUtils from 'utils/Helpers';

const { buildQuery } = urlUtils;
const { getCurrentCountry } = languageLocaleUtils;
const { buildMap } = javascriptUtils;
const { fixArrayResponse } = helpersUtils;

// https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=STORE&title=Access+Points

/**
 *  Request params
 *  longitude, latitude, city, state, postalCode, country
 */

function getAccessPoints(params = {}) {
    const url = '/gway/v1/locations/accesspoints';
    const apikey = Sephora.configurationSettings.sdnUfeAPIUserKey;
    const searchParams = buildQuery(
        buildMap({
            ...params,
            apikey,
            country: params.country ?? getCurrentCountry()
        })
    );

    return makeRequest(url + searchParams, { method: 'GET' }).then(response => {
        // Backend is returning an array directly in the response.
        // This is going to wrap that response in a data property within an object.
        // {
        //    data: [BACKEND_ARRAY],
        //    responseStatus: 200
        // }
        const data = fixArrayResponse(response);

        return data.errorCode ? Promise.reject(data) : data;
    });
}

export default getAccessPoints;
