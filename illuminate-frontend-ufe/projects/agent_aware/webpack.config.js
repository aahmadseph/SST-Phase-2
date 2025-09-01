const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        path: path.resolve('./dist/cjs/chrome-extension'),
        filename: 'content.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        modules: ['node_modules', path.resolve('src')]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            React: 'react'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve('./chrome-extension'),
                    to: '.'
                }
            ]
        })
    ]
};
