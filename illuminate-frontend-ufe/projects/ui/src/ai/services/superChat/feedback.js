/* eslint-disable camelcase */
import ufeApi from 'services/api/ufeApi';
import languageLocaleUtils from 'utils/LanguageLocale';

const feedback = (token, params) => {
    const URL = '/gway/v1/genai-pa-manager/feedback/register';
    const { getCurrentLanguage, getCurrentCountry } = languageLocaleUtils;
    const {
        question, response, sessionId, lastMessageId, clientId, anonymousId
    } = params || {};

    const body = {
        language: getCurrentLanguage()?.toLowerCase(),
        country: getCurrentCountry(),
        constructor_client_id: global.ConstructorioTracker.getClientID(),
        previous_message_id: lastMessageId,
        constructor_session_id: sessionId,
        anonymous_id: anonymousId || '',
        client_id: clientId || '',
        feedback_content: {
            question: question,
            answer: [response]
        }
    };
    const headers = {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
        genai_pa_session_id: sessionId
    };

    return ufeApi
        .makeRequest(URL, {
            method: 'POST',
            body: JSON.stringify(body),
            headers
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
};

export default feedback;
