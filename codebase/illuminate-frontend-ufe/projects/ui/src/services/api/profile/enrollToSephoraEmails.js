import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';
import UserUtils from 'utils/User';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Sephora+Email+Subscription

function enrollToSephoraEmails(email) {
    let url = '/api/users/profile/emailSubscription';
    let headers;

    if (RCPSCookies.isRCPSAccountAPIEnabled()) {
        url = '/gway/v2/users/profile/emailSubscription';

        if (!UserUtils.isSignedIn()) {
            headers = {
                'x-api-key': Sephora.configurationSettings.sdnUfeAPIUserKey
            };
        }
    }

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify({ email }),
            headers
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default enrollToSephoraEmails;
