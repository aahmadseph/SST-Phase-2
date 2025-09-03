// This pligin provides a solution for the "issue" appeared after upgrading to webpack 5.
// Webpack 5 doesn't polyfill node core modules anymore for browsers:
//   https://github.com/webpack/webpack/pull/8460
//   https://github.com/webpack/changelog-v5/issues/10
//   https://github.com/webpack/node-libs-browser
// This pluging adds polyfills for node core modules as it was before in Webpack 4.
import webpack from 'webpack';

const { ProvidePlugin } = webpack;

class IsomorphicNodePlugin {
    constructor(options) {
        if (!options) {
            throw new Error('Argument "options" is required.');
        }

        this.options = options;
    }

    apply(compiler) {
        if (this.options.isomorphic) {
            return;
        }

        compiler.options.node = { global: false };

        compiler.options.plugins.push(
            new ProvidePlugin({
                Buffer: ['buffer/', 'Buffer'],
                console: 'console-browserify',
                process: 'process/browser'
            })
        );

        compiler.options.resolve.fallback = {
            // assert: require.resolve('assert/'),
            buffer: 'buffer/',
            console: 'console-browserify',
            // constants: require.resolve('constants-browserify'),
            // crypto: require.resolve('crypto-browserify'),
            // domain: require.resolve('domain-browser'),
            // events: require.resolve('events/'),
            // http: require.resolve('stream-http'),
            // https: require.resolve('https-browserify'),
            // os: require.resolve('os-browserify/browser'),
            // path: require.resolve('path-browserify'),
            // punycode: require.resolve('punycode/'),
            process: 'process/browser',
            // querystring: require.resolve('querystring-es3'),
            stream: 'stream-browserify',
            /* eslint-disable camelcase */
            // _stream_duplex: require.resolve('readable-stream/lib/_stream_duplex'),
            // _stream_passthrough: require.resolve('readable-stream/lib/_stream_passthrough'),
            // _stream_readable: require.resolve('readable-stream/lib/_stream_readable'),
            // _stream_transform: require.resolve('readable-stream/lib/_stream_transform'),
            // _stream_writable: require.resolve('readable-stream/lib/_stream_writable'),
            // string_decoder: require.resolve('string_decoder/'),
            /* eslint-enable camelcase */
            // sys: require.resolve('util/'),
            // timers: require.resolve('timers-browserify'),
            // tty: require.resolve('tty-browserify'),
            // url: require.resolve('url/'),
            // util: require.resolve('util/'),
            // vm: require.resolve('vm-browserify'),
            // zlib: require.resolve('browserify-zlib'),
            ...(compiler.options.resolve.fallback || {})
        };
    }
}

export default IsomorphicNodePlugin;
