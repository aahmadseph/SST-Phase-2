const { getAdServiceParams, getSlotId } = require('utils/rmn').default;
const { objectContaining } = jasmine;

describe('getAdServiceParams', () => {
    it('should return correct object when called', () => {
        // Arrange
        const serviceParams = {
            callAdSvc: true,
            adSvcSlot: getSlotId()
        };

        // Act
        const result = getAdServiceParams();

        // Assert
        expect(result).toEqual(objectContaining(serviceParams));
    });
});
