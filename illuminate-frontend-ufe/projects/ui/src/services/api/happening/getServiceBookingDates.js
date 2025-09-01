import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';

const getServiceBookingDates = (token, {
    language, country, channel = CHANNELS.RWD, bookingId, storeId
}) => {
    const locale = `${language.toLowerCase()}-${country}`;
    const url = `/gway/v2/happening/services/${bookingId}/availability/dates?storeId=${storeId}&channel=${channel}&locale=${locale}&country=${country}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(res => (res.errorCode ? Promise.reject(res) : res));
};

export default getServiceBookingDates;
