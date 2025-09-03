import creditCardUtils from 'utils/CreditCard';
import ufeApi from 'services/api/ufeApi';

const { getEncryptedCreditCardData } = creditCardUtils;

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Add+Payment+Credit+Card+API
function addPaymentCreditCard(creditCardData) {
    const url = '/api/payments/creditCard';
    const encryptedCreditCardData = getEncryptedCreditCardData(creditCardData);

    if (encryptedCreditCardData.errorCode === -1) {
        return Promise.reject(encryptedCreditCardData);
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(encryptedCreditCardData)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default addPaymentCreditCard;
