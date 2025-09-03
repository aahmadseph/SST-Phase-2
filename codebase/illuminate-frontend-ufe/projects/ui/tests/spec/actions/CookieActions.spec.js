describe('Cookie actions', () => {
    const actions = require('actions/CookieActions').default;

    describe('setCookie action', () => {
        it('should return passed data along with action type', () => {
            const result = actions.setCookie('test', '2', 1, false);
            expect(result).toEqual({
                type: actions.TYPES.SET_COOKIE,
                name: 'test',
                value: '2',
                days: 1,
                top: false
            });
        });
    });

    describe('deleteCookie action', () => {
        it('should return passed data along with action type', () => {
            const result = actions.deleteCookie('test');
            expect(result).toEqual({
                type: actions.TYPES.DELETE_COOKIE,
                cookie: 'test'
            });
        });
    });

    describe('deleteCookie action', () => {
        it('should return passed data along with action type', () => {
            // prettier-ignore
            const cookies = { 'site_locale': 'US' };
            const result = actions.setAllCookies(cookies);
            expect(result).toEqual({
                type: actions.TYPES.SET_ALL_COOKIES,
                cookies
            });
        });
    });
});
