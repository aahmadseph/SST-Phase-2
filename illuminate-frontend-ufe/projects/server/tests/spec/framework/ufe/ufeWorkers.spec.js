describe('ufeWorkers', () => {

    const requestMock = require('#tests/mocks/requestMock.js'),
        responseMock = require('#tests/mocks/responseMock.js');

    let ufeWorkers,
        buildInfo,
        emitter;

    beforeAll(async () => {
        ufeWorkers = await import('#server/framework/ufe/ufeWorkers.mjs');

        const res = await import('#server/utils/serverUtils.mjs');
        buildInfo = res.getBuildInfo();

        const res1 = await import('#server/framework/ufe/UFEEventEmitter.mjs');
        emitter = res1.default;
    });

    it('call addWorker test', () => {

        const index = 0;

        ufeWorkers.addWorker(index, emitter, buildInfo);

        expect(ufeWorkers.getWorkerBeeKeys().length).toBeGreaterThan(0);
    });

    it('call initializeWorkers test', () => {
        ufeWorkers.initializeWorkers(emitter);

        expect(ufeWorkers.getWorkerBeeKeys().length).toBeGreaterThan(0);
    });

    it('call addToRequestQueue test', () => {
        ufeWorkers.initializeWorkers(emitter);
        ufeWorkers.addToRequestQueue({
            reqObj: new requestMock(),
            respObj: new responseMock(),
            cacheAbleRequest: false,
            queryData: Buffer.from('{}')
        });

        expect(ufeWorkers.getRequestQueue().length).toBeGreaterThan(0);
    });

    it('call getWorkerBees test', () => {

        const index = 0;

        ufeWorkers.addWorker(index, emitter, buildInfo);
        expect(ufeWorkers.getWorkerBees()[index]).toBeDefined();
    });
});
