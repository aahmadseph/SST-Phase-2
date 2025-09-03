import ufeApi from 'services/api/ufeApi';
import servicesUtils from 'utils/Services';

const { appendIOSSafariCacheBustingParam } = servicesUtils;

// https://jira.sephora.com/wiki/display/ILLUMINATE/Update+Basket+API

function updateBasket({
    orderId, skuList, modifyConfirmed, isRopis, isSameDay
}) {
    const url = appendIOSSafariCacheBustingParam('/api/shopping-cart/basket/items');

    const dataParameters = {
        orderId,
        skuList,
        modifyConfirmed: !!modifyConfirmed
    };

    if (isRopis) {
        dataParameters.fulfillmentType = 'ROPIS';
    } else if (isSameDay) {
        dataParameters.fulfillmentType = 'SAMEDAY';
    }

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify(dataParameters)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default updateBasket;
