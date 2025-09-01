import utils from 'analytics/utils';

export default function mountLinkTrakingAttributes(data) {
    const {
        eventStrings,
        fieldErrors,
        filterSelections,
        selectedFilter,
        searchAnswersKeyword,
        photoId,
        colorIQ,
        serverResponse,
        pageDetail,
        linkName,
        navigationInfo,
        searchCriteria,
        actionInfo,
        specificEventName,
        productStrings,
        sku,
        previousPage,
        internalCampaign,
        userInput,
        usePreviousPageName,
        pageName,
        biChipType,
        pageType,
        world,
        medalliaFormIdAndType,
        reviewId,
        imageIndex,
        selectedStore,
        preferredStore,
        storeId,
        previousDeliveryMethod,
        productId,
        purchaseID,
        errorMessages,
        biRewardType
    } = data;

    if (!usePreviousPageName) {
        utils.savePageInfoName(pageName);
    }

    const attributes = {
        // Whenever we need to remove an attribute for a specific
        // event in derived events, we'll have to set it to an empty string.

        eventStrings,
        //prop28
        fieldErrors,
        //prop48
        errorMessages,
        // list1
        filterSelections,
        // eVar75
        internalCampaign: Array.isArray(internalCampaign) ? internalCampaign.join(':') : internalCampaign,
        // eVar77
        medalliaFormIdAndType,
        // eVar19, all platform: "desktop web", "tablet web", "mobile"
        platform: window.digitalData.page.attributes.platform,
        // eVar20
        photoId,
        // eVar21, platform: "web", "mobile"
        experience: window.digitalData.page.attributes.experience,
        // eVar23
        colorIQ,
        // eVar25
        purchaseID,
        // eVar56
        selectedFilter,
        // eVar61, Sku Type (biRewardType = data.sku.biType)
        biRewardType,
        // eVar62, language locale
        languageLocale: window.digitalData.page.attributes.languageLocale,
        // D=g is a so called Adobe Dynamic Variable
        eVar63: 'D=g',
        // eVar65, user Input field
        userInput: (userInput || '').toLowerCase(),
        // eVar66, server response
        serverResponse,
        // eVar93, page type
        pageType: pageType || window.digitalData.page.category.pageType,
        // eVar94, page detail
        pageDetail: pageDetail || window.digitalData.page.pageInfo.pageName?.toLowerCase(),
        // eVar95, page world
        pageWorld: world || window.digitalData.page.attributes.world || 'n/a',
        // eVar96, page url wo/ query string
        urlWithoutQuery: window.location.href.split('?')[0],
        // eVar97, page name
        pageName: pageName || window.digitalData.page.attributes.sephoraPageInfo.pageName,
        // pev2, link name
        linkName,
        // eVar64, previous navigation information
        navigationInfo,
        //prop20
        searchCriteria: searchCriteria || null,
        //prop21
        searchAnswersKeyword,
        //prop55
        actionInfo: actionInfo || null,
        //Used to differentiate two calls of the same type that happen at the same time
        specificEventName,
        //eVar107 v107
        biChipType,
        //sotV165
        reviewId,
        //sotV173
        imageIndex,
        selectedStore,
        preferredStore,
        //eVar104 store id
        storeId,
        previousDeliveryMethod,
        productId
    };

    if (sku && sku.skuId) {
        attributes.productStrings = utils.buildSingleProductString({ sku });
    } else if (productStrings) {
        attributes.productStrings = productStrings;
    }

    // prop6
    if (previousPage) {
        attributes.previousPage = previousPage;
    } else {
        const prevPage = window.digitalData.page.attributes.previousPageData;

        if (prevPage) {
            attributes.previousPage = prevPage.pageName;
        }
    }

    return attributes;
}
