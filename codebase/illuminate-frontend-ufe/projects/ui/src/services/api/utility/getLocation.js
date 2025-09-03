import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Location+API

function getLocation(params = {}) {
    let url = '/api/util/location';

    if (Sephora.configurationSettings.isLMSLocationAPIEnabled) {
        url = '/api/v3/util/location';
    }

    const queryParams = [];

    if (params.locationIdentifier) {
        queryParams.push('locationIdentifier=' + params.locationIdentifier);
    }

    if (params.radius) {
        queryParams.push('radius=' + params.radius);
    }

    if (queryParams.length > 0) {
        url = url + '?' + queryParams.join('&');
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getLocation;
