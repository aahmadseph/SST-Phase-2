import Empty from 'constants/empty';
import Storage from 'utils/localStorage/Storage';
import dateUtils from 'utils/Date';
import ContentConstants from 'constants/content';

const { COMPONENT_TYPES } = ContentConstants;

const TWENTY_FOUR_HOURS_IN_MILLISECONDS = 86400000;
const P13N_DATA = 'P13N_DATA';

const createCacheKeyPrefix = () => {
    const { country, language } = Sephora.renderQueryParams;

    return `${P13N_DATA}_${country}-${language}`;
};

const setPersonalizationKey = function (context) {
    return `${createCacheKeyPrefix()}_${context}`;
};

const setPersonalizationCache = function (data) {
    data?.forEach(item => {
        // Fallback to `item.context` helps in scenarios where p13n is null
        // such is the case with NBC response data.
        const key = setPersonalizationKey(item?.p13n?.context || item.context);
        const oneDay = new Date().getTime() + TWENTY_FOUR_HOURS_IN_MILLISECONDS;
        const endDate = item.p13n?.endDate && new Date(item?.p13n?.endDate).getTime();
        const expireDate = endDate < oneDay ? item?.p13n?.endDate : TWENTY_FOUR_HOURS_IN_MILLISECONDS;

        const expiry = getExpirationDate(item, expireDate);

        if (!Storage.local.getItem(key, false, true)) {
            Storage.local.setItem(key, item, expiry);
        }
    });
};

const updatePersonalizationCache = function (data) {
    data?.forEach(item => {
        const key = setPersonalizationKey(item?.p13n?.context);
        const oneDay = new Date().getTime() + TWENTY_FOUR_HOURS_IN_MILLISECONDS;
        const endDate = item.p13n?.endDate && new Date(item?.p13n?.endDate).getTime();
        const expireDate = endDate < oneDay ? item?.p13n?.endDate : TWENTY_FOUR_HOURS_IN_MILLISECONDS;

        const expiry = getExpirationDate(item, expireDate);

        Storage.local.setItem(key, item, expiry);
    });
};

const setPersonalizationPlaceholder = context => {
    const key = setPersonalizationKey(context);

    if (!Storage.local.getItem(key, false, true)) {
        Storage.local.setItem(key, { context }, TWENTY_FOUR_HOURS_IN_MILLISECONDS);
    }
};

const getExpirationDate = (item, expireDate) => {
    if (item?.p13n?.isAbTest) {
        return item?.p13n?.abTestEndDate;
    }

    if (Sephora.configurationSettings.p13nCacheExpirationTime) {
        return Sephora.configurationSettings.p13nCacheExpirationTime * 60 * 1000;
    }

    return expireDate;
};

const getAllPersonalizedCache = function () {
    const cachedData = [];
    const cacheKeyPrefix = createCacheKeyPrefix();
    Object.keys(localStorage)
        .filter(key => key.startsWith(cacheKeyPrefix))
        .forEach(key => {
            const cache = Storage.local.getItem(key, false, true);

            if (cache) {
                cachedData.push(cache);
            }
        });

    return cachedData;
};

const filteredCache = function (personalization) {
    if (!personalization) {
        return null;
    }

    let contextToReturn;
    const cachedData = getAllPersonalizedCache();
    const cachedItem = cachedData.filter(data => data.context === personalization.context)?.[0];

    if (cachedItem) {
        if (cachedItem.p13n?.abTestId && personalization?.activeAbTestIds?.indexOf(cachedItem.p13n.abTestId) === -1) {
            contextToReturn = personalization.context;
        }
    } else {
        contextToReturn = personalization.context;
    }

    if (contextToReturn) {
        Storage.local.removeItem(setPersonalizationKey(contextToReturn));
    }

    return contextToReturn;
};

const getContextIdsToUpdate = items => {
    const checkItemPersonalizationIsEnabled = item => {
        return item.personalization && item.personalization.isEnabled;
    };

    const filterCachedAndCollectContextId = (item, contextIdsCollection) => {
        const filteredItem = filteredCache(item.personalization);

        if (filteredItem) {
            contextIdsCollection.push(item.personalization.context);
        }
    };

    return items.reduce(
        (contextIds, item) => {
            const isBannerListType = item.type === COMPONENT_TYPES.BANNER_LIST;
            const isItemPersonalizationEnabled = checkItemPersonalizationIsEnabled(item);
            let skipPersonalizationItem = false;

            if (isItemPersonalizationEnabled && item.personalization?.isBirthdayGift) {
                filterCachedAndCollectContextId(item, contextIds.bdContextIds);
                skipPersonalizationItem = true;
            }

            if (isItemPersonalizationEnabled && item.personalization?.isMABEnabled) {
                filterCachedAndCollectContextId(item, contextIds.mabContextIds);
                skipPersonalizationItem = true;
            }

            if (isItemPersonalizationEnabled && isBannerListType && item.personalization?.isNBCEnabled) {
                filterCachedAndCollectContextId(item, contextIds.nbcContextIds);
                skipPersonalizationItem = true;
            }

            if (isItemPersonalizationEnabled && !dateUtils.isDataExpired(item.personalization?.endDate) && !skipPersonalizationItem) {
                filterCachedAndCollectContextId(item, contextIds.p13nContextIds);
            }

            (item.items || Empty.Array)
                .filter(
                    ({ personalization }) =>
                        personalization && personalization.isEnabled && personalization.context && !dateUtils.isDataExpired(personalization?.endDate)
                )
                .forEach(childItem => {
                    filterCachedAndCollectContextId(childItem, contextIds.p13nContextIds);
                });

            return contextIds;
        },
        { p13nContextIds: [], nbcContextIds: [], bdContextIds: [], mabContextIds: [] }
    );
};

const getPersonalizationCache = function (context) {
    return Storage.local.getItem(setPersonalizationKey(context));
};

export default {
    getContextIdsToUpdate,
    setPersonalizationCache,
    setPersonalizationKey,
    getPersonalizationCache,
    filteredCache,
    getAllPersonalizedCache,
    setPersonalizationPlaceholder,
    updatePersonalizationCache
};
