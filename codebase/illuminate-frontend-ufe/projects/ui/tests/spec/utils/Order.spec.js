describe('Order Utils', () => {
    let orderUtils,
        orderDetails,
        PAYMENT_GROUP_TYPE,
        SHIPPING_GROUPS,
        SHIPPING_METHOD_TYPES,
        store,
        dateUtils,
        getEstimatedDeliveryStringStub,
        Actions;

    beforeEach(() => {
        orderUtils = require('utils/Order').default;
        Actions = require('Actions').default;
        PAYMENT_GROUP_TYPE = orderUtils.PAYMENT_GROUP_TYPE;
        SHIPPING_GROUPS = orderUtils.SHIPPING_GROUPS;
        SHIPPING_METHOD_TYPES = orderUtils.SHIPPING_METHOD_TYPES;
        orderDetails = {
            header: { orderId: '123456' },
            shippingGroups: {
                shippingGroupsEntries: [
                    {
                        shippingGroup: {
                            address: 'shipping address',
                            shippingMethod: {
                                shippingMethodDescription: 'test description',
                                shippingFee: '$0.00',
                                shippingMethodId: '9000030',
                                shippingMethodType: 'Play! by Sephora'
                            }
                        },
                        shippingGroupType: SHIPPING_GROUPS.HARD_GOOD
                    }
                ]
            },
            paymentGroups: {
                paymentGroupsEntries: [
                    {
                        paymentGroup: {
                            paymentDisplayInfo: 'payment display info',
                            address: 'billing address'
                        },
                        paymentGroupType: PAYMENT_GROUP_TYPE.CREDIT_CARD
                    }
                ]
            },
            priceInfo: {},
            items: {},
            promotion: {}
        };
    });

    it('should call getPaymentDisplayInfo', () => {
        const paymentInfo = orderUtils.getPaymentDisplayInfo(orderDetails.paymentGroups);
        expect(paymentInfo).toEqual('payment display info');
    });

    it('should call getCreditCardAddress', () => {
        const billingAddress = orderUtils.getCreditCardAddress(orderDetails);
        expect(billingAddress).toEqual('billing address');
    });

    it('should call getHardGoodShippingAddress', () => {
        const shippingAddress = orderUtils.getHardGoodShippingAddress(orderDetails);
        expect(shippingAddress).toEqual('shipping address');
    });

    describe('isKlarnaEnabledForThisOrder', () => {
        it('should return true if flag presented on order level and there\'s a amount to be paid', () => {
            // Arrange
            orderDetails.items.isKlarnaCheckoutEnabled = true;
            orderDetails.priceInfo.creditCardAmount = '$10.00';

            // Act
            const isKlarnaEnabledForThisOrder = orderUtils.isKlarnaEnabledForThisOrder(orderDetails);

            // Assert
            expect(isKlarnaEnabledForThisOrder).toEqual(true);
        });

        it('should return true if user is in Paypal flow', () => {
            // Arrange
            orderDetails.items.isKlarnaCheckoutEnabled = true;
            orderDetails.priceInfo.paypalAmount = '$10.00';

            // Act
            const isKlarnaEnabledForThisOrder = orderUtils.isKlarnaEnabledForThisOrder(orderDetails);

            // Assert
            expect(isKlarnaEnabledForThisOrder).toEqual(true);
        });

        it('should return false if turned off on order level', () => {
            // Arrange
            orderDetails.items.isKlarnaCheckoutEnabled = false;

            // Act
            const isKlarnaEnabledForThisOrder = orderUtils.isKlarnaEnabledForThisOrder(orderDetails);

            // Assert
            expect(isKlarnaEnabledForThisOrder).toEqual(false);
        });

        it('should return false if there\'s no amount to be paid by CC', () => {
            // Arrange
            orderDetails.items.isKlarnaCheckoutEnabled = true;
            orderDetails.priceInfo.creditCardAmount = null;

            // Act
            const isKlarnaEnabledForThisOrder = orderUtils.isKlarnaEnabledForThisOrder(orderDetails);

            // Assert
            expect(isKlarnaEnabledForThisOrder).toEqual(false);
        });
    });

    describe('isAfterpayEnabledForThisOrder', () => {
        it('should return true if flag presented on order level and there\'s a amount to be paid', () => {
            // Arrange
            orderDetails.items.isAfterpayCheckoutEnabled = true;
            orderDetails.priceInfo.creditCardAmount = '$10.00';

            // Act
            const isAfterpayEnabledForThisOrder = orderUtils.isAfterpayEnabledForThisOrder(orderDetails);

            // Assert
            expect(isAfterpayEnabledForThisOrder).toEqual(true);
        });

        it('should return true if user is in Paypal flow', () => {
            // Arrange
            orderDetails.items.isAfterpayCheckoutEnabled = true;
            orderDetails.priceInfo.paypalAmount = '$10.00';

            // Act
            const isAfterpayEnabledForThisOrder = orderUtils.isAfterpayEnabledForThisOrder(orderDetails);

            // Assert
            expect(isAfterpayEnabledForThisOrder).toEqual(true);
        });

        it('should return false if turned off on order level', () => {
            // Arrange
            orderDetails.items.isAfterpayCheckoutEnabled = false;

            // Act
            const isAfterpayEnabledForThisOrder = orderUtils.isAfterpayEnabledForThisOrder(orderDetails);

            // Assert
            expect(isAfterpayEnabledForThisOrder).toEqual(false);
        });

        it('should return false if there\'s no amount to be paid by CC', () => {
            // Arrange
            orderDetails.items.isAfterpayCheckoutEnabled = true;
            orderDetails.priceInfo.creditCardAmount = null;

            // Act
            const isAfterpayEnabledForThisOrder = orderUtils.isAfterpayEnabledForThisOrder(orderDetails);

            // Assert
            expect(isAfterpayEnabledForThisOrder).toEqual(false);
        });
    });

    describe('getEstimatedDelivery', () => {
        beforeEach(() => {
            store = require('Store').default;
            dateUtils = require('utils/Date').default;
        });

        describe('is play order', () => {
            beforeEach(() => {
                orderDetails.header = { isPlaySubscriptionOrder: true };
                const returnStore = { order: { orderDetails } };
                spyOn(store, 'getState').and.returnValue(returnStore);
            });

            it('should return play text plus description on play order', () => {
                const { shippingGroup } = orderDetails.shippingGroups.shippingGroupsEntries[0];
                shippingGroup.shippingMethod.shippingMethodType = SHIPPING_METHOD_TYPES.PLAY;
                const getEstimatedDelivery = orderUtils.getEstimatedDelivery(shippingGroup);
                expect(getEstimatedDelivery).toEqual(
                    `${shippingGroup.shippingMethod.shippingMethodType} ${shippingGroup.shippingMethod.shippingMethodDescription}`
                );
            });
        });

        describe('isGiftCardOnly', () => {
            beforeEach(() => {
                store = require('Store').default;
            });

            it('should return true if order contains GC only', () => {
                orderDetails.shippingGroups = {
                    shippingGroupsEntries: [{ shippingGroupType: SHIPPING_GROUPS.GIFT }]
                };
                spyOn(store, 'getState').and.returnValue({ order: { orderDetails } });
                expect(orderUtils.isGiftCardOnly()).toBeTruthy();
            });

            it('should return false if order contains only hardgoods', () => {
                orderDetails.shippingGroups = {
                    shippingGroupsEntries: [{ shippingGroupType: SHIPPING_GROUPS.HARD_GOOD }]
                };
                spyOn(store, 'getState').and.returnValue({ order: { orderDetails } });
                expect(orderUtils.isGiftCardOnly()).toBeFalsy();
            });

            it('should return false if order contains GC and any other hardgoods', () => {
                orderDetails.shippingGroups = {
                    shippingGroupsEntries: [{ shippingGroupType: SHIPPING_GROUPS.GIFT }, { shippingGroupType: SHIPPING_GROUPS.HARD_GOOD }]
                };
                spyOn(store, 'getState').and.returnValue({ order: { orderDetails } });
                expect(orderUtils.isGiftCardOnly()).toBeFalsy();
            });
        });

        describe('shouldShowPromotion', () => {
            let isPlayCheckoutStub;
            let isPlayEditOrderStub;
            let isZeroCheckoutStub;
            let hasPromoCodesStub;
            let isGiftCardOnlyStub;

            beforeEach(() => {
                const returnStore = { order: { orderDetails } };
                spyOn(store, 'getState').and.returnValue(returnStore);
                isPlayCheckoutStub = spyOn(orderUtils, 'isPlayOrder');
                isPlayEditOrderStub = spyOn(orderUtils, 'isPlayEditOrder');
                isZeroCheckoutStub = spyOn(orderUtils, 'isZeroCheckout');
                hasPromoCodesStub = spyOn(orderUtils, 'hasPromoCodes');
                isGiftCardOnlyStub = spyOn(orderUtils, 'isGiftCardOnly');
            });

            it('should hide Promo Section if the Checkout is Play Edit', () => {
                isPlayEditOrderStub.and.returnValue(true);
                expect(orderUtils.shouldShowPromotion()).toBeFalsy();
            });

            it('should hide Promo Section if the Order contains only GC', () => {
                isGiftCardOnlyStub.and.returnValue(true);
                expect(orderUtils.shouldShowPromotion()).toBeFalsy();
            });

            it('should hide Promo Section if the Checkout is Play Edit', () => {
                isPlayEditOrderStub.and.returnValue(true);
                expect(orderUtils.shouldShowPromotion()).toBeFalsy();
            });

            it('should hide Promo Section if the order has promo codes and is zero checkout', () => {
                isZeroCheckoutStub.and.returnValue(true);
                hasPromoCodesStub.and.returnValue(true);
                expect(orderUtils.shouldShowPromotion()).toBeTruthy();
            });

            it('should hide Promo Section if the order has promo codes and is not zero checkout', () => {
                isPlayCheckoutStub.and.returnValue(true);
                isPlayEditOrderStub.and.returnValue(true);
                hasPromoCodesStub.and.returnValue(true);
                expect(orderUtils.shouldShowPromotion()).toBeFalsy();
            });

            it('should hide Promo Section if the order does not have promo codes and is not zero checkout', () => {
                expect(orderUtils.shouldShowPromotion()).toBeTruthy();
            });

            it('should hide Promo Section if the order does not have promo codes and is zero checkout', () => {
                isZeroCheckoutStub.and.returnValue(true);
                expect(orderUtils.shouldShowPromotion()).toBeFalsy();
            });

            it('should hide Promo Section if the order is not have promo codes and is not zero checkout', () => {
                hasPromoCodesStub.and.returnValue(true);
                expect(orderUtils.shouldShowPromotion()).toBeTruthy();
            });
        });

        describe('is not play order', () => {
            beforeEach(() => {
                orderDetails.header = { isPlaySubscriptionOrder: false };
                const returnStore = { order: { orderDetails } };
                spyOn(store, 'getState').and.returnValue(returnStore);
                getEstimatedDeliveryStringStub = spyOn(dateUtils, 'getEstimatedDeliveryString');
            });

            it('should return one estimated date if estimated min and max dates are equal', () => {
                getEstimatedDeliveryStringStub.and.returnValue('Mon 3/19');
                const { shippingGroup } = orderDetails.shippingGroups.shippingGroupsEntries[0];
                shippingGroup.shippingMethod = {
                    // 3/19/2018
                    estimatedMinDeliveryDate: 1521504000000,
                    // 3/19/2018
                    estimatedMaxDeliveryDate: 1521504000000
                };
                const getEstimatedDelivery = orderUtils.getEstimatedDelivery(shippingGroup);
                expect(getEstimatedDelivery).toEqual('Mon 3/19');
            });

            it('should return one estimated date if estimated min and max dates are equal', () => {
                const { shippingGroup } = orderDetails.shippingGroups.shippingGroupsEntries[0];
                shippingGroup.shippingMethod = {
                    // 3/19/2018
                    estimatedMinDeliveryDate: 1521504000000,
                    // 3/20/2018
                    estimatedMaxDeliveryDate: 1521590400000
                };

                getEstimatedDeliveryStringStub.and.callFake(arg => {
                    if (arg === shippingGroup.shippingMethod.estimatedMinDeliveryDate) {
                        return 'Mon 3/19';
                    }

                    if (arg === shippingGroup.shippingMethod.estimatedMaxDeliveryDate) {
                        return 'Tue 3/20';
                    }

                    return '';
                });

                const getEstimatedDelivery = orderUtils.getEstimatedDelivery(shippingGroup);
                expect(getEstimatedDelivery).toEqual('Mon 3/19 to Tue 3/20');
            });
        });
    });

    describe('getAvailableBiPoints', () => {
        let getStateStub;
        beforeEach(function () {
            store = require('Store').default;
            getStateStub = spyOn(store, 'getState');
        });

        it('returns the number of available BI points', function () {
            getStateStub.and.returnValue({ order: { orderDetails: { items: { netBeautyBankPointsAvailable: 200 } } } });
            expect(orderUtils.getAvailableBiPoints()).toEqual(200);
        });
    });

    describe('getGuestAvailableBiPoints', () => {
        let getStateStub;
        beforeEach(function () {
            store = require('Store').default;
            getStateStub = spyOn(store, 'getState');
        });

        it('returns the number of potential available BI points for guest', function () {
            getStateStub.and.returnValue({ order: { orderDetails: { items: { potentialBeautyBankPoints: 80 } } } });
            expect(orderUtils.getGuestAvailableBiPoints()).toEqual(80);
        });
    });

    describe('userHasSavedPayPalAccount', () => {
        let orderDetailsStub;

        it('should return true since user has saved paypal', () => {
            orderDetailsStub = { header: { profile: { hasSavedPaypal: true } } };
            const userHasSavedPayPalAccount = orderUtils.userHasSavedPayPalAccount(orderDetailsStub);
            expect(userHasSavedPayPalAccount).toBe(true);
        });

        it('should return undefined since no user profile', () => {
            orderDetailsStub = { header: { guestCheckout: true } };
            const userHasSavedPayPalAccount = orderUtils.userHasSavedPayPalAccount(orderDetailsStub);
            expect(userHasSavedPayPalAccount).toBe(undefined);
        });
    });

    describe('hasPromoCodes', () => {
        let details;

        beforeEach(() => {
            details = {
                promotion: {
                    appliedPromotions: [
                        {
                            couponCode: 'rrc7005000038362870',
                            displayName: 'RRC Promotion',
                            promotionId: 'promo3790001',
                            promotionType: 'Order Discount'
                        }
                    ]
                }
            };
        });

        it('should return false if the order does not contain promotions', () => {
            delete details.promotion;
            expect(orderUtils.hasPromoCodes(details)).toBeFalsy();
        });

        it('should return false if the order does not contain appliedPromotions', () => {
            delete details.promotion.appliedPromotions;
            expect(orderUtils.hasPromoCodes(details)).toBeFalsy();
        });

        it('should return true if the order contains a promo code', () => {
            expect(orderUtils.hasPromoCodes(details)).toBeTruthy();
        });
    });

    describe('isShippableOrder', () => {
        it('should return false if orderDetails does not have HARD_GOOD or GIFT shippingGropus', () => {
            const mockedOrderDetails = { shippingGroups: { shippingGroupsEntries: [{ shippingGroupType: 'ElectronicShippingGroup' }] } };
            expect(orderUtils.isShippableOrder(mockedOrderDetails)).toBeFalsy();
        });

        it('should return true if orderDetails does have HARD_GOOD or GIFT shippingGropus', () => {
            const mockedOrderDetails = {
                shippingGroups: {
                    shippingGroupsEntries: [{ shippingGroupType: 'ElectronicShippingGroup' }, { shippingGroupType: 'HardGoodShippingGroup' }]
                }
            };
            expect(orderUtils.isShippableOrder(mockedOrderDetails)).toBeTruthy();
        });
    });

    describe('isZeroCheckout', () => {
        beforeEach(() => {
            store = require('Store').default;
            orderDetails.priceInfo = {};
        });

        it('should return true if the order total is 0 in US', () => {
            orderDetails.priceInfo.orderTotal = orderUtils.ZERO_CHECKOUT_OPTIONS.US;
            spyOn(store, 'getState').and.returnValue({ order: { orderDetails } });
            expect(orderUtils.isZeroCheckout()).toBeTruthy();
        });

        it('should return false if the order total is not 0 in US', () => {
            orderDetails.priceInfo.orderTotal = '$34.34';
            spyOn(store, 'getState').and.returnValue({ order: { orderDetails } });
            expect(orderUtils.isZeroCheckout()).toBeFalsy();
        });

        it('should return true if the order total is 0 in CA_EN', () => {
            orderDetails.priceInfo.orderTotal = orderUtils.ZERO_CHECKOUT_OPTIONS.CA_EN;
            spyOn(store, 'getState').and.returnValue({ order: { orderDetails } });
            expect(orderUtils.isZeroCheckout()).toBeTruthy();
        });

        it('should return false if the order total is not 0 in CA_EN', () => {
            orderDetails.priceInfo.orderTotal = '$34.34';
            spyOn(store, 'getState').and.returnValue({ order: { orderDetails } });
            expect(orderUtils.isZeroCheckout()).toBeFalsy();
        });

        it('should return true if the order total is 0 in CA_FR', () => {
            orderDetails.priceInfo.orderTotal = orderUtils.ZERO_CHECKOUT_OPTIONS.CA_FR;
            spyOn(store, 'getState').and.returnValue({ order: { orderDetails } });
            expect(orderUtils.isZeroCheckout()).toBeTruthy();
        });

        it('should return false if the order total is not 0 in CA_FR', () => {
            orderDetails.priceInfo.orderTotal = '34,34 $';
            spyOn(store, 'getState').and.returnValue({ order: { orderDetails } });
            expect(orderUtils.isZeroCheckout()).toBeFalsy();
        });
    });

    describe('detectSephoraCard', () => {
        let constants;

        beforeEach(() => {
            constants = require('constants/CreditCard');
            Sephora.fantasticPlasticConfigurations = {
                sephCBVIBinRange: '417601',
                sephPLCCBinRange: '402241'
            };
        });

        it('should detect a Co-branded card via detectSephoraCard', () => {
            expect(orderUtils.detectSephoraCard('4176017890123456')).toEqual(constants.SEPHORA_CARD_TYPES.CO_BRANDED);
        });

        it('should detect a Private Label card via detectSephoraCard', () => {
            expect(orderUtils.detectSephoraCard('4022417890123456')).toEqual(constants.SEPHORA_CARD_TYPES.PRIVATE_LABEL);
        });

        it('should detect nothing else via detectSephoraCard', () => {
            expect(orderUtils.detectSephoraCard('4111111111111111')).toBeUndefined();
        });
    });

    describe('isCoBranded', () => {
        beforeEach(() => {
            Sephora.fantasticPlasticConfigurations = {
                sephCBVIBinRange: '417601',
                sephPLCCBinRange: '402241'
            };
        });

        it('should detect a Co-branded card via isCoBranded', () => {
            expect(orderUtils.isCoBranded('4176017890123456')).toEqual(true);
        });

        it('should detect a non-Co-branded card via isCoBranded', () => {
            expect(orderUtils.isCoBranded('4022417890123456')).toEqual(false);
        });
    });

    describe('isPrivateLabel', () => {
        beforeEach(() => {
            Sephora.fantasticPlasticConfigurations = {
                sephCBVIBinRange: '417601',
                sephPLCCBinRange: '402241'
            };
        });

        it('should detect a Private Label card via isPrivateLabel', () => {
            expect(orderUtils.isPrivateLabel('4022417890123456')).toEqual(true);
        });

        it('should detect a non-Private Label card via isPrivateLabel', () => {
            expect(orderUtils.isPrivateLabel('4176017890123456')).toEqual(false);
        });
    });

    describe('isSephoraCardType', () => {
        it('should detect a Sephora credit card', () => {
            const creditCard = { cardType: 'PLCC' };
            expect(orderUtils.isSephoraCardType(creditCard)).toEqual(true);
        });

        it('should detect a non-Sephora credit card', () => {
            const creditCard = { cardType: 'VISA' };
            expect(orderUtils.isSephoraCardType(creditCard)).toEqual(false);
        });
    });

    describe('isSephoraTempCardType', () => {
        it('should detect a Sephora temp credit card', () => {
            const creditCard = { cardType: 'PLCCT' };
            expect(orderUtils.isSephoraTempCardType(creditCard)).toEqual(true);
        });

        it('should detect a non-Sephora temp credit card', () => {
            const creditCard = { cardType: 'PLCC' };
            expect(orderUtils.isSephoraTempCardType(creditCard)).toEqual(false);
        });
    });

    describe('getThirdPartyCreditCard', () => {
        it('should return a non-Sephora credit card icon name', () => {
            const creditCard = { cardType: 'VISA' };
            expect(orderUtils.getThirdPartyCreditCard(creditCard)).toEqual('visa');
        });

        it('should return a Sephora credit card icon name', () => {
            const creditCard = { cardType: 'PLCC' };
            expect(orderUtils.getThirdPartyCreditCard(creditCard)).toEqual('sephora');
        });

        it('should return empty for a non-credit card', () => {
            const creditCard = { cardType: 'BITCOIN' };
            expect(orderUtils.getThirdPartyCreditCard(creditCard)).toEqual('');
        });

        it('should return empty for an empty cardType', () => {
            const creditCard = { cardType: '' };
            expect(orderUtils.getThirdPartyCreditCard(creditCard)).toEqual('');
        });
    });

    describe('getTrackingUrl', () => {
        it('should return null when empty shippingGroups', () => {
            const order = { shippingGroups: [] };

            expect(orderUtils.getTrackingUrl(order)).toEqual(null);
        });

        it('should return null when no trackingUrl that exists', () => {
            const order = { shippingGroups: [{}, {}, {}] };

            expect(orderUtils.getTrackingUrl(order)).toEqual(null);
        });

        it('should return the first trackingUrl that exists', () => {
            const order = { shippingGroups: [{}, {}, { trackingUrl: 'abc' }] };

            expect(orderUtils.getTrackingUrl(order)).toEqual('abc');
        });
    });

    describe('hasRRC', () => {
        beforeEach(() => {
            orderDetails = { promotion: { appliedPromotions: [{ displayName: 'Rouge Reward' }] } };
        });

        it('should return true if the applied promo is RRC', () => {
            expect(orderUtils.hasRRC(orderDetails)).toBe(true);
        });

        it('should return true if the one of the applied promos is RRC', () => {
            orderDetails.promotion.appliedPromotions = [{ displayName: 'other promo' }, { displayName: 'Rouge Reward' }];
            expect(orderUtils.hasRRC(orderDetails)).toBe(true);
        });

        it('should return false if the applied promo is not RRC', () => {
            orderDetails.promotion.appliedPromotions[0].displayName = 'other promo';
            expect(orderUtils.hasRRC(orderDetails)).toBe(false);
        });

        it('should return false if there are no promos', () => {
            orderDetails.promotion.appliedPromotions = [];
            expect(orderUtils.hasRRC(orderDetails)).toBe(false);
        });
    });

    describe('getStoreCredits', () => {
        it('should extract store credits', () => {
            const order = { paymentGroups: { storeCredits: [1, 5] } };
            expect(orderUtils.getStoreCredits(order)).toEqual([1, 5]);
        });
    });

    it('should return empty array as a fallback option', () => {
        expect(orderUtils.getStoreCredits({})).toEqual([]);
    });

    describe('isZeroPrice', () => {
        it('should detect US zero price', () => {
            expect(orderUtils.isZeroPrice('$0.00')).toBeTruthy();
        });

        it('should detect CA EN zero price', () => {
            expect(orderUtils.isZeroPrice('$0.00')).toBeTruthy();
        });

        it('should detect CA FR zero price', () => {
            expect(orderUtils.isZeroPrice('0,00 $')).toBeTruthy();
        });

        it('should detect CA EN zero price with added space', () => {
            expect(orderUtils.isZeroPrice('0,00 $ ')).toBeTruthy();
        });

        it('should not detect a zero price in a different format', () => {
            expect(orderUtils.isZeroPrice('0.00 $ ')).toBeFalsy();
        });
    });

    describe('showOrderCancelationModal', () => {
        const header = { selfCancellationReasonCodes: 'cancelation_reasons' };
        const mockState = { order: { orderDetails: { header } } };
        let dispatchSpy;
        let showOrderCancelationModalStub;

        beforeEach(() => {
            store = require('Store').default;
            spyOn(store, 'getState').and.returnValue(mockState);
            showOrderCancelationModalStub = spyOn(Actions, 'showOrderCancelationModal');
            dispatchSpy = spyOn(store, 'dispatch');
        });

        it('should dispatch showOrderCancelationModal action', async () => {
            await orderUtils.showOrderCancelationModal('123456');
            expect(showOrderCancelationModalStub).toHaveBeenCalledWith(true, '123456', 'cancelation_reasons');
            expect(dispatchSpy).toHaveBeenCalled();
        });
    });

    describe('isHalAvailable', () => {
        let localeUtils;
        describe('US', () => {
            beforeEach(() => {
                localeUtils = require('utils/LanguageLocale').default;
                spyOn(localeUtils, 'isUS').and.returnValue(true);
                spyOn(localeUtils, 'isCanada').and.returnValue(false);
            });

            it('should return true when order isHalAvailable is true', () => {
                const result = orderUtils.isHalAvailable(true);
                expect(result).toBe(true);
            });

            it('should return false when order isHalAvailable is false', () => {
                const result = orderUtils.isHalAvailable(false);
                expect(result).toBe(false);
            });
        });

        describe('Canada', () => {
            beforeEach(() => {
                localeUtils = require('utils/LanguageLocale').default;
                spyOn(localeUtils, 'isUS').and.returnValue(false);
                spyOn(localeUtils, 'isCanada').and.returnValue(true);
            });

            describe('> When CAP killswitch is enabled', () => {
                beforeEach(() => {
                    Sephora.configurationSettings.isCapEnabled = true;
                });

                it('should return true when order isHalAvailable is true', () => {
                    const result = orderUtils.isHalAvailable(true);
                    expect(result).toBe(true);
                });

                it('should return false when order isHalAvailable is false', () => {
                    const result = orderUtils.isHalAvailable(false);
                    expect(result).toBe(false);
                });

                describe('And CAP Rampup is enabled', () => {
                    beforeEach(() => {
                        Sephora.configurationSettings.isRampupEnabled = true;
                    });

                    it('should return true when order isHalAvailable is true and CAAPAvailable is true', () => {
                        const result = orderUtils.isHalAvailable(true, true);
                        expect(result).toBe(true);
                    });

                    it('should return false when order isHalAvailable is true and CAAPAvailable is false', () => {
                        const result = orderUtils.isHalAvailable(true, false);
                        expect(result).toBe(false);
                    });
                });

                describe('And CAP Rampup is disabled', () => {
                    beforeEach(() => {
                        Sephora.configurationSettings.isRampupEnabled = false;
                    });

                    it('should return true when order isHalAvailable is true and CAAPAvailable is true', () => {
                        const result = orderUtils.isHalAvailable(true, true);
                        expect(result).toBe(true);
                    });

                    it('should return true when order isHalAvailable is true and CAAPAvailable is false', () => {
                        const result = orderUtils.isHalAvailable(true, false);
                        expect(result).toBe(true);
                    });
                });
            });

            describe('> When CAP killswitch is disabled', () => {
                beforeEach(() => {
                    Sephora.configurationSettings.isCapEnabled = false;
                });

                it('should return false when order isHalAvailable is true', () => {
                    const result = orderUtils.isHalAvailable(true);
                    expect(result).toBe(false);
                });

                it('should return false when order isHalAvailable is false', () => {
                    const result = orderUtils.isHalAvailable(false);
                    expect(result).toBe(false);
                });
            });
        });
    });
});
