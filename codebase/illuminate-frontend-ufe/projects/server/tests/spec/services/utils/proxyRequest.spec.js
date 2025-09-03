/* eslint class-methods-use-this: 0 */
describe('proxyRequest', () => {

    const baseDir = process.cwd();

    const sslDir = `${baseDir}/tests/data`;

    const responseMockClass = require('#tests/mocks/responseMock.js'),
        requestMockClass = require('#tests/mocks/requestMock.js');

    let proxyRequest,
        http,
        https;

    beforeAll(async () => {
        http = await import('node:http');
        https = await import('node:https');
    });

    beforeEach(async () => {
        spyOn(http, 'request').and.callFake((opts, cb) => {
            return new requestMockClass(opts, cb);
        });

        spyOn(https, 'request').and.callFake((opts, cb) => {
            return new requestMockClass(opts, cb);
        });
        const res = await import('#server/services/utils/proxyRequest.mjs');
        proxyRequest = spyOn(res, 'default');
    });

    it('proxy', async() => {

        const request = new requestMockClass(),
            response = new responseMockClass();

        const fs = require('fs');
        const options = {
            key: fs.readFileSync(`${sslDir}/ssl-keys/domain.keys`),
            cert: fs.readFileSync(`${sslDir}/ssl-keys/domain.crt`)
        };

        const server = https.createServer(options, (req, res) => {
            res.writeHead(200, {});
            res.end('done');
        });
        await server.listen(14444);

        await proxyRequest('localhost', request, response, request.url, {
            port: 14444,
            rejectUnauthorized: false
        });
        expect(proxyRequest).toHaveBeenCalled();
        server.close();
    });
});
