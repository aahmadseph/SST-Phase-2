/* eslint-disable no-unused-vars */
const apiUtils = require('utils/Api').default;

describe('#request', () => {
    let fetchStub;

    beforeEach(() => {
        fetchStub = spyOn(window, 'fetch');
    });

    describe('/url argument/', () => {
        it('should throw an exception if url argument is omitted', () => {
            expect(() => {
                apiUtils.request({ method: 'tricky' });
            }).toThrow(new Error('Url argument is required!'));
        });

        it('should not alter url if there if qsParams argument is omitted', () => {
            apiUtils.request({
                url: 'http',
                method: 'tricky'
            });

            expect(fetchStub).toHaveBeenCalledWith('http', {
                method: 'tricky',
                body: undefined,
                headers: {}
            });
        });

        it('should turn qsParams argument provided into URI encoded query string and append it to url', () => {
            apiUtils.request({
                url: 'http',
                method: 'tricky',
                qsParams: {
                    'bla bla': 123,
                    'xyz xyz': 222
                }
            });

            // This expectation may break eventually as it depends on
            // for (let key in params) cycle through the provided qsParams.
            // The possible fix then should be refactoring to use native Map
            // js data structure in makeQueryString method
            // of the implementation. There's no enough support for it now
            // in IE. So, holding fingers crossed :)
            expect(fetchStub).toHaveBeenCalledWith('http?bla%20bla=123&xyz%20xyz=222', {
                method: 'tricky',
                body: undefined,
                headers: {}
            });
        });

        it('should turn qsParams nvps with multiple values in to multiples query params in query string append it to url', () => {
            apiUtils.request({
                url: 'http',
                method: 'tricky',
                qsParams: {
                    'bla bla': [333, 666],
                    'xyz xyz': 222
                }
            });

            // This expectation may break eventually as it depends on
            // for (let key in params) cycle through the provided qsParams.
            // The possible fix then should be refactoring to use native Map
            // js data structure in makeQueryString method
            // of the implementation. There's no enough support for it now
            // in IE. So, holding fingers crossed :)
            expect(fetchStub).toHaveBeenCalledWith('http?bla%20bla=333&bla%20bla=666&xyz%20xyz=222', {
                method: 'tricky',
                body: undefined,
                headers: {}
            });
        });
    });

    describe('/params argument/', () => {
        it('should not take params into account when method is other than ' + 'POST (url + method other than POST + params)', () => {
            apiUtils.request({
                url: 'http',
                method: 'tricky',
                params: { a: 123 }
            });

            expect(fetchStub).toHaveBeenCalledWith('http', {
                method: 'tricky',
                body: undefined,
                headers: {}
            });
        });

        it('should treat params as request body when isMultiPart flag is set ' + 'to true (url + POST method + params + isMultiPart true)', () => {
            const theSameObjectByReference = { a: 123 };

            apiUtils.request({
                url: 'http',
                method: 'POST',
                params: { a: 123 },
                isMultiPart: true
            });

            expect(fetchStub).toHaveBeenCalledWith('http', {
                method: 'POST',
                body: { a: 123 },
                headers: {}
            });
        });

        it('should treat params as request body when isMultiPart is false and params is a string', () => {
            const params = 'a=1&b=2';

            apiUtils.request({
                url: 'http',
                method: 'POST',
                params: params,
                isMultiPart: false
            });

            expect(fetchStub).toHaveBeenCalledWith('http', {
                method: 'POST',
                body: params,
                headers: {}
            });
        });

        it(
            'should jsonify params object into request body when isMultiPart ' +
                'flag is set to false and params is not a string' +
                '(url + POST method + params + isMultiPart false)',
            () => {
                apiUtils.request({
                    url: 'http',
                    method: 'POST',
                    params: { a: 123 },
                    isMultiPart: false
                });

                expect(fetchStub).toHaveBeenCalledWith('http', {
                    method: 'POST',
                    body: '{"a":123}',
                    headers: {}
                });
            }
        );

        it('should jsonify params object into request body when isMultiPart ' + 'flag is omitted' + '(url + POST method + params)', () => {
            apiUtils.request({
                url: 'http',
                method: 'POST',
                params: { a: 890 }
            });

            expect(fetchStub).toHaveBeenCalledWith('http', {
                method: 'POST',
                body: '{"a":890}',
                headers: {}
            });
        });

        it('should treat omitted params argument as empty object' + '(url + POST method)', () => {
            apiUtils.request({
                url: 'http',
                method: 'POST'
            });

            expect(fetchStub).toHaveBeenCalledWith('http', {
                method: 'POST',
                body: '{}',
                headers: {}
            });
        });
    });

    describe('/headers/', () => {
        it('should ALWAYS use the provided headers', () => {
            apiUtils.request({
                url: 'http',
                method: 'any',
                headers: {
                    blah: true,
                    'X-Awesome': 'True'
                }
            });

            expect(fetchStub).toHaveBeenCalledWith('http', {
                method: 'any',
                body: undefined,
                headers: {
                    blah: true,
                    'X-Awesome': 'True'
                }
            });
        });

        it('should treat omitted headers argument as an empty object', () => {
            apiUtils.request({
                url: 'http',
                method: 'any'
            });

            expect(fetchStub).toHaveBeenCalledWith('http', {
                method: 'any',
                body: undefined,
                headers: {}
            });
        });
    });

    describe('/method/', () => {
        it('should ALWAYS use the provided request method', () => {
            apiUtils.request({
                url: 'http',
                method: 'tricky'
            });

            expect(fetchStub).toHaveBeenCalledWith('http', {
                method: 'tricky',
                body: undefined,
                headers: {}
            });
        });

        it('should throw an exception if request method is omitted', () => {
            expect(() => {
                apiUtils.request({ url: 'http' });
            }).toThrow(new Error('Method argument is required!'));
        });
    });
});

describe('addRwdHeaders', () => {
    const mockTimestamp = 123456;
    const rwdHeaders = {
        'x-requested-source': 'rwd',
        'x-timestamp': mockTimestamp
    };

    beforeEach(() => {
        spyOn(Date, 'now').and.returnValue(mockTimestamp);
    });

    it('should handle undefined argument', () => {
        expect(apiUtils.addRwdHeaders(undefined)).toEqual(rwdHeaders);
    });

    it('should handle empty object argument', () => {
        expect(apiUtils.addRwdHeaders({})).toEqual(rwdHeaders);
    });

    it('should return all headers passed as arguments', () => {
        const headers = { header1: 'header1' };
        expect(apiUtils.addRwdHeaders(headers)).toEqual({
            ...headers,
            ...rwdHeaders
        });
    });
});
