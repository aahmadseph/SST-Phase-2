/* eslint-disable indent */
/* eslint-disable no-console */
import path from 'path';
import webpack from 'webpack';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createGqlFilesToManifestMapping } from '../babel/sephora-gql-plugin-utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setup() {
    // Set the working directory context to the project root where plugin expects config
    const originalCwd = process.cwd();
    const projectRoot = path.resolve(__dirname, '../../../..');

    try {
        // Ensure GQL files are mapped and the manifest is created
        console.log('[setup] Waiting for GQL manifest to be created...');
        console.log('[setup] Working directory:', process.cwd());

        // We need to call the function from the ui directory context
        // SB fails if it can't find the gql files
        process.chdir(path.join(projectRoot, 'projects/ui'));
        await createGqlFilesToManifestMapping();

        // Ensure the config file exists at root level for plugin
        const configSource = path.resolve('../babel/sephora-gql-plugin-config.json');
        const configTarget = path.resolve(projectRoot, '../babel/sephora-gql-plugin-config.json');

        // Create root config directory if it doesn't exist
        const rootConfigDir = path.dirname(configTarget);

        if (!fs.existsSync(rootConfigDir)) {
            fs.mkdirSync(rootConfigDir, { recursive: true });
        }

        // Copy the config to root level
        if (fs.existsSync(configSource)) {
            fs.copyFileSync(configSource, configTarget);
            console.log('[setup] Config copied to root level for plugin access');
        }

        console.log('[setup] GQL manifest created successfully!');
    } finally {
        // Ensure we return to the original working directory
        process.chdir(originalCwd);
    }

    // Add Storybook specific configuration
    return {
        stories: ['../../src/**/*.mdx', '../../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
        addons: ['@storybook/addon-essentials'],
        framework: {
            name: '@storybook/react-webpack5',
            options: {
                legacyRootApi: true
            }
        },
        babel: async options => {
            options.plugins.push([path.resolve(__dirname, '../babel/sephora-gql-plugin.js')]);

            return options;
        },
        webpackFinal: async config => {
            // Aliases added for Storybook to resolve paths correctly
            config.resolve.alias = {
                ...config.resolve.alias,
                store: path.resolve(__dirname, '../../src/store'),
                Store: path.resolve(__dirname, '../../src/store/Store.js'),
                reducers: path.resolve(__dirname, '../../src/reducers'),
                actions: path.resolve(__dirname, '../../src/actions'),
                Actions: path.resolve(__dirname, '../../src/actions/Actions.js'),
                Authentication: path.resolve(__dirname, '../../src/utils/Authentication.js'),
                '@emotion/react': path.resolve(__dirname, '../../../../node_modules/@emotion/react'),
                '@emotion/css': path.resolve(__dirname, '../../../../node_modules/@emotion/css'),
                '@emotion/server': path.resolve(__dirname, '../../../../node_modules/@emotion/server'),
                '@emotion/styled': path.resolve(__dirname, '../../../../node_modules/@emotion/styled'),
                '@emotion/cache': path.resolve(__dirname, '../../../../node_modules/@emotion/cache'),
                components: path.resolve(__dirname, '../../src/components'),
                style: path.resolve(__dirname, '../../src/style'),
                framework: path.resolve(__dirname, '../../src/utils/framework'),
                utils: path.resolve(__dirname, '../../src/utils'),
                exceptions: path.resolve(__dirname, '../../src/exceptions'),
                constants: path.resolve(__dirname, '../../src/constants'),
                viewModel: path.resolve(__dirname, '../../src/viewModel'),
                analytics: path.resolve(__dirname, '../../src/analytics'),
                ai: path.resolve(__dirname, '../../src/ai'),
                services: path.resolve(__dirname, '../../src/services'),
                selectors: path.resolve(__dirname, '../../src/selectors'),
                hocs: path.resolve(__dirname, '../../src/hocs'),
                pages: path.resolve(__dirname, '../../src/pages'),
                config: path.resolve(__dirname, '../../src/config'),
                BraintreeClient: path.resolve(__dirname, 'mocks/emptyModule.js'),
                BraintreePayPal: path.resolve(__dirname, 'mocks/emptyModule.js'),
                BraintreeVenmo: path.resolve(__dirname, 'mocks/emptyModule.js'),
                Fingerprint: path.resolve(`${__dirname}/../thirdparty/fp.min.js`),
                thirdparty: path.resolve(__dirname, '../../src/thirdparty'),
                // Mock external dependencies that aren't needed for Storybook
                NProgressBarLib: path.resolve(__dirname, 'mocks/emptyModule.js'),
                'thirdparty/confetti': path.resolve(__dirname, '../../src/thirdparty/confetti.js'),
                'thirdparty/frt': path.resolve(__dirname, '../../src/thirdparty/frt.js'),
                confetti: path.resolve(__dirname, '../../src/thirdparty/confetti.js'),
                frt: path.resolve(__dirname, '../../src/thirdparty/frt.js')
            };

            // Custom extensions for SB to resolve
            config.resolve.extensions.push('.f.jsx', '.ctrlr.jsx', '.es6.jsx', '.jsx', '.js', '.ts', '.tsx');

            // Fallbacks to avoid Node polyfills
            config.resolve.fallback = {
                ...config.resolve.fallback,
                // eslint-disable-next-line camelcase
                perf_hooks: false,
                fs: false,
                path: false,
                crypto: false
            };

            // Needed for Storybook to define global constants
            config.plugins.push(
                new webpack.DefinePlugin({
                    'process.env.BUILD_NUMBER': JSON.stringify('UFE-node.js'),
                    'Sephora.buildInfo': JSON.stringify({
                        BUILD_NUMBER: 'UFE-node.js'
                    }),
                    'global.process.env.UFE_ENV': JSON.stringify('local'),
                    'global.process.env.NODE_ENV': JSON.stringify('development'),
                    Sephora: `(function() {
                        var sephoraObj = ${JSON.stringify({
                            isNodeRender: false,
                            isAgent: false,
                            isTestsBuild: false,
                            isIsomorphicBuild: false,
                            isJestEnv: false,
                            configurationSettings: {
                                ignoreATGDynAndJsessionId: false,
                                core: {
                                    disableHOCWrapping: false
                                }
                            }
                        })};
                        sephoraObj.Util = {
                            onLastLoadEvent: function() { /* mock function for storybook */ },
                            Perf: {
                                loadEvents: []
                            }
                        };
                        return sephoraObj;
                    })()`,
                    'globalThis.__DEV__': JSON.stringify(true)
                })
            );

            return config;
        }
    };
}

export default setup();
