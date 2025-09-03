/* eslint max-len: [2, 200] */
describe('FrontendInflateRoot', () => {

    const fs = require('fs'),
        path = require('path'),
        baseDir = process.cwd(),
        urlModule = require('url'),
        FrontendInflateRootPath = '#server/libs/FrontEndInflateRoot.mjs',
        filepath = path.join('../../tools/data/initial-test.json');

    let FrontendInflateRoot;

    const Sephora = {
        debug: {
            dataAt: function (name) {
                return Sephora.debug.displayAutomationAttr ? name : null;
            },
            displayAutomationAttr: false,
            showRootComps: false
        },
        buildMode: 'frontend',
        targeterNames: []
    };
    let fileData,
        Constants,
        location;

    const url = '/templateResolver?hash=8675309abcdef8675309abcdef&channel=FS&country=US&urlPath=%252F';

    beforeAll(async () => {
        process.env.NODE_PATH = path.join(baseDir, '/projects/ui/src');
        require('module').Module._initPaths();

        Constants = await import('#server/shared/Constants.mjs');

        process.env.UFE_ENV = Constants.UFE_ENV_LOCAL;
        process.env.NODE_ENV = 'production';

        location = urlModule.parse(url, true);

        FrontendInflateRoot = await import(FrontendInflateRootPath);

        try {
            fileData = await fs.promises.readFile(filepath, 'utf8');
        } catch (err) {
            throw err;
        }
    });

    it('call inflate', () => {

        const html = FrontendInflateRoot.inflate({ data: fileData }, location, Sephora, process);

        const index = html.indexOf('{msg.data}');

        expect(index).toBeLessThan(0);
    });
});
