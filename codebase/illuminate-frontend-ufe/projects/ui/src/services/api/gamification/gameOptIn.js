import ufeApi from 'services/api/ufeApi';
import headerUtils from 'utils/Headers';
import localeUtils from 'utils/LanguageLocale';
import { CHANNELS } from 'constants/Channels';

const { userXTimestampHeader } = headerUtils;

function gameOptIn(token, { gameId, loyaltyId }) {
    const sdnApiHost = Sephora.configurationSettings.sdnApiHost;
    const url = `${sdnApiHost}/v1/game/${gameId}/user/${loyaltyId}/opt-in`;
    const timeStamp = userXTimestampHeader()['x-timestamp'];

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            headers: {
                'x-country-code': localeUtils.getCurrentCountry().toUpperCase(),
                'x-source': CHANNELS.RWD,
                'X-Request-Timestamp': timeStamp,
                authorization: `Bearer ${token}`
            }
        })
        .then(data => data);
}

export default { gameOptIn };
