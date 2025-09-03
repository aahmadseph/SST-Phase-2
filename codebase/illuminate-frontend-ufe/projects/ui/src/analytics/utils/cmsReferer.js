import anaConsts from 'analytics/constants';
import urlUtils from 'utils/Url';
import Storage from 'utils/localStorage/Storage';
import Empty from 'constants/empty';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Location from 'utils/Location';

const { CMS_REFERER_LOCAL_STORAGE_KEY, CMS_URL_PARAMS } = anaConsts;

const NA = 'n/a';

const expiry = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

export const refererActions = {
    get: () => Storage?.local?.getItem(CMS_REFERER_LOCAL_STORAGE_KEY),
    set: data => Storage?.local?.setItem(CMS_REFERER_LOCAL_STORAGE_KEY, data, expiry),
    remove: () => Storage?.local?.removeItem(CMS_REFERER_LOCAL_STORAGE_KEY)
};

const cacheHasExpired = function (expiryDate) {
    return Date.parse(expiryDate) < new Date().getTime();
};

export function deepMerge(target, ...sources) {
    if (!sources.length) {
        return target;
    }

    const source = sources.shift();
    let result = target;

    if (typeof target !== 'object' || target === null) {
        result = {};
    }

    if (typeof source !== 'object' || source === null) {
        return result;
    }

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (typeof source[key] === 'object' && source[key] !== null) {
                if (!result[key]) {
                    result[key] = Array.isArray(source[key]) ? [] : {};
                }

                result[key] = deepMerge(result[key], source[key]);
            } else {
                result[key] = source[key];
            }
        }
    }

    return deepMerge(result, ...sources);
}

export const mountComponentRef = ({ eventData, targetUrl }) => {
    const hasParent = eventData?.personalizationData?.sid !== eventData?.personalizationData?.bannersPersonalizedData?.[0]?.sid;
    const child = eventData?.personalizationData?.bannersPersonalizedData?.[0];
    const currentSid = child?.sid ?? eventData?.personalizationData?.sid ?? null;

    const componentRefData = {
        currentSid,
        targetUrl,
        parent: hasParent
            ? {
                sid: eventData?.personalizationData.sid,
                type: eventData?.personalizationData.contentType,
                sys: {
                    publishedVersion: eventData?.personalizationData.publishedVersion
                }
            }
            : null,
        child: {
            sid: child.sid || null,
            type: !hasParent ? eventData?.personalizationData.contentType : child?.type,
            sys: child?.publishedVersion
                ? {
                    publishedVersion: child.publishedVersion
                }
                : null
        }
    };

    saveRefererData(componentRefData);
};

export const checkCmsRefererInfo = () => {
    const referer = urlUtils.getParamValueAsSingleString('referer');
    const cmsRefererInfo = refererActions.get();

    if (referer && cmsRefererInfo) {
        const parent = cmsRefererInfo?.parent.sid || cmsRefererInfo?.child?.sid;

        if (referer !== parent) {
            refererActions.remove();
        }
    }

    return;
};

/** function to mount the component reference
 * @param {object} currentSid - current component sid
 * @param {string} targetURL - target URL
 * @param {object} parent - parent component
 * @param {object} child - child component
 */

export const saveRefererData = ({ currentSid, targetUrl, parent, child }) => {
    const currentComponentRef = refererActions.get() || Empty.Object;

    if (currentComponentRef && cacheHasExpired(currentComponentRef.expiry)) {
        refererActions.remove();
    }

    const defaultReferer = {
        parent: {
            type: parent?.type,
            sid: parent?.sid,
            sys: {
                publishedVersion: parent?.sys?.publishedVersion
            }
        },
        sid: currentSid !== parent?.sid ? currentSid : NA,
        type: child.type ?? parent.type,
        products: [],
        sys: {
            publishedVersion: child?.sys?.publishedVersion ?? NA
        },
        targetUrl
    };

    const mergedReferer = deepMerge(defaultReferer, currentComponentRef?.referer?.[currentSid] || {});

    const componentRef = {
        products: [],
        ...currentComponentRef,
        currentSid,
        targetUrl,
        referer: {
            ...currentComponentRef?.referer,
            [currentSid]: mergedReferer
        }
    };

    refererActions.set(componentRef);
};

export const removeProductFromReferer = sku => {
    const cmsRefererInfo = refererActions.get();

    if (cmsRefererInfo) {
        const current = cmsRefererInfo.currentSid;

        if (current) {
            refererActions.set({
                ...cmsRefererInfo,
                products: cmsRefererInfo.products.filter(product => product !== sku.skuId),
                referer: {
                    ...cmsRefererInfo.referer,
                    [current]: {
                        ...cmsRefererInfo.referer[current],
                        products: cmsRefererInfo.referer[current].products.filter(product => product !== sku.skuId),
                        removedFromBasket: true
                    }
                }
            });
        }
    }

    return;
};

const createRefererLink = refererItem => {
    const childSid = refererItem.sid || NA;
    const childPublishedVersion = refererItem.sys?.publishedVersion || NA;
    const parentSid = refererItem.parent?.sid || NA;
    const parentPublishedVersion = refererItem.parent?.sys?.publishedVersion || NA;
    const products = refererItem.products.join(',');
    const conteType = refererItem.parent?.type || refererItem.type;

    return `${childSid}:${childPublishedVersion}:${parentSid}:${parentPublishedVersion}:${conteType}=${products}`;
};

const generateRefererLinks = (refererItems, skuIds = []) => {
    const refererLinks = [];

    for (const key in refererItems) {
        if (Object.prototype.hasOwnProperty.call(refererItems, key)) {
            const refererItem = refererItems[key];
            const hasProduct = skuIds.length ? refererItem.products.some(product => skuIds.includes(product)) : true;

            if (hasProduct) {
                const link = createRefererLink(refererItem);
                refererLinks.push(link);

                if (skuIds.length) {
                    refererItem.products = refererItem.products.filter(product => !skuIds.includes(product));
                }
            }
        }
    }

    return refererLinks.join(';');
};

/**
 *  Mounts the referer link by items
 * @param {object} items
 * @returns  referer link
 */
export const mountCmsRefererLinkByItems = ({ items }) => {
    if (!items?.length) {
        return null;
    }

    const dataReferer = refererActions.get();

    if (dataReferer && cacheHasExpired(dataReferer.expiry)) {
        refererActions.remove();

        return null;
    }

    const skuIds = items.map(item => item.sku.skuId);

    if (dataReferer?.products?.length) {
        dataReferer.products = dataReferer.products.filter(product => !skuIds.includes(product));

        const refererLinks = generateRefererLinks(dataReferer.referer, skuIds);

        dataReferer.link = refererLinks;
        refererActions.set(dataReferer);

        return refererLinks;
    }

    return null;
};

/**
 * Mounts the referer link by items
 *
 * Description: only to help testing
 * @param {object} items
 * @returns referer link
 */
if (typeof window !== 'undefined') {
    window.mountCmsRefererLinkByItems = () => {
        const items = Storage.local.getItem(LOCAL_STORAGE.BASKET)?.items;
        const currentLink = refererActions.get()?.link;

        const refererLink = currentLink
            ? currentLink
            : mountCmsRefererLinkByItems({
                items
            });

        Sephora.logger.info('%c Generated referer link:', 'color: green; font-weight: bold; background-color: white; padding: 2px;', refererLink);
    };
}

export const mountRefererLinkLinK = target => {
    if (!target) {
        return '';
    }

    return `${target.sid}:${target?.sys.publishedVersion};`;
};

export const mountCmsRefererLink = () => {
    const cmsRefererInfo = refererActions.get();

    if (cmsRefererInfo?.products?.length) {
        const refererLinks = generateRefererLinks(cmsRefererInfo.referer);

        refererActions.remove();

        return refererLinks;
    }

    return null;
};

const mountProductReference = (products, sid) => {
    if (!products) {
        return [];
    }

    return !products.includes(sid) ? products.concat(sid) : products;
};

const validCmsUrlParams = [CMS_URL_PARAMS.icid2, CMS_URL_PARAMS.cRefid];

const getMatchUrlParams = (currentSid, paramValue) => {
    if (!paramValue) {
        return false;
    }

    return paramValue?.toLocaleLowerCase().trim().includes(currentSid.toLocaleLowerCase().trim());
};

const isValidUrlParams = () => {
    const currentSid = getCurrentSid();

    if (!currentSid) {
        return false;
    }

    const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;

    return validCmsUrlParams.some(param => {
        const paramValue = url ? url.searchParams.get(param) : null;

        return !!getMatchUrlParams(currentSid, paramValue);
    });
};

const matchRefererAtributes = () => {
    const cmsRefererInfo = refererActions.get();

    if (!cmsRefererInfo || !cmsRefererInfo.currentSid) {
        return false;
    }

    const currentSid = cmsRefererInfo.currentSid;
    const currentData = cmsRefererInfo.referer[currentSid] || Empty.Object;

    const matchTargetUrl = currentData?.targetUrl ? window.location.pathname.includes(currentData?.targetUrl?.split('?')[0]) : false;

    if (!matchTargetUrl) {
        refererActions.set({
            ...cmsRefererInfo,
            targetUrl: null
        });
    }

    const matchProductUrl = cmsRefererInfo?.productUrl ? window.location.href.includes(cmsRefererInfo?.productUrl?.split('?')[0]) : false;

    if (!matchProductUrl) {
        refererActions.set({
            ...cmsRefererInfo,
            productUrl: null
        });
    }

    return matchTargetUrl || matchProductUrl;
};

const matchReferer = () => {
    const cmsRefererInfo = refererActions.get();

    if (!cmsRefererInfo || !cmsRefererInfo?.currentSid) {
        return false;
    }

    const haveUrlParams = isValidUrlParams();
    const haveMatchRefererAtributes = matchRefererAtributes();

    return haveUrlParams || haveMatchRefererAtributes || Location.isHomepage();
};

export const addProductToReferer = sku => {
    const cmsRefererInfo = refererActions.get();

    if (cmsRefererInfo?.currentSid?.length) {
        const currentSid = cmsRefererInfo.currentSid;

        const matchURL = matchReferer();

        if (currentSid && (matchURL || Location.isHomepage())) {
            refererActions.set({
                ...cmsRefererInfo,
                products: mountProductReference(cmsRefererInfo.products, sku.skuId),
                referer: {
                    ...cmsRefererInfo.referer,
                    [currentSid]: {
                        ...cmsRefererInfo.referer[currentSid],
                        products: mountProductReference(cmsRefererInfo.referer[currentSid].products, sku.skuId),
                        addedToBasket: true
                    }
                }
            });
        }
    }

    return;
};

/** Getters for referer data
 * get the referer link
 * @returns referer link
 */
export const getRefererLink = () => {
    const dataReferer = refererActions.get();

    if (dataReferer) {
        return dataReferer.link;
    }

    return null;
};

/**
 * get the current referer sid
 * @returns currentSid
 */
export const getCurrentSid = () => {
    const dataReferer = refererActions.get();

    if (dataReferer) {
        return dataReferer.currentSid;
    }

    return null;
};

/**
 * get the current referer sid
 * @returns currentSid
 */
export const getMatchReferer = () => {
    const { currentSid, targetUrl } = refererActions.get() ?? Empty.Object;

    if (!currentSid || !targetUrl) {
        return null;
    }

    const matchSid = isValidUrlParams(currentSid);

    const pagePath = window.pageInfo?.pagePath ?? window.location.pathname ?? '';

    const matchPagePath = targetUrl.includes(pagePath);

    if (!matchSid || !matchPagePath) {
        refererActions.set({
            ...refererActions.get(),
            currentSid: '',
            pagePath: ''
        });

        return null;
    }

    return currentSid;
};

/**
 * set the product url
 * @param {string} targetUrl
 */
export const setProductUrl = targetUrl => {
    refererActions.set({
        ...refererActions.get(),
        productUrl: targetUrl
    });
};

/**
 * remove the product url
 */
export const removeProductUrl = () => {
    refererActions.set({
        ...refererActions.get(),
        productUrl: null
    });
};

export const checkHomeReferer = targetUrl => {
    const match = isValidUrlParams();

    if (!match) {
        removeProductUrl();
    }

    setProductUrl(targetUrl);

    return match;
};
