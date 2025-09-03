describe('InlineBasketActions', () => {
    const Actions = require('actions/InlineBasketActions').default;
    let result;

    describe('addedProductsNotification', () => {
        const qty = 3;

        beforeEach(() => {
            result = Actions.addedProductsNotification(qty);
        });

        it('should return the action type', () => {
            expect(result.type).toEqual(Actions.TYPES.ADDED_PRODUCTS_NOTIFICATION);
        });

        it('should set qty of just added products', () => {
            expect(result.justAddedProducts).toEqual(qty);
        });
    });
});
