/*
 ** Sets which variables/flags will be re-defined by the webpackDefinePlugin
 ** data.document: Throw an error if document is called during root build in front-end mode
 ** data.window: Throw an error if window is called during root build in front-end mode
 ** process.env: Replaces process.env.NODE_ENV statements with either 'development' or 'production'
 */
function getDefinePluginData(options) {
    const data = {};

    let processEnv = options.isomorphic ? { NODE_ENV: JSON.stringify('production') } : { NODE_ENV: JSON.stringify('development') };

    if (!options.root && options.test && options.test.testName) {
        // Display the test name in the CLI console as the tests are running
        // if the TESTNAME environment variable is set when running the tests
        processEnv = Object.assign({}, processEnv, { TESTNAME: options.test.testName });
    }

    data['process.env'] = processEnv;
    data['Sephora.isAgent'] = options.agentAwareSite;
    /* Since Sephora.isNodeRender has fixed values for server and client side bundles      *
     * we can replace the variable with the value it'll receive on each bundle.            *
     * This way we can strip out unnecesary blocks when minify/uglify process takes places.*/
    data['Sephora.isNodeRender'] = JSON.stringify(options.isNodeRender || false);
    data['Sephora.isTestsBuild'] = !!options.test;
    data['Sephora.isIsomorphicBuild'] = !!options.isomorphic;
    data['Sephora.isJestEnv'] = false;

    return data;
}

export default getDefinePluginData;
