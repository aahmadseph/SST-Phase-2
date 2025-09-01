import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';
import userUtils from 'utils/User';
import Empty from 'constants/empty';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Update+Profile+API

function updateProfile(profileData) {
    const { enableAuthServiceUpdatePwd = false } = Sephora.configurationSettings;

    let url = '/api/users/profile';
    const isUpdatingPassword = profileData.fragmentForUpdate === 'PASSWORD';

    if (RCPSCookies.isRCPSAccountAPIEnabled() && !isUpdatingPassword) {
        url = '/gway/v2/users/profiles';
    }

    let payload = profileData;

    if (enableAuthServiceUpdatePwd && isUpdatingPassword) {
        url = '/gway/v1/dotcom/auth/v2/users';
        payload = {
            clientId: userUtils.getBiAccountId() || Empty.String,
            password: profileData.password
        };
    }

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify(payload),
            headers: {
                'x-requested-source': 'web',
                'Content-type': 'application/json'
            }
        })
        .then(data => (data.errorCode || data.errors ? Promise.reject(data) : data));
}

export default updateProfile;
