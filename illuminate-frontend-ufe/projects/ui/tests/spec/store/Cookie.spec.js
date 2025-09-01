/* eslint max-len: [2, 200] */
describe('Cookie middleware', () => {
    let store;
    let actions;
    let cookieUtils;

    beforeEach(() => {
        store = require('store/Store').default;
        actions = require('actions/CookieActions').default;
        cookieUtils = require('utils/Cookies').default;
    });

    it('should call CookieUtils.write with cookie data when setCookie action is dispatched', () => {
        const writeStub = spyOn(cookieUtils, 'write');
        store.dispatch(actions.setCookie('test', '2', 1, false));
        expect(writeStub).toHaveBeenCalledWith('test', '2', 1, false);
    });

    it('should call CookieUtils.delete whit cookie key when deleteCookie action is dispatched', () => {
        const deleteStub = spyOn(cookieUtils, 'delete');
        store.dispatch(actions.deleteCookie('test'));
        expect(deleteStub).toHaveBeenCalledWith('test');
    });
});
