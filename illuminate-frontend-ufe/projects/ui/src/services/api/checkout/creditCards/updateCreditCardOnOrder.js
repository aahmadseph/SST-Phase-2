import ufeApi from 'services/api/ufeApi';

//https://jira.sephora.com/wiki/display/ILLUMINATE/Update+Credit+Card+on+Order+API

function updateCreditCardOnOrder(creditCardData, typeOfUpdate) {
    const dataWithoutSephoraCardType = Object.assign({}, creditCardData);
    dataWithoutSephoraCardType.creditCard && delete dataWithoutSephoraCardType.creditCard.sephoraCardType;

    // Removing "isMigrated" and "message" properties form creditCard
    // they are not required and will mess up the call
    dataWithoutSephoraCardType.creditCard && delete dataWithoutSephoraCardType.creditCard.isMigrated;
    dataWithoutSephoraCardType.creditCard && delete dataWithoutSephoraCardType.creditCard.message;

    const url = `/api/checkout/orders/creditCard?type=${typeOfUpdate}`;

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify(dataWithoutSephoraCardType)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default updateCreditCardOnOrder;
