/* eslint-disable object-curly-newline, prefer-promise-reject-errors */
const fs = require('fs'),
    zlib = require('zlib'),
    { request } = require('http');

const baseDir = `${process.cwd()}/tools/logAnalyzer/`,
    { getLogFileDir, getJERRILogfilename } = require(`${baseDir}/libs/fileUtils`);

function logRetriever(logHost, logPort = 7065, logUrl) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            hostname: logHost,
            port: logPort,
            path: logUrl
        };

        const isGzip = logUrl.substring(logUrl.length - 3) === '.gz';

        const logFiledir = getLogFileDir(logHost);
        const filename = isGzip ? getJERRILogfilename(logHost, logUrl).replace('.gz', '') : getJERRILogfilename(logHost, logUrl);

        fs.mkdir(logFiledir, (err, success) => {
            if (err) {
                console.error(`Error making directory ${logFiledir}`);
            }

            const fileoutput = fs.createWriteStream(filename);

            const logRequest = request(options, res => {
                /* right now we expect a 2xx code */
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    reject({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        url: logUrl
                    });
                }

                if (isGzip) {
                    res.pipe(zlib.createGunzip()).pipe(fileoutput);
                } else {
                    res.pipe(fileoutput);
                }

                res.on('error', ex => {
                    reject({
                        errMsg: ex,
                        headers: res.headers,
                        url: logUrl
                    });
                });

                res.on('end', () => {
                    //const data = Buffer.concat(chunks).toString();
                    fileoutput.close();
                    resolve('done');
                });
            });

            logRequest.on('error', e => {
                reject({
                    errMsg: e,
                    url: logUrl
                });
            });

            logRequest.end();
        });
    });
}

module.exports = logRetriever;
