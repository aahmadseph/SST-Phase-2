// manage the environment
// centralize the location of the checks for prod / qa / localStorage
import Constants from '#server/shared/Constants.mjs';

const {
    NODE_ENV_PRODUCTION, NODE_ENV_DEVELOPMENT, UFE_ENV_PRODUCTION, UFE_ENV_QA, UFE_ENV_LOCAL
} = Constants;
const ufeEnv = global.process.env.UFE_ENV;
const nodeEnv = global.process.env.NODE_ENV;

// these are build time variables
// once these are set they do not change after the build
// react and other libraries rely on NODE_ENV set to production
// and then strip out code to lighten the libraries
const isNodeEnvProduction = nodeEnv === NODE_ENV_PRODUCTION;
const isNodeEnvDevelopment = nodeEnv === NODE_ENV_DEVELOPMENT;

// these are runtime variables
// these are used to determine if we are in QA, LOCAL or PROD
// we use these for analytics and determining if we should use
// a production endpoint or test endpoint
const isUfeEnvProduction = ufeEnv === UFE_ENV_PRODUCTION;
const isUfeEnvQA = ufeEnv === UFE_ENV_QA;
const isUfeEnvLocal = ufeEnv === UFE_ENV_LOCAL;

// TODO: if we switch to export, server tests will break with SyntaxError: Unexpected token 'export'
// we need to configure server folder/env to accept export and export default syntax.
export default {
    isUfeEnvProduction,
    isUfeEnvQA,
    isUfeEnvLocal,
    isNodeEnvProduction,
    isNodeEnvDevelopment
};
