import getProductSamples from 'services/api/samples/getProductSamples';
import { server, http, HttpResponse } from 'test-utils';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import store from 'Store';

const responseStatus = 200;
const mockResponse = { productSampleSku: [] };
const apiResponse = {
    data: mockResponse,
    responseStatus
};

const productId = 'P393401';
const defaultSAZipCode = '94546';
const defaultSACountryCode = 'US';

describe('getProductSamples', () => {
    const originalToken = Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);

    afterEach(() => {
        Storage.local.setItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN, originalToken);
    });

    test('should make a call to the default URL without profileId param or headers when isSampleSellThroughPdpSamplesEnabled KS is disabled', async () => {
        Sephora.configurationSettings.isSampleSellThroughPdpSamplesEnabled = false;
        Storage.local.setItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN, '');

        let requestUrl = '';
        let requestHeaders = {};

        server.use(
            http.get(`/api/v3/catalog/products/${productId}`, ({ request }) => {
                const url = new URL(request.url);
                requestUrl = request.url;
                requestHeaders = request.headers;

                if (url.searchParams.get('productSamples') === 'true' && !url.searchParams.get('profileId')) {
                    return HttpResponse.json({ data: mockResponse });
                }

                return HttpResponse.json({}, { status: 404 });
            })
        );

        const result = await getProductSamples(productId);

        expect(result).toEqual(apiResponse);
        expect(requestUrl).toContain(`/api/v3/catalog/products/${productId}?productSamples=true`);
        expect(requestHeaders.get('defaultSACountryCode')).toBe(null);
        expect(requestHeaders.get('defaultSAZipCode')).toBe(null);
    });

    test('should include profileId in the URL when authId is present', async () => {
        Sephora.configurationSettings.isSampleSellThroughPdpSamplesEnabled = false;
        // JWT with AuthData.uuid key
        Storage.local.setItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN, 'eyJhbGciOiJub25lIn0.eyJBdXRoRGF0YSI6eyJ1dWlkIjoidXVpZDEyMyJ9fQ.');

        let requestUrl = '';
        let requestHeaders = {};

        server.use(
            http.get(`/api/v3/catalog/products/${productId}`, ({ request }) => {
                const url = new URL(request.url);
                requestUrl = request.url;
                requestHeaders = request.headers;

                if (url.searchParams.get('productSamples') === 'true' && url.searchParams.get('profileId') === 'uuid123') {
                    return HttpResponse.json({ data: mockResponse });
                }

                return HttpResponse.json({}, { status: 404 });
            })
        );

        const result = await getProductSamples(productId);

        expect(result).toEqual(apiResponse);
        expect(requestUrl).toContain(`/api/v3/catalog/products/${productId}?productSamples=true&profileId=uuid123`);
        expect(requestHeaders.get('defaultSACountryCode')).toBe(null);
        expect(requestHeaders.get('defaultSAZipCode')).toBe(null);
    });

    test('should call product aggregation service and include defaultSA headers when isSampleSellThroughPdpSamplesEnabled is enabled', async () => {
        Sephora.configurationSettings.isSampleSellThroughPdpSamplesEnabled = true;
        // JWT with AuthData.biId key
        Storage.local.setItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN, 'eyJhbGciOiJub25lIn0.eyJBdXRoRGF0YSI6eyJiaUlkIjoiMTIzNDU2Nzg5In19.');

        let requestUrl = '';
        let requestHeaders = {};

        const reduxState = {
            user: {
                defaultSAZipCode,
                defaultSACountryCode
            }
        };

        jest.spyOn(store, 'getState').mockReturnValue(reduxState);

        server.use(
            http.get('/gway/productaggregation/v3/catalog/products/aggregate', ({ request }) => {
                const url = new URL(request.url);
                requestUrl = request.url;
                requestHeaders = request.headers;

                if (
                    url.searchParams.get('ids') === productId &&
                    url.searchParams.get('productSamples') === 'true' &&
                    url.searchParams.get('profileId') === '123456789'
                ) {
                    return HttpResponse.json({ data: mockResponse });
                }

                return HttpResponse.json({}, { status: 404 });
            })
        );

        const result = await getProductSamples(productId);

        expect(result).toEqual(apiResponse);
        expect(requestUrl).toContain(
            `/gway/productaggregation/v3/catalog/products/aggregate?ids=${productId}&productSamples=true&profileId=123456789`
        );
        expect(requestHeaders.get('defaultSACountryCode')).toBe('US');
        expect(requestHeaders.get('defaultSAZipCode')).toBe('94546');
    });

    test('should reject with error response on API error', async () => {
        Sephora.configurationSettings.isSampleSellThroughPdpSamplesEnabled = false;
        Storage.local.removeItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);

        const mockError = {
            errorCode: '403',
            message: 'Forbidden'
        };

        server.use(
            http.get(`/api/v3/catalog/products/${productId}`, () => {
                return new HttpResponse(JSON.stringify(mockError), {
                    status: 403,
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );

        await expect(getProductSamples(productId)).rejects.toEqual({ responseStatus: 403, ...mockError });
    });
});
