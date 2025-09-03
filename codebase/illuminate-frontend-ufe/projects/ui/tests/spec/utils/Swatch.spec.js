/* eslint-disable no-unused-vars */
const historyLocationActions = require('actions/framework/HistoryLocationActions').default;
const store = require('Store').default;
const swatchUtils = require('utils/Swatch').default;

describe('Swatch', () => {
    describe('handleSkuOnClick function', () => {
        it('should dispatch "UPDATE_CURRENT_SKU_IN_CURRENT_PRODUCT" action', done => {
            // Arrange
            const dispatch = spyOn(store, 'dispatch');
            const sku = {};
            const actionStub = spyOn(historyLocationActions, 'goTo').and.returnValue('historyAction');
            // Act
            swatchUtils.handleSkuOnClick(sku);

            // Assert
            setTimeout(() => {
                expect(dispatch).toHaveBeenCalledWith('historyAction');
                done();
            }, 100);
        });
    });
});
