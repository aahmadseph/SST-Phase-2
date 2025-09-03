// describe('homepage', () => {

//     const baseDir = process.cwd();

//     const responseMockClass = require(`#tests/mocks/responseMock.js`),
//         requestMock = require(`#tests/mocks/requestMock.js`);

//     let orchestrator,
//         http,
//         https;

//     beforeAll(async () => {
//         http = await import('node:http');
//         https = await import('node:https');
//     });

//     beforeEach(async () => {
//         spyOn(http, 'request').and.callFake((opts, cb) => {
//             return new requestMock(opts, cb);
//         });

//         spyOn(https, 'request').and.callFake((opts, cb) => {
//             return new requestMock(opts, cb);
//         });

//         orchestrator = await import('#server/services/orchestration/homepage.mjs');
//     });

//     it('homepage orchestration', async () => {
//         const request = new requestMock({
//                 channel: 'MW',
//                 language: 'en',
//                 country: 'US',
//                 dedupable: true
//             }),
//             response = new responseMockClass();

//         const spyFn = spyOn(orchestrator, 'default').and.callThrough();
//         await spyFn(request, response);
//         expect(spyFn).toHaveBeenCalled();
//     });

// });
