const BPromise = require('bluebird');

const baseDir = `${process.cwd()}/tools/logAnalyzer/`,
    { UFE_HOME } = require(`${baseDir}/libs/Constants`),
    { getEnvHost } = require(`${baseDir}/libs/fileUtils`),
    logRetriever = require(`${baseDir}/libs/logRetriever`);

function getEnvLogs() {
    const jerriLogUrl = process.argv[3] ? `/logs/ufe/node_jerri.log-${process.argv[3]}.gz` : '/logs/ufe/node_jerri.log';

    const ufeLogurl = process.argv[3] ? `/logs/ufe/node.log-${process.argv[3]}.gz` : '/logs/ufe/node.log';

    getEnvHost(process.argv[2])
        .then(logHost => {
            const getLogs = [logRetriever(logHost, 7065, jerriLogUrl), logRetriever(logHost, 7065, ufeLogurl)];

            BPromise.allSettled(getLogs)
                .then(allPromises => {
                    allPromises.forEach(item => {
                        console.log(item.isRejected());
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(e => {
            console.error(e);
        });
}

getEnvLogs();
