/* describe('Basket Actions', () => {
    let basketConstants;
    let BasketType;
    const { createSpy, any } = jasmine;
    let AddToBasketActions;
    let RwdBasketActions;
    let InlineBasketActions;
    let beautyInsiderActions;
    let rewardActions;
    let birbActions;
    let basketUtils;
    let skuUtils;
    let skuHelpers;
    let Location;
    let basketApi;
    let orderUtils;
    let setCustomUserAttributeStub;
    let SAMPLE_ORDER_ID;
    let SAMPLE_QUANTITY;
    let SAMPLE_SKU_ID;
    let sampleBasketData;
    let analyticsContext;
    let productId;
    let successCallback;
    let resolvedData;
    let rejectedData;
    let dispatch;
    let isBasketPageStub;
    let isBIPageStub;
    let isBIRBPageStub;
    let isRopisSku;

    beforeEach(() => {
        basketConstants = require('constants/Basket').default;
        BasketType = require('constants/Basket').default.BasketType;
        AddToBasketActions = require('actions/AddToBasketActions').default;
        RwdBasketActions = require('actions/RwdBasketActions');
        InlineBasketActions = require('actions/InlineBasketActions').default;
        beautyInsiderActions = require('actions/BeautyInsiderActions').default;
        rewardActions = require('actions/RewardActions').default;
        birbActions = require('actions/BIRBActions').default;
        basketUtils = require('utils/Basket').default;
        skuUtils = require('utils/Sku').default;
        skuHelpers = require('utils/skuHelpers').default;
        Location = require('utils/Location').default;
        basketApi = require('services/api/basket').default;
        orderUtils = require('utils/Order').default;

        SAMPLE_ORDER_ID = 1;
        SAMPLE_QUANTITY = 12;
        SAMPLE_SKU_ID = 111;
        analyticsContext = { productId: 'P123456' };
        productId = 'P123456';
        successCallback = createSpy();
        resolvedData = {};
        rejectedData = {};
        dispatch = createSpy();

        sampleBasketData = {
            rewards: [],
            promos: [],
            appliedPromotions: [],
            samples: [],
            products: [],
            subtotal: '$0.00',
            rawSubTotal: '$0.00',
            promoMessage: undefined,
            promoWarning: undefined,
            replenishmentDiscountAmount: ''
        };

        isRopisSku = false;

        isBasketPageStub = spyOn(Location, 'isBasketPage').and.returnValue(false);
        spyOn(basketUtils, 'catchItemLevelErrors');
        spyOn(basketUtils, 'getOrderId').and.returnValue(SAMPLE_ORDER_ID);
        spyOn(orderUtils, 'isPlayOrder').and.returnValue(false);
        spyOn(orderUtils, 'isPlayEditOrder').and.returnValue(false);

        setCustomUserAttributeStub = createSpy();

        global.braze = {
            getUser: function () {
                return { setCustomUserAttribute: setCustomUserAttributeStub };
            },
            logCustomEvent: createSpy()
        };
    });

    describe('dispatchRemoveFromBasket function', () => {
        it('should dispatch a custom event when invoked', () => {
            const dispatchEventStub = spyOn(window, 'dispatchEvent');
            const skuData = {
                sku: {
                    productId: 'P12345',
                    productName: 'Lorem Ipsum Product Name',
                    brandName: 'Lorem Ipsum Brand Name',
                    variantValue: 'Lorem ipsum variant value',
                    quantity: 3,
                    price: '12.00'
                }
            };
            const anaConsts = require('analytics/constants').default;
            AddToBasketActions.dispatchRemoveFromBasket(window, skuData);
            expect(dispatchEventStub.calls.first().args[0]).toEqual(jasmine.objectContaining({ type: anaConsts.EVENT_NAMES.REMOVE_FROM_BASKET }));
        });
    });

    describe('Update Basket', () => {
        beforeEach(() => {
            Sephora.analytics.promises.brazeIsReady = {
                then: function (callback) {
                    callback();
                }
            };
        });

        it('should return action with type UPDATE_BASKET', () => {
            const actionResponse = RwdBasketActions.updateBasket({ newBasket: { key: 'value' } });
            expect(actionResponse.type).toEqual(AddToBasketActions.TYPES.UPDATE_BASKET);
        });
    });

    describe('Add Product to Basket', () => {
        let productSku;

        beforeEach(() => {
            productSku = {
                skuId: SAMPLE_SKU_ID,
                type: 'standard',
                productId: productId,
                salePrice: '55.00',
                listPrice: '80.00'
            };

            spyOn(skuUtils, 'isBiReward').and.returnValue(false);
            spyOn(skuUtils, 'isSample').and.returnValue(false);
            spyOn(skuUtils, 'isPDPSample').and.returnValue(false);
            spyOn(basketUtils, 'calculateUpdatedBasket').and.returnValue(sampleBasketData);
        });

        describe('when addToCart resolves', () => {
            beforeEach(() => {
                resolvedData = {
                    items: [{ sku: productSku }],
                    itemsByBasket: [{}]
                };
                spyOn(basketApi, 'addToCart').and.returnValue(Promise.resolve(resolvedData));
            });

            it('should call basketApi.addToCart method', () => {
                AddToBasketActions.addToBasket(
                    productSku,
                    BasketType.Standard,
                    SAMPLE_QUANTITY,
                    successCallback,
                    analyticsContext,
                    false,
                    {},
                    false,
                    false,
                    '',
                    productId
                )(dispatch);

                expect(basketApi.addToCart).toHaveBeenCalledWith(
                    {
                        orderId: SAMPLE_ORDER_ID,
                        skuList: [
                            {
                                isAcceptTerms: false,
                                qty: SAMPLE_QUANTITY,
                                skuId: SAMPLE_SKU_ID,
                                replenishmentSelected: false,
                                replenishmentFrequency: '',
                                productId: productId
                            }
                        ],
                        fulfillmentType: null
                    },
                    false
                );
            });

            it('should call basketApi.addToCart with includeAllBasketItems on basket page', () => {
                isBasketPageStub.and.returnValue(true);
                AddToBasketActions.addToBasket(
                    productSku,
                    BasketType.Standard,
                    SAMPLE_QUANTITY,
                    successCallback,
                    analyticsContext,
                    false,
                    {},
                    false,
                    false,
                    '',
                    productId
                )(dispatch);

                expect(basketApi.addToCart).toHaveBeenCalledWith(
                    {
                        orderId: SAMPLE_ORDER_ID,
                        skuList: [
                            {
                                isAcceptTerms: false,
                                qty: SAMPLE_QUANTITY,
                                skuId: SAMPLE_SKU_ID,
                                replenishmentSelected: false,
                                replenishmentFrequency: '',
                                productId: productId
                            }
                        ],
                        fulfillmentType: null
                    },
                    true
                );
            });

            it('should call calculated Basket function', done => {
                AddToBasketActions.addToBasket(
                    productSku,
                    isRopisSku,
                    SAMPLE_ORDER_ID,
                    successCallback,
                    analyticsContext
                )(dispatch).then(() => {
                    expect(basketUtils.calculateUpdatedBasket).toHaveBeenCalledWith(resolvedData);
                    done();
                });
            });

            it('should return updated basket', done => {
                AddToBasketActions.addToBasket(
                    productSku,
                    isRopisSku,
                    SAMPLE_ORDER_ID,
                    successCallback,
                    analyticsContext
                )(dispatch).then(basketData => {
                    expect(basketData).toEqual({
                        basket: sampleBasketData,
                        type: AddToBasketActions.TYPES.UPDATE_BASKET,
                        clearError: true
                    });
                    done();
                });
            });

            it('should call success callback', done => {
                AddToBasketActions.addToBasket(
                    productSku,
                    isRopisSku,
                    SAMPLE_ORDER_ID,
                    successCallback,
                    analyticsContext
                )(dispatch).then(() => {
                    expect(successCallback).toHaveBeenCalledTimes(1);
                    done();
                });
            });

            describe('Add product to basket subdescribe', () => {
                it('should return justAddedProducts updated', done => {
                    const addedProducts = 3;
                    const action = InlineBasketActions.addedProductsNotification(addedProducts);

                    expect(action).toEqual({
                        type: InlineBasketActions.TYPES.ADDED_PRODUCTS_NOTIFICATION,
                        justAddedProducts: addedProducts
                    });
                    done();
                });

                it('should be resetable', done => {
                    const defaultAddedProducts = 0;
                    const action = InlineBasketActions.addedProductsNotification(defaultAddedProducts);

                    expect(action).toEqual({
                        type: InlineBasketActions.TYPES.ADDED_PRODUCTS_NOTIFICATION,
                        justAddedProducts: defaultAddedProducts
                    });
                    done();
                });
            });

            describe('Just added products', () => {
                it('should be resetable', done => {
                    const defaultAddedProducts = 0;
                    const action = InlineBasketActions.addedProductsNotification(defaultAddedProducts);

                    expect(action).toEqual({
                        type: InlineBasketActions.TYPES.ADDED_PRODUCTS_NOTIFICATION,
                        justAddedProducts: defaultAddedProducts
                    });
                    done();
                });
            });
        });
    });

    describe('Remove Product from Basket', () => {
        let stubbedRemoveFromBasket;

        beforeEach(() => {
            sampleBasketData = {
                itemCount: 1,
                items: [
                    {
                        sku: {
                            skuId: 1,
                            type: skuUtils.skuTypes.STANDARD,
                            primaryProduct: { productId: 'P12345' }
                        }
                    }
                ]
            };

            resolvedData = sampleBasketData;

            rejectedData = { errors: {} };
        });

        function mockBasketActions(shouldResolve = true, dataMixin = {}) {
            if (shouldResolve) {
                stubbedRemoveFromBasket = Promise.resolve({
                    ...resolvedData,
                    ...dataMixin
                });
            } else {
                // eslint-disable-next-line prefer-promise-reject-errors
                stubbedRemoveFromBasket = Promise.reject({
                    ...rejectedData,
                    ...dataMixin
                });
            }

            spyOn(skuUtils, 'isBiReward').and.returnValue(false);
            spyOn(skuUtils, 'isSample').and.returnValue(false);
            spyOn(basketApi, 'removeSkuFromBasket').and.returnValue(stubbedRemoveFromBasket);
            spyOn(AddToBasketActions, 'showError');
        }

        it('should call dispatch show basket error with promo warnings if any', done => {
            mockBasketActions(true, {
                ...resolvedData,
                basketLevelMessages: [
                    {
                        messageContext: basketConstants.PROMO_WARNING,
                        messages: ['some message']
                    }
                ]
            });

            const promise = AddToBasketActions.removeProductFromBasket({ sku: sampleBasketData.items[0] })(dispatch);
            promise.then(() => {
                expect(dispatch.calls.all()[1].args[0]).toEqual({
                    type: 'SHOW_BASKET_ERROR',
                    isPickup: false,
                    itemsAndErrors: null,
                    error: {
                        0: 'some message',
                        errorMessages: ['some message']
                    }
                });
                done();
            });
        });
    });

    describe('Add Multiple Skus To Basket', () => {
        let productsSku;
        // let calculateUpdatedBasketStub;

        beforeEach(() => {
            productsSku = [
                {
                    skuId: 111,
                    qty: 1,
                    type: 'standard',
                    isAcceptTerms: false
                },
                {
                    skuId: 222,
                    qty: 1,
                    type: 'standard',
                    isAcceptTerms: false
                }
            ];

            spyOn(skuUtils, 'isBiReward').and.returnValue(false);
            spyOn(skuUtils, 'isSample').and.returnValue(false);

            // calculateUpdatedBasketStub = spyOn(basketUtils, 'calculateUpdatedBasket').and.returnValue(sampleBasketData);
        });

        it('should call basketApi.addToCart method', () => {
            const response = {
                items: [{}, {}],
                itemsByBasket: [{}]
            };
            spyOn(basketApi, 'addToCart').and.returnValue(Promise.resolve(response));
            AddToBasketActions.addMultipleSkusToBasket(productsSku, 2, successCallback, analyticsContext, (productId = ''))(dispatch);

            expect(basketApi.addToCart).toHaveBeenCalledWith({
                orderId: SAMPLE_ORDER_ID,
                skuList: [
                    {
                        isAcceptTerms: false,
                        qty: 1,
                        skuId: 111,
                        productId: productId
                    },
                    {
                        isAcceptTerms: false,
                        qty: 1,
                        skuId: 222,
                        productId: productId
                    }
                ]
            });
        });

        // TODO: Error: An asynchronous spec, beforeEach, or afterEach function called its 'done' callback more than once.
        // it('should call successCallback', done => {
        //     const fakePromise = {
        //         then: function (resolve) {
        //             resolve({ items: [{}, {}] });

        //             expect(successCallback).toHaveBeenCalledTimes(1);

        //             done();

        //             return fakePromise;
        //         },
        //         catch: function () {
        //             return function () {};
        //         }
        //     };

        //     spyOn(basketApi, 'addToCart').and.returnValue(fakePromise);
        //     AddToBasketActions.addMultipleSkusToBasket(productsSku, 2, successCallback, analyticsContext)(dispatch);
        // });

        // TODO: Error: An asynchronous spec, beforeEach, or afterEach function called its 'done' callback more than once.
        // it('should call calculateUpdatedBasket', done => {
        //     const fakePromise = {
        //         then: function (resolve) {
        //             resolve({ items: [{}, {}] });

        //             expect(calculateUpdatedBasketStub).toHaveBeenCalledWith({ items: [{}, {}] });

        //             done();

        //             return fakePromise;
        //         },
        //         catch: function () {
        //             return function () {};
        //         }
        //     };

        //     spyOn(basketApi, 'addToCart').and.returnValue(fakePromise);
        //     AddToBasketActions.addMultipleSkusToBasket(productsSku, 2, successCallback, analyticsContext)(dispatch);
        // });
    });

    // TODO: inject-loader is not supported anymore
    // describe('Add Reward to Basket', () => {
    //     const REWARD_SKU_ID = 1;
    //     let rewardSku;
    //     const mockedBasketActionsInjector = require('inject-loader!actions/AddToBasketActions');
    //     let stubbedAddBiRewardsToCart, mockedBasketActions;

    //     beforeEach(() => {
    //         rewardSku = {
    //             skuId: REWARD_SKU_ID,
    //             biType: '100 points',
    //             type: 'standard'
    //         };

    //         resolvedData = {
    //             basket: sampleBasketData,
    //             biRewards: [{ skuId: REWARD_SKU_ID }]
    //         };

    //         rejectedData = { errors: {} };
    //     });

    //     function mockBasketActions(shouldResolve = true) {
    //         if (shouldResolve) {
    //             stubbedAddBiRewardsToCart = createSpy().and.returnValue(Promise.resolve(resolvedData));
    //         } else {
    //             stubbedAddBiRewardsToCart = createSpy().and.returnValue(Promise.reject(rejectedData));
    //         }

    //         mockedBasketActions = mockedBasketActionsInjector({ 'services/api/beautyInsider/addBiRewardsToCart': stubbedAddBiRewardsToCart });
    //     }

    //     it('should return proper type, basket, rewards and point information', done => {
    //         mockBasketActions();

    //         mockedBasketActions
    //             .addToBasket(
    //                 rewardSku,
    //                 isRopisSku,
    //                 SAMPLE_ORDER_ID,
    //                 successCallback,
    //                 analyticsContext
    //             )(dispatch)
    //             .then(() => {
    //                 expect(dispatch).toHaveBeenCalledWith({
    //                     type: AddToBasketActions.TYPES.UPDATE_BASKET,
    //                     basket: sampleBasketData,
    //                     clearError: true
    //                 });

    //                 done();
    //             });
    //     });

    //     it('should call success callback', done => {
    //         mockBasketActions();

    //         mockedBasketActions
    //             .addToBasket(
    //                 rewardSku,
    //                 isRopisSku,
    //                 SAMPLE_ORDER_ID,
    //                 successCallback,
    //                 analyticsContext
    //             )(dispatch)
    //             .then(() => {
    //                 expect(successCallback).toHaveBeenCalledTimes(1);
    //                 done();
    //             });
    //     });

    //     it('should return error for soft error response', done => {
    //         mockBasketActions(false);

    //         mockedBasketActions
    //             .addToBasket(
    //                 rewardSku,
    //                 isRopisSku,
    //                 SAMPLE_ORDER_ID,
    //                 successCallback,
    //                 analyticsContext
    //             )(dispatch)
    //             .catch(() => {
    //                 expect(dispatch).toHaveBeenCalledWith({
    //                     type: mockedBasketActions.TYPES.SHOW_BASKET_ERROR,
    //                     isPickup: false,
    //                     error: { errorMessages: [] },
    //                     itemsAndErrors: null
    //                 });
    //                 done();
    //             });
    //     });
    // });

    // TODO: inject-loader is not supported anymore
    // describe('Remove Reward from Basket', () => {
    //     let rewardSku;
    //     const mockedBasketActionsInjector = require('inject-loader!actions/AddToBasketActions');
    //     let stubbedRemoveBiRewardFromBasket, mockedBasketActions, newSkuUtils;

    //     beforeEach(() => {
    //         sampleBasketData = {
    //             itemCount: 1,
    //             items: [
    //                 {
    //                     sku: {
    //                         skuId: 1,
    //                         type: skuUtils.skuTypes.STANDARD,
    //                         primaryProduct: { productId: 'P12345' }
    //                     }
    //                 }
    //             ]
    //         };

    //         rewardSku = {
    //             skuId: SAMPLE_SKU_ID,
    //             biType: '100 points',
    //             type: skuUtils.skuTypes.STANDARD,
    //             isInBasket: true
    //         };

    //         resolvedData = {
    //             basket: sampleBasketData,
    //             biRewards: [{ skuId: 1 }]
    //         };

    //         rejectedData = { errors: {} };
    //     });

    //     function mockBasketActions(shouldResolve = true) {
    //         if (shouldResolve) {
    //             stubbedRemoveBiRewardFromBasket = createSpy().and.returnValue(Promise.resolve(resolvedData));
    //         } else {
    //             stubbedRemoveBiRewardFromBasket = createSpy().and.returnValue(Promise.reject(rejectedData));
    //         }

    //         mockedBasketActions = mockedBasketActionsInjector({
    //             'services/api/beautyInsider/removeBiRewardFromBasket': stubbedRemoveBiRewardFromBasket
    //         });

    //         newSkuUtils = require('utils/Sku').default;
    //         spyOn(newSkuUtils, 'isBiReward').and.returnValue(true);
    //         spyOn(newSkuUtils, 'isInBasket').and.returnValue(true);
    //     }

    //     it('should call removeRewardFromBasket method', () => {
    //         mockBasketActions();

    //         mockedBasketActions.addToBasket(
    //             rewardSku,
    //             isRopisSku,
    //             SAMPLE_ORDER_ID,
    //             () => {},
    //             'analyticsContext',
    //             false,
    //             {},
    //             false,
    //             false,
    //             '',
    //             productId
    //         )(dispatch);

    //         expect(stubbedRemoveBiRewardFromBasket).toHaveBeenCalledWith(SAMPLE_ORDER_ID, SAMPLE_SKU_ID, productId);
    //     });

    //     // TODO: uncomment once done with Stackable Promo scope
    //     /**
    //      *it('should return proper type, basket, rewards and point information', done => {
    //         mockBasketActions();

    //         newSkuUtils.isBiReward.restore();

    //         mockedBasketActions
    //             .addToBasket(rewardSku, SAMPLE_ORDER_ID, successCallback, analyticsContext)(
    //                 dispatch
    //             )
    //             .then(() => {
    //                 expect(newSkuUtils.isInBasket).toHaveBeenCalledOnce();
    //                 expect(newBasketUtils.getOrderId).toHaveBeenCalledOnce();
    //                 expect(dispatch).toHaveBeenCalledWith({
    //                     type: AddToBasketActions.TYPES.UPDATE_BASKET,
    //                     basket: {
    //                         promoMessage: undefined,
    //                         promoWarning: undefined,
    //                         isInitialized: true,
    //                         itemCount: 1,
    //                         items: [
    //                             {
    //                                 sku: {
    //                                     skuId: 1,
    //                                     type: skuUtils.skuTypes.STANDARD
    //                                 }
    //                             }
    //                         ],
    //                         rewards: [],
    //                         promos: [],
    //                         appliedPromotions: [],
    //                         samples: [],
    //                         products: [
    //                             {
    //                                 sku: {
    //                                     skuId: 1,
    //                                     type: skuUtils.skuTypes.STANDARD
    //                                 }
    //                             }
    //                         ]
    //                     }
    //                 });
    //                 done();
    //             });
    //     });
    //      */

//     it('should return error for soft error response', done => {
//         mockBasketActions(false);

//         mockedBasketActions
//             .addToBasket(
//                 rewardSku,
//                 isRopisSku,
//                 SAMPLE_ORDER_ID,
//                 successCallback,
//                 analyticsContext
//             )(dispatch)
//             .catch(() => {
//                 expect(dispatch).toHaveBeenCalledWith({
//                     type: AddToBasketActions.TYPES.SHOW_BASKET_ERROR,
//                     isPickup: false,
//                     error: { errorMessages: [] },
//                     itemsAndErrors: null
//                 });

//                 done();
//             });
//     });
// });
/*
    describe('Add Samples to Basket', () => {
        const sampleSkuData = {
            skuId: 1234,
            type: 'Sample'
        };

        const samplesListStub = [
            {
                sku: {
                    skuId: 1,
                    type: 'Sample'
                }
            },
            {
                sku: {
                    skuId: 2,
                    type: 'Sample'
                }
            }
        ];

        sampleBasketData = {
            itemCount: 1,
            items: samplesListStub
        };

        beforeEach(() => {
            resolvedData = {
                isInitialized: true,
                basket: sampleBasketData,
                rewards: [],
                promos: [],
                samples: [],
                products: [],
                promoMessage: undefined,
                promoWarning: undefined,
                replenishmentDiscountAmount: ''
            };

            const store = require('store/Store').default;
            spyOn(store, 'getState').and.returnValue({ basket: { samples: samplesListStub } });

            spyOn(skuUtils, 'isBiReward').and.returnValue(false);
            spyOn(skuUtils, 'isSample').and.returnValue(true);
            spyOn(skuHelpers, 'isInBasket').and.returnValue(false);

            spyOn(basketApi, 'addSamplesToBasket').and.returnValue(Promise.resolve(resolvedData));
        });

        it('should return the updated basket', done => {
            AddToBasketActions.addToBasket(
                sampleSkuData,
                isRopisSku,
                1,
                () => {},
                analyticsContext
            )(function (obj) {
                if (obj.type === AddToBasketActions.TYPES.UPDATE_BASKET) {
                    expect(obj).toEqual({
                        type: AddToBasketActions.TYPES.UPDATE_BASKET,
                        clearError: true,
                        basket: resolvedData
                    });
                    done();
                } else if (obj.type === AddToBasketActions.ADDED_PRODUCTS_NOTIFICATION) {
                    expect(obj).toEqual({
                        type: AddToBasketActions.TYPES.ADDED_PRODUCTS_NOTIFICATION,
                        justAddedProducts: 1
                    });
                    done();
                }
            });
        });

        it('should call basketApi.addSamplesToBasket method', () => {
            AddToBasketActions.addToBasket(sampleSkuData, isRopisSku, SAMPLE_ORDER_ID, successCallback, analyticsContext)(dispatch);
            expect(basketApi.addSamplesToBasket).toHaveBeenCalled();
        });
    });

    describe('handleAddToBasketErrorAnalytics method', () => {
        let processEvent;
        let processEventSpy;
        let anaUtils;

        const lastAsyncEvent = {
            pageName: 'pageName',
            previousPage: 'previousPage',
            pageType: 'pageType'
        };

        beforeEach(() => {
            anaUtils = require('analytics/utils').default;
            processEvent = require('analytics/processEvent').default;
            processEventSpy = spyOn(processEvent, 'process');
            spyOn(anaUtils, 'getLastAsyncPageLoadData').and.returnValue(lastAsyncEvent);
        });

        it('should fire analytics call with errors if at BasketPage and showBasketQuickAdd is true', () => {
            isBasketPageStub.and.returnValue(true);
            AddToBasketActions.handleAddToBasketErrorAnalytics({ errorMessages: 'error' }, true);

            expect(processEventSpy).toHaveBeenCalledWith('linkTrackingEvent', {
                data: {
                    bindingMethods: any(Function),
                    fieldErrors: ['basket'],
                    errorMessages: 'error',
                    ...lastAsyncEvent
                }
            });
        });

        it('should not fire analytics call with errors if showBasketQuickAdd is false', () => {
            isBasketPageStub.and.returnValue(true);
            AddToBasketActions.handleAddToBasketErrorAnalytics({ errorMessages: 'error' }, false);

            expect(processEventSpy).not.toHaveBeenCalledWith('linkTrackingEvent', {
                data: {
                    bindingMethods: any(Function),
                    fieldErrors: ['basket'],
                    errorMessages: 'error',
                    ...lastAsyncEvent
                }
            });
        });

        it('should not fire analytics call with errors if not at Basket Page', () => {
            isBasketPageStub.and.returnValue(false);
            AddToBasketActions.handleAddToBasketErrorAnalytics({ errorMessages: 'error' }, true);

            expect(processEventSpy).not.toHaveBeenCalledWith('linkTrackingEvent', {
                data: {
                    bindingMethods: any(Function),
                    fieldErrors: ['basket'],
                    errorMessages: 'error',
                    ...lastAsyncEvent
                }
            });
        });
    });

    describe('Track Item Removal', () => {
        let processEvent;
        let processStub;
        let anaConsts;
        let expectedData;
        let anaUtils;
        let isSampleStub;
        let sku;

        beforeEach(() => {
            anaUtils = require('analytics/utils').default;
            processEvent = require('analytics/processEvent').default;
            anaConsts = require('analytics/constants').default;
            isSampleStub = spyOn(skuUtils, 'isSample');
            isSampleStub.and.returnValue(false);
            processStub = spyOn(processEvent, 'process');
            sku = { productId: 'P123456' };
            const removeFromBasketEvent = require('analytics/bindings/pages/all/removeFromBasketEvent').default;
            expectedData = {
                bindingMethods: [removeFromBasketEvent],
                eventStrings: [anaConsts.Event.SC_REMOVE],
                linkName: 'Remove From Basket',
                sku: {
                    ...sku,
                    isRemoval: true
                },
                actionInfo: 'remove from basket',
                internalCampaign: 'remove from basket',
                isBIRBPageRewardModal: undefined,
                totalBasketCount: undefined,
                basket: undefined
            };
            digitalData.page.attributes.sephoraPageInfo.pageName = 'basket:basket:n/a:*';
        });

        it('should call process with correct args', () => {
            AddToBasketActions.trackItemRemoval({ sku });
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    ...expectedData,
                    pageName: 'basket:basket:n/a:*',
                    previousPage: '',
                    pageDetail: 'basket',
                    world: undefined
                }
            });
        });

        describe('when there is context', () => {
            it('should call process with correct args', () => {
                const quickLookDataMock = {
                    pageName: 'pageName',
                    previousPage: '',
                    pageType: 'basket'
                };
                spyOn(anaUtils, 'getLastAsyncPageLoadData').and.returnValue(quickLookDataMock);
                AddToBasketActions.trackItemRemoval({
                    analyticsContext: 'quicklook',
                    sku
                });
                expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        ...expectedData,
                        ...quickLookDataMock,
                        pageName: 'basket:basket:n/a:*',
                        pageDetail: 'basket'
                    }
                });
            });
        });
        describe('for samples', () => {
            it('should call process with correct args', () => {
                isSampleStub.and.returnValue(true);
                AddToBasketActions.trackItemRemoval({ sku });
                expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        ...expectedData,
                        actionInfo: 'Remove samples from Basket', // Update this line
                        linkName: 'Remove samples from Basket',
                        pageName: 'basket:basket:n/a:*',
                        previousPage: '',
                        pageDetail: 'basket',
                        world: undefined
                    }
                });
            });
        });

        describe('when there is a container title', () => {
            let analyticsData;

            beforeEach(() => {
                analyticsData = { containerTitle: 'containerTitle' };
                digitalData.page.attributes.sephoraPageInfo.pageName = 'basket:basket:n/a:*';
            });

            it('should call process with correct args', () => {
                AddToBasketActions.trackItemRemoval({
                    analyticsData,
                    sku
                });
                expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        ...expectedData,
                        actionInfo: 'containerTitle:remove from basket',
                        internalCampaign: 'containerTitle:P123456:remove from basket',
                        pageName: 'basket:basket:n/a:*',
                        previousPage: '',
                        pageDetail: 'basket',
                        world: undefined
                    }
                });
            });

            describe('and the context is Content Store', () => {
                beforeEach(() => {
                    digitalData.page.attributes.sephoraPageInfo.pageName = 'basket:basket:n/a:*';
                });

                it('should call process with correct args', () => {
                    AddToBasketActions.trackItemRemoval({
                        analyticsData,
                        sku,
                        analyticsContext: anaConsts.CONTEXT.CONTENT_STORE
                    });
                    expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                        data: {
                            ...expectedData,
                            actionInfo: 'remove from basket',
                            internalCampaign: 'containerTitle:P123456:remove from basket',
                            pageName: 'basket:basket:n/a:*',
                            previousPage: '',
                            pageDetail: 'basket',
                            world: undefined
                        }
                    });
                });
            });
        });
        describe('when on Basket page', () => {
            beforeEach(() => {
                isBasketPageStub.and.returnValue(true);
                digitalData.page.attributes.sephoraPageInfo.pageName = 'basket:basket:n/a:*';
            });

            it('should call process and exclude internalCampaign if no containerTitle', () => {
                AddToBasketActions.trackItemRemoval({ sku });
                expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        ...expectedData,
                        internalCampaign: false,
                        pageName: 'basket:basket:n/a:*',
                        previousPage: '',
                        pageDetail: 'basket',
                        world: undefined
                    }
                });
            });
            it('should call process and include internalCampaign if there is a containerTitle', () => {
                const analyticsData = { containerTitle: 'containerTitle' };
                AddToBasketActions.trackItemRemoval({
                    analyticsData,
                    sku
                });
                expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                    data: {
                        ...expectedData,
                        actionInfo: 'containerTitle:remove from basket',
                        internalCampaign: 'containerTitle:P123456:remove from basket',
                        pageName: 'basket:basket:n/a:*',
                        previousPage: '',
                        pageDetail: 'basket',
                        world: undefined
                    }
                });
            });
        });
    });

    describe('fetchRewardsAfterBasketUpdate', () => {
        let fetchRewardsForBI;
        let fetchRewardsForBIRB;
        let fetchProfileRewardsStub;

        beforeEach(() => {
            const store = require('store/Store').default;
            isBIPageStub = spyOn(Location, 'isBIPage');
            isBIRBPageStub = spyOn(Location, 'isBIRBPage');
            fetchRewardsForBI = spyOn(beautyInsiderActions, 'fetchBiRewards');
            fetchRewardsForBIRB = spyOn(birbActions, 'fetchBiRewards');
            fetchProfileRewardsStub = spyOn(rewardActions, 'fetchProfileRewards');
            spyOn(store, 'getState').and.returnValue({
                user: {
                    language: 'EN',
                    profileLocale: 'US'
                }
            });
        });

        it('for BI Page should call fetchBIRewards from beautyInsiderActions', () => {
            isBIPageStub.and.returnValue(true);
            AddToBasketActions.fetchRewardsAfterBasketUpdate(dispatch);
            expect(fetchRewardsForBI).toHaveBeenCalledTimes(1);
        });

        it('for BIRB Page should call fetchBIRewards from BIRBActions', () => {
            isBIRBPageStub.and.returnValue(true);
            AddToBasketActions.fetchRewardsAfterBasketUpdate(dispatch);
            expect(fetchRewardsForBIRB).toHaveBeenCalledTimes(1);
        });

        it('for Basket Page should call fetchProfileRewards', () => {
            isBasketPageStub.and.returnValue(true);
            AddToBasketActions.fetchRewardsAfterBasketUpdate(dispatch);
            expect(fetchProfileRewardsStub).toHaveBeenCalledTimes(1);
        });
    });
});
 */
