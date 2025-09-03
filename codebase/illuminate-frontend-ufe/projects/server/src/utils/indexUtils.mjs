import cluster from 'cluster';
import {
    Worker
} from 'worker_threads';
import {
    EventEmitter
} from 'node:events';
import {
    resolve,
    basename
} from 'path';

import express from 'express';
import {
    AggregatorRegistry
} from 'prom-client';

import {
    APPLICATION_NAME,
    ENABLE_PROMETHEUS,
    SERVER_HOME
} from '#server/config/envConfig.mjs';
import {
    ENABLE_CONFIGURATION_UPDATE,
    PROMETHEUS_PORT,
    DISABLE_SSL,
    CLUSTER_WORKERS,
    API_CLUSTER_WORKERS
} from '#server/config/envRouterConfig.mjs';
import {
    getBuildInfo,
    stringifyMsg
} from '#server/utils/serverUtils.mjs';
import {
    JERRI_APPLICATION_NAME,
    WOODY_APPLICATION_NAME
} from '#server/config/Constants.mjs';

const applicationName = APPLICATION_NAME || JERRI_APPLICATION_NAME;
const isJERRI = (applicationName === JERRI_APPLICATION_NAME);
const isWoody = (applicationName === WOODY_APPLICATION_NAME);

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const metricsServer = express(),
    aggregatorRegistry = new AggregatorRegistry();

// this file is created during npm install
// so if this file is not here then the build is messed up
const buildInfo = getBuildInfo();

class WorkerToClusterEmitter extends EventEmitter {}
const w2cEmitter = new WorkerToClusterEmitter();

const RESTART_SIGNALS = ['SIGABRT', 'SIGHUP', 'SIGIOT'];

const workers = [];
let statusData = {};
let logWorker;

function getArgs() {
    const args = [];

    if (!DISABLE_SSL) {
        args.push('--use');
        args.push('https');
    }

    if (process.execArgv.indexOf('--inspect') !== -1) {
        args.push('--inspect');
    }

    return args;
}

// default assumes 1
export function getWorkerCount() {
    return isJERRI ? CLUSTER_WORKERS :isWoody ? API_CLUSTER_WORKERS : 1;
}

export function hasMoreThanOneWorker() {
    return (isJERRI && CLUSTER_WORKERS > 1) || (isWoody && API_CLUSTER_WORKERS > 1);
}

async function wrappedProcessSend(processWorker, data) {
    await new Promise((resolve, reject) => {
        processWorker?.send(data, err => {
            if (!err) {
                resolve();
            }
            reject(err);
        });
    }).catch(err => {
        logger.warn(`Error doing process send IPC: ${stringifyMsg(err)}`);
    });
}

function processStatusData() {
    if (Object.keys(statusData).length === workers.length && logWorker && logWorker.process) {
        logWorker.process.send({
            'request': 'sendData',
            'data': statusData
        }, () => {
            logWorker = undefined;
            statusData = {};
        });
    }
}

function handleMessage(msg = {}, _handle) {

    if (msg.request === 'status') {
        if (workers && workers.length > 0) {
            workers.forEach(async wrkr => {
                if (wrkr?.process?.pid !== msg.pid) {
                    await wrappedProcessSend(wrkr?.process, {
                        'request': 'sendStatus'
                    });
                } else {
                    statusData[wrkr.process.pid] = msg.data;
                    logWorker = wrkr;
                }
            });
            processStatusData();
        }
    } else if (msg.request === 'statusData') {
        statusData[msg.pid] = msg.data;
        processStatusData();
    } else if (msg.request === 'refreshConfigAPI') {
        w2cEmitter.emit('refreshCache', msg);
    } else if (msg.request === 'flushMemoryCache') {
        if (workers && workers.length > 0) {
            workers.forEach(async wrkr => {
                if (wrkr?.process) {
                    await wrappedProcessSend(wrkr?.process, {
                        'request': 'purgeMemoryCache'
                    });
                }
            });
        }

        w2cEmitter.emit('flushCache');
    }
}

export function initMetricsServer() {
    if (ENABLE_PROMETHEUS && PROMETHEUS_PORT && hasMoreThanOneWorker()) {
        metricsServer.get('/metrics', async (_request, response) => {
            try {
                const metrics = await aggregatorRegistry.clusterMetrics();
                response.set('Content-Type', aggregatorRegistry.contentType);
                response.send(metrics);
            } catch (ex) {
                response.statusCode = 500;
                response.send(ex.message);
            }
        });

        metricsServer.listen(PROMETHEUS_PORT);
        logger.info(`Cluster metrics server listening to ${PROMETHEUS_PORT}, metrics exposed on /metrics`);
    }
}

export function loadConfigurationWorker() {
    if (ENABLE_CONFIGURATION_UPDATE) {
        const configAPIThread = new Worker(`${SERVER_HOME}/src/services/apiWorker.mjs`, {
            env: Object.assign({}, process.env, {
                ENABLE_AGENT: false
            })
        });
        configAPIThread.on('message', (msg = {}) => {
            if (workers && workers.length > 0) {
                logger.info(`Configuration cache worker request recieved: ${msg.request}.`);
                workers.forEach(async wrkr => {
                    if (wrkr?.process && msg.request === 'configAPIs') {
                        await wrappedProcessSend(wrkr?.process, {
                            'request': 'updateConfigurationData',
                            data: msg.data
                        });
                    }
                });
            }
        });

        // this handles memory cache flush
        w2cEmitter.on('flushCache', () => {
            setTimeout(() => {
                logger.verbose('Request to update cache from flushCache message being passed on to worker!');
                configAPIThread.postMessage({
                    'request': 'refreshConfigAPI'
                });
            }, 100);
        });

        // this handles requests to update caches
        w2cEmitter.on('refreshCache', (msg) => {
            logger.verbose('Request to update cache from getConfiguration() being passed on to worker!');
            // relay message to the thread
            configAPIThread.postMessage(msg);
        });
    }
}

export function initCluster(clusterFilename) {
    cluster.setupPrimary({
        exec: clusterFilename,
        args: getArgs()
    });

}

export function addWorker(i) {
    const routerProcess = cluster.fork(Object.assign({}, buildInfo, process.env, {
        workerIndex: i
    }));
    routerProcess.on('message', handleMessage);
    routerProcess.once('exit', function (code, signal) {
        logger.error(`Worker Exited:: error:${code} signal:${signal} pid:${routerProcess.process.pid} worker @ ${i}.`);

        workers[i].removeAllListeners();

        const shouldRestart = ((signal === null || code === null ||
            RESTART_SIGNALS.includes(signal)) && code !== 0);

        if (shouldRestart) {
            workers[i] = cluster.fork(Object.assign({}, buildInfo, process.env, {
                workerIndex: i
            }));
            workers[i].on('message', handleMessage);
            logger.info(`Resuscitating dead worker @ ${i} from code ${code}`);
        } else {
            workers.splice(i, 1);
        }
    });
    workers.push(routerProcess);
}

