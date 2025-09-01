/* eslint-disable no-unused-vars */
const { objectContaining } = jasmine;

describe('Basket utils', () => {
    const store = require('Store').default;
    const basketUtils = require('utils/Basket').default;
    const skuUtils = require('utils/Sku').default;
    const storage = require('utils/localStorage/Storage').default;
    const { BASKET_TYPES } = require('actions/AddToBasketActions').default;

    let getStateStub;

    const standardItem = { sku: { type: 'standard' } };

    const gwpItem = { sku: { type: 'gwp' } };

    const welcomeKit = { sku: { biType: 'welcome kit' } };

    const birthdayGift = { sku: { biType: 'birthday gift' } };

    const sampleItem = { sku: { type: 'sample' } };

    const rewardItem = { sku: { biType: '100 points' } };

    const flashItem = { sku: { type: 'flash sku' } };

    const hazMatItem = { sku: { isHazmat: true } };

    const prop65Item = { sku: { isProp65: true } };

    const paypalRestrictedItem = { sku: { isPaypalRestricted: true } };

    const availableItem = { sku: { isOutOfStock: false } };

    const outOfStockItem = { sku: { isOutOfStock: true } };

    beforeEach(function () {
        getStateStub = spyOn(store, 'getState');
    });

    describe('Is there a welcome kit in the bakset', () => {
        it('returns true when welcome kit is in basket', function () {
            getStateStub.and.returnValue({ basket: { items: [gwpItem, welcomeKit] } });

            expect(basketUtils.hasWelcomeKit()).toBeTruthy();
        });

        it('returns false for empty basket', function () {
            getStateStub.and.returnValue({ basket: { items: [] } });

            expect(basketUtils.hasWelcomeKit()).toBeFalsy();
        });

        it('returns flase for basket with no welcome kit items', function () {
            getStateStub.and.returnValue({ basket: { items: [sampleItem] } });

            expect(basketUtils.hasWelcomeKit()).toBeFalsy();
        });
    });

    describe('Is there a birthday gift in the bakset', () => {
        it('returns true when birthday gift is in basket', function () {
            getStateStub.and.returnValue({ basket: { items: [birthdayGift] } });

            expect(basketUtils.hasBirthdayGift()).toBeTruthy();
        });

        it('returns false for empty basket', function () {
            getStateStub.and.returnValue({ basket: { items: [] } });

            expect(basketUtils.hasBirthdayGift()).toBeFalsy();
        });

        it('returns flase for basket with no birthday gift items', function () {
            getStateStub.and.returnValue({ basket: { items: [sampleItem] } });

            expect(basketUtils.hasBirthdayGift()).toBeFalsy();
        });
    });

    describe('isOnlySamplesRewardsInBasket', () => {
        it('should return False if there are other products than Samples or Rewards', () => {
            getStateStub.and.returnValue({ basket: { items: [rewardItem, standardItem, sampleItem] } });

            expect(basketUtils.isOnlySamplesRewardsInBasket()).toBeFalsy();
        });

        it('should return True if there are only Samples or Rewards in basket', () => {
            getStateStub.and.returnValue({ basket: { items: [rewardItem, sampleItem] } });

            expect(basketUtils.isOnlySamplesRewardsInBasket()).toBeTruthy();
        });
    });

    describe('isHazardous', () => {
        it('returns True if there are Hazardous Materials or Prop65 in basket', function () {
            getStateStub.and.returnValue({ basket: { items: [hazMatItem, prop65Item] } });

            expect(basketUtils.isHazardous()).toBeTruthy();
        });

        it('returns False if there are no Hazardous Materials or Prop65 in basket', function () {
            getStateStub.and.returnValue({ basket: { items: [flashItem, standardItem, sampleItem] } });

            expect(basketUtils.isHazardous()).toBeFalsy();
        });
    });

    describe('containsRestrictedItem', () => {
        let getItemStub;

        beforeEach(() => {
            getItemStub = spyOn(storage.local, 'getItem');
        });
        it('returns True if there are PayPal restricted items in basket', function () {
            getItemStub.and.returnValue(BASKET_TYPES.DC_BASKET);
            getStateStub.and.returnValue({ basket: { items: [paypalRestrictedItem] } });

            expect(basketUtils.containsRestrictedItem()).toBeTruthy();
        });

        it('returns False if there are no PayPal restricted items in basket', function () {
            getItemStub.and.returnValue(BASKET_TYPES.DC_BASKET);
            getStateStub.and.returnValue({ basket: { items: [flashItem, standardItem, sampleItem] } });

            expect(basketUtils.containsRestrictedItem()).toBeFalsy();
        });

        it('returns True if there are PayPal restricted items in pickup basket', function () {
            getItemStub.and.returnValue(BASKET_TYPES.BOPIS_BASKET);
            getStateStub.and.returnValue({ basket: { pickupBasket: { items: [paypalRestrictedItem] } } });

            expect(basketUtils.containsRestrictedItem()).toBeTruthy();
        });

        it('returns False if there are no PayPal restricted items in pickup basket', function () {
            getItemStub.and.returnValue(BASKET_TYPES.BOPIS_BASKET);
            getStateStub.and.returnValue({ basket: { pickupBasket: { items: [flashItem, standardItem, sampleItem] } } });

            expect(basketUtils.containsRestrictedItem()).toBeFalsy();
        });
    });

    describe('getAvailableBiPoints', () => {
        it('returns the number of available BI points', function () {
            getStateStub.and.returnValue({ basket: { netBeautyBankPointsAvailable: 200 } });
            expect(basketUtils.getAvailableBiPoints()).toEqual(200);
        });

        it('returns the number of available BI points and not a negative value', function () {
            getStateStub.and.returnValue({ basket: { netBeautyBankPointsAvailable: -200 } });
            expect(basketUtils.getAvailableBiPoints()).toEqual(0);
        });

        it('returns the number of available BI points', function () {
            getStateStub.and.returnValue({ basket: { netBeautyBankPointsAvailable: 200 } });
            expect(basketUtils.getAvailableBiPoints(true)).toEqual(200);
        });

        it('returns the number of available BI points even with negative value', function () {
            getStateStub.and.returnValue({ basket: { netBeautyBankPointsAvailable: -200 } });
            expect(basketUtils.getAvailableBiPoints(true)).toEqual(-200);
        });
    });

    describe('getPotentialBiPoints', () => {
        it('returns the number of available BI points', function () {
            getStateStub.and.returnValue({ basket: { potentialBeautyBankPoints: 200 } });
            expect(basketUtils.getPotentialBiPoints()).toEqual(200);
        });

        it('returns the number of available BI points and not a negative value', function () {
            getStateStub.and.returnValue({ basket: { potentialBeautyBankPoints: -200 } });
            expect(basketUtils.getPotentialBiPoints()).toEqual(0);
        });
    });

    describe('getSkuIdsItemsLocalStorage', () => {
        let getItemStub;

        beforeEach(() => {
            getItemStub = spyOn(storage.local, 'getItem');
        });

        it('should return an array of sku ids if the basket has items', () => {
            getItemStub.and.returnValue({ items: [{ sku: { skuId: 1 } }, { sku: { skuId: 2 } }, { sku: { skuId: 3 } }] });

            expect(basketUtils.getSkuIdsItemsLocalStorage()).toEqual([1, 2, 3]);
        });

        it('should return empty array if basket does not have items', () => {
            getItemStub.and.returnValue({ items: [] });
            expect(basketUtils.getSkuIdsItemsLocalStorage()).toEqual([]);
        });
    });

    describe('getBrandsItemsLocalStorage', () => {
        let getItemStub;
        let skus;

        beforeEach(() => {
            skus = [];
            getItemStub = spyOn(storage.local, 'getItem');
        });

        it('should return an array of brand names if the basket has items', () => {
            skus = [{ sku: { brandName: 'my brand 1' } }, { sku: { brandName: 'my brand 2' } }, { sku: { brandName: 'my brand 3' } }];
            getItemStub.and.returnValue({ items: skus });

            expect(basketUtils.getBrandsItemsLocalStorage()).toEqual(skus);
        });

        it('should return an empty array if basket does not have items', () => {
            getItemStub.and.returnValue({ items: [] });
            expect(basketUtils.getBrandsItemsLocalStorage()).toEqual([]);
        });
    });

    describe('shippingAddressOverride', () => {
        const displayName = 'Sephora Store';
        const address = {
            address1: 'First line',
            address2: 'Second line',
            city: 'City',
            country: 'US',
            postalCode: '1234',
            state: 'State'
        };
        beforeEach(() => {
            getStateStub.and.returnValue({
                basket: {
                    pickupBasket: {
                        storeDetails: {
                            displayName: displayName,
                            address: { ...address }
                        }
                    }
                }
            });
        });
        it('should return the BOPIS store address in the format required for Braintree/Paypal ', () => {
            const shippingAddress = basketUtils.shippingAddressOverride();
            expect(shippingAddress).toEqual(
                objectContaining({
                    recipientName: `S2S ${displayName}`,
                    line1: address.address1,
                    line2: address.address2,
                    city: address.city,
                    countryCode: address.country,
                    postalCode: address.postalCode,
                    state: address.state
                })
            );
        });
    });

    describe('isDCBasket', () => {
        let getItemStub;

        beforeEach(() => {
            getItemStub = spyOn(storage.local, 'getItem');
        });

        it('should return True if basketType is not set', () => {
            expect(basketUtils.isDCBasket()).toBeTruthy();
        });

        it('should return False if basketType is set to BOPIS_BASKET', () => {
            getItemStub.and.returnValue(BASKET_TYPES.BOPIS_BASKET);
            expect(basketUtils.isDCBasket()).toBeFalsy();
        });

        it('should return True if basketType is DC_BASKET', () => {
            getItemStub.and.returnValue(BASKET_TYPES.DC_BASKET);
            expect(basketUtils.isDCBasket()).toBeTruthy();
        });
    });

    describe('isPickup', () => {
        let getItemStub;

        beforeEach(() => {
            getItemStub = spyOn(storage.local, 'getItem');
        });

        it('should return False if basketType is not set', () => {
            expect(basketUtils.isPickup()).toBeFalsy();
        });

        it('should return True if basketType is set to BOPIS_BASKET', () => {
            getItemStub.and.returnValue(BASKET_TYPES.BOPIS_BASKET);
            expect(basketUtils.isPickup()).toBeTruthy();
        });

        it('should return True if basketType is set to ROPIS_BASKET', () => {
            getItemStub.and.returnValue(BASKET_TYPES.ROPIS_BASKET);
            expect(basketUtils.isPickup()).toBeTruthy();
        });

        it('should return False if basketType is set to DC_BASKET', () => {
            getItemStub.and.returnValue(BASKET_TYPES.DC_BASKET);
            expect(basketUtils.isPickup()).toBeFalsy();
        });
    });

    describe('getCurrentBasketData', () => {
        let getItemStub;
        const initState = {
            basket: {
                items: [{ sku: 1 }, { sku: 2 }, { sku: 3 }],
                pickupBasket: { items: [{ sku: 4 }, { sku: 5 }, { sku: 6 }] }
            }
        };

        beforeEach(() => {
            getItemStub = spyOn(storage.local, 'getItem');
        });

        it('should return items from DC basket', function () {
            getItemStub.and.returnValue(BASKET_TYPES.DC_BASKET);
            getStateStub.and.returnValue(initState);

            expect(basketUtils.getCurrentBasketData()).toEqual(objectContaining(initState.basket));
        });

        it('should return items from pickupBasket is basket is set to BOPIS_BASKET', function () {
            getItemStub.and.returnValue(BASKET_TYPES.BOPIS_BASKET);
            getStateStub.and.returnValue(initState);

            expect(basketUtils.getCurrentBasketData()).toEqual(objectContaining(initState.basket.pickupBasket));
        });

        it('should return items from pickupBasket is basket is set to ROPIS_BASKET', function () {
            getItemStub.and.returnValue(BASKET_TYPES.ROPIS_BASKET);
            getStateStub.and.returnValue(initState);

            expect(basketUtils.getCurrentBasketData()).toEqual(objectContaining(initState.basket.pickupBasket));
        });

        it('should return items from DC basket in nextState', function () {
            getItemStub.and.returnValue(BASKET_TYPES.DC_BASKET);
            getStateStub.and.returnValue(initState);
            const nextState = {
                ...initState,
                basket: {
                    ...initState.basket,
                    items: [{ sku: 7 }, { sku: 8 }, { sku: 9 }]
                }
            };

            expect(basketUtils.getCurrentBasketData(nextState)).toEqual(objectContaining(nextState.basket));
        });

        it('should return items from DC basket in the store when called with undefined', function () {
            getItemStub.and.returnValue(BASKET_TYPES.DC_BASKET);
            getStateStub.and.returnValue(initState);

            expect(basketUtils.getCurrentBasketData(undefined)).toEqual(objectContaining(initState.basket));
        });

        it('should return items from DC basket in the store when called with empty object', function () {
            getItemStub.and.returnValue(BASKET_TYPES.DC_BASKET);
            getStateStub.and.returnValue(initState);

            expect(basketUtils.getCurrentBasketData({})).toEqual(objectContaining(initState.basket));
        });

        it('should return items from DC basket in the store when called with undefined basket', function () {
            getItemStub.and.returnValue(BASKET_TYPES.DC_BASKET);
            getStateStub.and.returnValue(initState);

            expect(basketUtils.getCurrentBasketData({ basket: undefined })).toEqual(objectContaining(initState.basket));
        });

        it('should return items from DC basket in the store when called with empty basket object', function () {
            getItemStub.and.returnValue(BASKET_TYPES.DC_BASKET);
            getStateStub.and.returnValue(initState);

            expect(basketUtils.getCurrentBasketData({ basket: {} })).toEqual(objectContaining(initState.basket));
        });

        it('should return items from pickupBasket in the store when called with undefined', function () {
            getItemStub.and.returnValue(BASKET_TYPES.BOPIS_BASKET);
            getStateStub.and.returnValue(initState);

            expect(basketUtils.getCurrentBasketData(undefined)).toEqual(objectContaining(initState.basket.pickupBasket));
        });

        it('should return items from pickupBasket in the store when called with empty object', function () {
            getItemStub.and.returnValue(BASKET_TYPES.BOPIS_BASKET);
            getStateStub.and.returnValue(initState);

            expect(basketUtils.getCurrentBasketData({})).toEqual(objectContaining(initState.basket.pickupBasket));
        });

        it('should return items from pickupBasket in the store when called with undefined basket', function () {
            getItemStub.and.returnValue(BASKET_TYPES.BOPIS_BASKET);
            getStateStub.and.returnValue(initState);

            expect(basketUtils.getCurrentBasketData({ basket: undefined })).toEqual(objectContaining(initState.basket.pickupBasket));
        });

        it('should return items from pickupBasket in the store when called with empty basket object', function () {
            getItemStub.and.returnValue(BASKET_TYPES.BOPIS_BASKET);
            getStateStub.and.returnValue(initState);

            expect(basketUtils.getCurrentBasketData({ basket: {} })).toEqual(objectContaining(initState.basket.pickupBasket));
        });

        it('should return items from pickupBasket in nextState is basket is set to BOPIS_BASKET', function () {
            getItemStub.and.returnValue(BASKET_TYPES.BOPIS_BASKET);
            getStateStub.and.returnValue(initState);
            const nextState = {
                ...initState,
                basket: {
                    ...initState,
                    pickupBasket: { items: [{ sku: 7 }, { sku: 8 }, { sku: 9 }] }
                }
            };

            expect(basketUtils.getCurrentBasketData(nextState)).toEqual(objectContaining(nextState.basket.pickupBasket));
        });

        it('should return items from pickupBasket in nextState is basket is set to ROPIS_BASKET', function () {
            getItemStub.and.returnValue(BASKET_TYPES.ROPIS_BASKET);
            getStateStub.and.returnValue(initState);
            const nextState = {
                ...initState,
                basket: {
                    ...initState,
                    pickupBasket: { items: [{ sku: 7 }, { sku: 8 }, { sku: 9 }] }
                }
            };

            expect(basketUtils.getCurrentBasketData(nextState)).toEqual(objectContaining(nextState.basket.pickupBasket));
        });
    });

    describe('getLocalPickupItems', () => {
        let getItemStub;

        beforeEach(() => {
            getItemStub = spyOn(storage.local, 'getItem');
        });

        it('should return the number of pickup items as 1', () => {
            getItemStub.and.returnValue({ pickupbasketItemCount: 1 });

            expect(basketUtils.getLocalPickupItems()).toBe(1);
        });

        it('should return the number of pickup items as 0', () => {
            getItemStub.and.returnValue({ pickupbasketItemCount: 0 });
            expect(basketUtils.getLocalPickupItems()).toBe(0);
        });
    });

    describe('removeDuplicateSkus', () => {
        const initState = {
            basket: {
                items: [{ sku: { skuId: 1 } }, { sku: { skuId: 2 } }, { sku: { skuId: 3 } }],
                pickupBasket: { items: [{ sku: { skuId: 1 } }, { sku: { skuId: 5 } }] }
            }
        };

        it('should remove duplicate skus', () => {
            getStateStub.and.returnValue(initState);
            const allItems = [...initState.basket.items, ...initState.basket.pickupBasket.items];
            expect(basketUtils.removeDuplicateSkus(allItems).length).toBe(4);
        });
    });

    describe('getOnlySellableSkus', () => {
        const initState = {
            basket: {
                items: [
                    {
                        sku: {
                            skuId: 1,
                            type: 'sample'
                        }
                    },
                    { sku: { skuId: 2 } },
                    {
                        sku: {
                            skuId: 3,
                            type: 'gwp'
                        }
                    }
                ],
                pickupBasket: {
                    items: [
                        {
                            sku: {
                                skuId: 1,
                                type: 'sample'
                            }
                        },
                        { sku: { skuId: 5 } }
                    ]
                }
            }
        };

        it('should return only sellable skus', () => {
            getStateStub.and.returnValue(initState);
            const allItems = [...initState.basket.items, ...initState.basket.pickupBasket.items];
            expect(basketUtils.getOnlySellableSkus(allItems).length).toBe(2);
        });
    });

    describe('isBasketSwitchAvailable', () => {
        let state;
        let getItemStub;
        beforeEach(() => {
            getItemStub = spyOn(storage.local, 'getItem');
            state = {
                basket: {
                    basketSwitchAvailable: true,
                    pickupBasket: { basketSwitchAvailable: true }
                }
            };
        });

        it('should return true on DC basket', () => {
            getItemStub.and.returnValue(BASKET_TYPES.DC_BASKET);
            getStateStub.and.returnValue(state);
            expect(basketUtils.isBasketSwitchAvailable()).toBe(true);
        });

        it('should return false on DC basket', () => {
            state.basket.basketSwitchAvailable = false;
            getItemStub.and.returnValue(BASKET_TYPES.DC_BASKET);
            getStateStub.and.returnValue(state);
            expect(basketUtils.isBasketSwitchAvailable()).toBe(false);
        });

        it('should return true on BOPIS basket', () => {
            getItemStub.and.returnValue(BASKET_TYPES.BOPIS_BASKET);
            getStateStub.and.returnValue(state);
            expect(basketUtils.isBasketSwitchAvailable()).toBe(true);
        });

        it('should return false on BOPIS basket', () => {
            state.basket.pickupBasket.basketSwitchAvailable = false;
            getItemStub.and.returnValue(BASKET_TYPES.BOPIS_BASKET);
            getStateStub.and.returnValue(state);
            expect(basketUtils.isBasketSwitchAvailable()).toBe(false);
        });
    });

    describe('calculateUpdatedBasket', () => {
        const createItem = ({ skuId, qty }) => ({
            qty: qty || 1,
            sku: { skuId }
        });
        const createShipToHomeBasketType = ({ items, itemsCount }) => ({
            basketType: BASKET_TYPES.STANDARD_BASKET,
            items,
            itemsCount
        });
        const createSameDayBasketType = ({ items, itemsCount }) => ({
            basketType: BASKET_TYPES.SAMEDAY_BASKET,
            items,
            itemsCount
        });

        const emptyBasket = {
            itemCount: 0,
            items: [],
            itemsByBasket: [],
            pickupBasket: {
                items: [],
                itemCount: 0
            },
            pickupbasketItemCount: 0
        };

        describe('Initial State', () => {
            beforeEach(() => {
                getStateStub.and.returnValue({ basket: emptyBasket });
            });

            it('No newBasket should error', () => {
                expect(() => basketUtils.calculateUpdatedBasket()).toThrow(new Error('newBasket is undefined'));
            });

            it('No newItem in newBasket should error', () => {
                expect(() => basketUtils.calculateUpdatedBasket(emptyBasket)).toThrow(
                    new Error('calculateUpdatedBasket called without passing new item')
                );
            });

            it('Add to Empty items', () => {
                const itemByBasket = createSameDayBasketType({
                    items: [createItem({ skuId: 1 })],
                    itemsCount: 1
                });
                const newBasket = {
                    ...emptyBasket,
                    items: [createItem({ skuId: 1 })],
                    itemsByBasket: [itemByBasket],
                    itemCount: 1
                };

                const basket = basketUtils.calculateUpdatedBasket(newBasket);
                newBasket.lastAddedItem = itemByBasket;
                expect(basket).toEqual(newBasket);

                // Basket should be shallow clone
                expect(basket).not.toBe(emptyBasket);
                // Specific deep collections should be cloned (previous bug fixes)
                expect(basket.items).not.toBe(emptyBasket.items);
                expect(basket.itemsByBasket).not.toBe(emptyBasket.itemsByBasket);
            });
        });

        describe('Add to Non-Empty items', () => {
            let item1;
            let item2;

            let initialItemByBasket;
            let newItemByBasket;

            let nonEmptyBasket;

            beforeEach(() => {
                item1 = createItem({ skuId: 1 });
                item2 = createItem({ skuId: 2 });

                initialItemByBasket = createSameDayBasketType({
                    items: [createItem({ skuId: 1 })],
                    itemsCount: 1
                });
                newItemByBasket = createSameDayBasketType({
                    items: [createItem({ skuId: 2 })],
                    itemsCount: 1
                });

                nonEmptyBasket = {
                    ...emptyBasket,
                    items: [item1],
                    itemsByBasket: [initialItemByBasket],
                    lastAddedItem: initialItemByBasket,
                    itemCount: 1
                };
            });

            it('Add item to Basket with existing items', () => {
                getStateStub.and.returnValue({ basket: nonEmptyBasket });

                const newBasket = {
                    ...emptyBasket,
                    items: [item2],
                    itemsByBasket: [newItemByBasket]
                };

                const basket = basketUtils.calculateUpdatedBasket(newBasket);
                expect(basket).toEqual({
                    ...emptyBasket,
                    items: [
                        // expect new item is first
                        item2,
                        item1
                    ],
                    itemsByBasket: [
                        createSameDayBasketType({
                            items: [createItem({ skuId: 2 }), createItem({ skuId: 1 })],
                            itemsCount: 2
                        })
                    ],
                    lastAddedItem: newItemByBasket
                });
            });

            it('Add item to Basket with overlapping items', () => {
                const itemQty2 = createItem({
                    skuId: 1,
                    qty: 2
                });

                const itemByBasketQtyUpdated = createSameDayBasketType({
                    items: [
                        createItem({
                            skuId: 1,
                            qty: 2
                        })
                    ],
                    itemsCount: 2
                });

                getStateStub.and.returnValue({ basket: nonEmptyBasket });

                const newBasket = {
                    ...emptyBasket,
                    items: [itemQty2],
                    itemsByBasket: [itemByBasketQtyUpdated]
                };

                const basket = basketUtils.calculateUpdatedBasket(newBasket);
                itemByBasketQtyUpdated.itemsCount = 2;
                expect(basket).toEqual({
                    ...emptyBasket,
                    items: [itemQty2],
                    itemsByBasket: [itemByBasketQtyUpdated],
                    lastAddedItem: itemByBasketQtyUpdated
                });
            });

            it('itemsByBasket with both Types', () => {
                const shipToHomeByBasketItem = createShipToHomeBasketType({
                    items: [createItem({ skuId: 2 })],
                    itemsCount: 1
                });

                getStateStub.and.returnValue({ basket: nonEmptyBasket });

                const newBasket = {
                    ...emptyBasket,
                    items: [item2],
                    itemsByBasket: [shipToHomeByBasketItem]
                };

                const basket = basketUtils.calculateUpdatedBasket(newBasket);
                expect(basket).toEqual({
                    ...emptyBasket,
                    items: [item2, item1],
                    itemsByBasket: [initialItemByBasket, shipToHomeByBasketItem],
                    lastAddedItem: shipToHomeByBasketItem
                });
            });

            it('itemsByBasket with overlapping items across types', () => {
                const itemQty2 = createItem({
                    skuId: 1,
                    qty: 2
                });

                const itemByBasketQtyUpdated = createShipToHomeBasketType({
                    items: [
                        createItem({
                            skuId: 1,
                            qty: 2
                        })
                    ],
                    itemsCount: 2
                });

                getStateStub.and.returnValue({ basket: nonEmptyBasket });

                const newBasket = {
                    ...emptyBasket,
                    items: [itemQty2],
                    itemsByBasket: [itemByBasketQtyUpdated]
                };

                const basket = basketUtils.calculateUpdatedBasket(newBasket);
                expect(basket).toEqual({
                    ...emptyBasket,
                    items: [itemQty2],
                    itemsByBasket: [itemByBasketQtyUpdated],
                    lastAddedItem: itemByBasketQtyUpdated
                });
            });
        });
    });
    describe('hasSameDayItems', () => {
        let state;
        beforeEach(() => {
            state = { basket: {} };
        });
        it('should return false if there is no Same Day basket', () => {
            getStateStub.and.returnValue(state);
            expect(basketUtils.hasSameDayItems()).toBe(false);
        });
        it('should return false if there are no items in Same Day basket', () => {
            state.basket.itemsByBasket = [{ basketType: BASKET_TYPES.SAMEDAY_BASKET }];
            getStateStub.and.returnValue(state);
            expect(basketUtils.hasSameDayItems()).toBe(false);
        });
        it('should return true if there are items in Same Day basket', () => {
            state.basket.itemsByBasket = [
                {
                    basketType: BASKET_TYPES.SAMEDAY_BASKET,
                    itemsCount: 1
                }
            ];
            getStateStub.and.returnValue(state);
            expect(basketUtils.hasSameDayItems()).toBe(true);
        });
    });

    describe('getNextBasketTypeAuto', () => {
        let state;

        beforeEach(() => {
            state = { basket: {} };
        });

        it('should return DC_BASKET if there is no pickup items in basket', () => {
            getStateStub.and.returnValue(state);
            expect(basketUtils.getNextBasketTypeAuto()).toEqual(BASKET_TYPES.DC_BASKET);
        });

        it('should return PREBASKET if there is pickup items in basket', () => {
            state.basket.pickupBasket = { itemCount: 10 };
            getStateStub.and.returnValue(state);
            expect(basketUtils.getNextBasketTypeAuto()).toEqual(BASKET_TYPES.PREBASKET);
        });

        it('should return DC_BASKET if pickup products were removed from basket', () => {
            state.basket.pickupBasket = { itemCount: 0 };
            getStateStub.and.returnValue(state);
            expect(basketUtils.getNextBasketTypeAuto()).toEqual(BASKET_TYPES.DC_BASKET);
        });
    });
});
