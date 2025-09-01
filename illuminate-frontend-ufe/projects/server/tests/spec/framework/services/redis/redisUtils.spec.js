describe('redisUtils', function () {

    let getError,
        getMessage,
        filterErrorMessage,
        logAndReject,
        stringifyMsg;

    beforeEach(async() => {
        const res = await import('#server/framework/services/redis/redisUtils.mjs');
        const res2 = await import('#server/utils/serverUtils.mjs');
        stringifyMsg = res2.stringifyMsg;

        getError = res.getError;
        getMessage = res.getMessage;
        filterErrorMessage = res.filterErrorMessage;
        logAndReject = res.logAndReject;
    });

    describe('getError', () => {

        const errMsg = 'error getting message';

        it('passed in null', () => {
            expect(getError(null)).toBeUndefined();
        });

        it('passed in string', () => {
            expect(getError(errMsg)).toEqual(stringifyMsg(errMsg));
        });

        it('passed in object with message', () => {
            const e = { message: errMsg };
            expect(getError(e)).toEqual(errMsg);
        });

        it('passed in buffer message', () => {
            expect(getError(Buffer.from(errMsg))).toEqual(errMsg);
        });
    });

    describe('getMessage', () => {

        const msg = 'error getting message';

        it('passed in string', () => {
            expect(getMessage(msg)).toEqual(stringifyMsg(msg));
        });

        it('passed in buffer message', () => {
            expect(getMessage(Buffer.from(msg))).toEqual(msg);
        });

    });

    describe('filterErrorMessage', () => {

        const e = {
            message: 'something bad happened',
            args: ['one', 'two', 'three'],
            key: '/templateResolver?'
        };

        const y = Object.assign(e);
        delete y.args;

        it('filter out args', () => {
            expect(filterErrorMessage(e)).toEqual(e);
        });
    });

    describe('logAndReject', () => {

        const errMsg = 'error getting message';

        const err = { message: errMsg };

        it('passed in error message', () => {

            const iPromise = {
                reject: function () {
                    // do nothing
                }
            };

            spyOn(iPromise, 'reject').and.callThrough();

            logAndReject(iPromise.reject, err, 'test');

            expect(iPromise.reject).toHaveBeenCalled();
        });
    });
});
