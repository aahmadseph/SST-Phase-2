import ufeApi from 'services/api/ufeApi';
import userUtils from 'utils/User';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Logout+API

function logout(xCausedHeader = '') {
    const { enableAuthServiceLogout = false } = Sephora.configurationSettings;
    const url = enableAuthServiceLogout ? '/gway/v1/dotcom/auth/v2/logout' : '/api/auth/logout';

    const options = {
        method: 'POST',
        headers: {
            'x-requested-source': 'web',
            'Content-type': 'application/json',
            'x-caused-by': xCausedHeader
        }
    };

    if (enableAuthServiceLogout) {
        options.body = JSON.stringify({
            email: userUtils.getProfileEmail()
        });
    }

    return ufeApi.makeRequest(url, options).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default logout;
