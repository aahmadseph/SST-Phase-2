import ufeApi from 'services/api/ufeApi';
import authUtils from 'utils/Authentication';
import RCPSCookies from 'utils/RCPSCookies';

const ATG_URL = '/api/secure/validatePasswordToken';
const AUTH_URL = '/api/auth/v1/validatePasswordToken';
const SDN_URL = '/gway/v1/dotcom/auth/v1/validatePasswordToken';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Validate+Password+Token+API

async function validatePasswordToken(securityToken, isStoreBIMemberEmailVerification = false) {
    const { isAuthServiceResetPassEnabled } = Sephora.configurationSettings;

    let URL = ATG_URL;
    let headers = {};
    const payload = { securityToken };

    /*
    Since only Auth service can validate tokens for the email verification flow
    we are redirecting request to Auth service when isStoreBIMemberEmailVerification is true,
    no matter the status of the killswitch.
    */
    if (isAuthServiceResetPassEnabled || isStoreBIMemberEmailVerification) {
        URL = AUTH_URL;
        headers = {
            'Content-type': 'application/json',
            'x-requested-source': 'web'
        };
        payload.isStoreBIMemberEmailVerification = isStoreBIMemberEmailVerification;
    }

    if (RCPSCookies.isRCPSAuthEnabled()) {
        URL = SDN_URL;
        headers.deviceId = await authUtils.getFingerPrint();
    }

    return ufeApi
        .makeRequest(URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers
        })
        .then(data => (data.errorCode || data.errors ? Promise.reject(data) : data));
}

export default validatePasswordToken;
