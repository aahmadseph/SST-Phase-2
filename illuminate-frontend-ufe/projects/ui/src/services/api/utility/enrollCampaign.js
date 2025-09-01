import ufeApi from 'services/api/ufeApi';
import { X_REFERRAL_TTL_TOKEN } from 'components/Campaigns/Referrer/constants';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/RMS+enrollment+API
function enrollCampaign(payload, referralToken, isRwdAdvocacy = false) {
    let url;

    if (isRwdAdvocacy) {
        url = '/api2/campaign/enroll';
    } else {
        url = '/api/campaign/enroll/';
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            headers: { [X_REFERRAL_TTL_TOKEN]: referralToken },
            body: JSON.stringify(payload)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default enrollCampaign;
