import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+PreScreen+Details

function getProfileSettings(profileId) {
    const url = `/api/users/profiles/${profileId}/settings`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getProfileSettings;
