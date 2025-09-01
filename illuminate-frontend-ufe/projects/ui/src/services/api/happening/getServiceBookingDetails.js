import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';

const getServiceBookingDetails = (
    token,
    {
        language, country, channel = CHANNELS.RWD, activityId, zipCode, latitude, longitude, includeServiceInfo = true, selectedStoreId
    }
) => {
    const locale = `${language.toLowerCase()}-${country}`;
    const searchParams = latitude && longitude ? `latitude=${latitude}&longitude=${longitude}` : `zipCode=${zipCode}`;
    const selectedStoreIdParam = selectedStoreId ? `&selectedStoreId=${selectedStoreId}` : '';
    const url = `/gway/v2/happening/services/${activityId}/booking/stores?${searchParams}&channel=${channel}&locale=${locale}&country=${country}&includeServiceInfo=${includeServiceInfo}${selectedStoreIdParam}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(res => (res.errorCode || res.errors ? Promise.reject(res) : res));
};

export default getServiceBookingDetails;
