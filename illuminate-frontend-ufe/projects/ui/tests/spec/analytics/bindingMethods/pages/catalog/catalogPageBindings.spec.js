describe('Catalog Page Binding Methods', function () {
    const anaConsts = require('analytics/constants').default;
    const bindingMethods = require('analytics/bindingMethods/pages/catalog/catalogPageBindings').default;
    const catalogConsts = require('constants/Search');
    let categoriesMock;
    let additionalCategory;
    let catalogId;

    beforeEach(() => {
        Sephora.Util.InflatorComps.services.CatalogService = { catalogEngine: 'NLP' };
        categoriesMock = [
            {
                categoryId: 'cat140006',
                displayName: 'Makeup',
                hasDropdownMenu: true,
                isSelected: true,
                level: 0,
                subCategories: [
                    {
                        categoryId: 'cat130058',
                        displayName: 'Face',
                        hasDropdownMenu: true,
                        level: 1,
                        subCategories: [
                            {
                                categoryId: 'cat60004',
                                displayName: 'Foundation',
                                hasDropdownMenu: true,
                                level: 2,
                                targetUrl: '/shop/foundation-makeup'
                            }
                        ],
                        targetUrl: '/shop/face-makeup',
                        clickable: true
                    }
                ],
                targetUrl: '/shop/makeup-cosmetics'
            }
        ];
        additionalCategory = {
            displayName: 'Skincare',
            isSelected: true,
            level: 0,
            node: 1050055,
            recordCount: '64',
            subCategories: [
                {
                    displayName: 'Value & Gift Sets',
                    level: 1,
                    node: 1050060,
                    recordCount: '8',
                    clickable: true
                }
            ]
        };
    });

    describe('getCurrentCategoryLevel()', () => {
        it('should return the correct category level for root', () => {
            expect(bindingMethods.getCurrentCategoryLevel(categoriesMock[0], false)).toBe(anaConsts.PAGE_TYPES.ROOTCATEGORY);
        });

        it('should return the correct category level for toplevel', () => {
            categoriesMock[0].isSelected = false;
            categoriesMock[0].subCategories[0].isSelected = true;
            expect(bindingMethods.getCurrentCategoryLevel(categoriesMock[0], false)).toBe(anaConsts.PAGE_TYPES.TOPCATEGORY);
        });

        it('should return the correct category level for nthlevel', () => {
            categoriesMock[0].isSelected = false;
            categoriesMock[0].subCategories[0].subCategories[0].isSelected = true;
            expect(bindingMethods.getCurrentCategoryLevel(categoriesMock[0], false)).toBe(anaConsts.PAGE_TYPES.NTHCATEGORY);
        });

        it('should return the correct category level for nthlevel with catalogId', () => {
            catalogId = 'cat60004';
            expect(
                bindingMethods.getCurrentCategoryLevel(categoriesMock[0], false, {
                    parameter: 'categoryId',
                    value: catalogId
                })
            ).toBe(anaConsts.PAGE_TYPES.NTHCATEGORY);
        });

        it('should return falsy if there is no category level match', () => {
            catalogId = null;
            expect(
                bindingMethods.getCurrentCategoryLevel(categoriesMock[0], false, {
                    parameter: 'categoryId',
                    value: catalogId
                })
            ).toBeFalsy();
        });
    });

    describe('getSearchPageName()', () => {
        let searchTermStub;
        const urlUtils = require('utils/Url').default;
        const anaUtils = require('analytics/utils').default;
        let encodedData;
        let getPreviousPageDataStub;

        beforeEach(() => {
            searchTermStub = spyOn(urlUtils, 'getParamValueAsSingleString');
            encodedData = { pageType: 'search', searchTerm: 'red', prevSearchType: 'previous' };
            getPreviousPageDataStub = spyOn(anaUtils, 'getPreviousPageData');
        });

        it('should return the correct pageName for root categories', () => {
            const expectedValue = `results-${anaConsts.PAGE_TYPES.SEARCH_CATEGORY}`;
            getPreviousPageDataStub.and.returnValue({ pageType: 'search' });
            expect(bindingMethods.getSearchPageName(categoriesMock)).toBe(expectedValue);
        });

        it('should return the correct pageName for toplevel categories', () => {
            const expectedValue = `results-${anaConsts.PAGE_TYPES.SEARCH_TOP}`;
            getPreviousPageDataStub.and.returnValue({ pageType: 'search' });
            categoriesMock[0].isSelected = false;
            categoriesMock[0].subCategories[0].isSelected = true;
            expect(bindingMethods.getSearchPageName(categoriesMock)).toBe(expectedValue);
        });

        it('should return the correct pageName for nthlevel categories', () => {
            const expectedValue = `results-${anaConsts.PAGE_TYPES.SEARCH_NTH}`;
            getPreviousPageDataStub.and.returnValue({ pageType: 'search' });
            categoriesMock[0].isSelected = false;
            categoriesMock[0].subCategories[0].subCategories[0].isSelected = true;
            expect(bindingMethods.getSearchPageName(categoriesMock)).toBe(expectedValue);
        });

        it('should return the correct pageName for "sale" search results', () => {
            searchTermStub.and.returnValue('sale');
            getPreviousPageDataStub.and.returnValue(encodedData);
            expect(bindingMethods.getSearchPageName(categoriesMock)).toBe('results-sale');
        });

        it('should return the correct pageName for any other search term', () => {
            searchTermStub.and.returnValue('red');
            getPreviousPageDataStub.and.returnValue(encodedData);
            expect(bindingMethods.getSearchPageName(categoriesMock)).toBe('results-products');
        });
    });

    describe('isSearchType()', () => {
        const anaUtils = require('analytics/utils').default;
        let prevPageDataStub;

        beforeEach(() => {
            prevPageDataStub = spyOn(anaUtils, 'getPreviousPageData');
        });

        it('should return true when the results page is coming from a search term', () => {
            const prevPageData = {
                pageType: 'search',
                searchTerm: 'red',
                prevSearchType: 'previous'
            };
            prevPageDataStub.and.returnValue(prevPageData);
            expect(bindingMethods.isTypeSearch()).toBeTruthy();
        });

        it('should return true when the results page is not coming from a search', () => {
            const prevPageData = { pageType: 'search' };
            prevPageDataStub.and.returnValue(prevPageData);
            expect(bindingMethods.isTypeSearch()).toBeFalsy();
        });
    });

    describe('getSearchPageAttributes()', () => {
        const urlUtils = require('utils/Url').default;
        let searchTerm;
        let totalProducts;

        beforeEach(() => {
            totalProducts = 10;
            searchTerm = 'red';
            spyOn(urlUtils, 'getParamValueAsSingleString').and.returnValue(searchTerm);
        });

        it('should return the correct search term', () => {
            const result = bindingMethods.getSearchPageAttributes(totalProducts).searchTerm;
            expect(result).toBe(searchTerm);
        });

        it('should return the correct number of results', () => {
            const result = bindingMethods.getSearchPageAttributes(totalProducts).numberOfResults;
            expect(result).toBe(totalProducts);
        });
    });

    describe('buildCatalogProductStrings()', () => {
        let productsMock;
        let resultFromMock;

        beforeEach(() => {
            productsMock = [
                {
                    brandName: 'Atelier Cologne',
                    currentSku: { skuId: '2100188' }
                },
                {
                    brandName: 'Yves Saint Laurent',
                    currentSku: { skuId: '2100189' }
                }
            ];

            resultFromMock = bindingMethods.buildCatalogProductStrings(productsMock);
        });

        it('should return an array', () => {
            expect(resultFromMock).toEqual(jasmine.any(Array));
        });

        it('should return the skuId from the first product in array', () => {
            expect(resultFromMock).toContain(productsMock[0].currentSku.skuId);
        });

        it('should return the skuId from the second product in array', () => {
            expect(resultFromMock).toContain(productsMock[1].currentSku.skuId);
        });

        it('should return an empty array if input is empty array', () => {
            const expectedResult = [];
            const result = bindingMethods.buildCatalogProductStrings([]);
            expect(result).toEqual(expectedResult);
        });

        it('should return an empty array if input is undefined', () => {
            const expectedResult = [];
            const result = bindingMethods.buildCatalogProductStrings();
            expect(result).toEqual(expectedResult);
        });

        it('should return less than or equal to 20 items', () => {
            expect(resultFromMock.length).toBeLessThanOrEqual(20);
        });

        it('should return an empty array if missing currentSku property', () => {
            const input = [{ brandName: 'Atelier Cologne' }];
            const expectedResult = [];
            const result = bindingMethods.buildCatalogProductStrings(input);
            expect(result).toEqual(expectedResult);
        });

        it('should return an empty array if missing skuId property', () => {
            const input = [
                {
                    brandName: 'Atelier Cologne',
                    currentSku: {}
                }
            ];
            const expectedResult = [];
            const result = bindingMethods.buildCatalogProductStrings(input);
            expect(result).toEqual(expectedResult);
        });
    });

    describe('buildNavEventData()', () => {
        let dataEvent;
        let previousPageName;

        beforeEach(() => {
            previousPageName = 'brand-nthlevel:sephora collection-foundation:makeup';
            digitalData.page.attributes.sephoraPageInfo.pageName = previousPageName;
        });

        describe('Categories', () => {
            let template;

            beforeEach(() => {
                template = catalogConsts.TEMPLATES.NTH_CATEGORY;
            });

            describe('categorylevel', () => {
                beforeEach(() => {
                    const selectedOpt = 'Makeup';
                    const currentLevel = 0;
                    dataEvent = bindingMethods.buildNavEventData(categoriesMock, template, selectedOpt, currentLevel);
                });

                it('should set the correct pageType', () => {
                    const expectedResult = 'category';
                    expect(dataEvent.data.pageType).toBe(expectedResult);
                });

                it('should set the correct pageName', () => {
                    const expectedResult = 'category:makeup:makeup:*';
                    expect(dataEvent.data.pageName).toBe(expectedResult);
                });

                it('should set the correct world', () => {
                    const expectedResult = 'Makeup';
                    expect(dataEvent.data.world).toBe(expectedResult);
                });

                it('should set the correct pageDetail', () => {
                    const expectedResult = 'makeup';
                    expect(dataEvent.data.pageDetail).toBe(expectedResult);
                });

                it('should set the correct navigationInfo when there is a single category', () => {
                    const expectedResult = 'left nav:makeup:makeup:makeup:makeup';
                    expect(dataEvent.data.navigationInfo).toBe(expectedResult);
                });

                it('should set the correct navigationInfo when there are multiple categories', () => {
                    const selectedOpt = 'Skincare';
                    const currentLevel = 0;
                    categoriesMock.push(additionalCategory);

                    dataEvent = bindingMethods.buildNavEventData(categoriesMock, template, selectedOpt, currentLevel);
                    const expectedResult = 'left nav:skincare:skincare:skincare:skincare';

                    expect(dataEvent.data.navigationInfo).toBe(expectedResult);
                });

                it('should set the correct PreviousPageName ', () => {
                    expect(dataEvent.data.previousPageName).toBe(previousPageName);
                });
            });

            describe('toplevel', () => {
                beforeEach(() => {
                    const selectedOpt = 'Face';
                    const currentLevel = 1;
                    dataEvent = bindingMethods.buildNavEventData(categoriesMock, template, selectedOpt, currentLevel);
                });

                it('should set the correct pageType', () => {
                    const expectedResult = 'toplevel';
                    expect(dataEvent.data.pageType).toBe(expectedResult);
                });

                it('should set the correct pageName', () => {
                    const expectedResult = 'toplevel:face:makeup:*';
                    expect(dataEvent.data.pageName).toBe(expectedResult);
                });

                it('should set the correct world', () => {
                    const expectedResult = 'Makeup';
                    expect(dataEvent.data.world).toBe(expectedResult);
                });

                it('should set the correct pageDetail', () => {
                    const expectedResult = 'face';
                    expect(dataEvent.data.pageDetail).toBe(expectedResult);
                });

                it('should set the correct navigationInfo', () => {
                    const expectedResult = 'left nav:makeup:face:face:face';
                    expect(dataEvent.data.navigationInfo).toBe(expectedResult);
                });
            });

            describe('nthlevel', () => {
                beforeEach(() => {
                    const selectedOpt = 'Foundation';
                    const currentLevel = 2;
                    dataEvent = bindingMethods.buildNavEventData(categoriesMock, template, selectedOpt, currentLevel);
                });

                it('should set the correct pageType', () => {
                    const expectedResult = 'nthlevel';
                    expect(dataEvent.data.pageType).toBe(expectedResult);
                });

                it('should set the correct pageName', () => {
                    const expectedResult = 'nthlevel:foundation:makeup:*';
                    expect(dataEvent.data.pageName).toBe(expectedResult);
                });

                it('should set the correct world', () => {
                    const expectedResult = 'Makeup';
                    expect(dataEvent.data.world).toBe(expectedResult);
                });

                it('should set the correct pageDetail', () => {
                    const expectedResult = 'foundation';
                    expect(dataEvent.data.pageDetail).toBe(expectedResult);
                });

                it('should set the correct navigationInfo', () => {
                    const expectedResult = 'left nav:makeup:face:foundation:foundation';
                    expect(dataEvent.data.navigationInfo).toBe(expectedResult);
                });
            });
        });

        describe('Brands', () => {
            let template;

            beforeEach(() => {
                template = catalogConsts.TEMPLATES.NTH_BRAND;
                digitalData.page.attributes.brand = 'SEPHORA COLLECTION';
            });

            describe('See All', () => {
                beforeEach(() => {
                    const selectedOpt = 'SEPHORA COLLECTION';
                    const currentLevel = 0;
                    dataEvent = bindingMethods.buildNavEventData(categoriesMock, template, selectedOpt, currentLevel);
                });

                it('should set the correct pageType', () => {
                    const expectedResult = 'brand';
                    expect(dataEvent.data.pageType).toBe(expectedResult);
                });

                it('should set the correct pageName', () => {
                    const expectedResult = 'brand:sephora collection:n/a:*';
                    expect(dataEvent.data.pageName).toBe(expectedResult);
                });

                it('should set the correct world', () => {
                    const expectedResult = 'n/a';
                    expect(dataEvent.data.world).toBe(expectedResult);
                });

                it('should set the correct pageDetail', () => {
                    const expectedResult = 'sephora collection';
                    expect(dataEvent.data.pageDetail).toBe(expectedResult);
                });

                it('should set the correct navigationInfo', () => {
                    const expectedResult = 'left nav:brands:sephora collection:' + 'sephora collection:sephora collection:sephora collection';
                    expect(dataEvent.data.navigationInfo).toBe(expectedResult);
                });
            });

            describe('categorylevel', () => {
                beforeEach(() => {
                    const selectedOpt = 'makeup';
                    const currentLevel = 0;
                    dataEvent = bindingMethods.buildNavEventData(categoriesMock, template, selectedOpt, currentLevel);
                });

                it('should set the correct pageType', () => {
                    const expectedResult = 'brand-category';
                    expect(dataEvent.data.pageType).toBe(expectedResult);
                });

                it('should set the correct pageName', () => {
                    const expectedResult = 'brand-category:sephora collection-makeup:makeup:*';
                    expect(dataEvent.data.pageName).toBe(expectedResult);
                });

                it('should set the correct world', () => {
                    const expectedResult = 'Makeup';
                    expect(dataEvent.data.world).toBe(expectedResult);
                });

                it('should set the correct pageDetail', () => {
                    const expectedResult = 'sephora collection-makeup';
                    expect(dataEvent.data.pageDetail).toBe(expectedResult);
                });

                it('should set the correct navigationInfo', () => {
                    const expectedResult = 'left nav:brands:sephora collection:' + 'makeup:makeup:makeup';
                    expect(dataEvent.data.navigationInfo).toBe(expectedResult);
                });
            });

            describe('toplevel', () => {
                beforeEach(() => {
                    const selectedOpt = 'face';
                    const currentLevel = 1;
                    dataEvent = bindingMethods.buildNavEventData(categoriesMock, template, selectedOpt, currentLevel);
                });

                it('should set the correct pageType', () => {
                    const expectedResult = 'brand-toplevel';
                    expect(dataEvent.data.pageType).toBe(expectedResult);
                });

                it('should set the correct pageName', () => {
                    const expectedResult = 'brand-toplevel:sephora collection-face:makeup:*';
                    expect(dataEvent.data.pageName).toBe(expectedResult);
                });

                it('should set the correct world', () => {
                    const expectedResult = 'Makeup';
                    expect(dataEvent.data.world).toBe(expectedResult);
                });

                it('should set the correct pageDetail', () => {
                    const expectedResult = 'sephora collection-face';
                    expect(dataEvent.data.pageDetail).toBe(expectedResult);
                });

                it('should set the correct navigationInfo', () => {
                    const expectedResult = 'left nav:brands:sephora collection:' + 'makeup:face:face';
                    expect(dataEvent.data.navigationInfo).toBe(expectedResult);
                });
            });

            describe('nthlevel', () => {
                beforeEach(() => {
                    const selectedOpt = 'foundation';
                    const currentLevel = 2;
                    dataEvent = bindingMethods.buildNavEventData(categoriesMock, template, selectedOpt, currentLevel);
                });

                it('should set the correct pageType', () => {
                    const expectedResult = 'brand-nthlevel';
                    expect(dataEvent.data.pageType).toBe(expectedResult);
                });

                it('should set the correct pageName', () => {
                    const expectedResult = 'brand-nthlevel:sephora collection-foundation:makeup:*';
                    expect(dataEvent.data.pageName).toBe(expectedResult);
                });

                it('should set the correct world', () => {
                    const expectedResult = 'Makeup';
                    expect(dataEvent.data.world).toBe(expectedResult);
                });

                it('should set the correct pageDetail', () => {
                    const expectedResult = 'sephora collection-foundation';
                    expect(dataEvent.data.pageDetail).toBe(expectedResult);
                });

                it('should set the correct navigationInfo', () => {
                    const expectedResult = 'left nav:brands:sephora collection:' + 'makeup:face:foundation';
                    expect(dataEvent.data.navigationInfo).toBe(expectedResult);
                });
            });
        });

        describe('Search results', () => {
            let template;
            let categoryRecordCount;
            let toplevelRecordCount;
            let nthlevelRecordCount;

            beforeEach(() => {
                categoryRecordCount = '10';
                toplevelRecordCount = '15';
                nthlevelRecordCount = '20';
                template = catalogConsts.TEMPLATES.SEARCH;
                categoriesMock[0].recordCount = categoryRecordCount;
                categoriesMock[0].subCategories[0].recordCount = toplevelRecordCount;
                categoriesMock[0].subCategories[0].subCategories[0].recordCount = nthlevelRecordCount;
            });

            describe('categorylevel', () => {
                beforeEach(() => {
                    const selectedOpt = 'Makeup';
                    const currentLevel = 0;
                    dataEvent = bindingMethods.buildNavEventData(categoriesMock, template, selectedOpt, currentLevel);
                });

                it('should set the correct pageType', () => {
                    const expectedResult = 'search';
                    expect(dataEvent.data.pageType).toBe(expectedResult);
                });

                it('should set the correct pageName', () => {
                    const expectedResult = 'search:results-category:n/a:*';
                    expect(dataEvent.data.pageName).toBe(expectedResult);
                });

                it('should set the correct world', () => {
                    const expectedResult = 'n/a';
                    expect(dataEvent.data.world).toBe(expectedResult);
                });

                it('should set the correct pageDetail', () => {
                    const expectedResult = 'results-category';
                    expect(dataEvent.data.pageDetail).toBe(expectedResult);
                });

                it('should set the correct navigationInfo', () => {
                    const expectedResult = 'left nav:makeup:makeup:makeup:makeup';
                    expect(dataEvent.data.navigationInfo).toBe(expectedResult);
                });

                it('should set search attributes with the correct number of results', () => {
                    expect(digitalData.page.attributes.search.numberOfResults).toBe(categoryRecordCount);
                });
            });

            describe('toplevel', () => {
                beforeEach(() => {
                    const selectedOpt = 'Face';
                    const currentLevel = 1;
                    dataEvent = bindingMethods.buildNavEventData(categoriesMock, template, selectedOpt, currentLevel);
                });

                it('should set the correct pageName', () => {
                    const expectedResult = 'search:results-top:n/a:*';
                    expect(dataEvent.data.pageName).toBe(expectedResult);
                });

                it('should set the correct world', () => {
                    const expectedResult = 'n/a';
                    expect(dataEvent.data.world).toBe(expectedResult);
                });

                it('should set the correct pageDetail', () => {
                    const expectedResult = 'results-top';
                    expect(dataEvent.data.pageDetail).toBe(expectedResult);
                });

                it('should set the correct navigationInfo', () => {
                    const expectedResult = 'left nav:makeup:face:face:face';
                    expect(dataEvent.data.navigationInfo).toBe(expectedResult);
                });

                it('should set search attributes with the correct number of results', () => {
                    expect(digitalData.page.attributes.search.numberOfResults).toBe(toplevelRecordCount);
                });
            });

            describe('nthlevel', () => {
                beforeEach(() => {
                    const selectedOpt = 'Foundation';
                    const currentLevel = 2;
                    dataEvent = bindingMethods.buildNavEventData(categoriesMock, template, selectedOpt, currentLevel);
                });

                it('should set the correct pageName', () => {
                    const expectedResult = 'search:results-nth:n/a:*';
                    expect(dataEvent.data.pageName).toBe(expectedResult);
                });

                it('should set the correct world', () => {
                    const expectedResult = 'n/a';
                    expect(dataEvent.data.world).toBe(expectedResult);
                });

                it('should set the correct pageDetail', () => {
                    const expectedResult = 'results-nth';
                    expect(dataEvent.data.pageDetail).toBe(expectedResult);
                });

                it('should set the correct navigationInfo', () => {
                    const expectedResult = 'left nav:makeup:face:foundation:foundation';
                    expect(dataEvent.data.navigationInfo).toBe(expectedResult);
                });

                it('should set search attributes with the correct number of results', () => {
                    expect(digitalData.page.attributes.search.numberOfResults).toBe(nthlevelRecordCount);
                });
            });
        });
    });
});
