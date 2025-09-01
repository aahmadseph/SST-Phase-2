import ufeApi from 'services/api/ufeApi';

function mergeBasket(anonToken) {
    const url = '/api/shopping-cart/baskets/merge';
    const tokenPayload = anonToken.split('.')[1];
    const userTokenData = JSON.parse(atob(tokenPayload.replace(/-/g, '+').replace(/_/g, '/')));

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify({ anonUserId: userTokenData?.AuthData?.uuid })
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default mergeBasket;
