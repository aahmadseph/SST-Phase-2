import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';

function unsubscribeAutoReplenishment(subscriptionId) {
    const { sdnUfeAPIUserKey } = Sephora.configurationSettings;
    const { country, language } = Sephora.renderQueryParams;
    const queryParams = new Map();
    queryParams.set('apikey', sdnUfeAPIUserKey);

    const queryString = urlUtils.buildQuery(queryParams);
    const url = `/gway/v1/replenishment/${subscriptionId}/unsubscribe${queryString}`;
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

export default { unsubscribeAutoReplenishment };
