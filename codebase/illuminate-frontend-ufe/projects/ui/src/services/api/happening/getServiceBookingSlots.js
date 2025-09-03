import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';

const getServiceBookingSlots = (token, {
    bookingId, storeId, resourceIds, startDateTime, endDateTime, channel = CHANNELS.RWD
}) => {
    const resourceIdsParam = resourceIds ? `&resourceIds=${Array.isArray(resourceIds) ? resourceIds.join() : resourceIds}` : '';
    const url = `/gway/v2/happening/services/${bookingId}/availability/slots?locationId=${storeId}${resourceIdsParam}&startDateTime=${startDateTime}&endDateTime=${endDateTime}&channel=${channel}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(res => (res.errorCode ? Promise.reject(res) : res));
};

export default getServiceBookingSlots;
