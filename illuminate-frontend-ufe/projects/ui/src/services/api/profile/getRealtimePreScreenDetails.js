import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Realtime+Prescreen+Details+API

function getRealtimePreScreenDetails(profileId) {
    const url = `/api/users/profiles/${profileId}` + '/realtimePrescreenDetails?includeMediaContent=true&includeRegionsMap=true';

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getRealtimePreScreenDetails;
