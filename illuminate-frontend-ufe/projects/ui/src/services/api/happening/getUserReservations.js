import ufeApi from 'services/api/ufeApi';
import helpersUtils from 'utils/Helpers';
import { CHANNELS } from 'constants/Channels';

const { fixArrayResponse } = helpersUtils;

const getUserReservations = (token, {
    channel = CHANNELS.RWD, country = 'US', language = 'en', email, status = 'UPCOMING'
}) => {
    const apiVersion = Sephora.configurationSettings.isRequestAppointmentEnabled ? 'v2' : 'v1';
    const locale = `${language.toLowerCase()}-${country}`;
    const url = `/gway/${apiVersion}/happening/reservations/user/${email}?channel=${channel}&locale=${locale}&status=${status}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            const data = fixArrayResponse(response);

            return data.errorCode || data.errors ? Promise.reject(data) : data;
        });
};

export default getUserReservations;
