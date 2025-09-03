import ufeApi from 'services/api/ufeApi';
import getAuthDataId from 'services/api/utility/getAuthDataId';
import userUtils from 'utils/User';

function getPASData(contextIds, apiEndpoint) {
    const { country, channel, language } = Sephora.renderQueryParams;
    const defaultSAZipCode = userUtils.getDefaultSAZipCode();
    const defaultSACountryCode = userUtils.getDefaultSACountryCode();

    const params = new URLSearchParams({
        context: contextIds.join(','),
        biId: getAuthDataId(),
        ch: channel,
        loc: `${language}-${country}`
    });

    const url = `/gway${apiEndpoint}?${params}`;

    const headers = {
        defaultSACountryCode,
        defaultSAZipCode
    };

    return ufeApi.makeRequest(url, {
        method: 'GET',
        headers
    }).then(data => (data.errorCode || data.errors ? Promise.reject(data) : data));
}

export default getPASData;
