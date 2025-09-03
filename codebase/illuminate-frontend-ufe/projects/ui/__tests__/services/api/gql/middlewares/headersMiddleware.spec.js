import { GraphQLException } from 'exceptions';
import { server, http, HttpResponse } from 'test-utils';
import customerLimitQuery from 'services/api/profile/customerLimit/customerLimitQuery';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

describe('GraphQL client HeadersMiddleware', () => {
    const originalToken = Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);

    afterEach(() => {
        Storage.local.setItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN, originalToken);
    });

    test('should throw a GraphQLException', async () => {
        // Arrange
        Storage.local.removeItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);
        const response = { data: { customerLimit: {} } };
        server.use(http.post(Sephora.configurationSettings.gqlAPIEndpoint, () => HttpResponse.json(response)));

        // Act
        try {
            await customerLimitQuery(1, 'USD');
        } catch (exception) {
            // Assert
            expect(exception).toBeInstanceOf(GraphQLException);
            expect(exception.cause).toMatch(/\[GraphQL\] Unable to make GraphQL API call without a valid JWT token$/);
        }
    });

    test('should add Sephora GQL client headers', async () => {
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
        await customerLimitQuery(1, 'USD');

        // Assert
        expect(requestHeaders.get('Apollographql-Client-Name')).toEqual('UFE_CLIENT');
        expect(requestHeaders.get('Apollographql-Client-Version')).toEqual('1');
    });

    test('should add authorization header', async () => {
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
        await customerLimitQuery(1, 'USD');

        // Assert
        expect(requestHeaders.get('Authorization')).toEqual('Bearer JWT');
    });

    test('should set the correct values for required headers', async () => {
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
        await customerLimitQuery(1, 'USD');

        // Assert
        expect(requestHeaders.get('Content-Type')).toEqual('application/json');
        expect(requestHeaders.get('X-Api-Key')).toEqual(Sephora.configurationSettings.sdnUfeAPIUserKey);
    });
});
