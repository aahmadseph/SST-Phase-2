import React from 'react';

import RecapBasket from 'components/Content/Recap/RecapBasket';
import RecapLoves from 'components/Content/Recap/RecapLoves';
import RecapRecentlyViewed from 'components/Content/Recap/RecapRecentlyViewed';
import RecapProductList from 'components/Content/Recap/RecapProductList';
import RecapPurchaseHistory from 'components/Content/Recap/RecapPurchaseHistory';
import RecapBeautyRecommendations from 'components/Content/Recap/RecapBeautyRecommendations';

import contentConsts from 'constants/content';
import { targetUrl } from 'utils/TargetURL';

const {
    RECAP_CAROUSEL: { ITEM_URLS }
} = contentConsts;

const targetUrlMap = {
    [ITEM_URLS.BASKET]: (itemProps, { basket }, carouselTitle) => {
        if (!basket) {
            return null;
        }

        const { shouldRenderCarouselBasket, uniqueSkus, totalItemCount, dataReady } = basket;

        if (dataReady && !shouldRenderCarouselBasket) {
            return null;
        }

        return (
            <RecapBasket
                {...itemProps}
                isLoading={!dataReady}
                uniqueSkus={uniqueSkus}
                totalItemCount={totalItemCount}
                shouldRenderCarouselBasket={shouldRenderCarouselBasket}
                targetUrl={targetUrl(itemProps.action.targetUrl, {
                    carouselTitle,
                    title: itemProps.title,
                    urlParams: itemProps.urlParams
                })}
            />
        );
    },
    [ITEM_URLS.LOVES]: (itemProps, { currentLovesData }, carouselTitle) => {
        if (!currentLovesData) {
            return null;
        }

        const { items, dataReady } = currentLovesData;

        if (dataReady && items.length === 0) {
            return null;
        }

        return (
            <RecapLoves
                {...itemProps}
                isLoading={!dataReady}
                currentLoves={items}
                targetUrl={targetUrl(itemProps.action.targetUrl, {
                    carouselTitle,
                    title: itemProps.title,
                    urlParams: itemProps.urlParams
                })}
            />
        );
    },
    [ITEM_URLS.PURCHASE_HISTORY]: (itemProps, { purchaseHistory }, carouselTitle) => {
        if (!purchaseHistory) {
            return null;
        }

        const { items, dataReady } = purchaseHistory;

        if (dataReady && items.length === 0) {
            return null;
        }

        return (
            <RecapPurchaseHistory
                {...itemProps}
                isLoading={!dataReady}
                purchaseHistoryItems={items}
                targetUrl={targetUrl(itemProps.action.targetUrl, {
                    carouselTitle,
                    title: itemProps.title,
                    urlParams: itemProps.urlParams
                })}
            />
        );
    },
    [ITEM_URLS.RECENTLY_VIEWED]: (itemProps, { rvData }, carouselTitle) => {
        if (!rvData) {
            return null;
        }

        const { items, dataReady } = rvData;

        if (dataReady && items.length === 0) {
            return null;
        }

        const firstItem = items?.[0];

        return (
            <RecapRecentlyViewed
                {...itemProps}
                isLoading={!dataReady}
                sku={firstItem}
                showImage={firstItem != null}
                targetUrl={targetUrl(firstItem?.targetUrl, {
                    carouselTitle,
                    title: itemProps.title,
                    urlParams: itemProps.urlParams
                })}
            />
        );
    },
    [ITEM_URLS.BEAUTY_RECOMMENDATIONS]: (itemProps, { beautyRecommendations }, carouselTitle) => {
        if (!beautyRecommendations) {
            return null;
        }

        const { items, dataReady } = beautyRecommendations;

        if (dataReady && items.length === 0) {
            return null;
        }

        return (
            <RecapBeautyRecommendations
                {...itemProps}
                isLoading={!dataReady}
                beautyRecommendations={items}
                targetUrl={targetUrl(itemProps.action.targetUrl, {
                    carouselTitle,
                    title: itemProps.title,
                    urlParams: itemProps.urlParams
                })}
            />
        );
    },
    default: (itemProps, _, carouselTitle) => {
        if (!itemProps.skuList) {
            return null;
        }

        const { skuList } = itemProps;
        const title = itemProps.title;
        let url = itemProps?.action?.targetUrl;

        url = url ? url + `?icid2=${carouselTitle?.toLowerCase()}:${title?.toLowerCase()}` : '';

        return (
            <RecapProductList
                {...itemProps}
                skuList={skuList}
                displayTitle={title}
                targetUrl={url}
                isLoading={itemProps.isLoading}
            />
        );
    }
};

function getRecapJSXComponentCards({
    items = [],
    isLoading,
    data,
    carouselTitle,
    triggerClick,
    showApplyPointsInReadyToCheckoutSection,
    hasStandardItems,
    isBopisOnly,
    hasSufficientPoints,
    urlParams = {}
}) {
    const cards = items.reduce((acc, item, index) => {
        const itemProps = {
            key: `recap_item_${item.sid}_${index}`,
            ...item,
            urlParams,
            triggerClick: sid => triggerClick(sid, index),
            isLoading
        };

        if (showApplyPointsInReadyToCheckoutSection && item?.action?.targetUrl === ITEM_URLS.BASKET) {
            itemProps.showApplyPointsInReadyToCheckoutSection = showApplyPointsInReadyToCheckoutSection;
            itemProps.hasStandardItems = hasStandardItems;
            itemProps.isBopisOnly = isBopisOnly;
            itemProps.hasSufficientPoints = hasSufficientPoints;
            itemProps.itemWidth = '250px';
        }

        const getComponent = targetUrlMap[item?.action?.targetUrl] || targetUrlMap.default;

        const component = getComponent(itemProps, data, carouselTitle);
        component && acc.push(component);

        return acc;
    }, []);

    // (EXP-3602) Default card(s) cannot be only card(s) in Carousel
    if (cards.some(card => card.type !== RecapProductList && !card.props.isLoading)) {
        return cards;
    }

    return [];
}

export { getRecapJSXComponentCards };
