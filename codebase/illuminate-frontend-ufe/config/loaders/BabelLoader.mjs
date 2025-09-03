/*
 ** Transpiles ES6 and React JSX code.
 */
function getBabelLoader(options) {
    const nodeTarget = options.root && options.isomorphic;
    const targets = nodeTarget
        ? {
            // We set node version explicitly to break dependency on host node version or version in .nvmrc
            node: '22.12.0'
        }
        : [
            // https://confluence.sephora.com/wiki/display/ILLUMINATE/UFE+Browser+Support+Policy+-+Sprint+2023.19-+Sprint+2023.20
            'last 2 chrome versions',
            'last 2 edge versions',
            'last 2 firefox versions',
            'last 2 safari versions',
            'last 2 and_chr versions',
            'last 2 and_ff versions',
            'last 2 ios_saf versions'
        ];
    // https://browsersl.ist/#q=%22browserslist%22%3A+%5B%0A++++++++%22last+2+chrome+versions%22%2C%0A++++++++%22last+2+edge+versions%22%2C%0A++++++++%22last+2+firefox+versions%22%2C%0A++++++++%22last+2+safari+versions%22%2C%0A++++++++%22last+2+and_chr+versions%22%2C%0A++++++++%22last+2+and_ff+versions%22%2C%0A++++++++%22last+2+ios_saf+versions%22%0A++++%5D
    // Use "npx browserslist 'last 2 chrome versions, last 2 edge versions, last 2 ...'" to see list of supported browsers:
    // Example output on 10.26.2023:
    //   and_chr 117
    //   and_ff 118
    //   chrome 117
    //   chrome 116
    //   edge 117
    //   edge 116
    //   firefox 118
    //   firefox 117
    //   ios_saf 17.0
    //   ios_saf 16.6
    //   safari 17.0
    //   safari 16.6
    const loader = {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: [/node_modules/],
        use: {
            loader: 'babel-loader',
            options: {
                // This tells babel to use import or require based on which statement is already
                // being used in the document. Without this babel would default to import which
                // in turn would cause the webpack build to fail, since webpack cannot support
                // import and require in the same js module.
                // Documentation: https://babeljs.io/docs/en/options#sourcetype
                sourceType: 'unambiguous',
                presets: [
                    [
                        '@babel/preset-react',
                        {
                            runtime: 'automatic',
                            importSource: 'react'
                        }
                    ],
                    [
                        '@babel/preset-env',
                        {
                            useBuiltIns: 'entry',
                            corejs: '3.30',
                            targets
                        }
                    ],
                    '@emotion/babel-preset-css-prop'
                ],
                plugins: [
                    [
                        'babel-plugin-transform-react-remove-prop-types',
                        {
                            classNameMatchers: ['BaseClass'],
                            removeImport: true
                        }
                    ],
                    '@babel/plugin-transform-optional-chaining',
                    '@babel/plugin-transform-object-rest-spread',
                    '@babel/plugin-transform-class-properties'
                ]
            }
        }
    };

    if (!options.isomorphic) {
        loader.use.options.plugins.shift();
    }

    if (nodeTarget) {
        /*
         ** Excludes head scripts as those get transpiled by their own loader given that despite
         ** bundled in the root.bundle, head scripts run in the browser.
         */
        loader.exclude.push(/\w+.headScript\.js/);
    }

    if (options.optimized) {
        loader.use.options.cacheDirectory = true;

        if (options.test) {
            delete loader.exclude;
        }
    }

    return { loader };
}

export default getBabelLoader;
