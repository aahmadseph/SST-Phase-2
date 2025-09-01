import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';
import { isUfeEnvProduction } from 'utils/Env';

const getURLEnv = function () {
    let url = '';

    if (isUfeEnvProduction) {
        url = 'https://api-developer.sephora.com/v1/oauth_3legged_login/userauthentication';
    } else {
        url = 'https://extqa-api-developer.sephora.com/v1/oauth_3legged_login/userauthentication';
    }

    return url;
};

function sdnLogin(userId, password) {
    const userInfo = {
        userId: userId,
        password: password
    };
    const params = urlUtils.getParams();
    const queryStringArray = [];

    Object.keys(params).forEach(key => queryStringArray.push(`${key}=${params[key]}`));

    const url = `${getURLEnv()}?${queryStringArray.join('&')}&Submit=Submit`;

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(userInfo)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default sdnLogin;
