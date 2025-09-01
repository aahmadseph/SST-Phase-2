/* eslint-disable object-curly-newline */
const { createSpy, objectContaining, any } = jasmine;
const {
    LINK_TRACKING_EVENT,
    Event: { EVENT_71 }
} = require('analytics/constants').default;

describe('Promos utils', () => {
    let Location;
    let Store;
    let promosUtils;
    let Actions;
    let UtilActions;
    let basketApi;
    let basketUtils;
    let showInfoModalStub;
    let dispatchStub;
    let PromoActions;
    let applyPromotionStub;

    const promoCodes = [{ couponCode: 'regular_one' }, { couponCode: 'RW_123' }, { couponCode: 'regular_two' }, { couponCode: 'cbr_123' }];
    const storeStub = {
        basket: {
            appliedPromotions: ['promo1'],
            creditCardPromoDetails: 'basket1',
            pickupBasket: {
                appliedPromotions: ['promo1']
            }
        },
        order: {
            orderDetails: {
                promotion: {
                    appliedPromotions: ['promo2']
                },
                items: {
                    creditCardPromoDetails: 'checkout2'
                }
            }
        },
        user: {
            ccRewards: {
                firstPurchaseDiscountEligible: true,
                firstPurchaseDiscountCouponCode: 'creditCardCoupon'
            }
        }
    };

    beforeEach(() => {
        Location = require('utils/Location').default;
        Store = require('store/Store').default;
        promosUtils = require('utils/Promos').default;
        Actions = require('Actions').default;
        UtilActions = require('utils/redux/Actions').default;
        PromoActions = require('actions/PromoActions').default;
        basketApi = require('services/api/basket').default;
        basketUtils = require('utils/Basket').default;

        applyPromotionStub = spyOn(basketApi, 'applyPromotion');
        global.braze = false;
    });

    describe('getPromoType', () => {
        const matchers = ['isRewardPromoCode', 'isCbrPromoCode', 'isPfdPromoCode'];
        let matcherSpies = [];

        const initMatchers = (...initVals) => {
            matcherSpies = matchers.map((name, i) => spyOn(promosUtils, name).and.returnValue(initVals[i]));
        };

        it('should call all matchers', () => {
            initMatchers(false, false, false);
            promosUtils.getPromoType('some_code');
            matcherSpies.forEach(spy => expect(spy).toHaveBeenCalledWith('some_code'));
        });

        it('should return PROMO if all matchers return false', () => {
            initMatchers(false, false, false);
            expect(promosUtils.getPromoType('some_code')).toBe(promosUtils.PROMO_TYPES.PROMO);
        });

        it('should return CCR if corresponding matcher is true', () => {
            initMatchers(true, false, false);
            expect(promosUtils.getPromoType('some_code')).toBe(promosUtils.PROMO_TYPES.CCR);
        });

        it('should not call succeeding matchers if a current one returned true', () => {
            initMatchers(true, false, false);
            promosUtils.getPromoType('some_code');
            expect(matcherSpies[1]).not.toHaveBeenCalled();
        });

        it('should return CBR if corresponding matcher is true', () => {
            initMatchers(false, true);
            expect(promosUtils.getPromoType('some_code')).toBe(promosUtils.PROMO_TYPES.CBR);
        });

        it('should return PFD if corresponding matcher is true', () => {
            initMatchers(false, false, true);
            expect(promosUtils.getPromoType('some_code')).toBe(promosUtils.PROMO_TYPES.PFD);
        });
    });

    describe('isRewardPromoCode', () => {
        it('should return true for CCR code', () => {
            expect(promosUtils.isRewardPromoCode('RW_123')).toBe(true);
        });

        it('should be case insensative', () => {
            expect(promosUtils.isRewardPromoCode('rw_aaa')).toBe(true);
        });

        it('should handle malformed input', () => {
            expect(promosUtils.isRewardPromoCode()).toBe(false);
        });

        it('should return false for non CCR promo codes', () => {
            expect(promosUtils.isRewardPromoCode('arw_aaa')).toBe(false);
        });

        it('should return true for FIRST_INCENTIVE_DISCOUNT', () => {
            expect(promosUtils.isRewardPromoCode(promosUtils.FIRST_INCENTIVE_DISCOUNT)).toBe(true);
        });
    });

    describe('isCbrPromoCode', () => {
        it('should return true for CBR code', () => {
            expect(promosUtils.isCbrPromoCode('CBR_123')).toBe(true);
        });

        it('should be case insensative', () => {
            expect(promosUtils.isCbrPromoCode('cbr_aaa')).toBe(true);
        });

        it('should handle malformed input', () => {
            expect(promosUtils.isCbrPromoCode()).toBe(false);
        });

        it('should return false for non CBR promo codes', () => {
            expect(promosUtils.isCbrPromoCode('_CBR_cbr123')).toBe(false);
        });
    });

    describe('isPfdPromoCode', () => {
        it('should return true for PFD code', () => {
            expect(promosUtils.isPfdPromoCode('PFD_123')).toBe(true);
        });

        it('should be case insensative', () => {
            expect(promosUtils.isPfdPromoCode('pfd_aaa')).toBe(true);
        });

        it('should handle malformed input', () => {
            expect(promosUtils.isPfdPromoCode()).toBe(false);
        });

        it('should return false for non PFD promo codes', () => {
            expect(promosUtils.isPfdPromoCode('_PFD_pfd123')).toBe(false);
        });
    });

    describe('getAppliedPromoCodes', () => {
        let getAppliedPromotionsFunc;

        beforeEach(() => {
            getAppliedPromotionsFunc = spyOn(promosUtils, 'getAppliedPromotions');
        });

        it('should call getAppliedPromotions with type as an argument', () => {
            promosUtils.getAppliedPromoCodes('a type');
            expect(getAppliedPromotionsFunc).toHaveBeenCalledWith('a type');
        });

        it('should return promoCodes extracted form getAppliedPromotions response', () => {
            getAppliedPromotionsFunc.and.returnValue(promoCodes);
            expect(promosUtils.getAppliedPromoCodes('a type')).toEqual(['regular_one', 'RW_123', 'regular_two', 'cbr_123']);
        });
    });

    describe('getAppliedPromotions', () => {
        let getStateFunc;
        let isCheckoutFunc;
        let filterPromotionsFunc;

        beforeEach(() => {
            isCheckoutFunc = spyOn(Location, 'isCheckout');
            getStateFunc = spyOn(Store, 'getState').and.returnValue(storeStub);
            filterPromotionsFunc = spyOn(promosUtils, 'filterPromotions');
        });

        it('should perform tail call of filterPromotions', () => {
            filterPromotionsFunc.and.returnValue('777');
            expect(promosUtils.getAppliedPromotions('any')).toEqual('777');
        });

        describe('with data passsed', () => {
            beforeEach(() => {
                promosUtils.getAppliedPromotions('any', {
                    appliedPromotions: promoCodes
                });
            });

            it('should not call getState', () => {
                expect(getStateFunc).not.toHaveBeenCalled();
            });

            it('should call filterPromotions with correct args', () => {
                expect(filterPromotionsFunc).toHaveBeenCalledWith(promoCodes, 'any');
            });
        });

        describe('on basket page', () => {
            beforeEach(() => {
                isCheckoutFunc.and.returnValue(false);
                promosUtils.getAppliedPromotions('type1');
            });

            it('should call getState', () => {
                expect(getStateFunc).toHaveBeenCalled();
            });

            it('should call filterPromotions with correct args', () => {
                expect(filterPromotionsFunc).toHaveBeenCalledWith(['promo1'], 'type1');
            });
        });

        describe('on checkout page', () => {
            beforeEach(() => {
                isCheckoutFunc.and.returnValue(true);
                promosUtils.getAppliedPromotions('type2');
            });

            it('should call getState', () => {
                expect(getStateFunc).toHaveBeenCalled();
            });

            it('should call filterPromotions with correct args', () => {
                expect(filterPromotionsFunc).toHaveBeenCalledWith(['promo2'], 'type2');
            });
        });
    });

    describe('filterPromotions', () => {
        let isRewardPromoCodeFunc;
        let isCbrPromoCodeFunc;

        beforeEach(() => {
            isRewardPromoCodeFunc = spyOn(promosUtils, 'isRewardPromoCode').and.returnValue(true);
            isCbrPromoCodeFunc = spyOn(promosUtils, 'isCbrPromoCode').and.returnValue(true);
        });

        it('should handle malformed input', () => {
            expect(promosUtils.filterPromotions()).toEqual([]);
        });

        it('should call isCbrPromoCode for CBR type', () => {
            promosUtils.filterPromotions([{ couponCode: 'one' }], promosUtils.PROMO_TYPES.CBR);
            expect(isRewardPromoCodeFunc).not.toHaveBeenCalled();
            expect(isCbrPromoCodeFunc).toHaveBeenCalledWith('one');
        });

        it('should call isRewardPromoCode for CCR type', () => {
            promosUtils.filterPromotions([{ couponCode: 'two' }], promosUtils.PROMO_TYPES.CCR);
            expect(isCbrPromoCodeFunc).not.toHaveBeenCalled();
            expect(isRewardPromoCodeFunc).toHaveBeenCalledWith('two');
        });

        it('should call both filters for PROMO type', () => {
            isCbrPromoCodeFunc.and.returnValue(false);
            isRewardPromoCodeFunc.and.returnValue(false);
            promosUtils.filterPromotions(promoCodes, promosUtils.PROMO_TYPES.PROMO);
            expect(isCbrPromoCodeFunc).toHaveBeenCalledTimes(promoCodes.length);
            expect(isRewardPromoCodeFunc).toHaveBeenCalledTimes(promoCodes.length);
        });
    });

    describe('getCCPromoDetails', () => {
        beforeEach(() => {
            spyOn(Store, 'getState').and.returnValue(storeStub);
        });

        it('should return correct value', () => {
            expect(promosUtils.getCCPromoDetails().creditCardCouponCode).toEqual('creditCardCoupon');
        });
    });

    describe('extractError', () => {
        const promoStub = {
            promoError: {
                errorMessages: ['1', '2'],
                promoCode: '1M$off',
                appliedAt: 'placeA'
            }
        };

        it('should return empty object for malformed input', () => {
            expect(promosUtils.extractError()).toEqual({});
        });

        it('should return correct value if type matches', () => {
            expect(promosUtils.extractError(promoStub, ['placeA'])).toEqual(promoStub.promoError);
        });

        it('should not return value if type does not match', () => {
            expect(promosUtils.extractError(promoStub, ['placeB'])).toEqual({});
        });
    });
    ////revisit these  tests
    describe('ensureSinglePromoAction', () => {
        let promoActionFunc;

        beforeEach(() => {
            promosUtils.promosInProgress = false;
            promoActionFunc = createSpy();
        });

        it('should fire if the lock is not set', () => {
            promosUtils.promosInProgress = false;
            promosUtils.ensureSinglePromoAction(promoActionFunc, 'code1')('code1', 'test');
            expect(promoActionFunc).toHaveBeenCalledWith('code1', 'test');
        });

        it('should not fire if the lock is set', () => {
            promosUtils.promosInProgress = true;
            promosUtils.ensureSinglePromoAction(promoActionFunc, 'code2')('code2');
            expect(promoActionFunc).not.toHaveBeenCalled();
        });

        xit('should set the lock while function is being executed', () => {
            let hasLockBeenSet = false;
            promosUtils.ensureSinglePromoAction(() => {
                hasLockBeenSet = promosUtils.promosInProgress === true;
            }, 'code3')('code3');
            expect(hasLockBeenSet).toEqual(true);
        });

        xit('should release the lock on function execution', () => {
            promosUtils.promosInProgress = true;
            promosUtils.ensureSinglePromoAction(promoActionFunc, 'code5')('code5');
            expect(promosUtils.promosInProgress).toEqual(true);
        });

        it('should release the lock on .then', () => {
            promosUtils.promosInProgress = true;
            const fakePromise = {
                then: resolve => {
                    expect(promosUtils.promosInProgress).toEqual(true);
                    resolve();
                    expect(promosUtils.promosInProgress).toEqual(true);
                }
            };
            promoActionFunc.and.returnValue(fakePromise);
            promosUtils.ensureSinglePromoAction(promoActionFunc, 'code5')('code5');
        });

        it('should release the lock on error', () => {
            promosUtils.promosInProgress = true;
            promoActionFunc = () => {
                throw new TypeError('nothing is defined!');
            };
            promosUtils.ensureSinglePromoAction(promoActionFunc, 'code5')('code5');
            expect(promosUtils.promosInProgress).toEqual(true);
        });
    });

    describe('showWarningMessage', () => {
        beforeEach(() => {
            dispatchStub = spyOn(Store, 'dispatch');
            showInfoModalStub = spyOn(Actions, 'showInfoModal');
            promosUtils.showWarningMessage('some message');
        });

        it('should call dispatch method', () => {
            expect(dispatchStub).toHaveBeenCalledWith(showInfoModalStub());
        });

        it('should call showInfoModal method with value', () => {
            expect(showInfoModalStub).toHaveBeenCalledWith({
                isOpen: true,
                title: 'Promo/Reward Code Warning',
                message: 'some message',
                buttonText: 'OK',
                dataAt: 'promo_warning_popup',
                dataAtTitle: 'promo_warning_title',
                dataAtMessage: 'promo_warning_message'
            });
        });
    });

    describe('sendBrazePromoCodeEvent', () => {
        let logCustomEvent;

        beforeEach(() => {
            logCustomEvent = createSpy('logCustomEvent');
            global.braze = { logCustomEvent };
        });

        it('should log custom event with valid promo code', () => {
            promosUtils.sendBrazePromoCodeEvent('10%off');
            expect(logCustomEvent).toHaveBeenCalledWith('promocodeRedeemed', { promocode: '10%off' });
        });

        it('should not log custom event with CBR promo code', () => {
            promosUtils.sendBrazePromoCodeEvent('CBR_123');
            expect(logCustomEvent).not.toHaveBeenCalled();
        });

        it('should not log custom event with CCR promo code', () => {
            promosUtils.sendBrazePromoCodeEvent('RW_123');
            expect(logCustomEvent).not.toHaveBeenCalled();
        });

        it('should not log custom event with RRC promo code', () => {
            promosUtils.sendBrazePromoCodeEvent('RRC_123');
            expect(logCustomEvent).not.toHaveBeenCalled();
        });

        it('should log custom event with MSG promo code', () => {
            promosUtils.sendBrazePromoCodeEvent('MSG');
            expect(logCustomEvent).toHaveBeenCalled();
        });
    });

    describe('removePromotion', () => {
        it('it should call API with promoBasket query parameter for Pickup orders', async () => {
            // Arrange
            const orderId = 1;
            const couponCode = '2';
            spyOn(basketUtils, 'getOrderId').and.returnValue(orderId);
            const removePromotionStub = spyOn(basketApi, 'removePromotion');
            const testFailureReason = 'removePromotion function should throw an exception';

            try {
                // Act
                await promosUtils.removePromotion(couponCode);
                throw new Error(testFailureReason);
            } catch (exception) {
                // Assert
                if (exception.message === testFailureReason) {
                    throw new Error(testFailureReason);
                }

                expect(removePromotionStub).toHaveBeenCalledWith(orderId, couponCode);
            }
        });
    });

    describe('applyPromotion', () => {
        let sendBrazePromoCodeEventSpy;
        let captchaToken;
        let promiseData;
        let fakePromise;
        let rejectData;
        let processEvent;

        beforeEach(() => {
            processEvent = require('analytics/processEvent').default;
            captchaToken = 'xyz';
            sendBrazePromoCodeEventSpy = spyOn(promosUtils, 'sendBrazePromoCodeEvent');
        });

        it('should call sendBrazePromoCodeEvent for MSG code', done => {
            promiseData = { responseStatus: 202 };

            applyPromotionStub.and.returnValue(Promise.resolve(promiseData));
            promosUtils.applyPromotion('MSG', captchaToken);

            basketApi.applyPromotion('MSG', captchaToken).then(() => {
                expect(sendBrazePromoCodeEventSpy).toHaveBeenCalledWith('MSG');
                done();
            });
        });

        it('it should call API with promoBasket query parameter for Pickup orders', async () => {
            // Arrange
            const promoCode = 'MSG';
            applyPromotionStub.and.callFake(() => ({ then: () => ({ catch: () => {} }) }));

            // Act
            await promosUtils.applyPromotion(promoCode, captchaToken);

            // Assert
            expect(applyPromotionStub).toHaveBeenCalledWith(promoCode, captchaToken);
        });

        describe('isBccPromotionComponent', () => {
            describe('for non MSG codes', () => {
                beforeEach(() => {
                    promiseData = {
                        responseStatus: 200,
                        appliedPromotions: [],
                        basketLevelMessages: [],
                        items: [
                            {
                                qty: 1,
                                sku: {
                                    name: 'testSku',
                                    primaryProduct: 'testProduct'
                                }
                            }
                        ],
                        pickupBasket: {
                            items: [
                                {
                                    qty: 1,
                                    sku: {
                                        name: 'testSku',
                                        primaryProduct: 'testProduct'
                                    }
                                }
                            ]
                        }
                    };
                    applyPromotionStub.and.returnValue(Promise.resolve(promiseData));
                });

                it('should open info modal', async () => {
                    // Arrange
                    spyOn(Location, 'isBasketPage').and.returnValue(false);
                    spyOn(Location, 'isCheckout').and.returnValue(false);
                    const showInfoModalSpy = spyOn(Actions, 'showInfoModal');

                    // Act
                    await promosUtils.applyPromotion('MSG', null, null, true, 'test title', 'test container');

                    // Assert
                    expect(showInfoModalSpy).toHaveBeenCalledWith({
                        isOpen: true,
                        title: 'Promotion Redeemed',
                        message: 'Your promotion has been added to your basket.',
                        showCancelButton: false,
                        isHtml: false,
                        buttonText: 'OK'
                    });
                });

                it('should not open the inline basket in basket nor checkout page on mobile', done => {
                    spyOn(Location, 'isBasketPage').and.returnValue(true);
                    spyOn(Location, 'isCheckout').and.returnValue(true);
                    spyOn(Sephora, 'isMobile').and.returnValue(true);

                    const mergeSpy = spyOn(UtilActions, 'merge');
                    promosUtils.applyPromotion('MSG', null, null, true, 'test title', 'test container');

                    basketApi.applyPromotion('MSG', null).then(() => {
                        expect(mergeSpy).not.toHaveBeenCalledWith('inlineBasket', 'isOpen', true);
                        done();
                    });
                });

                it('should not open add to basket modal in basket nor checkout page on desktop', done => {
                    spyOn(Location, 'isBasketPage').and.returnValue(true);
                    spyOn(Location, 'isCheckout').and.returnValue(true);
                    spyOn(Sephora, 'isMobile').and.returnValue(false);

                    const showAddToBasketModalSpy = spyOn(Actions, 'showAddToBasketModal');
                    promosUtils.applyPromotion('MSG', null, null, true, 'test title', 'test container');

                    basketApi.applyPromotion('MSG', null).then(() => {
                        expect(showAddToBasketModalSpy).not.toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('for MSG codes', () => {
                beforeEach(() => {
                    spyOn(Actions, 'showPromoModal').and.callFake((...args) => args[args.length - 3]());
                    promiseData = {
                        responseStatus: 202,
                        items: [
                            {
                                qty: 1,
                                sku: {
                                    name: 'testSku',
                                    primaryProduct: 'testProduct'
                                }
                            }
                        ]
                    };
                    applyPromotionStub.and.returnValue(Promise.resolve(promiseData));
                });

                it('should open info modal', done => {
                    spyOn(Location, 'isBasketPage').and.returnValue(false);
                    spyOn(Location, 'isCheckout').and.returnValue(false);

                    const showInfoModalSpy = spyOn(Actions, 'showInfoModal');
                    promosUtils.applyPromotion('MSG', null, null, true, 'test title', 'test container');

                    basketApi.applyPromotion('MSG', null).then(() => {
                        expect(showInfoModalSpy).toHaveBeenCalledWith({
                            isOpen: true,
                            title: 'Promotion Redeemed',
                            message: 'Your promotion has been added to your basket.',
                            showCancelButton: false,
                            isHtml: false,
                            buttonText: 'OK'
                        });
                        done();
                    });
                });

                it('should not open the inline basket in basket nor checkout page on mobile', done => {
                    spyOn(Location, 'isBasketPage').and.returnValue(true);
                    spyOn(Location, 'isCheckout').and.returnValue(true);
                    spyOn(Sephora, 'isMobile').and.returnValue(true);

                    const mergeSpy = spyOn(UtilActions, 'merge');
                    promosUtils.applyPromotion('MSG', null, null, true, 'test title', 'test container');

                    basketApi.applyPromotion('MSG', null).then(() => {
                        expect(mergeSpy).not.toHaveBeenCalledWith('inlineBasket', 'isOpen', true);
                        done();
                    });
                });

                it('should not open info modal in basket nor checkout page on desktop', done => {
                    spyOn(Location, 'isBasketPage').and.returnValue(true);
                    spyOn(Location, 'isCheckout').and.returnValue(true);
                    spyOn(Sephora, 'isMobile').and.returnValue(false);

                    const showInfoModalSpy = spyOn(Actions, 'showInfoModal');
                    promosUtils.applyPromotion('MSG', null, null, true, 'test title', 'test container');

                    basketApi.applyPromotion('MSG', null).then(() => {
                        expect(showInfoModalSpy).not.toHaveBeenCalled();
                        done();
                    });
                });
            });
        });

        describe('in case of an error, should show an info modal with the error message', () => {
            beforeEach(() => {
                rejectData = {
                    errorCode: -1,
                    errorMessages: ['Merchandise, excluding gift cards, must be included in your order to qualify for this offer'],
                    errors: {
                        basketLevelMsg: ['Merchandise, excluding gift cards, must be included in your order to qualify for this offer']
                    }
                };
            });
            it('should call showInfoModal method with value', done => {
                spyOn(Location, 'isBasketPage').and.returnValue(false);
                spyOn(Location, 'isCheckout').and.returnValue(false);
                showInfoModalStub = spyOn(Actions, 'showInfoModal').and.callThrough();
                fakePromise = {
                    then: function () {
                        return fakePromise;
                    },
                    catch: function (reject) {
                        reject(rejectData).then(() => {
                            expect(showInfoModalStub).toHaveBeenCalledWith({
                                isOpen: true,
                                title: 'Promo Error',
                                message: rejectData.errorMessages[0],
                                buttonText: 'OK',
                                dataAtTitle: 'promo_reward_warning_label',
                                dataAtMessage: 'promo_reward_warning_msg',
                                dataAtButton: 'warning_popup_ok_button',
                                dataAtClose: 'close_warning_popup'
                            });
                            done();
                        });
                    }
                };
                applyPromotionStub.and.returnValue(fakePromise);
                promosUtils.applyPromotion('MSG', null, null, true);
            });

            it('should call showInfoModal method on BI Page', done => {
                spyOn(Location, 'isBasketPage').and.returnValue(false);
                spyOn(Location, 'isCheckout').and.returnValue(false);
                spyOn(Location, 'isBIPage').and.returnValue(true);
                showInfoModalStub = spyOn(Actions, 'showInfoModal').and.callThrough();
                fakePromise = {
                    then: function () {
                        return fakePromise;
                    },
                    catch: function (reject) {
                        reject(rejectData).then(() => {
                            expect(showInfoModalStub).toHaveBeenCalledTimes(1);
                            done();
                        });
                    }
                };
                applyPromotionStub.and.returnValue(fakePromise);
                promosUtils.applyPromotion('MSG', null, null);
            });

            it('should not call showInfoModal method outside of BCCPromotionComponents', done => {
                spyOn(Location, 'isBasketPage').and.returnValue(true);
                spyOn(Location, 'isCheckout').and.returnValue(true);
                showInfoModalStub = spyOn(Actions, 'showInfoModal').and.callThrough();
                fakePromise = {
                    then: function () {
                        return fakePromise;
                    },
                    catch: function (reject) {
                        reject(rejectData);
                        expect(showInfoModalStub).not.toHaveBeenCalled();
                        done();
                    }
                };
                applyPromotionStub.and.returnValue(fakePromise);
                promosUtils.applyPromotion('MSG', null, null, true);
            });
        });

        it('should fire s.tl call in case of an error', done => {
            // Arrange
            const apiResponseData = {
                errorCode: -1,
                errorMessages: ['Error message'],
                errors: { basketLevelMsg: ['Error message'] }
            };
            applyPromotionStub.and.returnValue(Promise.reject(apiResponseData));
            spyOn(Location, 'isBasketPage').and.returnValue(false);
            spyOn(Location, 'isCheckout').and.returnValue(false);
            spyOn(processEvent, 'process');
            const promoCode = 'morepoints';
            const eventData = {
                data: objectContaining({
                    eventStrings: [EVENT_71],
                    actionInfo: 'Enter Promo Code',
                    userInput: `${promoCode}`,
                    serverResponse: apiResponseData.errorMessages,
                    fieldErrors: ['promo'],
                    errorMessages: apiResponseData.errorMessages
                })
            };

            // Act
            const applyPromotionResponse = promosUtils.applyPromotion(promoCode);

            // Assert
            applyPromotionResponse.then(() => {
                expect(processEvent.process).toHaveBeenCalledWith(LINK_TRACKING_EVENT, eventData);
                done();
            });
        });

        it('should fire s.tl call in case of an error when "Apply CBR" button pressed on basket page', done => {
            // Arrange
            const {
                CTA_TYPES: { CBR }
            } = promosUtils;
            const apiResponseData = {
                errorCode: -1,
                errorMessages: ['Error message'],
                errors: { basketLevelMsg: ['Error message'] }
            };
            applyPromotionStub.and.returnValue(Promise.reject(apiResponseData));
            spyOn(processEvent, 'process');
            const promoCode = 'cbr_10_500';
            const eventData = {
                data: {
                    eventStrings: ['event71'],
                    linkName: 'Error',
                    actionInfo: 'Enter Promo Code',
                    userInput: `${promoCode}`,
                    bindingMethods: [any(Function)],
                    serverResponse: 'D=c48',
                    fieldErrors: ['promo'],
                    errorMessages: ['Error message']
                }
            };

            // Act
            const applyPromotionResponse = promosUtils.applyPromotion(promoCode, null, CBR);

            // Assert
            applyPromotionResponse.then(() => {
                expect(processEvent.process).toHaveBeenCalledWith(LINK_TRACKING_EVENT, eventData);
                done();
            });
        });

        it('should fire s.tl call in case of an error when "Apply PFD" button pressed on basket page', done => {
            // Arrange
            const {
                CTA_TYPES: { PFD }
            } = promosUtils;
            const apiResponseData = {
                errorCode: -1,
                errorMessages: ['Error message'],
                errors: { basketLevelMsg: ['Error message'] }
            };
            applyPromotionStub.and.returnValue(Promise.reject(apiResponseData));
            spyOn(processEvent, 'process');
            const promoCode = 'pfd_10_750';
            const eventData = {
                data: {
                    eventStrings: ['event71'],
                    linkName: 'Error',
                    actionInfo: 'Enter Promo Code',
                    userInput: `${promoCode}`,
                    bindingMethods: [any(Function)],
                    serverResponse: 'D=c48',
                    fieldErrors: ['promo'],
                    errorMessages: ['Error message']
                }
            };

            // Act
            const applyPromotionResponse = promosUtils.applyPromotion(promoCode, null, PFD);

            // Assert
            applyPromotionResponse.then(() => {
                expect(processEvent.process).toHaveBeenCalledWith(LINK_TRACKING_EVENT, eventData);
                done();
            });
        });

        it('when the promo is applied correctly should fire s.tl call with the correct data', async () => {
            // Arrange
            const response = {
                responseStatus: 200,
                appliedPromotions: [{ couponCode: 'morepoints' }],
                basketLevelMessages: [],
                items: [
                    {
                        qty: 1,
                        sku: {
                            name: 'testSku',
                            primaryProduct: 'testProduct'
                        }
                    }
                ],
                pickupBasket: {
                    items: [
                        {
                            qty: 1,
                            sku: {
                                name: 'testSku',
                                primaryProduct: 'testProduct'
                            }
                        }
                    ]
                }
            };
            applyPromotionStub.and.callFake(() => ({
                then: action => {
                    action(response);

                    return { catch: () => {} };
                }
            }));
            spyOn(processEvent, 'process');
            const promoCode = 'morepoints';
            const eventData = {
                data: {
                    eventStrings: [EVENT_71],
                    linkName: 'Enter Promo Code',
                    actionInfo: 'Enter Promo Code',
                    userInput: promoCode
                }
            };
            spyOn(promosUtils, 'getBasicAnalyticsData').and.returnValue(eventData.data);

            // Act
            await promosUtils.applyPromotion(promoCode);

            // Assert
            expect(processEvent.process).toHaveBeenCalledWith(LINK_TRACKING_EVENT, eventData);
        });
    });

    describe('submitMsgPromos', () => {
        let callback;
        let promiseData;

        beforeEach(() => {
            callback = createSpy('callback');
        });

        it('should call the callback immediately', () => {
            promosUtils.submitMsgPromos().then(() => {
                callback();
                expect(callback).toHaveBeenCalled();
            });
        });

        describe('when the `addMsgPromotionToBasket` call resolves successfully', () => {
            it('should resolve the data returned successfully', () => {
                promiseData = { responseStatus: 202 };

                spyOn(basketApi, 'addMsgPromotionToBasket').and.returnValue(Promise.resolve(promiseData));

                promosUtils.submitMsgPromos().then(callback);

                expect(callback).not.toHaveBeenCalled();
            });
        });

        describe('when the `addMsgPromotionToBasket` call throws an error', () => {
            beforeEach(() => {
                spyOn(basketApi, 'addMsgPromotionToBasket').and.rejectWith({});
                spyOn(Location, 'isBasketPage').and.returnValue(true);
                spyOn(Store, 'dispatch');
            });

            describe('and the user is on basket page', function () {
                it('should dispatch the correct actions', async () => {
                    // Arrange
                    spyOn(PromoActions, 'removeMsgPromosByCode');
                    const mergeStub = spyOn(UtilActions, 'merge');
                    const testFailureReason = 'submitMsgPromos function should throw an exception';

                    try {
                        // Act
                        await promosUtils.submitMsgPromos('msg');
                        throw new Error(testFailureReason);
                    } catch (exception) {
                        // Assert
                        if (exception.message === testFailureReason) {
                            throw new Error(testFailureReason);
                        }

                        expect(mergeStub).toHaveBeenCalledTimes(1);
                    }
                });
            });

            describe('and the user is on checkout page', function () {
                it('should dispatch the correct actions', async () => {
                    const removeMsgPromosByCodeStub = spyOn(PromoActions, 'removeMsgPromosByCode');
                    spyOn(UtilActions, 'merge');
                    const testFailureReason = 'submitMsgPromos function should throw an exception';

                    try {
                        // Act
                        await promosUtils.submitMsgPromos('msg');
                        throw new Error(testFailureReason);
                    } catch (exception) {
                        // Assert
                        if (exception.message === testFailureReason) {
                            throw new Error(testFailureReason);
                        }

                        expect(removeMsgPromosByCodeStub).toHaveBeenCalledTimes(1);
                    }
                });
            });
        });
    });
});
