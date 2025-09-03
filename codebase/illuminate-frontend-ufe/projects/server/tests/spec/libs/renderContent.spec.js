/* eslint max-len: [2, 200] */
describe('renderContent', () => {

    const DEFAULT_HTML = '<!DOCTYPE html>' +
        '<html lang="en" class="css-1mok2x0"><head>' +
        '<title>Cosmetics, Beauty Products, Fragrances &amp; Tools | Sephora</title>' +
        '<style>[[__SEPHORA_GENERATED_CSS__]]</style>' +
        '</head><body>' +
        '</body></html>';

    const RENDERED_HTML = DEFAULT_HTML.replace('[[__SEPHORA_GENERATED_CSS__]]', '');

    const InflatorRoot = {
        inflate: function () {
            return DEFAULT_HTML;
        }
    };

    function removeStyleContent(inStr) {
        const start = '<style>',
            finish = '</style>';

        const begin = inStr.indexOf(start) + start.length;
        const end = inStr.indexOf(finish);
        return inStr.substring(0, begin) + inStr.substring(end);
    }

    describe('backend render', () => {

        let renderContent;
        beforeAll((done) => {
            process.env.BUILD_MODE = 'isomorphic';

            import('#server/libs/renderContent.mjs?isomode=true').then(res => {
                renderContent = res.default;
                done();
            });
        });

        afterAll(() => {
            delete process.env.BUILD_MODE;
        });

        it('test happy path', () => {
            const msg = {
                url: '/templateResolver?country=US&channel=FS&urlPath=%252F&renderType=index&hash=abc123',
                hostname: 'happ-banana',
                remoteHost: '10.0.0.1',
                data: JSON.stringify({
                    fakeData: 'fake',
                    notUsed: 'anywhere'
                })
            };

            const result = renderContent(msg, InflatorRoot);
            expect(removeStyleContent(result.html)).toEqual(RENDERED_HTML);
        });

        it('test no urlPath', () => {
            const badMsg = {
                url: '/templateResolver?country=US&channel=FS&renderType=index&hash=abc123',
                hostname: 'happ-banana',
                remoteHost: '10.0.0.1',
                data: JSON.stringify({
                    fakeData: 'fake',
                    notUsed: 'anywhere'
                })
            };

            let results;
            try {
                results = renderContent(badMsg, InflatorRoot);
            } catch (e) {
                results = e;
            }
            expect(results).toEqual(`Missing urlPath in ${badMsg.url} from ${badMsg.remoteHost}!`);
        });

        it('test cachedQueryParams', () => {
            const badMsg = {
                url: '/templateResolver?country=US&channel=FS&urlPath=%252F&renderType=index&hash=abc123&cachedQueryParams=foo%3Dbar%26me%3Dtired',
                hostname: 'happ-banana',
                remoteHost: '10.0.0.1',
                data: JSON.stringify({
                    fakeData: 'fake',
                    notUsed: 'anywhere'
                })
            };
            const results = renderContent(badMsg, InflatorRoot);
            expect(removeStyleContent(results.html)).toEqual(RENDERED_HTML);
        });
    });

    describe('frontend render', () => {

        let renderContent;
        beforeAll(async() => {
            process.env.BUILD_MODE = 'frontend';

            const resa = await import('#server/config/envConfig.mjs');
            resa.BUILD_MODE = 'frontend';

            const res = await import('#server/libs/renderContent.mjs?frontend=true');
            renderContent = res.default;
        });

        afterAll(() => {
            delete process.env.BUILD_MODE;
        });

        it('test happy path', () => {
            const msg = {
                url: '/templateResolver?country=US&channel=FS&urlPath=%252F&renderType=index&hash=abc123',
                hostname: 'happ-banana',
                remoteHost: '10.0.0.1',
                data: JSON.stringify({
                    fakeData: 'fake',
                    notUsed: 'anywhere'
                })
            };

            const X_DEFAULT_HTML = DEFAULT_HTML.replace('[[__SEPHORA_GENERATED_CSS__]]', '');
            const result = renderContent(msg, InflatorRoot);
            expect(result.html).toEqual(X_DEFAULT_HTML);
        });
    });
});
