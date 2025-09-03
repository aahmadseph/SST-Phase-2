/* eslint max-len: [2, 200] */
import v8 from 'node:v8';
import fs from 'node:fs';
import {
    resolve as pathResolve,
    dirname
} from 'path';
import { fileURLToPath } from 'url';
import {
    lookup
} from 'node:dns';
import process from 'node:process';
import { inspect } from 'node:util';
import { EOL } from 'node:os';

const DEFAULT_LOG_INTERVAL = 500;
const EOL_RE = new RegExp(EOL, 'g');
const MULTIPLE_SPACE = /[\s]+/g;
const REMOVE_LEADING_SINGLE_QUOTE = /^\'/g;
const REMOVE_TRAILING_SINGLE_QUOTE = /\'$/g;

function stringifyMsg(msg) {
    let result = msg;
    try {
        result = JSON.stringify(msg);
    } catch (e) {
        // throw away
    }

    return result;
}

function safelyParse(msg, shouldReturnOriginalDataOnError = true, shouldReturnError = false) {
    let result = shouldReturnOriginalDataOnError ? msg : undefined;
    try {
        result = JSON.parse(msg);
    } catch (e) {
        // throw away
        if (shouldReturnError) {
            result = e;
        }
    }

    return result;
}

function getError(err) {
    if (!err) {
        return 'Unknown error occured';
    }

    return inspect(err).replace(EOL_RE, '').replace(MULTIPLE_SPACE, ' ')
        .replace(REMOVE_LEADING_SINGLE_QUOTE, '')
        .replace(REMOVE_TRAILING_SINGLE_QUOTE, '');
}

// simple method to get an environment property and return the value or a default value
function getEnvProp(propName, defValue) {
    const result = (process.env[propName] ?
        process.env[propName] : defValue);
    // node treats all environment values as string this function would always return a string
    // however sometimes it should return a number or boolean, so we call JSON.parse()
    // unfortunately JSON.parse() can throw an exception
    // for example if export LOG_LEVEL=debug then debug is passed to JSON.parse() instead of "debug"
    // so then it blows up, however if 2e6 is passed to JSON.parse() it returns the correct 2000000

    return safelyParse(result);
}

// startTime needs to be a call to process.hrtime()
// this will take the start time and then the time now
// and return the time back from a second call to process.hrtime()
// returns time in seconds usually 0.xxxxxxxx
// or 0 if no startTime given
function getDiffTime(startTime) {
    if (!startTime) {
        return 0.0;
    }

    const endTime = process.hrtime(startTime);

    return (((endTime[0] * 1e9) + endTime[1]) / 1e9);
}

// given a start time and another time
// compute the delta between the two
// startTime needs to be a call to process.hrtime()
// which is in the format of [ xx, yy ]
// deltaTime is assumed to be in seconds usually in the format of 0.xxxxxxxx
// so this will take startTime, get the diff between now and startTime
// and then subract the two times
// returns delta time in seconds usually 0.xxxxxxxx
// or 0 if no startTime given
function subtractTimes(startTime, deltaTime) {
    if (!startTime) {
        return 0.0;
    }

    const endTime = getDiffTime(startTime);

    // limit decimal places to 9 but still return a floating point
    return parseFloat(Number(((endTime * 1e9) - (deltaTime * 1e9)) / 1e9).toFixed(9));
}

function getLoggerInterval(interval) {
    const useDefaultInterval = (!isNaN(interval) && interval > DEFAULT_LOG_INTERVAL);

    return (useDefaultInterval ? DEFAULT_LOG_INTERVAL : interval);
}

function memoryUsageLogging(logger, envPropValue) {
    const loggingInterval = getLoggerInterval(envPropValue);

    const id = setInterval(() => {
        logger.info(`Heap Memory Usage: ${JSON.stringify(process.memoryUsage())}`);
    }, loggingInterval);

    return id;
}

function gcLogging(logger, envPropValue) {

    const loggingInterval = getLoggerInterval(envPropValue);

    if (typeof global.gc === 'function') {

        const id = setInterval(() => {
            logger.info(`Before GC: ${v8.getHeapStatistics().used_heap_size} ${JSON.stringify( process.memoryUsage())}`);
            global.gc();
            logger.info(`After GC: ${v8.getHeapStatistics().used_heap_size} ${JSON.stringify( process.memoryUsage())}`);
        }, loggingInterval);

        return id;
    } else {
        logger.warn('ENABLE_GC_COLLECTION used but global.gc not found, pass --expose-gc to enable.');

        return memoryUsageLogging(logger, envPropValue);
    }
}

function getMax(v1 = 0, v2 = 0) {
    return (v1 > v2 ? v1: v2);
}

function dnsLookup(hostnameIn) {
    return new Promise((resolve, reject) => {
        lookup(hostnameIn, {
            family: 4
        }, (err, addr, _family) => {
            if (err) {
                reject(err);
            } else {
                resolve(addr);
            }
        });
    });
}

function sleep(sleeptime = 0) {
    return new Promise(resolve => {
        setTimeout(() => {
            return resolve();
        }, sleeptime);
    });
}

// NOTE: cannot use SERVER_HOME here because it causes bad kama :P aka karma does not work
// Resolves the absolute path to the 'buildInfo.json' file, relative to the project root,
// by first determining the current module's directory and then moving up to the root
// and appending the appropriate subdirectories ('src/config/buildInfo.json').
// Needed b/c Docker and Local have different "root" directories.
// FUTURE TODO replace with import buildInfo from '#server/config/buildInfo.json' with { type: 'json' };
const currentDir = dirname(fileURLToPath(import.meta.url));
const buildInfoPath = pathResolve(currentDir, '..', '..', 'src', 'config', 'buildInfo.json');

// this file is created during npm install
// so if this file is not here then the build is messed up
function getBuildInfo() {
    const buildInfoData = fs.readFileSync(buildInfoPath),
        buildInfoJSON = safelyParse(buildInfoData.toString());

    return Object.assign({}, buildInfoJSON);
}

export {
    getMax,
    getEnvProp,
    getError,
    subtractTimes,
    getDiffTime,
    gcLogging,
    memoryUsageLogging,
    stringifyMsg,
    safelyParse,
    dnsLookup,
    sleep,
    getBuildInfo
};
