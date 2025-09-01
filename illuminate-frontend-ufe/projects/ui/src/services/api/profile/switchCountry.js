import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';
import UserUtils from 'utils/User';
import accessTokenApi from 'services/api/accessToken/accessToken';
import localeUtils from 'utils/LanguageLocale';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Switch+Country+API
const accessToken = 'AUTH_ACCESS_TOKEN';

function switchCountry(_jwtAccesstoken, switchToCountry, languageCode) {
    const { isAnonProfileEnabled } = Sephora.configurationSettings;
    const isUserAnonymous = UserUtils.isAnonymous();
    const isRCPSFullProfileGroup = RCPSCookies.isRCPSFullProfileGroup();

    if (isUserAnonymous && isAnonProfileEnabled) {
        localeUtils.setCurrentLanguage(languageCode.toLowerCase());
        localeUtils.setCurrentCountry(switchToCountry.toLowerCase());
        localeUtils.setShippingCountry(switchToCountry);

        return Promise.resolve({ profileLocale: switchToCountry, profileLanguage: languageCode });
    }

    let url = '/api/users/profile/switchCountry';

    if (isRCPSFullProfileGroup && !isUserAnonymous) {
        url = '/gway/v2/users/profile/switchCountry';
    }

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            body: JSON.stringify({
                switchToCountry,
                languageCode
            })
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data))
        .catch(err => Promise.reject(err));
}

export default accessTokenApi.withAccessToken(switchCountry, accessToken);
