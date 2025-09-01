import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';

function getSDUSubscription(userProfileIds) {
    const { sdnUfeAPIUserKey } = Sephora.configurationSettings;
    const { country, language } = Sephora.renderQueryParams;
    const queryParams = new Map();
    queryParams.set('apikey', sdnUfeAPIUserKey);
    queryParams.set('type', 'SDU');

    const selectedProfileId = Sephora.configurationSettings.isARForNGPEnabled ? userProfileIds.biAccountId : userProfileIds.profileId;

    const queryString = urlUtils.buildQuery(queryParams);
    const apiVersion = '/v1';
    const isMirrorTrainingEnv = Sephora.isAgent && urlUtils.isSiteTraining();
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

export default { getSDUSubscription };
