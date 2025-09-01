// /* eslint max-len: [2, 200], indent: 0 */
// describe('tests for the http server files', () => {
//     let fileData,
//         httpServer;
//     const Readable = require('stream').Readable,
//         fs = require('fs/promises'),
//         request = require('request'),
//         path = require('path'),
//         baseDir = process.cwd(),
//         envConfigModulePath = path.join(baseDir, 'server/config/envConfig');

//     const serverPort = 3010,
//         serverHostIP = 'http://127.0.0.1';

//     const sleepyTime = (delay) => {
//         return new Promise(resolve => {
//             setTimeout(() => {
//                 resolve();
//             }, delay);
//         });
//     };

//     beforeAll(async () => {
//         process.env.NODE_PATH = path.join(baseDir, '/public_ufe/js');
//         process.env.WORKERS = 1;
//         process.env.NODE_ENV = 'production';
//         process.env.BUILD_MODE = 'isomorphic';
//         process.env.LOG_LEVEL = 'warn';
//         process.env.MAX_REQUEST_SIZE = '2e6';
//         process.env.PORT = serverPort;
//         process.env.MAX_MEMORY_ITEMS = 100;
//         process.env.PURGE_ITEM_PERCENT = 40;
//         process.env.REQUEST_COUNT_TO_LOG = 5;

//         const envName = require.resolve(envConfigModulePath);
//         delete require.cache[envName];

//         httpServer = await import(`${baseDir}/server/ufe.mjs`);

//         const filepath = path.join(baseDir, '/tools/data/initial-test.json');

//         const data = await fs.readFile(filepath);
//         fileData = data.toString();
//         await sleepyTime(1000);
//     });

//     afterAll(() => {
//         httpServer.server.close();
//     });

//     describe('using a running server', () => {
//         it('test http server request and response', async () => {
//             const host = serverHostIP,
//                 xpath = '/templateResolver?channel=RWD&country=US&urlPath=%2F%3F&hash=ec3911d567207dda52df672342ad0812f0ad90b9';

//             const firstTest = () => {
//                 return new Promise(resolve => {
//                     const stringToStream = new Readable();
//                     stringToStream.push(fileData);
//                     stringToStream.push(null);

//                     const now = process.hrtime();
//                     stringToStream.pipe(request.post(`${host}:${serverPort}${xpath}`))
//                         .on('response', function (response) {
//                             const delta = process.hrtime(now);
//                             const diff = delta[0] * 1e9 + delta[1];
//                             console.log(`End with status code ${response.statusCode} ${now} \t finished in ${diff/1e9} seconds`);
//                             return resolve(response.statusCode);
//                         })
//                         .on('error', function (err) {
//                             throw new Error(`Ended with an error ${err}`);
//                         });

//                 });
//             };
//             const statusCode = await firstTest();
//             expect(statusCode).toEqual(200);
//         });


//         it('test http server request and response with dontCache=true and no hash', async () => {
//             const host = serverHostIP,
//                 xpath = '/templateResolver?channel=FS&country=US&urlPath=%2F%3F&dontCache=true';

//             const firstTest = () => {
//                 return new Promise(resolve => {
//                     const stringToStream = new Readable();
//                     stringToStream.push(fileData);
//                     stringToStream.push(null);

//                     const now = process.hrtime();
//                     stringToStream.pipe(request.post(`${host}:${serverPort}${xpath}`))
//                         .on('response', function (response) {
//                             const delta = process.hrtime(now);
//                             const diff = delta[0] * 1e9 + delta[1];
//                             console.log(`End with status code ${response.statusCode} ${now} \t finished in ${diff/1e9} seconds`);
//                             return resolve(response.statusCode);
//                         })
//                         .on('error', function (err) {
//                             throw new Error(`Ended with an error ${err}`);
//                         });

//                 });
//             };
//             const statusCode = await firstTest();
//             expect(statusCode).toEqual(200);
//         });

//         it('test http server no hash key', async () => {
//             const host = serverHostIP,
//                 xpath = '/templateResolver?channel=RWD&country=US&urlPath=%2F%3F';

//             const firstTest = () => {
//                 return new Promise(resolve => {
//                     const stringToStream = new Readable();
//                     stringToStream.push(fileData);
//                     stringToStream.push(null);

//                     const now = process.hrtime();
//                     stringToStream.pipe(request.post(`${host}:${serverPort}${xpath}`))
//                         .on('response', function (response) {
//                             const delta = process.hrtime(now);
//                             const diff = delta[0] * 1e9 + delta[1];
//                             console.log(`Ended with status code ${response.statusCode}`);
//                             return resolve(response.statusCode);
//                         })
//                         .on('error', function (err) {
//                             throw new Error(`Ended with an error ${err}`);
//                         });

//                 });
//             };
//             const statusCode = await firstTest();
//             expect(statusCode).toEqual(200);
//         });

//         it('test http server MULTIPLE request and response', async () => {
//             const MAX_REQUESTS = 5,
//                 MAX_INITIAL_REQUESTS = 4;
//             const host = serverHostIP,
//                 xpath = '/templateResolver?channel=RWD&country=US&urlPath=';
//             let j = 0;

//             function makeRequest() {
//                 return new Promise(resolve => {
//                     const now = process.hrtime();
//                     const stringToStream = new Readable();
//                     stringToStream.push(fileData);
//                     stringToStream.push(null);
//                     stringToStream.pipe(request.post(`${host}:${serverPort}${xpath}${j%3}%2F%3F&hash=ec3911d567207dda52df672342ad0812f0ad90b9${j%3}`))
//                         .on('response', function (response) {
//                             const delta = process.hrtime(now);
//                             const diff = delta[0] * 1e9 + delta[1];
//                             console.log(`End with status code ${response.statusCode} ${now} \t finished in ${diff/1e9} seconds`);
//                             return resolve(response.statusCode);
//                         })
//                         .on('error', function (err) {
//                             throw new Error(`Ended with an error ${err}`);
//                         });
//                 });
//             }
//             const requests = [];
//             for (let p = 0; p < MAX_REQUESTS; p++) {
//                 for (j = 0; j < MAX_INITIAL_REQUESTS; j++) {
//                     requests.push(makeRequest());
//                 }
//             }
//             const results = await Promise.all(requests);
//             const failed = results.filter(statusCode => statusCode !== 200);
//             expect(failed.length).toEqual(0);
//         });

//         it('test http server MULTIPLE request and response empty url path', async () => {

//             const MAX_INITIAL_REQUESTS = 15;
//             const host = serverHostIP,
//                 xpath = '/templateResolver?channel=RWD&country=US&urlPath=';
//             let j = 0;

//             function makeRequest() {
//                 return new Promise(resolve => {
//                     const now = process.hrtime();
//                     const stringToStream = new Readable();
//                     stringToStream.push(fileData);
//                     stringToStream.push(null);
//                     stringToStream.pipe(request.post(`${host}:${serverPort}${xpath}${j%3}%2F%3F&hash=ec3911d567207dda52df672342ad0812f0ad90b9${j%3}`))
//                         .on('response', function (response) {
//                             const delta = process.hrtime(now);
//                             const diff = delta[0] * 1e9 + delta[1];
//                             console.log(`End with status code ${response.statusCode} ${now} \t finished in ${diff/1e9} seconds`);
//                             return resolve(response.statusCode);
//                         })
//                         .on('error', function (err) {
//                             throw new Error(`Ended with an error ${err}`);
//                         });
//                 });
//             }
//             const requests = [];
//             for (let p = 0; p < MAX_INITIAL_REQUESTS; p++) {
//                 j++;
//                 requests.push(makeRequest());
//             }
//             const results = await Promise.all(requests);
//             const failed = results.filter(statusCode => statusCode !== 200);
//             expect(failed.length).toEqual(0);
//         });

//         it('test http server with br content encoding and should default to no content encodiding', async () => {

//             const host = serverHostIP,
//                 xpath = '/templateResolver?channel=RWD&country=US&urlPath=%2F';

//             const firstTest = () => {
//                 return new Promise(resolve => {
//                     const stringToStream = new Readable();
//                     stringToStream.push(fileData);
//                     stringToStream.push(null);

//                     const options = {
//                         url: `${serverHostIP}:${serverPort}${xpath}`,
//                         method: 'POST',
//                         headers: {
//                             'Accept': 'text/plain, application/json, application/*+json, */*',
//                             'Content-Type': 'application/json;charset=UTF-8',
//                             'Accept-Encoding': 'br',
//                             'Content-length': stringToStream.length,
//                             'Host': `${serverHostIP}:${serverPort}`,
//                             'User-Agent': 'Request.js Master Tests Http Client; version 1.0',
//                             'Connection': 'keep-alive'
//                         }
//                     };

//                     const now = process.hrtime();
//                     stringToStream.pipe(request.post(`${host}:${serverPort}${xpath}`))
//                         .on('response', function (response) {
//                             const delta = process.hrtime(now);
//                             const diff = delta[0] * 1e9 + delta[1];
//                             console.log(`End br test with status code ${response.statusCode} ${now} \t finished in ${diff/1e9} seconds`);
//                             return resolve(response.statusCode);
//                         })
//                         .on('error', function (err) {
//                             throw new Error(`Ended with an error ${err}`);
//                         });

//                 });
//             };
//             const statusCode = await firstTest();
//             expect(statusCode).toEqual(200);
//         });

//         describe('caching tests', () => {

//             let j = 0;

//             beforeEach(() => {
//                 j = 0;
//             });

//             it('test http server MULTIPLE cached request and response with gzip', async () => {

//                 const xpath = '/templateResolver?hash=53cf5f593eb0d4c2b0620e6703ee371fd21f0bf9&channel=FS&country=US&urlPath=%2F%3Fnull';

//                 function makeRequest() {
//                     return new Promise(resolve => {
//                         const now = process.hrtime();
//                         const stringToStream = new Readable();
//                         stringToStream.push(fileData);
//                         stringToStream.push(null);

//                         const options = {
//                             url: `${serverHostIP}:${serverPort}${xpath}`,
//                             method: 'POST',
//                             headers: {
//                                 'Accept': 'text/plain, */*',
//                                 'Content-Type': 'application/json;charset=UTF-8',
//                                 'Accept-Encoding': 'gzip, deflate',
//                                 'Content-length': stringToStream.length,
//                                 'Host': `${serverHostIP}:${serverPort}`,
//                                 'User-Agent': 'Request.js Master Tests Http Client; version 1.0',
//                                 'Connection': 'keep-alive'
//                             }
//                         };

//                         stringToStream.pipe(request(options))
//                             .on('response', async function (response) {
//                                 const delta = process.hrtime(now);
//                                 const diff = delta[0] * 1e9 + delta[1];
//                                 //console.log(`End ${j} with status code ${response.statusCode} ${now} \t finished in ${diff/1e9} seconds`);
//                                 return resolve(response.statusCode);
//                             })
//                             .on('error', function (err) {
//                                 throw new Error(`Ended with an error ${err}`);
//                             });
//                     });
//                 }
//                 const results = [];
//                 for (j = 0; j < 6; j++) {
//                     results.push(makeRequest());
//                 }
//                 const resolved = await Promise.all(results);
//                 // wait 1 seconds before starting so the other test can finish
//                 const failed = resolved.filter(statusCode => statusCode !== 200);
//                 expect(failed.length).toEqual(0);
//             });

//             it('test http server MULTIPLE cached request and response using deflate', async () => {

//                 const xpath = '/templateResolver?hash=53cf5f593eb0d4c2b0620e670312312371fd21f0bf9&channel=FS&country=US&urlPath=%2F%3Fnull';

//                 function makeRequest() {
//                     return new Promise(resolve => {
//                         const now = process.hrtime();
//                         const stringToStream = new Readable();
//                         stringToStream.push(fileData);
//                         stringToStream.push(null);

//                         const options = {
//                             url: `${serverHostIP}:${serverPort}${xpath}`,
//                             method: 'POST',
//                             headers: {
//                                 'Accept': 'text/plain, application/json, application/*+json, */*',
//                                 'Content-Type': 'application/json;charset=UTF-8',
//                                 'Accept-Encoding': 'deflate',
//                                 'Content-length': stringToStream.length,
//                                 'Host': `${serverHostIP}:${serverPort}`,
//                                 'User-Agent': 'Request.js Master Tests Http Client; version 1.0',
//                                 'Connection': 'keep-alive'
//                             }
//                         };

//                         stringToStream.pipe(request(options))
//                             .on('response', function (response) {
//                                 const delta = process.hrtime(now);
//                                 const diff = delta[0] * 1e9 + delta[1];
//                                 //console.log(`End ${j} with status code ${response.statusCode} ${now} \t finished in ${diff/1e9} seconds`);
//                                 return resolve(response.statusCode);
//                             })
//                             .on('error', function (err) {
//                                 throw new Error(`Ended with an error ${err}`);
//                             });
//                     });
//                 }

//                 const results = [];
//                 for (j = 0; j < 6; j++) {
//                     results.push(makeRequest());
//                 }
//                 const resolved = await Promise.all(results);
//                 // wait 1 seconds before starting so the other test can finish
//                 const failed = resolved.filter(statusCode => statusCode !== 200);
//                 expect(failed.length).toEqual(0);
//             });

//             it('test http server uncached request and response using no accept encoding', async () => {

//                 const xpath = '/templateResolver?hash=53cf5f593eb0d4c2b0620e670312312371fd21f0bf9&channel=FS&country=US&urlPath=%2F%3Fnull';

//                 const now = process.hrtime();
//                 const stringToStream = new Readable();
//                 stringToStream.push(fileData);
//                 stringToStream.push(null);

//                 const options = {
//                     url: `${serverHostIP}:${serverPort}${xpath}`,
//                     method: 'POST',
//                     headers: {
//                         'Accept': 'text/plain, application/json, application/*+json, */*',
//                         'Content-Type': 'application/json;charset=UTF-8',
//                         'Content-length': stringToStream.length,
//                         'Host': `${serverHostIP}:${serverPort}`,
//                         'User-Agent': 'Request.js Master Tests Http Client; version 1.0',
//                         'Connection': 'keep-alive'
//                     }
//                 };

//                 const finish = async () => {
//                     return new Promise(resolve => {
//                         stringToStream.pipe(request(options))
//                             .on('response', function (response) {
//                                 const delta = process.hrtime(now);
//                                 const diff = delta[0] * 1e9 + delta[1];
//                                 //console.log(`End ${j} with status code ${response.statusCode} ${now} \t finished in ${diff/1e9} seconds`);
//                                 return resolve(response.statusCode);
//                             })
//                             .on('error', function (err) {
//                                 throw new Error(`Ended with an error ${err}`);
//                             });
//                     });
//                 };
//                 const statusCode = await finish();
//                 expect(statusCode).toEqual(200);
//             });

//             it('test http server uncached request and response using BAD accept encoding', async () => {

//                 const xpath = '/templateResolver?hash=53cf5f593eb0d4c2b0620e670312312371fd21f0bf9&channel=FS&country=US&urlPath=%2F%3Fnull';

//                 const now = process.hrtime();
//                 const stringToStream = new Readable();
//                 stringToStream.push(fileData);
//                 stringToStream.push(null);

//                 const options = {
//                     url: `${serverHostIP}:${serverPort}${xpath}`,
//                     method: 'POST',
//                     headers: {
//                         'Accept': 'text/plain, application/json, application/*+json, */*',
//                         'Accept-Encoding': 'bzip2, banana, anythingIWant',
//                         'Content-Type': 'application/json;charset=UTF-8',
//                         'Content-length': stringToStream.length,
//                         'Host': `${serverHostIP}:${serverPort}`,
//                         'User-Agent': 'Request.js Master Tests Http Client; version 1.0',
//                         'Connection': 'keep-alive'
//                     }
//                 };

//                 const finish = async () => {
//                     return new Promise(resolve => {
//                         stringToStream.pipe(request(options))
//                             .on('response', function (response) {
//                                 const delta = process.hrtime(now);
//                                 const diff = delta[0] * 1e9 + delta[1];
//                                 //console.log(`End ${j} with status code ${response.statusCode} ${now} \t finished in ${diff/1e9} seconds`);
//                                 return resolve(response.statusCode);
//                             })
//                             .on('error', function (err) {
//                                 throw new Error(`Ended with an error ${err}`);
//                             });
//                     });
//                 };
//                 const statusCode = await finish();
//                 expect(statusCode).toEqual(200);
//             });
//         });

//         it('test http server /status request', async () => {

//             let results = '',
//                 statusCode;

//             const host = serverHostIP,
//                 xpath = '/status';

//             const now = process.hrtime();
//             const finish = async () => {
//                 return new Promise(resolve => {
//                     request.get(`${host}:${serverPort}${xpath}`)
//                         .on('data', (data) => {
//                             results += data.toString();
//                         })
//                         .on('response', function (response) {
//                             const delta = process.hrtime(now);
//                             const diff = delta[0] * 1e9 + delta[1];
//                             //console.log(`Response with status code ${response.statusCode} ${now} in ${diff/1e9} seconds`);
//                             if (!statusCode && response.statusCode) {
//                                 statusCode = response.statusCode;
//                             }
//                         })
//                         .on('end', () => {
//                             //console.log(results);
//                             const status = JSON.parse(results);

//                             //console.log(`End with status code ${statusCode} ${now} \t finished`);
//                             return resolve({
//                                 statusCode,
//                                 status: status.status,
//                                 maxRequestSize: status.metrics.maxRequestSize
//                             });
//                         })
//                         .on('error', function (err) {
//                             throw new Error(`Ended with an error ${err}`);
//                         });
//                 });
//             };
//             const status = await finish();
//             expect(status.statusCode).toEqual(200);
//             expect(status.status).toEqual('OK');
//             expect(status.maxRequestSize).toEqual(2000000);

//         });

//         it('test http server /healthcheck request', async () => {

//             let results = '';

//             const host = serverHostIP,
//                 xpath = '/healthcheck';

//             const now = process.hrtime();
//             const finish = async () => {
//                 let statusCode;
//                 return new Promise(resolve => {
//                     request.get(`${host}:${serverPort}${xpath}`)
//                         .on('data', (data) => {
//                             results += data.toString();
//                         })
//                         .on('response', function (response) {
//                             const delta = process.hrtime(now);
//                             const diff = delta[0] * 1e9 + delta[1];
//                             //console.log(`Response with status code ${response.statusCode} ${now} in ${diff/1e9} seconds`);
//                             if (!statusCode && response.statusCode) {
//                                 statusCode = response.statusCode;
//                             }
//                         })
//                         .on('end', () => {
//                             //console.log(results);
//                             return resolve(statusCode);
//                         })
//                         .on('error', function (err) {
//                             throw new Error(`Ended with an error ${err}`);
//                         });
//                 });
//             };
//             const statusCode = await finish();
//             expect(statusCode).toEqual(200);
//         });
//     });

//     describe('error state tests', () => {

//         it('test expected 404 response from GET request', async () => {

//             const host = serverHostIP,
//                 xpath = '/templateResolver';

//             const now = process.hrtime();
//             const finish = async () => {
//                 return new Promise(resolve => {
//                     request.get(`${host}:${serverPort}${xpath}`)
//                         .on('response', function (response) {
//                             const delta = process.hrtime(now);
//                             const diff = delta[0] * 1e9 + delta[1];
//                             console.log(`End with status code ${response.statusCode} ${now} \t finished in ${diff/1e9} seconds`);
//                             return resolve(response.statusCode);
//                         })
//                         .on('error', function (err) {
//                             throw new Error(`Ended with an error ${err}`);
//                         });
//                 });
//             };
//             const statusCode = await finish();
//             expect(statusCode).toEqual(404);
//         });

//         it('test http server 422 response', async () => {
//             let results = '';

//             const host = serverHostIP,
//                 xpath = '/templateResolver?channel=FS&country=US&urlPath=%2F%3F&hash=e123123127dda52df672342ad0812f0ad90b9&renderType=index';

//             const stringToStream = new Readable();
//             stringToStream.push('}p');
//             stringToStream.push(null);

//             const now = process.hrtime();
//             const finish = async () => {
//                 let statusCode;
//                 return new Promise(resolve => {
//                     stringToStream.pipe(request.post(`${host}:${serverPort}${xpath}`))
//                         .on('data', (data) => {
//                             results += data.toString();
//                         })
//                         .on('response', function (response) {
//                             const delta = process.hrtime(now);
//                             const diff = delta[0] * 1e9 + delta[1];
//                             statusCode = response.statusCode;
//                             console.log(`End with status code ${response.statusCode} ${now} \t finished in ${diff/1e9} seconds`);
//                         })
//                         .on('end', () => {
//                             //console.log(results);
//                             //console.log(statusCode);
//                             return resolve(statusCode);
//                         })
//                         .on('error', function (err) {
//                             console.log(`Ended with an error ${err}`);
//                         });
//                 });
//             };
//             const statusCode = await finish();
//             expect(statusCode).toEqual(422);
//         });
//     });
// });
