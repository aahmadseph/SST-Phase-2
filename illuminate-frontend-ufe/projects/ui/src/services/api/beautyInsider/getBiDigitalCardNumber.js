import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+BI+Digital+Card+Number+API

function getBiDigitalCardNumber(userProfileId) {
    let url = `/api/bi/profiles/${userProfileId}/digitalCardNumber?source=other`;

    if (RCPSCookies.isRCPSProfileBiGroupAPIEnabled()) {
        url = `/gway/v2/bi/profiles/${userProfileId}/digitalCardNumber?source=other`;
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getBiDigitalCardNumber;
