/* eslint max-len: [2, 200], class-methods-use-this: 1*/
describe('sendContent', () => {

    let sendContent;

    const msg = {
        url: '/templateResolver?country=US&channel=FS&urlPath=%252F&renderType=index&hash=abc123',
        hostname: 'happy-banana',
        remoteHost: '10.0.0.1',
        data: JSON.stringify({
            fakeData: 'fake',
            notUsed: 'anywhere'
        })
    };

    const DEFAULT_HTML = '<!DOCTYPE html><html lang="en" class="css-1mok2x0"><head><title>Cosmetics, Beauty Products, Fragrances &amp; Tools | Sephora</title></head><body></body></html>';

    beforeEach((done) => {

        // weird stuff when in test env, it seems in this case process.send is not defined?
        if (typeof process.send === 'undefined') {
            process.send = () => {};
        }
        spyOn(process, 'send').and.callFake(() => {});

        import('#server/libs/sendContent.mjs?isomode=true').then(res => {
            sendContent = res.default;
            done();
        });
    });

    it('test happy path', () => {
        sendContent(msg, {
            html: DEFAULT_HTML,
            renderTime: 0
        });
        expect(process.send).toHaveBeenCalled();
    });
});
