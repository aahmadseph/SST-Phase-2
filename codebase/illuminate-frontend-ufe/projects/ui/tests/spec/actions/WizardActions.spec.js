describe('Wizard Actions', () => {
    const Actions = require('actions/WizardActions').default;
    let result;

    describe('changeCurrentPage', () => {
        const currentPage = 'my currentPage';

        beforeEach(() => {
            result = Actions.changeCurrentPage(currentPage);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.CHANGE_WIZARD_PAGE);
        });

        it('should set the current page', () => {
            expect(result.currentPage).toEqual(currentPage);
        });
    });

    describe('goToNextPage', () => {
        const data = { myKeyTest: 'my data test' };

        beforeEach(() => {
            result = Actions.goToNextPage(data);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.NEXT_WIZARD_PAGE);
        });

        it('should set data item', () => {
            expect(result.dataItem).toEqual(data);
        });
    });

    describe('goToPreviousPage', () => {
        beforeEach(() => {
            result = Actions.goToPreviousPage();
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.PREVIOUS_WIZARD_PAGE);
        });
    });

    describe('setCurrentDataItem', () => {
        const data = { myKeyTest: 'my data test' };

        beforeEach(() => {
            result = Actions.setCurrentDataItem(data);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.SET_WIZARD_CURRENT_DATA_ITEM);
        });

        it('should set data item', () => {
            expect(result.dataItem).toEqual(data);
        });
    });

    describe('clearDataItem', () => {
        beforeEach(() => {
            result = Actions.clearDataItem();
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.CLEAR_WIZARD_DATA_ITEM);
        });
    });

    describe('setResult', () => {
        const data = { myKeyTest: 'my data test' };

        beforeEach(() => {
            result = Actions.setResult(data);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.SET_WIZARD_RESULT);
        });

        it('should set data', () => {
            expect(result.data).toEqual(data);
        });
    });

    describe('clearResult', () => {
        beforeEach(() => {
            result = Actions.clearResult();
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.CLEAR_WIZARD_RESULT);
        });
    });
});
