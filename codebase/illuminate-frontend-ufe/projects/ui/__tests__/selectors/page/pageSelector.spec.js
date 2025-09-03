import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

describe('".page" selector', () => {
    test('should return data from Redux state for ".page" field', () => {
        // Arrange
        const reduxState = { page: {} };

        // Act
        const data = pageSelector(reduxState);

        // Assert
        expect(data).toStrictEqual(reduxState.page);
    });

    test('should return "Empty.Object" when field ".page" does not exist', () => {
        // Arrange
        const reduxState = {};

        // Act
        const data = pageSelector(reduxState);

        // Assert
        expect(data).toStrictEqual(Empty.Object);
    });
});
