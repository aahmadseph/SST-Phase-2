import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';

function unlinkBiAccount(input) {
    let url = '/api/bi/unlinkAccount';

    if (RCPSCookies.isRCPSAccountAPIEnabled()) {
        url = '/gway/v2/bi/unlinkAccount';
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(input)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default unlinkBiAccount;
