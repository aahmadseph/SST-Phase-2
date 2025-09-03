describe('AutoLogin', () => {
    let autoLoginModule;
    let ufeApi;
    let makeRequestSpy;
    let RCPSCookies;
    const deviceFingerprint = '236782367235467236784';
    const url = '/api/ssi/autoLogin';
    const autoLoginParams = { deviceFingerprint };

    beforeEach(() => {
        autoLoginModule = require('services/api/ssi/autoLogin').default;
        ufeApi = require('services/api/ufeApi').default;
        RCPSCookies = require('utils/RCPSCookies').default;
        spyOn(autoLoginModule, 'autoLogin').and.callThrough();
        makeRequestSpy = spyOn(ufeApi, 'makeRequest').and.callThrough();
    });

    describe('when checkout route is called with Stay signed in turned on', () => {
        it('should call the ufeApi makeRequest method with deviceFingerprint key', () => {
            // Arrange
            const expectedOptions = {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-type': 'application/json', 'x-requested-source': 'web' },
                body: JSON.stringify({ deviceFingerprint })
            };
            spyOn(RCPSCookies, 'isRCPSAuthEnabled').and.returnValues(false);

            // Act
            autoLoginModule.autoLogin(autoLoginParams);

            // Assert
            expect(makeRequestSpy).toHaveBeenCalledWith(url, expectedOptions);
        });
    });
});
