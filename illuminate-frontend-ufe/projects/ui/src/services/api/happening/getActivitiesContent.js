import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';

const getActivitiesContent = (
    token,
    {
        language,
        country,
        channel = CHANNELS.RWD,
        storeId,
        zipCode,
        filters,
        activityType, // (events|services)
        eventsOnly = false,
        isRedesignEDPEnabled = true
    }
) => {
    const languageLowerCase = language.toLowerCase();
    let url = `/gway/v1/store-experience/service/event/${activityType}?storeId=${storeId}&zipCode=${zipCode}&channel=${channel}&locale=${languageLowerCase}-${country}&country=${country}&isRedesignEDPEnabled=${isRedesignEDPEnabled}`;

    if (activityType === 'events') {
        url += `&eventsOnly=${eventsOnly}${filters ? `&${filters}` : ''}`;
    }

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(res => (res.errorCode ? Promise.reject(res) : res));
};

export default getActivitiesContent;
