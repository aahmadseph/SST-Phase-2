import ufeApi from 'services/api/ufeApi';
import headerUtils from 'utils/Headers';
import { CHANNELS } from 'constants/Channels';

const { userXTimestampHeader } = headerUtils;

function acknowledgeGameCompletion(token, { gameId, loyaltyId }) {
    const sdnApiHost = Sephora.configurationSettings.sdnApiHost;
    const url = `${sdnApiHost}/v1/game/${gameId}/user/${loyaltyId}/completion/acknowledge`;
    const timeStamp = userXTimestampHeader()['x-timestamp'];

    return ufeApi
        .makeRequest(url, {
            method: 'PUT',
            headers: {
                'x-source': CHANNELS.RWD,
                'X-Request-Timestamp': timeStamp,
                authorization: `Bearer ${token}`
            }
        })
        .then(data => data);
}

export default { acknowledgeGameCompletion };
