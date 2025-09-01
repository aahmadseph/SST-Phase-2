describe('Cookies utils', () => {
    const CookieUtils = require('utils/Cookies').default;

    describe('Read', () => {
        it('should return the correct cookie value', () => {
            // Arrange
            document.cookie = 'cookie1=value1';

            // Act
            const cookieValue = CookieUtils.read('cookie1');

            // Assert
            expect(cookieValue).toEqual('value1');
        });

        it('should return the correct cookie value with the presence of an equal sign', () => {
            // Arrange
            document.cookie = 'cookie1="value1="';

            // Act
            const cookieValue = CookieUtils.read('cookie1');

            // Assert
            expect(cookieValue).toEqual('"value1="');
        });
    });
});
