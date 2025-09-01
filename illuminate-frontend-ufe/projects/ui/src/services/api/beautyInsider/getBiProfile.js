import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';

//https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+BI+Profile+API

function getBiProfile(profileId, preferenceStruct = false) {
    let url = `/api/bi/profiles/${profileId}/beautyInsiderAccount`;

    if (RCPSCookies.isRCPSProfileBiGroupAPIEnabled()) {
        url = `/gway/v2/bi/profiles/${profileId}/beautyInsiderAccount`;

        if (preferenceStruct) {
            url = url + '?preferenceStruct=world';
        }
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getBiProfile;
