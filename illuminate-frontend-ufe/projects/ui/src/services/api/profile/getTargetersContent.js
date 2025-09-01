import ufeApi from 'services/api/ufeApi';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import UserUtils from 'utils/User';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Targeter+Content+API

function getTargetersContent(targeters, config) {
    if (targeters.length) {
        const options = {
            method: 'GET'
        };
        const url = '/api/personalization/targeter?includeTargeters=' + targeters.join(',');

        const { isSendAccessToken = false, clientKey = '' } = Sephora.configurationSettings;
        const accessToken = Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN) || '';
        const isAnonymous = UserUtils.isAnonymous();

        if (!isAnonymous && isSendAccessToken) {
            options.headers = {
                'Seph-Access-Token': accessToken,
                'x-api-key': clientKey
            };
        }

        return ufeApi.makeRequest(url, options, config).then(data => (data.errorCode ? Promise.reject(data) : data));
    } else {
        return Promise.resolve([]);
    }
}

export default getTargetersContent;
