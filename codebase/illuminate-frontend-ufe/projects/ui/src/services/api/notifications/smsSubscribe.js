import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';
import localeUtils from 'utils/LanguageLocale';

function smsSubscribe(phoneNumber) {
    let url = '/api/util/OptinEmailSms';

    if (RCPSCookies.isRCPSAccountAPIEnabled()) {
        url = '/gway/v2/util/OptinEmailSms';
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify({
                locale: localeUtils.getCurrentLanguageCountryCode(),
                phoneNumber,
                type: 'SMS'
            })
        })
        .then(data => (data.errorCode || data.errors ? Promise.reject(data) : data));
}

export default smsSubscribe;
