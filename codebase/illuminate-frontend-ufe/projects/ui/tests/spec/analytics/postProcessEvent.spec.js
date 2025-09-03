describe('PostProcessEvent', () => {
    let postProcessEvent;
    let anaConsts;
    let anaUtils;
    let fireEventForTMSStub;

    beforeEach(() => {
        jasmine.clock().install();
        postProcessEvent = require('analytics/postProcessEvent').default;
        anaConsts = require('analytics/constants').default;
        anaUtils = require('analytics/utils').default;
        fireEventForTMSStub = spyOn(anaUtils, 'fireEventForTagManager');
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    describe('For Category Pages', () => {
        let fireDoubelClickCategoryEventStub;

        beforeEach(() => {
            digitalData.page.category.pageType = anaConsts.PAGE_TYPES.ROOTCATEGORY;
            fireDoubelClickCategoryEventStub = fireEventForTMSStub.and.returnValue(anaConsts.DOUBLE_CLICK_CATEGORY_PAGE);
        });

        it('should fire Double Click Category Page event after 3 secs on PageLoad', () => {
            postProcessEvent(anaConsts.PAGE_LOAD);
            jasmine.clock().tick(3001);
            expect(fireDoubelClickCategoryEventStub).toHaveBeenCalled();
        });
    });
});
