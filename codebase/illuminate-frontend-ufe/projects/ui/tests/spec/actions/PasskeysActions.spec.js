describe('Passkeys Actions', () => {
    let actions;
    let dispatchSpy;
    let PasskeysActions;
    let passkeysService;
    let showIntersticeSpy;
    let store;

    beforeEach(() => {
        actions = require('Actions').default;
        store = require('Store').default;
        dispatchSpy = spyOn(store, 'dispatch').and.returnValue(true);
        showIntersticeSpy = spyOn(actions, 'showInterstice').and.callFake(arg => arg);

        PasskeysActions = require('actions/PasskeysActions').default;

        passkeysService = require('services/api/authentication/passkeys').default;
    });

    describe('updatePasskeys function', () => {
        it('should return action with type UPDATE_PASSKEYS', () => {
            const { UPDATE_PASSKEYS } = require('constants/actionTypes/user');
            const actionResponse = PasskeysActions.updatePasskeys([]);
            expect(actionResponse.type).toEqual(UPDATE_PASSKEYS);
        });
    });

    describe('removePasskey', () => {
        const passkeys = [
            {
                passkeyId: 'ce0d757262028d9a',
                created: '6/22/24',
                identityId: '740555553fd3eed0',
                state: 'ACTIVE',
                metaInfo: {
                    deviceName: 'iPhone 15 Pro (Sephora App)',
                    os: 'Other null.null',
                    browser: 'Other null.null'
                }
            },
            {
                passkeyId: 'fcd7724c191093af',
                created: '8/8/24',
                identityId: '740555553fd3eed0',
                state: 'ACTIVE',
                metaInfo: {
                    deviceName: 'iPhone 15 Pro Max (Sephora App)',
                    os: 'Other null.null',
                    browser: 'Other null.null'
                }
            }
        ];
        const passkeyToRemove = {
            passkeyId: 'ce0d757262028d9a',
            identityId: '740555553fd3eed0',
            state: 'ACTIVE',
            metaInfo: {
                deviceName: 'iPhone 15 Pro (Sephora App)',
                os: 'Other null.null',
                browser: 'Other null.null'
            }
        };
        const userData = { firstName: 'userName', lastName: 'userLastName' };

        it('should call removePasskeyApi', () => {
            const removePasskeyApi = spyOn(passkeysService, 'removePasskey').and.resolveTo({ responseStatus: 200 });
            PasskeysActions.removePasskey(passkeys, passkeyToRemove, userData);
            expect(removePasskeyApi).toHaveBeenCalledWith(passkeyToRemove.passkeyId, { firstName: userData.firstName, lastName: userData.lastName });
        });

        it('should dispatch showInterstice', () => {
            spyOn(passkeysService, 'removePasskey').and.resolveTo({ responseStatus: 200 });
            PasskeysActions.removePasskey(passkeys, passkeyToRemove);
            expect(dispatchSpy).toHaveBeenCalledWith(true);
            expect(showIntersticeSpy).toHaveBeenCalledWith(true);
        });

        it('should display an error if removePasskeyApi fails and not get any passkey', () => {
            spyOn(passkeysService, 'removePasskey').and.resolveTo({
                errors: [
                    {
                        errorCode: 'ERR_I_00000',
                        errorMessage: 'Token expired or invalid'
                    }
                ],
                responseStatus: 400
            });

            const getPasskeysApi = spyOn(passkeysService, 'getPasskeys');

            PasskeysActions.removePasskey(passkeys, passkeyToRemove);
            expect(getPasskeysApi).not.toHaveBeenCalled();
        });
    });
});
