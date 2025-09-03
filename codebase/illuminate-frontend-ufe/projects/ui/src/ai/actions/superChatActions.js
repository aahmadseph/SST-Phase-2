import superChat from 'ai/reducers/superChat';
import sdnApi from 'ai/services/sdn';
import AddToBasketActions from 'actions/AddToBasketActions';
import LoveActions from 'actions/LoveActions';
import Authentication from 'utils/Authentication';
import { STD_BASKET_TYPE, PRODUCT_RECOMMENDATION_ANALYTICS_CONTEXT, PRODUCT_RECOMMENDATION_ANALYTICS_CATEGORY } from 'ai/constants/superchat';
import { HEADER_VALUE } from 'constants/authentication';

const { feedback } = sdnApi;

const { ACTION_TYPES } = superChat;

const superChatActions = {
    showSuperChat: (showSuperChat, prompts, data) => {
        return {
            type: ACTION_TYPES.SHOW_SUPER_CHAT,
            payload: {
                showSuperChat,
                prompts,
                entryPointData: data
            }
        };
    },
    superChatConfig: config => {
        return {
            type: ACTION_TYPES.SUPER_CHAT_CONFIG,
            payload: config
        };
    },
    submitFeedback: async params => {
        const {
            question, response, sessionId, lastMessageId, clientId, anonymousId
        } = params || {};

        return feedback({
            question,
            response,
            sessionId,
            lastMessageId,
            clientId,
            anonymousId
        }).then(data => data);
    },
    addToBasket: productData => {
        return dispatch => {
            const { skuList } = productData;
            const firstSku = skuList[0];

            const sku = {
                skuId: firstSku.skuId,
                productId: firstSku.productId
            };

            const basketType = STD_BASKET_TYPE;
            const qty = firstSku.qty || 1;
            const analyticsContext = PRODUCT_RECOMMENDATION_ANALYTICS_CONTEXT;
            const analyticsData = {
                productId: firstSku.productId,
                brandName: firstSku.brand_name,
                productName: firstSku.title,
                category: PRODUCT_RECOMMENDATION_ANALYTICS_CATEGORY
            };

            // Use the existing addToBasket action which handles all the basket state updates
            return dispatch(
                AddToBasketActions.addToBasket(
                    sku,
                    basketType,
                    qty,
                    null,
                    analyticsContext,
                    false, // samplePanel
                    analyticsData,
                    false, // showBasketQuickAdd
                    false, // isAutoReplenish
                    '', // replenishmentFrequency
                    firstSku.productId
                )
            );
        };
    },
    addToLovesList: product => {
        return (dispatch, getState) => {
            const analyticsData = {
                context: PRODUCT_RECOMMENDATION_ANALYTICS_CONTEXT,
                nextPageContext: PRODUCT_RECOMMENDATION_ANALYTICS_CONTEXT
            };

            // Check if user is logged in, if not show login modal
            return Authentication.requireAuthentication(null, null, analyticsData, null, false, HEADER_VALUE.USER_CLICK)
                .then(() => {
                    // User is authenticated, proceed with adding/removing love directly
                    const state = getState();
                    const { loves } = state;
                    const skuId = product.default_sku;
                    const productId = product.id;

                    const isCurrentlyLoved = loves.shoppingListIds?.includes(skuId);

                    if (isCurrentlyLoved) {
                        const productLoveData = {
                            skuId,
                            productId: productId,
                            type: 'loves'
                        };

                        return dispatch(LoveActions.removeItemFromSharableList(
                            productLoveData,
                            () => {
                                dispatch(LoveActions.getFlatLoveListSkusOverview(true, null, true));
                                Sephora.logger.info('Product removed from loves successfully');
                            },
                            (error) => {
                                Sephora.logger.error('Failed to remove product from loves:', error);
                            }
                        ));
                    } else {
                        const skuLoveData = {
                            skuId,
                            productId: productId,
                            source: 'productPage',
                            loveSource: PRODUCT_RECOMMENDATION_ANALYTICS_CONTEXT
                        };

                        return dispatch(LoveActions.addItemToSharableList(
                            skuLoveData,
                            () => {
                                dispatch(LoveActions.getFlatLoveListSkusOverview(true, null, true));
                                Sephora.logger.info('Product added to loves successfully');
                            },
                            (error) => {
                                Sephora.logger.error('Failed to add product to loves:', error);
                            }
                        ));
                    }
                })
                .catch(() => {
                    // User cancelled login or authentication failed
                    Sephora.logger.error('User cancelled login or authentication failed for love action');
                });
        };
    }
};

export default superChatActions;
