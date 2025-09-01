// /* eslint-disable no-unused-vars */
// const { objectContaining } = jasmine;
// const ufeApi = require('services/api/ufeApi').default;

// const {
//     ResponseErrorCode: { SSI_SIGN_IN_REQUIRED }
// } = ufeApi;

// describe('ufeApi', () => {
//     describe('makeSingleRequest', () => {
//         const controllerStub = { signal: 'fake_signal' };
//         let fetch;

//         beforeEach(function () {
//             const pendingPromise = new Promise(() => {});
//             fetch = spyOn(window, 'fetch').and.returnValue(Promise.resolve(pendingPromise));
//             Sephora.host = 'test-host';
//             window.AbortController = () => controllerStub;
//         });

//         describe('for abortable request', () => {
//             let config;
//             beforeEach(() => {
//                 config = { abortable: true };
//                 ufeApi.makeSingleRequest('/some/path', {}, config);
//             });

//             it('should add signal property into request options', () => {
//                 expect(window.fetch).toHaveBeenCalledWith('/some/path', objectContaining({ signal: 'fake_signal' }));
//             });

//             it('should inject abortController into config', () => {
//                 expect(config.abortController).toEqual(controllerStub);
//             });
//         });

//         it('should make request with highest priority by default', () => {
//             // Arrange
//             const URL = 'www.sephora.com';
//             const options = {};
//             const config = {};
//             const priorityOption = { importance: 'high' };

//             // Act
//             ufeApi.makeSingleRequest(URL, options, config);

//             // Assert
//             expect(fetch).toHaveBeenCalledWith(URL, objectContaining(priorityOption));
//         });
//     });

//     describe('makeSingleRequestForExpiredJwtToken', () => {
//         const controllerStub = { signal: 'fake_signal' };
//         const response = {
//             headers: { 'Content-Type': 'text/plain' },
//             status: 401
//         };
//         const returnValue = {
//             responseStatus: 401
//         };
//         let fetch;

//         beforeEach(function () {
//             const pendingPromise = new Promise(() => response);
//             fetch = spyOn(window, 'fetch').and.returnValue(Promise.resolve(pendingPromise));
//             Sephora.host = 'test-host';
//             window.AbortController = () => controllerStub;
//         });

//         it('should return proper response for unauthorized call', () => {
//             fetch().then(responseData => {
//                 expect(responseData).toEqual(returnValue);
//             });
//         });
//     });

//     describe('makeRequest', () => {
//         beforeEach(function () {
//             const pendingPromise = new Promise(() => {});
//             spyOn(window, 'fetch').and.returnValue(Promise.resolve(pendingPromise));
//             Sephora.host = 'test-host';
//         });

//         it('should be called with the passed in arguments', () => {
//             // Arrange
//             const path = '/some/path';
//             const options = {
//                 method: 'GET',
//                 credentials: 'include'
//             };

//             // Act
//             ufeApi.makeRequest(path, options);

//             // Assert
//             expect(window.fetch).toHaveBeenCalledWith(`https://test-host${path}`, objectContaining(options));
//         });

//         it('should override method with options.method', () => {
//             // Arrange
//             const path = '/some/other-path';
//             const options = { method: 'POST' };

//             // Act
//             ufeApi.makeRequest(path, options);

//             // Assert
//             expect(window.fetch).toHaveBeenCalledWith(`https://test-host${path}`, objectContaining(options));
//         });

//         it('should default options.credentials to "include"', () => {
//             // Arrange
//             const path = '/a/compconstely/different/path';
//             const options = {
//                 credentials: 'include',
//                 importance: 'high'
//             };

//             // Act
//             ufeApi.makeRequest(path);

//             // Assert
//             expect(window.fetch).toHaveBeenCalledWith(`https://test-host${path}`, options);
//         });

//         it('should override credentials with options.credentials', () => {
//             // Arrange
//             const path = '/a/popular/path';
//             const options = {
//                 credentials: 'other',
//                 importance: 'high'
//             };

//             // Act
//             ufeApi.makeRequest(path, options);

//             // Assert
//             expect(window.fetch).toHaveBeenCalledWith(`https://test-host${path}`, options);
//         });
//     });

//     describe('handleResponse', () => {
//         let responseDataStub;
//         let performManualSignInAndMakeRequestStub;

//         beforeEach(function () {
//             responseDataStub = {};
//             performManualSignInAndMakeRequestStub = spyOn(ufeApi, 'performManualSignInAndMakeRequest');
//         });

//         it('should reject autoLogin request with response data', () => {
//             ufeApi.handleResponse(ufeApi.ResponseStatusCode.FORBIDDEN, responseDataStub, 'api/ssi/autoLogin').catch(responseData => {
//                 expect(responseData).toEqual(responseDataStub);
//             });
//         });

//         it('should require sign in with response data', () => {
//             ufeApi.handleResponse(ufeApi.ResponseErrorCode.SSI_SIGN_IN_REQUIRED, responseDataStub, '/api/checkout/order/init').catch(responseData => {
//                 expect(responseData).toEqual(responseDataStub);
//             });
//         });

//         it('should NOT require sign in with response data on 409 if the call is for SDN notifications', async () => {
//             try {
//                 await ufeApi.handleResponse(
//                     SSI_SIGN_IN_REQUIRED,
//                     { errorCode: SSI_SIGN_IN_REQUIRED },
//                     `${Sephora.configurationSettings.sdnDomainBaseUrl}/v1/notifications`
//                 );
//             } catch (error) {
//                 expect(error.responseStatus).toEqual(SSI_SIGN_IN_REQUIRED);
//             }
//         });
//     });

//     describe('buildRequestUrl', () => {
//         beforeEach(function () {
//             const pendingPromise = new Promise(() => {});
//             spyOn(window, 'fetch').and.returnValue(Promise.resolve(pendingPromise));
//             Sephora.host = 'test-host';
//         });

//         it('should build URL with https', () => {
//             // Arrange
//             const path = 'https://some/path';
//             const options = {
//                 method: 'GET',
//                 credentials: 'include',
//                 importance: 'high'
//             };

//             // Act
//             ufeApi.makeRequest(path, options);

//             // Assert
//             expect(window.fetch).toHaveBeenCalledWith(path, options);
//         });

//         it('should use window.location.hostname when Sephora.host is undefined', () => {
//             // Arrange
//             const oldSephoraHost = Sephora.host;
//             Sephora.host = undefined;
//             const host = window.location.hostname;
//             const path = '/some/path';
//             const options = {
//                 method: 'GET',
//                 credentials: 'include',
//                 importance: 'high'
//             };

//             // Act
//             ufeApi.makeRequest(path, options);

//             // Assert
//             expect(window.fetch).toHaveBeenCalledWith(`https://${host}${path}`, options);
//             Sephora.host = oldSephoraHost;
//         });

//         it('should not use a port when Sephora.sslPort is 443', () => {
//             // Arrange
//             const oldSephoraSslPort = Sephora.sslPort;
//             Sephora.sslPort = 443;
//             const path = '/some/path';
//             const options = {
//                 method: 'GET',
//                 credentials: 'include',
//                 importance: 'high'
//             };

//             // Act
//             ufeApi.makeRequest(path, options);

//             // Assert
//             expect(window.fetch).toHaveBeenCalledWith(`https://test-host${path}`, options);
//             Sephora.sslPort = oldSephoraSslPort;
//         });

//         it('should not use a port when Sephora.sslPort is empty string', () => {
//             // Arrange
//             const oldSephoraSslPort = Sephora.sslPort;
//             Sephora.sslPort = '';
//             const path = '/some/path';
//             const options = {
//                 method: 'GET',
//                 credentials: 'include',
//                 importance: 'high'
//             };

//             // Act
//             ufeApi.makeRequest(path, options);

//             // Assert
//             expect(window.fetch).toHaveBeenCalledWith(`https://test-host${path}`, options);
//             Sephora.sslPort = oldSephoraSslPort;
//         });

//         it('should use a port when Sephora.sslPort is any numeric port other than 443', () => {
//             // Arrange
//             const oldSephoraSslPort = Sephora.sslPort;
//             Sephora.sslPort = 80;
//             const path = '/some/path';
//             const options = {
//                 method: 'GET',
//                 credentials: 'include',
//                 importance: 'high'
//             };

//             // Act
//             ufeApi.makeRequest(path, options);

//             // Assert
//             expect(window.fetch).toHaveBeenCalledWith(`https://test-host:80${path}`, options);
//             Sephora.sslPort = oldSephoraSslPort;
//         });
//     });

//     describe('decorateRequestMakerWithRetryLogic', () => {
//         it('should reject the promise immediately when there is an Error', done => {
//             const error = new Error('an error message');
//             spyOn(window, 'fetch').and.returnValue(Promise.reject(error));
//             const path = '/some/path';
//             const options = {
//                 method: 'GET',
//                 credentials: 'include'
//             };

//             ufeApi.makeRequest(path, options).catch(reason => {
//                 expect(reason).toEqual(error);
//                 done();
//             });
//         });

//         it('should retry and reject the promise with an error code when there is a TypeError', done => {
//             const error = new TypeError('Network request failed');
//             spyOn(window, 'fetch').and.returnValue(Promise.reject(error));
//             const path = '/some/path';
//             const options = {
//                 method: 'GET',
//                 credentials: 'include'
//             };
//             const config = { retryTimeout: 100 };

//             ufeApi.makeRequest(path, options, config).catch(reason => {
//                 expect(reason.errorCode).toEqual(ufeApi.ResponseErrorCode.NETWORK_REQUEST_FAILED);
//                 done();
//             });
//         });

//         // it('should retry and reject the promise a number of times when there is a TypeError', done => {
//         //     const error = new TypeError('Network request failed');
//         //     spyOn(window, 'fetch').and.returnValue(Promise.reject(error));
//         //     const path = '/some/path';
//         //     const options = { method: 'GET', credentials: 'include' };
//         //     const config = { numRetries: 5, retryTimeout: 100 };

//         //     ufeApi.makeRequest(path, options, config).catch(reason => {
//         //         expect(window.fetch.calls.count()).toEqual(6);
//         //         done();
//         //     });
//         // });
//     });

//     describe('decorateRequestMakerWithAbortableLogic', () => {
//         it('should normally resolve the promise in a successful scenario', done => {
//             const payload = 'payload';

//             const requestControl = {};
//             const resolver = {
//                 listen: l => (resolver.listener = l),
//                 trigger: data => resolver.listener(data)
//             };
//             const decorated = observer => {
//                 return new Promise(resolve => {
//                     observer.listen(resolve);
//                 });
//             };

//             ufeApi
//                 .abortable(
//                     decorated,
//                     requestControl
//                 )(resolver)
//                 .then(data => {
//                     expect(data).toEqual(payload);
//                     done();
//                 });

//             resolver.trigger(payload);
//         });

//         it('should normally reject the promise in a unsuccessful scenario', done => {
//             const payload = 'payload';

//             const requestControl = {};
//             const rejector = {
//                 listen: l => (rejector.listener = l),
//                 trigger: data => rejector.listener(data)
//             };
//             const decorated = observer => {
//                 return new Promise((resolve, reject) => {
//                     observer.listen(reject);
//                 });
//             };

//             ufeApi
//                 .abortable(
//                     decorated,
//                     requestControl
//                 )(rejector)
//                 .catch(data => {
//                     expect(data).toEqual(payload);
//                     done();
//                 });

//             rejector.trigger(payload);
//         });

//         it('should abort the promise if requested', done => {
//             const requestControl = {};
//             const resolver = {
//                 listen: l => (resolver.listener = l),
//                 trigger: data => resolver.listener(data)
//             };
//             const decorated = observer => {
//                 return new Promise(resolve => {
//                     observer.listen(resolve);
//                 });
//             };

//             ufeApi
//                 .abortable(
//                     decorated,
//                     requestControl
//                 )(resolver)
//                 .catch(e => {
//                     expect(e.errorCode).toEqual(ufeApi.ResponseErrorCode.REQUEST_ABORTED);
//                     done();
//                 });

//             requestControl.abort();
//         });
//     });
// });
