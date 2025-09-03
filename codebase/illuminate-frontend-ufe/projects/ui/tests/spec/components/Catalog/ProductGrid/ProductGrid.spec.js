/* eslint-disable no-unused-vars */
describe('ProductGrid Component', () => {
    let React;
    let ReactDOM;
    let ReactTestUtils;
    let ProductGrid;
    let setStateStub;

    beforeEach(() => {
        React = require('react');
        ReactDOM = require('react-dom');
        ReactTestUtils = require('react-dom/test-utils');
        ProductGrid = require('components/Catalog/ProductGrid/ProductGrid').default;
    });

    function createProductGrid(props = {}, isShallow = true) {
        return enzyme[isShallow ? 'shallow' : 'mount'](<ProductGrid {...props} />);
    }

    describe('handleLoadMore method', () => {
        let anaUtils;
        let processEvent;
        let processStub;
        let grid;
        let component;
        beforeEach(() => {
            anaUtils = require('analytics/constants').default;
            processEvent = require('analytics/processEvent').default;
            processStub = spyOn(processEvent, 'process');
            const fakeFunction = function () {
                return;
            };
            const props = {
                setPageNumber: fakeFunction,
                currentPage: 1
            };

            grid = createProductGrid(props, true);
            setStateStub = spyOn(grid, 'setState');
            component = grid.instance();
            component.handleLoadMore();
        });

        it('should call setState method', () => {
            expect(setStateStub).toHaveBeenCalled();
        });

        it('should call process method', () => {
            expect(processStub).toHaveBeenCalled();
        });

        it('should call process method with correct values', () => {
            expect(processStub).toHaveBeenCalledWith('linkTrackingEvent', {
                data: {
                    linkName: 'D=c55',
                    actionInfo: 'show more products',
                    eventStrings: ['event71']
                }
            });
        });
    });

    describe('dataAt', () => {
        let grid;
        const fakeFunction = function () {
            return;
        };
        const props = {
            setPageNumber: fakeFunction,
            currentPage: 1,
            appliedFilters: {},
            refinements: [
                {
                    displayName: 'Sort',
                    type: 'sort',
                    values: [
                        {
                            refinementValue: 'RELEVANCY',
                            refinementValueDisplayName: 'Relevance',
                            refinementValueStatus: 1,
                            isDefault: true
                        },
                        {
                            refinementValue: 'BEST_SELLING',
                            refinementValueDisplayName: 'Bestselling',
                            refinementValueStatus: 1
                        },
                        {
                            refinementValue: 'TOP_RATED',
                            refinementValueDisplayName: 'Top Rated',
                            refinementValueStatus: 1
                        },
                        {
                            refinementValue: 'PRICE_LOW_TO_HIGH',
                            refinementValueDisplayName: 'Price Low to High',
                            refinementValueStatus: 1
                        },
                        {
                            refinementValue: 'PRICE_HIGH_TO_LOW',
                            refinementValueDisplayName: 'Price High to Low',
                            refinementValueStatus: 2
                        },
                        {
                            refinementValue: 'NEW',
                            refinementValueDisplayName: 'New',
                            refinementValueStatus: 1
                        }
                    ]
                }
            ]
        };
        beforeEach(() => {
            grid = createProductGrid(props, true);
        });

        it('should find number_of_products', () => {
            const element = grid.find('Text[data-at="number_of_products"]');
            expect(element.length).toBe(1);
        });

        it('should find filter_error', () => {
            const element = grid.find('Text[data-at="filter_error"]');
            expect(element.length).toBe(1);
        });
    });

    describe('getTilesAndMidBanner method', () => {
        const defaultProps = {
            appliedFilters: {
                Sort: [],
                'Pickup & Delivery': [],
                'Your Beauty Preferences': [],
                'Shopping Preferences': [],
                Rating: [],
                Brand: ['filters[Brand]=REFY'],
                'Skin Type': []
            },
            categoryName: 'Makeup',
            clearAllFilters: () => {},
            currentPage: 1,
            currentTotalText: '1-12 of 12 Results',
            deliveryOptions: undefined,
            dontShowMoreProducts: true,
            h1: 'Makeup',
            increaseImageSizeGrid: true,
            layoutWrapRef: { current: 'div' },
            marketingTilePositions: ['1', '17', '42', '58', '60'],
            marketingTiles: [
                {
                    brandName: 'MERIT',
                    displayName: 'Flush Balm Cream Blush',
                    slot: 0
                },
                {
                    brandName: 'MERIT',
                    displayName: 'Shade Slick Gelée Sheer Tinted Lip Oil',
                    slot: 11
                },
                {
                    brandName: 'MERIT',
                    displayName: 'The Minimalist Perfecting Complexion Foundation and Concealer Stick',
                    slot: 15
                },
                {
                    brandName: 'MERIT',
                    displayName: 'Bronze Balm Sheer Sculpting Bronzer',
                    slot: 16
                }
            ],
            pageName: 'nthCategory',
            parentCategoryName: undefined,
            products: [
                {
                    brandName: 'MERIT',
                    currentSku: {},
                    displayName: 'Flush Balm Cream Blush',
                    heroImage: 'https://s2636835-main-zoom.jpg?imwidth=270&pb=allure-2022-clean-badge',
                    altImage: 'https://s2636835-av-2-zoom.jpg?imwidth=270',
                    productId: 'P468693'
                },
                {
                    brandName: 'MERIT',
                    currentSku: {},
                    displayName: 'Shade Slick Gelée Sheer Tinted Lip Oil',
                    heroImage: 'https://s2675502-main-zoom.jpg?imwidth=270&pb=2020-03-sephora-clean-2019',
                    productId: 'P505330'
                },
                {
                    brandName: 'MERIT',
                    currentSku: {},
                    displayName: 'The Minimalist Perfecting Complexion Foundation and Concealer Stick',
                    heroImage: 'https://s2569143-main-zoom.jpg?imwidth=270&pb=2020-03-sephora-clean-2019',
                    productId: 'P468694'
                },
                {
                    brandName: 'MERIT',
                    currentSku: {},
                    displayName: 'Bronze Balm Sheer Sculpting Bronzer',
                    heroImage: 'https://s2609766-main-zoom.jpg?imwidth=270&pb=2020-03-sephora-clean-2019',
                    productId: 'P501766'
                },
                {
                    brandName: 'MERIT',
                    currentSku: {},
                    displayName: 'Shade Slick Classics Tinted Lip Oil',
                    heroImage: 'https://s2489599-main-zoom.jpg?imwidth=270&pb=2020-03-sephora-clean-2019',
                    productId: 'P468691'
                },
                {
                    brandName: 'MERIT',
                    currentSku: {},
                    displayName: 'Day Glow Dewy Highlighting Balm',
                    heroImage: 'https://s2567287-main-zoom.jpg?imwidth=270&pb=2020-03-sephora-clean-2019',
                    productId: 'P468696'
                },
                {
                    brandName: 'MERIT',
                    currentSku: {},
                    displayName: 'Signature Lip Lightweight Lipstick',
                    heroImage: 'https://s2512770-main-zoom.jpg?imwidth=270&pb=2020-03-sephora-clean-2019',
                    productId: 'P481403'
                },
                {
                    brandName: 'MERIT',
                    currentSku: {},
                    displayName: 'Clean Lash Lengthening Tubing Mascara',
                    heroImage: 'https://s2426781-main-zoom.jpg?imwidth=270&pb=allure-best-2021-badge',
                    productId: 'P468692'
                },
                {
                    brandName: 'MERIT',
                    currentSku: {},
                    displayName: 'Brush No. 1 Tapered Blending Brush',
                    heroImage: 'https://s2426708-main-zoom.jpg?imwidth=270',
                    productId: 'P468697'
                },
                {
                    brandName: 'MERIT',
                    currentSku: {},
                    displayName: 'Brow 1980 Volumizing Eyebrow Pomade Gel',
                    heroImage: 'https://s2426682-main-zoom.jpg?imwidth=270&pb=2020-03-sephora-clean-2019',
                    productId: 'P468695'
                },
                {
                    brandName: 'MERIT',
                    currentSku: {},
                    displayName: 'Brush No. 2 Double Sided Eyeshadow Brush',
                    heroImage: 'https://s2692408-main-zoom.jpg?imwidth=270&pb=2020-03-sephora-clean-2019',
                    productId: 'P507794'
                },
                {
                    brandName: 'MERIT',
                    currentSku: {},
                    displayName: 'Solo Shadow Cream-to-Powder Soft Matte Eyeshadow',
                    heroImage: 'https://s2692325-main-zoom.jpg?imwidth=270&pb=2020-03-sephora-clean-2019',
                    productId: 'P506671'
                }
            ],
            refinements: [
                {
                    displayName: 'Sort',
                    type: 'sort',
                    values: [
                        {
                            refinementValue: 'RELEVANCY',
                            refinementValueDisplayName: 'Relevance',
                            refinementValueStatus: 1,
                            isDefault: true
                        },
                        {
                            refinementValue: 'BEST_SELLING',
                            refinementValueDisplayName: 'Bestselling',
                            refinementValueStatus: 1
                        },
                        {
                            refinementValue: 'TOP_RATED',
                            refinementValueDisplayName: 'Top Rated',
                            refinementValueStatus: 1
                        },
                        {
                            refinementValue: 'PRICE_LOW_TO_HIGH',
                            refinementValueDisplayName: 'Price Low to High',
                            refinementValueStatus: 1
                        },
                        {
                            refinementValue: 'PRICE_HIGH_TO_LOW',
                            refinementValueDisplayName: 'Price High to Low',
                            refinementValueStatus: 1
                        },
                        {
                            refinementValue: 'NEW',
                            refinementValueDisplayName: 'New',
                            refinementValueStatus: 1
                        }
                    ]
                },
                {
                    displayName: 'Pickup & Delivery',
                    type: 'checkboxesWithDropDown',
                    values: [
                        {
                            refinementValueDisplayName: 'Pickup',
                            refinementValueStatus: 1,
                            filterKey: 'filters[Pickup]'
                        },
                        {
                            refinementValueDisplayName: 'Same-Day Delivery',
                            refinementValueStatus: 1,
                            filterKey: 'filters[SameDay]'
                        },
                        {
                            refinementValueDisplayName: 'Ship to',
                            refinementValueStatus: 1,
                            filterKey: 'filters[ShipToHome]',
                            refinementValueDisplayNameComp: 'filters[ShipToHome]'
                        }
                    ]
                },
                {
                    displayName: 'Your Beauty Preferences',
                    type: 'beautyPreferences',
                    values: []
                }
            ],
            removeFilterValue: (filterKey, filterValue, applyFilters = false) => {},
            resultsText: '12 Results',
            searchQuery: undefined,
            searchWarningMessages: undefined,
            selectFilters: (filtersToSelect, applyFilters = false) => {},
            setPageNumber: pageNumber => {},
            showEddOnBrowseAndSearch: true,
            showMidPageBanner: true,
            showSponsorProducts: false,
            source: 'category',
            sponsorProducts: [],
            sponsorProductsLoaded: true
        };

        let anaUtils;
        let processEvent;
        let processStub;
        let grid;
        let component;
        beforeEach(() => {
            anaUtils = require('analytics/constants').default;
            processEvent = require('analytics/processEvent').default;
            processStub = spyOn(processEvent, 'process');
            grid = createProductGrid(defaultProps);
            component = grid.instance();
        });

        it('should render the mid page banner at 12th index if product tiles + marketing tiles are greater than 12', () => {
            const result = component.getTilesAndMidBanner(defaultProps.products, defaultProps.marketingTiles);
            expect(result[12]).toEqual({ type: 'midPageBanner', position: 12 });
            expect(result.length).toEqual(defaultProps.products.length + defaultProps.marketingTiles.length + 1);
        });

        it('should render the mid page banner at last index if product tiles + marketing tiles are less than 12', () => {
            const products = defaultProps.products.slice(0, 2);
            const marketingTiles = defaultProps.marketingTiles.slice(0, 2);
            const result = component.getTilesAndMidBanner(products, marketingTiles);
            const lastIndex = result.length - 1;
            expect(result[lastIndex]).toEqual({ type: 'midPageBanner', position: lastIndex });
        });

        it('should render marketingTiles at specified slot/index', () => {
            const result = component.getTilesAndMidBanner(defaultProps.products, defaultProps.marketingTiles);
            expect(result[12]).toEqual({ type: 'midPageBanner', position: 12 });
            defaultProps.marketingTiles.forEach(tile => {
                expect(result[tile.slot]).toEqual({ type: 'marketingTile', ...tile });
            });
        });

        it('should render marketingTiles and mid page banner if there are no product tiles', () => {
            const result = component.getTilesAndMidBanner([], defaultProps.marketingTiles);
            const lastIndex = result.length - 1;
            expect(result[lastIndex]).toEqual({ type: 'midPageBanner', position: lastIndex });
            expect(result.length).toEqual(defaultProps.marketingTiles.length + 1);
        });

        it('should render products and mid page banner if there are no marketing tiles', () => {
            const result = component.getTilesAndMidBanner(defaultProps.products, []);
            const lastIndex = result.length - 1;
            expect(result[lastIndex]).toEqual({ type: 'midPageBanner', position: lastIndex });
            expect(result.length).toEqual(defaultProps.products.length + 1);
        });

        it('should render the mid page banner at 12th index if product tiles are less than 12 but product tiles + marketing tiles are greater than 12', () => {
            const products = defaultProps.products.slice(0, 10);
            const result = component.getTilesAndMidBanner(products, defaultProps.marketingTiles);
            expect(result[12]).toEqual({ type: 'midPageBanner', position: 12 });
            expect(result.length).toEqual(products.length + defaultProps.marketingTiles.length + 1);
        });

        it('should render the mid page banner at 12th index if product + marketing tiles are exactly 12', () => {
            const products = defaultProps.products.slice(0, 10);
            const marketingTiles = defaultProps.marketingTiles.slice(0, 4);
            const result = component.getTilesAndMidBanner(products, marketingTiles);
            expect(products.length + marketingTiles.length).toEqual(12);
            expect(result[12]).toEqual({ type: 'midPageBanner', position: 12 });
            expect(result.length).toEqual(products.length + marketingTiles.length + 1);
        });
    });
});
