// manage the environment
// centralize the location of the checks for prod / qa / localStorage
const Constants = require('utils/framework/Constants');

const ufeEnv = global.process.env.UFE_ENV;
const nodeEnv = global.process.env.NODE_ENV;

// these are build time variables
// once these are set they do not change after the build
// react and other libraries rely on NODE_ENV set to production
// and then strip out code to lighten the libraries
const isNodeEnvProduction = nodeEnv === Constants.NODE_ENV_PRODUCTION;
const isNodeEnvDevelopment = nodeEnv === Constants.NODE_ENV_DEVELOPMENT;

// these are runtime variables
// these are used to determine if we are in QA, LOCAL or PROD
// we use these for analytics and determining if we should use
// a production endpoint or test endpoint
const isUfeEnvProduction = ufeEnv === Constants.UFE_ENV_PRODUCTION;
const isUfeEnvQA = ufeEnv === Constants.UFE_ENV_QA;
const isUfeEnvLocal = ufeEnv === Constants.UFE_ENV_LOCAL;

const getCurrentEnv = function () {
    const currentHost = Sephora.imageHost;
    let currentEnv;

    if (isUfeEnvProduction) {
        currentEnv = 'production';
    } else if (isUfeEnvQA || isUfeEnvLocal) {
        if (currentHost?.includes('qa3')) {
            currentEnv = 'qa3';
        } else if (currentHost?.includes('qa4')) {
            currentEnv = 'qa4';
        }
    }

    if (!currentEnv) {
        // eslint-disable-next-line no-console
        console.warn(`The env was not recognized by the host: [${currentHost}]`);
    }

    return currentEnv;
};

// TODO: if we switch to export, server tests will break with SyntaxError: Unexpected token 'export'
// we need to configure server folder/env to accept export and export default syntax.
module.exports = {
    isUfeEnvProduction,
    isUfeEnvQA,
    isUfeEnvLocal,
    isNodeEnvProduction,
    isNodeEnvDevelopment,
    getCurrentEnv
};
