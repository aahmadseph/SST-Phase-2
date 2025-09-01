/* eslint no-console: 0, object-curly-newline: 0  */
const fs = require('fs');

const beautify = require('js-beautify')['js_beautify'];

const baseDir = `${process.cwd()}/tools/logAnalyzer/`,
    logFileReader = require(`${baseDir}/libs/logFileReader`),
    { getEnvHost } = require(`${baseDir}/libs/fileUtils`),
    { getJERRILogfilename } = require(`${baseDir}/libs/fileUtils`);

const TIME_TO_NUMBER_RE = /[-|\ |"|\:|,]/g;

function getPerfLogs(options) {
    return [
        logFileReader(getJERRILogfilename('10.187.85.71'), options),
        logFileReader(getJERRILogfilename('10.187.85.72'), options),
        logFileReader(getJERRILogfilename('10.187.85.73'), options),
        logFileReader(getJERRILogfilename('10.187.85.74'), options),
        logFileReader(getJERRILogfilename('10.187.85.75', '/logs/ufe/node.log'), options),
        logFileReader(getJERRILogfilename('10.187.85.76', '/logs/ufe/node.log'), options),
        logFileReader(getJERRILogfilename('10.187.84.49', '/logs/ufe/node.log'), options),
        logFileReader(getJERRILogfilename('10.187.84.50', '/logs/ufe/node.log'), options),
        logFileReader(getJERRILogfilename('10.187.84.51', '/logs/ufe/node.log'), options)
    ];
}

async function getLogs(env, options) {
    const hostid = await getEnvHost(env);
    const logHost = getJERRILogfilename(hostid);
    const ufeLogHost = getJERRILogfilename(hostid, '/logs/ufe/node.log');

    return [logFileReader(logHost, options), logFileReader(ufeLogHost, options)];
}

async function filterLogs() {
    const options = {
        matchStr: process.argv[3],
        startDate: process.argv[4],
        endDate: process.argv[5],
        startTime: process.argv[6],
        endTime: process.argv[7]
    };

    const env = process.argv[2];
    const readLogs = env === 'perf' ? getPerfLogs(options) : await getLogs(env, options);

    Promise.all(readLogs)
        .then(allPromises => {
            const results = allPromises
                .reduce((acc, next) => {
                    return acc.concat(next);
                })
                .sort((a, b) => {
                    const keyA = Object.keys(a)[0],
                        keyB = Object.keys(b)[0];
                    const timeA = parseInt(keyA.replace(TIME_TO_NUMBER_RE, '')),
                        timeB = parseInt(keyB.replace(TIME_TO_NUMBER_RE, ''));

                    return timeA - timeB;
                });
            fs.writeFile(`${process.cwd()}/logs/results.json`, beautify(JSON.stringify(results)), err => {
                if (err) {
                    console.error(err);
                }
            });
            console.log(`Result count: ${results.length}`);
        })
        .catch(err => {
            console.log(err);
        });
}

filterLogs();
