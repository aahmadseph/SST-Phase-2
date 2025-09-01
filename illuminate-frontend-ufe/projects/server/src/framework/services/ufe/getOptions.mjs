import {
    hostname
} from 'node:os';

import {
    COMPRESS_POST_DATA_TO_UFE,
    RENDER_HOST,
    RENDER_HOST_PORT,
    UFE_COMPRESSION_TYPE
} from '#server/config/envRouterConfig.mjs';
import {
    FRAMEWORK_CONSTANTS as Constants
} from '#server/config/envConfig.mjs';

const HOSTNAME = hostname();

const staticHeaders = {
    'Content-Type': 'application/json;charset=UTF-8',
    'User-Agent': 'Nodezilla/1.0 - JERRI 2 UFE',
    'Accept': 'text/html',
    'Accept-Language': 'en-US,q=0.9,en;q=0.8',
    'Accept-Encoding': UFE_COMPRESSION_TYPE,
    'ufe_data_host': HOSTNAME,
    'cat_or_mouse': 'mouse'
};

if (COMPRESS_POST_DATA_TO_UFE) {
    staticHeaders[Constants.CONTENT_ENCODING_HEADER] = 'gzip';
}

export default function getOptions(urlPath) {
    return {
        method: 'POST',
        hostname: RENDER_HOST,
        port: RENDER_HOST_PORT,
        path: urlPath,
        headers: staticHeaders
    };
}
