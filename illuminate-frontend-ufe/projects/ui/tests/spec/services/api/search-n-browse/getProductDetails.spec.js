const Empty = require('constants/empty').default;
const ufeApi = require('services/api/ufeApi').default;
const snbApi = require('services/api/search-n-browse').default;

describe('Search and Browse API', () => {
    it('should invoke makeRequest method', async () => {
        // Arrange
        spyOn(ufeApi, 'makeRequest').and.resolveTo(Empty.Object);
        const productId = 'P370205';

        // Act
        await snbApi.getProductDetails(productId);

        // Assert
        expect(ufeApi.makeRequest).toHaveBeenCalledTimes(1);
    });

    it('should invoke makeRequest method with propertiesToSkip if passed as options ', async () => {
        // Arrange
        spyOn(ufeApi, 'makeRequest').and.resolveTo(Empty.Object);

        const productId = 'P370205';
        const preferedSku = '2261576';
        const url =
            '/api/v3/catalog/products/P370205?propertiesToSkip=childSkus&includeRnR=true&loc=en-US&ch=rwd&countryCode=US&sentiments=6&includeConfigurableSku=true';

        // Act
        await snbApi.getProductDetails(productId, preferedSku, { propertiesToSkip: 'childSkus' });

        // Assert
        expect(ufeApi.makeRequest).toHaveBeenCalledWith(
            url,
            {
                headers: {
                    'x-ufe-request': true,
                    'x-requested-source': 'rwd'
                }
            },
            {}
        );
    });

    it('should invoke makeRequest method with x-timestamp header passed when includeTimestamp is within config', async () => {
        // Arrange
        const mockTimestampValue = 1628623306858;
        spyOn(window.Date, 'now').and.returnValue(mockTimestampValue);
        spyOn(ufeApi, 'makeRequest').and.resolveTo(Empty.Object);

        const productId = 'P370205';
        const preferedSku = '2261576';
        const config = { includeTimestamp: true };
        const url = '/api/v3/catalog/products/P370205?includeRnR=true&loc=en-US&ch=rwd&countryCode=US&sentiments=6&includeConfigurableSku=true';

        // Act
        await snbApi.getProductDetails(productId, preferedSku, {}, config);

        // Assert
        expect(ufeApi.makeRequest).toHaveBeenCalledWith(
            url,
            {
                headers: {
                    'x-ufe-request': true,
                    'x-timestamp': mockTimestampValue,
                    'x-requested-source': 'rwd'
                }
            },
            {}
        );
    });
});
