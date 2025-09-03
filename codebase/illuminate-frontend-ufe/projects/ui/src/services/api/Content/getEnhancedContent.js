import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';

export function getEnhancedContent({
    path, language, country, userId, isAnonymous
}) {
    const baseUrl = `/api/games/content${path}?ch=web&loc=${language}-${country}&isAnonymous=${isAnonymous}`;
    const url = userId ? `${baseUrl}&userId=${userId}` : baseUrl;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: { 'x-requested-source': CHANNELS.RWD }
        })
        .then(data => data);
}

export default { getEnhancedContent };
