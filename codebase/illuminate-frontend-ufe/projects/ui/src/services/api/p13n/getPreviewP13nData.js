import ufeApi from 'services/api/ufeApi';
import Empty from 'constants/empty';

function getPreviewP13nData() {
    const apikey = Sephora.configurationSettings.sdnUfeAPIUserKey;
    const host = Sephora.configurationSettings.sdnDomainBaseUrl;

    const url = `${host}/v1/p13n/content/preview`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
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

export default getPreviewP13nData;
