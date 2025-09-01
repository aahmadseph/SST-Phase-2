import { createGqlFilesToManifestMapping } from './config/babel/sephora-gql-plugin-utils.mjs';
import getBabelLoader from '../../config/loaders/BabelLoader.mjs';

// prettier-ignore
export default async () => {
    await createGqlFilesToManifestMapping();
    const { loader: { use: { options: { presets, plugins } } } } = getBabelLoader({});
    plugins.unshift([
        'babel-plugin-module-resolver',
        {
            root: ['./src/'],
            extensions: ['.js', '.mjs', '.jsx', '.f.jsx', '.ctrlr.jsx', '.es6.jsx'],
            alias: {
                Actions: './src/actions/Actions.js',
                Authentication: './src/utils/Authentication.js',
                BraintreeClient: './thirdparty/braintree/client.min.js',
                BraintreePayPal: './thirdparty/braintree/paypal.min.js',
                BraintreeVenmo: './thirdparty/braintree/venmo.min.js',
                Fingerprint: './thirdparty/fp.min.js',
                Store: './src/store/Store.js',
                utils: './src/utils'
            }
        }
    ]);
    plugins.unshift('./config/babel/sephora-gql-plugin');

    return {
        collectCoverage: true,
        collectCoverageFrom: [
            'src/**/*.{js,jsx,mjs}',
            '!src/examples/**/*.*',
            '!src/gpc/**/*.*',
            '!src/thirdparty/**/*.*'
        ],
        coverageDirectory: '<rootDir>/__tests__/coverage',
        coverageReporters: [
            'lcov',
            'text-summary'
        ],
        moduleDirectories: [
            'node_modules',
            '<rootDir>/__tests__'
        ],
        roots: [
            '<rootDir>/__tests__/actions/',
            '<rootDir>/__tests__/analytics/',
            '<rootDir>/__tests__/components/',
            '<rootDir>/__tests__/reducers/',
            '<rootDir>/__tests__/selectors/',
            '<rootDir>/__tests__/services/',
            '<rootDir>/__tests__/viewModel/',
            '<rootDir>/__tests__/utils/'
        ],
        globalSetup: '<rootDir>/__tests__/config/global.setup.mjs',
        setupFilesAfterEnv: [
            '<rootDir>/__tests__/config/jest.setup.mjs'
        ],
        testEnvironment: 'jest-fixed-jsdom',
        testEnvironmentOptions: {
            customExportConditions: [''],
            url: 'http://localhost/',
            pretendToBeVisual: true,
            resources: 'usable',
            runScripts: 'dangerously'
        },
        transform: {
            '\\.(j|mj|t)sx?$': ['babel-jest', {
                presets,
                plugins
            }]
        }
    };
};
