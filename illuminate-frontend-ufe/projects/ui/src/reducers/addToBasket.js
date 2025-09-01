/* eslint-disable complexity */
/* This was originally used in the old legacy basket page
 * The new RWD Basket page uses reducers/rwdBasket
 * This reducer is used throughout the app for add to basket and inline basket
 */
const ACTION_TYPES = {
    UPDATE_BASKET: 'UPDATE_BASKET',
    SHOW_BASKET_ERROR: 'SHOW_BASKET_ERROR',
    SHOW_BASKET_WARNING: 'SHOW_BASKET_WARNING',
    SHOW_STICKY_APPLE_PAY_BTN: 'SHOW_STICKY_APPLE_PAY_BTN',
    SHOW_PAYPAL_RESTRICTED_MESSAGE: 'SHOW_PAYPAL_RESTRICTED_MESSAGE',
    CLEAR_PENDING_SKU: 'CLEAR_PENDING_SKU',
    SET_BASKET_TYPE: 'SET_BASKET_TYPE',
    SET_FROM_BAZAAR: 'SET_FROM_BAZAAR',
    SET_FROM_CHOOSE_OPTIONS_MODAL: 'SET_FROM_CHOOSE_OPTIONS_MODAL'
};

const initialState = {
    isInitialized: false,
    itemCount: 0,
    items: [],
    rewards: [],
    promos: [],
    appliedPromotions: [],
    samples: [],
    products: [],
    subtotal: '$0.00',
    rawSubTotal: '$0.00',
    pendingBasketSkus: [],
    currentBasketType: null,
    error: undefined,
    pickupBasket: {
        items: [],
        error: undefined
    },
    fromChooseOptionsModal: false
};

/**
 * If removing property from basket state, don't remove property entirely.
 * If you do, state will not reflect change due to object.assign.
 * Instead set property value to null to simulate removal, this will update state.
 */
const reducer = function (state = initialState, action) {
    switch (action.type) {
        // This version of UPDATE_BASKET is legacy and used in add to basket and inline basket
        // The RWD Basket page uses the version of UPDATE_BASKET in reducers/rwdBasket
        case ACTION_TYPES.UPDATE_BASKET:
            return Object.assign(
                {},
                state,
                {
                    basketLevelMessages: undefined,
                    promoWarning: undefined,
                    firstBuyOrderDiscount: undefined,
                    error: action.clearError ? undefined : state.error
                },
                action.basket,
                {
                    pickupBasket: Object.assign(
                        {},
                        state.pickupBasket,
                        {
                            basketLevelMessages: undefined,
                            promoWarning: undefined,
                            firstBuyOrderDiscount: undefined,
                            error: action.clearError ? undefined : state.pickupBasket?.error
                        },
                        action.basket.pickupBasket
                    )
                }
            );
        case ACTION_TYPES.SHOW_BASKET_ERROR: {
            const nextItems = {
                ...(action.error && action.itemsAndErrors && { items: action.itemsAndErrors })
            };

            const nextState = action.isPickup
                ? {
                    ...state,
                    pickupBasket: {
                        ...state.pickupBasket,
                        error: action.error,
                        ...nextItems
                    }
                }
                : {
                    ...state,
                    error: action.error,
                    ...nextItems
                };

            return nextState;
        }
        case ACTION_TYPES.SHOW_BASKET_WARNING: {
            return Object.assign({}, state, { basketItemWarnings: action.basketItemWarnings });
        }
        case ACTION_TYPES.SHOW_STICKY_APPLE_PAY_BTN:
            return Object.assign({}, state, { showStickyApplePayBtn: action.showStickyApplePayBtn });
        case ACTION_TYPES.SHOW_PAYPAL_RESTRICTED_MESSAGE: {
            const nextState = action.isPickup
                ? Object.assign({}, state, {
                    pickupBasket: Object.assign({}, state.pickupBasket, { showPaypalRestrictedMessage: action.showPaypalRestrictedMessage })
                })
                : Object.assign({}, state, { showPaypalRestrictedMessage: action.showPaypalRestrictedMessage });

            return nextState;
        }
        case ACTION_TYPES.CLEAR_PENDING_SKU:
            return Object.assign({}, state, { pendingBasketSkus: action.pendingBasketSkus });
        case ACTION_TYPES.SET_BASKET_TYPE: {
            const newState = Object.assign({}, state, {
                switchedItem: null,
                pickupBasket: Object.assign({}, state.pickupBasket, { switchedItem: null })
            });

            return Object.assign(newState, { currentBasketType: action.currentBasketType });
        }

        case ACTION_TYPES.SET_FROM_BAZAAR: {
            //Toggles boolean whether the action came from bazaar modal comp.
            return {
                ...state,
                fromBazaar: action.payload
            };
        }

        case ACTION_TYPES.SET_FROM_CHOOSE_OPTIONS_MODAL: {
            return {
                ...state,
                fromChooseOptionsModal: action.payload
            };
        }
        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
