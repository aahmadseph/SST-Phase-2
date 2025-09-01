const React = require('react');
const { any } = jasmine;
const { shallow } = require('enzyme');

describe('ViewAllLoves component', () => {
    let store;
    let Actions;
    let auth;
    let state;
    let component;
    let activeSkusData;
    let getNextItemsOfLovesListStub;
    let getLovesFromStoreStub;
    let checkIfAPICallNeededStub;
    let resetLovesStateStub;
    let displayLovesListStub;
    let setStateSpy;
    let ViewAllLoves;
    let showShareLinkModalStub;
    let dispatchUpdatedLovesStub;
    let getSortedLovesListStub;
    let getShoppingListStub;
    let Location;
    let ProductActions;
    let watchActionSpy;
    let setAndWatchSpy;
    let processSpy;
    let dispatchStub;
    let processEvent;
    let anaConstants;
    let profileApi;
    let urlUtil;
    let userUtils;

    beforeEach(() => {
        state = {};
        store = require('Store').default;
        auth = require('utils/Authentication').default;
        Location = require('utils/Location').default;
        Actions = require('Actions').default;
        showShareLinkModalStub = spyOn(Actions, 'showShareLinkModal');
        ViewAllLoves = require('components/RichProfile/ViewAllLoves').default;
        processEvent = require('analytics/processEvent').default;
        anaConstants = require('analytics/constants').default;
        profileApi = require('services/api/profile').default;
        userUtils = require('utils/User').default;
        urlUtil = require('utils/Url').default;
        ProductActions = require('actions/ProductActions').default;

        setAndWatchSpy = spyOn(store, 'setAndWatch');
        watchActionSpy = spyOn(store, 'watchAction');
        dispatchStub = spyOn(store, 'dispatch');
        processSpy = spyOn(processEvent, 'process');

        spyOn(urlUtil, 'redirectTo');
        spyOn(userUtils, 'getProfileId').and.returnValue('1234567');

        const wrapper = shallow(<ViewAllLoves />);
        component = wrapper.instance();

        setStateSpy = spyOn(component, 'setState');
        getLovesFromStoreStub = spyOn(component, 'getLovesFromStore').and.returnValue([]);
    });

    describe('#Ctrlr method', () => {
        beforeEach(() => {
            displayLovesListStub = spyOn(component, 'displayLovesList');
            resetLovesStateStub = spyOn(component, 'resetLovesState');
            checkIfAPICallNeededStub = spyOn(component, 'checkIfAPICallNeeded');
            spyOn(component, 'getTokenFromPathname').and.returnValue('123456');

            spyOn(store, 'getState').and.returnValue({
                loves: {
                    totalPublicLovesListItemsCount: 5,
                    totalLovesListItemsCount: 7,
                    shareLink: 'loveslist/123456'
                },
                user: { profileId: 12345678 }
            });

            activeSkusData = [
                {
                    isActive: true,
                    actionFlags: { isRestrictedCountry: false }
                },
                {
                    isActive: true,
                    actionFlags: { isRestrictedCountry: false }
                },
                {
                    isActive: true,
                    actionFlags: { isRestrictedCountry: false }
                }
            ];
            spyOn(component, 'getActiveSkus').and.returnValue(activeSkusData);
        });

        describe('if public loves page', () => {
            let loves;

            beforeEach(() => {
                state.isPublicLovesList = true;
                spyOn(Location, 'isPublicLovesPage').and.returnValue(true);
                getNextItemsOfLovesListStub = spyOn(component, 'getNextItemsOfLovesList');
                component.componentDidMount();
            });

            it('should set the correct default state', () => {
                expect(component.state).toEqual({
                    totalNotifications: 0,
                    isPublicLovesList: null,
                    token: 0,
                    shareLink: null,
                    APILimit: 100,
                    isLoggedIn: false,
                    isAnonymous: false,
                    lovesDisplayed: [],
                    shouldShowMore: false,
                    displayedCount: 0,
                    currentPage: 1,
                    selectedSortOption: 'recently',
                    trackCode: ''
                });
            });

            it('should get token from URL and call #getNextItemsOfLovesList', () => {
                expect(getNextItemsOfLovesListStub).toHaveBeenCalledWith({
                    token: '123456',
                    isPublicLovesList: true
                });
            });

            it('should set state with public token and isPublicLovesList flag to true', () => {
                expect(setStateSpy).toHaveBeenCalledWith({
                    isPublicLovesList: true,
                    token: '123456'
                });
            });

            it('should set and watch on publicLoves and call #displayLovesList', () => {
                loves = { currentLoves: [{}, {}] };
                expect(setAndWatchSpy).toHaveBeenCalledWith('loves.publicLoves', component, any(Function));
                setAndWatchSpy.calls.first().args[2](loves);
                expect(displayLovesListStub).toHaveBeenCalledWith(loves.currentLoves);
            });

            it('should call #resetLovesState if publicLoves list is null', () => {
                loves = { publicLoves: null };
                expect(setAndWatchSpy).toHaveBeenCalledWith('loves.publicLoves', component, any(Function));
                setAndWatchSpy.calls.first().args[2](loves);
                expect(resetLovesStateStub).toHaveBeenCalled();
            });

            it('#getSortedLovesList should call getNextItemsOfLovesList', () => {
                state.token = '123456';
                component.state = Object.assign({}, state);
                component.getSortedLovesList('recently');
                expect(component.resetLovesState).toHaveBeenCalled();
                expect(getNextItemsOfLovesListStub).toHaveBeenCalledWith({
                    token: '123456',
                    sortBy: 'recently',
                    isPublicLovesList: true,
                    isFirstPage: true
                });
            });

            it('#handleShowMoreClick should call #getLovesFromStoreStub with public loves', () => {
                state.lovesDisplayed = [];
                component.state = Object.assign({}, state);
                component.handleShowMoreClick();
                expect(getLovesFromStoreStub).toHaveBeenCalledWith('publicLoves');
            });

            it('#handleShowMoreClick should set state and call #checkIfAPICallNeeded', () => {
                component.state = Object.assign({}, state);
                component.state.lovesDisplayed = [];
                component.handleShowMoreClick();
                expect(checkIfAPICallNeededStub).toHaveBeenCalledWith(10);
            });
        });

        describe('if private loves page', () => {
            let loves;

            beforeEach(() => {
                state.isPublicLovesList = false;
                spyOn(Location, 'isPublicLovesPage').and.returnValue(false);
                getNextItemsOfLovesListStub = spyOn(component, 'getNextItemsOfLovesList');
                component.componentDidMount();
            });

            it('should watch currentLoves if not isPublicLovesPage', () => {
                expect(setAndWatchSpy).toHaveBeenCalledWith('loves.currentLoves', component, any(Function));
            });

            it('should call #displayLovesList', () => {
                loves = { currentLoves: [{}, {}] };
                setAndWatchSpy.calls.first().args[2](loves);
                expect(displayLovesListStub).toHaveBeenCalledWith(loves.currentLoves);
            });

            it('should call #resetLovesState if currentLoves list is null', () => {
                loves = { currentLoves: null };
                setAndWatchSpy.calls.first().args[2](loves);
                expect(resetLovesStateStub).toHaveBeenCalled();
            });

            it('should call setState if shareLink is updated', () => {
                expect(setAndWatchSpy).toHaveBeenCalledWith('loves.shareLink', component, null, true);
            });

            it('#getSortedLovesList should call getNextItemsOfLovesList', () => {
                state.token = '123456';
                component.state = Object.assign({}, state);
                component.getSortedLovesList('recently');
                expect(component.resetLovesState).toHaveBeenCalled();
                expect(getNextItemsOfLovesListStub).toHaveBeenCalledWith({ sortBy: 'recently', isFirstPage: true });
            });

            it('#handleShowMoreClick should call #getLovesFromStoreStub with current loves', () => {
                state.lovesDisplayed = [];
                component.state = Object.assign({}, state);
                component.handleShowMoreClick();
                expect(getLovesFromStoreStub).toHaveBeenCalledWith('currentLoves');
            });
        });
    });

    it('should watch for sort action on loves list', () => {
        component.componentDidMount();
        expect(watchActionSpy).toHaveBeenCalledWith(ProductActions.TYPES.SELECT_SORT_OPTION, any(Function));
    });

    it('should call requireAuthentication when signInHandler clicked', () => {
        const e = { stopPropagation: function () {} };
        let stopPropagationStub;

        const authStub = spyOn(auth, 'requireAuthentication').and.returnValue({ catch: () => {} });
        // eslint-disable-next-line prefer-const
        stopPropagationStub = spyOn(e, 'stopPropagation');
        component.signInHandler(e);

        expect(stopPropagationStub).toHaveBeenCalled();
        expect(authStub).toHaveBeenCalled();
    });

    it('#resetLovesState should reset the state to defaults', () => {
        component.resetLovesState();
        expect(setStateSpy).toHaveBeenCalledWith({
            lovesDisplayed: [],
            displayedCount: 0,
            shouldShowMore: false,
            currentPage: 1
        });
    });

    it('#checkIfAPICallNeeded should #getNextItemsOfLovesList', () => {
        // Arrange
        component.state = {
            ...state,
            displayedCount: 100,
            APILimit: 100,
            totalLovesListItemsCount: 130,
            isPublicLovesList: true,
            selectedSortOption: 'recently',
            token: '123456'
        };
        getNextItemsOfLovesListStub = spyOn(component, 'getNextItemsOfLovesList');

        // Act
        component.checkIfAPICallNeeded(100);

        // Assert
        expect(getNextItemsOfLovesListStub).toHaveBeenCalledWith({
            token: '123456',
            sortBy: 'recently',
            isPublicLovesList: true
        });
    });

    describe('#launchLovesShareModal should dispatch showShareLinkModal action', () => {
        beforeEach(() => {
            showShareLinkModalStub.and.returnValue('null');
            component.state.shareLink = 'shareLink';
            component.launchLovesShareModal();
        });

        it('should dispatch an action showShareLinkModalStub', () => {
            expect(dispatchStub).toHaveBeenCalledWith('null');
        });

        it('should show share loves link Modal', () => {
            expect(showShareLinkModalStub).toHaveBeenCalledWith(
                true,
                'your loves',
                `${component.state.shareLink}?om_mmc=share-your-loves`,
                'Copy the following link and share it with friends:'
            );
        });

        it('should fire event of lists-share your loves', function () {
            expect(processSpy).toHaveBeenCalledWith(anaConstants.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: 'user profile:lists-share your loves:n/a:*',
                    pageDetail: 'lists-share your loves',
                    pageType: anaConstants.PAGE_TYPES.USER_PROFILE
                }
            });
        });
    });

    describe('#handleSortOptionChange should update state and call #getSortedLovesList', () => {
        beforeEach(() => {
            component = new ViewAllLoves({});
        });

        it('should update selectedSortOption property in state', () => {
            // Arrange
            state = { trackCode: null };
            const code = 'recently';
            let newState;
            const expectedState = { trackCode: code, selectedSortOption: code };
            spyOn(component, 'setState').and.callFake(getNewState => {
                newState = getNewState(state);
            });

            // Act
            component.handleSortOptionChange(code);

            // Assert
            expect(newState).toEqual(expectedState);
        });

        it('should call #getSortedLovesList with the sort option selected', () => {
            // Arrange
            const code = 'recently';
            spyOn(component, 'setState').and.callFake((_, callback) => callback());
            getSortedLovesListStub = spyOn(component, 'getSortedLovesList');

            // Act
            component.handleSortOptionChange(code);

            // Assert
            expect(getSortedLovesListStub).toHaveBeenCalledWith(code);
        });

        it('should fire event of handleSortOptionChange', function () {
            // Arrange
            const code = 'recently';
            spyOn(component, 'setState').and.callFake((_, callback) => callback());
            spyOn(component, 'getSortedLovesList');
            digitalData.page.attributes.sephoraPageInfo.pageName = 'digitalData.page.attributes.sephoraPageInfo.pageName';
            digitalData.page.pageInfo.pageName = 'digitalData.page.pageInfo.pageName';
            digitalData.page.category.pageType = 'digitalData.page.category.pageType';

            // Act
            component.handleSortOptionChange(code);

            // Assert
            expect(processSpy).toHaveBeenCalledWith(anaConstants.ASYNC_PAGE_LOAD, {
                data: {
                    pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
                    pageDetail: digitalData.page.pageInfo.pageName,
                    pageType: digitalData.page.category.pageType,
                    categoryFilters: [`sortby=${code}`]
                }
            });
        });
    });

    it('#getNextItemsOfLovesList should call #getShoppingList and update APILimit', done => {
        const options = { isPublicLovesList: true };

        state = {
            APILimit: 100,
            lovesDisplayed: []
        };
        component.state = Object.assign({}, state);
        dispatchUpdatedLovesStub = spyOn(component, 'dispatchUpdatedLoves');
        getShoppingListStub = spyOn(profileApi, 'getShoppingList');

        const fakePromise = {
            then: function (resolve) {
                resolve({ shoppingListItems: [] });

                expect(dispatchUpdatedLovesStub).toHaveBeenCalledTimes(1);
                expect(dispatchUpdatedLovesStub).toHaveBeenCalledWith([], { shoppingListItems: [] });

                expect(setStateSpy).toHaveBeenCalledTimes(1);
                expect(setStateSpy).toHaveBeenCalledWith({ currentPage: 2, shouldShowMore: false, APILimit: 200 });

                done();

                return fakePromise;
            },
            catch: function () {
                return function () {};
            }
        };

        getShoppingListStub.and.returnValue(fakePromise);

        component.getNextItemsOfLovesList(options);
        expect(getShoppingListStub).toHaveBeenCalledTimes(1);
    });

    it('#getNextItemsOfLovesList should redirect to shopping-list on API failure', done => {
        const options = { isPublicLovesList: true };

        state.lovesDisplayed = [];
        component.state = Object.assign({}, state);
        getShoppingListStub = spyOn(profileApi, 'getShoppingList');

        const fakePromise = {
            then: function () {
                return fakePromise;
            },
            catch: function (reject) {
                reject();
                expect(urlUtil.redirectTo).toHaveBeenCalledWith('/shopping-list');
                done();

                return fakePromise;
            }
        };

        getShoppingListStub.and.returnValue(fakePromise);
        component.getNextItemsOfLovesList(options);
    });

    it('Test data-at attributes should render data-at attribute set to "loves_page_product_container"', () => {
        // Arrange
        const wrapper = shallow(<ViewAllLoves />);

        // Act
        const dataAt = wrapper.findWhere(n => n.prop('data-at') === 'loves_page_product_container');

        // Assert
        expect(dataAt.length).toEqual(1);
    });
});
