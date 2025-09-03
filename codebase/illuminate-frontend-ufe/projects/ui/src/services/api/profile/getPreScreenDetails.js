import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+PreScreen+Details

function getPreScreenDetails(profileId) {
    const url = `/api/users/profiles/${profileId}/applyCreditCard`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getPreScreenDetails;
