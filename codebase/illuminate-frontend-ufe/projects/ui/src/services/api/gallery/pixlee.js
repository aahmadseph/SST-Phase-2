import ufeApi from 'services/api/ufeApi';
import Crypto from 'utils/Crypto';
import lithiumApi from 'services/api/thirdparty/Lithium';
import GalleryConstants from 'utils/GalleryConstants';

const { khorosInteractions } = GalleryConstants;

function setLoveMedia(assetId, email = '') {
    // eslint-disable-next-line camelcase
    const payload = JSON.stringify({ distinct_user_hash: email });

    return Crypto.createHmacSha1(Sephora.configurationSettings.pixleeSecretKey, payload).then(signature => {
        const url = new URL(`https://distillery.pixlee.co/api/v2/media/${assetId}/vote`);
        url.searchParams.append('api_key', Sephora.configurationSettings.pixleeApiKey);
        lithiumApi.incrementUserScoreForPixlee(khorosInteractions.LOVES_GIVEN, 1);
        const headers = {
            'Content-Type': 'application/json',
            Signature: signature
        };

        return ufeApi.makeRequest(url.href, {
            method: 'POST',
            headers,
            body: payload
        });
    });
}

function deleteLoveMedia(email = '', assetId) {
    // eslint-disable-next-line camelcase
    const payload = JSON.stringify({ distinct_user_hash: email });

    return Crypto.createHmacSha1(Sephora.configurationSettings.pixleeSecretKey, payload).then(signature => {
        const url = new URL(`https://distillery.pixlee.co/api/v2/media/${assetId}/vote`);
        url.searchParams.append('api_key', Sephora.configurationSettings.pixleeApiKey);

        const headers = {
            'Content-Type': 'application/json',
            Signature: signature
        };

        return ufeApi.makeRequest(url.href, { method: 'DELETE', headers, body: payload });
    });
}

function deleteContent(email = '', assetId) {
    // eslint-disable-next-line camelcase
    const payload = JSON.stringify({ distinct_user_hash: email });

    return Crypto.createHmacSha1(Sephora.configurationSettings.pixleeSecretKey, payload).then(signature => {
        const url = new URL(`https://distillery.pixlee.co/api/v2/media/${assetId}/deny`);
        url.searchParams.append('api_key', Sephora.configurationSettings.pixleeApiKey);

        const headers = {
            'Content-Type': 'application/json',
            Signature: signature
        };

        return ufeApi.makeRequest(url.href, {
            method: 'POST',
            headers,
            body: payload
        });
    });
}

export default {
    setLoveMedia,
    deleteLoveMedia,
    deleteContent
};
