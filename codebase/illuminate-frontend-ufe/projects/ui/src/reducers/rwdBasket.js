const ACTION_TYPES = {
    SET_RWD_BASKET: 'SET_RWD_BASKET',
    SET_BASKET_TYPES: 'SET_BASKET_TYPES',
    UPDATE_BASKET_CMS_DATA: 'UPDATE_BASKET_CMS_DATA',
    SET_RWD_CHECKOUT_ERRORS: 'SET_RWD_CHECKOUT_ERRORS',
    SET_SAME_DAY_DELIVERY_AVAILABLE: 'SET_SAME_DAY_DELIVERY_AVAILABLE',
    CLEAR_RWD_CHECKOUT_ERRORS: 'CLEAR_RWD_CHECKOUT_ERRORS',
    CLEAR_GISZONE2_ERRORS: 'CLEAR_GISZONE2_ERRORS',
    UPDATE_BASKET: 'UPDATE_BASKET',
    RESET_SHOULD_SCROLL_TO_TOP: 'RESET_SHOULD_SCROLL_TO_TOP',
    RESET_SWITCHED_ITEM: 'RESET_SWITCHED_ITEM',
    SET_CONFIRMATION_BOX_OPTIONS: 'SET_CONFIRMATION_BOX_OPTIONS',
    SET_FROM_BAZAAR: 'SET_FROM_BAZAAR'
};

const {
    ROOT_BASKET_TYPES: { PRE_BASKET, MAIN_BASKET },
    MAIN_BASKET_TYPES: { DC_BASKET, BOPIS_BASKET }
} = require('constants/RwdBasket');

const initialState = {
    basket: null,
    isInitialized: false,
    currentRootBasketType: null,
    currentMainBasketType: null,
    shouldScrollToTop: false,
    confirmationBoxOptions: null,
    cmsData: {},
    rwdCheckoutErrors: {
        topOfPageBopis: [],
        topOfPageSad: [],
        sddZone2: [],
        bopisZone2: [],
        gisZone2: [],
        biBenefitsErrors: []
    }
};

function shouldShowPreBasket(bopisItemCount) {
    // The only condition for showing PreBasket is that there is a Pickup/Bopis cart
    return bopisItemCount > 0;
}

function didUserEmptyBOPISCart(currentMainBasketType, isPreBasketAvailable) {
    // (INFL-2549) - No empty BOPIS state, automatically navigate to DC_BASKET
    return currentMainBasketType === BOPIS_BASKET && !isPreBasketAvailable;
}

function didUserEmptySaDWithBopisAvailable({ currentMainBasketType, bopisItemCount, shippingAndDeliveryItemCount }) {
    // (INFL-2549) - AC4.2 - automatically navigate to BOPIS
    return currentMainBasketType === DC_BASKET && bopisItemCount > 0 && shippingAndDeliveryItemCount === 0;
}

function getNavigationInfo({
    isHardLoad,
    currentRootBasketType,
    currentMainBasketType,
    shouldCalculateRootBasketType,
    shippingAndDeliveryItemCount,
    bopisItemCount
}) {
    const isPreBasketAvailable = shouldShowPreBasket(bopisItemCount);

    const bopisHasBeenEmptied = didUserEmptyBOPISCart(currentMainBasketType, isPreBasketAvailable);
    const shippingHasBeenEmptiedAndBopisExists = didUserEmptySaDWithBopisAvailable({
        currentMainBasketType,
        bopisItemCount,
        shippingAndDeliveryItemCount
    });

    const shouldReCalculateNavigationTypes =
        isHardLoad || bopisHasBeenEmptied || shippingHasBeenEmptiedAndBopisExists || shouldCalculateRootBasketType;

    const sharedOut = {
        isPreBasketAvailable,
        shouldScrollToTop: false,
        currentRootBasketType,
        currentMainBasketType
    };

    if (shouldReCalculateNavigationTypes) {
        sharedOut.shouldScrollToTop = true;

        if (shippingHasBeenEmptiedAndBopisExists) {
            return {
                ...sharedOut,
                currentRootBasketType: MAIN_BASKET,
                currentMainBasketType: BOPIS_BASKET
            };
        }

        if (isPreBasketAvailable) {
            return {
                ...sharedOut,
                currentRootBasketType: PRE_BASKET,
                // currentMainBasketType will be set by user action on PreBasket
                currentMainBasketType: null
            };
        }

        return {
            ...sharedOut,
            currentRootBasketType: MAIN_BASKET,
            // Default MAIN_BASKET_TYPE is DC because if we had BOPIS items, we would be rendering PreBasket
            currentMainBasketType: DC_BASKET
        };
    }

    return { ...sharedOut };
}

const reducer = function (state = initialState, action) {
    const payload = action.payload || action;

    switch (action.type) {
        case ACTION_TYPES.SET_RWD_BASKET: {
            return {
                ...state,
                isInitialized: true
            };
        }

        case ACTION_TYPES.UPDATE_BASKET: {
            const { basket, shouldCalculateRootBasketType } = payload;
            const { currentRootBasketType, currentMainBasketType, isInitialized } = state;

            const isHardLoad = !isInitialized;

            return {
                ...(isHardLoad ? { ...initialState, ...state } : state),
                isInitialized: isHardLoad ? true : isInitialized,
                basket,
                ...getNavigationInfo({
                    isHardLoad,
                    currentRootBasketType,
                    currentMainBasketType,
                    shouldCalculateRootBasketType,
                    shippingAndDeliveryItemCount: basket?.items?.length,
                    bopisItemCount: basket?.pickupBasket?.items?.length
                })
            };
        }

        case ACTION_TYPES.UPDATE_BASKET_CMS_DATA: {
            return {
                ...state,
                cmsData: payload
            };
        }

        case ACTION_TYPES.SET_BASKET_TYPES: {
            // currentRootBasketType will be set based on basket response (ie. if BOPIS exists)
            // currentMainBasketType will be set by user action when switch between BOPIS and Shipping and Delivery
            const { currentRootBasketType, currentMainBasketType, resetSwitchedItem = true } = payload;

            return {
                ...state,
                currentRootBasketType,
                currentMainBasketType,
                shouldScrollToTop: true,
                ...(resetSwitchedItem && {
                    basket: {
                        ...state.basket,
                        switchedItem: null,
                        pickupBasket: {
                            ...state.basket.pickupBasket,
                            switchedItem: null
                        }
                    }
                })
            };
        }

        case ACTION_TYPES.RESET_SHOULD_SCROLL_TO_TOP: {
            return {
                ...state,
                shouldScrollToTop: false
            };
        }

        case ACTION_TYPES.RESET_SWITCHED_ITEM: {
            return {
                ...state,
                basket: {
                    ...state.basket,
                    switchedItem: null,
                    pickupBasket: {
                        ...state.basket.pickupBasket,
                        switchedItem: null
                    }
                }
            };
        }

        case ACTION_TYPES.SET_CONFIRMATION_BOX_OPTIONS: {
            const { itemSwitchedToBasket, itemSwitchedFromBasket } = payload;

            return {
                ...state,
                confirmationBoxOptions: {
                    itemSwitchedToBasket,
                    itemSwitchedFromBasket
                }
            };
        }

        case ACTION_TYPES.SET_RWD_CHECKOUT_ERRORS: {
            const { error, errorLocation } = payload;

            // Check if error is a string, an object with 'errors' property or an object with 'errorMessages' property
            const errorMessages = typeof error === 'string' ? [error] : error.errors ? Object.values(error.errors).flat() : error.errorMessages || [];

            // Dynamically determine error location
            return {
                ...state,
                rwdCheckoutErrors: {
                    ...state.rwdCheckoutErrors,
                    [errorLocation]: [...state.rwdCheckoutErrors[errorLocation], ...errorMessages]
                }
            };
        }

        case ACTION_TYPES.CLEAR_RWD_CHECKOUT_ERRORS: {
            return {
                ...state,
                rwdCheckoutErrors: {
                    topOfPageBopis: [],
                    topOfPageSad: [],
                    sddZone2: [],
                    bopisZone2: [],
                    gisZone2: [],
                    biBenefitsErrors: []
                }
            };
        }

        case ACTION_TYPES.CLEAR_GISZONE2_ERRORS: {
            return {
                ...state,
                rwdCheckoutErrors: {
                    gisZone2: []
                }
            };
        }

        case ACTION_TYPES.SET_SAME_DAY_DELIVERY_AVAILABLE: {
            return {
                ...state,
                basket: {
                    ...state.basket,
                    isSameDayDeliveryAvailable: action.payload
                }
            };
        }

        case ACTION_TYPES.SET_FROM_BAZAAR: {
            //Toggles boolean whether the action came from bazaar modal comp.
            return {
                ...state,
                fromBazaar: action.payload
            };
        }

        default:
            return state;
    }
};

reducer.ACTION_TYPES = ACTION_TYPES;

export default reducer;
