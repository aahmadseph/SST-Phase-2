import childProcess from 'node:child_process';
import process from 'node:process';
import {
    resolve,
    basename
} from 'path';
import {
    getEnvProp
} from '#server/utils/serverUtils.mjs';
import {
    APPLICATION_NAME,
    isUfeEnvLocal,
    SERVER_HOME
} from '#server/config/envConfig.mjs';
import {
    addWorker,
    initCluster,
    initMetricsServer,
    loadConfigurationWorker,
    getWorkerCount
} from '#server/utils/indexUtils.mjs';
import {
    JERRI_APPLICATION_NAME,
    WOODY_APPLICATION_NAME
} from '#server/config/Constants.mjs';
import {
    uncaughtExceptionHandler
} from '#server/utils/exceptionHandling.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);
const applicationName = APPLICATION_NAME || JERRI_APPLICATION_NAME;
const isJERRI = (applicationName === JERRI_APPLICATION_NAME);
const isWoody = (applicationName === WOODY_APPLICATION_NAME);

uncaughtExceptionHandler();

const srcBasePath = resolve(SERVER_HOME, 'src');
const servicesBasePath = resolve(srcBasePath, 'services');

if (!isJERRI && !isWoody) {
    logger.error(`Invalid application name ${applicationName}! Exiting!`);
    process.exit(-3);
}

if (isJERRI) {
    // only on local machine can this work
    const START_UFE = getEnvProp('START_UFE', 'false');

    if (isUfeEnvLocal && START_UFE) {
        const ufeProcess = childProcess.fork(`${srcBasePath}/ufe.mjs`, undefined, {
            env: process.env
        });

        process.on('exit', () => {
            ufeProcess.exitCode = 0;
        });
    }
}

const clusterFilename = `${servicesBasePath}/${isJERRI ? 'router': 'apiRouter'}.mjs`;
const workerCount = getWorkerCount();

initCluster(clusterFilename);

for (let i = 0; i < workerCount; i++) {
    addWorker(i);
}

initMetricsServer();

loadConfigurationWorker();

logger.info(`Application ${APPLICATION_NAME} starting up!`);
