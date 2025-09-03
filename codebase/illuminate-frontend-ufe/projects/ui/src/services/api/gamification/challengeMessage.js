import ufeApi from 'services/api/ufeApi';

function challengeMessage(token, body) {
    const sdnApiHost = Sephora.configurationSettings.sdnApiHost;
    const gamificationMessageType = Sephora.configurationSettings.gamificationMessageType || 'GameStatus';
    const url = `${sdnApiHost}/v1/message/${gamificationMessageType}`;

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
        .then(data => data);
}

export default { challengeMessage };
