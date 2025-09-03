/* eslint no-console: 0, object-curly-newline: 0  */
const fs = require('fs'),
    http = require('http'),
    exec = require('child_process').exec;

const express = require('express');

const baseDir = process.cwd();

let indexFile;

const app = express();

const environments = [],
    validEnvs = [];

app.get('/', (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });

    if (!indexFile) {
        fs.readFile(`${baseDir}/tools/logAnalyzer/index.html`, (err, data) => {
            if (err) {
                console.error(err);

                return;
            }

            const page = data.toString();
            indexFile = page.replace('[[ENVIRONMENTS]]', environments.join(''));
            response.end(indexFile);
        });
    } else {
        response.end(indexFile);
    }
});

app.get('/getLogs', (request, response) => {
    const envName = request.query['getenv'];

    function callback(error, stdout, stderr) {
        if (error) {
            console.log(error);
        }

        if (stdout) {
            console.log(stdout);
        }

        if (stderr) {
            console.log(stderr);
        }

        response.end('done');
    }

    if (envName === 'perf') {
        exec(`node ${baseDir}/tools/logAnalyzer/getPerfLogs.js`, callback);
    } else if (envName === 'perfCat') {
        exec(`node ${baseDir}/tools/logAnalyzer/getPerfCatLogs.js`, callback);
    } else if (validEnvs.includes(envName)) {
        exec(`node ${baseDir}/tools/logAnalyzer/getQALogs.js ${envName}`, callback);
    } else {
        response.end('undone');
    }
});

app.get('/query', (request, response) => {
    const envName = request.query['getenv'],
        matchStr = request.query['matchStr'],
        startDate = request.query['startDate'] || '',
        endDate = request.query['endDate'] || '',
        startTime = request.query['startTime'] || '',
        endTime = request.query['endTime'] || '';

    function callback(error, stdout, stderr) {
        //console.log(request.query);
        if (error) {
            console.log(error);
        }

        if (stdout) {
            console.log(stdout);
        }

        if (stderr) {
            console.log(stderr);
        }

        fs.createReadStream(`${baseDir}/logs/results.json`).pipe(response);
    }

    const params = `'${matchStr}' ${startDate} ${endDate} ${startTime} ${endTime}`;

    exec(`node --max_old_space_size=4096 ${baseDir}/tools/logAnalyzer/filterLogs.js ${envName} ${params}`, callback);
});

const port = 25025;
const server = http.createServer(app);

fs.readdir(`${baseDir}/tools/runProfiles`, (err, data) => {
    if (err) {
        console.error(err);
        process.exit(-1);
    }

    data.map(item => {
        return item.replace('azr-', '').replace('.profile.sh', '');
    }).forEach(item => {
        validEnvs.push(item);
        environments.push(`<option value="${item}">${item}</optios>`);
    });
    environments.push('<option value="perf">perf</optios>');
    environments.push('<option value="perfCat">perfCat</optios>');

    server.listen(port);
    console.log(`Server listening on port ${port}`);
});
