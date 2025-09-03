import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';

const deleteApptReservation = (
    token,
    {
        activityType, // (events|services)
        confirmationNumber,
        channel = CHANNELS.RWD
    }
) => {
    const url = `/gway/v2/happening/${activityType}/reservations/${confirmationNumber}?channel=${channel}`;

    return ufeApi
        .makeRequest(url, {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(res => (res.errorCode ? Promise.reject(res) : res));
};

export default deleteApptReservation;
