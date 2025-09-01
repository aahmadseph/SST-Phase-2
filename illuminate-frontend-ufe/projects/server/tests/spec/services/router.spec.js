/*describe('router.mjs', () => {

    const path = require('path'),
        cluster = require('cluster'),
        get = require('https').get;

    const baseDir = process.cwd(),
        envConfigModulePath = path.join(baseDir, 'server/config/envConfig'),
        envRouterConfigModulePath = path.join(baseDir, 'server/config/envRouterConfig');

    const sslDir = `${baseDir}/projects/server/tests/data/`;

    let httpRouter;

    beforeAll((done) => {
        process.env.NODE_ENV = 'production';
        process.env.BUILD_MODE = 'isomorphic';
        process.env.LOG_LEVEL = 'warn';
        process.env.MAX_REQUEST_SIZE = '2e6';
        process.env.ENABLE_REDIS = false;
        process.env.API_HOST = 'localhost';
        process.env.API_PORT = 8080;
        process.env.ROUTER_SERVER_PORT = 12000;
        process.env.ROUTER_SERVER_NAME = 'localhost';
        process.env.SSL_KEY = `${sslDir}/ssl-keys/domain.keys`;
        process.env.SSL_CERT = `${sslDir}/ssl-keys/domain.crt`;

        const envName = require.resolve(envConfigModulePath);
        delete require.cache[envName];
        const envRouterName = require.resolve(envRouterConfigModulePath);
        delete require.cache[envRouterName];

        cluster.setupMaster({
            exec: `${baseDir}/projects/server/services/router.mjs`,
            args: ['--use', 'https']
        });
        httpRouter = cluster.fork(Object.assign({}, process.env, { workerIndex: 0 }));
        const intervalId = setInterval(() => {
            if (httpRouter && httpRouter.process && (httpRouter.process.pid || httpRouter.pid)) {
                clearInterval(intervalId);
                setTimeout(() => {
                    done();
                }, 2500);
            }
        }, 1000);
    });

    afterAll(() => {
        if (httpRouter) {
            if (httpRouter.pid) {
                process.kill(httpRouter.pid);
            } else if (httpRouter.process && httpRouter.process.pid) {
                process.kill(httpRouter.process.pid);
            }
        }
    });

    it('getStatus testing', (done) => {

        const host = process.env.ROUTER_SERVER_NAME,
            port = process.env.ROUTER_SERVER_PORT,
            serverUrl = `https://${host}:${port}/status`;

        httpRouter.on('message', (data) => {
            httpRouter.process.send({
                'request': 'sendData',
                'data': data
            });
        });

        get(serverUrl, { rejectUnauthorized: false }, res => {

            const results = [];
            res.on('data', (chunk) => {
                results.push(chunk);
            });
            res.on('end', () => {
                const stats = Buffer.concat(results).toString();

                expect(JSON.parse(stats).data.status).toEqual('UP');
                done();
            });
        });
    });
});*/
