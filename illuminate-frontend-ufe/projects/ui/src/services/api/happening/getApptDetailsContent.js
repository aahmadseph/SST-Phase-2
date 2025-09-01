import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';

const getApptDetailsContent = (
    token,
    {
        channel = CHANNELS.RWD, country = 'US', reservationCountry = 'US', language = 'en', zipCode, confirmationNumber
    }
) => {
    const locale = `${language.toLowerCase()}-${country}`;
    const url = `/gway/v1/happening/reservations/${confirmationNumber}?channel=${channel}&locale=${locale}&country=${reservationCountry}&zipCode=${zipCode}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(res => (res.errorCode ? Promise.reject(res) : res));
};

export default getApptDetailsContent;
