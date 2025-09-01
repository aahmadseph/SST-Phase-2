/* eslint-disable max-len */
describe('catalogUtils', () => {
    let catalogUtils;
    let categoriesMock;
    let localeUtils;

    beforeEach(() => {
        catalogUtils = require('utils/Search').default;
        localeUtils = require('utils/LanguageLocale').default;
        categoriesMock = [
            {
                targetUrl: '/brand/too-faced/makeup-cosmetics',
                node: 1050000,
                displayName: 'Makeup',
                recordCount: 'N',
                level: 0,
                subCategories: [
                    {
                        targetUrl: '/brand/too-faced/makeup-kits-makeup-sets',
                        node: 1050048,
                        displayName: 'Value & Gift Sets',
                        recordCount: 'N',
                        level: 1
                    },
                    {
                        targetUrl: '/brand/too-faced/mini-makeup',
                        node: 14267446,
                        displayName: 'Mini Size',
                        recordCount: 'N',
                        level: 1
                    }
                ]
            },
            {
                targetUrl: '/brand/too-faced/eye-makeup',
                node: 1060000,
                displayName: 'Eye Makeup',
                recordCount: 'N',
                level: 0,
                subCategories: [
                    {
                        targetUrl: '/brand/too-faced/makeup-kits-eye-sets',
                        node: 1060056,
                        displayName: 'Value & Gift Sets',
                        recordCount: 'N',
                        level: 1
                    },
                    {
                        targetUrl: '/brand/too-faced/mini-makeup',
                        node: 14267985,
                        displayName: 'Mini Size',
                        recordCount: 'N',
                        level: 1
                    }
                ]
            }
        ];
    });

    describe('getting brand info from category info with getCatalogInfoFromCategories', () => {
        let categories;
        let options;
        beforeEach(() => {
            categories = categoriesMock;
        });
        it('should return correct level 0 category if isSelected is true and isSelected is passed in as the search paramer', () => {
            categories[0].isSelected = true;
            options = {
                parameter: 'isSelected',
                value: true
            };
            const result = catalogUtils.getCatalogInfoFromCategories(categories, options);
            expect(result).toEqual(categories[0]);
        });
        it('should return correct level 1 category if isSelected is true and isSelected is passed in as the search paramer', () => {
            categories[1].subCategories[0].isSelected = true;
            options = {
                parameter: 'isSelected',
                value: true
            };
            const result = catalogUtils.getCatalogInfoFromCategories(categories, options);
            expect(result).toEqual(categories[1].subCategories[0]);
        });
        it('should return correct level 0 category if node is passed in as the search paramer', () => {
            options = {
                parameter: 'node',
                value: 1060000
            };
            const result = catalogUtils.getCatalogInfoFromCategories(categories, options);
            expect(result).toEqual(categories[1]);
        });
        it('should return correct level 1 category if node is passed in as the search paramer', () => {
            options = {
                parameter: 'node',
                value: 14267446
            };
            const result = catalogUtils.getCatalogInfoFromCategories(categories, options);
            expect(result).toEqual(categories[0].subCategories[1]);
        });
    });

    describe('getting property name from category ', () => {
        let props;

        beforeEach(() => {
            props = {
                items: [
                    {
                        categoryId: 'cat140006',
                        displayName: 'Makeup',
                        hasDropdownMenu: true,
                        level: 0,
                        subCategories: [
                            {
                                categoryId: 'cat130058',
                                displayName: 'Face',
                                hasDropdownMenu: true,
                                isSelected: true,
                                level: 1,
                                subCategories: [
                                    {
                                        categoryId: 'cat60004',
                                        displayName: 'Foundation',
                                        hasDropdownMenu: true,
                                        level: 2,
                                        targetUrl: '/shop/foundation-makeup'
                                    },
                                    {
                                        categoryId: 'cat960033',
                                        displayName: 'BB & CC Cream',
                                        hasDropdownMenu: true,
                                        level: 2,
                                        targetUrl: '/shop/bb-cc-cream-face-makeup'
                                    },
                                    {
                                        categoryId: 'cat60010',
                                        displayName: 'Tinted Moisturizer',
                                        hasDropdownMenu: true,
                                        level: 2,
                                        targetUrl: '/shop/tinted-moisturizer'
                                    },
                                    {
                                        categoryId: 'cat60014',
                                        displayName: 'Concealer',
                                        hasDropdownMenu: true,
                                        level: 2,
                                        targetUrl: '/shop/concealer'
                                    },
                                    {
                                        categoryId: 'cat60012',
                                        displayName: 'Face Primer',
                                        hasDropdownMenu: true,
                                        level: 2,
                                        targetUrl: '/shop/makeup-primer-face-primer'
                                    },
                                    {
                                        categoryId: 'cat60008',
                                        displayName: 'Setting Spray & Powder',
                                        hasDropdownMenu: true,
                                        level: 2,
                                        targetUrl: '/shop/setting-powder-face-powder'
                                    },
                                    {
                                        categoryId: 'cat1540033',
                                        displayName: 'Color Correct',
                                        hasDropdownMenu: true,
                                        level: 2,
                                        targetUrl: '/shop/color-correcting'
                                    },
                                    {
                                        categoryId: 'cat1300049',
                                        displayName: 'Contour',
                                        hasDropdownMenu: true,
                                        level: 2,
                                        targetUrl: '/shop/contour-palette-brush'
                                    },
                                    {
                                        categoryId: 'cat60020',
                                        displayName: 'Highlighter',
                                        hasDropdownMenu: true,
                                        level: 2,
                                        targetUrl: '/shop/luminizer-luminous-makeup'
                                    },
                                    {
                                        categoryId: 'cat60006',
                                        displayName: 'Face Sets',
                                        hasDropdownMenu: true,
                                        level: 2,
                                        targetUrl: '/shop/complexion-sets'
                                    }
                                ],
                                targetUrl: '/shop/face-makeup',
                                clickable: true
                            }
                        ],
                        targetUrl: '/shop/makeup-cosmetics'
                    }
                ],
                catalogKeyName: 'catalogId',
                currentItemId: 'cat130058'
            };
        });
        it('should return the catalogId', () => {
            const category = Object.assign({}, props.items[0]);
            delete category.subCategories;

            const property = catalogUtils.getPropertyNameFromCategory(category, props.catalogKeyName);
            expect(property).toBe('cat140006');
        });

        it('should return the catalogId', () => {
            const category = Object.assign({}, props.items[0].subCategories[0]);
            delete category.subCategories;

            const property = catalogUtils.getPropertyNameFromCategory(category, props.catalogKeyName);
            expect(property).toBe('cat130058');
        });

        it('should return category[this.props.catalogKeyName]', () => {
            const category = Object.assign({}, props.items[0]);
            category[props.catalogKeyName] = 'catalogId';
            delete category.subCategories;

            const property = catalogUtils.getPropertyNameFromCategory(category, props.catalogKeyName);
            expect(property).toBe('catalogId');
        });
    });

    describe('handling SEO for CA data', () => {
        let data;

        beforeEach(() => {
            data = {
                categories: [
                    {
                        displayName: 'Makeup',
                        level: 0,
                        node: 1050000,
                        subCategories: [
                            {
                                displayName: 'Brushes & Applicators',
                                isSelected: true,
                                level: 1,
                                node: 8766834,
                                recordCount: '4',
                                subCategories: [
                                    {
                                        displayName: 'Brrrrrush',
                                        level: 2,
                                        node: 8766835,
                                        recordCount: '4',
                                        targetUrl: '/brand/sephora-collection/brrrrrush'
                                    }
                                ],
                                targetUrl: '/brand/sephora-collection/makeup-applicators'
                            }
                        ],
                        targetUrl: '/brand/sephora-collection/makeup-cosmetics'
                    }
                ],
                targetUrl: '/brand/sephora-collection'
            };
        });

        it('should do nothing if Sephora.isSEOForCanadaEnabled is false', () => {
            Sephora.isSEOForCanadaEnabled = false;
            const result = catalogUtils.handleSEOForCanada(data);
            expect(result.targetUrl).toEqual('/brand/sephora-collection');
        });

        it('should do nothing if is not Canada', () => {
            Sephora.isSEOForCanadaEnabled = true;
            spyOn(localeUtils, 'isCanada').and.returnValue(false);
            const result = catalogUtils.handleSEOForCanada(data);
            expect(result.targetUrl).toEqual('/brand/sephora-collection');
        });

        describe('when in CA-EN', () => {
            let result;

            beforeEach(() => {
                Sephora.isSEOForCanadaEnabled = true;
                spyOn(localeUtils, 'isCanada').and.returnValue(true);
                result = catalogUtils.handleSEOForCanada(data);
            });

            it('should update the targetUrl on the 0th level', () => {
                expect(result.targetUrl).toEqual('/ca/en/brand/sephora-collection');
            });

            it('should update the targetUrl on the 1st level', () => {
                expect(result.categories[0].targetUrl).toEqual('/ca/en/brand/sephora-collection/makeup-cosmetics');
            });

            it('should update the targetUrl on the 2nd level', () => {
                expect(result.categories[0].subCategories[0].targetUrl).toEqual('/ca/en/brand/sephora-collection/makeup-applicators');
            });

            it('should update the targetUrl on the 3rd level', () => {
                expect(result.categories[0].subCategories[0].subCategories[0].targetUrl).toEqual('/ca/en/brand/sephora-collection/brrrrrush');
            });
        });
    });

    describe('getting refinements ids from the query parameters', () => {
        const queryParams = {};

        beforeEach(() => {
            queryParams.ref = [];
        });

        it('should return an empty array if the ref paramenter is not defined', () => {
            delete queryParams.ref;
            const refinementsIds = catalogUtils.getRefinementsFromQueryParams(queryParams);
            expect(refinementsIds).toEqual([]);
        });

        it('should return an empty array if the ref paramenter is empy', () => {
            const refinementsIds = catalogUtils.getRefinementsFromQueryParams(queryParams);
            expect(refinementsIds).toEqual([]);
        });

        it('should return an array of ids if the ref params is comma separated', () => {
            queryParams.ref = ['1,2,3'];
            const refinementsIds = catalogUtils.getRefinementsFromQueryParams(queryParams);
            expect(refinementsIds).toEqual(['1', '2', '3']);
        });

        it('should return an array of ids if the ref params is an array of ids', () => {
            queryParams.ref = ['1', '2', '3'];
            const refinementsIds = catalogUtils.getRefinementsFromQueryParams(queryParams);
            expect(refinementsIds).toEqual(['1', '2', '3']);
        });
    });
});
