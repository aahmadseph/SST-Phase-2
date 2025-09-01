import ufeApi from 'services/api/ufeApi';
import headerUtils from 'utils/Headers';

const { userXTimestampHeader } = headerUtils;

function getDetailedClientSummary(token, biAccountId) {
    const sdnApiHost = Sephora.configurationSettings.sdnApiHost;
    const url = `${sdnApiHost}/v2/loyalty-point-mgmt/summary/${biAccountId}/detailed`;
    const timeStamp = userXTimestampHeader()['x-timestamp'];

    const headers = {
        'X-Source': 'WEB',
        'X-Tenant-Id': 'SEPHORA',
        'X-Request-Timestamp': timeStamp,
        authorization: `Bearer ${token}`
    };

    return ufeApi.makeRequest(url, { method: 'GET', headers }).then(data => data);
}

export default getDetailedClientSummary;
