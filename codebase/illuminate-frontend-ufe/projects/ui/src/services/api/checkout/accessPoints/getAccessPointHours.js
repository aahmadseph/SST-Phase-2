import ufeApi from 'services/api/ufeApi';
const { makeRequest } = ufeApi;
import urlUtils from 'utils/Url';
import javascriptUtils from 'utils/javascript';
import languageLocaleUtils from 'utils/LanguageLocale';

const { buildQuery } = urlUtils;
const { getCurrentCountry } = languageLocaleUtils;
const { buildMap } = javascriptUtils;

// https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=STORE&title=Access+Points

/**
 *  Request params
 *  longitude, latitude, city, state, postalCode, country
 */

function getAccessPointHours({ altPickLocationID, zipCode }) {
    const url = '/gway/v1/locations/accesspoints/' + altPickLocationID;
    const apikey = Sephora.configurationSettings.sdnUfeAPIUserKey;
    const searchParams = buildQuery(
        buildMap({
            apikey,
            zipCode,
            country: getCurrentCountry()
        })
    );

    return makeRequest(url + searchParams, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getAccessPointHours;
