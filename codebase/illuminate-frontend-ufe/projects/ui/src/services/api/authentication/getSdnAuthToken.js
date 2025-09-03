import ufeApi from 'services/api/ufeApi';
let URL = '/api/oauth/sdn/accessToken';

const SDN_AUTH_CLIENT_NAME_OLR = 'OLR';
const SDN_AUTH_CLIENT_NAME_BV = 'BV';
const SDN_AUTH_CLIENT_NAME_UFE = 'UFE';
const SDN_AUTH_CLIENT_NAME_RWD = 'RWD';
// API documentation: https://jira.sephora.com/wiki/x/LnNRC

function getSdnAuthToken(bodyJSON) {
    const ts = Math.round(new Date().getTime() / 1000);

    if (Sephora.configurationSettings.isNewOauthEnabled) {
        URL = '/gapi/oauth/sdn/accessToken';
    }

    return ufeApi
        .makeRequest(URL + '?ts=' + ts, {
            method: 'POST',
            body: JSON.stringify(bodyJSON)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default {
    getSdnAuthToken,
    SDN_AUTH_CLIENT_NAME_OLR,
    SDN_AUTH_CLIENT_NAME_BV,
    SDN_AUTH_CLIENT_NAME_UFE,
    SDN_AUTH_CLIENT_NAME_RWD
};
