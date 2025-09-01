import {
    getEnvProp
} from '#server/utils/serverUtils.mjs';

// temporary flags
const ENABLE_HTTPS_FOR_BXS = getEnvProp('ENABLE_HTTPS_FOR_BXS', false);
const ENABLE_HTTPS_FOR_CXS = getEnvProp('ENABLE_HTTPS_FOR_CXS', false);

const CONTENTFUL_HOST = getEnvProp(
        'CONTENTFUL_HOST',
        'content-page-exp-qa1.lower.internal.sephora.com'
    ),
    CONTENTFUL_PORT = ENABLE_HTTPS_FOR_CXS ? getEnvProp('CONTENTFUL_PORT', '443') :
        getEnvProp('CONTENTFUL_PORT', '80');

const BROWSE_EXPERIENCE_HOST = getEnvProp(
        'BROWSE_EXPERIENCE_HOST',
        'browseexpservice-qa1.lower.internal.sephora.com'
    ),
    BROWSE_EXPERIENCE_PORT = ENABLE_HTTPS_FOR_BXS ? getEnvProp('BROWSE_EXPERIENCE_PORT', '443') :
        getEnvProp('BROWSE_EXPERIENCE_PORT', '80');

const SEARCH_EXPERIENCE_HOST = getEnvProp(
        'SEARCH_EXPERIENCE_HOST',
        'searchexpservice-qa1.lower.internal.sephora.com'
    ),
    SEARCH_EXPERIENCE_PORT = getEnvProp('SEARCH_EXPERIENCE_PORT', '80');

const AUTH_EXPERIENCE_HOST = getEnvProp(
        'AUTH_EXPERIENCE_HOST',
        'authentication-service-qa1.lower.internal.sephora.com'
    ),
    AUTH_EXPERIENCE_PORT = getEnvProp('AUTH_EXPERIENCE_PORT', '80');

const PRODUCT_EXPERIENCE_HOST = getEnvProp(
        'PRODUCT_EXPERIENCE_HOST',
        'productgraph-qa1.lower.internal.sephora.com'
    ),
    PRODUCT_EXPERIENCE_PORT = getEnvProp('PRODUCT_EXPERIENCE_PORT', '443');

const COMM_EXPERIENCE_HOST = getEnvProp(
        'COMM_EXPERIENCE_HOST',
        'passion-azre1-es-qa1.sephora.com'
    ),
    COMM_EXPERIENCE_PORT = getEnvProp('COMM_EXPERIENCE_PORT', '443');

const SEO_SERVICE_HOST = getEnvProp(
        'SEO_SERVICE_HOST',
        'seo-service-qa1.lower.internal.sephora.com'
    ),
    SEO_SERVICE_PORT = getEnvProp('SEO_SERVICE_PORT', '443');

const SEO_UTILS_HOST = getEnvProp(
        'SEO_UTILS_HOST',
        'seo-utils-qa1.lower.internal.sephora.com'
    ),
    SEO_UTILS_PORT = getEnvProp('SEO_UTILS_PORT', '443');

const PAGE_SIZE = 60;

export {
    PAGE_SIZE,
    CONTENTFUL_HOST,
    CONTENTFUL_PORT,
    BROWSE_EXPERIENCE_HOST,
    BROWSE_EXPERIENCE_PORT,
    SEARCH_EXPERIENCE_HOST,
    SEARCH_EXPERIENCE_PORT,
    AUTH_EXPERIENCE_HOST,
    AUTH_EXPERIENCE_PORT,
    COMM_EXPERIENCE_HOST,
    COMM_EXPERIENCE_PORT,
    PRODUCT_EXPERIENCE_HOST,
    PRODUCT_EXPERIENCE_PORT,
    SEO_SERVICE_HOST,
    SEO_SERVICE_PORT,
    SEO_UTILS_HOST,
    SEO_UTILS_PORT
};
