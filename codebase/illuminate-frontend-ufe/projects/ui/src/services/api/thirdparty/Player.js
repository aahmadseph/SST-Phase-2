/* eslint-disable no-undef */
import loader from 'utils/LoadScripts';
import localeUtils from 'utils/LanguageLocale';

const ACCOUNT_ID = 6072792324001;
const PLAYER_ID = 'default'; // Use this PLAYER_ID '9eD9MuoF' for debug and test purposes
const PLAYER_URL = `//players.brightcove.net/${ACCOUNT_ID}/${PLAYER_ID}_default/index.min.js`;
const PLAYER_LOAD_TIMEOUT = 15000;

export default {
    getByVideoId: videoId => {
        return new Promise((resolve, reject) => {
            const loadTimeout = setTimeout(() => {
                const getText = localeUtils.getLocaleResourceFile('services/api/thirdparty/locales', 'messages');
                const message = getText('playerLoadTimeoutRejectMessage', [PLAYER_LOAD_TIMEOUT]);
                reject(message);
            }, PLAYER_LOAD_TIMEOUT);

            loader.loadScripts([PLAYER_URL], () => {
                if (videoId) {
                    clearTimeout(loadTimeout);

                    if (videojs) {
                        const initializedPlayers = videojs.getPlayers();

                        if (initializedPlayers && initializedPlayers[videoId]) {
                            const player = videojs.getPlayer(videoId);
                            resolve(player);
                        } else {
                            // eslint-disable-next-line prefer-promise-reject-errors
                            reject('Player Instance is not rendered yet');
                        }
                    } else {
                        // eslint-disable-next-line prefer-promise-reject-errors
                        reject('Player is not ready');
                    }
                }
            });
        });
    },
    getPlayerVideoId: videoId => {
        const isNumericRegex = /^[0-9]*$/;
        const result = isNumericRegex.test(videoId) ? videoId : `ref:${videoId}`;

        return result;
    },
    ACCOUNT_ID,
    PLAYER_ID,
    PLAYER_URL
};
