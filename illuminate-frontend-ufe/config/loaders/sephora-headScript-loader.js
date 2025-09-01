/**
 * General purpose loader to manipulate head scripts
 */
const Terser = require('terser');
const babel = require('@babel/core');

async function headScripLoader(sourceCode) {
    const { isomorphic = false } = this.query;

    const transform = babel.transformSync ? babel.transformSync : babel.transform;
    const { code: transformedCode } = transform(sourceCode, {
        babelrc: false,
        comments: false,
        sourceType: 'module',
        plugins: ['@babel/plugin-transform-object-rest-spread', './config/babel/sephora-gql-plugin'],
        presets: ['@babel/preset-env', '@babel/preset-react']
    });

    if (!isomorphic) {
        return transformedCode;
    }

    const { code: minimizedCode, error } = await Terser.minify(transformedCode);

    if (error) {
        throw new Error(`sephora-headScript-loader Terser: ${error}`);
    }

    return minimizedCode;
}

module.exports = headScripLoader;
