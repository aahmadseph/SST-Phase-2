import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Set+Nickname+API

function setNickname(nickname, provider, source) {
    let url = '/api/users/profile/nickname';

    if (RCPSCookies.isRCPSAccountAPIEnabled()) {
        url = '/gway/v2/users/profiles/nickname';
    }

    const params = {
        isAcceptCommunity: true,
        nickName: nickname,
        provider
    };

    if (source) {
        params.source = source;
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(params)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default setNickname;
