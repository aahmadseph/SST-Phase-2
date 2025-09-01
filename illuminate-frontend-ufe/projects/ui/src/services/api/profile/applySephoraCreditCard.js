import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Apply+Sephora+Credit+Card

function applySephoraCreditCard(creditCardData) {
    const url = '/api/users/profiles/creditCard/apply';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(creditCardData)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default applySephoraCreditCard;
