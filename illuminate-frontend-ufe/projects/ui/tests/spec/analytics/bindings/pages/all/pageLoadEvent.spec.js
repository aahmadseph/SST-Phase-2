const pageLoadEvent = require('analytics/bindings/pages/all/pageLoadEvent').default;
const uiUtils = require('utils/UI').default;

describe('pageLoadEvent', () => {
    it('should set "page.attributes.experienceType" to "adaptive web design" for non responsive layout', () => {
        // Arrange
        const experienceType = 'adaptive web design';

        // Act
        pageLoadEvent();

        // Assert
        expect(window.digitalData.page.attributes.experienceType).toBe(experienceType);
    });

    it('should set "page.attributes.experienceType" to "responsive web design" for responsive layout', () => {
        // Arrange
        spyOn(uiUtils, 'isResponsiveLayout').and.returnValue(true);
        const experienceType = 'responsive web design';

        // Act
        pageLoadEvent();

        // Assert
        expect(window.digitalData.page.attributes.experienceType).toBe(experienceType);
    });
});
