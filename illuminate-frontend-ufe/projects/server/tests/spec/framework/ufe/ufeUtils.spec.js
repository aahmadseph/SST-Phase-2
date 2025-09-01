describe('ufeUtils', () => {

    const fs = require('node:fs');

    const baseDir = process.cwd();

    const data = fs.readFileSync('../../tools/data/initial-test.json').toString();

    let ufeWorkers,
        buildInfo,
        emitter,
        ufeUtils;
    beforeAll(async () => {
        ufeUtils = await import('#server/framework/ufe/ufeUtils.mjs');
        ufeWorkers = await import('#server/framework/ufe/ufeWorkers.mjs');

        const res = await import('#server/utils/serverUtils.mjs');
        buildInfo = res.getBuildInfo();

        const res1 = await import('#server/framework/ufe/UFEEventEmitter.mjs');
        emitter = res1.default;
    });

    it('formatBuildInfo test', () => {
        const {
            formatBuildInfo
        } = ufeUtils;

        const results = formatBuildInfo(buildInfo);
        expect(results).toBeDefined();

    });

    it('promisifiedSend test', async () => {

        const postData = {
            url: '/templateResolver?urlPath=%2F&channel=rwd&country=us&lang=en',
            data: data,
            hostname: 'localhost',
            encoding: '',
            remoteHost: '',
            'cat_or_mouse': 'mouse'
        };

        ufeWorkers.initializeWorkers(emitter);
        ufeWorkers.addWorker(0, emitter, buildInfo);

        const result = await ufeUtils.promisifiedSend(postData, 0);
        expect(result).toBeDefined();
    });

    it('sendToWorker test', async () => {

        const postData = {
            url: '/templateResolver?urlPath=%2F&channel=rwd&country=us&lang=en',
            data: data,
            hostname: 'localhost',
            encoding: '',
            remoteHost: '',
            'cat_or_mouse': 'mouse'
        };

        ufeWorkers.initializeWorkers(emitter);
        ufeWorkers.addWorker(0, emitter, buildInfo);

        const workerBees = ufeWorkers.getWorkerBees();

        const result = await ufeUtils.sendToWorker(postData, 0, postData.url);
        expect(result).toBeDefined();
    });

    it('logResponseFinish test', () => {

        const responseSinceLastCallBefore = ufeUtils.getResponsesSentSinceLastCall();
        ufeUtils.logResponseFinish();
        const responseSinceLastCallAfter = ufeUtils.getResponsesSentSinceLastCall();
        expect(responseSinceLastCallAfter).toBeGreaterThan(responseSinceLastCallBefore);

    });
});
