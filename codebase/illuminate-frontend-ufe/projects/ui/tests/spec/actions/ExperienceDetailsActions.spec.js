describe('ExperienceDetailsActions', () => {
    const Actions = require('actions/ExperienceDetailsActions').default;
    let result;

    describe('showMoreStoresOnMap', () => {
        const stores = [{}];

        beforeEach(() => {
            result = Actions.showMoreStoresOnMap(stores);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.SHOW_MORE_STORES_ON_MAP);
        });

        it('should set the stores', () => {
            expect(result.stores).toEqual(stores);
        });
    });

    describe('openInfoWindow', () => {
        const storeId = 1;

        beforeEach(() => {
            result = Actions.openInfoWindow(storeId);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.OPEN_INFO_WINDOW);
        });

        it('should set the store id', () => {
            expect(result.storeId).toEqual(storeId);
        });
    });
});
