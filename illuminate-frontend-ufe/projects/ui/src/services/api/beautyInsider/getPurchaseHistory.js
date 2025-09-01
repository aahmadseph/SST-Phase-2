import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Purchase+History

function getPurchaseHistory(profileId, options) {
    const biAccountId = userUtils.getBiAccountId();
    const nonBiAccountResponse = { activities: [], meta: { totalItems: 0 } };
    const { useLXSRedemptionHistory = false } = Sephora.configurationSettings;
    let url = '';
    let useLXSRedemptionHistoryCall = false;

    if (options) {
        const {
            sortBy, itemsPerPage, currentPage, groupBy, excludeSamples, purchaseFilter, excludeRewards, includeNonBiUserPurchases
        } = options;

        useLXSRedemptionHistoryCall = useLXSRedemptionHistory && purchaseFilter === 'rewards';

        url = useLXSRedemptionHistoryCall ? `/gway/v1/lxs/${biAccountId}/redemption-history` : `/api/bi/profiles/${profileId}/purchases`;

        const qsParams = {
            sortBy,
            itemsPerPage,
            currentPage,
            groupBy,
            excludeSamples,
            purchaseFilter,
            excludeRewards,
            includeNonBiUserPurchases
        };

        const qs = urlUtils.makeQueryString(qsParams);

        if (qs) {
            url += '?' + qs;
        }
    }

    const headers = {
        'x-requested-source': 'web'
    };

    if (useLXSRedemptionHistoryCall && !biAccountId) {
        return new Promise(resolve => resolve(nonBiAccountResponse));
    }

    return ufeApi.makeRequest(url, { method: 'GET', headers }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getPurchaseHistory;
