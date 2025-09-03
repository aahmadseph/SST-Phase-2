import ufeApi from 'services/api/ufeApi';
import accessTokenApi from 'services/api/accessToken/accessToken';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Realtime+Prescreen+Details+API

const accessToken = 'AUTH_ACCESS_TOKEN';

function getRealtimePrescreenDetailsSDN(_jwtAccessToken, loyaltyId) {
    const url = `/gway/v2/scc/prescreen/${loyaltyId}`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default accessTokenApi.withAccessToken(getRealtimePrescreenDetailsSDN, accessToken);
