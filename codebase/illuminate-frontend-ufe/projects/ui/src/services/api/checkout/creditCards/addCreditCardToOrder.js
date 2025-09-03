import creditCardUtils from 'utils/CreditCard';
import ufeApi from 'services/api/ufeApi';

const { getEncryptedCreditCardData } = creditCardUtils;

// https://jira.sephora.com/wiki/display/ILLUMINATE/Add+Credit+Card+To+Order+API
function addCreditCardToOrder(creditCardInfo, isApplePay) {
    const creditCardData = isApplePay ? creditCardInfo : getEncryptedCreditCardData(creditCardInfo);

    if (creditCardData.errorCode === -1) {
        return Promise.reject(creditCardData);
    }

    const url = '/api/checkout/orders/creditCard';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(creditCardData)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default addCreditCardToOrder;
