const tlpPageReducer = require('reducers/page/tlpPage').default;

describe('tlpPage reducer', () => {
    it('should return the initial state', () => {
        expect(tlpPageReducer(undefined, {})).toEqual({});
    });
});
