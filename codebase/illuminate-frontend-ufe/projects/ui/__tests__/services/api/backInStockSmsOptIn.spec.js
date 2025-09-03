import { server, http, HttpResponse } from 'test-utils';
import accountActions from 'services/api/backInStockSmsOptIn';

describe('backInStockSmsOptIn API', () => {
    const apiURL = '/api/util/skus/notify';

    test('should return data', async () => {
        // Arrange
        const response = {
            dataFieldOne: 1,
            dataFieldTwo: 'dataFieldTwo',
            responseStatus: 200
        };

        // Act
        const result = await accountActions.backInStockSMSOptInForm({});

        // Assert
        expect(result).toStrictEqual(response);
    });

    test('throws an exception when response has errorCode field but HTTP code is 200', async () => {
        // Arrange
        const errorCode = 123;
        server.use(
            http.post(apiURL, () => {
                return HttpResponse.json({ errorCode });
            })
        );

        // Act
        try {
            await accountActions.backInStockSMSOptInForm({});
        } catch (error) {
            // Assert
            expect(error.errorCode).toBe(errorCode);
        }
    });

    test('returns error code 500 and error message at the same time', async () => {
        // Arrange
        const responseStatus = 500;
        const message = 'Internal server error';
        server.use(
            http.post(apiURL, () => {
                return new HttpResponse(JSON.stringify({ message }), {
                    status: responseStatus,
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );

        // Act
        const result = await accountActions.backInStockSMSOptInForm({});

        // Assert
        expect(result.message).toBe(message);
    });
});
