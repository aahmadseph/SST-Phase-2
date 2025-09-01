/* eslint max-len: [2, 200] */
describe('template_child', () => {
    var templateChild,
        fs = require('fs'),
        path = require('path'),
        childProc = require('child_process'),
        baseDir = process.cwd(),
        fileData,
        testResultDir = path.join(baseDir, 'tests/generated'),
        filepath = path.join('../../tools/data/initial-test.json');

    beforeAll((done) => {

        if (!fs.existsSync(testResultDir)) {
            fs.mkdirSync(testResultDir);
        }

        // special case for getting coverage on the template child
        templateChild = childProc.fork('./src/template_child.mjs', {
            env: Object.assign({}, process.env, {
                DISABLE_SOCKET_CHANNEL: true,
                NODE_PATH: path.join(baseDir, '/projects/ui/src'),
                WORKERS: 1,
                NODE_ENV: 'production',
                BUILD_MODE: 'isomorphic',
                LOG_LEVEL: 'error'
            })
        });

        setTimeout(() => {
            fs.readFile(filepath, (err, data) => {

                if (err) {
                    throw err;
                }
                fileData = data.toString();
                done();
            });
        }, 500);
    });

    afterAll(() => {

        try {
            // force child to die
            process.kill(templateChild.pid);
        } catch (e) {
            // discard
        }
    });

    describe('rendering an html document', () => {

        let results = '';

        beforeAll((done) => {
            templateChild.once('message', function (html) {
                results = html.html;
                fs.writeFileSync(`${testResultDir}/page.html`, results);
                done();
            });

            templateChild.send({
                url: '/templateResolver?country=US&channel=FS&urlPath=%2F%3F&hash=bec3911d567207dda52df672342ad0812f0ad90b9a',
                data: fileData
            });
        });

        it('and return some type of response', () => {
            const len = (results ? results.length : 0);
            expect(len).toBeGreaterThan(0);
        });

        it('and has an html tag in response', () => {
            expect(results.indexOf('<html')).toBeGreaterThan(0);
        });

        it('and has an body tag in response', () => {
            expect(results.indexOf('<body')).toBeGreaterThan(0);
        });

        it('and has a closing html tag in response', () => {
            expect(results.indexOf('</html>')).toBeGreaterThan(0);
        });
    });
});
