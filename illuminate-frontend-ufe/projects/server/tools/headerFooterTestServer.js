/* eslint max-len: [2, 200] */
const http = require('http'),
    fs = require('fs'),
    https = require('https'),
    Readable = require('stream').Readable,
    pwd = process.cwd(),
    host = 'dev3.sephora.com';

function pipeStream(streamIn, streamOut, cb) {
    streamIn.on('data', chunk => {
        streamOut.write(chunk);
    });

    streamIn.on('end', () => {
        cb();
    });
}

function remoteIt(request, response) {
    const options = {
        hostname: host,
        port: 80,
        path: request.url,
        method: request.method,
        headers: request.headers
    };

    const req = http.request(options, res => {
        console.log('statusCode:', res.statusCode);

        if (res.statusCode < 200 || res.statusCode >= 400) {
            console.log('headers:', res.headers);
            console.log('options:', options);
        }

        response.writeHead(res.statusCode, res.headers);
        res.pipe(response);
    });

    req.end();

    req.on('error', e => {
        console.error(e);
    });
}

// Create a server
const server = http.createServer(function (request, response) {
    if (request.method === 'GET') {
        let page = request.url;
        let parent = page;
        const opage = page;

        if (page.indexOf('/composite') > -1) {
            response.write('<html><head>');
            const head = fs.createReadStream('tests/generated/head.html');
            pipeStream(head, response, () => {
                response.write('</head><body>');
                const header = fs.createReadStream('tests/generated/header.html');
                pipeStream(header, response, () => {
                    const footer = fs.createReadStream('tests/generated/footer.html');
                    pipeStream(footer, response, () => {
                        const linkJSON = fs.createReadStream('tests/generated/linkjson.html');
                        pipeStream(linkJSON, response, () => {
                            response.write('</body></html>');
                            response.end();
                        });
                    });
                });
            });

            return;
        } else if (page.indexOf('/beautyadvice/external/footerFrame.jsp') > -1) {
            fs.readFile('tests/generated/ufeAllParts.json', (err, data) => {
                const d = JSON.parse(data);
                const stringStream = new Readable();

                stringStream.push('<html><head>');
                stringStream.push(d.ufeHead);
                stringStream.push('</head><body>');

                stringStream.push('<div id="sephoraHeader">');
                stringStream.push(d.ufeHeader);
                stringStream.push('</div>');

                stringStream.push('<div id="sephoraFooter">');
                stringStream.push(d.ufeFooter);
                stringStream.push(d.ufeLinkJson);
                stringStream.push('</div>');

                stringStream.push('</body></html>');

                stringStream.push('\n<script type="text/javascript" src="/tools/headerFooter.js">');
                stringStream.push('</script>\n');

                stringStream.push(null);
                stringStream.pipe(response);
            });

            return;
        } else if (page.indexOf('/beautyadvice/external/headerFrame.jsp') > -1) {
            const stringStream = new Readable();

            stringStream.push('<html><head>');
            stringStream.push('</head><body>');
            stringStream.push('</body></html>');

            stringStream.push(null);
            stringStream.pipe(response);

            return;
        } else if (page.indexOf('/jsonpage') > -1) {
            fs.readFile('tests/generated/ufeAllParts.json', (err, data) => {
                const d = JSON.parse(data);
                const stringStream = new Readable();
                stringStream.push('<html><head>');
                stringStream.push(d.ufeHead);
                stringStream.push('</head><body>');
                stringStream.push(d.ufeHeader);
                stringStream.push(d.ufeFooter);
                stringStream.push(d.ufeLinkJson);

                stringStream.push('</body></html>');

                stringStream.push(null);
                stringStream.pipe(response);
            });

            return;
        } else if (page.indexOf('/js/ufe') === 0) {
            page = pwd + '/projects/ui' + page.replace(/\/ufe/g, '/dist/cjs');
        } else if (page.indexOf('/img') === 0) {
            page = pwd + '/projects/ui' + page.replace(/\/ufe/g, '');
        } else {
            page = pwd + page;
        }

        //console.log(page);
        let previous = parent;
        parent = parent.replace(/^\//, '');
        fs.access(page, fs.constants.R_OK, err => {
            if (!err) {
                fs.stat(page, (xerr, stats) => {
                    previous = previous.substring(0, previous.lastIndexOf('/'));
                    previous = previous.length === 0 ? '/' : previous;

                    if (stats.isFile()) {
                        const filedata = fs.createReadStream(page);
                        let ctype;
                        const ext = page.substring(page.lastIndexOf('.')).trim();

                        if (ext === '.js') {
                            ctype = 'application/x-javascript';
                        } else if (ext === '.svg') {
                            ctype = 'image/svg+xml';
                        }

                        if (ctype) {
                            response.writeHead(200, { 'Content-Type': ctype });
                        }

                        filedata.on('data', chunk => {
                            response.write(chunk);
                        });
                        filedata.on('end', () => {
                            response.end();
                        });
                    } else if (stats.isDirectory()) {
                        fs.readdir(page, (serr, files) => {
                            let results = parent.length > 0 ? `<a href="${previous}">back</a>` : '';

                            for (let i = 0, end = files.length; i < end; i++) {
                                let realName = files[i];

                                if (realName.indexOf(parent) < 0) {
                                    realName = '/' + parent + '/' + realName;
                                }

                                results += `<br><a href="${realName}">${files[i]}</a>`;
                            }

                            response.writeHead(200, { 'Content-Type': 'text/html' });
                            response.end(results);
                        });
                    }
                });
            } else {
                console.log(`${page} does not exist locally, trying remote ${host}`);
                remoteIt(request, response);
            }
        });
    } else {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.end();
    }
});

const port = process.env.PORT || 4000;
server.listen(port);
console.log(`Server listening on ${port}`);
