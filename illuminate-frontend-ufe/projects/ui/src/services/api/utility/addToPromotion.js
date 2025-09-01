/* eslint-disable no-console */
import ufeApi from 'services/api/ufeApi';
import { X_REFERRAL_TTL_TOKEN } from 'components/Campaigns/Referrer/constants';

// https://confluence.sephora.com/wiki/display/ILLUMINATE/Get+Advocacy+Landing+Page+Content+API
async function addToPromotion(payload, referralToken) {
    const url = '/gway/v1/campaign-referral/addToPromotion';
    const { country, language } = Sephora.renderQueryParams;

    const {
        referrerCode, campaignCode, refereeUsaId, checksum, refereeEmail, refereeFirstName, refereeLastName, registrationDate
    } = payload;

    const requestedTimestamp = new Date().toISOString();

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            [X_REFERRAL_TTL_TOKEN]: referralToken
        },
        body: JSON.stringify({
            referrerCode,
            campaignCode,
            country,
            channel: 'DIGITAL',
            device: 'WEB',
            refereeUsaId,
            checksum,
            requestedTimestamp,
            refereeEmail,
            refereeFirstName,
            refereeLastName,
            language,
            registrationDate
        }),
        excludeSephTokens: true // No seph or x api key
    };

    try {
        const data = await ufeApi.makeRequest(url, options);

        return data;
    } catch (error) {
        throw error;
    }
}

export default addToPromotion;
