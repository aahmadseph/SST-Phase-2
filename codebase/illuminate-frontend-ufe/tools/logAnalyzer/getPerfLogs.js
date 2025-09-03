const BPromise = require('bluebird');

const baseDir = `${process.cwd()}/tools/logAnalyzer/`,
    logRetriever = require(`${baseDir}/libs/logRetriever`);

function getPerfLogs() {
    const jerriLogUrl = process.argv[2] ? `/logs/ufe/node_jerri.log-${process.argv[2]}.gz` : '/logs/ufe/node_jerri.log';

    const ufeLogurl = process.argv[2] ? `/logs/ufe/node.log-${process.argv[2]}.gz` : '/logs/ufe/node.log';

    const getLogs = [
        logRetriever('10.187.85.71', 7065, jerriLogUrl),
        logRetriever('10.187.85.72', 7065, jerriLogUrl),
        logRetriever('10.187.85.73', 7065, jerriLogUrl),
        logRetriever('10.187.85.74', 7065, jerriLogUrl),
        logRetriever('10.187.85.75', 7065, ufeLogurl),
        logRetriever('10.187.85.76', 7065, ufeLogurl),
        logRetriever('10.187.84.49', 7065, ufeLogurl),
        logRetriever('10.187.84.50', 7065, ufeLogurl),
        logRetriever('10.187.84.51', 7065, ufeLogurl)
    ];

    BPromise.allSettled(getLogs)
        .then(allPromises => {
            allPromises.forEach(item => {
                console.log(item.isRejected());
            });
        })
        .catch(err => {
            console.log(err);
        });
}

getPerfLogs();
