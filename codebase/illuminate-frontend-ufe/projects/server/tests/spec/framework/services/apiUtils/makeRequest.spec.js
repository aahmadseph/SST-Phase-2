// /* eslint-ignore */
// describe('makeRequest', () => {

//     //     describe('makeRequest', () => {

//     const baseDir = process.cwd();

//     const responseMockClass = require(`#tests/mocks/responseMock.js`),
//         requestMock = require(`#tests/mocks/requestMock.js`);

//     //         const webRequestPath = `${baseDir}/server/framework/services/net/WebRequest`;

//     let http,
//         https;

//     beforeAll(async() => {
//         http = await import('node:http');
//         https = await import('node:https');
//     });

//     describe('success', () => {
//         let getJS;
//         beforeAll(async() => {
//             spyOn(http, 'request').and.callFake((options, cb) => {
//                 return new requestMock(options, cb);
//             });
//             spyOn(https, 'request').and.callFake((options, cb) => {
//                 return new requestMock(options, cb);
//             });
//             getJS = await import('#server/framework/services/apiUtils/makeRequest.mjs');
//         });

//         it('basic get', async() => {

//             const results = await getJS.makeATGRequest('GET', '/v1/someUrl', {}, {
//                 channel: 'MW',
//                 country: 'US',
//                 language: 'en',
//                 cacheTime: 5000
//             }).catch(e => {
//                 return e;
//             });
//             expect(results).toBeDefined();
//         });

//         //             it('get cached', () => {

//         //                 getJS.makeATGRequest('GET', '/v1/someUrl', {}, {
//         //                     channel: 'MW',
//         //                     country: 'US',
//         //                     language: 'en',
//         //                     cacheTime: 5000
//         //                 }).then(results => {
//         //                     getJS.makeATGRequest('GET', '/v1/someUrl', {}, {
//         //                         channel: 'MW',
//         //                         country: 'US',
//         //                         language: 'en',
//         //                         cacheTime: 5000
//         //                     }).then(xresults => {
//         //                         expect(xresults).toBeDefined();
//         //                     }).catch(e => {
//         //                         console.error(e);
//         //                     });
//         //                 }).catch(xe => {
//         //                     console.error(xe);
//         //                 });
//         //             });

//         //             it('get cached', () => {
//         //                 expect(getJS.getMetrics().apiCallCounts).toBeGreaterThan(0);
//         //             });
//         //         });

//         //         describe('error ', () => {
//         //             class errorRequestMock extends requestMock {
//         //                 constructor(options = {}, cb) {
//         //                     super(options, cb);
//         //                     this.response = new responseMockClass(Object.assign({}, { statusCode: 301 }, options));
//         //                 }
//         //             }
//         //             let getJS;
//         //             beforeEach(() => {
//         //                 const name = require.resolve(getPath);
//         //                 if (name) {
//         //                     delete require.cache[name];
//         //                 }
//         //                 delete require.cache[require.resolve(webRequestPath)];
//         //                 spyOn(http, 'request').and.callFake((options, cb) => {
//         //                     return new errorRequestMock(options, cb);
//         //                 });
//         //                 getJS = require(getPath);
//         //             });

//         //             afterEach(() => {
//         //                 const name = require.resolve(getPath);
//         //                 if (name) {
//         //                     delete require.cache[name];
//         //                 }
//         //             });

//         //             it('error get', (done) => {

//         //                 getJS.makeATGRequest('GET', '/v1/someUrl', {}, {
//         //                     channel: 'MW',
//         //                     country: 'US',
//         //                     language: 'en',
//         //                     cacheTime: 5000
//         //                 }).then(results => {
//         //                     console.error(results);
//         //                 }).catch(e => {
//         //                     //console.error(e);
//         //                     expect(e).toBeDefined();
//         //                     done();
//         //                 });
//         //             });
//         //         });
//     });

//     //     describe('makeSecureRequest', () => {

//     //         const http = require('https');

//     //         const baseDir = process.cwd();

//     //         const responseMockClass = require(`#tests/mocks/responseMock.js`),
//     //             requestMock = require(`#tests/mocks/requestMock.js`);

//     //         const getPath = `${baseDir}/server/framework/services/apiUtils/makeRequest`,
//     //             webRequestPath = `${baseDir}/server/framework/services/net/WebRequest`;

//     //         describe('success', () => {
//     //             let getJS;
//     //             beforeAll(() => {
//     //                 process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
//     //                 const name = require.resolve(getPath);
//     //                 if (name) {
//     //                     delete require.cache[name];
//     //                 }
//     //                 delete require.cache[require.resolve(webRequestPath)];
//     //                 spyOn(http, 'request').and.callFake((options, cb) => {
//     //                     return new requestMock(options, cb);
//     //                 });
//     //                 getJS = require(getPath);
//     //             });

//     //             afterEach(() => {
//     //                 const name = require.resolve(getPath);
//     //                 if (name) {
//     //                     delete require.cache[name];
//     //                 }
//     //             });

//     //             it('basic get', (done) => {

//     //                 getJS.makeSecureRequest({
//     //                     method: 'GET',
//     //                     hostname: 'localhost',
//     //                     path: '/someUrl',
//     //                     port: 10443,
//     //                     headers: {},
//     //                     channel: 'MW',
//     //                     country: 'US',
//     //                     language: 'en'
//     //                 }).then(results => {
//     //                     expect(results).toBeDefined();
//     //                     done();
//     //                 }).catch(e => {
//     //                     console.error(e);
//     //                 });
//     //             });
//     //         });

//     //         describe('error ', () => {
//     //             class errorRequestMock extends requestMock {
//     //                 constructor(options = {}, cb) {
//     //                     super(options, cb);
//     //                     this.response = new responseMockClass(Object.assign({}, { statusCode: 301 }, options));
//     //                 }
//     //             }
//     //             let getJS;
//     //             beforeEach(() => {
//     //                 const name = require.resolve(getPath);
//     //                 if (name) {
//     //                     delete require.cache[name];
//     //                 }
//     //                 delete require.cache[require.resolve(webRequestPath)];
//     //                 spyOn(http, 'request').and.callFake((options, cb) => {
//     //                     return new errorRequestMock(options, cb);
//     //                 });
//     //                 getJS = require(getPath);
//     //             });

//     //             afterEach(() => {
//     //                 const name = require.resolve(getPath);
//     //                 if (name) {
//     //                     delete require.cache[name];
//     //                 }
//     //             });

//     //             it('error get', (done) => {

// //                 getJS.makeSecureRequest({
// //                     method: 'GET',
// //                     hostname: 'localhost',
// //                     path: '/someUrl',
// //                     port: 10443,
// //                     headers: {},
// //                     channel: 'MW',
// //                     country: 'US',
// //                     language: 'en'
// //                 }).then(results => {
// //                     console.error(results);
// //                 }).catch(e => {
// //                     console.error(e);
// //                     expect(e).toBeDefined();
// //                     done();
// //                 });
// //             });
// //         });
// //     });
// });
