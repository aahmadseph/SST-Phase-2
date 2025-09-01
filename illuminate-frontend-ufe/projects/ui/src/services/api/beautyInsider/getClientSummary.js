import ufeApi from 'services/api/ufeApi';
import userUtils from 'utils/User';

// https://jira.sephora.com/wiki/pages/viewpage.action?pageId=141421043

function getClientSummary(userProfileId, includeCampaigns = false) {
    const { isAdvocacyContentfulEnabled = false, useLXSClientSummary = false } = Sephora.configurationSettings;
    const biAccountId = userUtils.getBiAccountId();
    let url;

    if (useLXSClientSummary && !biAccountId) {
        // Prevent LXS Client Summary call if biAccountId is not available
        return Promise.resolve({ clientSummary: {} });
    }

    if (isAdvocacyContentfulEnabled) {
        url = `/api2/bi/profiles/${userProfileId}/clientSummary?includeActiveCampaigns=${includeCampaigns}`;
    } else {
        url = `/api/bi/profiles/${userProfileId}/clientSummary?includeActiveCampaigns=${includeCampaigns}`;
    }

    if (useLXSClientSummary) {
        url = `/gway/v1/lxs/${biAccountId}/clientSummary?userType=Client&includeActiveCampaigns=${includeCampaigns}`;
    }

    const headers = {
        'x-requested-source': 'web'
    };

    return ufeApi.makeRequest(url, { method: 'GET', headers }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getClientSummary;
