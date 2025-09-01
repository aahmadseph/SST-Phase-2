import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Apply+Gift+Card+API

function applyGiftCard(giftCardData) {
    const url = '/api/checkout/orders/paymentGroups/giftCard';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(giftCardData)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default applyGiftCard;
