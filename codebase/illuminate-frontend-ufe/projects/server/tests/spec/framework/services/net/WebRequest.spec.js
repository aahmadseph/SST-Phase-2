/* eslint class-methods-use-this: 0 */
describe('WebRequest', () => {

    const http = require('http');
    const responseMockClass = require('#tests/mocks/responseMock.js'),
        requestMock = require('#tests/mocks/requestMock.js');

    describe('make http WebRequest', () => {

        describe('http success', () => {
            let webRequest;
            beforeAll(async() => {
                spyOn(http, 'request').and.callFake((options, cb) => {
                    return new requestMock(options, cb);
                });
                const res = await import('#server/framework/services/net/WebRequest.mjs');
                webRequest = res.default;
            });

            it('http get', (done) => {
                const options = {
                    method: 'GET',
                    path: '/v1/someUrl'
                };

                webRequest(false, options).then(results => {
                    expect(results).toBeDefined();
                    done();
                }).catch(e => {
                    console.error(e);
                });
            });
        });

        describe('http error ', () => {
            class errorRequestMock extends requestMock {
                constructor(options = {}, cb) {
                    super(options, cb);
                    this.response = new responseMockClass(Object.assign({}, {
                        statusCode: 500
                    }, options));
                }
            }

            let webRequest;
            beforeAll(async() => {
                spyOn(http, 'request').and.callFake((options, cb) => {
                    return new errorRequestMock(options, cb);
                });
                const res = await import('#server/framework/services/net/WebRequest.mjs?time=123');
                webRequest = res.default;
            });

            it('http error get', (done) => {

                const options = {
                    method: 'GET',
                    path: '/v1/someUrl',
                    timeout: 1000
                };
                webRequest(false, options, undefined).then(results => {
                    console.error(results);
                }).catch(e => {
                    //console.error(e);
                    expect(e).toBeDefined();
                    done();
                });
            });
        });
    });

    // describe('https request ', () => {

    //     let webRequest;
    //     beforeAll(async() => {
    //         spyOn(https, 'request').and.callFake((options, cb) => {
    //             return new requestMock(options, cb);
    //         });
    //         const res = await import('#server/framework/services/net/WebRequest.mjs?time=456');
    //             webRequest = res.default;
    //     });

    //     it('https get', (done) => {

    //         const options = {
    //             method: 'GET',
    //             path: '/v1/someUrl',
    //             timeout: 1000
    //         };

    //         webRequest(true, options).then(results => {
    //             expect(results).toBeDefined();
    //             done();
    //         }).catch(e => {
    //             console.error(e);
    //         });
    //     });

    //     it('https post', (done) => {

    //         const options = {
    //             method: 'POST',
    //             path: '/v1/someUrl',
    //             timeout: 1000
    //         };

    //         webRequest(true, options, JSON.stringify({
    //             pizza: 'yummy',
    //             topings: 'llots'
    //         })).then(results => {
    //             expect(results).toBeDefined();
    //             done();
    //         }).catch(e => {
    //             console.error(e);
    //         });
    //     });
    // });

});
