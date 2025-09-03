import ufeApi from 'services/api/ufeApi';
import Empty from 'constants/empty';

const path = '/gway/v1/p13n/content';

function getP13nBirthdayData({
    channel, country, language, atgId, contextEntryIds = Empty.Array, zipCode
}) {
    const apikey = Sephora.configurationSettings.sdnUfeAPIUserKey;

    const [entryId] = contextEntryIds;
    let queryParams = `/${entryId}?atg_id=${atgId}&channel=${channel}&locale=${language}-${country}`;

    if (zipCode) {
        queryParams += `&zipcode=${zipCode}`;
    }

    const url = `${path}${queryParams}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                Target: 'gifts-rewards',
                'x-api-key': apikey
            }
        })
        .then(({ data = Empty.Array, errorCode }) => {
            if (errorCode) {
                return Promise.reject(data);
            }

            return data;
        });
}

export default getP13nBirthdayData;
