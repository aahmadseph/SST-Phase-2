import creditCardUtils from 'utils/CreditCard';
import ufeApi from 'services/api/ufeApi';

const { getEncryptedCreditCardData } = creditCardUtils;

// https://jira.sephora.com/wiki/display/ILLUMINATE/Add+Credit+Card+to+Profile+API
function addCreditCardToProfile(creditCardData) {
    const url = '/api/users/profiles/creditCard';
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

export default addCreditCardToProfile;
