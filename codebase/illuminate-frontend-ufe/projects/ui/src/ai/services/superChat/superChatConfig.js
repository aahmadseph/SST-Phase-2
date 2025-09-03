/* eslint-disable camelcase */
import ufeApi from 'services/api/ufeApi';

const URL = '/gway/v1/genai-pa/v1/config';

const superChatConfig = (token, language, country, clientId, anonymousId) => {
    const headers = {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
    };

    const params = {
        language: language.toLowerCase(),
        loc: `${language.toLowerCase()}-${country.toUpperCase()}`,
        country: country,
        campaign_name: 'product-advisor',
        client_id: clientId || '',
        anonymous_id: anonymousId || ''
    };

    return ufeApi
        .makeRequest(`${URL}?${new URLSearchParams(params).toString()}`, {
            method: 'GET',
            headers
        })
        .then(data => (data.errorCode ? Promise.reject(data) : { ...data, token: token }));
};

export default superChatConfig;
