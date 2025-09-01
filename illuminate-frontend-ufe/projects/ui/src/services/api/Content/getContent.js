import ufeApi from 'services/api/ufeApi';
import { CHANNELS } from 'constants/Channels';

export function getContent(options) {
    const { path, language, country, config = {} } = options;
    const url = `/api/content${path}?ch=web&loc=${language}-${country}`;

    return ufeApi
        .makeRequest(
            url,
            {
                method: 'GET',
                headers: { 'x-requested-source': CHANNELS.RWD }
            },
            config
        )
        .then(data => data);
}

export default { getContent };
