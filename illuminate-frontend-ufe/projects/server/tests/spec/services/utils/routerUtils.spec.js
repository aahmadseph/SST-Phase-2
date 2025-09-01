/* eslint max-len: [2, 200], class-methods-use-this: 0, indent: 0 */
describe('routerUtils', () => {
    const fs = require('fs');
    const responseMockClass = require('#tests/mocks/responseMock.js'),
        requestMock = require('#tests/mocks/requestMock.js');

    const port = 15000;
    process.env.PROXY_PORT = port;
    process.env.PROXY_HOST = '127.0.0.1';

    let routerUtils;
    beforeEach(done => {
        process.env.UFE_ENV = 'QA';

        if (require.resolve('#server/config/envRouterConfig.mjs')) {
            delete require.cache[require.resolve('#server/config/envRouterConfig.mjs')];
        }

        import(`#server/services/utils/routerUtils.mjs?time=${Date.now()}`)
            .then(res => {
                routerUtils = res;
                done();
            });
    });

    it('filterHeaders', () => {

        const headers = {
            'server': 'Josh',
            'transfer-encoding': 'chunked',
            'date': `${new Date()}`
        };
        const filtered = routerUtils.filterHeaders(headers);
        expect(filtered['server']).toBeUndefined();
    });

    it('sendLocalFile', (done) => {

        const request = new requestMock({ path: '/js/ufe/postLoadList.js' });
        const responseMock = new responseMockClass();
        spyOn(fs, 'createReadStream').and.callThrough();

        responseMock.on('finish', () => {
            expect(fs.createReadStream).toHaveBeenCalled();
            done();
        });
        routerUtils.sendLocalFile(request, responseMock, 'text/javascript');
    });

    it('sendLocalFile error', (done) => {

        const responseMock = new responseMockClass(),
            errorRequestMock = new requestMock();

        errorRequestMock.path = '/js/ufe/pizza.js';

        const https = require('https');

        // https://stackoverflow.com/questions/70909755/fs-readfilesync-says-no-such-file-or-directory-although-require-returns-the
        const domainKey = () => fs.readFileSync(require.resolve('#tests/data/ssl-keys/domain.keys'), { encoding: 'utf8' });
        const domainCert = () => fs.readFileSync(require.resolve('#tests/data/ssl-keys/domain.crt'), { encoding: 'utf8' });

        const options = {
            key: domainKey(),
            cert: domainCert()
        };
        const server = https.createServer(options, (req, resp) => {
            resp.writeHead(200, {});
            resp.end('done');
        });
        server.listen(port);

        spyOn(responseMock, 'writeHead').and.callFake(() => {
            expect(responseMock.writeHead).toHaveBeenCalled();
            done();
        });

        routerUtils.sendLocalFile(errorRequestMock, responseMock, 'text/javascript', { rejectUnauthorized: false });
    });
});
