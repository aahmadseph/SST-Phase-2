/* eslint max-len: [2, 200], class-methods-use-this: 0 */
describe('apiRoutes', () => {

    const http = require('http');

    const baseDir = process.cwd(),
        apiRoutesPath = '#server/services/apiOrchestration/apiRoutes.mjs';

    const responseMockClass = require('#tests/mocks/responseMock.js'),
        requestMock = require('#tests/mocks/requestMock.js');

    let apiRoutes;

    describe('api call passthrough', () => {

        beforeEach(async() => {
            spyOn(http, 'request').and.callFake(() => {
                return new Promise(resolve => {
                    resolve(JSON.stringify({
                        headers: {},
                        data: {}
                    }));
                });
            });
            const res = await import(apiRoutesPath);
            apiRoutes = res;
        });

        it('callAPIGet', (done) => {
            const request = new requestMock({ path: '/catalog/categories/all' }, () => {});
            const responseMock = new responseMockClass();

            responseMock.on('finish', () => {
                expect(responseMock.isFinished).toBeTruthy();
                done();
            });
            apiRoutes.callAPIGet(request, responseMock);
        });

        it('callAPIPost', (done) => {

            const request = new requestMock({ path: '/catalog/categories/all' }, () => {});
            const responseMock = new responseMockClass();

            responseMock.on('finish', () => {
                expect(responseMock.isFinished).toBeTruthy();
                done();
            });
            apiRoutes.callAPIPost(request, responseMock);
        });
    });
});
