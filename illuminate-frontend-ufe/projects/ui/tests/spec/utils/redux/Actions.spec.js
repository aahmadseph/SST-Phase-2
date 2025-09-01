const { merge } = require('utils/redux/Actions').default;

describe('Merge action creator', () => {
    it('should create action of correct type and shape', () => {
        // Arrange
        const reducerName = 'basket';
        const propertyName = 'key';
        const propertyValue = ['value'];
        const expectedAction = {
            type: `${reducerName}_MERGE`,
            payload: {
                key: propertyName,
                value: propertyValue
            }
        };

        // Act
        const action = merge(reducerName, propertyName, propertyValue);

        // Assert
        expect(action).toEqual(expectedAction);
    });
});
