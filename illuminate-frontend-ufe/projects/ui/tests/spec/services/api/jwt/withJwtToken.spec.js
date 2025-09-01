/* eslint-disable no-unused-vars */
const { createSpy } = jasmine;

describe('jwtToken', () => {
    let Storage;
    let LOCAL_STORAGE;
    let jwtToken;
    let getJwtAuthToken;

    beforeEach(() => {
        jwtToken = require('services/api/jwt/jwtToken').default;
        Storage = require('utils/localStorage/Storage').default;
        LOCAL_STORAGE = require('utils/localStorage/Constants').default;
        getJwtAuthToken = require('services/api/authentication/getJwtAuthToken').default;
    });

    describe('getJwtToken', () => {
        let getJwtAuthTokenStub;
        let setItemStub;
        let getItemStub;
        let getFormPayload;
        const responseStub = {
            responseStatus: 200,
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9maWxlSWQiOiIxMjM0NTYiLCJwcm9maWxlU3RhdHVzIjoyLCJmaXJzdE5hbWUiOiJKb2huIiwibGFzdE5hbWUiOiJEb2UiLCJlbWFpbCI6ImpvaG4uZG9lQGpkb2UuY29tIiwiZXhwIjoxNjQ3MjkwMDQ3ODAwfQ.d9zGbTYDj3lYYkIZW_H0bfYEDrsnLjIKVcFv-XgY3rU'
        };
        const user = {
            profileId: '123456',
            profileStatus: 2,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@jdoe.com'
        };
        const expiresIn = JSON.parse(atob(responseStub?.token.split('.')[1])).exp * 1000;

        beforeEach(() => {
            setItemStub = spyOn(Storage.local, 'setItem');
            getItemStub = spyOn(Storage.local, 'getItem');
            getJwtAuthTokenStub = spyOn(getJwtAuthToken, 'getJwtAuthToken');
            getFormPayload = spyOn(jwtToken, 'formPayload');
        });

        it('should return token from storage if present', () => {
            getItemStub.and.returnValue('stored_token');
            jwtToken.getJwtToken('JWT_AUTH_TOKEN').then(data => {
                expect(data).toEqual('stored_token');
            });
            expect(getItemStub).toHaveBeenCalledTimes(1);
            expect(getItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.JWT_AUTH_TOKEN);
        });

        it('should not call remote if token is present', () => {
            getItemStub.and.returnValue('stored_token');
            jwtToken.getJwtToken();
            expect(getJwtAuthTokenStub).not.toHaveBeenCalled();
        });

        it('should call remote and put token into storage', () => {
            const fakePromise = {
                then: resolve => {
                    expect(resolve(responseStub)).toEqual(responseStub.token);
                    expect(setItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.JWT_AUTH_TOKEN, responseStub.token, expiresIn);
                }
            };

            getItemStub.and.returnValue(null);
            getFormPayload.and.returnValue(user);
            getJwtAuthTokenStub.and.returnValue(fakePromise);
            jwtToken.getJwtToken('JWT_AUTH_TOKEN');
            expect(getJwtAuthTokenStub).toHaveBeenCalledTimes(1);
            expect(getJwtAuthTokenStub).toHaveBeenCalledWith(user);
        });
    });

    describe('dropSdnToken', () => {
        it('should remove item from the local storage', () => {
            const removeItemStub = spyOn(Storage.local, 'removeItem');
            jwtToken.dropJwtToken('JWT_AUTH_TOKEN');
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.JWT_AUTH_TOKEN);
        });
    });

    describe('callWithJwtToken', () => {
        let dropJwtTokenStub;
        let getJwtTokenStub;
        const args = ['arg1'];

        beforeEach(() => {
            dropJwtTokenStub = spyOn(jwtToken, 'dropJwtToken');
            getJwtTokenStub = spyOn(jwtToken, 'getJwtToken');
        });

        it('should callFunc once on 200 and dropJwtToken', () => {
            const aStub = createSpy().and.returnValue({
                then: resolve => {
                    resolve({ responseStatus: 200 });
                    expect(dropJwtTokenStub).not.toHaveBeenCalled();
                }
            });
            const fakePromise = {
                then: resolve => {
                    resolve('token_string');
                    expect(aStub).toHaveBeenCalledWith('token_string', args[0]);

                    return fakePromise;
                }
            };
            getJwtTokenStub.and.returnValue(fakePromise);
            jwtToken.withJwtToken(aStub)(...args);
            expect(aStub).toHaveBeenCalledTimes(1);
        });

        it('should call callFunc twice on 401', () => {
            const aStub = createSpy().and.returnValue({
                then: resolve => {
                    resolve({ responseStatus: 401 });
                    expect(dropJwtTokenStub).toHaveBeenCalled();
                }
            });
            const fakePromise = {
                then: resolve => {
                    resolve('token_string');
                    expect(aStub).toHaveBeenCalledWith('token_string', args[0]);

                    return fakePromise;
                }
            };
            getJwtTokenStub.and.returnValue(fakePromise);
            jwtToken.withJwtToken(aStub)(...args);
            expect(aStub).toHaveBeenCalledTimes(2);
        });
    });
});
