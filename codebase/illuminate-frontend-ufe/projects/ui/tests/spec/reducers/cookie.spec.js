/* eslint-disable no-unused-vars */
describe('Cookies reducer', () => {
    let actions;
    let store;
    let reducer;

    beforeEach(() => {
        actions = require('actions/CookieActions').default;
        store = require('store/Store').default;
        reducer = require('reducers/cookies').default;
    });

    it('SET_ALL_COOKIES should set all passed cookies to state', () => {
        // prettier-ignore
        const cookies = {
            'site_locale': 'US',
            'site_language': 'EN',
            'current_country': 'US'
        };
        const initialState = {};
        const newState = reducer(initialState, {
            type: actions.TYPES.SET_ALL_COOKIES,
            cookies
        });

        Object.keys(cookies).forEach(key => {
            expect(Object.prototype.hasOwnProperty.call(newState, key)).toBe(true);
        });
    });

    it('SET_COOKIE should set passed cookie to state', () => {
        const initialState = {};
        const newState = reducer(initialState, {
            type: actions.TYPES.SET_COOKIE,
            name: 'test',
            value: 'true'
        });

        expect(newState['test']).toEqual('true');
    });

    it('DELETE_COOKIE should remove passed cookie from state', () => {
        const initialState = {
            test: 'true',
            locale: 'us'
        };
        const newState = reducer(initialState, {
            type: actions.TYPES.DELETE_COOKIE,
            cookie: 'test'
        });

        expect(newState['test']).toEqual(undefined);
        expect(Object.keys(newState).length).toEqual(1);
    });
});
