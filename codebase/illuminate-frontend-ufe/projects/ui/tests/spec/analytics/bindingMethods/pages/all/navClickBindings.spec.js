describe('navClickBindings', () => {
    let navClickBindings;
    let utils;
    let buildNavPathStub;
    let removeUndefinedItemsStub;
    let arrayItemsToLowerCaseStub;
    let setNextPageDataStub;

    beforeEach(() => {
        utils = require('analytics/utils').default;
        navClickBindings = require('analytics/bindingMethods/pages/all/navClickBindings').default;
        buildNavPathStub = spyOn(utils, 'buildNavPath').and.returnValue('new path');
        removeUndefinedItemsStub = spyOn(utils, 'removeUndefinedItems');
        arrayItemsToLowerCaseStub = spyOn(utils, 'arrayItemsToLowerCase');
        setNextPageDataStub = spyOn(utils, 'setNextPageData');
    });

    describe('trackNavClick', () => {
        it('should remove undefined items', () => {
            navClickBindings.trackNavClick(['a', undefined, 'b']);
            expect(removeUndefinedItemsStub).toHaveBeenCalledTimes(1);
        });

        it('should lowercase the items', () => {
            navClickBindings.trackNavClick(['A', 'b']);
            expect(arrayItemsToLowerCaseStub).toHaveBeenCalledTimes(1);
        });

        it('should build the tracking correctly with navigation info', () => {
            navClickBindings.trackNavClick(['a', 'b']);
            expect(buildNavPathStub).toHaveBeenCalledTimes(1);
        });

        it('should call setNextPageDataStub with correct args', () => {
            navClickBindings.trackNavClick(['A', undefined, 'b']);
            expect(setNextPageDataStub).toHaveBeenCalledWith({ navigationInfo: 'new path' });
        });
    });
});
