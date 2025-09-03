import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Update+Credit+Card+on+Profile+API

function updateCreditCardOnProfile(creditCardInfo) {
    const url = '/api/users/profiles/creditCard';

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify(creditCardInfo)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default updateCreditCardOnProfile;
