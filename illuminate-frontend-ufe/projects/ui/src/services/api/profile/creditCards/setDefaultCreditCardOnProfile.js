import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Set+Default+Credit+Card+on+Profile+API

function setDefaultCreditCardOnProfile(creditCardId) {
    const url = '/api/users/profiles/creditCards/defaultCreditCard';

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify({ creditCardId: creditCardId })
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default setDefaultCreditCardOnProfile;
