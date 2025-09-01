/* eslint no-constant-condition: 0 */
describe('PromiseWrapper', () => {

    let promiseWrapper;
    beforeEach(async () => {
        const res = await import('#server/utils/PromiseWrapper.mjs');
        promiseWrapper = res.default;
    });

    it('test for simple success of promise call', done => {
        function falsePromise() {
            return new Promise(resolve => {
                resolve('success at last');
            });
        }

        promiseWrapper(falsePromise()).then(data => {
            const result = data[1];
            expect(result).toEqual('success at last');
            done();
        });
    });

    it('test for simple fail of promise call', done => {
        function falsePromise() {
            return new Promise((resolve, reject) => {
                reject(new Error('epic fail'));
            });
        }

        promiseWrapper(falsePromise()).then(data => {
            const result = data[0];
            expect(result).toEqual(new Error('epic fail'));
            done();
        });
    });
});
