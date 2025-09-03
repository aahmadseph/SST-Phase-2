const ufeApi = require('services/api/ufeApi').default;
const getCreditCardsFromProfile = require('services/api/profile/creditCards/getCreditCardsFromProfile').default;

describe('service getCreditCardsFromProfile', function () {
    let makeRequest;

    beforeEach(() => {
        spyOn(Math, 'round').and.returnValue(1);

        makeRequest = spyOn(ufeApi, 'makeRequest').and.returnValue(
            Promise.resolve({
                creditCards: [
                    {
                        isDefault: false,
                        name: 'cc1'
                    },
                    {
                        isDefault: false,
                        name: 'cc2'
                    },
                    {
                        isDefault: true,
                        name: 'cc3'
                    }
                ]
            })
        );
    });

    it('should call makeRequest with the correct url and options', () => {
        // Arrange
        const userId = 123456789;
        const url = `/api/users/profiles/${userId}/creditCards?cb=1`;

        // Act
        getCreditCardsFromProfile(userId);

        // Assert
        expect(makeRequest.calls.first().args).toEqual([url, { method: 'GET' }]);
    });

    it('should correctly process the API data', done => {
        getCreditCardsFromProfile(123456789).then(data => {
            expect(data.creditCards[0]).toEqual({
                isDefault: true,
                name: 'cc3'
            });

            done();
        });
    });

    it('should reject call with data on errorCode', done => {
        // eslint-disable-next-line prefer-promise-reject-errors
        makeRequest.and.returnValue(Promise.reject({ errorCode: 'test' }));
        getCreditCardsFromProfile(123456789).catch(error => {
            expect(error.errorCode).toEqual('test');

            done();
        });
    });
});
