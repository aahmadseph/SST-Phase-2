const INDEX_INJECTION = 'index';
const UFE_ALL_PARTS = 'ufeAllParts';
const RENDERTYPE = 'renderType=';

const DOCUMENT_TYPE = '<!DOCTYPE html>\n';

const EMPTY_DOCUMENT = `${DOCUMENT_TYPE}<html></html>\n`;

const TARGETER_QUERY_PARAMS = '__TARGETER_QUERY_PARAM__';

const ACTION_WATCHER_STATE_NAME = 'watcher';

const UFE_ENV_PRODUCTION = 'PROD';
const UFE_ENV_QA = 'QA';
const UFE_ENV_LOCAL = 'LOCAL';
const VALID_UFE_ENVS = [UFE_ENV_PRODUCTION, UFE_ENV_LOCAL, UFE_ENV_QA];

const NODE_ENV_PRODUCTION = 'production';
const NODE_ENV_DEVELOPMENT = 'development';

// Accepted chars can include / or - or any of A-Z 0-9 _
const TARGETER_NAMES = /\"targeterName\"\:[ ]?\"([\/|\w|\-]*)\"/g,
    TARGETER_NAME_GROUPS = /(\"targeterName\"\:)[ ]?\"([\/|\w|\-]*)\"/;

const CONTENT_ENCODING_HEADER_LC = 'content-encoding',
    CONTENT_ENCODING_HEADER = 'Content-Encoding';

// TODO: if we switch to export, server tests will break with SyntaxError: Unexpected token 'export'
// we need to configure server folder/env to accept export and export default syntax.
module.exports = {
    CONTENT_ENCODING_HEADER_LC,
    CONTENT_ENCODING_HEADER,
    INDEX_INJECTION,
    UFE_ALL_PARTS,
    DOCUMENT_TYPE,
    TARGETER_QUERY_PARAMS,
    ACTION_WATCHER_STATE_NAME,
    UFE_ENV_PRODUCTION,
    UFE_ENV_QA,
    UFE_ENV_LOCAL,
    VALID_UFE_ENVS,
    RENDERTYPE,
    EMPTY_DOCUMENT,
    NODE_ENV_PRODUCTION,
    NODE_ENV_DEVELOPMENT,
    TARGETER_NAMES,
    TARGETER_NAME_GROUPS
};
