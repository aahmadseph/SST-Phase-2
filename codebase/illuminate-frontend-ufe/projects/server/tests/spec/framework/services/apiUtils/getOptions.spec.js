describe('getOptions', function () {

    it('get options should return method passed in', async() => {
        const { getApiOptions } = await import('#server/framework/services/apiUtils/getOptions.mjs?time=434');
        const options = getApiOptions('localhost', 10443, '/sompath', 'GET', {}, {});
        expect(options.method).toEqual('GET');
    });

    it('get options should return timeout from env', async() => {
        const { getApiOptions } = await import('#server/framework/services/apiUtils/getOptions.mjs?time=1234');
        const options = getApiOptions('localhost', 10443, '/sompath', 'POST', {}, {});
        expect(options.method).toEqual('POST');
    });
});
