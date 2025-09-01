describe('sending temp redirect', () => {

    const response = {
        writeHead: function (x, headers) {},
        end: function (data) {}
    };
    let sendTempRedirect,
        sendPermRedirect;
    beforeEach(async () => {
        const res = await import('#server/utils/sendRedirect.mjs');
        sendPermRedirect = res.sendPermRedirect;
        sendTempRedirect = res.sendTempRedirect;
    });

    it('call sendTempRedirect', () => {

        let gotMessage = false;
        spyOn(response, 'end').and.callFake(() => {
            gotMessage = true;
        });

        sendTempRedirect(response, 'simple string');
        expect(gotMessage).toBeTruthy();
    });

    it('call sendPermRedirect', () => {

        let gotMessage = false;
        spyOn(response, 'end').and.callFake(() => {
            gotMessage = true;
        });

        sendPermRedirect(response, undefined, '/pasta');
        expect(gotMessage).toBeTruthy();
    });
});
