/* eslint max-len: [2, 200] */
describe('basic test of logger', () => {

    let logger;

    beforeEach(async () => {
        const res = await import('#server/libs/Logger.mjs');
        process.env.LOG_LEVEL = 'warn';
        logger = res.default(__filename);
    });

    it('check to make sure logger exists', () => {
        expect(logger).not.toBeUndefined();
    });

    it('call logger and exit', (done) => {

        const message = 'something should be written here?';

        let msg;

        logger.on('data', (data) => {
            msg = data.message;
        });

        logger.warn(message);
        logger.transports[0].once('finish', () => {
            expect(msg).toEqual(message);
            done();
        });
        logger.end();
    });

    it('call logger and splat test ', (done) => {

        let splatArgs;

        logger.on('data', (data) => {
            const symbolTable = Object.getOwnPropertySymbols(data);
            for (let i = 0, end = symbolTable.length; i < end; i++) {
                if (symbolTable[i].toString() === 'Symbol(splat)') {
                    splatArgs = data[symbolTable[i]].toString();
                    console.log(splatArgs);
                }
            }
        });

        logger.warn('testing arguments or splat %s %s', 'argument one', 'argument two');
        logger.transports[0].once('finish', () => {
            expect(splatArgs).toEqual('argument one,argument two');
            done();
        });
        logger.end();
    });
});
