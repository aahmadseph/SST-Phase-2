import ufeApi from 'services/api/ufeApi';

// Get State & City for Zip Code API
// https://jira.sephora.com/wiki/pages/viewpage.action?pageId=120042048

function getStateAndCityForZipCode(countryCode, zipCode) {
    const url = '/api/util/countries/' + countryCode + '/search?zipCode=' + zipCode;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getStateAndCityForZipCode;
