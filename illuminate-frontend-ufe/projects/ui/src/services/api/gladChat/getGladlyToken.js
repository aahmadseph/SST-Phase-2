import ufeApi from 'services/api/ufeApi';

function getGladlyToken(biId) {
    const url = '/gway/v1/ucm/generateToken';
    const headers = {
        'Content-Type': 'application/json'
    };
    const payload = JSON.stringify({ biId });

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: payload,
            headers
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getGladlyToken;
