import applyPromotion from 'services/api/basket/applyPromotion';
import { server, http, HttpResponse } from 'test-utils';
import store from 'Store';

describe('applyPromotion', () => {
    const couponCode = 'testCouponCode123';
    const mockSuccessResponse = { success: true };
    const mockErrorResponse = {
        errorCode: 'PROMO_INVALID',
        errorMessage: 'Invalid promo code'
    };
    const defaultSAZipCode = '20147';
    const defaultSACountryCode = 'US';

    test('should call promotions endpoint with correct parameters and defaultSA headers', async () => {
        let requestHeaders = {};
        let requestBody = {};

        const reduxState = {
            user: {
                defaultSAZipCode,
                defaultSACountryCode
            }
        };

        jest.spyOn(store, 'getState').mockReturnValue(reduxState);

        server.use(
            http.post('/api/shopping-cart/basket/promotions', async ({ request }) => {
                requestHeaders = request.headers;
                requestBody = await request.json();

                return HttpResponse.json(mockSuccessResponse);
            })
        );

        await applyPromotion(couponCode);

        expect(requestHeaders.get('defaultSAZipCode')).toBe(defaultSAZipCode);
        expect(requestHeaders.get('defaultSACountryCode')).toBe(defaultSACountryCode);
        expect(requestBody).toEqual({ couponCode });
    });

    test('should call promotions endpoint but skip adding defaultSA headers when they are undefined', async () => {
        let requestHeaders = {};
        let requestBody = {};

        const reduxState = {
            user: {}
        };

        jest.spyOn(store, 'getState').mockReturnValue(reduxState);

        server.use(
            http.post('/api/shopping-cart/basket/promotions', async ({ request }) => {
                requestHeaders = request.headers;
                requestBody = await request.json();

                return HttpResponse.json(mockSuccessResponse);
            })
        );

        await applyPromotion(couponCode);

        expect(requestHeaders.get('defaultSAZipCode')).toBe(null);
        expect(requestHeaders.get('defaultSACountryCode')).toBe(null);
        expect(requestBody).toEqual({ couponCode });
    });

    test('should resolve with the data when API call is successful', async () => {
        server.use(
            http.post('/api/shopping-cart/basket/promotions', () => {
                return HttpResponse.json(mockSuccessResponse);
            })
        );
        await expect(applyPromotion(couponCode)).resolves.toEqual({ responseStatus: 200, ...mockSuccessResponse });
    });

    test('should reject with the error data when API returns an errorCode', async () => {
        server.use(
            http.post('/api/shopping-cart/basket/promotions', () => {
                return HttpResponse.json(mockErrorResponse, { status: 400 });
            })
        );
        await expect(applyPromotion(couponCode)).rejects.toEqual({ responseStatus: 400, ...mockErrorResponse });
    });

    test('should reject if network error occurs', async () => {
        server.use(
            http.post('/api/shopping-cart/basket/promotions', () => {
                return HttpResponse.error();
            })
        );

        await expect(applyPromotion(couponCode)).rejects.toThrow();
    });
});
