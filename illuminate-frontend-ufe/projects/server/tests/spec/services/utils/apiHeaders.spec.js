describe('api headers', () => {

    const options = {};

    let DEVICE_ID,
        ACCESS_TOKEN;

    let getSDNGraphQLHeaders;
    beforeEach(async() => {
        process.env.DEVICE_ID = DEVICE_ID;
        process.env.ACCESS_TOKEN = ACCESS_TOKEN;

        const res1 = await import('#server/config/envRouterConfig.mjs');
        DEVICE_ID = res1.DEVICE_ID;
        ACCESS_TOKEN = res1.ACCESS_TOKEN;
        const res = await import('#server/services/utils/apiHeaders.mjs');
        getSDNGraphQLHeaders = res.getSDNGraphQLHeaders;
    });

    afterEach(() => {
        delete options.channel;
    });

    it('getSDNGraphQLHeaders', () => {

        options.channel = 'MW';
        const headers = getSDNGraphQLHeaders('madeup', 'UFE', 'alsomadeup');
        expect(headers['apollographql-client-name']).toEqual('UFE');
    });

});
