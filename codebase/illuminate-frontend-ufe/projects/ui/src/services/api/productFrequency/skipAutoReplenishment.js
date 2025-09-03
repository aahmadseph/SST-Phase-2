import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';

function skipAutoReplenishment(subscriptionId, associatedAction = 1) {
    const { sdnUfeAPIUserKey } = Sephora.configurationSettings;
    const { country, language } = Sephora.renderQueryParams;
    const queryParams = new Map();
    queryParams.set('apikey', sdnUfeAPIUserKey);
    queryParams.set('associatedAction', associatedAction);

    const queryString = urlUtils.buildQuery(queryParams);
    const url = `/gway/v1/replenishment/${subscriptionId}/skip${queryString}`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Site-Locale': country,
            'Site-Language': language
        },
        body: JSON.stringify({
            subscriptionId
        })
    };

    return ufeApi.makeRequest(url, options).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default { skipAutoReplenishment };
