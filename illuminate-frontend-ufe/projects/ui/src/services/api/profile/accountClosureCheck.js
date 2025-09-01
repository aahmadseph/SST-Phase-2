import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';

export function accountClosureCheck(profileId) {
    let url = `/api/users/profiles/${profileId}/accountClosureCheck`;

    if (RCPSCookies.isRCPSProfileInfoGroupAPIEnabled()) {
        url = `/gway/v2/users/profiles/${profileId}/accountClosureCheck`;
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default { accountClosureCheck };
