import ufeApi from 'services/api/ufeApi';
import accessTokenApi from 'services/api/accessToken/accessToken';

const accessToken = 'AUTH_ACCESS_TOKEN';

function getCreditCardsRewards(token, { loyaltyId }) {
    const url = `/gway/v2/scc-rewards?loyaltyId=${loyaltyId}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                'X-System-Code': 'WEB'
            }
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default accessTokenApi.withAccessToken(getCreditCardsRewards, accessToken);
