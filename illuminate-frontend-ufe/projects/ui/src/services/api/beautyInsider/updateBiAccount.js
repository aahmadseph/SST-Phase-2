import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Update+BI+Account+API
function updateBiAccount(input, isOrderConfirmation) {
    let url = '/api/bi/account';

    if (RCPSCookies.isRCPSAccountAPIEnabled()) {
        url = '/gway/v2/bi/account';
    }

    const typeQueryString = isOrderConfirmation ? '?type=orderConfirmation' : null;

    if (typeQueryString) {
        url = `${url}${typeQueryString}`;
    }

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify(input)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default updateBiAccount;
