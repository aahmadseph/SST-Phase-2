import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';

function getBeautyOfferData() {
    const url = '/api/util/content-seo/beauty-offers';

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: { 'x-requested-source': CHANNELS.RWD }
        })
        .then(data => {
            if (data.errorCode) {
                Promise.reject(data);
            }

            const { zone1, ...restOfData } = data;

            return {
                regions: { zoneOne: zone1 },
                ...restOfData
            };
        });
}

export default { getBeautyOfferData };
