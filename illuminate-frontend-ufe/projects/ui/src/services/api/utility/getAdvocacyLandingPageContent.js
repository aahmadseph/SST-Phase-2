import ufeApi from 'services/api/ufeApi';
import { X_REFERRAL_TTL_TOKEN } from 'components/Campaigns/Referrer/constants';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+Advocacy+Landing+Page+Content+API

function getAdvocacyLandingPageContent({ referrerCode, campaignCode, userId, checksum }, isRwdAdvocacy = false) {
    const params = {};
    let url;

    if (userId) {
        params.userId = userId;
    }

    if (Sephora.configurationSettings.isReferralShareLinkEnhancement && checksum) {
        params.checksum = checksum;
    }

    const extraParams = new URLSearchParams(params);

    if (isRwdAdvocacy) {
        url = `/api2/campaign/share/${referrerCode}/${campaignCode}?${extraParams.toString()}`;
    } else {
        url = `/api/campaign/share/${referrerCode}/${campaignCode}?${extraParams.toString()}`;
    }

    return (
        ufeApi
            .makeRequest(url, {}, { returnHeaders: true })
            // Extract headers from the data, no need to pass it down
            .then(({ headers, ...data }) => {
                // Extract the token from headers and include it in the response data
                const referralToken = headers?.get(X_REFERRAL_TTL_TOKEN);

                if (referralToken) {
                    data['referralToken'] = referralToken;
                }

                return data.errorCode ? Promise.reject(data) : data;
            })
    );
}

export default getAdvocacyLandingPageContent;
