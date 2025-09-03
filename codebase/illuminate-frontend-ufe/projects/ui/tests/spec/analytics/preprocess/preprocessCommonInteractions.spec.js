describe('Preprocess Common Interactions', function () {
    const { any } = jasmine;
    let preprocessCommonInteractions;
    let processEvent;
    let processStub;
    let anaUtils;
    let anaConsts;
    let currentEventData;

    beforeEach(() => {
        anaUtils = require('analytics/utils').default;
        preprocessCommonInteractions = require('analytics/preprocess/preprocessCommonInteractions').default;
        anaConsts = require('analytics/constants').default;
        processEvent = require('analytics/processEvent').default;
        processStub = spyOn(processEvent, 'process');
        currentEventData = {
            pageName: 'pageName',
            previousPage: 'previousPage',
            pageType: 'pageType',
            pageDetail: 'pageDetail'
        };
        spyOn(anaUtils, 'getLastAsyncPageLoadData').and.returnValue(currentEventData);
    });

    describe('for Quicklook', () => {
        it('should call process event with correct args', () => {
            const quickLookInteraction = require('analytics/bindings/pages/all/quickLookInteraction').default;
            const data = { context: anaConsts.CONTEXT.QUICK_LOOK };
            const expectedData = {
                ...data,
                ...currentEventData,
                bindingMethods: [quickLookInteraction]
            };
            preprocessCommonInteractions(data);
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, { data: expectedData });
        });
    });

    describe('for Basket Samples', () => {
        it('should call process event with correct args', () => {
            const addSampleToBasket = require('analytics/bindings/pages/basket/addSampleToBasket').default;
            const data = { context: anaConsts.CONTEXT.BASKET_SAMPLES };
            const expectedData = {
                ...data,
                ...currentEventData,
                bindingMethods: [addSampleToBasket]
            };
            preprocessCommonInteractions(data);
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, { data: expectedData });
        });
    });

    describe('for Basket Rewards', () => {
        it('should call process event with correct args', () => {
            const addRewardToBasket = require('analytics/bindings/pages/basket/addRewardToBasket').default;
            const data = { context: anaConsts.CONTEXT.BASKET_REWARDS };
            const expectedData = {
                ...data,
                ...currentEventData,
                bindingMethods: [addRewardToBasket]
            };
            preprocessCommonInteractions(data);
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, { data: expectedData });
        });
    });

    describe('for Basket Loves', () => {
        it('should call process event with correct args', () => {
            const data = { context: anaConsts.CONTEXT.BASKET_LOVES };
            const expectedData = {
                ...data,
                ...currentEventData,
                bindingMethods: any(Function)
            };
            preprocessCommonInteractions(data);
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, { data: expectedData });
        });
    });

    describe('for Replen Product', () => {
        it('should call process event with correct args', () => {
            const addReplenProduct = require('analytics/bindings/pages/basket/addReplenProduct').default;
            const data = { context: anaConsts.CONTEXT.REPLEN_PRODUCT };
            const expectedData = {
                ...data,
                ...currentEventData,
                bindingMethods: [addReplenProduct]
            };
            preprocessCommonInteractions(data);
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, { data: expectedData });
        });
    });
});
