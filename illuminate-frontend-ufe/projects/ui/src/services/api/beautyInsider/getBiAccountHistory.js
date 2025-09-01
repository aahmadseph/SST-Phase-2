import ufeApi from 'services/api/ufeApi';
import userUtils from 'utils/User';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+BI+Account+History

function getBiAccountHistory(profileId, offset, limit) {
    const { useLXSAccountHistory = false } = Sephora.configurationSettings;
    const biAccountId = userUtils.getBiAccountId();
    const nonBiAccountResponse = { activities: [], meta: { totalItems: 0 } };
    const queryParams = `?offset=${offset}&limit=${limit}`;
    const path = useLXSAccountHistory ? `/gway/v1/lxs/${biAccountId}/account-history` : `/api/bi/profiles/${profileId}/accountHistory`;
    const url = `${path}${queryParams}`;

    const headers = {
        'x-requested-source': 'web'
    };

    if (useLXSAccountHistory && !biAccountId) {
        return new Promise(resolve => resolve(nonBiAccountResponse));
    }

    return ufeApi.makeRequest(url, { method: 'GET', headers }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getBiAccountHistory;
