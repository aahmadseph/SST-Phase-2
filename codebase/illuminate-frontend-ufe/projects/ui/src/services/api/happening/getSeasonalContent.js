import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';

const getSeasonalContent = (token, { language, country = 'US', channel = CHANNELS.RWD, zipCode }) => {
    const locale = `${language.toLowerCase()}-${country}`;
    const url = `/gway/v2/happening/services/seasonal?country=${country}&channel=${channel}&locale=${locale}&zipCode=${zipCode}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(res => (res.errorCode ? Promise.reject(res) : res));
};

export default getSeasonalContent;
