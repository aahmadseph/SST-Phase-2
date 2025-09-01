describe('processQueue', () => {

    const fs = require('fs/promises');
    const { EventEmitter } = require('events');

    const baseDir = process.cwd();

    class CustomEventEmitter extends EventEmitter {
        constructor() {
            super();
        }
    }
    const emitter = new CustomEventEmitter();

    let processQueue;
    let ufeWorkers,
        queryData,
        buildInfo;
    beforeEach(async () => {
        const results = await Promise.all([
            import('#server/framework/ufe/processQueue.mjs'),
            import('#server/utils/serverUtils.mjs'),
            fs.readFile('../../tools/data/initial-test.json'),
            import('#server/framework/ufe/ufeWorkers.mjs')
        ]);
        processQueue = results[0].default;
        const getBuildInfo = results[1].getBuildInfo;
        buildInfo = await getBuildInfo();
        const buffer = results[2];
        queryData = [Buffer.from(buffer)];
        ufeWorkers = results[3];
    });

    it('processQueue test', async () => {
        const index = 0;
        const url = '/templateResolver?channel=RWD&country=US&language=en&urlPath=%2F%3F&hash=ec3911d567207dda52df672342ad0812f0ad90b9';

        ufeWorkers.addWorker(index, emitter, buildInfo);

        const requestData ={
            headers: {},
            url: url
        };

        ufeWorkers.addToRequestQueue({
            requestData: requestData,
            cacheAbleRequest: false,
            queryData: queryData
        });

        await processQueue(0);

        expect(ufeWorkers.getRequestQueue().length).toEqual(0);
    });

});

