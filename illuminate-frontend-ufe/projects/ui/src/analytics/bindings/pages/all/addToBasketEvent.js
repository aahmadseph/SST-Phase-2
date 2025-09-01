import utils from 'analytics/utils';
import locationUtils from 'utils/Location';
import anaConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';
import anaUtils from 'analytics/utils';

/* eslint-disable-next-line complexity */
export default function (data) {
    const currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
    const isHomepageRewardCarousel = locationUtils.isHomepage() && data?.analyticsData?.containerTitle === anaConsts.CAROUSEL_NAMES.REWARD_BAZAAR;
    const rootContainerName = (data.sku.rootContainerName || data.analyticsData.rootContainerName)?.toLowerCase();
    const isNotUseItWith = rootContainerName?.toLowerCase() !== anaConsts.CONTEXT.USE_IT_WITH;

    let linkName = `Add To Basket${data.analyticsData.isPickup ? ' For Store Pickup' : data.analyticsData.isSameDay ? ' For Same Day Delivery' : ''}`;
    linkName = data.analyticsData.isSameDay ? linkName.toLowerCase() : linkName;
    linkName = data.isGalleryLightBox ? `${anaConsts.PAGE_TYPES.GALLERY}:${anaConsts.LinkData.GALLERY_ADD_TO_BASKET}` : linkName;
    let actionInfoData =
        rootContainerName && !data.analyticsData.isBIRBPageRewardModal && isNotUseItWith
            ? data.context !== anaConsts.CONTEXT.QUICK_LOOK
                ? `${rootContainerName}:add to basket`
                : 'add to basket'
            : linkName;

    const isCustomSet = data?.sku?.configurableOptions && isNotUseItWith;
    actionInfoData = isCustomSet ? anaConsts.LinkData.ADD_TO_BASKET_CUSTOM_SET : actionInfoData;
    actionInfoData = data.analyticsData.isGiftCardQuickAdd
        ? `${anaConsts.LinkData.GIFT_CARD}:${anaConsts.ACTION_INFO.ADD_TO_BASKET}`
        : actionInfoData;
    actionInfoData = data.isGalleryLightBox ? `${anaConsts.PAGE_TYPES.GALLERY}:${anaConsts.LinkData.GALLERY_ADD_TO_BASKET}` : actionInfoData;
    const isLovesModal = data.context === anaConsts.PAGE_TYPES.LOVES_MODAL;
    const isMyListsModal = data.context === anaConsts.PAGE_NAMES.MY_LISTS;

    const eventStrings = [anaConsts.Event.SC_ADD];

    if (data?.isGalleryLightBox) {
        eventStrings.push(anaConsts.Event.GALLERY_COMPONENT_INTERACTION);
    }

    /**
     * ToDo: Append Fulfillment Type to all Product String as requiered on https://jira.sephora.com/browse/GUAR-6374
     * Below logic not working as expected and may need an additional utitily to get actual Fulfillment value
     * Also there are cases when eVar133 is duplicated,
     * seems that productStrings is overwritten somewhere else in analytics/utils.js
     * rework pending on https://jira.sephora.com/browse/GUAR-6720
     */
    // const deliveryOption = data?.analyticsData?.isPickup
    //     ? anaConsts.FULFILLMENT_TYPE.Pickup
    //     : data?.analyticsData?.isSameDay
    //         ? anaConsts.FULFILLMENT_TYPE.Sameday
    //         : data?.analyticsData?.isReplenishment
    //             ? anaConsts.FULFILLMENT_TYPE.AutoReplenish
    //             : anaConsts.FULFILLMENT_TYPE.Standard;

    const attributes = {
        linkName: data.analyticsData.isAddFullSize ? 'Add Full Size' : isCustomSet ? anaConsts.LinkData.ADD_TO_BASKET_CUSTOM_SET : linkName,
        actionInfo: actionInfoData,
        eventStrings,
        biRewardType: data.sku.biType,
        skuId: data.sku.skuId,
        // ToDo: Append Fulfillment Type to all Product String as requiered on https://jira.sephora.com/browse/GUAR-6374
        // rework pending on https://jira.sephora.com/browse/GUAR-6720
        // productStrings: `${data?.analyticsData?.productStrings?.[0]}|eVar133=${deliveryOption}`
        productStrings: data?.analyticsData?.productStrings?.[0]
    };

    if (isHomepageRewardCarousel) {
        attributes.previousPage = `${anaConsts.PAGE_TYPES.HOMEPAGE}:${anaConsts.PAGE_NAMES.HOMEPAGE}:n/a:*`;
    }

    if (data.analyticsData.origin) {
        attributes.actionInfo = `${data.analyticsData.origin}:add to basket`;
    }

    if (data.previousPage && data.previousPage.includes('basket')) {
        attributes.actionInfo = 'add to basket';
    }

    if (data.context === anaConsts.CONTEXT.FREQUENTLY_BOUGHT_TOGETHER || data.context === anaConsts.CONTEXT.CLEAN_AT_SEPHORA) {
        attributes.eventStrings = [anaConsts.Event.SC_ADD];
    }

    if (data.context === anaConsts.CONTEXT.FREQUENTLY_BOUGHT_TOGETHER && data.analyticsData.isMultiProductsAdd) {
        const multiProductStrings =
            Array.isArray(data.analyticsData.sku) && data.analyticsData.sku.map(item => `;${item.skuId};;;;eVar26=${item.skuId}`).join(',');

        attributes.actionInfo = `${anaConsts.CONTEXT.FREQUENTLY_BOUGHT_TOGETHER}:add all to basket`;
        attributes.productStrings = multiProductStrings;
        attributes.eventStrings = [anaConsts.Event.SC_ADD];
    }

    /* ILLUPH-119839
     * According to JIRA and business, requirement is to have prop55 populate with
     * actionCampaignString listed below only for the products within the
     * loves, purchases, and services carousels on the profile lists page.
     * On other pages we will continue to populate eVar75 with actionCampaignString.
     */
    if (rootContainerName) {
        const productId = data.sku.productId || data.analyticsData.productId;

        if (
            rootContainerName === anaConsts.CAROUSEL_NAMES.LOVES ||
            rootContainerName === anaConsts.CAROUSEL_NAMES.PURCHASES ||
            rootContainerName === anaConsts.CAROUSEL_NAMES.SERVICES ||
            rootContainerName === anaConsts.CAROUSEL_NAMES.USER_PROFILE
        ) {
            if (data.analyticsData.isAddFullSize) {
                attributes.actionInfo = `${rootContainerName}:${productId}:add full size`;
            } else {
                attributes.actionInfo = `${rootContainerName}:Add To Basket`;
            }
        } else if (data.context === anaConsts.CONTEXT.FREQUENTLY_BOUGHT_TOGETHER && data.analyticsData.isMultiProductsAdd) {
            const skuIds = Array.isArray(data.analyticsData.sku) && data.analyticsData.sku.map(item => item.productId);
            attributes.internalCampaign = `${anaConsts.CONTEXT.FREQUENTLY_BOUGHT_TOGETHER}:${skuIds.join('-')}:add-all-to-basket`;
        } else {
            attributes.internalCampaign = `${rootContainerName}:${productId}:add-to-basket`;
            const pageSourceName = anaUtils.getCustomPageSourceName();

            if (pageSourceName) {
                attributes.internalCampaign = `${pageSourceName}:${attributes.internalCampaign}`;
            }
        }
    } else if (data.isGalleryLightBox) {
        attributes.internalCampaign = `${anaConsts.PAGE_TYPES.GALLERY}:${anaConsts.CONTEXT.QUICK_LOOK}:${anaConsts.LinkData.GALLERY_ADD_TO_BASKET}`;
        attributes.previousPage = `${anaConsts.PAGE_TYPES.COMMUNITY}:${anaConsts.PAGE_NAMES.GALLERY_LIGHTBOX}:n/a:*`;
        attributes.pageDetail = anaConsts.PAGE_NAMES.COMMUNITY_PRODUCT_MODAL;
    }

    // UTS-1071 Fix for pageDetail
    if (digitalData.page?.attributes?.sephoraPageInfo?.pageName && typeof data.pageDetail === 'undefined') {
        attributes.pageDetail = digitalData.page.attributes.sephoraPageInfo.pageName?.split(':')?.[1];
    }

    if (isMyListsModal) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.MY_LISTS}|eVar133=${anaConsts.FULFILLMENT_TYPE.Standard}`;

        if (locationUtils.isMyCustomListPage()) {
            const actionInfo = anaConsts.ACTION_INFO.ADD_TO_THE_BASKET;
            attributes.actionInfo = actionInfo;
            attributes.pageName = anaConsts.EVENT_NAMES.LOVES.LIST_DETAIL_PAGE_NAME;
            attributes.eventStrings = [anaConsts.Event.SC_ADD];
            const pageDetail = anaConsts.EVENT_NAMES.LOVES.LIST_DETAIL_PAGE_NAME;
            digitalData.page.pageInfo.pageName = pageDetail;
            digitalData.page.attributes.sephoraPageInfo.pageName = pageDetail;
        }
    } else if (isLovesModal) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.LOVES_FLYOUT}`;
    } else if (locationUtils.isRwdCreditCardPage()) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.CREDIT_CARD}`;
    } else if (locationUtils.isBIPage()) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.BEAUTY_INSIDER}`;
    } else if (locationUtils.isBasketPage()) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.BASKET}`;
    } else if (locationUtils.isBIRBPage()) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.REWARD_BAZAAR}`;
        attributes.eventStrings = [anaConsts.Event.SC_ADD, anaConsts.Event.EVENT_71];
        attributes.actionInfo = `${anaConsts.CAROUSEL_NAMES.REWARD_BAZAAR}:${anaConsts.CAMPAIGN_STRINGS.ADD_TO_BASKET}`;
    } else if (locationUtils.isAutoreplenishPage()) {
        const carouselName = (data?.analyticsData?.rootContainerName || 'n/a').toLowerCase();
        const productId = data.sku.productId || data.analyticsData.productId;
        attributes.actionInfo = `${carouselName}:${anaConsts.ACTION_INFO.ADD_TO_BASKET}`;
        attributes.productStrings = `${attributes.productStrings}|eVar72=${carouselName}`;
        attributes.internalCampaign = `${carouselName}:${productId}:${anaConsts.CAMPAIGN_STRINGS.ADD_TO_BASKET}`;
    } else if (locationUtils.isSearchPage()) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.SEARCH}`;
    } else if (locationUtils.isLovesListPage() || locationUtils.isListsPage()) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.LOVE_LIST}`;
    } else if (locationUtils.isPurchaseHistoryPage()) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.BUY_IT_AGAIN}`;
    } else if (locationUtils.isNthCategoryPage()) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.CATEGORY}`;
    } else if (locationUtils.isOrderDetailsPage()) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.ORDER_DETAIL}`;
    } else if (locationUtils.isOrdersPage()) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.RESTOCK_PAST_PURCHASES}`;
    } else if (locationUtils.isCommunityProfilePage()) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.COMMUNITY}`;
    } else if (locationUtils.isHomepage()) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.HOMEPAGE}`;
    } else if (locationUtils.isProductPage()) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.PRODUCT}`;
    } else if (locationUtils.isCreatorStoreFrontPage()) {
        attributes.productStrings = `${attributes.productStrings}|eVar72=${anaConsts.PAGE_NAMES.CSF}|eVar133=${anaConsts.FULFILLMENT_TYPE.Standard}`;
    } else if (locationUtils.isShopMyStorePage() || locationUtils.isShopSameDayPage()) {
        const carouselName = (data?.analyticsData?.rootContainerName || 'n/a').toLowerCase();
        attributes.eventStrings = [anaConsts.Event.SC_ADD, anaConsts.Event.EVENT_269];
        attributes.actionInfo = `${carouselName}:add to basket`;
        attributes.productStrings = `${attributes.productStrings}|eVar69=${carouselName}|eVar72=carousel`;
    }

    deepExtend(currentEvent, { eventInfo: { attributes } });
}
