import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Merchant+Validation+ApplePay

function validateApplePayMerchant(domainName, validationUrl) {
    const url = '/api/checkout/applePay/validateMerchant';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify({
                domainName,
                validationURL: validationUrl
            })
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default validateApplePayMerchant;
