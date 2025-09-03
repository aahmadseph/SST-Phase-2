const { arrayContaining, clock, createSpy } = jasmine;
const PageTemplateType = require('constants/PageTemplateType').default;

describe('OpenPageAction', () => {
    let actionInfo;
    let LazyLoadService;
    let OpenPageActionCreator;
    let ProcessEvent;
    let PromisesUtils;
    let SpaUtils;
    let SkuUtils;
    let TestTargetUtils;
    let UI;
    let storeState;
    let replaceContentAreaTargetersSpy;
    let store;
    let InflatorComps;

    beforeEach(() => {
        actionInfo = require('actions/framework/openOrUpdatePage/actionInfo').default;
        LazyLoadService = require('utils/framework/LazyLoad').default.LazyLoaderInstance;
        OpenPageActionCreator = require('actions/framework/openOrUpdatePage/openOrUpdatePage').default;
        ProcessEvent = require('analytics/processEvent').default;
        PromisesUtils = require('analytics/promisesUtils').default;
        SpaUtils = require('utils/Spa').default;
        SkuUtils = require('utils/Sku').default;
        TestTargetUtils = require('utils/TestTarget').default;
        UI = require('utils/UI').default;
        store = require('Store').default;
        InflatorComps = require('utils/framework/InflateComponents').default;

        spyOn(store, 'dispatch');
        storeState = {
            testTarget: { readyState: 0 },
            page: {
                templateInformation: { template: PageTemplateType.ProductPage },
                product: { someId: 1 }
            }
        };
        InflatorComps.services = {
            UserInfo: {
                data: {
                    profile: {
                        profileStatus: 0
                    },
                    basket: {}
                }
            },
            loadEvents: {}
        };
        replaceContentAreaTargetersSpy = spyOn(SpaUtils, 'replaceContentAreaTargeters');
        window.pageInfo = {};
        Sephora.renderedData.template = PageTemplateType.ProductPage;
        Sephora.productPage = { defaultSkuId: '123' };
        clock().install();
    });

    afterEach(() => {
        clock().uninstall();
    });

    it('should return immediately when request for the same URL is queued already', () => {
        // Arrange
        const createPageActionTuple = spyOn(actionInfo, 'createPageActionTuple').and.returnValue([false, null]);
        const newLocation = {
            queryParams: '',
            path: '/product/2'
        };
        const previousLocation = {
            queryParams: '',
            path: '/product/2'
        };
        const dispatch = () => {};

        // Act
        OpenPageActionCreator.openOrUpdatePage(newLocation, previousLocation)(dispatch);
        OpenPageActionCreator.openOrUpdatePage(newLocation, previousLocation)(dispatch);
        OpenPageActionCreator.openOrUpdatePage(newLocation, previousLocation)(dispatch);

        // Assert
        expect(createPageActionTuple).not.toHaveBeenCalled();
    });

    it('should create action for each new unique URL', () => {
        // Arrange
        const createPageActionTuple = spyOn(actionInfo, 'createPageActionTuple').and.returnValue([false, null]);
        const locationOne = {
            path: '/product/cream-lip-stain-liquid-lipstick-P281411',
            queryParams: ''
        };
        const previousLocationOne = {
            queryParams: '',
            path: '/product/rouge-lacquer-P443336'
        };
        const locationTwo = {
            path: '/product/cream-lip-stain-liquid-lipstick-P281411',
            queryParams: ''
        };
        const previousLocationTwo = {
            path: '/product/cream-lip-stain-liquid-lipstick-P281411',
            queryParams: ''
        };
        const locationThree = {
            path: '/shop/shampoo-sulfate-free-shampoo',
            queryParams: ''
        };
        const previousLocationThree = {
            path: '/product/cream-lip-stain-liquid-lipstick-P281411',
            queryParams: ''
        };
        const dispatch = () => {};

        // Act
        OpenPageActionCreator.openOrUpdatePage(locationOne, previousLocationOne)(dispatch);
        OpenPageActionCreator.openOrUpdatePage(locationTwo, previousLocationTwo)(dispatch);
        OpenPageActionCreator.openOrUpdatePage(locationThree, previousLocationThree)(dispatch);

        // Assert
        expect(createPageActionTuple).toHaveBeenCalledTimes(2);
    });

    it('should abort previous API call if it is not completed when new arrives', () => {
        // Arrange
        const abort = createSpy('abort');
        spyOn(actionInfo, 'createPageActionTuple').and.callFake(({ requestConfig }) => {
            requestConfig.abortController = { abort };

            return [false, null];
        });
        const locationOne = {
            path: '/product/cream-lip-stain-liquid-lipstick-P281411',
            queryParams: ''
        };
        const previousLocationOne = {
            queryParams: '',
            path: '/product/rouge-lacquer-P443336'
        };
        const locationTwo = {
            path: '/shop/shampoo-sulfate-free-shampoo',
            queryParams: ''
        };
        const previousLocationTwo = {
            path: '/product/cream-lip-stain-liquid-lipstick-P281411',
            queryParams: ''
        };
        const dispatch = () => {};

        // Act
        OpenPageActionCreator.openOrUpdatePage(locationOne, previousLocationOne)(dispatch);
        OpenPageActionCreator.openOrUpdatePage(locationTwo, previousLocationTwo)(dispatch);

        // Assert
        expect(abort).toHaveBeenCalled();
    });

    it('should reset analytics promises', () => {
        // Arrange
        const resetPromises = spyOn(PromisesUtils, 'resetPromises');
        const location = {
            path: '/product/rouge-lacquer-P443336',
            queryParams: ''
        };
        const previousLocation = {
            path: '/product/cream-lip-stain-liquid-lipstick-P281411',
            queryParams: ''
        };
        const dispatch = () => {};

        // Act
        OpenPageActionCreator.openOrUpdatePage(location, previousLocation)(dispatch);

        // Assert
        expect(resetPromises).toHaveBeenCalledWith(Sephora.analytics);
    });

    it('should not scroll page to top when onDataLoaded callback fired', () => {
        // Arrange
        const location = {
            queryParams: '',
            path: 'path/'
        };
        const scrollToTop = spyOn(UI, 'scrollToTop');
        spyOn(TestTargetUtils, 'extractMboxParams');
        const dispatch = () => {};
        const getState = createSpy('getState').and.returnValue({ page: { templateInformation: {} } });

        // Act
        OpenPageActionCreator.openOrUpdatePage(location, location, false)(dispatch);
        OpenPageActionCreator.onDataLoaded()(dispatch, getState);

        // Assert
        expect(scrollToTop).not.toHaveBeenCalled();
    });

    it('should scroll page to top when onDataLoaded callback fired', () => {
        // Arrange
        spyOn(TestTargetUtils, 'extractMboxParams');
        const location = {
            queryParams: '',
            path: 'path/'
        };
        const scrollToTop = spyOn(UI, 'scrollToTop');
        const dispatch = () => {};
        const getState = createSpy('getState').and.returnValue({ page: { templateInformation: {} } });

        // Act
        OpenPageActionCreator.openOrUpdatePage(location, location, true)(dispatch);
        OpenPageActionCreator.onDataLoaded()(dispatch, getState);

        // Assert
        expect(scrollToTop).toHaveBeenCalledTimes(1);
    });

    it('should begin lazy load reset process when onDataLoaded callback fired', () => {
        // Arrange
        spyOn(TestTargetUtils, 'extractMboxParams');
        const beginReset = spyOn(LazyLoadService, 'beginReset');
        const dispatch = () => {};
        const getState = createSpy('getState').and.returnValue({ page: { templateInformation: {} } });

        // Act
        OpenPageActionCreator.onDataLoaded()(dispatch, getState);

        // Assert
        expect(beginReset).toHaveBeenCalledTimes(1);
    });

    it('should invoke replaceContentAreaTargeters when onDataLoaded callback fired', () => {
        // Arrange
        spyOn(store, 'getState').and.returnValue(storeState);
        spyOn(SpaUtils, 'getSpaTemplateInfoByTemplate').and.returnValue({ pageName: 'product' });
        const newData = { someData: 1 };
        const dispatch = () => {};
        const getState = createSpy('getState').and.returnValue({
            page: {
                product: storeState.page.product,
                templateInformation: {}
            }
        });

        // Act
        OpenPageActionCreator.onDataLoaded(newData)(dispatch, getState);

        // Assert
        expect(replaceContentAreaTargetersSpy).toHaveBeenCalledWith(storeState.page.product, newData);
    });

    it('should set mboxAttrs when onDataLoaded callback fired', () => {
        // Arrange
        const mboxAttrs = { someParam: 1 };
        spyOn(TestTargetUtils, 'extractMboxParams').and.returnValue(mboxAttrs);
        const dispatch = () => {};
        const getState = createSpy('getState').and.returnValue({ page: { templateInformation: {} } });

        // Act
        OpenPageActionCreator.onDataLoaded()(dispatch, getState);

        // Assert
        expect(Sephora.mboxAttrs).toEqual(mboxAttrs);
    });

    it('should stop lazy load reset process when onError callback fired', () => {
        // Arrange
        const endReset = spyOn(LazyLoadService, 'endReset');
        const dispatch = () => {};

        // Act
        OpenPageActionCreator.onError()(dispatch);

        // Assert
        expect(endReset).toHaveBeenCalledTimes(1);
    });

    it('should stop lazy load reset process when onPageUpdated callback fired', () => {
        // Arrange
        const endReset = spyOn(LazyLoadService, 'endReset');
        spyOn(SpaUtils, 'resetTestAndTarget');
        const data = { payload: 'payload' };
        const callback = () => {};
        const dispatch = () => {};
        const getState = createSpy('getState').and.returnValue({ testTarget: {} });

        // Act
        OpenPageActionCreator.onPageUpdated(data, callback)(dispatch, getState);
        clock().tick(20);

        // Assert
        expect(endReset).toHaveBeenCalledTimes(1);
    });

    it('should reset DigitalData', () => {
        // Arrange
        const resetDigitalData = spyOn(SpaUtils, 'resetDigitalData');
        const location = {
            path: '/product/rouge-lacquer-P443336',
            queryParams: ''
        };
        const previousLocation = {
            path: '/product/cream-lip-stain-liquid-lipstick-P281411',
            queryParams: ''
        };
        const dispatch = () => {};

        // Act
        OpenPageActionCreator.openOrUpdatePage(location, previousLocation)(dispatch);

        // Assert
        expect(resetDigitalData).toHaveBeenCalled();
    });

    it('should invoke "spaUtils.updateUserFull" after reloading page component', () => {
        // Arrange
        const updateUserFull = spyOn(SpaUtils, 'updateUserFull');
        spyOn(SpaUtils, 'resetTestAndTarget');
        const productData = {};
        spyOn(SkuUtils, 'getProductPageData').and.returnValue(productData);
        const data = { payload: 'payload' };
        const callback = () => {};
        const dispatch = () => {};
        const getState = createSpy('getState').and.returnValue({ testTarget: {} });

        // Act
        OpenPageActionCreator.onPageUpdated(data, callback)(dispatch, getState);
        clock().tick(20);

        // Assert
        expect(updateUserFull).toHaveBeenCalledWith(data, productData, { hideLoader: true });
    });

    it('should invoke "spaUtils.updateHeaderTags" after reloading page component', () => {
        // Arrange
        const updateHeaderTags = spyOn(SpaUtils, 'updateHeaderTags');
        spyOn(SpaUtils, 'resetTestAndTarget');
        const data = { payload: 'payload' };
        const callback = () => {};
        const dispatch = () => {};
        const getState = createSpy('getState').and.returnValue({ testTarget: {} });

        // Act
        OpenPageActionCreator.onPageUpdated(data, callback)(dispatch, getState);
        clock().tick(20);

        // Assert
        expect(updateHeaderTags).toHaveBeenCalledWith(data);
    });

    it('should invoke "spaUtils.resetTestAndTarget" after reloading page component', () => {
        // Arrange
        const resetTestAndTarget = spyOn(SpaUtils, 'resetTestAndTarget');
        const data = { payload: 'payload' };
        const callback = () => {};
        const dispatch = () => {};
        const state = { testTarget: {} };
        const getState = createSpy('getState').and.returnValue(state);

        // Act
        OpenPageActionCreator.onPageUpdated(data, callback)(dispatch, getState);
        clock().tick(20);

        // Assert
        expect(resetTestAndTarget).toHaveBeenCalledTimes(1);
    });

    it('should invoke "spaUtils.resetTestAndTarget" after reloading page component with correct arguments', () => {
        // Arrange
        const resetTestAndTarget = spyOn(SpaUtils, 'resetTestAndTarget');
        const data = { payload: 'payload' };
        const callback = () => {};
        const dispatch = () => {};
        const state = { testTarget: {} };
        const getState = createSpy('getState').and.returnValue(state);

        // Act
        OpenPageActionCreator.onPageUpdated(data, callback)(dispatch, getState);
        clock().tick(20);

        // Assert
        expect(resetTestAndTarget).toHaveBeenCalledWith(state.testTarget);
    });

    it('should reset some "digitalData" fields after reloading page component', () => {
        // Arrange
        spyOn(SpaUtils, 'resetTestAndTarget');
        window.pageInfo.pageURL = 'www';
        Sephora.analytics.initialLoadDependencies = [''];
        const emptyArray = [];
        const data = { payload: 'payload' };
        const callback = () => {};
        const dispatch = () => {};
        const getState = () => ({ testTarget: {} });

        // Act
        OpenPageActionCreator.onPageUpdated(data, callback)(dispatch, getState);
        clock().tick(20);

        // Assert
        expect(digitalData.page.pageInfo.referringURL).toEqual(window.pageInfo.pageURL);
        expect(Sephora.analytics.initialLoadDependencies).toEqual(arrayContaining(emptyArray));
    });

    it('should trigger analytics', () => {
        // Arrange
        spyOn(SpaUtils, 'resetTestAndTarget');
        const process = spyOn(ProcessEvent, 'process');
        const { PAGE_LOAD } = require('analytics/constants').default;
        const eventArgs = { pageType: Sephora.analytics.backendData.pageType };
        const data = { payload: 'payload' };
        const callback = () => {};
        const dispatch = () => {};
        const getState = () => ({ testTarget: {} });

        // Act
        OpenPageActionCreator.onPageUpdated(data, callback)(dispatch, getState);

        // Assert
        clock().tick(20);
        expect(process).toHaveBeenCalledWith(PAGE_LOAD, eventArgs);
    });
    describe('forceSignIn', () => {
        const newLocation = {
            path: '/product/rouge-lacquer-P443336',
            queryParams: ''
        };
        const previousLocation = {
            path: '/product/cream-lip-stain-liquid-lipstick-P281411',
            queryParams: ''
        };

        beforeEach(() => {
            spyOn(store, 'getState').and.returnValue({
                testTarget: { readyState: 2 },
                page: { templateInformation: {} },
                auth: { profileStatus: 0 }
            });
        });

        it('should call force sign in', () => {
            // Arrange
            const userUtils = require('utils/User').default;
            const forceSignInStub = spyOn(userUtils, 'forceSignIn');
            const dispatch = () => {};

            // Act
            OpenPageActionCreator.openOrUpdatePage(newLocation, previousLocation)(dispatch);

            // Assert
            expect(forceSignInStub).toHaveBeenCalled();
        });
    });
});
