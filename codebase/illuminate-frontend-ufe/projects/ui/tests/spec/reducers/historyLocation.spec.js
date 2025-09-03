describe('historyLocation reducer', function () {
    const historyLocationReducer = require('reducers/framework/historyLocation').default;

    describe('action wo/ type', function () {
        it('should return correct initial state', function () {
            const result = historyLocationReducer(undefined, {});
            expect(result).toEqual({
                path: null,
                queryParams: null,
                anchor: null
            });
        });
    });

    describe('action w/ type eq update-current-location', function () {
        it('should pick correct props from location', function () {
            const result = historyLocationReducer(undefined, {
                type: 'update-current-location',
                location: {
                    a: 1,
                    b: 2,
                    c: 3,
                    path: 'path',
                    prevPath: 'somePrevPath',
                    queryParams: 'queryParams'
                }
            });
            expect(result).toEqual({
                path: 'path',
                queryParams: 'queryParams',
                prevPath: 'somePrevPath',
                anchor: undefined
            });
        });
    });
});
