describe('status.js', () => {

    process.env.LOG_LEVEL = 'warn';
    process.env.ENABLE_REDIS = false;

    const baseDir = process.cwd(),
        { statusRoute } = require(`${baseDir}/projects/server/services/routing/status`);

    const responseMockClass = require('#tests/mocks/responseMock.js'),
        requestMock = require('#tests/mocks/requestMock.js');

    it('getStatus testing', (done) => {

        const request = new requestMock(),
            response = new responseMockClass();

        process.send = undefined;

        spyOn(response, 'json').and.callFake(data => {
            expect(data.status).toEqual('UP');
            done();
        });

        statusRoute(request, response);
    });
});
