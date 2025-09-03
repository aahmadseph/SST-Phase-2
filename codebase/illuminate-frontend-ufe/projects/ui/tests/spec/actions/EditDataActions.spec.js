describe('EditData actions', () => {
    const actions = require('actions/EditDataActions').default;
    let result;

    describe('updateEditData', () => {
        const name = 'my name';
        const data = { myDataKey: 'my data value' };

        beforeEach(() => {
            result = actions.updateEditData(data, name);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(actions.TYPES.UPDATE_EDIT_ORDER_DATA);
        });

        it('should update the data', () => {
            expect(result.data).toEqual(data);
        });

        it('should update the name', () => {
            expect(result.name).toEqual(name);
        });
    });

    describe('clearEditData', () => {
        const myName = 'my name';

        beforeEach(() => {
            result = actions.clearEditData(myName);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(actions.TYPES.CLEAR_EDIT_DATA);
        });

        it('should create an action to CLEAR_EDIT_DATA', () => {
            expect(result.name).toEqual(myName);
        });
    });
});
