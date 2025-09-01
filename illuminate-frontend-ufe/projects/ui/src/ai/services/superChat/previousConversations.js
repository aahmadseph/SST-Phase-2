/* eslint-disable camelcase */
import ufeApi from 'services/api/ufeApi';

const URL = '/gway/v1/genai-pa/v1/conversations/messages';

const previousConversations = (token, clientId, anonymousId) => {
    const headers = {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
    };

    const params = {
        client_id: clientId || '',
        page: 0,
        page_size: 20,
        query: '',
        anonymous_id: anonymousId || ''
    };

    return ufeApi
        .makeRequest(`${URL}?${new URLSearchParams(params).toString()}`, {
            method: 'GET',
            headers
        })
        .then(data => (data.errorCode ? Promise.reject(data) : { ...data, token: token }));
};

export default previousConversations;
