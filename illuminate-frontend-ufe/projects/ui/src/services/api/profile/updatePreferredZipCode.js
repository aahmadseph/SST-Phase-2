import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';
import UserUtils from 'utils/User';
// https://confluence.sephora.com/wiki/display/ILLUMINATE/Update+preferred+zip+code

function updatePreferredZipCode(args) {
    let url = '/api/users/profile/preferredZipCode';
    const isUserAnonymous = UserUtils.isAnonymous();
    const { isAnonProfileEnabled } = Sephora.configurationSettings;
    const isRCPSFullProfileGroup = RCPSCookies.isRCPSFullProfileGroup();
    const { enablePreferredZipcodeToATG = false } = Sephora.configurationSettings;

    if ((isRCPSFullProfileGroup && !isUserAnonymous) || (isUserAnonymous && isAnonProfileEnabled)) {
        url = `/gway/v2/users/profile/preferredZipCode?enablePreferredZipcodeToATG=${enablePreferredZipcodeToATG}`;
    }

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify(args)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default updatePreferredZipCode;
