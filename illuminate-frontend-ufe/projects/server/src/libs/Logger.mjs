/* eslint object-curly-newline: 0 */
import {
    basename
} from 'node:path';

import {
    format,
    createLogger,
    transports
} from 'winston';

import {
    LOG_LEVEL
} from '#server/config/envConfig.mjs';
import {
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import printTimestamp from '#server/shared/Timestamp.mjs';

const isSilly = (LOG_LEVEL === 'silly');
const isDebug = (LOG_LEVEL === 'debug' || isSilly);
const isVerbose = (LOG_LEVEL === 'verbose' || isDebug);
const isInfo = (LOG_LEVEL === 'info' || isVerbose);
const isWarn = (LOG_LEVEL === 'warn' || isInfo);
const isError = (LOG_LEVEL === 'error' || isWarn);

const {
    combine,
    splat,
    printf
} = format;

function getPrintLogLine(filename) {
    return function printLogLine(info) {
        if (info.noJSONParse) {
            return `${printTimestamp()} - ${filename} - ${info.level}: ${info.message}`;
        } else if (info.message && (typeof info.message).toLowerCase() === 'object') {
            return `{"datetime":"${printTimestamp()}","filename":"${filename}","level":"${info.level}","message": ${stringifyMsg(info.message)}}`;
        } else if (info.message && info.message.startsWith('{') && info.message.endsWith('}')) {
            return `{"datetime":"${printTimestamp()}","filename":"${filename}","level":"${info.level}","message": ${info.message}}`;
        } else {
            return `{"datetime":"${printTimestamp()}","filename":"${filename}","level":"${info.level}","message": "${info.message}"}`;
        }
    };
}

export default function Logger(filename) {

    const printLogLine = getPrintLogLine(basename(filename));

    const logger = createLogger({
        level: LOG_LEVEL,
        exitOnError: false,
        transports: [
            new transports.Console({
                format: combine(splat(), printf(printLogLine))
            })
        ]
    });

    logger.isError = isError;
    logger.isWarn = isWarn;
    logger.isInfo = isInfo;
    logger.isVerbose = isVerbose;
    logger.isDebug = isDebug;
    logger.isSilly = isSilly;

    logger.on('error', function (err) {
        console.error(`${printTimestamp()} ${err}`); // eslint-disable-line
    });

    return logger;
}
