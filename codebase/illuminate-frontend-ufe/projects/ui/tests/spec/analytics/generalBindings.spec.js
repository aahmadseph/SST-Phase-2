import generalBindings from 'analytics/bindingMethods/pages/all/generalBindings';

/* eslint max-len: [0] */
describe('general bindings group', function () {
    const bindingMethods = require('analytics/bindingMethods/pages/all/generalBindings').default;
    const analyticsConsts = require('analytics/constants').default;
    const userUtils = require('utils/User').default;
    const biUtils = require('utils/BiProfile').default;
    const store = require('store/Store').default;
    const { APPROVAL_STATUS } = require('constants/CreditCard');

    describe('getSignInStatus', () => {
        it('determines sign in status', () => {
            const signedIn = { profileStatus: 4 };
            const recognized = { profileStatus: 2 };
            const unrecognized = { profileStatus: 0 };

            expect(bindingMethods.getSignInStatus(signedIn)).toEqual('signed in');
            expect(bindingMethods.getSignInStatus(recognized)).toEqual('recognized');
            expect(bindingMethods.getSignInStatus(unrecognized)).toEqual('unrecognized');
        });
    });

    describe('getCatName', () => {
        let mockItems = [
            {
                commerceId: 'ci903708000137',
                listPriceSubtotal: '$29.50',
                modifiable: true,
                qty: 1,
                sku: {
                    actionFlags: {
                        backInStockReminderStatus: 'notApplicable',
                        isAddToBasket: true,
                        isFullSizeSkuOrderable: false,
                        myListStatus: 'notAdded'
                    },
                    biExclusiveLevel: 'BI',
                    brandId: '1073',
                    brandName: 'Dior',
                    displayName: 'Dior Diorshow Mascara',
                    displayText: 'Dior Diorshow Mascara',
                    fullSiteProductUrl: 'https://qa3.sephora.com/product/diorshow-mascara-P396240?skuId=1689744',
                    image: '/productimages/sku/s1689744-main-Lthumb.jpg',
                    isActive: true,
                    isGoingFast: false,
                    isHazmat: false,
                    isLimitedEdition: false,
                    isOnlyFewLeft: false,
                    isOutOfStock: false,
                    isPaypalRestricted: false,
                    isProp65: false,
                    listPrice: '$29.50',
                    maxPurchaseQuantity: 10,
                    parentCategory: {
                        categoryId: 'cat60026',
                        displayName: 'Mascara',
                        targetUrl: '/shop/mascara',
                        url: 'http://10.105.36.160:80/v1/catalog/categories/cat140006',
                        parentCategory: {
                            categoryId: 'cat130054',
                            displayName: 'Eye',
                            url: 'http://10.105.36.160:80/v1/catalog/categories/cat130054',
                            targetUrl: '/shop/eye-makeup',
                            parentCategory: {
                                categoryId: 'cat140006',
                                displayName: 'Makeup',
                                targetUrl: '/shop/makeup-cosmetics',
                                url: 'http://10.105.36.160:80/v1/catalog/categories/cat60026/products?sortBy=-1&currentPage=1&content=true'
                            }
                        }
                    },
                    primaryProduct: {},
                    productId: 'P396240',
                    productName: 'Diorshow Mascara',
                    size: '0.33 oz/ 10 mL',
                    skuId: '1689744',
                    skuImages: {
                        image62: '/productimages/sku/s1689744-main-Lthumb.jpg',
                        image97: '/productimages/sku/s1689744-main-Sgrid.jpg',
                        image135: '/productimages/sku/s1689744-main-grid.jpg',
                        image162: '/productimages/sku/s1689744-162.jpg',
                        image250: '/productimages/sku/s1689744-main-hero.jpg',
                        image450: '/productimages/sku/s1689744-main-Lhero.jpg'
                    },
                    targetUrl: '/product/diorshow-mascara-P396240',
                    type: 'Standard',
                    url: 'http://10.105.36.160:80/v1/catalog/products/P396240?preferedSku=1689744',
                    variationType: 'Color',
                    variationValue: 'Black 090',
                    status: 'N/A'
                }
            },
            {
                commerceId: 'ci903708000137',
                listPriceSubtotal: '$29.50',
                modifiable: true,
                qty: 1,
                sku: {
                    actionFlags: {
                        backInStockReminderStatus: 'notApplicable',
                        isAddToBasket: true,
                        isFullSizeSkuOrderable: false,
                        myListStatus: 'notAdded'
                    },
                    biExclusiveLevel: 'BI',
                    brandId: '1073',
                    brandName: 'Dior',
                    displayName: 'Dior Diorshow Mascara',
                    displayText: 'Dior Diorshow Mascara',
                    fullSiteProductUrl: 'https://qa3.sephora.com/product/diorshow-mascara-P396240?skuId=1689744',
                    image: '/productimages/sku/s1689744-main-Lthumb.jpg',
                    isActive: true,
                    isGoingFast: false,
                    isHazmat: false,
                    isLimitedEdition: false,
                    isOnlyFewLeft: false,
                    isOutOfStock: false,
                    isPaypalRestricted: false,
                    isProp65: false,
                    listPrice: '$29.50',
                    maxPurchaseQuantity: 10,
                    parentCategory: {
                        categoryId: 'cat60026',
                        displayName: 'Woman',
                        targetUrl: '/shop/woman',
                        url: 'http://10.105.36.160:80/v1/catalog/categories/cat140006',
                        parentCategory: {
                            categoryId: 'cat130054',
                            displayName: 'Fragrance',
                            url: 'http://10.105.36.160:80/v1/catalog/categories/cat130054',
                            targetUrl: '/shop/fragrance'
                        }
                    },
                    primaryProduct: {},
                    productId: 'P396240',
                    productName: 'Diorshow Mascara',
                    size: '0.33 oz/ 10 mL',
                    skuId: '1689744',
                    skuImages: {
                        image62: '/productimages/sku/s1689744-main-Lthumb.jpg',
                        image97: '/productimages/sku/s1689744-main-Sgrid.jpg',
                        image135: '/productimages/sku/s1689744-main-grid.jpg',
                        image162: '/productimages/sku/s1689744-162.jpg',
                        image250: '/productimages/sku/s1689744-main-hero.jpg',
                        image450: '/productimages/sku/s1689744-main-Lhero.jpg'
                    },
                    targetUrl: '/product/diorshow-mascara-P396240',
                    type: 'Standard',
                    url: 'http://10.105.36.160:80/v1/catalog/products/P396240?preferedSku=1689744',
                    variationType: 'Color',
                    variationValue: 'Black 090',
                    status: 'N/A'
                }
            }
        ];

        it('returns a list of categories in a parent/child category sequence', () => {
            expect(bindingMethods.getCatName(mockItems, 'cat')).toEqual(['Makeup', 'Fragrance']);
        });

        it('returns a list of subcategories in a parent/child category sequence', () => {
            expect(bindingMethods.getCatName(mockItems, 'subCat')).toEqual(['Eye', 'Woman']);
        });
        it('should ignore Gift Card and Play items', () => {
            mockItems = mockItems.concat([
                {
                    qty: 1,
                    sku: {
                        parentCategory: { displayName: 'Subscription' },
                        type: 'Subscription'
                    }
                },
                {
                    qty: 1,
                    sku: {
                        parentCategory: { displayName: 'Gift Card' },
                        type: 'gift card'
                    }
                }
            ]);
            expect(bindingMethods.getCatName(mockItems, 'cat')).toEqual(['Makeup', 'Fragrance']);
        });
    });

    describe('getPlatform', () => {
        let isMobile;

        beforeEach(() => {
            isMobile = spyOn(Sephora, 'isMobile');
        });

        it('should return mobile when Sephora.isMobile is true', () => {
            //Mobile experience
            isMobile.and.returnValue(true);

            expect(bindingMethods.getPlatform()).toEqual('mobile');
        });

        it('should return desktop web when Sephora.isMobile is false', () => {
            //Desktop experience
            isMobile.and.returnValue(false);

            expect(bindingMethods.getPlatform()).toEqual('desktop web');
        });

        it('should return tablet web when Sephora.isMobile is false and Sephora.isTouch is true', () => {
            //Tablet experience
            isMobile.and.returnValue(false);
            Sephora.isTouch = true;

            expect(bindingMethods.getPlatform()).toEqual('tablet web');
        });
    });

    describe('getUrsTrackingCode', () => {
        //Requirements here: https://jira.sephora.com/browse/ILLUPH-32242

        it('determines the URS Tracking code', () => {
            let testReferrer = 'google.com';
            const withMMC = '?om_mmc=ursCode-afterHyphen';
            const noMMC = '?whatever=nothing';

            expect(bindingMethods.getUrsTrackingCode(withMMC, testReferrer)).toEqual('ursCode-afterHyphen');

            expect(bindingMethods.getUrsTrackingCode(noMMC, testReferrer)).toEqual('google.com[seo]');

            testReferrer = 'notOnTheList.com';
            expect(bindingMethods.getUrsTrackingCode(noMMC, testReferrer)).toEqual('notOnTheList.com[ref]');
        });
    });

    describe('getMarketingChannel', () => {
        //Requirements here: https://jira.sephora.com/browse/ILLUPH-32242

        it('determines the Marketing Channel', () => {
            let testReferrer = 'google.com';
            const withMMC = '?om_mmc=ursCode-afterHyphen';
            const noMMC = '?whatever=nothing';

            expect(bindingMethods.getMarketingChannel(withMMC, testReferrer)).toEqual('ursCode');

            expect(bindingMethods.getMarketingChannel(noMMC, testReferrer)).toEqual('Natural Search or SEO');

            testReferrer = 'notOnTheList.com';
            expect(bindingMethods.getMarketingChannel(noMMC, testReferrer)).toEqual('Referrals');
        });
    });

    describe('getPageName', () => {
        let isUserAtleastRecognizedStub;
        let isBIStub;

        beforeEach(() => {
            digitalData.page.category.pageType = analyticsConsts.PAGE_TYPES.USER_PROFILE;
            isUserAtleastRecognizedStub = spyOn(userUtils, 'isUserAtleastRecognized');
            isBIStub = spyOn(userUtils, 'isBI');
        });

        it('should return the correct page name for normal pages', () => {
            const path = ['testPage'];
            expect(bindingMethods.getPageName(path)).toEqual('testPage');
        });

        it('should return the last item in path on profile pages', () => {
            const path = ['community', 'richprofile', 'lists'];
            expect(bindingMethods.getPageName(path)).toEqual(analyticsConsts.PAGE_NAMES.LISTS_MAIN);
        });

        it('should return the correct page name for my account pages', () => {
            const path = ['community', 'richprofile', 'myaccount', 'orders'];
            expect(bindingMethods.getPageName(path)).toEqual(analyticsConsts.PAGE_NAMES.MY_ACCOUNT);
        });

        it('should return the page name for a signed in BI user on the beauty insider page', () => {
            const path = ['community', 'richprofile', 'BeautyInsider'];
            isUserAtleastRecognizedStub.and.returnValue(true);
            isBIStub.and.returnValue(true);
            expect(bindingMethods.getPageName(path, { rawPagePath: 'RichProfile/BeautyInsider' })).toEqual('my beauty insider-signed in');
        });

        it('should return the page name for a signed in non-BI user on the beauty insider page', () => {
            const path = ['community', 'richprofile', 'BeautyInsider'];
            isUserAtleastRecognizedStub.and.returnValue(true);
            isBIStub.and.returnValue(false);
            expect(bindingMethods.getPageName(path, { rawPagePath: 'RichProfile/BeautyInsider' })).toEqual('my beauty insider-benefits');
        });

        it('should return the page name for a signed out user on the beauty insider page', () => {
            const path = ['community', 'richprofile', 'BeautyInsider'];
            expect(
                bindingMethods.getPageName(path, {
                    rawPagePath: 'RichProfile/BeautyInsider',
                    user: { profileStatus: 0 }
                })
            ).toEqual('my beauty insider-anonymous');
        });
    });

    describe('getAdditionalPageInfo', () => {
        it('should return nothing for profile pages without additional info', () => {
            const path = ['community', 'richprofile', 'myaccount'];
            expect(bindingMethods.getAdditionalPageInfo(path)).toEqual('');
        });

        it('should return the correct additional info for user profile pages', () => {
            const path = ['community', 'richprofile', 'myaccount', 'orders'];
            expect(bindingMethods.getAdditionalPageInfo(path)).toEqual('recent-orders');
        });
    });

    describe('getPageProfileId', () => {
        beforeEach(() => {
            digitalData.page.category.pageType = analyticsConsts.PAGE_TYPES.COMMUNITY_PROFILE;
        });

        it('should return the userId of the current community profile page', () => {
            const href = 'users/notMyNickName';
            const user = { nickName: 'mike' };
            expect(bindingMethods.getPageProfileId(href, user)).toEqual('notMyNickName');
        });
    });

    describe('getPageEvents', () => {
        const globalEvents = [`${analyticsConsts.Event.EVENT_19}=0`, `${analyticsConsts.Event.EVENT_20}=0`, `${analyticsConsts.Event.EVENT_295}=1`];

        it('add events to current load by pageName and pageType', () => {
            digitalData.page.category.pageType = 'checkout';
            digitalData.page.attributes.previousPageData.prevSearchType = true;

            const events = [analyticsConsts.Event.SC_VIEW, analyticsConsts.Event.SC_CHECKOUT, ...globalEvents];

            expect(bindingMethods.getPageEvents(analyticsConsts.PAGE_NAMES.BASKET)).toEqual(events);
        });

        it('add events to current load, checking for isOnlyFewLeftFlag present', () => {
            spyOn(store, 'getState').and.returnValue({
                basket: {
                    items: [{ sku: { isOnlyFewLeft: true } }, { sku: { isOnlyFewLeft: false } }, { sku: { isOnlyFewLeft: false } }]
                },
                auth: { profileStatus: 0 }
            });
            spyOn(generalBindings, 'isDCBasket').and.returnValue(true);
            const events = [analyticsConsts.Event.SC_VIEW, analyticsConsts.Event.EVENT_46, ...globalEvents];

            expect(bindingMethods.getPageEvents(analyticsConsts.PAGE_NAMES.BASKET)).toEqual(events);
        });

        it('add Endeca event to page load if page name is Product Search Results', () => {
            Sephora.configurationSettings.isNLPSearchEnabled = false;
            Sephora.configurationSettings.enableConstructorABTest = false;

            const events = [analyticsConsts.Event.ENDECA_SEARCH, ...globalEvents];

            expect(bindingMethods.getPageEvents(analyticsConsts.PAGE_NAMES.PRODUCT_SEARCH_RESULTS)).toEqual(events);
        });

        it('add Endeca event to page load if page name is Product Search Results', () => {
            Sephora.configurationSettings.isNLPSearchEnabled = true;
            Sephora.configurationSettings.enableConstructorABTest = true;

            const events = [analyticsConsts.Event.NLP_SEARCH, ...globalEvents];

            expect(bindingMethods.getPageEvents(analyticsConsts.PAGE_NAMES.PRODUCT_SEARCH_RESULTS)).toEqual(events);
        });

        it('add event148 to page load if page name is ratings&reviews-write', () => {
            const events = [analyticsConsts.Event.ADD_REVIEW_RATE_AND_REVEW, ...globalEvents];

            expect(bindingMethods.getPageEvents(analyticsConsts.PAGE_NAMES.ADD_RATINGS_AND_REVIEWS)).toEqual(events);
        });
    });

    describe('setFilter', () => {
        it('add the sort-by string to the filters list', () => {
            digitalData.page.attributes.sephoraPageInfo.categoryFilters = ['brand=givenchy', 'formulation=gel'];
            const sortName = 'Top Rated';
            const filtersWithSortByString = ['brand=givenchy', 'formulation=gel', 'sortby=top rated'];
            bindingMethods.setFilter(false, null, sortName);
            expect(digitalData.page.attributes.sephoraPageInfo.categoryFilters).toEqual(filtersWithSortByString);
        });

        it('replace the sort-by string in the filters list', () => {
            digitalData.page.attributes.sephoraPageInfo.categoryFilters = ['brand=givenchy', 'formulation=gel', 'sortby=top rated'];
            const sortName = 'New';
            const filtersWithSortByString = ['brand=givenchy', 'formulation=gel', 'sortby=new'];
            bindingMethods.setFilter(false, null, sortName);
            expect(digitalData.page.attributes.sephoraPageInfo.categoryFilters).toEqual(filtersWithSortByString);
        });

        it('add the price range string to the filters list', () => {
            digitalData.page.attributes.sephoraPageInfo.categoryFilters = ['brand=givenchy', 'formulation=gel'];
            const pricesArray = ['10', '200'];
            const filtersWithPriceRangeString = ['brand=givenchy', 'formulation=gel', 'price range=10-200'];
            bindingMethods.setFilter(true, pricesArray, null);
            expect(digitalData.page.attributes.sephoraPageInfo.categoryFilters).toEqual(filtersWithPriceRangeString);
        });

        it('replace the price range string in the filters list', () => {
            digitalData.page.attributes.sephoraPageInfo.categoryFilters = ['brand=givenchy', 'formulation=gel', 'price range=10-200'];
            const pricesArray = ['100', '150'];
            const filtersWithPriceRangeString = ['brand=givenchy', 'formulation=gel', 'price range=100-150'];
            bindingMethods.setFilter(true, pricesArray, null);
            expect(digitalData.page.attributes.sephoraPageInfo.categoryFilters).toEqual(filtersWithPriceRangeString);
        });
    });

    describe('setUserPropsWithCurrentData', () => {
        let fireUserRelatedEventsStub;

        beforeEach(() => {
            spyOn(store, 'getState').and.returnValue({
                user: {
                    firstName: '777',
                    userSubscriptions: [
                        {
                            isTrialEligible: false,
                            status: 'INACTIVE',
                            type: 'SDU'
                        }
                    ]
                },
                order: {
                    orderDetails: {
                        header: {
                            profile: { firstName: '888' }
                        }
                    }
                },
                auth: {
                    profileStatus: 4
                }
            });
            fireUserRelatedEventsStub = spyOn(bindingMethods, 'fireUserRelatedEvents');
        });

        it('should call fireUserRelatedEventsStub', () => {
            bindingMethods.setUserPropsWithCurrentData();
            expect(fireUserRelatedEventsStub).toHaveBeenCalled();
        });

        it('should call getBiStatus with current user', () => {
            const getBiStatusStub = spyOn(bindingMethods, 'getBiStatus');
            bindingMethods.setUserPropsWithCurrentData();
            expect(getBiStatusStub).toHaveBeenCalledWith({
                firstName: '777',
                userSubscriptions: [
                    {
                        isTrialEligible: false,
                        status: 'INACTIVE',
                        type: 'SDU'
                    }
                ]
            });
        });

        it('should call getFBbiStatus with current user', () => {
            const getFBbiStatusStub = spyOn(bindingMethods, 'getFBbiStatus');
            bindingMethods.setUserPropsWithCurrentData();
            expect(getFBbiStatusStub).toHaveBeenCalledWith(
                {
                    firstName: '777',
                    userSubscriptions: [
                        {
                            isTrialEligible: false,
                            status: 'INACTIVE',
                            type: 'SDU'
                        }
                    ]
                },
                { profileStatus: 4 }
            );
        });

        it('should call getSignInStatus with current user', () => {
            const getSignInStatusStub = spyOn(bindingMethods, 'getSignInStatus');
            bindingMethods.setUserPropsWithCurrentData();
            expect(getSignInStatusStub).toHaveBeenCalledWith({ profileStatus: 4 });
        });

        it('should call getBiPoints with current user', () => {
            const getBiPointsStub = spyOn(bindingMethods, 'getBiPoints');
            bindingMethods.setUserPropsWithCurrentData();
            expect(getBiPointsStub).toHaveBeenCalledWith({
                firstName: '777',
                userSubscriptions: [
                    {
                        isTrialEligible: false,
                        status: 'INACTIVE',
                        type: 'SDU'
                    }
                ]
            });
        });

        it('should call getBiAccountId with current user', () => {
            const getBiAccountIdStub = spyOn(biUtils, 'getBiAccountId');
            bindingMethods.setUserPropsWithCurrentData();
            expect(getBiAccountIdStub).toHaveBeenCalledWith({
                firstName: '777',
                userSubscriptions: [
                    {
                        isTrialEligible: false,
                        status: 'INACTIVE',
                        type: 'SDU'
                    }
                ]
            });
        });

        it('should call getProfileStatus with current user', () => {
            const getProfileStatusStub = spyOn(bindingMethods, 'getProfileStatus');
            bindingMethods.setUserPropsWithCurrentData();
            expect(getProfileStatusStub).toHaveBeenCalledWith({ profileStatus: 4 });
        });

        it('should call getWebAnalyticsCipher with current user', () => {
            const getWebAnalyticsCipherStub = spyOn(bindingMethods, 'getWebAnalyticsCipher');
            bindingMethods.setUserPropsWithCurrentData();
            expect(getWebAnalyticsCipherStub).toHaveBeenCalledWith({
                firstName: '777',
                userSubscriptions: [
                    {
                        isTrialEligible: false,
                        status: 'INACTIVE',
                        type: 'SDU'
                    }
                ]
            });
        });

        it('should call getWebAnalyticsHash with current user', () => {
            const getWebAnalyticsHashStub = spyOn(bindingMethods, 'getWebAnalyticsHash');
            bindingMethods.setUserPropsWithCurrentData();
            expect(getWebAnalyticsHashStub).toHaveBeenCalledWith({
                firstName: '777',
                userSubscriptions: [
                    {
                        isTrialEligible: false,
                        status: 'INACTIVE',
                        type: 'SDU'
                    }
                ]
            });
        });

        it('should call getATGID with current user and current order', () => {
            const getATGIDStub = spyOn(bindingMethods, 'getATGID');
            bindingMethods.setUserPropsWithCurrentData();
            expect(getATGIDStub).toHaveBeenCalledWith(
                {
                    firstName: '777',
                    userSubscriptions: [
                        {
                            isTrialEligible: false,
                            status: 'INACTIVE',
                            type: 'SDU'
                        }
                    ]
                },
                { firstName: '888' }
            );
        });

        it('should call getUserCCApprovalStatus', () => {
            const getUserCCApprovalStatusStub = spyOn(bindingMethods, 'getUserCCApprovalStatus');
            bindingMethods.setUserPropsWithCurrentData();
            expect(getUserCCApprovalStatusStub).toHaveBeenCalled();
        });
    });

    describe('getArrayOfShortFilteredItems', () => {
        let itemTemplate;
        let skuTypes;

        beforeEach(() => {
            skuTypes = require('utils/Sku').default.skuTypes;

            itemTemplate = {
                sku: {
                    skuId: '0001',
                    type: 'someType',
                    listPrice: '$1.00'
                },
                qty: '1'
            };
        });

        it('should return an empty array in case undefined value is passed', () => {
            const input = undefined;
            const output = bindingMethods.getArrayOfShortFilteredItems(input);

            expect(Array.isArray(output)).toEqual(true);
            expect(output.length).toEqual(0);
        });

        it('should return an empty array in case an empty item list is passed', () => {
            const input = [];
            const output = bindingMethods.getArrayOfShortFilteredItems(input);

            expect(Array.isArray(output)).toEqual(true);
            expect(output.length).toEqual(0);
        });

        it('should transform skuId to id property according to defined rule', () => {
            const input = [itemTemplate];
            const output = bindingMethods.getArrayOfShortFilteredItems(input);

            expect(output[0].id).toEqual(input[0].sku.skuId);
        });

        it('should transform qty to quantity property according to defined rule', () => {
            const input = [itemTemplate];
            const output = bindingMethods.getArrayOfShortFilteredItems(input);

            expect(output[0].quantity).toEqual(input[0].qty);
        });

        it('should transform listPrice to price property according to defined rule', () => {
            digitalData.transaction.attributes.isoCurrency = 'USD';
            const input = [itemTemplate];
            const output = bindingMethods.getArrayOfShortFilteredItems(input);

            expect(output[0].price).toEqual(input[0].sku.listPrice.substring(1));
        });

        it('should filter out gwp\'s', () => {
            itemTemplate.sku.type = skuTypes.GWP;
            const input = [itemTemplate];
            const output = bindingMethods.getArrayOfShortFilteredItems(input);

            expect(output.length).toEqual(0);
        });

        it('should filter out subscriptions', () => {
            itemTemplate.sku.type = skuTypes.SUBSCRIPTION;
            const input = [itemTemplate];
            const output = bindingMethods.getArrayOfShortFilteredItems(input);

            expect(output.length).toEqual(0);
        });

        it('should filter out plays', () => {
            itemTemplate.sku.type = skuTypes.PLAYBOX;
            const input = [itemTemplate];
            const output = bindingMethods.getArrayOfShortFilteredItems(input);

            expect(output.length).toEqual(0);
        });

        it('should filter out rewards for rouge', () => {
            itemTemplate.sku.type = skuTypes.ROUGE_REWARD_CARD;
            const input = [itemTemplate];
            const output = bindingMethods.getArrayOfShortFilteredItems(input);

            expect(output.length).toEqual(0);
        });

        it('should not assign price property if listPrice is not set', () => {
            itemTemplate.sku.listPrice = undefined;
            const input = [itemTemplate];
            const output = bindingMethods.getArrayOfShortFilteredItems(input);

            expect(typeof output[0].price).toEqual('undefined');
        });

        it('should not pass an item of sku is not defined', () => {
            itemTemplate.sku = undefined;
            const input = [itemTemplate];
            const output = bindingMethods.getArrayOfShortFilteredItems(input);

            expect(output.length).toEqual(0);
        });
    });

    describe('getUserCCApprovalStatus', () => {
        const userCCApprovalStatus = 'credit card status:';
        const ccApprovalScenarios = [
            {
                output: analyticsConsts.CC_APPROVAL_STATUS.CARD_HOLDER,
                ccApprovalStatus: APPROVAL_STATUS.APPROVED,
                isUserPreApproved: true
            },
            {
                output: analyticsConsts.CC_APPROVAL_STATUS.DECLINED,
                ccApprovalStatus: APPROVAL_STATUS.DECLINED,
                isUserPreApproved: true
            },
            {
                output: analyticsConsts.CC_APPROVAL_STATUS.PRE_APPROVED,
                ccApprovalStatus: APPROVAL_STATUS.NEW_APPLICATION,
                isUserPreApproved: true
            },
            {
                output: analyticsConsts.CC_APPROVAL_STATUS.INSTANT_CREDIT,
                ccApprovalStatus: APPROVAL_STATUS.NEW_APPLICATION,
                isUserPreApproved: false
            },
            {
                output: analyticsConsts.CC_APPROVAL_STATUS.IN_PROGRESS_APP,
                ccApprovalStatus: APPROVAL_STATUS.IN_PROGRESS,
                isUserPreApproved: true
            },
            {
                output: analyticsConsts.CC_APPROVAL_STATUS.OTHER,
                ccApprovalStatus: APPROVAL_STATUS.OTHER,
                isUserPreApproved: undefined
            }
        ];

        it('should validate all the different scenarios for user CC approval status', () => {
            const isUserPreApproved = spyOn(userUtils, 'isPreApprovedForCreditCard');
            const approvalStatus = spyOn(userUtils, 'getSephoraCreditCardInfo');

            ccApprovalScenarios.forEach(scenario => {
                isUserPreApproved.and.returnValue(scenario.isUserPreApproved);
                approvalStatus.and.returnValue({ ccApprovalStatus: scenario.ccApprovalStatus });
                const output = bindingMethods.getUserCCApprovalStatus();
                expect(output).toEqual(userCCApprovalStatus + scenario.output);
            });
        });
    });
});
