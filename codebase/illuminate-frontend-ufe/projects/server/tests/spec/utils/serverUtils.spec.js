/* eslint max-len: [2, 200] */
describe('serverUtils', () => {

    let serverUtils;

    beforeEach(async () => {
        const res = await import('#server/utils/serverUtils.mjs');
        serverUtils = res;
    });

    it('get an env property with getEnvProp', () => {

        const value = 'say what?';

        process.env.FLYING_SPAGATTI_MONSTER = value;

        const result = serverUtils.getEnvProp('FLYING_SPAGATTI_MONSTER');

        expect(result).toEqual(value);
    });

    it('get an UNDEFINED env property with getEnvProp and a default and it returns the default', () => {

        const answer = 'I thought so!';

        const result = serverUtils.getEnvProp('ALIENS', answer);

        expect(result).toEqual(answer);
    });

    it('get and env property with getEnvProp and have a default and it returns the env property', () => {

        const value = 'was a good movie?',
            answer = 'I thought so!';

        process.env.ALIEN = value;

        const result = serverUtils.getEnvProp('ALIEN', answer);

        expect(result).toEqual(value);
    });

    it('getError test', () => {

        const err = new Error('Some error happened', {
            code: 'ECONNRESET'
        });
        const res = serverUtils.getError(err);
        const index = res.indexOf('Error: Some error happened at');
        expect(index).toEqual(0);
    });

    it('getMax test 1', () => {
        const v1 = 100,
            v2 = 101;

        const result = serverUtils.getMax(v1, v2);

        expect(result).toEqual(v2);
    });

    it('get build info', () => {
        const result = serverUtils.getBuildInfo();

        expect(result['GIT_BRANCH']).toBeDefined();
    });

    it('getMax test 2', () => {
        const v1 = 105,
            v2 = 101;

        const result = serverUtils.getMax(v1, v2);

        expect(result).toEqual(v1);
    });

    it('get a time difference that is greater than 0 with getDiffTime', () => {

        const start = process.hrtime();

        expect(serverUtils.getDiffTime(start)).toBeGreaterThan(0);
    });

    it('pass undefined to getDiffTime', () => {

        expect(serverUtils.getDiffTime(undefined)).toEqual(0);
    });

    it('call subtractTimes with undef and a float', () => {

        expect(serverUtils.subtractTimes(undefined, 0.1001001)).toEqual(0);
    });

    it('pass undefined to getDiffTime', () => {

        const start = [0, 100100100];

        spyOn(process, 'hrtime').and.callFake(inTime => {
            // should return [0. 0.200200107]
            const newTime = [0 + inTime[0], 100100007 + inTime[1]];
            return newTime;
        });

        expect(serverUtils.subtractTimes(start, 0.0222)).toEqual(0.178000107);
    });

    it('stringifyMsg ', () => {

        const message = {
            'hello': 'world'
        };

        const result = serverUtils.stringifyMsg(message);
        expect(result).toEqual(JSON.stringify(message));
    });

    it('safelyParse ', () => {

        const message = JSON.stringify({
            'hello': 'world'
        });

        const result = serverUtils.safelyParse(message);
        expect(result).toEqual(JSON.parse(message));
    });

    it('dnsLookup ', (done) => {

        const hostname = 'localhost';

        serverUtils.dnsLookup(hostname).then(hostIP => {
            expect(hostIP).not.toEqual(hostname);
            done();
        }).catch(err => {});
    });

    describe('things with timers', () => {

        let usage;

        beforeAll(() => {
            usage = process.memoryUsage;
            jasmine.clock().uninstall();
            jasmine.clock().install();
        });

        afterAll(() => {
            jasmine.clock().uninstall();
        });

        it('memoryUsageLogging', () => {

            let called = false;

            process.memoryUsage = () => {
                called = true;
                return usage();
            };

            const id = serverUtils.memoryUsageLogging(console, 500);
            jasmine.clock().tick(505);
            expect(called).toBe(true);
            clearInterval(id);
        });

        it('memoryUsageLogging longer time', () => {

            let called = false;

            process.memoryUsage = () => {
                called = true;
                return usage();
            };

            const id = serverUtils.memoryUsageLogging(console, 1000);
            jasmine.clock().tick(1005);
            expect(called).toBe(true);
            clearInterval(id);
        });

        it('gcLogging', () => {

            let called = false;

            global.gc = () => {
                called = true;
                return usage();
            };

            const id = serverUtils.gcLogging(console, 500);
            jasmine.clock().tick(505);

            expect(called).toBe(true);
            clearInterval(id);
        });

        it('gcLogging longer time', () => {

            let called = false;

            global.gc = () => {
                called = true;
                return usage();
            };

            const id = serverUtils.gcLogging(console, 1000);
            jasmine.clock().tick(1005);

            expect(called).toBe(true);
            clearInterval(id);
        });
    });

    describe('more things things with timers', () => {

        beforeAll(() => {
            jasmine.clock().uninstall();
            jasmine.clock().install();
        });

        afterAll(() => {
            jasmine.clock().uninstall();
        });


        it('gcLogging without global.gc defined', () => {

            let called = false;

            global.gc = undefined;

            process.memoryUsage = () => {
                called = true;
            };

            const id = serverUtils.gcLogging(console, 1000);
            jasmine.clock().tick(1005);
            expect(called).toBe(true);
            clearInterval(id);
        });
    });
});
