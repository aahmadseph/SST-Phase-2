describe('sending error response', () => {

    const response = {
        writeHead: function (x, headers) {},
        end: function (data) {}
    };

    let sendErrorResponse;
    beforeEach(async () => {
        const res = await import('#server/utils/sendErrorResponse.mjs');
        sendErrorResponse = res.sendErrorResponse;
    });

    it('call sendErroResponse', () => {

        let gotMessage = false;
        spyOn(response, 'end').and.callFake(data => {
            gotMessage = (data === 'simple string');
        });

        sendErrorResponse(response, 'simple string', false);
        expect(gotMessage).toBeTruthy();
    });
});
