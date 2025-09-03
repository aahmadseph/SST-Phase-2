/* eslint-disable no-console */
import { server, http, HttpResponse } from 'test-utils';
import customerLimitQuery from 'services/api/profile/customerLimit/customerLimitQuery';

describe('customerLimitQuery API', () => {
    test('should return data', async () => {
        // Arrange
        const response = {
            data: {
                customerLimit: {
                    currency: 'USD',
                    balance: {
                        initial: 1500.0,
                        initialExpiryDate: '2025-03-31T00:00:00.000-07:00',
                        totalSpend: 0.0,
                        available: 1500.0,
                        __typename: 'Balance'
                    },
                    __typename: 'CustomerLimitResponse'
                }
            }
        };
        server.use(http.post(Sephora.configurationSettings.gqlAPIEndpoint, () => HttpResponse.json(response)));

        // Act
        const result = await customerLimitQuery(1, 'USD');

        // Assert
        expect(result).toEqual(response.data.customerLimit);
    });

    test('should send custom header "x-source"', async () => {
        // Arrange
        const response = { data: { customerLimit: {} } };
        let requestHeaders;
        server.use(
            http.post(Sephora.configurationSettings.gqlAPIEndpoint, ({ request }) => {
                requestHeaders = request.headers;

                return HttpResponse.json(response);
            })
        );

        // Act
        const result = await customerLimitQuery(1, 'USD');

        // Assert
        expect(requestHeaders.get('x-source')).toEqual('ufe');
        expect(result).toEqual(response.data.customerLimit);
    });
});
