const React = require('react');
const { any } = jasmine;
const { shallow } = require('enzyme');

describe('PurchasedGroups component', () => {
    let store;
    let props;
    let state;
    let PurchasedGroups;
    let component;
    let getPurchasedGroupsSpy;
    let watchActionSpy;
    let ProductActions;
    let BIApi;
    let urlUtils;
    let getPurchaseHistoryStub;
    let dispatchSpy;
    let Actions;
    let updateItemCountActionStub;
    let setPurchasedGroupsSpy;
    let getFilterOptionsSpy;
    let fakePromise;
    let processEventSpy;
    let processEvent;
    let anaConsts;
    let languageLocale;

    beforeEach(() => {
        store = require('Store').default;
        PurchasedGroups = require('components/RichProfile/PurchaseHistoryList/PurchasedGroups/PurchasedGroups').default;
        ProductActions = require('actions/ProductActions').default;
        BIApi = require('services/api/beautyInsider').default;
        urlUtils = require('utils/Url').default;
        Actions = require('Actions').default;
        processEvent = require('analytics/processEvent').default;
        anaConsts = require('analytics/constants').default;
        languageLocale = require('utils/LanguageLocale').default;
        state = { currentPage: 1 };
        props = {
            itemsPerPage: 10,
            currentUserId: '123456789',
            sortOptions: [
                {
                    name: 'Sort1',
                    code: 'sortone'
                },
                {
                    name: 'Sort2',
                    code: 'sorttwo'
                }
            ],
            filterOptions: [
                {
                    name: 'Filter1',
                    code: 'filterone'
                },
                {
                    name: 'Filter2',
                    code: 'filtertwo'
                }
            ]
        };
        const wrapper = shallow(<PurchasedGroups {...props} />);
        component = wrapper.instance();
    });

    describe('#ctrlr method', () => {
        beforeEach(() => {
            watchActionSpy = spyOn(store, 'watchAction');
            component.state = state;
            getPurchasedGroupsSpy = spyOn(component, 'getPurchasedGroups');
            processEventSpy = spyOn(processEvent, 'process');
            component.componentDidMount();
        });

        it('should display rewards purchases if url as filterby params set as rewards', () => {
            spyOn(urlUtils, 'getParamValueAsSingleString').and.returnValue('rewards');
            component.componentDidMount();
            expect(getPurchasedGroupsSpy).toHaveBeenCalledWith('123456789', 'recently', 10, 1, 'rewards');
        });

        it('should call getPurchasedGroups method with the correct args', () => {
            expect(getPurchasedGroupsSpy).toHaveBeenCalledWith('123456789', 'sortone', 10, 1, 'filterone');
        });

        it('should watch for the correct action', () => {
            expect(watchActionSpy).toHaveBeenCalledWith(ProductActions.TYPES.SELECT_SORT_OPTION, any(Function));
        });

        describe('watchAction callback function', () => {
            beforeEach(() => {
                watchActionSpy.calls.first().args[1]({
                    sortOption: {
                        name: 'Sort2',
                        code: 'sorttwo'
                    }
                });
            });

            it('should update state', () => {
                expect(component.state.selectedSortOption).toEqual('sorttwo');
            });

            it('should call getPurchasedGroups method on select sort action', () => {
                expect(getPurchasedGroupsSpy.calls.mostRecent().args).toEqual(['123456789', 'sorttwo', 10, 1, component.state.selectedFilterOption]);
            });

            it('should call processEvent method passing "asyncPageLoad"', () => {
                expect(processEventSpy.calls.first().args[0]).toEqual(anaConsts.ASYNC_PAGE_LOAD);
            });

            it('should call processEvent method passing category filters array', () => {
                expect(processEventSpy.calls.first().args[1].data.categoryFilters).toEqual(['sortby:sorttwo']);
            });

            it('should call processEvent with the necessary object keys', () => {
                const requiredKeys = ['categoryFilters', 'pageDetail', 'pageType', 'pageName'];
                expect(requiredKeys.every(key => Object.prototype.hasOwnProperty.call(processEventSpy.calls.first().args[1].data, key))).toBeTruthy();
            });
        });
    });

    describe('#getPurchasedGroupName method', () => {
        let getText;

        beforeEach(() => {
            getText = languageLocale.getLocaleResourceFile('components/RichProfile/PurchaseHistoryList/PurchasedGroups/locales', 'PurchasedGroups');
        });

        it('should return correct display name for sephora.com group', () => {
            expect(component.getPurchasedGroupName('SEPHORA .COM ', getText)).toEqual('Sephora.com');
        });

        it('should return store name as a fallback option', () => {
            expect(component.getPurchasedGroupName('Random string', getText, true)).toEqual('Random string Purchased online');
        });
    });

    describe('#getPurchasedGroups method', () => {
        beforeEach(() => {
            dispatchSpy = spyOn(store, 'dispatch');
            setPurchasedGroupsSpy = spyOn(component, 'setPurchasedGroups');
            getFilterOptionsSpy = spyOn(component, 'getFilterOptions');
        });

        it('should call BI api method getPurchaseHistory with the correct args', () => {
            getPurchaseHistoryStub = spyOn(BIApi, 'getPurchaseHistory').and.returnValue(Promise.resolve({ purchasedItemsCount: 10 }));
            component.getPurchasedGroups('123456789', 'sortone', 10, 1, 'filterone');
            expect(getPurchaseHistoryStub).toHaveBeenCalledWith('123456789', {
                sortBy: 'sortone',
                itemsPerPage: 10,
                currentPage: 1,
                groupBy: 'storeAndDate',
                purchaseFilter: 'filterone'
            });
        });

        it('should dispatch action and call setPurchasedGroups method at api response', done => {
            updateItemCountActionStub = spyOn(Actions, 'updatePurchasedHistoryItemCount');
            fakePromise = {
                then: function (resolve) {
                    resolve({ purchasedItemsCount: 10 });
                    expect(dispatchSpy).toHaveBeenCalledWith(updateItemCountActionStub(10));
                    expect(setPurchasedGroupsSpy).toHaveBeenCalledWith({ purchasedItemsCount: 10 }, 1);
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };
            getPurchaseHistoryStub = spyOn(BIApi, 'getPurchaseHistory').and.returnValue(fakePromise);
            component.getPurchasedGroups('123456789', 'sortone', 10, 1);
        });

        it('should dispatch call getFilterOptions method at api response', done => {
            updateItemCountActionStub = spyOn(Actions, 'updatePurchasedHistoryItemCount');
            fakePromise = {
                then: function (resolve) {
                    resolve({
                        purchasedItemsCount: 10,
                        purchasedGroups: [{ purchasedItems: [{}] }]
                    });
                    expect(getFilterOptionsSpy).toHaveBeenCalledWith([{ purchasedItems: [{}] }]);
                    done();

                    return fakePromise;
                },
                catch: function () {
                    return function () {};
                }
            };
            getPurchaseHistoryStub = spyOn(BIApi, 'getPurchaseHistory').and.returnValue(fakePromise);
            component.getPurchasedGroups('123456789', 'sortone', 10, 1, 'filterone');
        });
    });

    describe('#setPurchasedGroups method', () => {
        describe('set state accordingly to received api data', () => {
            describe('with default sort option', () => {
                it('should reset purchasedGroups on first page', () => {
                    component.state = Object.assign({}, state, { purchasedGroups: [] });

                    const mockData = {
                        purchasedGroups: [
                            {
                                transactionDate: '09/18/2012',
                                storeNumber: '0700',
                                purchasedItems: [
                                    {
                                        quantity: 1,
                                        sku: { skuId: '1234' }
                                    },
                                    {
                                        quantity: 1,
                                        sku: { skuId: '4321' }
                                    }
                                ]
                            },
                            {
                                transactionDate: '10/18/2012',
                                storeNumber: '0700',
                                purchasedItems: [
                                    {
                                        quantity: 1,
                                        sku: { skuId: '7890' }
                                    },
                                    {
                                        quantity: 1,
                                        sku: { skuId: '0987' }
                                    }
                                ]
                            }
                        ],
                        purchasedItemsCount: 4
                    };

                    component.setPurchasedGroups(mockData, 1);
                    expect(component.state).toEqual({
                        currentPage: 1,
                        purchasedGroups: mockData.purchasedGroups,
                        purchasedItemsCount: 4,
                        hasNoPurchaseHistory: false
                    });
                });
                it(`should concat received purchaseItems with state
                    purchasedGroup on not first page`, () => {
                    component.state = Object.assign({}, state, {
                        purchasedItemsCount: 2,
                        purchasedGroups: [
                            {
                                transactionDate: '09/18/2012',
                                storeNumber: '0700',
                                purchasedItems: [
                                    {
                                        quantity: 1,
                                        sku: { skuId: '1111' }
                                    },
                                    {
                                        quantity: 1,
                                        sku: { skuId: '1122' }
                                    }
                                ]
                            }
                        ],
                        selectedSortOption: props.sortOptions[0].code
                    });

                    const mockData = {
                        purchasedGroups: [
                            {
                                transactionDate: '09/18/2012',
                                storeNumber: '0700',
                                purchasedItems: [
                                    {
                                        quantity: 1,
                                        sku: { skuId: '1133' }
                                    }
                                ]
                            },
                            {
                                transactionDate: '10/18/2012',
                                storeNumber: '0600',
                                purchasedItems: [
                                    {
                                        quantity: 1,
                                        sku: { skuId: '2211' }
                                    }
                                ]
                            }
                        ],
                        purchasedItemsCount: 4
                    };

                    component.setPurchasedGroups(mockData, 2);
                    expect(component.state).toEqual({
                        currentPage: 2,
                        purchasedGroups: [
                            {
                                transactionDate: '09/18/2012',
                                storeNumber: '0700',
                                purchasedItems: [
                                    {
                                        quantity: 1,
                                        sku: { skuId: '1111' }
                                    },
                                    {
                                        quantity: 1,
                                        sku: { skuId: '1122' }
                                    },
                                    {
                                        quantity: 1,
                                        sku: { skuId: '1133' }
                                    }
                                ]
                            },
                            {
                                transactionDate: '10/18/2012',
                                storeNumber: '0600',
                                purchasedItems: [
                                    {
                                        quantity: 1,
                                        sku: { skuId: '2211' }
                                    }
                                ]
                            }
                        ],
                        purchasedItemsCount: 4,
                        hasNoPurchaseHistory: false,
                        selectedSortOption: props.sortOptions[0].code
                    });
                });
            });

            describe('with non default sort option', () => {
                it(`should concat received purchaseItems to default
                    purchasedGroup items on first page`, () => {
                    component.state = Object.assign({}, state, {
                        purchasedGroups: [],
                        selectedSortOption: props.sortOptions[1].code
                    });

                    const mockData = {
                        purchasedItems: [
                            {
                                quantity: 1,
                                sku: { skuId: '1234' }
                            },
                            {
                                quantity: 1,
                                sku: { skuId: '4321' }
                            }
                        ],
                        purchasedItemsCount: 2
                    };

                    component.setPurchasedGroups(mockData, 1);
                    expect(component.state).toEqual({
                        currentPage: 1,
                        purchasedGroups: [
                            {
                                purchasedItems: [
                                    {
                                        quantity: 1,
                                        sku: { skuId: '1234' }
                                    },
                                    {
                                        quantity: 1,
                                        sku: { skuId: '4321' }
                                    }
                                ]
                            }
                        ],
                        purchasedItemsCount: 2,
                        hasNoPurchaseHistory: false,
                        selectedSortOption: props.sortOptions[1].code
                    });
                });

                it(`should concat received purchaseItems with purchasedGroups
                    on not first page`, () => {
                    component.setState({
                        purchasedItemsCount: 2,
                        purchasedGroups: [
                            {
                                purchasedItems: [
                                    {
                                        quantity: 1,
                                        sku: { skuId: '1234' }
                                    },
                                    {
                                        quantity: 1,
                                        sku: { skuId: '4321' }
                                    }
                                ]
                            }
                        ],
                        selectedSortOption: props.sortOptions[1].code
                    });

                    const mockData = {
                        purchasedItems: [
                            {
                                quantity: 1,
                                sku: { skuId: '7890' }
                            },
                            {
                                quantity: 1,
                                sku: { skuId: '0987' }
                            }
                        ],
                        purchasedItemsCount: 4
                    };

                    component.setPurchasedGroups(mockData, 2);
                    expect(component.state).toEqual({
                        currentPage: 2,
                        purchasedGroups: [
                            {
                                purchasedItems: [
                                    {
                                        quantity: 1,
                                        sku: { skuId: '1234' }
                                    },
                                    {
                                        quantity: 1,
                                        sku: { skuId: '4321' }
                                    },
                                    {
                                        quantity: 1,
                                        sku: { skuId: '7890' }
                                    },
                                    {
                                        quantity: 1,
                                        sku: { skuId: '0987' }
                                    }
                                ]
                            }
                        ],
                        purchasedItemsCount: 4,
                        hasNoPurchaseHistory: false,
                        selectedSortOption: props.sortOptions[1].code,
                        selectedFilterOption: props.filterOptions[0].code
                    });
                });
            });
        });
    });

    describe('#handleShowMoreClick method', () => {
        beforeEach(() => {
            getPurchasedGroupsSpy = spyOn(component, 'getPurchasedGroups');
        });

        it('should call #getPurchasedGroups with the correct data', () => {
            state.currentPage = 2;
            component.state = Object.assign({}, state, {
                selectedSortOption: props.sortOptions[1].code,
                selectedFilterOption: props.filterOptions[0].code
            });
            component.handleShowMoreClick();
            expect(getPurchasedGroupsSpy).toHaveBeenCalledWith('123456789', 'sorttwo', 10, 3, 'filterone');
        });
    });

    describe('#getFilterOptions method', () => {
        let PURCHASES_FILTER_OPTIONS;
        let purchasesFilterOptionsSpy;
        let purchasedGroups;

        beforeEach(() => {
            PURCHASES_FILTER_OPTIONS = require('components/RichProfile/PurchaseHistoryList/PurchasesFilter/PurchasesFilterOptions');
            purchasedGroups = [
                {
                    purchasedItems: [
                        {
                            quantity: 1,
                            sku: { skuId: '1234' }
                        }
                    ]
                }
            ];
            dispatchSpy = spyOn(store, 'dispatch');
            purchasesFilterOptionsSpy = spyOn(ProductActions, 'purchasesFilterOptions');
            component.filterOptions = undefined;
        });

        it('should categorize rewards', () => {
            purchasedGroups[0].purchasedItems[0].sku = {
                skuId: '1234',
                biType: 'reward'
            };
            component.getFilterOptions(purchasedGroups);
            expect(purchasesFilterOptionsSpy).toHaveBeenCalledWith([PURCHASES_FILTER_OPTIONS.BOTH, PURCHASES_FILTER_OPTIONS.REWARDS]);
        });

        it('should categorize unknown types as store order', () => {
            purchasedGroups[0].purchasedItems[0].sku = {
                skuId: '1234',
                store: { displayName: 12345 }
            };
            component.getFilterOptions(purchasedGroups);
            expect(purchasesFilterOptionsSpy).toHaveBeenCalledWith([PURCHASES_FILTER_OPTIONS.BOTH, PURCHASES_FILTER_OPTIONS.STORE]);
        });

        it('should pick up previously filtered options', () => {
            component.filterOptions = new Set([PURCHASES_FILTER_OPTIONS.BOTH, PURCHASES_FILTER_OPTIONS.ONLINE]);
            purchasedGroups[0].purchasedItems[0].sku = {
                skuId: '1234',
                store: { displayName: 12345 }
            };
            component.getFilterOptions(purchasedGroups);
            expect(purchasesFilterOptionsSpy).toHaveBeenCalledWith([
                PURCHASES_FILTER_OPTIONS.BOTH,
                PURCHASES_FILTER_OPTIONS.ONLINE,
                PURCHASES_FILTER_OPTIONS.STORE
            ]);
        });

        it('should categorize website orders', () => {
            purchasedGroups[0].purchasedItems[0].sku = {
                skuId: '1234',
                store: { displayName: 'SEPHORA .COM ' }
            };
            purchasedGroups[0].purchasedItems[0].isOnline = true;

            component.getFilterOptions(purchasedGroups);
            expect(purchasesFilterOptionsSpy).toHaveBeenCalledWith([PURCHASES_FILTER_OPTIONS.BOTH, PURCHASES_FILTER_OPTIONS.ONLINE]);
        });
    });

    describe('should render data-at attribute set to "order_channel"', () => {
        it('should render data-at attribute set to "order_channel"', () => {
            const wrapper = shallow(<PurchasedGroups {...props} />);
            component = wrapper.instance();
            component.state = {
                purchasedGroups: [
                    {
                        quantity: 1,
                        sku: {
                            storeNumber: '0600',
                            transactionDate: 1592290800000
                        }
                    }
                ]
            };
            // Act
            const dataAt = wrapper.findWhere(n => n.prop('data-at') === 'order_channel');
            // Assert
            expect(dataAt.length).toEqual(0);
        });
    });
});
