/* eslint object-curly-newline: [2, { minProperties: 1 } ], no-console: 0 */
import process from 'node:process';
import {
    resolve,
    basename
} from 'path';
import {
    createRequire
} from 'module';
const require = createRequire(import.meta.url);

const UNKNOWN_CAUGHT_ERROR_EXIT_CODE = 25,
    UNCAUGHT_EXCEPTION_EXIT_CODE = 0;

// Handle uncaught Exceptions and exit
// this is moved to the top to trap any errors that might otherwise get missed
// such as SyntaxError and TypeError
// NOTE: ufe code is all in renderContent which is wrapped in try/catch
process.on('uncaughtException', function (err) {
    console.error(` ERROR: ${err.message}`);
    console.error(` ERROR [NTA: unrecoverable error] ${process.pid} ${err}`);
    console.error(err.stack);
    // unused exit code at this time
    // https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_exit_codes
    console.error(`Exiting with status code ${UNCAUGHT_EXCEPTION_EXIT_CODE}.`);
    process.exit(UNCAUGHT_EXCEPTION_EXIT_CODE);
});

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

import renderContent from '#server/libs/renderContent.mjs';
import sendContent from '#server/libs/sendContent.mjs';
import {
    gcLogging,
    memoryUsageLogging
} from '#server/utils/serverUtils.mjs';
import {
    AUTOMATION_TARGETS,
    BUILD_MODE,
    ENABLE_GC_COLLECTION,
    LOG_GC_PROFILE,
    SHOW_ROOT_COMPS,
    UFE_ENV,
    AGENT_AWARE_SITE_ENABLED,
    UI_HOME
} from '#server/config/envConfig.mjs';
import {
    FRAMEWORK_CONSTANTS as Constants
} from '#server/config/envConfig.mjs';
import printTimestamp from '#server/shared/Timestamp.mjs';

/// memory debug logging for memory leak checking
if (ENABLE_GC_COLLECTION) {
    gcLogging(logger, ENABLE_GC_COLLECTION);
} else if (LOG_GC_PROFILE) {
    memoryUsageLogging(logger, LOG_GC_PROFILE);
}

const isFrontEnd = (BUILD_MODE === 'frontend');
const FrontendInflateRoot = '#server/libs/FrontEndInflateRoot.mjs';
const IsomorphicInflateRoot = `${UI_HOME}/dist/cjs/backend/${AGENT_AWARE_SITE_ENABLED ? 'agent.' : ''}root.bundle.js`;
console.log(`IsomorphicInflateRoot: ${IsomorphicInflateRoot}`);
let InflatorRoot;

const initInflatorRootInit = async () => {

    if (isFrontEnd) {
        const res = await import(FrontendInflateRoot);
        InflatorRoot = res;
    } else {
        InflatorRoot = require(IsomorphicInflateRoot).RootBuild.default;
    }

    logger.info(`Child worker with pid = ${process.pid} has started.
    Build Mode: ${BUILD_MODE}
    UFE Environment: ${UFE_ENV}
    Show Root Components: ${SHOW_ROOT_COMPS}
    Automation Targets: ${AUTOMATION_TARGETS}
    GC Collection: ${ENABLE_GC_COLLECTION}
    GC Profile: ${LOG_GC_PROFILE}`);
};

initInflatorRootInit();

async function processMessage(msg) {

    // rare occurance this could happen
    if (!InflatorRoot && isFrontEnd) {
        await initInflatorRootInit();
    }

    //require('fs').writeFileSync('tools/data/page.json', msg.data);

    let html = '';
    try {

        // render the HTML content
        const renderData = renderContent(msg, InflatorRoot);
        html = renderData.html;

        // To benchmark pageRenderTime with masterVolumeStressTest, send this response instead
        // of calling sendContent, some assembly required!
        //process.send(`${JSON.parse(msg.data).templateInformation.template}:${renderTime}`);
        sendContent(msg, renderData);

    } catch (err) {

        // print error message, with URL, pid and some sizes
        console.error(`${printTimestamp()} - ${filename} - error:`, `ERROR: [URL: ${msg?.url || ''}.]] [Process ${process?.pid} run time error] ${err} datalength: ${msg?.data?.length || 0} htmlLength: ${html?.length || 0}.`);

        // print stacktrace
        console.error(`${printTimestamp()} - ${filename} - error: stacktrace: `, err);

        // dump data as best we can
        console.error(`${printTimestamp()} - ${filename} - error: HTML: `, html);
        console.error(`${printTimestamp()} - ${filename} - error: JSON data: `, msg?.data);

        setImmediate(() => {
            logger.transports[0].once('finish', () => {
                setImmediate(() => {
                    process.send({
                        renderTime: 0,
                        sendDataTime: 0,
                        html: Constants.EMPTY_DOCUMENT,
                        exception: 'Fatal exception occured'
                    }, () => {
                        // unused exit code at this time
                        // https://nodejs.org/dist/latest-v8.x/docs/api/process.html#process_exit_codes
                        process.exit(UNKNOWN_CAUGHT_ERROR_EXIT_CODE);
                    });
                });
            });
            logger.end();
        });
    }
}

process.on('message', processMessage);

export {
    processMessage
};
