/* eslint object-curly-newline: 0 */
// default environment configuration
import os from 'node:os';

import {
    UNKNOWN_LOCAL_BUILD,
    LOCAL_NODEJS_BUILD
} from '#server/config/Constants.mjs';
import {
    getEnvProp
} from '#server/utils/serverUtils.mjs';
import {
    HOUR,
    MINUTE,
    SECOND
} from '#server/config/TimeConstants.mjs';

import Constants from '#server/shared/Constants.mjs';
import EnvPkg from '#server/shared/Env.mjs';
const {
    isUfeEnvProduction,
    isUfeEnvQA,
    isUfeEnvLocal,
    isNodeEnvProduction,
    isNodeEnvDevelopment
} = EnvPkg;
const FRAMEWORK_CONSTANTS = {
    ...Constants
};

// centrailize this code
function getUfeENVProp() {
    const ufeEnvVal = getEnvProp('UFE_ENV', Constants.UFE_ENV_QA);
    const UFE_ENV = (Constants.VALID_UFE_ENVS.indexOf(ufeEnvVal) > -1 ? ufeEnvVal : Constants.UFE_ENV_QA);
    process.env.UFE_ENV = UFE_ENV;

    return UFE_ENV;
}

const UFE_ENV = getUfeENVProp();

// NOTE: node treats ALL env variables as strings so this converts to true or false
// env variables
const AGENT_AWARE_SITE_ENABLED = getEnvProp('AGENT_AWARE_SITE_ENABLED', false),
    AUTOMATION_TARGETS = getEnvProp('AUTOMATION_TARGETS', false),
    APPLICATION_NAME = getEnvProp('APPLICATION_NAME'),
    BUILD_MODE = getEnvProp('BUILD_MODE', 'isomorphic'),
    DISABLE_COMPRESSION = getEnvProp('DISABLE_COMPRESSION', false),
    ENABLE_CANARY_RELEASE = getEnvProp('ENABLE_CANARY_RELEASE', false),
    ENABLE_COMPONENT_CACHING = getEnvProp('ENABLE_COMPONENT_CACHING', true),
    ENABLE_GC_COLLECTION = getEnvProp('ENABLE_GC_COLLECTION', false),
    ENABLE_PREVIEW = getEnvProp('ENABLE_PREVIEW', false),
    ENABLE_SEO = getEnvProp('ENABLE_SEO', false),
    ENABLE_PROMETHEUS = getEnvProp('ENABLE_PROMETHEUS', true),
    HOSTNAME = getEnvProp('HOSTNAME', os.hostname()),
    LOG_GC_PROFILE = getEnvProp('LOG_GC_PROFILE', false),
    LOG_LEVEL = getEnvProp('LOG_LEVEL', 'info'),
    MAX_MEMORY_ITEMS = getEnvProp('MAX_MEMORY_ITEMS', (DISABLE_COMPRESSION ? 500 : 2500)),
    MAX_COMPONENT_MEMORY_ITEMS = getEnvProp('MAX_COMPONENT_MEMORY_ITEMS', MAX_MEMORY_ITEMS * 3),
    MAX_REQUEST_SIZE = getEnvProp('MAX_REQUEST_SIZE', 2e6),
    MAX_MEMORY_EXP_TIME = getEnvProp('MAX_MEMORY_EXP_TIME', 6 * HOUR),
    MEMOIZE = getEnvProp('MEMOIZE', true),
    NODE_ENV = getEnvProp('NODE_ENV'),
    PURGE_ITEM_PERCENT = getEnvProp('PURGE_ITEM_PERCENT', 20),
    REQUEST_COUNT_TO_LOG = getEnvProp('REQUEST_COUNT_TO_LOG', 1000),
    SERVER_HOME = getEnvProp('SERVER_HOME'),
    SERVER_PORT = getEnvProp('PORT', 3000),
    SERVER_IP_ADDR = getEnvProp('SERVER_IP_ADDR', (UFE_ENV === Constants.UFE_ENV_LOCAL ? '0.0.0.0' : undefined)),
    SHOW_ROOT_COMPS = getEnvProp('SHOW_ROOT_COMPS', false),
    STATUS_LOG_TIME = getEnvProp('STATUS_LOG_TIME', 2 * MINUTE),
    WORKER_STAGGER_INTERVAL = getEnvProp('WORKER_STAGGER_INTERVAL', 15 * SECOND),
    WORKERS = getEnvProp('WORKERS', (os.cpus().length / 2)),
    UFE_SLOW_TIME = 0.2,
    UI_HOME = getEnvProp('UI_HOME'),
    UFE_CALL_TIMEOUT = getEnvProp('UFE_CALL_TIMEOUT', (ENABLE_SEO ? 5 * SECOND: 15 * SECOND));

// setup image host
const imageFixUrl = (UFE_ENV === Constants.UFE_ENV_LOCAL ? 'https://qa4.sephora.com' : '');
const IMAGE_HOST = getEnvProp('IMAGE_HOST', imageFixUrl);

const BUILD_INFO = {
    'BUILD_NUMBER': getEnvProp('BUILD_NUMBER', LOCAL_NODEJS_BUILD),
    'PROJECT_VERSION': getEnvProp('PROJECT_VERSION', UNKNOWN_LOCAL_BUILD),
    'CODE_BRANCH': getEnvProp('CODE_BRANCH', UNKNOWN_LOCAL_BUILD),
    'GIT_BRANCH': getEnvProp('GIT_BRANCH', UNKNOWN_LOCAL_BUILD),
    'GIT_COMMIT': getEnvProp('GIT_COMMIT', UNKNOWN_LOCAL_BUILD),
    'BUILD_DATE': getEnvProp('BUILD_DATE', UNKNOWN_LOCAL_BUILD)
};

const BUILD_NUMBER_STRING = `B${BUILD_INFO.BUILD_NUMBER}`;

const ENABLE_SPEEDSCALE = false;

export {
    AGENT_AWARE_SITE_ENABLED,
    AUTOMATION_TARGETS,
    APPLICATION_NAME,
    BUILD_INFO,
    BUILD_MODE,
    BUILD_NUMBER_STRING,
    DISABLE_COMPRESSION,
    ENABLE_CANARY_RELEASE,
    ENABLE_COMPONENT_CACHING,
    ENABLE_GC_COLLECTION,
    ENABLE_PREVIEW,
    ENABLE_SEO,
    ENABLE_SPEEDSCALE,
    ENABLE_PROMETHEUS,
    HOSTNAME,
    IMAGE_HOST,
    LOCAL_NODEJS_BUILD,
    LOG_LEVEL,
    LOG_GC_PROFILE,
    MAX_MEMORY_ITEMS,
    MAX_COMPONENT_MEMORY_ITEMS,
    MAX_REQUEST_SIZE,
    MAX_MEMORY_EXP_TIME,
    MEMOIZE,
    NODE_ENV,
    REQUEST_COUNT_TO_LOG,
    SERVER_HOME,
    SERVER_PORT,
    SERVER_IP_ADDR,
    SHOW_ROOT_COMPS,
    STATUS_LOG_TIME,
    PURGE_ITEM_PERCENT,
    UFE_ENV,
    UNKNOWN_LOCAL_BUILD,
    WORKER_STAGGER_INTERVAL,
    WORKERS,
    UFE_SLOW_TIME,
    isUfeEnvProduction,
    isUfeEnvQA,
    isUfeEnvLocal,
    isNodeEnvProduction,
    isNodeEnvDevelopment,
    FRAMEWORK_CONSTANTS,
    UI_HOME,
    UFE_CALL_TIMEOUT
};
