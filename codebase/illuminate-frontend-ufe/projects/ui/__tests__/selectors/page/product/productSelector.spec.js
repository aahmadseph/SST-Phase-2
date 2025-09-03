import { productSelector } from 'selectors/page/product/productSelector';
import Empty from 'constants/empty';

describe('".product" selector', () => {
    test('should return data from Redux state for ".product" field', () => {
        // Arrange
        const reduxState = { product: {} };

        // Act
        const data = productSelector(reduxState);

        // Assert
        expect(data).toStrictEqual(reduxState.product);
    });

    test('should return "Empty.Object" when field ".product" does not exist', () => {
        // Arrange
        const reduxState = {};

        // Act
        const data = productSelector(reduxState);

        // Assert
        expect(data).toStrictEqual(Empty.Object);
    });
});
