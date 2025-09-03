/* eslint max-len: [0] */
describe('order confirmation bindings group', function () {
    const bindingMethods = require('analytics/bindingMethods/pages/orderConfirmation/orderConfPageBindings').default;
    const orderUtils = require('utils/Order').default;
    const userUtils = require('utils/User').default;
    const anaConsts = require('analytics/constants').default;
    const anaUtils = require('analytics/utils').default;
    const orderItems = [
        {
            listPriceSubtotal: '$42.00',
            qty: 2,
            replenishmentFrequency: 'Weeks:2',
            sku: {
                type: 'Standard',
                skuId: '1056084'
            }
        },
        {
            listPriceSubtotal: '$50.00',
            qty: 1,
            replenishmentFrequency: 'Months:3',
            sku: {
                type: 'Standard',
                skuId: '1052345'
            }
        }
    ];
    const orderItemsGiftCard = [
        {
            listPriceSubtotal: '$10.00',
            qty: 1,
            sku: { type: 'Gift Card' }
        }
    ];
    const orderItemsSample = [
        {
            listPriceSubtotal: '$10.00',
            qty: 1,
            sku: { type: 'Sample' }
        }
    ];
    const orderItemsReward = [
        {
            qty: 1,
            listPriceSubtotal: '$15.00',
            sku: { biType: '500 Points' }
        }
    ];
    const promotionApplied = {
        appliedPromotions: [
            {
                promotionId: 'mysterycheckoutjun12',
                displayName: 'Deluxe Sample',
                promotionType: 'Order Discount - Amount Off – MSG',
                couponCode: 'YOURGIFT'
            }
        ]
    };
    const orderDetailsWithoutDiscountOrGiftCard = {
        shippingGroups: {
            shippingGroupsEntries: [
                {
                    shippingGroupType: 'HardGoodShippingGroup',
                    shippingGroup: {
                        shippingGroupId: 'sg9480014',
                        shippingMethod: {
                            shippingMethodId: '300014',
                            shippingMethodDescription: '(Up to 3 business days. Delivery Monday-Friday)',
                            shippingFee: '$5.95',
                            shippingMethodType: 'Standard 3 Day'
                        }
                    }
                }
            ]
        },
        priceInfo: {
            creditCardAmount: '$74.87',
            merchandiseShipping: 'FREE',
            merchandiseSubtotal: '$69.00',
            orderTotal: '$74.87',
            profileLocale: 'US',
            profileStatus: 4,
            tax: '$5.87',
            totalShipping: 'FREE'
        },
        header: { orderLocale: 'US' },
        items: {
            itemsByBasket: []
        }
    };
    const orderDetailsWithDiscountAndGiftCard = {
        isInitialized: true,
        shippingGroups: {
            shippingGroupsEntries: [
                {
                    shippingGroupType: 'HardGoodShippingGroup',
                    shippingGroup: {
                        shippingGroupId: 'sg9480014',
                        shippingMethod: {
                            shippingMethodId: '300014',
                            shippingMethodDescription: '(Up to 3 business days. Delivery Monday-Friday)',
                            shippingFee: '$5.95',
                            shippingMethodType: 'Standard 3 Day'
                        }
                    }
                }
            ]
        },
        priceInfo: {
            creditCardAmount: '$74.87',
            giftCardAmount: '$52.73',
            promotionDiscount: '$5.40',
            merchandiseShipping: 'FREE',
            merchandiseSubtotal: '$69.00',
            orderTotal: '$74.87',
            profileLocale: 'US',
            profileStatus: 4,
            tax: '$5.87',
            totalShipping: 'FREE'
        },
        promotion: {
            appliedPromotions: [
                {
                    promotionId: 'mysterycheckoutjun12',
                    displayName: 'Deluxe Sample',
                    promotionType: 'Order Discount - Amount Off – MSG',
                    couponCode: 'YOURGIFT'
                }
            ]
        },
        header: { orderLocale: 'US' },
        items: {
            itemsByBasket: []
        }
    };
    const orderDetailsWithCanadianDiscountAndGiftCard = {
        isInitialized: true,
        shippingGroups: {
            shippingGroupsEntries: [
                {
                    shippingGroupType: 'HardGoodShippingGroup',
                    shippingGroup: {
                        shippingGroupId: 'sg9480014',
                        shippingMethod: {
                            shippingMethodId: '300014',
                            shippingMethodDescription: '(Up to 3 business days. Delivery Monday-Friday)',
                            shippingFee: '$5.95',
                            shippingMethodType: 'Standard 3 Day'
                        }
                    }
                }
            ]
        },
        priceInfo: {
            creditCardAmount: '$74.87',
            giftCardAmount: '$52.73',
            promotionDiscount: '$5.40',
            merchandiseShipping: 'FREE',
            merchandiseSubtotal: '$69.00',
            orderTotal: '$74.87',
            profileLocale: 'CA',
            profileStatus: 4,
            tax: '$5.87',
            totalShipping: 'FREE'
        },
        promotion: {
            appliedPromotions: [
                {
                    promotionId: 'mysterycheckoutjun12',
                    displayName: 'Deluxe Sample',
                    promotionType: 'Order Discount - Amount Off – MSG',
                    couponCode: 'YOURGIFT'
                }
            ]
        },
        header: { orderLocale: 'CA' },
        items: {
            itemsByBasket: []
        }
    };

    describe('getProductStrings', () => {
        it('should contain capital and lowercase letters', () => {
            const basketWithItems = {
                itemsByBasket: []
            };
            //ILLUPH-106335
            const result = bindingMethods.getProductStrings(orderItems, 'US', basketWithItems);

            expect(result.indexOf('eVar') !== -1).toBeTruthy();
        });
    });

    describe('getPromoCode', () => {
        it('should contain the promo code used', () => {
            const result = bindingMethods.getPromoCode(promotionApplied);

            expect(result).toBe(promotionApplied.appliedPromotions[0].couponCode);
        });
    });

    describe('getPromosData', () => {
        const { promoCodes, promoDisplayName, promotionIds, promotionTypes } = bindingMethods.getPromosData(promotionApplied);
        const PROMOTION_INDEX = 0;

        it('should contain the promoCodes list', () => {
            expect(promoCodes[PROMOTION_INDEX]).toBe(promotionApplied.appliedPromotions[PROMOTION_INDEX].couponCode);
        });
        it('should contain the promoDisplayName list', () => {
            expect(promoDisplayName[PROMOTION_INDEX]).toBe(promotionApplied.appliedPromotions[PROMOTION_INDEX].displayName);
        });
        it('should contain the promotionIds list', () => {
            expect(promotionIds[PROMOTION_INDEX]).toBe(promotionApplied.appliedPromotions[PROMOTION_INDEX].promotionId);
        });
        it('should contain the promotionTypes list', () => {
            expect(promotionTypes[PROMOTION_INDEX]).toBe(promotionApplied.appliedPromotions[PROMOTION_INDEX].promotionType);
        });
    });

    describe('getEventStrings', () => {
        const eventsWithStandardSku = ['purchase', 'event5', 'event13', 'event49', 'event34'];
        const eventsWithCA = ['purchase', 'event5', 'event13', 'event49', 'event101', 'event144', 'event34'];
        const eventsWithGiftCard = ['purchase', 'event5', 'event13', 'event49', 'event35'];
        const eventsWithReward = ['purchase', 'event5', 'event13', 'event49', 'event34', 'event120'];
        const eventsOnlyReward = ['purchase', 'event5', 'event13', 'event49', 'event34', 'event120', 'event126'];
        const eventsWithPromotion = ['purchase', 'event5', 'event13', 'event49', 'event34', 'event54'];
        const eventsWithSample = ['purchase', 'event5', 'event13', 'event49', 'event51', 'event60'];

        let getBiAccountInfoStub;
        let isZeroCheckoutStub;

        beforeEach(() => {
            isZeroCheckoutStub = spyOn(orderUtils, 'isZeroCheckout').and.returnValue(false);
            getBiAccountInfoStub = spyOn(userUtils, 'getBiAccountInfo').and.returnValue({});
            spyOn(orderUtils, 'getMerchandiseSubtotalAsNumber').and.returnValue(20);
        });

        it('should contain CA event if CA locale is present', () => {
            expect(bindingMethods.getEventStrings(orderItems, 'CA')).toEqual(eventsWithCA);
        });
        it('should contain Gift Card event if Gift Card purchase', () => {
            expect(bindingMethods.getEventStrings(orderItemsGiftCard, 'US')).toEqual(eventsWithGiftCard);
        });
        it('should contain Hard Good event if Standard Sku present', () => {
            expect(bindingMethods.getEventStrings(orderItems, 'US')).toEqual(eventsWithStandardSku);
        });
        it('should contain Reward event if Reward Sku present', () => {
            expect(bindingMethods.getEventStrings(orderItemsReward, 'US')).toEqual(eventsWithReward);
        });
        it('should contain Only Reward event if there is only Rewards in order', () => {
            isZeroCheckoutStub.and.returnValue(true);
            expect(bindingMethods.getEventStrings(orderItemsReward, 'US')).toEqual(eventsOnlyReward);
        });
        it('should contain Promotion event if there is promotion applied', () => {
            expect(bindingMethods.getEventStrings(orderItems, 'US', 'promoCode')).toEqual(eventsWithPromotion);
        });
        it('should contain Samples event if Sample Sku present', () => {
            expect(bindingMethods.getEventStrings(orderItemsSample, 'US')).toEqual(eventsWithSample);
        });
        it('should not contain Only Reward event if there are non-rewards in order', () => {
            isZeroCheckoutStub.and.returnValue(true);
            const eventStrings = bindingMethods.getEventStrings(orderItems, 'US');

            expect(eventStrings.indexOf(anaConsts.Event.ONLY_REWARD) === -1).toBeTruthy();
        });

        it('should contain vib conversion event when user goes from BI to VIB', () => {
            getBiAccountInfoStub.and.returnValue({
                vibSegment: 'BI',
                vibSpendingToNextSegment: 20
            });
            const eventStrings = bindingMethods.getEventStrings(orderItems, 'US');

            expect(eventStrings.indexOf(anaConsts.Event.VIB_TIER_MIGRATION) !== -1).toBeTruthy();
        });

        it('should contain rouge conversion event when user goes from VIB to ROUGE', () => {
            getBiAccountInfoStub.and.returnValue({
                vibSegment: 'VIB',
                vibSpendingToNextSegment: 20
            });
            const eventStrings = bindingMethods.getEventStrings(orderItems, 'US');

            expect(eventStrings.indexOf(anaConsts.Event.ROUGE_TIER_MIGRATION) !== -1).toBeTruthy();
        });

        it('should contain rouge conversion event when user goes from BI to ROUGE', () => {
            getBiAccountInfoStub.and.returnValue({
                realTimeVIBStatus: 'Rouge',
                vibSegment: 'BI',
                vibSpendingToNextSegment: 20
            });
            const eventStrings = bindingMethods.getEventStrings(orderItems, 'US');

            expect(eventStrings.indexOf(anaConsts.Event.ROUGE_TIER_MIGRATION) !== -1).toBeTruthy();
        });
    });

    describe('getEventsForProductString', () => {
        const prodStringEventsForStandard = ['event34=2'];
        const prodStringEventsForCA = ['event101=42.00', 'event34=2'];
        const prodStringEventsForGiftCard = ['event35=10.00'];
        const prodStringEventsForReward = ['event34=1', 'event120=1500'];
        const prodStringEventsForSample = ['event51=1'];

        it('should add CA event and item price if CA locale', () => {
            expect(bindingMethods.getEventsForProductString(orderItems[0], 'CA')).toEqual(prodStringEventsForCA);
        });
        it('should add Standard item event with quantity if standard sku', () => {
            expect(bindingMethods.getEventsForProductString(orderItems[0], 'US')).toEqual(prodStringEventsForStandard);
        });
        it('should add Gift Card event with price if gift card sku', () => {
            expect(bindingMethods.getEventsForProductString(orderItemsGiftCard[0], 'US')).toEqual(prodStringEventsForGiftCard);
        });
        it('should add Reward item event with points if reward sku', () => {
            expect(bindingMethods.getEventsForProductString(orderItemsReward[0], 'US')).toEqual(prodStringEventsForReward);
        });
        it('should add Sample item event if sample sku', () => {
            expect(bindingMethods.getEventsForProductString(orderItemsSample[0], 'US')).toEqual(prodStringEventsForSample);
        });
    });

    describe('buildProductString', () => {
        const firstProductString = ';1056084;2;42.00;event34=2;eVar26=1056084,';
        const secondProductString = ';1052345;1;50.00;event34=1;eVar26=1052345,';
        const shippingString = ';Shipping;;;event5=5.95;,';
        const noDiscountString = ';Discount;;;event13=0;,;';
        const caDiscountString = ';Discount;;;event13=5.40|event144=5.40;,;';
        const discountString = ';Discount;;;event13=5.40;,;';
        const noGiftCardString = 'gift card;;;event49=0;';
        const giftCardString = 'gift card;;;event49=52.73;';

        it('should return a product string with no Discount nor Gift Card', () => {
            expect(bindingMethods.buildProductString(orderDetailsWithoutDiscountOrGiftCard, orderItems, 'US')).toEqual(
                `${firstProductString}${secondProductString}${shippingString}` + `${noDiscountString}${noGiftCardString}`
            );
        });
        it('should return a product string with Discount and Gift Card', () => {
            expect(bindingMethods.buildProductString(orderDetailsWithDiscountAndGiftCard, orderItems, 'US')).toEqual(
                `${firstProductString}${secondProductString}${shippingString}` + `${discountString}${giftCardString}`
            );
        });
        it('should return a product string with Discount and Gift Card for Canadian locale', () => {
            expect(bindingMethods.buildProductString(orderDetailsWithCanadianDiscountAndGiftCard, orderItems, 'CA')).toContain(caDiscountString);
        });
    });

    describe('buildPaymentMethodString', () => {
        beforeEach(() => {
            Sephora.renderQueryParams = { country: 'CA' };
        });
        const orderDetails = { paymentGroups: { paymentGroupsEntries: [{ paymentGroupType: 'KlarnaPaymentGroup' }] } };

        it('should return payment method for klarna', () => {
            expect(bindingMethods.buildPaymentMethodString(orderDetails)).toEqual('klarna');
        });
    });

    describe('subtotalPurchased', () => {
        const orderPriceDetails = {
            creditCardAmount: '$74.87',
            giftCardAmount: '$52.73',
            promotionDiscount: '$5.40',
            merchandiseShipping: 'FREE',
            merchandiseSubtotal: '$69.00',
            orderTotal: '$74.87',
            profileLocale: 'US',
            profileStatus: 4,
            tax: '$5.87',
            totalShipping: 'FREE'
        };
        it('should return the total value of purchase the client made', () => {
            const result = bindingMethods.subtotalPurchased(orderPriceDetails);
            const subtotal = parseFloat(anaUtils.removeCurrencySymbol(orderPriceDetails.merchandiseSubtotal));
            const giftCardAmount = parseFloat(anaUtils.removeCurrencySymbol(orderPriceDetails.giftCardAmount));
            const expectedResult = subtotal - giftCardAmount;
            const parsedResult = +(Math.round(expectedResult + 'e+2') + 'e-2');

            expect(result).toEqual(parsedResult.toString());
        });
    });
});
