import { getEnvProp } from '../server/src/utils/serverUtils.mjs';
import { getRootBuild, getClientBuild } from '../../config/webpack.common.mjs';

// Initialize constants from environment variables set when running webpack build in command line
// see package.json for more details.
const watchMode = process.argv.indexOf('--watch') > -1;
const BUILD_OPTIMIZATIONS = getEnvProp('BUILD_OPTIMIZATIONS', false);
const ANALYSE = getEnvProp('ANALYSE', false);
const NO_SOURCE_MAP = getEnvProp('NO_SOURCE_MAP', false);
const BUILD_TESTS = getEnvProp('TEST_BUILD', false);
const SHOW_TESTNAME = getEnvProp('TESTNAME', false);
const BUILD_MODE = getEnvProp('BUILD_MODE', false);
const TEST_INSTRUMENTATION = getEnvProp('TEST_INSTRUMENTATION', false);
const AGENT_AWARE_BUILD_MODE = getEnvProp('AGENT_AWARE_BUILD_MODE', false);

const buildOptions = {
    isomorphic: BUILD_MODE !== 'frontend',
    optimized: BUILD_OPTIMIZATIONS,
    agentAwareSite: AGENT_AWARE_BUILD_MODE,
    watcher: watchMode,
    analyse: ANALYSE,
    sourceMap: NO_SOURCE_MAP ? false : 'source-map',
    test: BUILD_TESTS && {
        instrumentation: TEST_INSTRUMENTATION,
        testName: SHOW_TESTNAME
    }
};
const serverConfiguration = getRootBuild({
    ...buildOptions,
    root: true,
    name: 'RootBuild',
    isNodeRender: true
});
const uiConfiguration = getClientBuild({
    ...buildOptions,
    root: false,
    name: 'ComponentBuild',
    isNodeRender: false
});

// eslint-disable-next-line no-console
console.log(`Sephora webpack build options
    isomorphic: ${buildOptions.isomorphic}
    optimized: ${buildOptions.optimized}
    watcher: ${buildOptions.watcher}
    sourceMap: ${buildOptions.sourceMap}
    analyse: ${buildOptions.analyse}
    testBuild: ${buildOptions.test !== false}
    testInstrumentation: ${buildOptions.test && buildOptions.test.instrumentation}
    testName: ${buildOptions.test && buildOptions.test.testName}
    agentAwareSite: ${buildOptions.agentAwareSite}
`);

const buildConfigurations = [serverConfiguration, uiConfiguration];

export default buildConfigurations;
