#!/usr/bin/env node

const path = require('path');
const Jasmine = require('jasmine');
const { SpecReporter } = require('jasmine-spec-reporter');

const jrunner = new Jasmine({ projectBaseDir: path.resolve() });

jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;

// need env set early as possible
const NODE_PATH = `${process.cwd()}/projects/ui/src/`;

process.env.NODE_PATH = NODE_PATH;
process.env.NODE_ENV = 'production';
process.env.BUILD_MODE = 'isomorphic';
process.env.LOG_LEVEL = 'info';
process.env.COMPRESS_POST_DATA_TO_UFE = false;
process.env.DISABLE_COMPRESSION = false;
process.env.ENALBE_PROMETHEUS = false;
process.env.REDIS_AUTH_PASS = 'fake password for tests';
process.env.REDIS_USE_SSL = true;
process.env.REDIS_CONNECTION_POOL_SIZE = 1;

process.env.API_REQUEST_TIMEOUT = 100;
process.env.API_HOST = '10.0.0.1,10.0.0.2';

const BUILD_INFO = {
    'BUILD_NUMBER': 'UFE-node.js',
    'PROJECT_VERSION': 'Unknown-Local',
    'CODE_BRANCH': 'Unknown-Local',
    'BUILD_DATE': 'Fri Oct 16 2020 10:37:26 GMT-0700 (Pacific Daylight Time)',
    'GIT_BRANCH': 'Unknown-Local',
    'GIT_COMMIT': 'Unknown-Local'
};
process.env.BUILD_INFO = BUILD_INFO;

// jasmine >= 2.5.2, remove default reporter logs
jrunner.env.clearReporters();

// add jasmine-spec-reporter
jrunner.addReporter(new SpecReporter());

jrunner.loadConfig({
    'spec_dir': 'tests/spec',
    'spec_files': [
        '**/**.spec.js'
    ],
    random: false
});

jasmine.getEnv().allowRespy(true);

// delete all the server files before each test
beforeEach(() => {
    Object.keys(require.cache).filter(key => {
        return (key.indexOf('server/') > -1);
    }).forEach(item => {
        const cacheItem = require.resolve(item);
        delete require.cache[cacheItem];
    });
});

jrunner.execute();
