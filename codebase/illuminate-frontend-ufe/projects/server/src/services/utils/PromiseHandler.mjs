/* eslint object-curly-newline: 0 */
import {
    resolve,
    basename
} from 'path';

import {
    getDiffTime,
    getError,
    stringifyMsg,
    safelyParse
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const MAX_RESOLVE_TIME = 0.125;

const filterHeaders = item => {
    const {
        identifier,
        options: {
            headers = {},
            ...xItem
        } = {}
    } = item;

    xItem[identifier] = identifier;

    // cookies as string
    xItem.cookiesAsStringLength = (headers && headers['cookies-as-string'] || '').length;

    // cookies in cookie Jar
    const cookies = stringifyMsg(headers?.Cookie);

    if (typeof cookies === 'string') {
        xItem.cookiesLength = cookies.length;
    }

    const {
        ...rHeaders
    } = headers;
    delete rHeaders['cookies-as-string'];
    xItem.headersLength = stringifyMsg(rHeaders).length;

    return xItem;
};

const callDataMap = (apiCallData) => apiCallData.apiFunction(apiCallData.options);

const reducerFn = (acc, next) => {
    // combine headers
    const mergedHeaders = Object.assign({}, acc.mergedHeaders, next.mergedHeaders);

    return Object.assign({}, acc, next, {
        mergedHeaders
    });
};

export default function PromiseHandler(apiList = [], callback) {
    const createTime = process.hrtime();
    // fire API calls
    const apiCalls = apiList.map(callDataMap);

    Promise.all(apiCalls).then(results => {

        // all is normal here
        const data = results.map((item, index) => {
            const {
                headers
            } = item;

            return {
                mergedHeaders: headers,
                [apiList[index].identifier]: {
                    'success': safelyParse(item.data),
                    'headers': headers
                }
            };
        }).reduce(reducerFn);
        const resolvedTime = getDiffTime(createTime);

        if (resolvedTime > MAX_RESOLVE_TIME) {
            logger.warn(`{ "API_resolved": { "greater_than": "${MAX_RESOLVE_TIME}ms", "resolveTime": ${resolvedTime} } }`);
        }

        callback(undefined, data);
    }).catch(err => {
        const errorMsg = getError(err);
        // remove headers from input objects, but keep size
        // also remove cookies as string, for more accurate size
        const apiListFiltered = apiList.map(filterHeaders);
        const errorTime = getDiffTime(createTime);
        logger.warn(`{"error": "${errorMsg}", "executing": ${stringifyMsg(apiListFiltered)}, "took": "${errorTime} seconds."}`);
        logger.debug(`Verbose details: ${errorMsg} while calling ${stringifyMsg(apiList)} took ${errorTime} seconds.`);
        callback({
            'error': err,
            'errorMsg': errorMsg
        });
    });
}
