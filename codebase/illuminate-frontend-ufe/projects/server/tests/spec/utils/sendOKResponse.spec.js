/* eslint object-curly-newline: 0 */
describe('sending response tests', () => {

    const baseDir = process.cwd(),
        ResponseMockClass = require('#tests/mocks/responseMock.js');

    let path,
        zlib;

    beforeAll(async () => {
        path = await import('node:path');
        zlib = await import('node:zlib');
    });

    describe('compression enabled', () => {

        let response,
            sendOKResponse,
            sendOKResponseModule;

        beforeAll(async () => {

            sendOKResponseModule = await import('#server/utils/sendOKResponse.mjs');
            sendOKResponse = sendOKResponseModule.sendOKResponse;
        });

        beforeEach(() => {
            response = new ResponseMockClass();
        });

        it('uncompressed data and uncompressed send test', () => {

            let gotMessage = false;
            spyOn(response, 'end').and.callFake(data => {
                gotMessage = (data === 'simple string');
            });

            sendOKResponse({}, '/', response, 'simple string', false, false);
            expect(gotMessage).toBeTruthy();
        });

        it('gzip data in and uncompressed out', (done) => {
            const dataIn = 'simple string';
            const message = zlib.gzipSync(dataIn);

            let gotMessage = false;
            spyOn(response, 'end').and.callFake(data => {
                gotMessage = (data.toString() === dataIn);
                expect(gotMessage).toBeTruthy();
                done();
            });

            sendOKResponse({}, '/', response, message, false, true);
        });

        it('gzip data in and gzip out', (done) => {
            const dataIn = 'simple string';
            const message = zlib.gzipSync(dataIn);

            let gotMessage = false;
            spyOn(response, 'end').and.callFake(data => {
                gotMessage = (data === message);
                expect(gotMessage).toBeTruthy();
                done();
            });

            sendOKResponse({
                'accept-encoding': 'gzip'
            }, '/', response, message, false, true);
        });

        it('gzip data in and deflate out', (done) => {
            const dataIn = 'simple string';
            const message = zlib.gzipSync(dataIn);

            let gotMessage = false;
            spyOn(response, 'end').and.callFake(data => {
                // so if we uninflate then we should have original string
                const undeflate = zlib.inflateSync(data);
                gotMessage = (undeflate.toString() === dataIn);
                expect(gotMessage).toBeTruthy();
                done();
            });

            sendOKResponse({
                'accept-encoding': 'deflate'
            }, '/', response, message, false, true);
        });

        it('gzip data in and brotli out', (done) => {
            const dataIn = 'simple string';
            const message = zlib.gzipSync(dataIn);

            let gotMessage = false;
            spyOn(response, 'end').and.callFake(data => {
                // so if we uninflate then we should have original string
                const undeflate = zlib.brotliDecompressSync(data);
                gotMessage = (undeflate.toString() === dataIn);
                expect(gotMessage).toBeTruthy();
                done();
            });

            sendOKResponse({
                'accept-encoding': 'brotli'
            }, '/', response, message, false, true);
        });

        it('uncompressed data in and gzip out', (done) => {
            const dataIn = 'simple string';

            let gotMessage = false;
            spyOn(response, 'end').and.callFake(data => {
                // so if we uninflate then we should have original string
                const ungzip = zlib.gunzipSync(data);
                gotMessage = (ungzip.toString() === dataIn);
                expect(gotMessage).toBeTruthy();
                done();
            });

            sendOKResponse({
                'accept-encoding': 'gzip'
            }, '/', response, dataIn, false, false);
        });

        it('uncompressed data in and deflate out', (done) => {
            const dataIn = 'simple string';

            let gotMessage = false;
            spyOn(response, 'end').and.callFake(data => {
                const undeflate = zlib.inflateSync(data);
                gotMessage = (undeflate.toString() === dataIn);
                expect(gotMessage).toBeTruthy();
                done();
            });

            sendOKResponse({
                'accept-encoding': 'deflate'
            }, '/', response, dataIn, false, false);
        });
    });

    describe('compression enabled errors', () => {

        let response,
            sendOKResponse,
            sendOKResponseModule;

        beforeAll(async () => {

            sendOKResponseModule = await import('#server/utils/sendOKResponse.mjs');
            sendOKResponse = sendOKResponseModule.sendOKResponse;
        });

        beforeEach(() => {
            response = new ResponseMockClass();
        });

        it('uncompressed data in and throw error', (done) => {

            const dataIn = 'simple string';

            let gotMessage = false;
            spyOn(response, 'writeHead').and.callFake((code, headers) => {
                gotMessage = (!headers['Content-Encoding'] && !headers['content-encoding']);
                expect(gotMessage).toBeTruthy();
                done();
            });

            sendOKResponse({
                'accept-encoding': 'none'
            }, '/', response, dataIn, false, false);
        });

        it('gzip data in and throw error', (done) => {
            const dataIn = 'simple string';
            const message = zlib.gzipSync(dataIn);

            let gotMessage = false;
            spyOn(response, 'writeHead').and.callFake((code, headers) => {
                gotMessage = ((headers['Content-Encoding'] || headers['content-encoding']) === 'gzip');
                expect(gotMessage).toBeTruthy();
                done();
            });

            sendOKResponse({
                'accept-encoding': 'gzip'
            }, '/', response, message, false, true);
        });

        it('gzip data in and trying for deflate out but throw error', (done) => {
            const dataIn = 'simple string';
            const message = zlib.gzipSync(dataIn);

            let gotMessage = false;
            spyOn(response, 'writeHead').and.callFake((code, headers) => {
                gotMessage = ((headers['Content-Encoding'] || headers['content-encoding']) === 'deflate');
                expect(gotMessage).toBeTruthy();
                done();
            });

            sendOKResponse({
                'accept-encoding': 'deflate'
            }, '/', response, message, false, true);
        });

        it('uncompressed in and trying for deflate out but throw error', (done) => {
            const dataIn = 'simple string';

            let gotMessage = false;
            spyOn(response, 'writeHead').and.callFake((code, headers) => {
                gotMessage = (!headers['Content-Encoding'] && !headers['content-encoding']);
                expect(gotMessage).toBeTruthy();
                done();
            });

            sendOKResponse({
                'accept-encoding': 'bzip'
            }, '/', response, dataIn, false, false);
        });
    });

    describe('counter tests', () => {

        const headers = {},
            data = '<html><body></body></html>';

        let response,
            sendOKResponse,
            sendOKResponseModule;

        beforeAll(async () => {

            sendOKResponseModule = await import('#server/utils/sendOKResponse.mjs');
            sendOKResponse = sendOKResponseModule.sendOKResponse;
        });

        beforeEach(() => {
            response = new ResponseMockClass();
        });

        it('getMaxResponsePayload', () => {
            sendOKResponseModule.resetMaxResponsePayload();
            sendOKResponse(headers, '%2f', response, data, false, false);
            expect(sendOKResponseModule.getMaxResponsePayload()).toEqual(data.length);
        });

        it('resetMaxResponsePayload', () => {
            sendOKResponse(headers, '%2f', response, data, false, false);
            sendOKResponseModule.resetMaxResponsePayload();
            expect(sendOKResponseModule.getMaxResponsePayload()).toEqual(0);
        });

        it('getSendPromiseErrors', () => {
            sendOKResponseModule.logPromiseErrors('these are not the errors you are looking for!');
            expect(sendOKResponseModule.getSendPromiseErrors()).toBeGreaterThan(0);
        });

        it('resetSendPromiseErrors', () => {
            sendOKResponseModule.logPromiseErrors('these are not the errors you are looking for!');
            sendOKResponseModule.resetSendPromiseErrors();
            expect(sendOKResponseModule.getSendPromiseErrors()).toEqual(0);
        });
    });
});
