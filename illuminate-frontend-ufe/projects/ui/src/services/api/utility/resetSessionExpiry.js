import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Get+Reset+Session+Timeout+API

function resetSessionExpiry() {
    const url = '/api/util/session';

    return ufeApi
        .makeRequest(
            url,
            {
                method: 'GET'
            },
            {
                numRetries: 3,
                retryTimeout: 1000
            }
        )
        .then(data => (data.errorCode ? Promise.reject(data) : data))
        .catch(error => Promise.reject(error));
}

export default resetSessionExpiry;
