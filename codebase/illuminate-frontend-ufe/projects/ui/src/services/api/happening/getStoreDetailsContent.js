import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';

const getStoreDetailsContent = (token, {
    language, country, activityId, channel = CHANNELS.RWD, isRedesignEDPEnabled = true
}) => {
    const languageLowerCase = language.toLowerCase();
    const url = `/gway/v1/happening/stores/${activityId}?channel=${channel}&locale=${languageLowerCase}-${country}&country=${country}&isRedesignEDPEnabled=${isRedesignEDPEnabled}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(res => (res.errorCode ? Promise.reject(res) : res));
};

export default getStoreDetailsContent;
