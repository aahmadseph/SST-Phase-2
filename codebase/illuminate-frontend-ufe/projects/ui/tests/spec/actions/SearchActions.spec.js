// const { createSpy } = jasmine;

describe('Search Actions', () => {
    const SearchActions = require('actions/SearchActions').default;
    const store = require('Store').default;
    const HistoryLocationActions = require('actions/framework/HistoryLocationActions').default;
    let historyGoToStub;
    let dispatchStub;

    let actionResult;
    let localStorageGetItemStub;

    beforeEach(function () {
        historyGoToStub = spyOn(HistoryLocationActions, 'goTo');
        dispatchStub = spyOn(store, 'dispatch');
    });

    describe('#addRefinement', () => {
        it('should call action with refinement if not already active', () => {
            const state = function () {
                return {
                    historyLocation: {
                        queryParams: {
                            ref: [],
                            currentPage: ['1']
                        }
                    }
                };
            };
            const addRefinement = SearchActions.addRefinement(1);
            addRefinement(dispatchStub, state);
            expect(historyGoToStub).toHaveBeenCalledWith({ queryParams: { ref: ['1'] } });
        });

        it('should not call action if refinement already active', () => {
            const state = function () {
                return {
                    historyLocation: {
                        queryParams: {
                            ref: ['1'],
                            currentPage: ['2']
                        }
                    }
                };
            };
            const addRefinement = SearchActions.addRefinement(1);
            addRefinement(dispatchStub, state);
            expect(historyGoToStub).not.toHaveBeenCalled();
        });
    });

    describe('#removeRefinements', () => {
        it('should remove active refinements and call action', () => {
            const state = function () {
                return {
                    historyLocation: {
                        queryParams: {
                            ref: ['1', '2', '3'],
                            currentPage: ['1']
                        }
                    }
                };
            };
            const removeRefinements = SearchActions.removeRefinements([1, 2]);
            removeRefinements(dispatchStub, state);
            expect(historyGoToStub).toHaveBeenCalledWith({ queryParams: { ref: ['3'] } });
        });

        it('should not call action if called refinements are not active', () => {
            const state = function () {
                return {
                    historyLocation: {
                        queryParams: {
                            ref: ['1'],
                            currentPage: ['2']
                        }
                    }
                };
            };
            const removeRefinements = SearchActions.removeRefinements([2]);
            removeRefinements(dispatchStub, state);
            expect(historyGoToStub).not.toHaveBeenCalled();
        });
    });

    describe('#clearRefinements', () => {
        it('should call action with all refinements cleared', () => {
            const state = function () {
                return {
                    historyLocation: {
                        queryParams: {
                            ref: ['1'],
                            currentPage: ['1'],
                            pl: ['20'],
                            ph: ['100']
                        }
                    }
                };
            };
            const clearRefinements = SearchActions.clearRefinements();
            clearRefinements(dispatchStub, state);
            expect(historyGoToStub).toHaveBeenCalledWith({ queryParams: {} });
        });
    });

    describe('#setSorting', () => {
        it('should call action with new sortBy param and remove currentPage', () => {
            const state = function () {
                return {
                    historyLocation: {
                        queryParams: {
                            sortBy: ['TOP_RATED'],
                            currentPage: ['1']
                        }
                    }
                };
            };
            const setSorting = SearchActions.setSorting('PRICE_LOW');
            setSorting(dispatchStub, state);
            expect(historyGoToStub).toHaveBeenCalledWith({ queryParams: { sortBy: 'PRICE_LOW' } });
        });
    });

    describe('#setPageNumber', () => {
        it('should call action with the new page', () => {
            const state = function () {
                return { historyLocation: { queryParams: { currentPage: ['1'] } } };
            };
            const setPageNumber = SearchActions.setPageNumber(2);
            setPageNumber(dispatchStub, state);
            expect(historyGoToStub).toHaveBeenCalledWith({ queryParams: { currentPage: 2 } });
        });
    });

    // TODO: inject-loader is not supported anymore
    // describe('Get search results', () => {
    //     let keyword = 'lip';
    //     let dispatch;

    //     const mockedSearchActionsInjector = require('inject-loader!actions/SearchActions');
    //     let mockedSearchActions, stubbedSearchTypeAhead;

    //     beforeEach(() => {
    //         stubbedSearchTypeAhead = createSpy();

    //         mockedSearchActions = mockedSearchActionsInjector({ 'services/api/search-n-browse/searchTypeAhead': stubbedSearchTypeAhead });

    //         dispatch = createSpy();
    //     });

    //     it('should call snbApi passing it the received arg', done => {
    //         stubbedSearchTypeAhead.and.returnValue(Promise.resolve());

    //         mockedSearchActions
    //             .getSearchResults('pass-me')(dispatch)
    //             .then(() => {
    //                 expect(stubbedSearchTypeAhead.calls.argsFor(0)[0]).toEqual('pass-me');
    //                 done();
    //             });
    //     });

    //     it('should create an object with proper type and results in it', done => {
    //         stubbedSearchTypeAhead.and.returnValue(
    //             Promise.resolve({
    //                 typeAheadTerms: [{ term: 'chanel perfume' }],
    //                 trendingCategories: [
    //                     {
    //                         value: 'Hand Cream & Foot Cream',
    //                         url: '/shop/hand-lotion-foot-cream'
    //                     }
    //                 ]
    //             })
    //         );

    //         mockedSearchActions
    //             .getSearchResults('whatever')(dispatch)
    //             .then(() => {
    //                 expect(dispatch.calls.argsFor(0)[0]).toEqual({
    //                     keyword: 'whatever',
    //                     results: [
    //                         { term: 'chanel perfume', value: 'chanel perfume' },
    //                         {
    //                             trendingCategories: [
    //                                 {
    //                                     value: 'Hand Cream & Foot Cream',
    //                                     url: '/shop/hand-lotion-foot-cream'
    //                                 }
    //                             ]
    //                         }
    //                     ],
    //                     type: SearchActions.TYPES.SHOW_SEARCH_RESULTS
    //                 });
    //                 done();
    //             });
    //     });

    //     it('should return empty array in case of soft server error', done => {
    //         // eslint-disable-next-line prefer-promise-reject-errors
    //         stubbedSearchTypeAhead.and.returnValue(Promise.reject());

    //         mockedSearchActions
    //             .getSearchResults('whatever')(dispatch)
    //             .then(() => {
    //                 expect(dispatch.calls.argsFor(0)[0]).toEqual({
    //                     keyword: 'whatever',
    //                     results: [],
    //                     type: SearchActions.TYPES.SHOW_SEARCH_RESULTS
    //                 });
    //                 done();
    //             });
    //     });

    //     it('should return results as an empty array if keyword less then 3 but not empty', () => {
    //         keyword = 'li';
    //         actionResult = SearchActions.getSearchResults(keyword);
    //         expect(actionResult).toEqual({
    //             keyword: 'li',
    //             results: [],
    //             type: SearchActions.TYPES.SHOW_SEARCH_RESULTS
    //         });
    //     });

    //     it('should return previous search results if keyword is empty', () => {
    //         localStorageGetItemStub = spyOn(window.localStorage, 'getItem');
    //         localStorageGetItemStub.and.returnValue([]);
    //         keyword = '';
    //         actionResult = SearchActions.getSearchResults(keyword);
    //         expect(actionResult.type).toEqual(SearchActions.TYPES.SHOW_PREVIOUS_SEARCH);
    //     });
    // });

    describe('#setPrices', () => {
        it('should call action with the new prices param and remove currentPage', () => {
            const state = function () {
                return {
                    historyLocation: {
                        queryParams: {
                            currentPage: ['1'],
                            pl: '0',
                            ph: '100'
                        }
                    }
                };
            };
            const setPrices = SearchActions.setPrices(['50', '200']);
            setPrices(dispatchStub, state);
            expect(historyGoToStub).toHaveBeenCalledWith({
                queryParams: {
                    pl: '50',
                    ph: '200'
                }
            });
        });
    });

    describe('#setPageSize', () => {
        // TODO: AlexR - Need to clarify if we need currentPage
        // it('should call action with max page size and remove currentPage', () => {
        //     let state = function () {
        //         return { historyLocation: { queryParams: { currentPage: ['1'] } } };
        //     };
        //     let setPageSize = SearchActions.setPageSize('300');
        //     setPageSize(dispatchStub, state);
        //     expect(historyGoToStub).toHaveBeenCalledWith({ queryParams: { pageSize: '300' } });
        // });

        it('should call action with not max page size and not remove currentPage', () => {
            const state = function () {
                return { historyLocation: { queryParams: { currentPage: ['1'] } } };
            };
            const setPageSize = SearchActions.setPageSize('200');
            setPageSize(dispatchStub, state);
            expect(historyGoToStub).toHaveBeenCalledWith({
                queryParams: {
                    pageSize: '200',
                    currentPage: ['1']
                }
            });
        });
    });

    describe('#setCategory', () => {
        it('should call action with the correct category path and params', () => {
            const state = function () {
                return {
                    historyLocation: {
                        queryParams: {
                            sortBy: ['TOP_RATED'],
                            pageSize: ['100']
                        }
                    }
                };
            };
            const setCategory = SearchActions.setCategory('/home');
            setCategory(dispatchStub, state);
            expect(historyGoToStub).toHaveBeenCalledWith({
                path: '/home',
                queryParams: {
                    sortBy: ['TOP_RATED'],
                    pageSize: ['100']
                }
            });
        });
    });

    describe('#setSearchCategory', () => {
        it('should call action with the correct node category param and remove others', () => {
            const state = function () {
                return {
                    historyLocation: {
                        queryParams: {
                            sortBy: ['TOP_RATED'],
                            ref: ['20', '21']
                        }
                    }
                };
            };
            const setSearchCategory = SearchActions.setSearchCategory('100');
            setSearchCategory(dispatchStub, state);
            expect(historyGoToStub).toHaveBeenCalledWith({
                queryParams: {
                    sortBy: ['TOP_RATED'],
                    ref: ['20', '21'],
                    node: '100'
                }
            });
        });

        it('should call action without the node category param if already active', () => {
            const state = function () {
                return {
                    historyLocation: {
                        queryParams: {
                            sortBy: ['TOP_RATED'],
                            ref: ['20', '21'],
                            node: ['100']
                        }
                    }
                };
            };
            const setSearchCategory = SearchActions.setSearchCategory('100');
            setSearchCategory(dispatchStub, state);
            expect(historyGoToStub).toHaveBeenCalledWith({
                queryParams: {
                    sortBy: ['TOP_RATED'],
                    ref: ['20', '21']
                }
            });
        });
    });

    describe('Get previous search results', () => {
        beforeEach(() => {
            localStorageGetItemStub = spyOn(window.localStorage, 'getItem');
        });

        it('should get only 5 last results from localStorage', () => {
            localStorageGetItemStub.and.returnValue('["1", "2", "3", "4", "5", "6"]');
            actionResult = SearchActions.showZeroStateSearchResults();
            expect(actionResult).toEqual({
                type: SearchActions.TYPES.SHOW_ZERO_STATE_RESULTS,
                results: ['1', '2', '3', '4', '5']
            });
        });

        it('should get data from proper key of localStorage', () => {
            localStorageGetItemStub.and.returnValue('["lips"]');
            actionResult = SearchActions.showZeroStateSearchResults();
            expect(localStorageGetItemStub).toHaveBeenCalledWith(SearchActions.STORAGE_KEYS.STORAGE_PREVIOUS_RESULTS);
        });
    });
});
