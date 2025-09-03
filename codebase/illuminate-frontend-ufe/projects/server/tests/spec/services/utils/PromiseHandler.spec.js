describe('PromiseHandler', () => {

    const options = {},
        results = JSON.stringify({ dataBlock: 'some string' }),
        errorResults = {
            statusCode: 400,
            dataBlock: 'some string'
        };

    let PromiseHandler;
    beforeEach(done => {
        import('#server/services/utils/PromiseHandler.mjs').then(res => {
            PromiseHandler = res.default;
            done();
        });
    });

    it('call success', (done) => {
        const eventList = [];
        eventList.push({
            identifier: 'configurationAPI',
            apiFunction: () => {
                return new Promise(resolve => {
                    resolve(results);
                });
            },
            options
        });
        eventList.push({
            identifier: 'headerFooterAPI',
            apiFunction: () => {
                return new Promise(resolve => {
                    resolve(results);
                });
            },
            options
        });
        PromiseHandler(eventList, (err, data) => {
            expect(data).toBeDefined();
            done();
        });
    });

    it('call error', (done) => {
        const eventList = [];
        eventList.push({
            identifier: 'configurationAPI',
            apiFunction: () => {
                return new Promise(resolve => {
                    resolve(results);
                });
            },
            options
        });
        eventList.push({
            identifier: 'headerFooterAPI',
            apiFunction: () => {
                return new Promise((resolve, reject) => {
                    reject(results);
                });
            },
            options
        });
        PromiseHandler(eventList, (err, data) => {
            expect(err).toBeDefined();
            done();
        });
    });

    it('call error statusCode', (done) => {
        const eventList = [];
        eventList.push({
            identifier: 'configurationAPI',
            apiFunction: () => {
                return new Promise((resolve, reject) => {
                    reject(errorResults);
                });
            },
            options
        });
        eventList.push({
            identifier: 'headerFooterAPI',
            apiFunction: () => {
                return new Promise((resolve, reject) => {
                    reject(results);
                });
            },
            options
        });
        PromiseHandler(eventList, (err, data) => {
            expect(err).toBeDefined();
            done();
        });
    });
});
