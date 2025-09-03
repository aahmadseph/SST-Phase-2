import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';

const getApptConfirmationContent = (
    token,
    {
        channel = CHANNELS.RWD,
        country,
        language,
        activityType, // (events|services)
        activityId,
        zipCode
    }
) => {
    const locale = `${language.toLowerCase()}-${country}`;
    const zipCodeParam = zipCode ? `&zipCode=${zipCode}` : '';
    const url = `/gway/v2/happening/${activityType}/confirmation/${activityId}?locale=${locale}&channel=${channel}&country=${country}${zipCodeParam}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(res => (res.errorCode ? Promise.reject(res) : res));
};

export default getApptConfirmationContent;
