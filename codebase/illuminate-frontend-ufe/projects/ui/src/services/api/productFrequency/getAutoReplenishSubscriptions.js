import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';

function getAutoReplenishSubscriptions(userProfileIds, page = 0, status) {
    const { sdnUfeAPIUserKey, isAutoReplenishEmptyHubEnabled = false } = Sephora.configurationSettings;
    const { country, language } = Sephora.renderQueryParams;
    const queryParams = new Map();
    queryParams.set('apikey', sdnUfeAPIUserKey);
    queryParams.set('page', page);

    if (status) {
        queryParams.set('status', status);
    }

    const selectedProfileId = Sephora.configurationSettings.isARForNGPEnabled ? userProfileIds.biAccountId : userProfileIds.profileId;

    const isMirrorTrainingEnv = Sephora.isAgent && urlUtils.isSiteTraining();
    const apiVersion = isAutoReplenishEmptyHubEnabled ? '/v2' : '/v1';
    const queryString = urlUtils.buildQuery(queryParams);
    const replenishmentPath = isMirrorTrainingEnv ? '/replenishment-training/profiles/' : '/replenishment/profiles/';
    const url = '/gway' + apiVersion + replenishmentPath + selectedProfileId + queryString;

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Site-Locale': country,
            'Site-Language': language
        }
    };

    return ufeApi.makeRequest(url, options).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default { getAutoReplenishSubscriptions };
