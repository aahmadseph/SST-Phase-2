import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';

const getActivityEDPContent = (
    token,
    {
        language,
        country,
        activityType, // (events|services)
        activityId,
        channel = CHANNELS.RWD,
        zipCode,
        storeId,
        email
    }
) => {
    const locale = `${language.toLowerCase()}-${country}`;
    const eventsEDPParams = activityType === 'events' ? `&zipCode=${zipCode}&storeId=${storeId}${email ? `&userEmail=${email}` : ''}` : '';
    const url = `/gway/v2/happening/${activityType}/${activityId}?channel=${channel}&locale=${locale}&country=${country}${eventsEDPParams}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(res => (res.errorCode ? Promise.reject(res) : res));
};

export default getActivityEDPContent;
