/* eslint-disable no-unused-vars */
const { objectContaining } = jasmine;

describe('Sku utils', () => {
    let skuUtils;
    let skuHelpers;
    let userUtils;
    let storeGetStateStub;
    const standardSku = { type: 'standard' };
    const elegibleSku = {
        type: 'standard',
        isEligible: true
    };
    const nonElegibleSku = {
        type: 'standard',
        isEligible: false,
        isInBasket: true
    };
    const sampleSku = { type: 'sample' };
    const rewardSku = { biType: '100 points' };
    const subscriptionSku = { type: 'subscription' };
    const giftCardSku = { type: 'gift card' };
    const gwpSku = { type: 'gwp' };
    const appExclusiveSku = { isAppExclusive: true };
    const birthdayGift = { biType: 'birthday gift' };
    const welcomeKitSku = { biType: 'welcome kit' };
    const biExclusiveSku = { biExclusiveLevel: 'Rouge' };
    const vibFreeShippingSku = { skuId: '2168656' };
    const playBoxSku = { type: 'playbox' };
    const eGiftCardSku = { type: 'e-certificate' };
    const rrcSku = {
        biExclusiveLevel: 'Rouge',
        rewardSubType: 'Reward_Card'
    };
    const saleSku = {
        listPrice: '$23.25',
        salePrice: '$21.25'
    };
    const notSaleSku = {
        listPrice: '$23.25',
        salePrice: '$23.25'
    };
    const countryRestrictedSku = { actionFlags: { isRestrictedCountry: true } };
    const emailMeWhenBackInStoreSku = {
        isWithBackInStockTreatment: true,
        actionFlags: { backInStockReminderStatus: 'active' }
    };
    const storeOnlySku = { isShowAsStoreOnlyTreatment: true };
    const freeENScu = { listPrice: 'FREE' };
    const freeCAScu = { listPrice: 'GRATUIT' };
    beforeEach(function () {
        const store = require('Store').default;
        skuUtils = require('utils/Sku').default;
        skuHelpers = require('utils/skuHelpers').default;
        storeGetStateStub = spyOn(store, 'getState');
        const basketType = 'STANDARD';
    });
    describe('isInBasket', () => {
        it('should return false if basket.items is not present', () => {
            storeGetStateStub.and.returnValue({ user: { profileStatus: 2 } });

            expect(skuHelpers.isInBasket('123456', { items: [] })).toBeFalsy();
        });

        describe('with basket items', () => {
            beforeEach(function () {
                storeGetStateStub.and.returnValue({
                    basket: {
                        items: [{ sku: { skuId: '1' } }, { sku: { skuId: '2' } }, { sku: { skuId: '3' } }]
                    }
                });
            });

            it('should return false if the sku is not present', () => {
                expect(
                    skuHelpers.isInBasket('123456', {
                        items: [{ sku: { skuId: '1' } }, { sku: { skuId: '2' } }, { sku: { skuId: '3' } }]
                    })
                ).toBeFalsy();
            });

            it('should return true if the sku is present', () => {
                expect(
                    skuHelpers.isInBasket('2', {
                        items: [{ sku: { skuId: '1' } }, { sku: { skuId: '2' } }, { sku: { skuId: '3' } }]
                    })
                ).toBeTruthy();
            });
        });
    });

    describe('getImgSrc', () => {
        it('should return an image path according to size provided', () => {
            // Arrange
            const skuImages = { image1500: 'test' };

            // Act
            const imageSrc = skuUtils.getImgSrc(1500, skuImages);

            expect(imageSrc).toEqual('test');
        });

        it('should return default image path if no size found', () => {
            // Arrange
            const skuImages = { image: 'test' };

            // Act
            const imageSrc = skuUtils.getImgSrc(1500, skuImages);

            expect(imageSrc).toEqual('test');
        });

        it('should return imageUrl if no size found', () => {
            // Arrange
            const skuImages = { imageUrl: 'test' };

            // Act
            const imageSrc = skuUtils.getImgSrc(1500, skuImages);

            expect(imageSrc).toEqual('test');
        });
    });

    describe('isSubscription', () => {
        it('should return False if the Sku is not Subscription', () => {
            expect(skuUtils.isSubscription(standardSku)).toBeFalsy();
        });

        it('should return True if the Sku is Subscription', () => {
            expect(skuUtils.isSubscription(subscriptionSku)).toBeTruthy();
        });
    });

    describe('isShowEmailMeWhenBackInStore', () => {
        it('should return False if the Sku doesnt has back in stock treatment', () => {
            expect(skuUtils.isShowEmailMeWhenBackInStore(standardSku)).toBeFalsy();
        });

        it('should return True if the Sku has back in stock treatment', () => {
            expect(skuUtils.isShowEmailMeWhenBackInStore(emailMeWhenBackInStoreSku)).toBeTruthy();
        });
    });

    describe('isGiftCard', () => {
        it('should return False if the Sku is not GiftCard', () => {
            expect(skuUtils.isGiftCard(standardSku)).toBeFalsy();
        });

        it('should return True if the Sku is GiftCard', () => {
            expect(skuUtils.isGiftCard(giftCardSku)).toBeTruthy();
        });
    });

    describe('isGwp', () => {
        it('should return False if the Sku is not GWP', () => {
            expect(skuUtils.isGwp(standardSku)).toBeFalsy();
        });

        it('should return True if the Sku is GWP', () => {
            expect(skuUtils.isGwp(gwpSku)).toBeTruthy();
        });
    });

    describe('isAppExclusive', () => {
        it('should return false if the sku is not sold on native apps exclusively', () => {
            expect(skuUtils.isAppExclusive(standardSku)).toBeFalsy();
        });

        it('should return true if the sku is sold on native apps exclusively', () => {
            expect(skuUtils.isAppExclusive(appExclusiveSku)).toBeTruthy();
        });
    });

    describe('isBirthdayGift', () => {
        it('should return False if the Sku is not BI Birth Day Gift', () => {
            expect(skuUtils.isBirthdayGift(standardSku)).toBeFalsy();
        });

        it('should return True if the Sku is BI Birth Day Gift', () => {
            expect(skuUtils.isBirthdayGift(birthdayGift)).toBeTruthy();
        });
    });

    describe('isSample', () => {
        it('should return False if the Sku is not a Sample', () => {
            expect(skuUtils.isSample(standardSku)).toBeFalsy();
        });

        it('should return True if the Sku is a Sample', () => {
            expect(skuUtils.isSample(sampleSku)).toBeTruthy();
        });
    });

    describe('isBiReward', () => {
        it('should return False if the Sku is not a Reward', () => {
            expect(skuUtils.isBiReward(standardSku)).toBeFalsy();
        });

        it('should return True if the Sku is a Reward', () => {
            expect(skuUtils.isBiReward(rewardSku)).toBeTruthy();
        });
    });

    describe('isBiRewardGwpSample', () => {
        it('should return False if the Sku is not a Reward, GWP or Sample', () => {
            expect(skuUtils.isBiRewardGwpSample(standardSku)).toBeFalsy();
        });

        it('should return True if the Sku is a Reward', () => {
            expect(skuUtils.isBiRewardGwpSample(rewardSku)).toBeTruthy();
        });

        it('should return True if the Sku is a Sample', () => {
            expect(skuUtils.isBiRewardGwpSample(sampleSku)).toBeTruthy();
        });

        it('should return True if the Sku is a GWP', () => {
            expect(skuUtils.isBiRewardGwpSample(gwpSku)).toBeTruthy();
        });
    });

    describe('isEligible', () => {
        let nonBiUser;

        beforeEach(() => {
            userUtils = require('utils/User').default;
            nonBiUser = { user: {} };
            storeGetStateStub.and.returnValue(nonBiUser);
        });

        it('should be consistent with BI level qualified and BI points qualified and sku eligibility', done => {
            spyOn(skuUtils, 'isBiReward').and.returnValue(true);
            const isEligible = userUtils.isBiLevelQualifiedFor(standardSku) && userUtils.isBiPointsBiQualifiedFor(standardSku);
            skuUtils.isEligible(elegibleSku).then(result => {
                expect(result).toBe(isEligible);
                done();
            });
        });

        it('should be return false if sku is not elegible and if it is in basket ', done => {
            spyOn(skuUtils, 'isBiReward').and.returnValue(true);
            spyOn(skuUtils, 'isBirthdayGift').and.returnValue(false);
            skuUtils.isEligible(nonElegibleSku).then(result => {
                expect(result).toBe(false);
                done();
            });
        });

        it('should return true if isEligible key is not present and is isBiReward return true', done => {
            spyOn(skuUtils, 'isBiReward').and.returnValue(true);
            spyOn(userUtils, 'isBiLevelQualifiedFor').and.returnValue(true);
            spyOn(userUtils, 'isBiPointsBiQualifiedFor').and.returnValue(true);
            skuUtils.isEligible(standardSku).then(result => {
                expect(result).toBe(false);
                done();
            });
        });
    });

    describe('isWelcomeKit', () => {
        it('should return False if the Sku is not a BI Welcome Kit', () => {
            expect(skuUtils.isWelcomeKit(standardSku)).toBeFalsy();
        });

        it('should return True if the Sku is a BI Welcome Kit', () => {
            expect(skuUtils.isWelcomeKit(welcomeKitSku)).toBeTruthy();
        });
    });

    describe('isBiExclusive', () => {
        it('should return False if the Sku does not have a BI Exclusive Level', () => {
            expect(skuUtils.isBiExclusive(standardSku)).toBeFalsy();
        });

        it('should return True if the Sku does have a BI Exclusive Level', () => {
            expect(skuUtils.isBiExclusive(biExclusiveSku)).toBeTruthy();
        });
    });

    describe('isVIBFreeShipping', () => {
        it('should return False if the Sku is not VIB Free Shipping', () => {
            expect(skuUtils.isVIBFreeShipping(standardSku)).toBeFalsy();
        });

        it('should return True if the Sku is VIB Free Shipping', () => {
            expect(skuUtils.isVIBFreeShipping(vibFreeShippingSku)).toBeTruthy();
        });
    });

    describe('isEGiftCard', () => {
        it('should return False if the Sku is not E-Gift Card', () => {
            expect(skuUtils.isEGiftCard(standardSku)).toBeFalsy();
        });

        it('should return True if the Sku is E-Gift Card', () => {
            expect(skuUtils.isEGiftCard(eGiftCardSku)).toBeTruthy();
        });
    });

    describe('isStandardProduct', () => {
        it('should return False if the Sku is not Standard', () => {
            expect(skuUtils.isStandardProduct(sampleSku)).toBeFalsy();
        });

        it('should return True if the Sku is Standard', () => {
            expect(skuUtils.isStandardProduct(standardSku)).toBeTruthy();
        });
    });

    describe('isFreeText', () => {
        it('should return True if the Sku listPrice is FREE', () => {
            expect(skuUtils.isFreeText(freeENScu)).toBeTruthy();
            expect(skuUtils.isFreeText(freeCAScu)).toBeTruthy();
        });
    });

    describe('isFree', () => {
        it('should return True if the Sku is a birthdayGift', () => {
            expect(skuUtils.isFree(birthdayGift)).toBeTruthy();
        });
    });

    describe('isLoveEligible', () => {
        it('should return False if the Sku is not Love Eligible', () => {
            expect(skuUtils.isLoveEligible(sampleSku)).toBeFalsy();
        });

        it('should return True if the Sku is Love Eligible', () => {
            expect(skuUtils.isLoveEligible(standardSku)).toBeTruthy();
        });
    });

    describe('isCountryRestricted', () => {
        it('should return False if the Sku is not Country Restricted', () => {
            expect(skuUtils.isCountryRestricted(emailMeWhenBackInStoreSku)).toBeFalsy();
        });

        it('should return True if the Sku is Country Restricted', () => {
            expect(skuUtils.isCountryRestricted(countryRestrictedSku)).toBeTruthy();
        });
    });

    describe('isStoreOnly', () => {
        it('should return False if the Sku is not Store Only', () => {
            expect(skuUtils.isStoreOnly(standardSku)).toBeFalsy();
        });

        it('should return True if the Sku is Store Only', () => {
            expect(skuUtils.isStoreOnly(storeOnlySku)).toBeTruthy();
        });
    });

    describe('Product Loves Count', () => {
        let product;

        beforeEach(function () {
            product = {
                skuId: 1,
                regularChildSkus: [{ skuId: 2 }, { skuId: 3 }, { skuId: 4 }, { skuId: 5 }],
                lovesCount: 5
            };

            storeGetStateStub.and.returnValue({ loves: { shoppingListIds: [1, 2, 3] } });
        });

        it('should return sum of the loves for product and skus included in product', () => {
            expect(skuHelpers.getProductLovesCount(product)).toEqual('8');
        });

        it('should properly format loves count if its more then 1000', () => {
            product.lovesCount = 1000;
            expect(skuHelpers.getProductLovesCount(product)).toEqual('1K');
        });
    });

    describe('isRougeRewardCard', () => {
        it('should return true if the sku is an RRC', () => {
            expect(skuUtils.isRougeRewardCard(rrcSku)).toBeTruthy();
        });

        it('should return false if the sku is not an RRC', () => {
            expect(skuUtils.isRougeRewardCard(standardSku)).toBeFalsy();
        });
    });

    describe('getEmailMeText', () => {
        let sku, activeReminderStatusSku, inactiveReminderStatusSku;

        beforeEach(function () {
            inactiveReminderStatusSku = { actionFlags: { backInStockReminderStatus: 'inactive' } };

            activeReminderStatusSku = { actionFlags: { backInStockReminderStatus: 'active' } };
        });

        it('should return "Notify Me When Available" if reminder status is "inactive" and sku is not subscription type', () => {
            sku = Object.assign({}, inactiveReminderStatusSku);
            expect(skuUtils.getEmailMeText(sku)).toEqual('Notify Me When Available');
        });

        it('should return "Manage Notifications" if reminder status is "active"', () => {
            expect(skuUtils.getEmailMeText(activeReminderStatusSku)).toEqual('Manage Notifications');
        });

        it('should return undefined if reminder status is "active"', () => {
            expect(skuUtils.getEmailMeText({})).toBeUndefined();
        });
    });

    describe('isChanel', () => {
        let sku;

        // @TODO check if the structure of the object is the same as used in the product object
        it('should return true if brand is set and brandId is equal 1065', () => {
            sku = {
                brand: 'someBrand',
                brandId: '1065'
            };
            expect(skuUtils.isChanel(sku)).toBeTruthy();
        });
    });

    describe('getSkuFromProduct', () => {
        let product;

        it('should return a sku with skuId as requested', () => {
            product = { regularChildSkus: [{ skuId: 7 }] };
            expect(skuHelpers.getSkuFromProduct(product, 7)).toEqual(jasmine.objectContaining({ skuId: 7 }));
        });

        it('should return a sku with skuId as requested and selected the first from the list of coincided', () => {
            product = {
                regularChildSkus: [
                    {
                        skuId: 7,
                        type: 'regular'
                    }
                ],
                onSaleChildSkus: [
                    {
                        skuId: 7,
                        type: 'onsale'
                    }
                ]
            };
            expect(skuHelpers.getSkuFromProduct(product, 7)).toEqual(
                jasmine.objectContaining({
                    skuId: 7,
                    type: 'regular'
                })
            );
        });
    });

    describe('isCustomSetsSingleSkuProduct', () => {
        let product;

        it('should return value of product.currentSku.configurableOptions.skuOptions property', () => {
            product = { currentSku: { configurableOptions: { skuOptions: 'testValue' } } };
            expect(skuUtils.isCustomSetsSingleSkuProduct(product)).toEqual('testValue');
        });
    });

    describe('isCustomSetsGroupedSkuProduct', () => {
        let product;

        it('should return value of product.currentSku.configurableOptions.groupedSkuOptions property', () => {
            product = { currentSku: { configurableOptions: { groupedSkuOptions: 'testValue' } } };
            expect(skuUtils.isCustomSetsGroupedSkuProduct(product)).toEqual('testValue');
        });
    });

    describe('isFragrance', () => {
        let testVal, productWithSCFVariation, productWithoutVariation;

        beforeEach(function () {
            testVal = 'testSizeConcentrationFormulation';

            productWithSCFVariation = { variationType: testVal };
            productWithoutVariation = { variationType: 'nonTestSizeConcentrationFormulation' };
            skuUtils.skuVariationType.SIZE_CONCENTRATION_FORMULATION = testVal;
        });

        it('should return true if PRODUCT has variation type defined in SIZE_CONCENTRATION_FORMULATION', () => {
            expect(skuUtils.isFragrance(productWithSCFVariation, null)).toBeTruthy();
        });

        it('should return true if SKU has variation type defined in SIZE_CONCENTRATION_FORMULATION', () => {
            expect(skuUtils.isFragrance(null, productWithSCFVariation)).toBeTruthy();
        });

        it('should return true if PRODUCT AND SKU have variation type defined in SIZE_CONCENTRATION_FORMULATION', () => {
            expect(skuUtils.isFragrance(productWithSCFVariation, productWithSCFVariation)).toBeTruthy();
        });

        it('should return false if NEITHER PRODUCT OR SKU have variation type defined in SIZE_CONCENTRATION_FORMULATION', () => {
            expect(skuUtils.isFragrance(productWithoutVariation, null)).toBeFalsy();
        });

        it('should return false if NEITHER PRODUCT OR SKU have variation type defined in SIZE_CONCENTRATION_FORMULATION', () => {
            expect(skuUtils.isFragrance(null, productWithoutVariation)).toBeFalsy();
        });
    });

    describe('isInMsgPromoSkuList', () => {
        let testSkuIdVal;

        it('should return true if there is requested skuId is set in state.promo.msgPromosSkuList', () => {
            testSkuIdVal = 'testSkuIdVal';
            storeGetStateStub.and.returnValue({ promo: { msgPromosSkuList: [{ skuId: testSkuIdVal }] } });

            expect(skuHelpers.isInMsgPromoSkuList(testSkuIdVal)).toBeTruthy();
        });

        it('should return false if there is no requested skuId is set in state.promo.msgPromosSkuList', () => {
            // @TODO: change msgPromosSkuList -> msgPromoSkuList in the function, or opposite
            storeGetStateStub.and.returnValue({ promo: { msgPromosSkuList: [] } });

            expect(skuHelpers.isInMsgPromoSkuList(testSkuIdVal)).toBeFalsy();
        });
    });

    // @TODO to cover the function fully
    // direct access to the window props should be hidden in wrapper functions
    describe('getProductPageData', () => {
        let testProductIdVal;

        it('should return null if Sephora.renderQueryParams.urlPath contains properly defined string for the id', () => {
            testProductIdVal = 'P2342341';
            Sephora.renderQueryParams = { urlPath: 'someVal' };

            expect(skuUtils.getProductPageData()).toBeNull();
        });

        it('should return an object with set productIf if Sephora.renderQueryParams.urlPath contains proper format of the product id', () => {
            testProductIdVal = 'P2342341';
            Sephora.renderQueryParams = { urlPath: testProductIdVal };

            expect(skuUtils.getProductPageData()).toEqual(jasmine.objectContaining({ productId: testProductIdVal }));
        });
    });

    describe('productUrl', () => {
        let product, sku;

        it('should return a string product.targetUrl + \'?skuId=\' + sku.skuId if skuId is in the sku.targetUrl', () => {
            product = { targetUrl: 'productTargetUrl' };
            sku = {
                targetUrl: 'someSkuTargetUrl',
                skuId: 'skuIdTestIval'
            };

            expect(skuUtils.productUrl(product, sku)).toEqual(product.targetUrl + '?skuId=' + sku.skuId);
        });

        it('should return sku.targetUrl if sku.targetUrl has \'skuId\' substring', () => {
            product = {};
            sku = { targetUrl: 'skuId' };
            expect(skuUtils.productUrl(product, sku)).toEqual(sku.targetUrl);
        });

        it('should return null if product is null and sku.targetUrl has \'skuId\' substring', () => {
            product = null;
            sku = { targetUrl: 'skuId' };
            expect(skuUtils.productUrl(product, sku)).toBeNull();
        });
    });

    describe('isRewardDisabled', () => {
        let nonBiUser,
            sku,
            basketUtils,
            isAnonymousStub,
            isRewardEligibleStub,
            isCelebrationGiftStub,
            isCelebrationEligibleStub,
            isBirthdayGiftStub,
            isBirthdayGiftEligibleStub,
            isWelcomeKitStub,
            hasWelcomeKitStub,
            hasBirthdayGiftStub;

        beforeEach(() => {
            sku = {};
            nonBiUser = { user: {} };
            userUtils = require('utils/User').default;
            basketUtils = require('utils/Basket').default;

            isAnonymousStub = spyOn(userUtils, 'isAnonymous');
            isRewardEligibleStub = spyOn(userUtils, 'isRewardEligible');
            isCelebrationGiftStub = spyOn(skuUtils, 'isCelebrationGift');
            isCelebrationEligibleStub = spyOn(userUtils, 'isCelebrationEligible');
            isBirthdayGiftStub = spyOn(skuUtils, 'isBirthdayGift');
            isBirthdayGiftEligibleStub = spyOn(userUtils, 'isBirthdayGiftEligible');
            isWelcomeKitStub = spyOn(skuUtils, 'isWelcomeKit');
            hasWelcomeKitStub = spyOn(basketUtils, 'hasWelcomeKit');
            hasBirthdayGiftStub = spyOn(basketUtils, 'hasBirthdayGift');

            storeGetStateStub.and.returnValue(nonBiUser);
        });

        it('should return true if user is isAnonymous', () => {
            isAnonymousStub.and.returnValue(true);
            expect(skuUtils.isRewardDisabled(sku)).toBeTruthy();
        });

        it('should return true if user is not eligible by points', () => {
            isRewardEligibleStub.and.returnValue(false);
            expect(skuUtils.isRewardDisabled(sku)).toBeTruthy();
        });

        it('should return true if sku is celebration gift and user isn\'t eligible for it', () => {
            isCelebrationGiftStub.and.returnValue(true);
            isCelebrationEligibleStub.and.returnValue(false);
            expect(skuUtils.isRewardDisabled(sku)).toBeTruthy();
        });

        it('should return true if sku is birthday gift and user isn\'t eligible for it', () => {
            isBirthdayGiftStub.and.returnValue(true);
            isBirthdayGiftEligibleStub.and.returnValue(false);
            expect(skuUtils.isRewardDisabled(sku)).toBeTruthy();
        });

        it('should return true if sku is welcome gift and basket has it', () => {
            isWelcomeKitStub.and.returnValue(true);
            hasWelcomeKitStub.and.returnValue(true);
            expect(skuUtils.isRewardDisabled(sku)).toBeTruthy();
        });

        it('should return true if sku is celebration gift and basket has it', () => {
            isCelebrationGiftStub.and.returnValue(true);
            expect(skuUtils.isRewardDisabled(sku)).toBeTruthy();
        });

        it('should return true if sku is birthday gift and basket has it', () => {
            isBirthdayGiftStub.and.returnValue(true);
            hasBirthdayGiftStub.and.returnValue(true);
            expect(skuUtils.isRewardDisabled(sku)).toBeTruthy();
        });
    });

    describe('isHardGood', () => {
        let sku, stubs;
        const stubNames = ['isWelcomeKit', 'isBiReward', 'isBirthdayGift', 'isGwp', 'isSample', 'isGiftCard'];

        beforeEach(() => {
            stubs = stubNames.map(functionName => spyOn(skuUtils, functionName).and.returnValue(false));
        });

        it('should return true if sku is not a welcome unit, not a birthday gift, not a gwp, not a sample, not a gift card', () => {
            expect(skuUtils.isHardGood(sku)).toBeTruthy();
        });

        it('should return false if sku is either a welcome unit, or a birthday gift, or a gwp, or a sample, or a gift card', () => {
            for (let i = 0; i < stubs.length; i++) {
                stubs[i].and.returnValue(true);
                expect(skuUtils.isHardGood(sku)).toBeFalsy();
                stubs[i].and.returnValue(false);
            }
        });

        it('should return true if includeBiReward flag is true and item is hard Bi reward', () => {
            stubs[1].and.returnValue(true);
            expect(skuUtils.isHardGood(sku, true)).toBeTruthy();
        });

        it('should return false if includeBiReward flag is true and item is soft Bi reward', () => {
            stubs[0].and.returnValue(true);
            stubs[1].and.returnValue(true);
            expect(skuUtils.isHardGood(sku, true)).toBeFalsy();
        });
    });

    describe('isBiQualify', () => {
        let sku, isAnonymousStub, isBIStub, isBiLevelQualifiedForStub, isBiExclusiveStub;

        beforeEach(() => {
            sku = {};
            userUtils = require('utils/User').default;
            isAnonymousStub = spyOn(userUtils, 'isAnonymous');
            isBIStub = spyOn(userUtils, 'isBI');
            isBiLevelQualifiedForStub = spyOn(userUtils, 'isBiLevelQualifiedFor');

            isBiExclusiveStub = spyOn(skuHelpers, 'isBiExclusive');
        });

        it('should return isBiLevelQualifiedFor if isBiExclusive, not isAnonymous and isBI', () => {
            isBiExclusiveStub.and.returnValue(true);
            isAnonymousStub.and.returnValue(false);
            isBIStub.and.returnValue(true);
            isBiLevelQualifiedForStub.and.returnValue('testString');

            expect(skuHelpers.isBiQualify(sku)).toEqual('testString');
        });

        it('should return false if isBiExclusive, but isAnonymous', () => {
            isBiExclusiveStub.and.returnValue(true);
            isAnonymousStub.and.returnValue(true);

            expect(skuHelpers.isBiQualify(sku)).toBeFalsy();
        });

        it('should return false if isBiExclusive, isAnonymous, but not isBI', () => {
            isBiExclusiveStub.and.returnValue(true);
            isAnonymousStub.and.returnValue(false);
            isBIStub.and.returnValue(false);

            expect(skuHelpers.isBiQualify(sku)).toBeFalsy();
        });

        it('should return false if sku not isBiExclusive', () => {
            isBiExclusiveStub.and.returnValue(false);
            expect(skuHelpers.isBiQualify(sku)).toBeFalsy();
        });
    });

    describe('isProductDisabled', () => {
        let sku, isBiExclusiveStub, isBiQualifyStub, isBiRewardStub;

        beforeEach(() => {
            isBiExclusiveStub = spyOn(skuHelpers, 'isBiExclusive');
            isBiQualifyStub = spyOn(skuHelpers, 'isBiQualify');
            isBiRewardStub = spyOn(skuHelpers, 'isBiReward');
        });

        it('should return true if the sku isOutOfStock', () => {
            sku = { isOutOfStock: true };
            expect(skuHelpers.isProductDisabled(sku)).toBeTruthy();
        });

        it('should return true if the sku isOutOfStock, isBiExclusive and not isBiQualify', () => {
            sku = { isOutOfStock: false };
            isBiExclusiveStub.and.returnValue(true);
            isBiQualifyStub.and.returnValue(false);
            expect(skuHelpers.isProductDisabled(sku)).toBeTruthy();
        });

        it('should return false if the sku isOutOfStock, isBiExclusive and isBiQualify', () => {
            sku = { isOutOfStock: false };
            isBiExclusiveStub.and.returnValue(true);
            isBiQualifyStub.and.returnValue(true);
            expect(skuHelpers.isProductDisabled(sku)).toBeFalsy();
        });

        it('should return false if the sku is a reward and does not have a isEligible attribute', () => {
            sku = {};
            isBiRewardStub.and.returnValue(true);
            expect(skuHelpers.isProductDisabled(sku)).toBeFalsy();
        });

        it('should return true if the sku is a reward and isEligible is false', () => {
            sku = { isEligible: false };
            isBiRewardStub.and.returnValue(true);
            expect(skuHelpers.isProductDisabled(sku)).toBeTruthy();
        });

        it('should return false if the sku is a reward and isEligible is true', () => {
            sku = { isEligible: true };
            isBiRewardStub.and.returnValue(true);
            expect(skuHelpers.isProductDisabled(sku)).toBeFalsy();
        });
    });

    describe('purchasableQuantities', () => {
        let sku;

        it('should return [1] if isChangeableQuantity returns false', () => {
            spyOn(skuUtils, 'isChangeableQuantity').and.returnValue(false);
            sku = {};
            expect(skuUtils.purchasableQuantities(sku)).toEqual([1]);
        });

        it('should return [1,2,3,4,5] if maxPurchaseQuantity is set', () => {
            sku = { maxPurchaseQuantity: 5 };

            expect(skuUtils.purchasableQuantities(sku)).toEqual([1, 2, 3, 4, 5]);
        });

        it('should return null if maxPurchaseQuantity, isOutOfStock are not set and sku isChangeableQuantity', () => {
            sku = {};
            spyOn(skuUtils, 'isChangeableQuantity').and.returnValue(true);
            skuUtils.skuDefaults.quantity = undefined;

            expect(skuUtils.purchasableQuantities(sku)).toBeNull();
        });
    });

    describe('formatLoveCount', () => {
        let loveCount;

        it('should return string value of a number if loveCount is less than 9999', () => {
            loveCount = 998;
            expect(skuHelpers.formatLoveCount(loveCount)).toEqual('998');
        });

        it('should return K-formatted string if loveCount is more than 999', () => {
            loveCount = 1002;
            expect(skuHelpers.formatLoveCount(loveCount)).toEqual('1K');
        });

        it('should return K-formatted string rounded to first decimal place', () => {
            loveCount = 1103;
            expect(skuHelpers.formatLoveCount(loveCount)).toEqual('1.1K');
        });

        it('should return M-formatted string if loveCount is more than 999999', () => {
            loveCount = 1000002;
            expect(skuHelpers.formatLoveCount(loveCount)).toEqual('1M');
        });

        it('should return M-formatted string rounded to first decimal place', () => {
            loveCount = 10100002;
            expect(skuHelpers.formatLoveCount(loveCount)).toEqual('10.1M');
        });
    });

    describe('getProductLovesCount', () => {
        let product, isSkuLovedStub, formatLoveCountSpy;

        beforeEach(() => {
            isSkuLovedStub = spyOn(skuHelpers, 'isSkuLoved');
            formatLoveCountSpy = spyOn(skuHelpers, 'formatLoveCount');
        });

        it('should call skuHelpers.formatLoveCount with param = 0 if no current sku or lovesCount is set on the product', () => {
            product = {};
            skuHelpers.getProductLovesCount(product);

            expect(formatLoveCountSpy).toHaveBeenCalledWith(0);
        });

        it('should call skuHelpers.formatLoveCount with param = lovesCount if current sku is not loved', () => {
            product = { lovesCount: 2 };
            isSkuLovedStub.and.returnValue(false);

            skuHelpers.getProductLovesCount(product);
            expect(formatLoveCountSpy).toHaveBeenCalledWith(2);
        });

        it('should call skuHelpers.formatLoveCount with param = lovesCount + 1 if current sku is loved', () => {
            product = { lovesCount: 2 };
            isSkuLovedStub.and.returnValue(true);

            skuHelpers.getProductLovesCount(product);
            expect(formatLoveCountSpy).toHaveBeenCalledWith(3);
        });

        it('should call skuHelpers.formatLoveCount with param = lovesCount + 2 if current sku is loved and regularChild sku is not the same as skuId', () => {
            product = {
                skuId: 1,
                lovesCount: 2,
                regularChildSkus: [{ skuId: 2 }]
            };
            isSkuLovedStub.and.returnValue(true);

            skuHelpers.getProductLovesCount(product);
            expect(formatLoveCountSpy).toHaveBeenCalledWith(4);
        });

        it('should call skuHelpers.formatLoveCount with param = lovesCount + 1 if currentSku is same skuId in regularChildSkus', () => {
            product = {
                skuId: 2,
                lovesCount: 2,
                regularChildSkus: [{ skuId: 2 }]
            };
            isSkuLovedStub.and.returnValue(true);

            skuHelpers.getProductLovesCount(product);
            expect(formatLoveCountSpy).toHaveBeenCalledWith(3);
        });
    });

    describe('isChangeableQuantity', () => {
        let sku, stubs, isBiRewardStub;
        const stubNames = ['isWelcomeKit', 'isBirthdayGift', 'isGwp', 'isSample', 'isGiftCard'];

        beforeEach(() => {
            stubs = stubNames.map(functionName => spyOn(skuUtils, functionName).and.returnValue(false));
            isBiRewardStub = spyOn(skuUtils, 'isBiReward'); // isBiReward has different logic
        });

        it('should return true if sku is not a welcome unit, not a birthday gift, not a gwp, not a sample, not a gift card but has set maxPurchaseQuantity and isBiReward', () => {
            sku = {};
            isBiRewardStub.and.returnValue(false);
            expect(skuUtils.isChangeableQuantity(sku)).toBeTruthy();
        });

        it('should return true if sku is not a welcome unit, not a birthday gift, not a gwp, not a sample, not a gift card but has set maxPurchaseQuantity', () => {
            sku = { maxPurchaseQuantity: 1 };
            isBiRewardStub.and.returnValue(false);
            expect(skuUtils.isChangeableQuantity(sku)).toBeTruthy();
        });

        it('should return true if sku is not a welcome unit, not a birthday gift, not a gwp, not a sample, not a gift card but isBiReward', () => {
            sku = {};
            isBiRewardStub.and.returnValue(true);
            expect(skuUtils.isChangeableQuantity(sku)).toBeTruthy();
        });

        it('should return false if sku is either a welcome unit, or a birthday gift, or a gwp, or a sample, OOS or a gift card', () => {
            isBiRewardStub.and.returnValue(true);
            sku = { isOutOfStock: true };

            for (let i = 0; i < stubs.length; i++) {
                stubs[i].and.returnValue(true);
                expect(skuUtils.isChangeableQuantity(sku)).toBeFalsy();
                stubs[i].and.returnValue(false);
            }
        });
    });

    describe('brandShowUserGeneratedContent', () => {
        it('should return true if the brandId is in a list of brands without ugc content', () => {
            skuUtils.BRANDS_WIHOUT_UGC_CONTENT = ['15'];
            expect(skuUtils.brandShowUserGeneratedContent('15')).toBeTruthy();
        });

        it('should return false if the brandId is not in a list of brands without ugc content', () => {
            skuUtils.BRANDS_WIHOUT_UGC_CONTENT = ['14'];
            expect(skuUtils.brandShowUserGeneratedContent('232')).toBeTruthy();
        });
    });

    describe('getViewDetailsUrl', () => {
        let sku, product, isSampleStub;

        beforeEach(() => {
            isSampleStub = spyOn(skuUtils, 'isSample');
        });

        it('should return sku.targetUrl if sku is a sample, and sku.fullSizeProductUrl and product.productId are set', () => {
            sku = {
                fullSizeProductUrl: 'testFullSizeProductUrl',
                targetUrl: 'testTargetUrl'
            };
            product = { productId: 'testProductId' };

            isSampleStub.and.returnValue(true);

            expect(skuUtils.getViewDetailsUrl(sku, product)).toEqual(sku.targetUrl);
        });

        it('should return a formatted string if sku.fullSizeProductUrl and product.productId are set, but sku is not a sample', () => {
            sku = {
                fullSizeProductUrl: 'testFullSizeProductUrl',
                targetUrl: 'testTargetUrl',
                fullSizeSkuId: 'testFullSizeSkuId'
            };
            product = { productId: 'testProductId' };

            isSampleStub.and.returnValue(false);

            expect(skuUtils.getViewDetailsUrl(sku, product)).toEqual(`/product/${sku.fullSizeProductId}?skuId=${sku.fullSizeSkuId}`);
        });

        it('should return a formatted string, without duplicating skuId if skuId is already present', () => {
            sku = {
                fullSizeSkuId: 'testFullSizeSkuId',
                fullSizeSku: { targetUrl: 'testTargetUrl?skuId=testFullSizeSkuId' }
            };
            product = { productId: 'testProductId' };

            isSampleStub.and.returnValue(false);

            expect(skuUtils.getViewDetailsUrl(sku, product)).toEqual(sku.fullSizeSku.targetUrl);
        });

        it('should return null if sku.fullSizeProductUrl is set but product.productId is not', () => {
            sku = { fullSizeProductUrl: 'testFullSizeProductUrl' };
            product = { productId: '' };

            expect(skuUtils.getViewDetailsUrl(sku, product)).toBeNull();
        });

        it('should return null if sku is a sample and fullSizeProductUrl is not set', () => {
            sku = { fullSizeProductUrl: '' };

            isSampleStub.and.returnValue(true);

            expect(skuUtils.getViewDetailsUrl(sku, product)).toBeNull();
        });
    });

    describe('showColorIQOnPPage', () => {
        let product, getUserSkinTonesStub;

        beforeEach(() => {
            userUtils = require('utils/User').default;
            getUserSkinTonesStub = spyOn(userUtils, 'getUserSkinTones');
        });

        it('should return true if product displayName is Foundation', () => {
            getUserSkinTonesStub.and.returnValue([13]);
            product = {
                parentCategory: { displayName: 'Foundation' }
            };
            expect(skuUtils.showColorIQOnPPage(product)).toBeTruthy();
        });

        it('should return true if product displayName is Concealer', () => {
            getUserSkinTonesStub.and.returnValue([13]);
            product = {
                parentCategory: { displayName: 'Concealer' }
            };

            expect(skuUtils.showColorIQOnPPage(product)).toBeTruthy();
        });

        it('should return false if product displayName is not a Concealer or Foundation', () => {
            getUserSkinTonesStub.and.returnValue([13]);
            product = {
                parentCategory: { displayName: 'SomeOtherName' }
            };

            expect(skuUtils.showColorIQOnPPage(product)).toBeFalsy();
        });
    });

    describe('isColorIQEnabled functions', () => {
        it('should return true when product has colors and belongs to "Foundation" category', () => {
            // Arrange
            const product = {
                parentCategory: { displayName: 'Foundation' },
                regularChildSkus: [{}]
            };

            // Act
            const result = skuUtils.isColorIQEnabled(product);

            // Assert
            expect(result).toBeTruthy();
        });

        it('should return true when product has colors and belongs to "Concealer" category', () => {
            // Arrange
            const product = {
                parentCategory: { displayName: 'Concealer' },
                regularChildSkus: [{}]
            };

            // Act
            const result = skuUtils.isColorIQEnabled(product);

            // Assert
            expect(result).toBeTruthy();
        });

        it('should return false when product has colors but does not belong to "Foundation" or "Concealer" category', () => {
            // Arrange
            const product = {
                parentCategory: { displayName: 'Category' },
                regularChildSkus: [{}]
            };

            // Act
            const result = skuUtils.isColorIQEnabled(product);

            // Assert
            expect(result).toBeFalsy();
        });

        it('should return false when product does not have colors', () => {
            // Arrange
            const product = {
                parentCategory: { displayName: 'Foundation' },
                regularChildSkus: []
            };

            // Act
            const result = skuUtils.isColorIQEnabled(product);

            // Assert
            expect(result).toBeFalsy();
        });
    });

    describe('isRougeRewardCard', () => {
        let sku;

        it('should return true if the reward sub type is RRC', () => {
            sku = { rewardSubType: skuUtils.skuTypes.ROUGE_REWARD_CARD };
            expect(skuUtils.isRougeRewardCard(sku)).toBeTruthy();
        });

        it('should return false if the reward sub type is not defined', () => {
            sku = {};
            expect(skuUtils.isRougeRewardCard(sku)).toBeFalsy();
        });

        it('should return false if the reward sub type is not RRC', () => {
            sku = { rewardSubType: skuUtils.skuTypes.SAMPLE };
            expect(skuUtils.isRougeRewardCard(sku)).toBeFalsy();
        });
    });

    describe('isCelebrationGift', () => {
        let sku;
        it('should return true if product is celebration gift', () => {
            sku = { biType: 'CELEBRATION GIFT' };
            expect(skuUtils.isCelebrationGift(sku)).toBeTruthy();
        });
        it('should return true if product is rouge welcome kit', () => {
            sku = { biType: 'rouge welcome kit' };
            expect(skuUtils.isCelebrationGift(sku)).toBeTruthy();
        });
        it('should return false if product is not rouge welcome kit or celebration gift', () => {
            sku = { biType: 'Birthday Gift' };
            expect(skuUtils.isCelebrationGift(sku)).toBeFalsy();
        });
    });

    describe('getProductVariations', () => {
        it('should return an object containing the correct product variation values when product is provided', () => {
            const product = {
                variationType: 'variationType',
                variationTypeDisplayName: 'variationDisplayName'
            };
            expect(skuUtils.getProductVariations({ product })).toEqual(
                objectContaining({
                    product: {
                        variationType: product.variationType,
                        variationTypeDisplayName: product.variationTypeDisplayName
                    }
                })
            );
        });

        it('should return an object containing the correct sku variation values when sku is provided', () => {
            const sku = {
                variationType: 'variationType',
                variationTypeDisplayName: 'variationTypeDisplayName',
                variationValue: 'variationValue',
                variationDesc: 'variationDesc',
                isOnlyFewLeft: 'isOnlyFewLeft'
            };
            expect(skuUtils.getProductVariations({ sku })).toEqual(
                objectContaining({
                    sku: {
                        variationType: sku.variationType,
                        variationTypeDisplayName: sku.variationTypeDisplayName,
                        variationValue: sku.variationValue,
                        variationDesc: sku.variationDesc,
                        isOnlyFewLeft: sku.isOnlyFewLeft
                    }
                })
            );
        });

        it('should return an object containing product and sku objects with undefined variation values if called without params', () => {
            expect(skuUtils.getProductVariations()).toEqual({
                product: {
                    variationType: undefined,
                    variationTypeDisplayName: undefined
                },
                sku: {
                    variationType: undefined,
                    variationTypeDisplayName: undefined,
                    variationValue: undefined,
                    variationDesc: undefined,
                    isOnlyFewLeft: undefined
                }
            });
        });
    });
});
