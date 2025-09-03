/**
 * CSF API wrapper for passing sdn token to csfApi calls.
 */
import ufeApi from 'services/api/ufeApi';
import sdnToken from 'services/api/sdn/sdnToken';

const makeAuthenticatedRequest = (url, options = {}) => {
    const sdnUfeAPIUserKey = Sephora.configurationSettings.sdnUfeAPIUserKey;
    const makeRequest = (token, requestUrl, requestOptions = {}) => {
        const finalOptions = {
            method: 'GET',
            ...requestOptions,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Api-Key': sdnUfeAPIUserKey,
                ...requestOptions.headers
            }
        };

        return ufeApi.makeRequest(requestUrl, finalOptions);
    };

    return sdnToken.callWithSdnToken(makeRequest, [url, options], true, 'UFE_AUTH_TOKEN');
};

const makeAuthenticatedPostRequest = (url, body = {}, options = {}) => {
    const sdnUfeAPIUserKey = Sephora.configurationSettings.sdnUfeAPIUserKey;
    const makeRequest = (token, requestUrl, requestOptions = {}) => {
        const finalOptions = {
            method: 'POST',
            ...requestOptions,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Api-Key': sdnUfeAPIUserKey,
                ...requestOptions.headers
            },
            body: JSON.stringify(body)
        };

        return ufeApi.makeRequest(requestUrl, finalOptions);
    };

    return sdnToken.callWithSdnToken(makeRequest, [url, options], true, 'UFE_AUTH_TOKEN');
};

export default { makeAuthenticatedRequest, makeAuthenticatedPostRequest };
