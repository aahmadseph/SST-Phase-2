/* eslint-disable no-unused-vars */
const { createSpy } = jasmine;

describe('olrToken', () => {
    let Storage;
    let LOCAL_STORAGE;
    let olrToken;
    let getSdnAuthToken;

    beforeEach(() => {
        olrToken = require('services/api/sdn/sdnToken').default;
        Storage = require('utils/localStorage/Storage').default;
        LOCAL_STORAGE = require('utils/localStorage/Constants').default;
        getSdnAuthToken = require('services/api/authentication/getSdnAuthToken').default;
    });

    describe('getOlrToken', () => {
        let getSdnAuthTokenStub;
        let setItemStub;
        let getItemStub;
        const responseStub = {
            responseStatus: 200,
            sdnAccessToken: 'remote_token',
            expiresIn: 3599
        };

        beforeEach(() => {
            setItemStub = spyOn(Storage.local, 'setItem');
            getItemStub = spyOn(Storage.local, 'getItem');
            getSdnAuthTokenStub = spyOn(getSdnAuthToken, 'getSdnAuthToken');
        });

        it('should return token from storage if present', () => {
            getItemStub.and.returnValue('stored_token');
            olrToken.getSdnToken('OLR_AUTH_TOKEN').then(data => {
                expect(data).toEqual('stored_token');
            });
            expect(getItemStub).toHaveBeenCalledTimes(1);
            expect(getItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.OLR_AUTH_TOKEN);
        });

        it('should not call remote if token is present', () => {
            getItemStub.and.returnValue('stored_token');
            olrToken.getSdnToken();
            expect(getSdnAuthTokenStub).not.toHaveBeenCalled();
        });

        it('should call remote and put token into storage', () => {
            const fakePromise = {
                then: resolve => {
                    expect(resolve(responseStub)).toEqual(responseStub.sdnAccessToken);
                    expect(setItemStub).toHaveBeenCalledWith(
                        LOCAL_STORAGE.OLR_AUTH_TOKEN,
                        responseStub.sdnAccessToken,
                        responseStub.expiresIn * 1000
                    );
                }
            };

            getItemStub.and.returnValue(null);
            getSdnAuthTokenStub.and.returnValue(fakePromise);
            olrToken.getSdnToken('OLR_AUTH_TOKEN');
            expect(getSdnAuthTokenStub).toHaveBeenCalledTimes(1);
            expect(getSdnAuthTokenStub).toHaveBeenCalledWith({ clientName: getSdnAuthToken.SDN_AUTH_CLIENT_NAME_OLR });
        });
    });

    describe('dropOlrToken', () => {
        it('should remove item from the local storage', () => {
            const removeItemStub = spyOn(Storage.local, 'removeItem');
            olrToken.dropSdnToken('OLR_AUTH_TOKEN');
            expect(removeItemStub).toHaveBeenCalledWith(LOCAL_STORAGE.OLR_AUTH_TOKEN);
        });
    });

    describe('callWithOlrToken', () => {
        let deepExtend;
        let dropSdnTokenStab;
        let getSdnTokenStub;
        const args = ['arg1', 'arg2'];

        beforeEach(() => {
            deepExtend = require('utils/deepExtend');
            dropSdnTokenStab = spyOn(olrToken, 'dropSdnToken');
            getSdnTokenStub = spyOn(olrToken, 'getSdnToken');
        });

        it('should callFunc once on 200 and dropOlrToken', () => {
            const aStub = createSpy().and.returnValue({
                then: resolve => {
                    resolve({ responseStatus: 200 });
                    expect(dropSdnTokenStab).not.toHaveBeenCalled();
                }
            });
            const fakePromise = {
                then: resolve => {
                    resolve('token_string');
                    expect(aStub).toHaveBeenCalledWith('token_string', args[0], args[1]);

                    return fakePromise;
                }
            };
            getSdnTokenStub.and.returnValue(fakePromise);
            olrToken.withSdnToken(aStub)(...args);
            expect(aStub).toHaveBeenCalledTimes(1);
        });

        it('should call callFunc twice on 401', () => {
            const aStub = createSpy().and.returnValue({
                then: resolve => {
                    resolve({ responseStatus: 401 });
                    expect(dropSdnTokenStab).toHaveBeenCalled();
                }
            });
            const fakePromise = {
                then: resolve => {
                    resolve('token_string');
                    expect(aStub).toHaveBeenCalledWith('token_string', args[0], args[1]);

                    return fakePromise;
                }
            };
            getSdnTokenStub.and.returnValue(fakePromise);
            olrToken.withSdnToken(aStub)(...args);
            expect(aStub).toHaveBeenCalledTimes(2);
        });
    });
});
