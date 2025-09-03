import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';

// Get a single page of purchase history.
function getPurchaseHistoryPage(profileId, options) {
    const biAccountId = userUtils.getBiAccountId();
    // Default response structure for non-BI account users.
    const nonBiAccountResponse = {
        profileLocale: null,
        profileStatus: null,
        purchasedItems: [],
        purchasedItemsCount: 0
    };
    const { useLXSRedemptionHistory = false } = Sephora.configurationSettings;
    let url = '';
    let useLXSRedemptionHistoryCall = false;

    if (options) {
        const {
            sortBy, itemsPerPage, currentPage, groupBy, excludeSamples, purchaseFilter, excludeRewards, includeNonBiUserPurchases
        } = options;

        // Determine if the redemption history endpoint should be used.
        useLXSRedemptionHistoryCall = useLXSRedemptionHistory && purchaseFilter === 'rewards';

        url = useLXSRedemptionHistoryCall ? `/gway/v1/lxs/${biAccountId}/redemption-history` : `/api/bi/profiles/${profileId}/purchases`;

        const qsParams = {
            sortBy,
            itemsPerPage,
            currentPage,
            groupBy,
            excludeSamples,
            purchaseFilter,
            excludeRewards,
            includeNonBiUserPurchases
        };

        const qs = urlUtils.makeQueryString(qsParams);

        if (qs) {
            url += '?' + qs;
        }
    }

    const headers = {
        'x-requested-source': 'web'
    };

    // If using the redemption history endpoint but no BI account exists, return default empty response.
    if (useLXSRedemptionHistoryCall && !biAccountId) {
        return Promise.resolve(nonBiAccountResponse);
    }

    return ufeApi.makeRequest(url, { method: 'GET', headers }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

// Get all pages concurrently and aggregate the complete purchase history.
function getCompletePurchaseHistory(profileId, options, showPreviouslyPurchasedPdp = false) {
    // Ensure we get the first page.
    const firstPageOptions = !showPreviouslyPurchasedPdp ? { ...options, currentPage: 1 } : { ...options };

    return getPurchaseHistoryPage(profileId, firstPageOptions).then(firstPageData => {
        const itemsPerPage = options.itemsPerPage || 20; // Default if not provided
        const totalItems = firstPageData.purchasedItemsCount;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // If there's only one page, return the first page data.
        if (totalPages <= 1) {
            return firstPageData;
        }

        // Build an array of promises for pages 2 through totalPages.
        const promises = [];

        if (!showPreviouslyPurchasedPdp) {
            for (let page = 2; page <= totalPages; page++) {
                const pageOptions = { ...options, currentPage: page };
                promises.push(getPurchaseHistoryPage(profileId, pageOptions));
            }
        }

        // Execute all requests concurrently.
        return Promise.all(promises).then(pagesData => {
            // Combine purchasedItems from the first page with those from the subsequent pages.
            const allPurchasedItems = firstPageData.purchasedItems.concat(
                pagesData.reduce((acc, pageData) => acc.concat(pageData.purchasedItems), [])
            );

            return {
                profileLocale: firstPageData.profileLocale,
                profileStatus: firstPageData.profileStatus,
                purchasedItems: allPurchasedItems,
                purchasedItemsCount: allPurchasedItems.length
            };
        });
    });
}

export { getPurchaseHistoryPage };

export default getCompletePurchaseHistory;
