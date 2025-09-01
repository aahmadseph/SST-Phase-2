describe('StoreHub Actions', () => {
    const actions = require('actions/StoreHubActions').default;
    let result;

    describe('updateFilteredActivityList', () => {
        beforeEach(() => {
            result = actions.updateFilteredActivityList([]);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(actions.TYPES.UPDATE_FILTERED_ACTIVITIES);
        });

        it('should set type filtered activities', () => {
            expect(result.typeFilteredActivities).toEqual([]);
        });
    });

    describe('updateActivities', () => {
        beforeEach(() => {
            result = actions.updateActivities([{}]);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(actions.TYPES.UPDATE_ACTIVITIES);
        });

        it('should set all activities', () => {
            expect(result.allActivities).toEqual([{}]);
        });
    });

    describe('setNoStoreError', () => {
        beforeEach(() => {
            result = actions.setNoStoreError(true);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(actions.TYPES.TOGGLE_NO_RESULT_ERROR);
        });

        it('should set show error as true', () => {
            expect(result.showError).toBeTruthy();
        });

        it('should set show error as false', () => {
            result = actions.setNoStoreError(false);
            expect(result.showError).toBeFalsy();
        });
    });

    describe('hideFeaturedContent', () => {
        beforeEach(() => {
            result = actions.hideFeaturedContent(true);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(actions.TYPES.HIDE_FEATURED_CONTENT);
        });

        it('should set hide featured content as true', () => {
            expect(result.hideFeaturedContent).toBeTruthy();
        });

        it('should set hide featured content as false', () => {
            result = actions.hideFeaturedContent(false);
            expect(result.hideFeaturedContent).toBeFalsy();
        });
    });

    describe('viewAllClicked', () => {
        beforeEach(() => {
            result = actions.viewAllClicked([{}]);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(actions.TYPES.VIEW_ALL_CLICKED);
        });

        it('should set type filtered activities', () => {
            expect(result.typeFilteredActivities).toEqual([{}]);
        });
    });
});
