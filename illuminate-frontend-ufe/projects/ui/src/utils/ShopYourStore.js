import { FEATURED_LINKS, LANDING_PAGE } from 'constants/ShopYourStore';
import Empty from 'constants/empty';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
const { SHOP_STORE_AND_DELIVERY_FLYOUT } = LOCAL_STORAGE;

function excludeShopYourStoreMenuItems(menuItems = Empty.Array) {
    if (!menuItems.length) {
        return menuItems;
    }

    const excludedLinkSids = [FEATURED_LINKS.SHOP_SAME_DAY_SID, FEATURED_LINKS.SHOP_MY_STORE_SID];
    const filteredMenuItems = menuItems.filter(item => {
        const sid = item?.sid || '';

        return !excludedLinkSids.some(excludedSid => sid.startsWith(excludedSid));
    });

    return filteredMenuItems;
}

function transformCardRenderings(services = {}) {
    /*
    OMNX-534: Transform this structure:

    {
        "items": [{ "type": "CardDatasource" }, { "type": "CardDatasource" }],
        "parameters": {},
        "type": "CardRendering"
    }

    Into:

    [
        {
            "datasource": {"type": "CardDatasource"},
            "parameters": {},
            "type": "CardRendering"
        },
        {
            "datasource": {"type": "CardDatasource"},
            "parameters": {},
            "type": "CardRendering"
        }
    ]
    */

    const { items, parameters = {}, type } = services;

    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }

    const result = items.map(item => {
        return {
            type,
            parameters,
            datasource: item
        };
    });

    return result;
}

function updateCachedSLAInformation(target, details) {
    try {
        const cache = Storage.session.getItem(SHOP_STORE_AND_DELIVERY_FLYOUT);

        if (cache) {
            let nextCache;

            if (target === LANDING_PAGE.STORE_DETAILS && cache?.storeDetails) {
                nextCache = {
                    ...cache,
                    storeDetails: {
                        ...cache.storeDetails,
                        pickupMessage: details?.pickupMessage
                    }
                };
            } else if (target === LANDING_PAGE.ZIP_CODE_DETAILS && cache?.sameDay) {
                nextCache = {
                    ...cache,
                    sameDay: {
                        ...cache.sameDay,
                        deliveryMessage: details?.deliveryMessage
                    }
                };
            }

            if (nextCache) {
                Storage.session.setItem(SHOP_STORE_AND_DELIVERY_FLYOUT, nextCache, Storage.MINUTES * 15);
            }
        }
    } catch (error) {
        Sephora.logger.error('Failed to update SLA information in cache:', error);
    }
}

export default { excludeShopYourStoreMenuItems, transformCardRenderings, updateCachedSLAInformation };
