/* eslint-disable no-console */
(function () {
    const P13N_DATA = 'P13N_DATA';
    const COMPONENT_TYPES = {
        BANNER_LIST: 'BannerList',
        BANNER: 'Banner'
    };

    const services = Sephora.Util.InflatorComps.services;
    services.p13nData = { data: [] };

    const createCacheKeyPrefix = () => {
        const { country, language } = Sephora.renderQueryParams;

        return `${P13N_DATA}_${country}-${language}`;
    };

    const setPersonalizationKey = function (context) {
        return `${createCacheKeyPrefix()}_${context}`;
    };

    const getAllPersonalizedCache = function () {
        const cachedData = [];
        const cacheKeyPrefix = createCacheKeyPrefix();
        Object.keys(window.localStorage)
            .filter(key => key.startsWith(cacheKeyPrefix))
            .forEach(key => {
                const cache = Sephora.Util.getCache(key, true);

                if (cache) {
                    cachedData.push(cache);
                }
            });

        return cachedData;
    };

    const filteredCache = function (personalization = {}) {
        let contextToReturn;
        const cachedData = getAllPersonalizedCache();
        const cachedItem = cachedData.find(data => data.data?.context === personalization?.context);

        if (cachedItem) {
            if (cachedItem.p13n?.abTestId && personalization?.activeAbTestIds?.indexOf(cachedItem.p13n.abTestId) === -1) {
                contextToReturn = personalization.context;
            }
        } else {
            contextToReturn = personalization.context;
        }

        if (contextToReturn) {
            window.localStorage.removeItem(setPersonalizationKey(contextToReturn));
        }

        return contextToReturn;
    };

    const getContextIdsToUpdate = function (items) {
        const isDataExpired = date => {
            if (date) {
                return new Date(date).getTime() < new Date().getTime();
            }

            return false;
        };

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

                if (isItemPersonalizationEnabled && !isDataExpired(item.personalization?.endDate) && !skipPersonalizationItem) {
                    filterCachedAndCollectContextId(item, contextIds.p13nContextIds);
                }

                (item.items || [])
                    .filter(
                        ({ personalization }) =>
                            personalization && personalization.isEnabled && personalization.context && !isDataExpired(personalization.endDate)
                    )
                    .forEach(childItem => {
                        filterCachedAndCollectContextId(childItem, contextIds.p13nContextIds);
                    });

                return contextIds;
            },
            { p13nContextIds: [], nbcContextIds: [], bdContextIds: [], mabContextIds: [] }
        );
    };

    const cachedData = getAllPersonalizedCache();

    const dispatchP13NEvent = () => {
        services.loadEvents.P13NDataLoaded = true;
        Sephora.Util.Perf.report('P13NData Loaded');
        window.dispatchEvent(new CustomEvent('P13NDataLoaded', { detail: {} }));
    };

    const fetchP13NData = async function ({
        entryIds, atgId, biId, country, channel, language, zipCode
    }) {
        const path = '/api/content/p13n/';

        let queryParams = `?atgId=${atgId}&context=${entryIds}&ch=${channel}&loc=${language}-${country}`;

        if (biId) {
            queryParams += `&biId=${biId}`;
        }

        if (zipCode) {
            queryParams += `&zipcode=${zipCode}`;
        }

        const url = `${path}${queryParams}`;

        try {
            const timeout = 10000;
            const response = await fetch(url, {
                signal: AbortSignal.timeout(timeout)
            });
            const { data = [] } = await response.json();

            return data;
        } catch (error) {
            console.error('Error getting P13N data:', error);
        }

        return [];
    };

    const fetchP13nNbcData = async function ({
        entryIds, atgId, country, channel, language, zipCode
    }) {
        const sdnUfeAPIUserKey = Sephora.sdnUfeAPIUserKey;

        // Prevent calling NBC endpoint if no SDN api key is available
        if (!sdnUfeAPIUserKey) {
            return [];
        }

        const path = '/gway/v1/p13n/content';

        // TODO: Prevent sending a single context ID when NBC supports more than one
        const [entryId] = entryIds;

        let queryParams = `/${entryId}?atg_id=${atgId}&channel=${channel}&locale=${language}-${country}`;

        if (zipCode) {
            queryParams += `&zipcode=${zipCode}`;
        }

        const url = `${path}${queryParams}`;

        try {
            const timeout = 2000;
            const response = await fetch(url, {
                signal: AbortSignal.timeout(timeout),
                headers: {
                    'x-api-key': sdnUfeAPIUserKey
                }
            });

            const { data = [] } = await response.json();

            return data;
        } catch (error) {
            console.error('Error getting NBC data:', error);
        }

        return [];
    };

    const fetchP13nMABData = async function ({
        entryIds, atgId, country, channel, language, zipCode
    }) {
        const sdnUfeAPIUserKey = Sephora.sdnUfeAPIUserKey;

        // Prevent calling MAB endpoint if no SDN api key is available
        if (!sdnUfeAPIUserKey) {
            return [];
        }

        const path = '/gway/v1/p13n/content/dynamic';

        const [entryId] = entryIds;

        let queryParams = `/${entryId}?atg_id=${atgId}&channel=${channel}&locale=${language}-${country}`;

        if (zipCode) {
            queryParams += `&zipcode=${zipCode}`;
        }

        const url = `${path}${queryParams}`;

        try {
            const timeout = 2000;
            const response = await fetch(url, {
                signal: AbortSignal.timeout(timeout),
                headers: {
                    'x-api-key': sdnUfeAPIUserKey
                }
            });

            const { data = [] } = await response.json();

            return data;
        } catch (error) {
            console.error('Error getting MAB data:', error);
        }

        return [];
    };

    const fetchP13nBirthdayData = async function ({
        entryIds, atgId, country, channel, language, zipCode
    }) {
        const sdnUfeAPIUserKey = Sephora.sdnUfeAPIUserKey;

        // Prevent calling BD endpoint if no SDN api key is available
        if (!sdnUfeAPIUserKey) {
            return [];
        }

        const path = '/gway/v1/p13n/content';

        const [entryId] = entryIds;

        let queryParams = `/${entryId}?atg_id=${atgId}&channel=${channel}&locale=${language}-${country}`;

        if (zipCode) {
            queryParams += `&zipcode=${zipCode}`;
        }

        const url = `${path}${queryParams}`;

        try {
            const timeout = 10000;
            const response = await fetch(url, {
                signal: AbortSignal.timeout(timeout),
                headers: {
                    Target: 'gifts-rewards',
                    'x-api-key': sdnUfeAPIUserKey
                }
            });

            const { data = [] } = await response.json();

            return data;
        } catch (error) {
            console.error('Error getting Birthday data:', error);
        }

        return [];
    };

    const readCookie = key => {
        if (typeof document === 'undefined' && typeof global.document === 'undefined') {
            return null;
        }

        const cookies = ('' + global.document.cookie).split('; ');

        for (let i = 0; i < cookies.length; ++i) {
            const currentCookie = cookies[i].split(/\=(.+)/).filter(Boolean);

            if (currentCookie.length !== 2) {
                /* eslint no-continue: 0 */
                continue;
            }

            const name = global.decodeURIComponent(currentCookie[0]);

            if (key === name) {
                return global.decodeURIComponent(currentCookie[1]);
            }
        }

        return null;
    };

    const setCookie = (key, value) => {
        if (typeof document === 'undefined' && typeof global.document === 'undefined') {
            return null;
        }

        document.cookie = `${key}=${value};domain=sephora.com`;

        return null;
    };

    const fetchNewP13nData = async function () {
        const apikey = Sephora.sdnUfeAPIUserKey;
        const url = `${Sephora.sdnDomainBaseUrl}/v1/p13n/content/preview`;
        try {
            const timeout = 2000;
            const response = await fetch(url, {
                signal: AbortSignal.timeout(timeout),
                credentials: 'include',
                headers: {
                    'x-api-key': apikey
                }
            });

            const { data = [] } = await response.json();

            return data;
        } catch (error) {
            console.error('Error getting NBC data:', error);
        }

        return [];
    };

    const getPersonalizationData = async function ({
        nbcContextIds, p13nContextIds, bdContextIds, mabContextIds, atgId, biId, zipCode
    }) {
        const { country, channel, language } = Sephora.renderQueryParams;
        let personalizationData = [];
        const customerAttributes = JSON.parse(window?.sessionStorage.getItem('cust360'))?.data;

        if (nbcContextIds.length) {
            const nbcData = await fetchP13nNbcData({
                entryIds: nbcContextIds,
                atgId,
                country,
                channel,
                language,
                zipCode
            });

            if (nbcData?.length) {
                personalizationData = personalizationData.concat(nbcData);
            }
        }

        if (mabContextIds.length) {
            const mabData = await fetchP13nMABData({
                entryIds: mabContextIds,
                atgId,
                country,
                channel,
                language,
                zipCode
            });

            if (mabData?.length) {
                personalizationData = personalizationData.concat(mabData);
            }
        }

        if (bdContextIds.length) {
            const bdData = await fetchP13nBirthdayData({
                entryIds: bdContextIds,
                atgId,
                country,
                channel,
                language,
                zipCode
            });

            if (bdData?.length) {
                personalizationData = personalizationData.concat(bdData);
            }
        }

        if (readCookie('prv') && customerAttributes && customerAttributes?.atg_id) {
            const customerData = {
                ...customerAttributes,
                context: p13nContextIds,
                zipCode: zipCode
            };
            setCookie('cust360', btoa(JSON.stringify(customerData)));
            const previewData = await fetchNewP13nData();

            if (previewData?.length) {
                personalizationData = personalizationData.concat(previewData);
            }
        } else {
            if (p13nContextIds.length) {
                const p13nData = await fetchP13NData({
                    entryIds: p13nContextIds,
                    atgId,
                    biId,
                    country,
                    channel,
                    language,
                    zipCode
                });

                if (p13nData?.length) {
                    personalizationData = personalizationData.concat(p13nData);
                }
            }
        }

        if (!personalizationData.length) {
            dispatchP13NEvent();

            return;
        }

        const previewCookie = Sephora.Util.cookieStore()['prv'];

        if (previewCookie) {
            services.previewCookie = true;
        }

        if (cachedData.length) {
            const data = [];
            cachedData.forEach(item => data.push(item.data));
            services.p13nData.data = [...personalizationData, ...data];
        } else {
            services.p13nData.data = personalizationData;
        }

        dispatchP13NEvent();
    };

    const biId = Sephora.Util.getItemFromLocalStorage('biAccountId');
    const atgId = Sephora.Util.getItemFromLocalStorage('profileId');

    const userDataFromLocalStorage = Sephora.Util.getItemFromLocalStorage('userData');
    const userData = userDataFromLocalStorage ? JSON.parse(userDataFromLocalStorage)?.data : null;
    const zipCode = userData?.profile?.defaultSAZipCode;

    const homePageItems = Sephora.homePageItems;
    const persistentBannerItems = Sephora.headerFooterContent.persistentBanner || [];
    const beautyOffersItems = Sephora.beautyOffersContent || [];
    const megaNavData = Sephora.headerFooterContent.megaNav || {};
    const totalItems = [...homePageItems, ...persistentBannerItems, ...beautyOffersItems];

    const isMegaNavDataReady = Object.keys(megaNavData).length;

    if (Sephora.configurationSettings?.isBasketPersonalizationEnabled) {
        const rwdBasketTopContent = Sephora.rwdBasketTopContent || [];
        totalItems.push(...rwdBasketTopContent);
    }

    const birthdayGiftContent = Sephora.birthdayGiftContent || {};
    const topBanner = birthdayGiftContent?.heroBanner;

    if (topBanner) {
        topBanner.personalization = {
            ...topBanner?.personalization,
            isBirthdayGift: true
        };
        totalItems.push(topBanner);
    }

    if (isMegaNavDataReady) {
        totalItems.push(megaNavData);
    }

    const { p13nContextIds, nbcContextIds, bdContextIds, mabContextIds } = getContextIdsToUpdate(totalItems);
    const entryIds = [...p13nContextIds, ...nbcContextIds, ...bdContextIds, ...mabContextIds];

    if ((cachedData.length && entryIds.length === 0) || (cachedData.length === 0 && isMegaNavDataReady && entryIds.length === 0) || !atgId) {
        services.p13nData.data = [];
        dispatchP13NEvent();
    }

    const customerAttributes = window?.sessionStorage.getItem('cust360');
    const isPreviewPersonalizationEnabled = readCookie('prv') && customerAttributes;

    if (!atgId && !isPreviewPersonalizationEnabled) {
        return;
    }

    getPersonalizationData({
        nbcContextIds,
        p13nContextIds,
        bdContextIds,
        mabContextIds,
        atgId,
        biId,
        zipCode
    });
}());
