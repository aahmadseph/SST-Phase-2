import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';

// https://jira.sephora.com/browse/CE-286

function submitEmailSMSOptInForm(payloadData) {
    let url = '/api/util/OptinEmailSms';
    const payload = {
        locale: payloadData.locale,
        phoneNumber: payloadData.phoneNumber,
        type: payloadData.type
    };
    const { enableSMSOptInParameters = false } = Sephora.configurationSettings;

    if (RCPSCookies.isRCPSAccountAPIEnabled()) {
        url = '/gway/v2/util/OptinEmailSms';

        if (enableSMSOptInParameters) {
            payload.pageName = payloadData.pageName;
            payload.pageType = payloadData.pageType;
        }
    }

    if (payloadData.requestOrigin) {
        payload.requestOrigin = payloadData.requestOrigin;
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(data => (data.errorCode || data.errors ? Promise.reject(data) : data));
}

export default { submitEmailSMSOptInForm };
