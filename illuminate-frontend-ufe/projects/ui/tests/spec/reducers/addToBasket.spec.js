const basketReducer = require('reducers/addToBasket').default;
const TYPES = require('reducers/addToBasket').default.ACTION_TYPES;

describe('basket reducers', () => {
    it('should return the initial state', () => {
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
        expect(basketReducer(undefined, {})).toEqual(initialState);
    });

    it('should update the state with an error', () => {
        const state = { items: [] };

        const action = {
            type: TYPES.SHOW_BASKET_ERROR,
            error: 'my error'
        };

        const newState = basketReducer(state, action);

        const expected = {
            items: [],
            error: 'my error'
        };

        expect(newState).toEqual(expected);
    });

    it('should update the pickupBasket state with an error', () => {
        const state = {
            items: [],
            pickupBasket: { items: [] }
        };

        const action = {
            type: TYPES.SHOW_BASKET_ERROR,
            error: 'my error',
            isPickup: true
        };

        const newState = basketReducer(state, action);

        const expected = {
            items: [],
            pickupBasket: {
                items: [],
                error: 'my error'
            }
        };

        expect(newState).toEqual(expected);
    });

    it('should update the state with items and errors', () => {
        const newState = basketReducer(
            {},
            {
                type: TYPES.SHOW_BASKET_ERROR,
                error: 'my error',
                itemsAndErrors: [
                    {
                        a: 1,
                        b: 2
                    }
                ]
            }
        );

        const expected = {
            items: [
                {
                    a: 1,
                    b: 2
                }
            ],
            error: 'my error'
        };

        expect(newState).toEqual(expected);
    });

    it('should update the state with a warning message', () => {
        const basketItemWarnings = ['warning message'];
        const newState = basketReducer(
            {},
            {
                type: TYPES.SHOW_BASKET_WARNING,
                basketItemWarnings
            }
        );

        expect(newState).toEqual({ basketItemWarnings });
    });

    it('should update the state with showStickyApplePayBtn', () => {
        const showStickyApplePayBtn = true;
        const newState = basketReducer(
            {},
            {
                type: TYPES.SHOW_STICKY_APPLE_PAY_BTN,
                showStickyApplePayBtn
            }
        );

        expect(newState).toEqual({ showStickyApplePayBtn });
    });

    it('should update the state with showPaypalRestrictedMessage', () => {
        const showPaypalRestrictedMessage = true;
        const newState = basketReducer(
            {},
            {
                type: TYPES.SHOW_PAYPAL_RESTRICTED_MESSAGE,
                showPaypalRestrictedMessage
            }
        );

        expect(newState).toEqual({ showPaypalRestrictedMessage });
    });

    it('should update the state with empty pendingBasketSkus when clear pending sku', () => {
        const pendingBasketSkus = [];
        const newState = basketReducer(
            {},
            {
                type: TYPES.CLEAR_PENDING_SKU,
                pendingBasketSkus
            }
        );

        expect(newState).toEqual({ pendingBasketSkus });
    });
});
