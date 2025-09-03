import ufeApi from 'services/api/ufeApi';

export default function getModal({ country, channel, language, sid }) {
    return ufeApi.makeRequest(`/api/content/modal/${sid}?ch=${channel}&loc=${language}-${country}`, {
        method: 'GET'
    });
}
