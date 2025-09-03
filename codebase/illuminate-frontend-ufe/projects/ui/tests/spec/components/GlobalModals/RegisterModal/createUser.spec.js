describe('Create user', () => {
    let createUserModule;
    let ufeApi;
    let makeRequest;
    let RCPSCookies;
    const login = 'login';
    const email = 'user@sephora.com';
    const password = 'password';
    const isKeepSignedIn = true;
    const url = '/api/users/profile';
    const deviceFingerprint = '236782367235467236784';
    const createUserParams = {
        userDetails: {
            login,
            email,
            password
        },
        isKeepSignedIn
    };

    beforeEach(() => {
        createUserModule = require('services/api/profile/createUser').default;
        ufeApi = require('services/api/ufeApi').default;
        RCPSCookies = require('utils/RCPSCookies').default;
        spyOn(Date, 'now').and.returnValue('1626374175919');
        makeRequest = spyOn(ufeApi, 'makeRequest').and.returnValues(Promise.resolve({ data: {} }));
    });

    describe('when create a new user with Stay signed turned on', () => {
        it('should call the ufeApi makeRequest method with deviceFingerprint key', () => {
            // Arrange
            const createUserParamsWithDeviceFingerprint = {
                ...createUserParams,
                deviceFingerprint
            };
            spyOn(RCPSCookies, 'isRCPSAuthEnabled').and.returnValues(false);

            const expectedOptions = {
                method: 'POST',
                headers: { 'x-timestamp': '1626374175919', 'x-requested-source': 'web' },
                body: JSON.stringify({
                    userDetails: {
                        login,
                        email,
                        password
                    },
                    isKeepSignedIn,
                    deviceFingerprint
                })
            };

            // Act
            createUserModule.createUser(createUserParamsWithDeviceFingerprint);

            // Assert
            expect(makeRequest).toHaveBeenCalledWith(url, expectedOptions);
        });

        describe('when create a new user with Stay signed turned off', () => {
            it('should call the ufeApi makeRequest method without the deviceFingerprint key', () => {
                // Arrange
                const expectedOptions = {
                    method: 'POST',
                    headers: { 'x-timestamp': '1626374175919', 'x-requested-source': 'web' },
                    body: JSON.stringify({
                        userDetails: {
                            login,
                            email,
                            password
                        },
                        isKeepSignedIn
                    })
                };
                spyOn(RCPSCookies, 'isRCPSAuthEnabled').and.returnValues(false);

                // Act
                createUserModule.createUser(createUserParams);

                // Assert
                expect(makeRequest).toHaveBeenCalledWith(url, expectedOptions);
            });
        });
    });
});
