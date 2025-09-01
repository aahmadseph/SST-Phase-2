/* eslint max-len: [2, 200], no-console: 0, object-curly-newline: 0 */
const childProcess = require('node:child_process'),
    colors = require('colors'),
    process = require('node:process');

const UFE_HOST = 'https://local.sephora.com:10443',
    URL_LIST = [
        '/',
        '/shop/lipstick',
        '/shop/facial-treatments',
        '/shop/hair-tools',
        '/brand/forvr-mood',
        '/brand/phlur',
        '/product/sephora-collection-scalp-massager-P472069?skuId=2414555',
        '/product/carolina-herrera-mini-good-girl-eau-de-parfum-P484038?skuId=2587939'
    ];

let testDuration, connectionCount;

if (process.argv.length > 2) {
    const ARGS = process.argv;

    for (let i = 2, end = ARGS.length; i < end; i++) {
        if (ARGS[i] === '-t') {
            testDuration = ARGS[i + 1];
            i++;
        } else if (ARGS[i] === '-c') {
            connectionCount = ARGS[i + 1];
            i++;
        }
    }
}

const CONNECTION_COUNT = connectionCount || 3,
    TEST_DURATION = testDuration || 300;

console.log('#'.repeat(60));
console.log(`Starting benchmark for: ${testDuration} seconds with: ${connectionCount} connections`);
console.log('#'.repeat(60));

const DEFAULT_ARGUMENTS = ['autocannon', '-c', CONNECTION_COUNT, '-d', TEST_DURATION, '--renderStatusCodes'];

URL_LIST.forEach(url => {
    const fullPath = `${UFE_HOST}${url}`;

    console.log(`Running autocannon  test on URL: ${url}`);

    const instance = childProcess.spawn('npx', DEFAULT_ARGUMENTS.concat(fullPath), {
        cwd: process.cwd(),
        env: process.env
    });

    const messages = [],
        errors = [];
    instance.stdout.on('data', data => {
        messages.push(data.toString());
    });

    instance.stderr.on('data', data => {
        errors.push(data.toString());
    });

    instance.on('close', () => {
        console.log(messages.join(''));
        console.error(errors.join(''));
    });
});
