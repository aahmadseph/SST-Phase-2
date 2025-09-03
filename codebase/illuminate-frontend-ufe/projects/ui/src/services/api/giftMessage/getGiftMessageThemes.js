import ufeApi from 'services/api/ufeApi';

function getGiftMessageThemes({ channel, sid, language, country }) {
    const url = `/api/content/giftMessages/${sid}?ch=${channel}&loc=${language}-${country}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET'
        })
        .then(data => data);
}

export default getGiftMessageThemes;
