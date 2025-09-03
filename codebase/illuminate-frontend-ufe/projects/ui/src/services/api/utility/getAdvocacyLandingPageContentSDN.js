/* eslint-disable no-console */
import ufeApi from 'services/api/ufeApi';
import { X_REFERRAL_TTL_TOKEN } from 'components/Campaigns/Referrer/constants';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+Advocacy+Landing+Page+Content+API
async function getAdvocacyLandingPageContentSDN({ referrerCode, campaignCode, refereeUsaId, checksum }) {
    const url = '/gway/v1/campaign-referral/validate';
    const { country } = Sephora.renderQueryParams;

    const requestedTimestamp = new Date().toISOString();

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            referrerCode,
            campaignCode,
            country,
            channel: 'DIGITAL',
            device: 'WEB',
            refereeUsaId,
            checksum,
            requestedTimestamp
        }),
        excludeSephTokens: true
    };

    try {
        const response = await ufeApi.makeRequest(url, options, { returnHeaders: true });

        // If not included in new sdn endpoint just set to null like ATG used to do
        // SDN Renamed the properties for expire and start so I just assign them here to work with the existing JSX code
        response.expirationDate = response.clientExpiryDate || null;
        response.startDate = response.clientPromoStartDate || null;

        // Could come in headers or response body
        const referralToken = response.headers?.get(X_REFERRAL_TTL_TOKEN) || '';

        if (referralToken) {
            response['referralToken'] = referralToken;
        }

        return response.errors ? Promise.reject(response) : response;
    } catch (error) {
        throw error;
    }
}

export default getAdvocacyLandingPageContentSDN;
