/* eslint max-len: [2, 200] */
const fs = require('fs'),
    { request } = require('http'),
    path = require('path'),
    logger = require('#server/libs/Logger')(__filename),
    zlib = require('zlib'),
    host = 'localhost',
    port = 3000,
    urlPath = '/templateResolver?country=US&channel=FS&urlPath=',
    Readable = require('stream').Readable,
    begin = process.hrtime();

const DEBUG_MODE = true;
// let renderTimes = [];

if (DEBUG_MODE) {
    logger.level = 'debug';
}

let errorCount = 0,
    x = 0,
    completed = 0;

function makeRequest(j, z, xdata, requestedUrl) {
    let hashKey = j + 'ec3911d567207dda52df672342ad0812f0ad90b9a',
        clen;

    const stringSteam = new Readable();
    stringSteam.push(xdata);
    stringSteam.push(null);

    clen = xdata.length;
    const now = process.hrtime();

    //'Accept-Encoding': 'gzip;deflate'
    const options = {
        host: host,
        port: port,
        path: `${urlPath}${encodeURIComponent(requestedUrl)}${z}&hash=${hashKey}`,
        method: 'POST',
        headers: {
            Accept: 'text/plain, text/html',
            'Accept-Encoding': j % 3 === 2 ? 'gzip, deflate' : 'brocolli',
            'Content-length': clen,
            Host: `${host}:${port}`,
            'User-Agent': 'Request.js Http Client; versBlockingion 1.0',
            Connection: 'keep-alive'
        }
    };

    stringSteam
        .pipe(request(options))
        .on('response', function (response) {
            const results = [];
            const finished = process.hrtime();
            const delta = process.hrtime(now);
            logger.info(`Status code: ${response.statusCode}`); // 200
            logger.info(`Content Type: ${response.headers['content-type']}`);
            logger.info(`Encoding: ${response.headers['content-encoding']}`);
            const diff = delta[0] * 1e9 + delta[1];
            logger.info(`Start ${now} \t finished ${finished} \t diff = ${diff / 1e9} seconds`);

            response
                .on('data', function (data) {
                    if (DEBUG_MODE) {
                        if (data) {
                            results.push(data);
                        }

                        logger.silly(data ? `Got some data ${data.length}` : 'Got nothing!');
                    }
                })
                .on('end', () => {
                    completed++;

                    if (global.gc) {
                        global.gc();
                    }

                    if (DEBUG_MODE) {
                        let html = '';

                        if (results && response.headers['content-encoding']) {
                            if (response.headers['content-encoding'] === 'gzip') {
                                html = zlib.gunzipSync(Buffer.concat(results));
                            } else if (response.headers['content-encoding'] === 'deflate') {
                                html = zlib.inflateSync(Buffer.concat(results));
                            } else {
                                html = Buffer.concat(results).toString();
                                logger.error(`Unknown content encoding ${response.headers['content-encoding']}`);
                            }
                        } else if (results) {
                            html = Buffer.concat(results).toString();
                            //console.log(html.substring(0, 10));
                        }

                        const isHTML = html.indexOf('</html>') > -1 && html.indexOf('<html') > -1 && html.indexOf('<body') > -1;
                        logger.debug(`Received HTML? ${isHTML} \t with length of ${html.length}`);

                        if (!isHTML) {
                            errorCount++;
                        }

                        // To export pageRenderTime results, have template_child respond with a
                        // 'template:pageRenderTime' string instead of the template HTML.
                        // renderTimes.push(results);
                    }
                });
        })
        .on('error', function (err) {
            errorCount++;

            // because we are using pipes here the channel could have data going out as data is coming in
            // if the request is cached by the server it will ignore the post data
            if (err.code === 'ECONNRESET') {
                logger.error('Conection reset by peer!');
            } else if (err.code === 'EPIPE') {
                logger.error('Pipe error!');
            } else {
                logger.error(JSON.stringify(err));
            }
        });
}

const BASE_DIRECTORY = 'tools/data';
const iPromiseFiles = new Promise((resolve, reject) => {
    fs.readdir(BASE_DIRECTORY, (err, files) => {
        if (err) {
            reject(err);
        } else {
            resolve(files);
        }
    });
});

function iPromiseToReadAFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(BASE_DIRECTORY, filename), (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

iPromiseFiles
    .then(files => {
        files.forEach(filename => {
            iPromiseToReadAFile(filename)
                .then(data => {
                    // get the URL from the JSON data itself!
                    const requestedUrl = JSON.parse(data).targetUrl || '/';

                    logger.info(`Read in JSON data ... ${filename}`);
                    // more than 200 on the same machine might hang your machine
                    var j = 0;

                    while (j < 100) {
                        const p = j % 20;
                        makeRequest(p, p, data, requestedUrl);
                        x++;
                        j++;
                    }
                })
                .catch(err => console.error(err));
        });
    })
    .catch(err => console.error(err));

function logRenderResults(entries) {
    const output = {};
    entries.forEach(item => {
        const [template, time] = item.split(':');

        if (!output[template]) {
            output[template] = { entries: [time] };
        } else {
            output[template].entries.push(time);
        }
    });

    Object.keys(output).forEach(key => {
        output[key].mean = output[key].entries.reduce((a, b) => parseFloat(a) + parseFloat(b)) / output[key].entries.length;
    });

    fs.writeFileSync(path.resolve(__dirname, 'renderTime.json'), JSON.stringify(output), 'utf8');
}

process.on('exit', () => {
    const end = process.hrtime(begin);

    logger.info(`Total number of requests = ${x}`);
    logger.info(`Total number of errors = ${errorCount}`);
    logger.info(`Total number of completed requests = ${completed}`);
    logger.info(`Program ended and took = ${(end[0] * 1e9 + end[1]) / 1e9} seconds`);

    // Export page render times to JSON
    // logRenderResults(renderTimes);
});
