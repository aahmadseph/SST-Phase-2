import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/AddressValidationAPI

function validateAddress(params) {
    const url = '/api/util/address/validate';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(params)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default validateAddress;
