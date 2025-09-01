import { productCategoriesArraySelector } from 'viewModel/selectors/page/product/productCategoriesArraySelector';
import mockState from '__mocks__/pageData/productPage/cream-lip-stain-liquid-lipstick-P281411_DeliveryOptions.json';

describe('Reusable "productCategoriesArraySelector" selector with business logic', () => {
    let state;

    beforeEach(async () => {
        // Create a deep copy - don't use JSON.parse(JSON.stringify( as it's 2 times slower
        state = window.structuredClone(mockState);
    });

    test('should return expected data structure', () => {
        // Arrange
        const requiredFields = ['Makeup', 'Lip', 'Lipstick'];

        // Act
        const data = productCategoriesArraySelector(state);

        // Assert
        expect(data).toStrictEqual(requiredFields);
    });

    test('should return expected data structure when "parentCategory" field is undefined', () => {
        // Arrange
        state.page.product.parentCategory = undefined;
        const requiredFields = [];

        // Act
        const data = productCategoriesArraySelector(state);

        // Assert
        expect(data).toStrictEqual(requiredFields);
    });
});
