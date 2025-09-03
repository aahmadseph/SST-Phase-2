describe('passRequestToChild', () => {
    const fs = require('fs/promises');
    const { EventEmitter } = require('events');

    const baseDir = process.cwd();

    const requestMock = require('#tests/mocks/requestMock.js');

    class CustomEventEmitter extends EventEmitter {
        constructor() {
            super();
        }
    }
    const emitter = new CustomEventEmitter();

    let passRequestToChild;
    let ufeWorkers,
        queryData,
        buildInfo;
    beforeEach(async () => {
        const results = await Promise.all([
            import('#server/framework/ufe/passRequestToChild.mjs'),
            import('#server/utils/serverUtils.mjs'),
            fs.readFile('../../tools/data/initial-test.json'),
            import('#server/framework/ufe/ufeWorkers.mjs')
        ]);
        passRequestToChild = results[0];
        const getBuildInfo = results[1].getBuildInfo;
        buildInfo = await getBuildInfo();
        const buffer = results[2];
        queryData = [Buffer.from(buffer)];
        ufeWorkers = results[3];
    });

    it('passRequestToChild test', () => {

        const index = 0;
        const request = new requestMock({
            path: '/templateResolver?channel=RWD&country=US&language=en&urlPath=%2F%3F&hash=ec3911d567207dda52df672342ad0812f0ad90b9'
        });

        ufeWorkers.addWorker(index, emitter, buildInfo);

        passRequestToChild.passRequestToChild(0, request, false, queryData, emitter).then(results => {
            expect(results).toBeDefined();
        });
    });
});
