import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Gift+Card+Balance+API

function getGiftCardBalance(giftCardInfo) {
    return ufeApi
        .makeRequest('/api/giftcard/balance', {
            method: 'POST',
            body: JSON.stringify(giftCardInfo)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getGiftCardBalance;
