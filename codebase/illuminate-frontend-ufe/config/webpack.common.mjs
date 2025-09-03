import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import CustomCrypto from './CustomCrypto.mjs';
import getBabelLoader from './loaders/BabelLoader.mjs';
import getDefinePluginData from './libs/DefinePluginData.mjs';
import IsomorphicNodePlugin from './plugins/IsomorphicNodePlugin.mjs';
import LocalizationPlugin from './plugins/LocalizationPlugin.mjs';
import PagesPlugin from './plugins/PagesPlugin.mjs';
import ChunkFilesPlugin from './plugins/ChunkFilesPlugin.mjs';
import FailOnWarningsPlugin from './plugins/FailOnWarningsPlugin.mjs';
import path from 'path';
import TerserPlugin from 'terser-webpack-plugin';
import transformAdobeFiles from './libs/transformAdobeFiles.mjs';
import transformBuildInfo from './libs/transformBuildInfo.mjs';
import webpack from 'webpack';
import { createGqlFilesToManifestMapping } from '../projects/ui/config/babel/sephora-gql-plugin-utils.mjs';

await createGqlFilesToManifestMapping();

const baseDir = process.cwd();

const { IgnorePlugin, DefinePlugin } = webpack;
const ONE_KILOBYTE = 1024;
const ONE_MEGABYTE = ONE_KILOBYTE * 1024;

/*
 ** Allows root and client build to extend the base configuration
 */
const extendBaseConfiguration = (options, mergeWithNewConfiguration) => {
    const babelLoader = getBabelLoader(options);
    const baseConfiguration = {
        name: options.name,
        mode: options.isomorphic ? 'production' : 'development',
        bail: options.isomorphic,
        context: baseDir,
        module: {
            rules: [
                {
                    test: /(pages.*(?<!\.ctrlr)(?<!\.es6)(?<!\.f)\.jsx$)|(components.*(?<!\.ctrlr)(?<!\.es6)(?<!\.f)\.jsx$)|(components.*\.c\.js$)/,
                    exclude: /node_modules/,
                    use: {
                        loader: path.resolve('config/loaders/sephora-jsx-loader'),
                        options: {
                            name: options.name,
                            test: !!options.test
                        }
                    },
                    enforce: 'pre'
                },
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    include: path.resolve('./src'),
                    use: { loader: 'thread-loader', options: { workers: 4 } }
                },
                {
                    test: /\.(graphql|gql)$/,
                    exclude: /node_modules/,
                    loader: 'sephora-gql-loader'
                },
                babelLoader.loader,
                {
                    test: /\w+.headScript\.js/,
                    use: {
                        loader: path.resolve('../../config/loaders/sephora-headScript-loader'),
                        options
                    }
                },
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    include: path.resolve('./src'),
                    use: { loader: 'coverage-istanbul-loader', options: { esModules: true } },
                    enforce: 'post'
                }
            ]
        },
        devtool: options.sourceMap,
        resolve: {
            alias: {
                Store: path.resolve(`${baseDir}/src/store/Store.js`),
                Actions: path.resolve(`${baseDir}/src/actions/Actions.js`),
                Authentication: path.resolve(`${baseDir}/src/utils/Authentication.js`),
                BraintreeClient: path.resolve(`${baseDir}/thirdparty/braintree/client.min.js`),
                BraintreePayPal: path.resolve(`${baseDir}/thirdparty/braintree/paypal.min.js`),
                BraintreeVenmo: path.resolve(`${baseDir}/thirdparty/braintree/venmo.min.js`),
                Fingerprint: path.resolve(`${baseDir}/thirdparty/fp.min.js`),
                ai: path.resolve(`${baseDir}/src/ai`),
                '@emotion/react': path.resolve(baseDir, '../../node_modules/@emotion/react'),
                '@emotion/css': path.resolve(baseDir, '../../node_modules/@emotion/css'),
                '@emotion/server': path.resolve(baseDir, '../../node_modules/@emotion/server'),
                '@emotion/styled': path.resolve(baseDir, '../../node_modules/@emotion/styled'),
                '@emotion/cache': path.resolve(baseDir, '../../node_modules/@emotion/cache')
            },
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.f.jsx', '.ctrlr.jsx', '.es6.jsx'],
            modules: ['node_modules', path.resolve('./src'), path.resolve('./thirdparty')]
        },
        resolveLoader: {
            extensions: ['.js', '.mjs'],
            modules: ['node_modules', '../../config/loaders']
        },
        plugins: [
            new FailOnWarningsPlugin(options),
            new PagesPlugin(options),
            new LocalizationPlugin(options),
            new DefinePlugin(getDefinePluginData(options)),
            new DefinePlugin({ 'globalThis.__DEV__': !options.isomorphic }),
            new CaseSensitivePathsPlugin(),
            new ESLintPlugin({
                context: './src',
                extensions: ['js', 'jsx'],
                failOnWarning: true
            })
        ],
        stats: {
            chunks: true,
            errorDetails: true,
            modules: true
        }
    };

    if (!options.test) {
        baseConfiguration.module.rules.pop();
    }

    if (options.watcher) {
        baseConfiguration.watchOptions = {
            aggregateTimeout: 600,
            ignored: /dist/
        };
    }

    const newConfiguration = mergeWithNewConfiguration(baseConfiguration);

    if (options.test) {
        newConfiguration.performance.maxEntrypointSize = ONE_MEGABYTE * 100;
        newConfiguration.performance.maxAssetSize = ONE_MEGABYTE * 100;
    }

    if (options.analyse) {
        newConfiguration.plugins.push(
            new BundleAnalyzerPlugin({
                analyzerMode: 'static',
                openAnalyzer: true,
                reportFilename: '../../../../logs/statistics.html'
            })
        );
    }

    return newConfiguration;
};

/*
 ** Browser build
 */
const getClientBuild = buildOptions =>
    extendBaseConfiguration(buildOptions, baseConfiguration => {
        const entry = path.resolve('./src/app.js');
        const outputPath = path.resolve('../ui/dist/cjs', buildOptions.agentAwareSite ? 'agent' : 'isomorphic');
        const publicPath = `/js/ufe/${buildOptions.agentAwareSite ? 'agent' : 'isomorphic'}/`;
        let shouldHash = false;
        let hashValue = '';
        let minimize = false;
        let minimizer = [];

        if (buildOptions.isomorphic) {
            minimize = true;
            minimizer = [new TerserPlugin()];

            if (!buildOptions.watcher) {
                shouldHash = true;
                const cryptoHash = new CustomCrypto();
                hashValue = `.${cryptoHash.update().digest()}`;
            }
        }

        const uiConfiguration = {
            entry,
            performance: {
                maxEntrypointSize: ONE_MEGABYTE * 4,
                maxAssetSize: ONE_MEGABYTE * 4
            },
            plugins: [
                new ChunkFilesPlugin(buildOptions),
                ...baseConfiguration.plugins,
                new CopyWebpackPlugin({
                    patterns: [
                        {
                            from: path.resolve('./thirdparty'),
                            to: 'thirdparty',
                            transform: transformAdobeFiles
                        },
                        {
                            from: path.resolve('../server/src/config/buildInfo.json'),
                            to: 'config/build.txt',
                            transform: transformBuildInfo
                        }
                    ]
                }),
                new WebpackManifestPlugin()
            ],
            optimization: {
                splitChunks: {
                    cacheGroups: {
                        commons: {
                            name: 'commons',
                            chunks: 'all',
                            minChunks: 2,
                            reuseExistingChunk: true
                        },
                        defaultVendors: false,
                        default: false
                    }
                },
                minimize,
                minimizer
            },
            output: {
                path: outputPath,
                filename: `main.bundle${hashValue}.js`,
                publicPath,
                chunkFilename: `[name].chunk${hashValue}.js`,
                devtoolModuleFilenameTemplate: 'ComponentBuild/[resource]'
            }
        };

        if (shouldHash) {
            uiConfiguration.plugins.unshift(new CleanWebpackPlugin());
        }

        return {
            ...baseConfiguration,
            ...uiConfiguration
        };
    });

/*
 ** Server build
 */
const getRootBuild = options =>
    extendBaseConfiguration(options, baseConfiguration => {
        let entry = path.resolve('./src/app-root.js');
        let target = 'web';
        let headScriptAssetType = 'asset/resource';
        let outputPath = path.resolve('../ui/dist/cjs/frontend');

        // for SSR UFE we want to be able to split the bundles into smaller size
        // this will allow UFE to run in a smaller docker container
        // FE mode maintains default behavior
        const isoModeFilenameFunction = options.agentAwareSite
            ? pathData => {
                return pathData.chunk.name === 'main' ? 'agent.root.bundle.js' : 'agent.[name].bundle.js';
            }
            : pathData => {
                return pathData.chunk.name === 'main' ? 'root.bundle.js' : '[name].bundle.js';
            };
        const filename = options.isomorphic ? isoModeFilenameFunction : (options.agentAwareSite ? 'agent.' : '') + 'root.bundle.js';

        let publicPath = '/js/ufe/frontend';
        let libraryType = 'var';

        if (options.isomorphic) {
            entry = path.resolve('./src/utils/framework/InflateRoot.js');
            target = 'node';
            headScriptAssetType = 'asset/source';
            outputPath = path.resolve('../ui/dist/cjs/backend');
            publicPath = options.agentAwareSite ? '/agent' : '';
            libraryType = 'commonjs2';
        }

        // eslint-disable-next-line no-shadow
        const windowPluginFunction = (v, target) => {
            const res = v.module.resource;
            const exclusionKeywords = ['node_modules', 'headScript', 'build'];

            if (!exclusionKeywords.some(keyword => res.includes(keyword))) {
                return '(((Sephora.Msg && console.error(Sephora.Msg.Error.WindowInRoot)) || 1) && undefined)';
            }

            return target;
        };

        // part 2 of UFE SSR splitting chunks
        // FE mode maintains default behavior
        const splitChunks = options.isomorphic
            ? {
                chunks: 'all',
                minChunks: 5,
                maxSize: 5000000,
                cacheGroups: {
                    default: {
                        name: 'chunk',
                        priority: 5,
                        enforce: true,
                        reuseExistingChunk: true
                    }
                }
            }
            : false;

        const serverConfiguration = {
            entry,
            performance: {
                maxEntrypointSize: ONE_MEGABYTE * 20,
                maxAssetSize: ONE_MEGABYTE * 5
            },
            plugins: [
                new IsomorphicNodePlugin(options),
                ...baseConfiguration.plugins,
                // This will exlude InflateComponents from the server side build
                // This is done to avoid requiring inPageList.js which won't be generated until the
                // front end build starts. It may also help reduce the server side bundle size.
                new IgnorePlugin({ resourceRegExp: /utils\/framework\/InflateComponents/ }),
                new webpack.DefinePlugin({
                    ...(!options.isomorphic
                        ? {
                            window: webpack.DefinePlugin.runtimeValue(v => windowPluginFunction(v, 'window'), []),
                            document: webpack.DefinePlugin.runtimeValue(v => windowPluginFunction(v, 'document'), [])
                        }
                        : {})
                })
            ],
            target,
            optimization: {
                minimize: false,
                splitChunks: splitChunks
            },
            module: {
                rules: [
                    {
                        test: /cookieSpoof.js$/,
                        type: 'asset/source'
                    },
                    {
                        test: /.headScript.js$/,
                        type: headScriptAssetType,
                        generator: { filename: '[name][ext]' }
                    },
                    ...baseConfiguration.module.rules
                ]
            },
            output: {
                path: outputPath,
                filename,
                publicPath,
                library: {
                    name: 'RootBuild',
                    type: libraryType
                },
                devtoolModuleFilenameTemplate: 'RootBuild/[resource]'
            }
        };

        if (options.isomorphic) {
            /*
             ** Node can grab dependencies right off node_modules, no need to bundle vendor code
             */
            serverConfiguration.externals = /^(?!exceptions)([a-z\-0-9]+)$/;
            serverConfiguration.devtool = false;
            delete serverConfiguration.output.devtoolModuleFilenameTemplate;
        }

        return {
            ...baseConfiguration,
            ...serverConfiguration
        };
    });

// prettier-ignore
export {
    getClientBuild,
    getRootBuild
};
