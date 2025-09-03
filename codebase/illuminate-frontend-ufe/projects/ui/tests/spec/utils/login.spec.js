// describe('Login', () => {
//     let loginModule;
//     let ufeApi;
//     let loginSpy;
//     let makeRequest;
//     const deviceFingerprint = '236782367235467236784';
//     const login = 'login';
//     const password = 'password';
//     const loginForCheckout = true;
//     const isKeepSignedIn = true;
//     const url = '/api/auth/login';
//     const loginParams = {
//         login,
//         options: {
//             isKeepSignedIn,
//             loginForCheckout
//         },
//         password
//     };
//
//     beforeEach(() => {
//         loginModule = require('services/api/authentication/login');
//         ufeApi = require('services/api/ufeApi').default;
//         loginSpy = spyOn(loginModule, 'login').and.callThrough();
//         makeRequest = spyOn(ufeApi, 'makeRequest').and.callThrough();
//     });
//
//     describe('when login with Stay signed turned on', () => {
//         it('should call the ufeApi makeRequest method with deviceFingerprint key', () => {
//             // Arrange
//             const loginParamsWithDeviceFingerprint = {
//                 ...loginParams,
//                 deviceFingerprint
//             };
//
//             const expectedOptions = {
//                 method: 'POST',
//                 body: JSON.stringify({
//                     login,
//                     password,
//                     deviceFingerprint,
//                     loginForCheckout,
//                     isKeepSignedIn
//                 }),
//                 headers: { 'Content-type': 'application/json' }
//             };
//
//             // Act
//             loginModule.login(loginParamsWithDeviceFingerprint);
//
//             // Assert
//             expect(makeRequest).toHaveBeenCalledWith(url, expectedOptions);
//         });
//     });
//
//     describe('when login with Stay signed turned off', () => {
//         it('should call the ufeApi makeRequest method without the deviceFingerprint key', () => {
//             // Arrange
//             const expectedOptions = {
//                 method: 'POST',
//                 body: JSON.stringify({
//                     login,
//                     password,
//                     loginForCheckout,
//                     isKeepSignedIn
//                 }),
//                 headers: { 'Content-type': 'application/json' }
//             };
//
//             // Act
//             loginModule.login(loginParams);
//
//             // Assert
//             expect(makeRequest).toHaveBeenCalledWith(url, expectedOptions);
//         });
//     });
// });
