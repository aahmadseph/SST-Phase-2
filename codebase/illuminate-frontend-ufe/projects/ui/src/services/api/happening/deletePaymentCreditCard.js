import ufeApi from 'services/api/ufeApi';
// https://confluence.sephora.com/wiki/display/ILLUMINATE/Remove+Payment+Credit+Card+API

const deletePaymentCreditCard = creditCardInfo => {
    const url = `/api/payments/creditCard/${creditCardInfo}`;
    const result = ufeApi.makeRequest(url, { method: 'DELETE' }).then(response => (response.errorCode ? Promise.reject(response) : response));

    return result;
};

export default deletePaymentCreditCard;
