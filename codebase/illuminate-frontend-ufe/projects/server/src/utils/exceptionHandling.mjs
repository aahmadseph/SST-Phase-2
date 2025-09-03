import process from 'node:process';
import {
    resolve,
    basename
} from 'path';

import {
    getError
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

export function uncaughtExceptionHandler() {
    // Handle uncaught Exceptions by closing the process and allowing kubernetes to restart
    process.on('uncaughtException', (err) => {
        logger.error(` uncaughtException: ${getError(err)}`);
        process.exit(1);
    });
}
