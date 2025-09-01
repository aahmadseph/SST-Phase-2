import ufeApi from 'services/api/ufeApi';
import cookieUtils from 'utils/Cookies';
import { CHANNELS } from 'constants/Channels';

const AKAMWEB = 'akamweb';

const postApptReservation = (
    token,
    {
        channel = CHANNELS.RWD,
        country,
        language,
        activityType, // (events|services)
        activityId,
        payload
    }
) => {
    const locale = `${language.toLowerCase()}-${country}`;
    const url = `/gway/v2/happening/${activityType}/${activityId}/reservation?channel=${channel}&locale=${locale}&country=${country}`;
    const akamwebCookie = activityType === 'services' ? cookieUtils.read(AKAMWEB) : null;

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            headers: {
                authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...(akamwebCookie && { akamweb: akamwebCookie })
            },
            body: JSON.stringify(payload)
        })
        .then(res => (res.errorCode ? Promise.reject(res) : res));
};

export default postApptReservation;
