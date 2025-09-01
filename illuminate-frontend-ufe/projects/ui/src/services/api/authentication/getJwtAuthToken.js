import ufeApi from 'services/api/ufeApi';

const JWT_AUTH_CLIENT_NAME_UFE = 'UFE';

function getJwtAuthToken(bodyJSON) {
    const timestamp = new Date().getTime();
    const url = '/api/manifest/sign?timestamp=' + timestamp;

    const options = {
        url,
        method: 'GET',
        headers: { userData: bodyJSON }
    };

    return ufeApi.makeRequest(url, { ...options }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default {
    getJwtAuthToken,
    JWT_AUTH_CLIENT_NAME_UFE
};
