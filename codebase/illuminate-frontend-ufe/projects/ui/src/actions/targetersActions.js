import Storage from 'utils/localStorage/Storage';
import localeUtils from 'utils/LanguageLocale';
import reduxActionUtils from 'utils/redux/Actions';
import profileApi from 'services/api/profile';

const { merge } = reduxActionUtils;
const TARGETERS_CACHE_KEY_PREFIX = 'targetersCache';
const TARGETERS_CACHE_TIME = Storage.MINUTES * 10;

const createCacheKey = targeterName => {
    const locale = localeUtils.getCurrentLanguageCountryCode();
    const cacheKey = `${TARGETERS_CACHE_KEY_PREFIX}-${locale}-${targeterName}`;

    return cacheKey;
};

const getTargeterCache = function (targeterName) {
    const cacheKey = createCacheKey(targeterName);
    const item = Storage.session.getItem(cacheKey);

    return item;
};

const getTargetersArray = function () {
    if (!Sephora.targetersToInclude || Sephora.targetersToInclude === '?') {
        return [];
    }

    return decodeURIComponent(Sephora.targetersToInclude)
        .replace(/(\?|&)includeTargeters=/, '')
        .split(',');
};

const setTargeterCache = (targeterName, targeterValue) => {
    const cacheKey = createCacheKey(targeterName);
    Storage.session.setItem(cacheKey, targeterValue, TARGETERS_CACHE_TIME);
};

const flushTargeterCache = () => () => {
    Storage.session.removeAllBy(key => key.indexOf(TARGETERS_CACHE_KEY_PREFIX) === 0);
};

const requestAndSetTargeters =
    (force = false) =>
        dispatch => {
            const requiredTargeterNames = getTargetersArray();

            if (requiredTargeterNames.length === 0 || Sephora.configurationSettings?.isTargetersATGSunset) {
                return;
            }

            // Flush targeter cache if forced call is received
            if (force) {
                dispatch(flushTargeterCache());
            }

            const cachedTargeters = requiredTargeterNames.reduce((acc, targeterName) => {
                const cached = getTargeterCache(targeterName);

                if (cached) {
                    acc[targeterName] = cached;
                }

                return acc;
            }, {});

            const canBeFilledByCache = !force && requiredTargeterNames.length === Object.keys(cachedTargeters).length;

            // Set targeters into the redux store if we have them all in cache
            if (canBeFilledByCache) {
                dispatch(merge('targeters', 'results', { targeterResult: cachedTargeters }));

                return;
            }

            profileApi.getTargetersContent(requiredTargeterNames).then(response => {
                if (response.responseStatus === 200 && response.targeterResult) {
                    const { targeterResult } = response;

                    for (const targeterName in targeterResult) {
                        if (Object.prototype.hasOwnProperty.call(targeterResult, targeterName)) {
                            setTargeterCache(targeterName, targeterResult[targeterName]);
                        }
                    }

                    dispatch(merge('targeters', 'results', { targeterResult }));
                } else {
                    dispatch(merge('targeters', 'results', {}));
                }
            });
        };

export default {
    requestAndSetTargeters,
    flushTargeterCache
};
