import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { createSelector } from 'reselect';

import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import { beautyInsiderAccountSelector } from 'selectors/user/beautyInsiderAccount/beautyInsiderAccountSelector';
import purchaseHistorySelector from 'selectors/purchaseHistory/purchaseHistorySelector';
import RecentlyViewedDataSelector from 'selectors/recentlyViewedData/recentlyViewedDataSelector';
import initializedCurrentLovesSelector from 'selectors/loves/initializedCurrentLovesSelector';
import beautyRecommendationsSelector from 'selectors/beautyRecommendations/beautyRecommendationsSelector';

import recapComponentListSelector from 'viewModel/content/recapList/selectors/recapComponentListSelector';
import recapBasketComponentSelector from 'viewModel/content/recapList/selectors/recapBasketComponentSelector';
import { getRecapJSXComponentCards } from 'viewModel/content/recapList/getRecapJSXComponentCards';
import localeUtils from 'utils/LanguageLocale';

import UserActions from 'actions/UserActions';
import RvDataActions from 'actions/RvDataActions';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import PersonalizationUtils from 'utils/Personalization';

import { sendCmsComponentEvent } from 'analytics/utils/cmsComponents';
import constants from 'constants/content';
import anaConsts from 'analytics/constants';
import basketConsts from 'constants/Basket';

import itemsByBasketSelector from 'selectors/basket/itemsByBasket/itemsByBasketSelector';
import { BASKET_TYPES } from 'actions/ActionsConstants';

const {
    COMPONENT_TYPES: { RECAP }
} = constants;

const {
    CMS_COMPONENT_EVENTS: { IMPRESSION, ITEM_CLICK }
} = anaConsts;

const { CMS_URL_PARAMS } = anaConsts;

const { POINTS_FOR_DISCOUNT_MIN_VAL } = basketConsts;

const { getPersonalizedComponent } = PersonalizationUtils;
const { wrapHOC } = FrameworkUtils;
const { recentlyViewedDataSelector } = RecentlyViewedDataSelector;
const { fetchPurchaseHistory, fetchBeautyRecommendations } = UserActions;
const { updateRvData } = RvDataActions;

export default wrapHOC(
    connect(
        createSelector(
            coreUserDataSelector,
            recapComponentListSelector,
            purchaseHistorySelector,
            recentlyViewedDataSelector,
            initializedCurrentLovesSelector,
            recapBasketComponentSelector,
            beautyRecommendationsSelector,
            p13nSelector,
            beautyInsiderAccountSelector,
            itemsByBasketSelector,
            (_state, ownProps) => ownProps.title,
            (_state, ownProps) => ownProps.personalization,
            (_state, ownProps) => ownProps,
            (
                user,
                { componentList, ...requiredData },
                purchaseHistory,
                { rvData },
                currentLovesData,
                basket,
                beautyRecommendations,
                p13n,
                beautyInsiderAccount,
                itemsByBasket = [],
                carouselTitle,
                personalization,
                ownProps
            ) => {
                const currentPurchaseHistory = purchaseHistory?.items || [];
                const currentRvData = rvData || [];
                const currentBeautyRecommendations = beautyRecommendations?.items || [];

                const data = {
                    ...(requiredData.purchaseHistory && {
                        purchaseHistory: {
                            items: currentPurchaseHistory,
                            dataReady: Array.isArray(currentPurchaseHistory)
                        }
                    }),
                    ...(requiredData.rvData && {
                        rvData: {
                            items: currentRvData,
                            dataReady: Array.isArray(currentRvData)
                        }
                    }),
                    ...(requiredData.currentLovesData && {
                        currentLovesData: {
                            items: currentLovesData.currentLoves,
                            dataReady: currentLovesData.currentLovesIsInitialized
                        }
                    }),
                    ...(requiredData.basket && {
                        basket: {
                            ...basket,
                            dataReady: basket.isInitialized || basket.totalItemCount === 0
                        }
                    }),
                    ...(requiredData.beautyRecommendations && {
                        beautyRecommendations: {
                            items: currentBeautyRecommendations,
                            dataReady: Array.isArray(currentBeautyRecommendations)
                        }
                    })
                };

                const personalizedComponent = getPersonalizedComponent(personalization, user, p13n, componentList);
                const items = personalizedComponent?.variationData?.items || componentList;
                const userId = user.userId;
                const isLoading = !Array.isArray(items);

                const triggerClick = async function (targetSid, position) {
                    const { sid, title } = ownProps;
                    const eventName = ITEM_CLICK;
                    const _items = items
                        .filter(item => item.sid === targetSid)
                        .map(item => ({
                            ...item,
                            itemIndex: position
                        }));
                    await sendCmsComponentEvent({
                        items: _items,
                        eventName,
                        title,
                        sid,
                        clickedSid: targetSid,
                        component: RECAP
                    });
                };

                let basketItemsCounts = {};
                let isBopisOnly = false;
                let hasStandardItems = false;
                const hasSufficientPoints = beautyInsiderAccount?.promotionPoints >= POINTS_FOR_DISCOUNT_MIN_VAL;
                const showApplyPointsInReadyToCheckoutSection =
                    (localeUtils.isUS() && Sephora.isMobile()) || (localeUtils.isCanada() && !Sephora.isMobile());

                if (user.isInitialized && !user.isAnonymous) {
                    basketItemsCounts = Object.keys(BASKET_TYPES).reduce((counts, basketTypeKey) => {
                        const basketType = BASKET_TYPES[basketTypeKey];
                        counts[basketTypeKey] = itemsByBasket.find(item => item.basketType === basketType)?.itemsCount || 0;

                        return counts;
                    }, {});

                    isBopisOnly =
                        basketItemsCounts.BOPIS_BASKET > 0 &&
                        Object.keys(basketItemsCounts).every(key => key === 'BOPIS_BASKET' || basketItemsCounts[key] === 0);

                    hasStandardItems = basketItemsCounts.STANDARD_BASKET > 0;
                }

                // a card in cards array will be rendered in carousel
                // a rendered card might be in a skeleton state or content state
                const cards = getRecapJSXComponentCards({
                    isLoading,
                    items,
                    urlParams: {
                        [CMS_URL_PARAMS.cRefid]: ownProps?.sid
                    },
                    data,
                    carouselTitle,
                    triggerClick,
                    showApplyPointsInReadyToCheckoutSection,
                    hasStandardItems,
                    isBopisOnly,
                    hasSufficientPoints
                });

                const mountItems = cards.map(card => ({
                    ...card.props,
                    uniqueSkus: card.props?.uniqueSkus || [],
                    skus: card.props?.skus || {}
                }));

                const triggerRecapImpression = targets => {
                    if (!isLoading) {
                        const { title, sid } = ownProps;

                        const currentItems = mountItems
                            .map((item, index) => ({
                                ...item,
                                itemIndex: index
                            }))
                            .filter((item, index) => targets.includes(index));

                        const eventName = IMPRESSION;
                        setTimeout(() => {
                            sendCmsComponentEvent({
                                items: currentItems,
                                eventName,
                                title,
                                sid,
                                component: RECAP
                            });
                        }, 1000);
                    }
                };

                // entire carousel is hidden initially to avoid CLS issues for anonymous users (EXP-4648)
                let hideRow = true;

                if (user.isInitialized && !user.isAnonymous && cards.length > 0) {
                    hideRow = false;
                }

                return {
                    userId,
                    hideRow,
                    isLoading,
                    cards,
                    requiredData,
                    triggerRecapImpression
                };
            }
        ),
        {
            fetchPurchaseHistory,
            updateRvData,
            fetchBeautyRecommendations
        }
    )
);
