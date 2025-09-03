import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';

// https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=ReAnAp.+APIs

const getWaitlistBookingContent = (token, { channel = CHANNELS.RWD, country, language, activityId }) => {
    const locale = `${language.toLowerCase()}-${country}`;
    const url = `/gway/v1/happening/services/waitlist/booking/${activityId}?locale=${locale}&channel=${channel}&country=${country}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(res => (res.errorCode || res.errors ? Promise.reject(res) : res));
};

export default getWaitlistBookingContent;
