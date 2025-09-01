import ufeApi from 'services/api/ufeApi';
import headerUtils from 'utils/Headers';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const { userXTimestampHeader } = headerUtils;

// https://jira.sephora.com/wiki/display/ILLUMINATE/Create+BI+Account+API

function createBiAccount(input) {
    const { isAtgSunsetEnabled = false } = Sephora.configurationSettings;
    const emailOptIn = input?.subscription?.subScribeToEmails ?? true;
    const config = isAtgSunsetEnabled
        ? {
            method: 'PUT',
            url: '/gway/v2/bi/account',
            body: {
                biAccount: {
                    birthDay: input.biAccount?.birthDay,
                    birthMonth: input.biAccount?.birthMonth,
                    emailOptIn,
                    accountType: 'BI'
                },
                profileId: Storage.local.getItem(LOCAL_STORAGE.PROFILE_ID)
            }
        }
        : {
            method: 'POST',
            url: '/api/bi/account',
            body: input
        };

    const { method, url, body } = config;

    return ufeApi
        .makeRequest(url, {
            method: method,
            headers: userXTimestampHeader(),
            body: JSON.stringify(body)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default createBiAccount;
