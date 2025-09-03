describe('TestTarget Utils', () => {
    let TestTargetUtils;
    let storage;
    let Location;
    let skuUtils;
    let urlUtils;
    let userUtils;
    let basketUtils;
    let LOCAL_STORAGE;
    let getParamValueAsSingleStringStub;
    let getItemStub;
    let getProfileStatusStub;

    const fakePromise = {
        then: resolve => {
            resolve({
                creditCards: [
                    {
                        cardNumber: 'xxxx-xxxx-xxxx-1111',
                        cardType: 'VISA',
                        creditCardId: 'usercc9005120009',
                        expirationMonth: '12',
                        expirationYear: '2021',
                        firstName: 'vj',
                        isDefault: true,
                        isExpired: false,
                        lastName: 'qa4'
                    }
                ]
            });
        },
        catch: () => () => {}
    };

    const pdpPageDataStub = {
        productDetails: {
            productId: 'P457449',
            rating: 4.4333
        },
        parentCategory: {
            categoryId: 'cat60075',
            displayName: 'Sponges & Applicators',
            parentCategory: {
                categoryId: 'cat1520033',
                displayName: 'Brushes & Applicators'
            }
        },
        specialProdCategories: [{ seoName: 'clean-product' }]
    };

    beforeEach(() => {
        const profileApi = require('services/api/profile').default;
        spyOn(profileApi, 'getCreditCardsFromProfile').and.returnValue(fakePromise);
        TestTargetUtils = require('utils/TestTarget').default;
        storage = require('utils/localStorage/Storage').default;
        Location = require('utils/Location').default;
        skuUtils = require('utils/Sku').default;
        urlUtils = require('utils/Url').default;
        basketUtils = require('utils/Basket').default;
        userUtils = require('utils/User').default;
        Sephora.Util.TestTarget = { isLoggedIn: false };
        Sephora.template = 'Homepage/Homepage';
        LOCAL_STORAGE = require('utils/localStorage/Constants').default;
        getParamValueAsSingleStringStub = spyOn(urlUtils, 'getParamValueAsSingleString');
        getItemStub = spyOn(storage.local, 'getItem');
        getProfileStatusStub = spyOn(userUtils, 'getProfileStatus');
        Sephora.mboxAttrs = {};
    });

    afterEach(() => {
        Sephora.Util.TestTarget = {};
    });

    describe('getTotalDeliveredTests', () => {
        let mockResponse;

        it('should return 3 for the 3 dispatchTest calls in passed response - HTML Offers', () => {
            mockResponse = [
                {
                    content: `<script>
                        Sephora.Util.TestTarget.dispatchTest({});
                        Sephora.Util.TestTarget.dispatchTest({});
                    </script>`
                },
                {
                    content: `<script>
                        Sephora.Util.TestTarget.dispatchTest({});
                    </script>`
                }
            ];

            expect(TestTargetUtils.getTotalDeliveredTests(mockResponse)).toEqual(3);
        });

        it('should return 1 for the 1 JSON test in passed response - JSON Offers', () => {
            mockResponse = [
                {
                    action: TestTargetUtils.JSON_ACTION,
                    content: [{ DisableGuestCheckout: { activated: false } }]
                }
            ];

            expect(TestTargetUtils.getTotalDeliveredTests(mockResponse)).toEqual(1);
        });

        it('should return 0 for the 0 dispatchTest calls in passed response - HTML Offers', () => {
            mockResponse = [
                {
                    content: `<script>
                        console.log('fake test!');
                    </script>`
                },
                {
                    content: `<script>
                        console.log('fake test 2!');
                    </script>`
                }
            ];

            expect(TestTargetUtils.getTotalDeliveredTests(mockResponse)).toEqual(0);
        });

        const invalidTypes = [
            {
                value: undefined,
                type: 'undefined'
            },
            {
                value: null,
                type: 'null'
            },
            {
                value: {},
                type: 'object'
            },
            {
                value: 'props',
                type: 'string'
            },
            {
                value: 2,
                type: 'number'
            }
        ];

        using('Invalid types', invalidTypes, item => {
            it(`should return 0 if passed response is of type ${item.type}`, () => {
                expect(TestTargetUtils.getTotalDeliveredTests(item.value)).toBe(0);
            });
        });

        it('should return 0 if test in passed response does not have the custom code in the "content" property for HTML Offers', () => {
            mockResponse = [{ customCode: '<script>Sephora.Util.TestTarget.dispatchTest({});</script>' }];
            expect(TestTargetUtils.getTotalDeliveredTests(mockResponse)).toEqual(0);
        });
    });

    describe('getPageType', () => {
        it('should return the current page type', () => {
            expect(TestTargetUtils.getPageType()).toEqual('home page');
        });
    });

    describe('getPageName', () => {
        beforeEach(() => {
            spyOn(Location, 'isHomepage').and.returnValue(true);
        });

        it('should return the current page name', () => {
            expect(TestTargetUtils.getPageName()).toEqual('home page:home page:n/a:');
        });
    });

    describe('set productId param in mbox on setUserParams', () => {
        let isProductPageStub;

        beforeEach(() => {
            isProductPageStub = spyOn(Location, 'isProductPage');
        });

        it('should set productId if user is on product page', () => {
            isProductPageStub.and.returnValue(true);
            Sephora.mboxAttrs = TestTargetUtils.extractMboxParams(pdpPageDataStub);
            TestTargetUtils.setUserParams().then(value => {
                expect(value.productId).toBe('p457449');
            });
        });

        it('should not set productId if user is not on product page', () => {
            isProductPageStub.and.returnValue(false);
            Sephora.mboxAttrs = TestTargetUtils.extractMboxParams(pdpPageDataStub);
            TestTargetUtils.setUserParams().then(value => {
                expect(value.productId).toBeUndefined();
            });
        });
    });

    describe('set product categories values is it is on product page', () => {
        beforeEach(() => {
            spyOn(Location, 'isProductPage').and.returnValue(true);
        });

        describe('if product categories are set in product page props', () => {
            beforeEach(() => {
                Sephora.mboxAttrs = TestTargetUtils.extractMboxParams(pdpPageDataStub);
            });

            it('should set nthLevelCategory', () => {
                TestTargetUtils.setUserParams().then(value => {
                    expect(value.nthLevel).toBe('sponges & applicators');
                });
            });

            it('should set category', () => {
                TestTargetUtils.setUserParams().then(value => {
                    expect(value.category).toBe('brushes & applicators');
                });
            });
        });

        describe('if product categories are not set in product page props', () => {
            beforeEach(() => {
                Sephora.mboxAttrs = {};
            });
            it('should not set nthLevelCategory', () => {
                TestTargetUtils.setUserParams().then(value => {
                    expect(value.nthLevel).toBeUndefined();
                });
            });

            it('should not set category', () => {
                TestTargetUtils.setUserParams().then(value => {
                    expect(value.category).toBeUndefined();
                });
            });
        });
    });

    describe('set product special category values if it is on product page', () => {
        beforeEach(() => {
            spyOn(Location, 'isProductPage').and.returnValue(true);
        });

        it('should not have specialProdCat if there is no special category', () => {
            TestTargetUtils.setUserParams().then(value => {
                expect(value.specialProdCat).toBeUndefined();
            });
        });

        it('should have specialProdCat if there is special category', () => {
            Sephora.mboxAttrs = TestTargetUtils.extractMboxParams(pdpPageDataStub);
            TestTargetUtils.setUserParams().then(value => {
                expect(value.specialProdCat).toBe('clean');
            });
        });
    });

    describe('isRwdPdp parameter on the product page', () => {
        beforeEach(() => {
            spyOn(Location, 'isProductPage').and.returnValue(true);
        });

        it('should be true when the Sephora channel is RWD', () => {
            Sephora.channel = 'RWD';
            Sephora.mboxAttrs = TestTargetUtils.extractMboxParams(pdpPageDataStub);
            TestTargetUtils.setUserParams().then(value => {
                expect(value['profile.isRwdPdp']).toBeTrue();
            });
        });

        it('should be false when the Sephora channel is not RWD', () => {
            Sephora.channel = 'FS';
            Sephora.mboxAttrs = TestTargetUtils.extractMboxParams(pdpPageDataStub);
            TestTargetUtils.setUserParams().then(value => {
                expect(value['profile.isRwdPdp']).toBeFalse();
            });
        });
    });

    describe('isRwdPdp parameter when not the product page', () => {
        beforeEach(() => {
            spyOn(Location, 'isProductPage').and.returnValue(false);
        });

        it('should be sent to Target if the value was cached', () => {
            getItemStub.and.callFake(arg => {
                if (arg === LOCAL_STORAGE.TARGET_PRODUCT_PAGE_TYPE) {
                    return 'RWD';
                }

                return {};
            });
            Sephora.mboxAttrs = TestTargetUtils.extractMboxParams(pdpPageDataStub);
            TestTargetUtils.setUserParams().then(value => {
                expect(value['profile.isRwdPdp']).toBeTrue();
            });
        });
    });

    describe('set remainToFreeShipping param in mbox on setUserParams', () => {
        it('should set the correct value for international shipping', () => {
            spyOn(basketUtils, 'isUSorCanadaShipping').and.returnValue(false);
            TestTargetUtils.setUserParams().then(value => {
                expect(value.remainToFreeShipping).toBe('int_ship');
            });
        });

        it('should set the remainToFreeShipping if it exists in local storage', () => {
            getItemStub.and.returnValue({ remainToFreeShipping: '$50.00' });
            TestTargetUtils.setUserParams().then(value => {
                expect(value.remainToFreeShipping).toBe('50.00');
            });
        });

        it('should set the remainToFreeShipping if it exists in local storage for Canada', () => {
            getItemStub.and.returnValue({ remainToFreeShipping: 'C$50.00' });
            TestTargetUtils.setUserParams().then(value => {
                expect(value.remainToFreeShipping).toBe('C50.00');
            });
        });

        it('should set the remainToFreeShipping to empty if it does not exist', () => {
            getItemStub.and.returnValue({});
            TestTargetUtils.setUserParams().then(value => {
                expect(value.remainToFreeShipping).toBe('empty');
            });
        });

        it('should set the remainToFreeShipping to "rouge" for rouge users', () => {
            getItemStub.and.returnValue({ profile: { beautyInsiderAccount: { vibSegment: 'ROUGE' } } });
            TestTargetUtils.setUserParams().then(value => {
                expect(value.remainToFreeShipping).toBe('rouge');
            });
        });
    });

    describe('set signInStatus in mbox on setUserParams', () => {
        let userProfile;

        beforeEach(() => {
            getProfileStatusStub.and.returnValue(0);
        });

        it('should set signInStatus as unrecognized if profileStatus is 0', () => {
            TestTargetUtils.setUserParams(userProfile).then(value => {
                expect(value.signInStatus).toBe('unrecognized');
            });
        });

        it('should set signInStatus as recognized in if profileStatus is 2', () => {
            getProfileStatusStub.and.returnValue(2);

            TestTargetUtils.setUserParams(userProfile).then(value => {
                expect(value.signInStatus).toBe('recognized');
            });
        });

        it('should set signInStatus as signed in if profileStatus is 4', () => {
            getProfileStatusStub.and.returnValue(4);

            TestTargetUtils.setUserParams(userProfile).then(value => {
                expect(value.signInStatus).toBe('signed in');
            });
        });
    });

    describe('Profile attribute hasSavedCreditCards', () => {
        let profile = {};

        beforeEach(() => {
            profile = {
                hasSavedCreditCards: true
            };
            getProfileStatusStub.and.returnValue(2);
        });

        it('should set profile.hasSavedCreditCards attribute to true if user is recognized and their profile hasSavedCreditCards is true', () => {
            TestTargetUtils.setUserParams(profile).then(value => {
                expect(value['profile.hasSavedCreditCards']).toBe(true);
            });
        });

        it('should set profile.hasSavedCreditCards attribute to true if user is signed in and their profile hasSavedCreditCards is true', () => {
            getProfileStatusStub.and.returnValue(4);

            TestTargetUtils.setUserParams(profile).then(value => {
                expect(value['profile.hasSavedCreditCards']).toBe(true);
            });
        });

        it('should set profile.hasSavedCreditCards attribute to false if user is signed in and their profile hasSavedCreditCards is false', () => {
            profile = {
                hasSavedCreditCards: false
            };
            getProfileStatusStub.and.returnValue(4);

            TestTargetUtils.setUserParams(profile).then(value => {
                expect(value['profile.hasSavedCreditCards']).toBe(false);
            });
        });

        it('should not set profile.hasSavedCreditCards if user is not signed in', () => {
            getProfileStatusStub.and.returnValue(0);

            TestTargetUtils.setUserParams(profile).then(value => {
                expect(value['profile.hasSavedCreditCards']).toBeUndefined();
            });
        });
    });

    describe('BI Profile attributes', () => {
        let biUser = {};

        beforeEach(() => {
            biUser = {
                profile: {
                    beautyInsiderAccount: {
                        vibSpendingToNextSegment: 100,
                        optInForInsiderScoopBiMonthlyEmail: false,
                        optInForInsiderScoopMonthlyEmail: false,
                        optInForTipsAndTricksEmail: false,
                        optInForWhatsNewEmail: false,
                        vibSegment: 'VIB',
                        personalizedInformation: {},
                        promotionPoints: '100',
                        vibSpendingForYear: '10',
                        birthDay: 'dd',
                        birthMonth: 'mm',
                        birthYear: 'yyyy',
                        signupDate: 1535503419977
                    },
                    ccCardType: 'card',
                    userBeautyPreference: {
                        skinTone: ['skintone'],
                        hairType: ['yourhair'],
                        hairConcerns: ['hairconcerns'],
                        skinType: ['skintype'],
                        eyeColor: ['eyecolor'],
                        skinConcerns: ['skincareconcerns'],
                        hairColor: []
                    }
                }
            };
            getProfileStatusStub.and.returnValue(4);
        });

        it('should set BI profile.spendingToNextBISegment attribute if any optInEmail value is true', () => {
            TestTargetUtils.setUserParams(biUser).then(value => {
                expect(value['profile.spendingToNextBISegment']).toBe(100);
            });
        });

        it('should set BI profile.biStatus', () => {
            TestTargetUtils.setUserParams(biUser).then(value => {
                expect(value['profile.biStatus']).toBe('vib');
            });
        });

        it('should set BI profile.biPoints', () => {
            TestTargetUtils.setUserParams(biUser).then(value => {
                expect(value['profile.biPoints']).toBe('100');
            });
        });

        it('should set BI profile.biYtdSpend', () => {
            TestTargetUtils.setUserParams(biUser).then(value => {
                expect(value['profile.biYtdSpend']).toBe('10');
            });
        });

        it('should set BI profile.birthday', () => {
            TestTargetUtils.setUserParams(biUser).then(value => {
                expect(value['profile.birthday']).toBe('mm/dd/yyyy');
            });
        });

        /* TODO: Date issues again. Fix for any timezone
        it('should set BI profile.biSignUpDate', () => {
            expect(value['profile.biSignUpDate']).toBe('08/28/2018');
        });
        */

        describe('Account and Prescreen Info', () => {
            beforeEach(() => {
                biUser.profile.beautyInsiderAccount.ccAccountandPrescreenInfo = {
                    ccApprovalStatus: 'approval_status',
                    preScreenStatus: false
                };
                TestTargetUtils.setUserParams(biUser);
            });

            it('should set profile.ccApprovalStatus', () => {
                TestTargetUtils.setUserParams(biUser).then(value => {
                    expect(value['profile.ccApprovalStatus']).toBe('approval_status');
                });
            });

            it('should set profile.ccCardType', () => {
                TestTargetUtils.setUserParams(biUser).then(value => {
                    expect(value['profile.ccCardType']).toBe('card');
                });
            });

            it('should set profile.ccPreScreenStatus', () => {
                TestTargetUtils.setUserParams(biUser).then(value => {
                    expect(value['profile.ccPreScreenStatus']).toBe(false);
                });
            });
        });

        describe('Credit Card Targeters', () => {
            beforeEach(() => {
                getItemStub.and.callFake(arg => {
                    if (arg === LOCAL_STORAGE.CREDIT_CARD_TARGETERS) {
                        return {
                            CCDynamicMessagingBasketTargeter: 'basket',
                            CCDynamicMessagingInlineBasketTargeter: 'inline_basket',
                            CCDynamicMessagingLeftNavTargeter: 'left_nav',
                            CCDynamicMessagingCheckoutTargeter: 'checkout'
                        };
                    }

                    return {};
                });
            });

            it('should set profile.isUserTargetedForCreditCardBanners', () => {
                TestTargetUtils.setUserParams(biUser).then(value => {
                    expect(value['profile.isUserTargetedForCreditCardBanners']).toBe(true);
                });
            });

            it('should set profile.isUserTargetedForBasketCreditCardBanner', () => {
                TestTargetUtils.setUserParams(biUser).then(value => {
                    expect(value['profile.isUserTargetedForBasketCreditCardBanner']).toBe(true);
                });
            });

            it('should set profile.isUserTargetedForInlineBasketCreditCardBanner', () => {
                TestTargetUtils.setUserParams(biUser).then(value => {
                    expect(value['profile.isUserTargetedForInlineBasketCreditCardBanner']).toBe(true);
                });
            });

            it('should set profile.isUserTargetedForLeftNavCreditCardBanner', () => {
                TestTargetUtils.setUserParams(biUser).then(value => {
                    expect(value['profile.isUserTargetedForLeftNavCreditCardBanner']).toBe(true);
                });
            });

            it('should set profile.isUserTargetedForCheckoutCreditCardBanner', () => {
                TestTargetUtils.setUserParams(biUser).then(value => {
                    expect(value['profile.isUserTargetedForCheckoutCreditCardBanner']).toBe(true);
                });
            });
        });
    });

    describe('Personalized Information attributes', () => {
        let biUser = {};

        beforeEach(() => {
            biUser = {
                profile: {
                    beautyInsiderAccount: {
                        vibSegment: 'VIB',
                        personalizedInformation: {
                            eyeColor: [
                                {
                                    displayName: 'eyeColor',
                                    value: 'eyecolor'
                                }
                            ],
                            skinType: [
                                {
                                    displayName: 'skinType',
                                    value: 'skintype'
                                }
                            ],
                            skinTone: [
                                {
                                    displayName: 'skinTone',
                                    value: 'skinyone'
                                }
                            ],
                            hairColor: [
                                {
                                    displayName: 'hairColor',
                                    value: 'haircolor'
                                }
                            ],
                            skinConcerns: [
                                {
                                    displayName: 'skinConcerns',
                                    value: 'skinconcerns'
                                }
                            ],
                            hairDescrible: [
                                {
                                    displayName: 'yourHair',
                                    value: 'yourhair'
                                }
                            ],
                            hairConcerns: [
                                {
                                    displayName: 'hairCOncerns',
                                    value: 'hairconcerns'
                                }
                            ]
                        }
                    },
                    customerPreference: {
                        hair: { hairColor: [], hairType: ['yourhair'], hairConcerns: ['hairconcerns'] },
                        skinCare: { skinConcerns: ['skincareconcerns'], skinType: ['skintype'], skinTone: ['skintone'] },
                        eyes: { eyeColor: ['eyecolor'] }
                    }
                }
            };
            getProfileStatusStub.and.returnValue(4);
        });

        it('should set eyeColor attribute', () => {
            TestTargetUtils.setUserParams(biUser).then(value => {
                expect(value['profile.eyeColor']).toBe('eyecolor');
            });
        });

        it('should set skinType attribute', () => {
            TestTargetUtils.setUserParams(biUser).then(value => {
                expect(value['profile.skinType']).toBe('skintype');
            });
        });

        it('should set skinCareConcerns attribute', () => {
            TestTargetUtils.setUserParams(biUser).then(value => {
                expect(value['profile.skinCareConcerns']).toBe('skincareconcerns');
            });
        });

        it('should set skinTone attribute', () => {
            TestTargetUtils.setUserParams(biUser).then(value => {
                expect(value['profile.skinTone']).toBe('skintone');
            });
        });

        it('should set hairColor attribute', () => {
            TestTargetUtils.setUserParams(biUser).then(value => {
                expect(value['profile.hairColor']).toBe('null');
            });
        });

        it('should set yourHair attribute', () => {
            TestTargetUtils.setUserParams(biUser).then(value => {
                expect(value['profile.yourHair']).toBe('yourhair');
            });
        });

        it('should set hairConcerns attribute', () => {
            TestTargetUtils.setUserParams(biUser).then(value => {
                expect(value['profile.hairConcerns']).toBe('hairconcerns');
            });
        });
    });

    describe('Set the Target parameter, referringChannel, in setUserParam function', () => {
        it('should be organic', () => {
            getParamValueAsSingleStringStub.and.returnValue('');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.referringChannel).toBe('organic');
            });
        });

        it('should be organic', () => {
            getParamValueAsSingleStringStub.and.returnValue('asdadasd');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.referringChannel).toBe('organic');
            });
        });

        it('should be affiliate', () => {
            getParamValueAsSingleStringStub.and.returnValue('aff');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.referringChannel).toBe('affiliate');
            });
        });

        it('should be sms-us', () => {
            getParamValueAsSingleStringStub.and.returnValue('sms-us');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.referringChannel).toBe('sms-us');
            });
        });

        it('should be email', () => {
            getParamValueAsSingleStringStub.and.returnValue('ret');

            return TestTargetUtils.setUserParams().then(value => {
                expect(value.referringChannel).toBe('email');
            });
        });

        it('should be email', () => {
            getParamValueAsSingleStringStub.and.returnValue('tr');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.referringChannel).toBe('email');
            });
        });

        it('should be paid', () => {
            getParamValueAsSingleStringStub.and.returnValue('us_search');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.referringChannel).toBe('paid');
            });
        });

        it('should be paid', () => {
            getParamValueAsSingleStringStub.and.returnValue('ca_search');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.referringChannel).toBe('paid');
            });
        });

        it('should be paid', () => {
            getParamValueAsSingleStringStub.and.returnValue('google');

            return TestTargetUtils.setUserParams().then(value => {
                expect(value.referringChannel).toBe('paid');
            });
        });

        it('should be paid', () => {
            getParamValueAsSingleStringStub.and.returnValue('ytsrch');

            return TestTargetUtils.setUserParams().then(value => {
                expect(value.referringChannel).toBe('paid');
            });
        });

        it('should be paid', () => {
            getParamValueAsSingleStringStub.and.returnValue('gsp');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.referringChannel).toBe('paid');
            });
        });

        it('should be paid', () => {
            getParamValueAsSingleStringStub.and.returnValue('esv');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.referringChannel).toBe('paid');
            });
        });
    });

    describe('Set the Target parameter, queryParamMediaCampaign, in setUserParam function', () => {
        beforeEach(() => {
            getItemStub.and.returnValue(null);
        });

        it('should have the correct value if it starts with disp', () => {
            getParamValueAsSingleStringStub.and.returnValue('disp-cuteDog-226536623-118667708');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.queryParamMediaCampaign).toBe('cuteDog');
            });
        });

        it('should have the correct value if it starts with vid', () => {
            getParamValueAsSingleStringStub.and.returnValue('vid-cuteCat-226536623-118667708');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.queryParamMediaCampaign).toBe('cuteCat');
            });
        });

        it('should have the correct value if it starts with Facebook', () => {
            getParamValueAsSingleStringStub.and.returnValue('Facebook-cuteRabbit-226536623-118667708');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.queryParamMediaCampaign).toBe('cuteRabbit');
            });
        });

        it('should have the correct value if it starts with paid_social', () => {
            getParamValueAsSingleStringStub.and.returnValue('paid_social-cuteBird-226536623-118667708');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.queryParamMediaCampaign).toBe('cuteBird');
            });
        });

        it('should be undefined', () => {
            getParamValueAsSingleStringStub.and.returnValue('');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.queryParamMediaCampaign).toBeUndefined();
            });
        });

        it('should be undefined', () => {
            getParamValueAsSingleStringStub.and.returnValue('asdadasd');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.queryParamMediaCampaign).toBeUndefined();
            });
        });
    });

    describe('Set the Target parameter, queryParamEmcampaign, in setUserParam function', () => {
        it('should set the queryParamEmcampaign parameter for Target if emcampaign is in the URL', () => {
            getParamValueAsSingleStringStub.and.returnValue('emcampaign');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.queryParamEmcampaign).toBeDefined();
            });
        });
    });

    describe('Set the Target parameter, queryParamPromo, in setUserParam function', () => {
        it('should set the queryParamPromo parameter for Target if promo is in the URL', () => {
            getParamValueAsSingleStringStub.and.returnValue('promo');
            TestTargetUtils.setUserParams().then(value => {
                expect(value.queryParamPromo).toBeDefined();
            });
        });
    });

    // todo: find good way to test private methods getPageType and getPageName

    describe('Set the Target parameter, displayNameBrand, in setUserParam function', () => {
        let isBrandNthCategoryPageStub;
        const mboxAttrs = {};

        beforeEach(() => {
            Sephora.mboxAttrs = mboxAttrs;
            isBrandNthCategoryPageStub = spyOn(Location, 'isBrandNthCategoryPage');
        });

        it('should set the displayNameBrand parameter for Target on brand pages lower casing', () => {
            mboxAttrs.brandName = 'Urban Decay';
            isBrandNthCategoryPageStub.and.returnValue(true);
            TestTargetUtils.setUserParams({}).then(value => {
                expect(value.displayNameBrand).toBe('urban_decay');
            });
        });

        it('should set the displayNameBrand parameter for Target on brand pages removing special characters', () => {
            mboxAttrs.brandName = 'Urban% Decay';
            isBrandNthCategoryPageStub.and.returnValue(true);

            return TestTargetUtils.setUserParams({}).then(value => {
                expect(value.displayNameBrand).toBe('urban_decay');
            });
        });

        it('should set the displayNameBrand parameter for Target on brand pages removeing trailing spaces', () => {
            mboxAttrs.brandName = '  Urban Decay  ';
            isBrandNthCategoryPageStub.and.returnValue(true);
            TestTargetUtils.setUserParams({}).then(value => {
                expect(value.displayNameBrand).toBe('urban_decay');
            });
        });

        it('should set the displayNameBrand parameter for Target on brand pages removing diacritic chars', () => {
            mboxAttrs.brandName = 'Lacôme';
            isBrandNthCategoryPageStub.and.returnValue(true);
            TestTargetUtils.setUserParams({}).then(value => {
                expect(value.displayNameBrand).toBe('lacome');
            });
        });
    });

    describe('set cartSkus param in mbox on setUserParams', () => {
        it('should set the cartSkus if cart has items in local storage', () => {
            getItemStub.and.returnValue({
                items: [
                    {
                        sku: {
                            skuId: 1,
                            brandName: 'my brand'
                        }
                    },
                    {
                        sku: {
                            skuId: 2,
                            brandName: 'my brand'
                        }
                    }
                ]
            });
            TestTargetUtils.setUserParams().then(value => {
                expect(value.cartSkus).toBe('1,2');
            });
        });

        it('should not set the cartSkus if it does not exist', () => {
            getItemStub.and.returnValue({ basket: {} });
            TestTargetUtils.setUserParams().then(value => {
                expect(value.cartSkus).toBeUndefined();
            });
        });
    });

    describe('Set basketType parameter', () => {
        it('should set the basketType parameter to an empty string if DC & BOPIS baskets exist', () => {
            getItemStub.and.returnValue({
                items: [
                    {
                        sku: {
                            skuId: 1,
                            brandName: 'my brand'
                        }
                    }
                ],
                pickupBasket: {
                    items: [
                        {
                            sku: {
                                skuId: 1,
                                brandName: 'my brand'
                            }
                        }
                    ]
                }
            });
            TestTargetUtils.setUserParams().then(value => {
                expect(value.basketType).toEqual('');
            });
        });

        it('should not set the basketType parameter to an empty string there is only one basket type', () => {
            getItemStub.and.returnValue({
                pickupBasket: {
                    items: [
                        {
                            sku: {
                                skuId: 1,
                                brandName: 'my brand'
                            }
                        }
                    ]
                }
            });
            TestTargetUtils.setUserParams().then(value => {
                expect(value.basketType).toEqual('bopis');
            });
        });
    });

    describe('set cartBrands param in mbox on setUserParams', () => {
        it('should set the cartBrands if cart has items in local storage', () => {
            getItemStub.and.returnValue({
                items: [
                    {
                        sku: {
                            skuId: 1,
                            brandName: 'My Brand 1'
                        }
                    },
                    {
                        sku: {
                            skuId: 2,
                            brandName: 'My Brand 2'
                        }
                    }
                ]
            });
            TestTargetUtils.setUserParams().then(value => {
                expect(value.cartBrands).toBe('my_brand_1,my_brand_2');
            });
        });

        it('should change cartBrands if contains diacritics chars', () => {
            getItemStub.and.returnValue({
                items: [
                    {
                        sku: {
                            skuId: 1,
                            brandName: 'My Bránd 1'
                        }
                    },
                    {
                        sku: {
                            skuId: 2,
                            brandName: 'My Brand 2'
                        }
                    }
                ]
            });
            TestTargetUtils.setUserParams().then(value => {
                expect(value.cartBrands).toBe('my_brand_1,my_brand_2');
            });
        });

        it('should not set the cartBrands if it does not exist', () => {
            getItemStub.and.returnValue({});
            TestTargetUtils.setUserParams().then(value => {
                expect(value.cartBrands).toBeUndefined();
            });
        });
    });

    describe('total basket value', () => {
        describe('for US shipping', () => {
            beforeEach(() => {
                getItemStub.and.returnValue({
                    subtotal: '$30',
                    rawSubTotal: '$30'
                });
            });

            it('should set basket subtotal with proper value', () => {
                return TestTargetUtils.setUserParams().then(value => {
                    expect(value['subtotal']).toBe('30');
                });
            });

            it('should set basket subtotalAndDiscount with proper value', () => {
                TestTargetUtils.setUserParams().then(value => {
                    expect(value['subtotalAndDiscount']).toBe('30');
                });
            });
        });

        describe('for Canda shipping', () => {
            beforeEach(() => {
                getItemStub.and.returnValue({
                    subtotal: 'C$30',
                    rawSubTotal: 'C$30'
                });
            });

            it('should set basket subtotal with proper value', () => {
                TestTargetUtils.setUserParams().then(value => {
                    expect(value['subtotal']).toBe('C30');
                });
            });

            it('should set basket subtotalAndDiscount with proper value', () => {
                TestTargetUtils.setUserParams().then(value => {
                    expect(value['subtotalAndDiscount']).toBe('C30');
                });
            });
        });

        describe('for International Shipping', () => {
            beforeEach(() => {
                spyOn(basketUtils, 'isUSorCanadaShipping').and.returnValue(false);
            });

            it('should set basket subtotal with \'int_ship\'', () => {
                TestTargetUtils.setUserParams().then(value => {
                    expect(value['subtotal']).toBe('int_ship');
                });
            });

            it('should set basket subtotalAndDiscount with \'int_ship\'', () => {
                TestTargetUtils.setUserParams().then(value => {
                    expect(value['subtotalAndDiscount']).toBe('int_ship');
                });
            });
        });
    });

    describe('set appliedPromotionIds param in mbox on setUserParams', () => {
        beforeEach(() => {
            spyOn(Location, 'isProductPage').and.returnValue(true);
        });

        it('should set appliedPromotionIds if user applied promo codes', () => {
            getItemStub.and.returnValue({ appliedPromotions: [{ promotionId: '12' }, { promotionId: '21' }] });

            TestTargetUtils.setUserParams().then(value => {
                expect(value.appliedPromotionIds).toBe('12,21');
            });
        });

        it('should not set appliedPromotionIds if user does not have applied promo codes', () => {
            TestTargetUtils.setUserParams().then(value => {
                expect(value.appliedPromotionIds).toBeUndefined();
            });
        });
    });

    describe('set flagPromosApplied param in mbox on setUserParams', () => {
        beforeEach(() => {
            spyOn(Location, 'isProductPage').and.returnValue(true);
        });

        it('should set flagPromosApplied if user applied promo codes', () => {
            getItemStub.and.returnValue({ appliedPromotions: [{ promotionId: '12' }, { promotionId: '21' }] });

            TestTargetUtils.setUserParams().then(value => {
                expect(value.flagPromosApplied).toBeTruthy();
            });
        });

        it('should not set flagPromosApplied if user does not have applied promo codes', () => {
            TestTargetUtils.setUserParams().then(value => {
                expect(value.flagPromosApplied).toBeFalsy();
            });
        });
    });

    describe('set rating param in mbox on setUserParams', () => {
        let isStandardProductStub;

        beforeEach(() => {
            spyOn(Location, 'isProductPage').and.returnValue(true);
            isStandardProductStub = spyOn(skuUtils, 'isStandardProduct');
        });

        it('should set productId if user is on product page', () => {
            Sephora.mboxAttrs = TestTargetUtils.extractMboxParams(pdpPageDataStub);
            isStandardProductStub.and.returnValue(true);
            TestTargetUtils.setUserParams({}).then(value => {
                expect(value.rating).toBe('4.4');
            });
        });

        it('should not set productId if user is not on product page', () => {
            isStandardProductStub.and.returnValue(false);
            TestTargetUtils.setUserParams().then(value => {
                expect(value.rating).toBeUndefined();
            });
        });
    });

    describe('set browserUserStatus in mbox', () => {
        it('should be "new"', () => {
            getItemStub.and.callFake(arg => {
                if (arg === LOCAL_STORAGE.HAS_PREVIOUSLY_LOGGED_IN) {
                    return true;
                }

                if (arg === LOCAL_STORAGE.CREATED_NEW_USER) {
                    return 'fromSite';
                }

                return {};
            });

            TestTargetUtils.setUserParams().then(params => {
                expect(params.browserUserStatus).toBe('new');
            });
        });

        it('should be "store"', () => {
            getItemStub.and.callFake(arg => {
                if (arg === LOCAL_STORAGE.HAS_PREVIOUSLY_LOGGED_IN) {
                    return true;
                }

                if (arg === LOCAL_STORAGE.CREATED_NEW_USER) {
                    return 'fromStore';
                }

                return {};
            });

            TestTargetUtils.setUserParams().then(params => {
                expect(params.browserUserStatus).toBe('store');
            });
        });

        it('should be "existing"', () => {
            getItemStub.and.callFake(arg => {
                if (arg === LOCAL_STORAGE.HAS_PREVIOUSLY_LOGGED_IN) {
                    return true;
                }

                if (arg === LOCAL_STORAGE.CREATED_NEW_USER) {
                    return 'asdadasad';
                }

                return {};
            });

            TestTargetUtils.setUserParams().then(params => {
                expect(params.browserUserStatus).toBe('existing');
            });
        });

        it('should be "existing"', () => {
            getItemStub.and.callFake(arg => {
                if (arg === LOCAL_STORAGE.HAS_PREVIOUSLY_LOGGED_IN) {
                    return true;
                }

                if (arg === LOCAL_STORAGE.CREATED_NEW_USER) {
                    return undefined;
                }

                return {};
            });

            TestTargetUtils.setUserParams().then(params => {
                expect(params.browserUserStatus).toBe('existing');
            });
        });

        it('should be "unrecognized"', () => {
            getItemStub.and.callFake(arg => {
                if (arg === LOCAL_STORAGE.HAS_PREVIOUSLY_LOGGED_IN) {
                    return false;
                }

                return {};
            });

            TestTargetUtils.setUserParams().then(params => {
                expect(params.browserUserStatus).toBe('unrecognized');
            });
        });
    });
});
