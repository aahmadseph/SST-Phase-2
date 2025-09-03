/* eslint-disable no-console */
const fs = require('fs');

module.exports = async function (config) {
    const serverUtils = await import('../../projects/server/src/utils/serverUtils.mjs');
    const { getEnvProp } = serverUtils;
    const logLevel = getEnvProp('SHOW_LOGS', false) ? config.LOG_INFO : config.LOG_ERROR;
    const isSpecReporter = getEnvProp('USE_SPEC_REPORTER', false);
    const testInstrumentation = getEnvProp('TEST_INSTRUMENTATION', false);
    const noSourceMap = getEnvProp('NO_SOURCE_MAP', false);
    const uiBuildPath = 'dist/cjs/isomorphic';
    const testsEntryPoint = './tests/tests.webpack.js';

    const {
        default: [, webpack]
    } = await import('./webpack.config.mjs');
    delete webpack.entry;
    delete webpack.output.filename;
    webpack.optimization.minimize = false;
    webpack.optimization.splitChunks = { name: false };

    if (!fs.existsSync(uiBuildPath)) {
        try {
            fs.mkdirSync(uiBuildPath, { recursive: true });
            console.log(`Directory "${uiBuildPath}" created successfully.`);
        } catch (error) {
            console.error(`Error creating directory "${uiBuildPath}": ${error}`);
        }
    } else {
        console.log(`Directory "${uiBuildPath}" already exists.`);
    }

    const karmaConfig = {
        port: 9876,
        colors: true,
        concurrency: 1,
        browsers: ['CustomChromeHeadless'],
        customLaunchers: {
            CustomChromeHeadless: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-setuid-sandbox'] // needed for docker
            }
        },
        browserDisconnectTolerance: 5,
        browserNoActivityTimeout: 100000,
        browserDisconnectTimeout: 60000,
        reportSlowerThan: 1000,
        plugins: [
            require('karma-parallel'),
            'karma-*',
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-webpack',
            'karma-spec-reporter',
            'karma-sourcemap-loader'
        ],
        frameworks: ['parallel', 'jasmine', 'webpack'],
        parallelOptions: {
            executors: 6,
            shardStrategy: 'round-robin'
        },
        client: {
            captureConsole: true,
            jasmine: {
                random: false,
                timeoutInterval: 100000
            }
        },
        files: [testsEntryPoint],
        exclude: [],
        preprocessors: { [testsEntryPoint]: ['webpack', 'sourcemap'] },
        webpack,
        webpackMiddleware: { stats: 'errors-only' },
        reporters: [isSpecReporter ? 'spec' : 'dots'],
        logLevel,
        browserConsoleLogOptions: {
            level: 'log',
            format: '%b %T: %m',
            terminal: true
        }
    };

    if (noSourceMap) {
        delete karmaConfig.webpack.devtool;
        karmaConfig.plugins.pop();
        karmaConfig.preprocessors[testsEntryPoint].pop();
    }

    if (testInstrumentation) {
        karmaConfig.plugins.push('karma-htmlfile-reporter');
        karmaConfig.reporters.push('html');
        karmaConfig.htmlReporter = {
            outputFile: './tests/output/unit_tests_results.html',
            pageTitle: 'UFE Unit tests results with timings',
            subPageTitle: 'frontend only tests',
            useCompactStyle: true,
            useLegacyStyle: true
        };

        karmaConfig.plugins.push('karma-coverage-istanbul-reporter');
        karmaConfig.reporters.push('coverage-istanbul');
        karmaConfig.coverageIstanbulReporter = {
            reports: ['html', 'cobertura', 'text-summary', 'lcov'],
            dir: 'tests/output',
            'report-config': {
                html: { subdir: 'html' },
                cobertura: {
                    subdir: 'cobertura',
                    file: 'cobertura.xml'
                }
            },
            thresholds: {
                emitWarning: false,
                global: {
                    statements: 0,
                    branches: 0,
                    functions: 0,
                    lines: 0
                }
            }
        };
    }

    if (config.logConfig) {
        console.log('Karma run options:');
        console.dir(karmaConfig);
    }

    config.set(karmaConfig);
};
