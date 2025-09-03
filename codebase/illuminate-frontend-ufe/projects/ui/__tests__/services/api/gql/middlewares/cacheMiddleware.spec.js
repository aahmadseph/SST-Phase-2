import { gqlClient } from 'services/api/gql/gqlClient';
import { server, http, HttpResponse } from 'test-utils';
import CacheMiddleware from 'services/api/gql/middlewares/CacheMiddleware';
import customerLimitQuery from 'services/api/profile/customerLimit/customerLimitQuery';
import Storage from 'utils/localStorage/Storage';

describe('GraphQL client CacheMiddleware', () => {
    let originalTtl;
    let cacheMiddleware;

    beforeEach(() => {
        cacheMiddleware = gqlClient.middlewares.find(middleware => middleware instanceof CacheMiddleware);
        originalTtl = { ...cacheMiddleware.ttl };
    });

    afterEach(() => {
        cacheMiddleware.ttl = originalTtl;
    });

    test('should cache repeated API calls using IndexedDB', async () => {
        // Arrange
        const response = { data: { customerLimit: {} } };
        let apiCallCount = 0;
        server.use(
            http.post(Sephora.configurationSettings.gqlAPIEndpoint, () => {
                apiCallCount++;

                return HttpResponse.json(response);
            })
        );
        cacheMiddleware.ttl.customerlimitquery = 12345;
        let cacheHit = false;
        jest.spyOn(Storage.db, 'getItem').mockImplementation(async _key => {
            if (!cacheHit) {
                cacheHit = true;

                return null;
            }

            return response;
        });
        jest.spyOn(Storage.db, 'setItem').mockImplementation(async () => Promise.resolve());

        // Act
        await customerLimitQuery(1, 'USD');
        await customerLimitQuery(1, 'USD');
        await customerLimitQuery(1, 'USD');

        // Assert
        expect(apiCallCount).toBe(1);
    });

    test('should not cache API call when TTL is not specified in the configuration', async () => {
        // Arrange
        const response = { data: { customerLimit: {} } };
        let apiCallCount = 0;
        server.use(
            http.post(Sephora.configurationSettings.gqlAPIEndpoint, () => {
                apiCallCount++;

                return HttpResponse.json(response);
            })
        );
        let cacheHit = false;
        jest.spyOn(Storage.db, 'getItem').mockImplementation(async _key => {
            if (!cacheHit) {
                cacheHit = true;

                return null;
            }

            return response;
        });
        jest.spyOn(Storage.db, 'setItem').mockImplementation(async () => Promise.resolve());

        // Act
        await customerLimitQuery(1, 'USD');
        await customerLimitQuery(1, 'USD');
        await customerLimitQuery(1, 'USD');

        // Assert
        expect(apiCallCount).toBe(3);
    });

    test('should set TTL field to an empty object when configuration has no values', async () => {
        // Arrange
        Sephora.configurationSettings.gqlTTLs = null;

        // Act
        const middleware = new CacheMiddleware();

        // Assert
        expect(Object.keys(middleware.ttl).length).toBe(0);
    });

    test('should generate a default cache key when variables are empty', async () => {
        // Arrange
        const operationName = 'testQuery';
        const variables = null;
        const expectedCacheKey = `GQL_API_${operationName}_0`;

        // Act
        const cacheKey = await cacheMiddleware._getCacheKey({ operationName, variables });

        // Assert
        expect(cacheKey).toBe(expectedCacheKey);
    });
});
