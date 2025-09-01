/* eslint-disable camelcase */
import ufeApi from 'services/api/ufeApi';

const URL = '/gway/v1/genai-pa-manager/session';

const managerSession = (token, sessionFound) => {
    const headers = {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
    };

    if (sessionFound) {
        return new Promise(resolve => {
            resolve({
                genai_pa_session_id: sessionFound,
                token: token
            });
        });
    }

    return ufeApi
        .makeRequest(URL, {
            method: 'POST',
            headers
        })
        .then(data => (data.errorCode ? Promise.reject(data) : { ...data, token: token }));
};

export default managerSession;
