describe('Address Page Bindings', function () {
    let addressPageBindings;
    let processEvent;
    let processStub;
    let anaUtils;
    let anaConsts;

    beforeEach(() => {
        anaUtils = require('analytics/utils').default;
        addressPageBindings = require('analytics/bindingMethods/pages/myAccount/addressPageBindings').default;
        anaConsts = require('analytics/constants').default;
        processEvent = require('analytics/processEvent').default;
        processStub = spyOn(processEvent, 'process');
    });

    describe('handleAnalyticCallback', () => {
        beforeEach(() => {
            spyOn(anaUtils, 'getLastAsyncPageLoadData').and.returnValue({
                pageName: 'event pageName',
                pageDetail: 'event pageDetail',
                pageType: 'event pageType'
            });
        });

        it('should call process event with correct args', () => {
            const actionInfoStr = 'recommended';
            const expectedData = {
                linkName: 'D=c55',
                actionInfo: `address verification:use ${actionInfoStr} address`,
                eventStrings: [anaConsts.Event.EVENT_71],
                pageName: 'event pageName',
                pageDetail: 'event pageDetail',
                pageType: 'event pageType'
            };
            addressPageBindings.handleAnalyticCallback(actionInfoStr);
            expect(processStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, { data: expectedData });
        });
    });

    describe('handleAnalyticAsyncLoad', () => {
        it('should call process event with correct args', () => {
            digitalData.page.attributes.sephoraPageInfo.pageName = 'previousPageName';
            const expectedData = {
                pageType: 'pageType',
                pageName: 'pageType:pageDetail:n/a:*',
                pageDetail: 'pageDetail',
                previousPageName: 'previousPageName'
            };
            addressPageBindings.handleAnalyticAsyncLoad('pageType', 'pageDetail');
            expect(processStub).toHaveBeenCalledWith(anaConsts.ASYNC_PAGE_LOAD, { data: expectedData });
        });
    });
});
