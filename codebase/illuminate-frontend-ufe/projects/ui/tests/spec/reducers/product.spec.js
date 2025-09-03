const productReducer = require('reducers/product').default;
const TYPES = require('reducers/product').default.ACTION_TYPES;

// TODO add coverage for remaining action times not covered in UBS-1731
describe('product reducers', () => {
    describe('action without type', () => {
        it('should return correct initial state', () => {
            const result = productReducer(undefined, {});
            expect(result).toEqual({
                currentSku: null,
                currentSkuQuantity: 1,
                currentProductUserSpecificDetails: {},
                isUserSpecificReady: false
            });
        });
    });

    describe('action with type', () => {
        it('should return correct state for reset current product action', () => {
            Sephora.productPage = {};
            const currentSku = { skuId: 'someId' };
            // Arrange
            const action = {
                type: TYPES.SET_PRODUCT,
                payload: {
                    currentProductUserSpecificDetails: {},
                    currentSku: {},
                    currentSkuQuantity: 1,
                    isUserSpecificReady: true,
                    product: {
                        brand: 'Fenty',
                        currentSku: currentSku
                    }
                }
            };

            // Act
            const result = productReducer(undefined, action);

            // Assert
            expect(result).toEqual({
                brand: 'Fenty',
                currentProductUserSpecificDetails: {},
                currentSku: currentSku,
                currentSkuQuantity: 1,
                isUserSpecificReady: false
            });
        });

        it('should return correct state for update current sku in product action', () => {
            // Arrange
            const currentSku = { skuId: 123 };
            const actionInfo = {
                type: TYPES.UPDATE_CURRENT_SKU_IN_CURRENT_PRODUCT,
                payload: { currentSku }
            };
            const newState = {
                currentSku,
                currentSkuQuantity: 1,
                currentProductUserSpecificDetails: {},
                isUserSpecificReady: false
            };

            // Act
            const result = productReducer(undefined, actionInfo);

            // Assert
            expect(result).toEqual(newState);
        });

        it('should return correct state for toggle custom sets action', () => {
            const actionInfo = {
                type: TYPES.TOGGLE_CUSTOM_SETS,
                isOpen: true
            };
            const result = productReducer(undefined, actionInfo);
            expect(result).toEqual({
                currentSku: null,
                currentSkuQuantity: 1,
                currentProductUserSpecificDetails: {},
                isUserSpecificReady: false,
                isOpenCustomSets: true
            });
        });
    });
});
