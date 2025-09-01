import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';

function updateReplenishSubscriptions(subscriptionData) {
    const { sdnUfeAPIUserKey } = Sephora.configurationSettings;
    const { country, language } = Sephora.renderQueryParams;
    const queryParams = new Map();
    queryParams.set('apikey', sdnUfeAPIUserKey);
    const queryString = urlUtils.buildQuery(queryParams);
    const url = `/gway/v1/replenishment/${subscriptionData.subscriptionId}${queryString}`;
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Site-Locale': country,
            'Site-Language': language
        },
        body: JSON.stringify({
            ...subscriptionData
        })
    };

    return ufeApi.makeRequest(url, options).then(data => (data.errors ? Promise.reject(data) : data));
}

export default { updateReplenishSubscriptions };
