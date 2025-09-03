describe('status', () => {

    const buildInfo = {
        'BUILD_NUMBER': 'UFE-node.js',
        'PROJECT_VERSION': 'Unknown-Local',
        'CODE_BRANCH': 'Unknown-Local',
        'BUILD_DATE': 'Wed Feb 07 2024 16:46:58 GMT-0800 (Pacific Standard Time)',
        'GIT_BRANCH': 'Unknown-Local',
        'GIT_COMMIT': 'Unknown-Local'
    };

    let statusUtils;
    beforeAll(async () => {
        statusUtils = await import('#server/framework/ufe/status.mjs');
    });

    it('hasWorkerErrors', () => {

        const errors = {};
        const results = statusUtils.hasWorkerErrors(0);

        expect(results).toBeTruthy();
    });

    it('call getServerStatus', () => {

        const results = statusUtils.getServerStatus(buildInfo);
        expect(results).toBeDefined();

    });

    it('call getServerStatus for renderInfo', () => {

        const results = statusUtils.getServerStatus(buildInfo);
        expect(results.includes('renderInfo')).toBeTruthy();

    });

    it('call getServerStatus for updateErrors', () => {

        statusUtils.updateErrors('response_422');
        const results = statusUtils.getServerStatus(buildInfo);
        expect(results.includes('response_422\":1')).toBeTruthy();

    });

    it('call getServerStatus for updateMaxPayloadSinceLastCall', () => {

        statusUtils.updateMaxPayloadSinceLastCall(4088);
        const results = statusUtils.getServerStatus(buildInfo);
        expect(results.includes('maxPayloadSinceLastCall\":4088')).toBeTruthy();

    });

    it('call getServerStatus for updateRequestProcessingTime', () => {

        statusUtils.updateRequestProcessingTime(0.1234);
        const results = statusUtils.getServerStatus(buildInfo);
        expect(results.includes('maxRequestProcessingTime\":0.1234')).toBeTruthy();

    });
});
