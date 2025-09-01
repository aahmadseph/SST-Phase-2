import getBiRewardsGroup from 'services/api/beautyInsider/getBiRewardsGroup';
import { server, http, HttpResponse } from 'test-utils';
import store from 'Store';

const { getBiRewardsGroupForSnapshot, getBiRewardsGroupForCheckout, getBiRewardsGroupForProfile } = getBiRewardsGroup;
const defaultSAZipCode = '10001';
const defaultSACountryCode = 'US';

describe('_getBiRewardsGroup', () => {
    const LXS_REWARDS_URL = '/gway/v1/lxs/rewards';
    const responseStatus = 200;
    const biRewardGroups = 'success';

    const apiResponse = {
        biRewardGroups,
        responseStatus
    };

    test('use default rewards api when KS useLXSBiRewards is disabled', async () => {
        Sephora.configurationSettings.useLXSBiRewards = false;
        const REWARDS_URL = '/api/bi/rewards';
        let requestHeaders = {};
        let requestUrl = '';
        let sourceParam = '';

        server.use(
            http.get(REWARDS_URL, ({ request }) => {
                const url = new URL(request.url);

                requestHeaders = request.headers;
                sourceParam = url.searchParams.get('source');
                requestUrl = url.pathname;

                return HttpResponse.json({ biRewardGroups });
            })
        );

        const result = await getBiRewardsGroupForSnapshot();

        expect(result).toStrictEqual(apiResponse);
        expect(requestUrl).toBe('/api/bi/rewards');
        expect(sourceParam).toBe('snapshot');
        expect(requestHeaders.get('defaultSACountryCode')).toBe(null);
        expect(requestHeaders.get('defaultSAZipCode')).toBe(null);
    });

    test('use LXS rewards endpoint when KS useLXSBiRewards is enabled and user is not anonymous', async () => {
        Sephora.configurationSettings.useLXSBiRewards = true;
        let requestHeaders = {};
        let requestUrl = '';
        let sourceParam = '';
        let loyaltyIdParam = '';

        const reduxState = {
            auth: { profileStatus: 4 },
            user: {
                defaultSAZipCode,
                defaultSACountryCode,
                beautyInsiderAccount: { biAccountId: '123456789' }
            }
        };

        jest.spyOn(store, 'getState').mockReturnValue(reduxState);

        server.use(
            http.get(LXS_REWARDS_URL, ({ request }) => {
                const url = new URL(request.url);

                requestHeaders = request.headers;
                sourceParam = url.searchParams.get('source');
                loyaltyIdParam = url.searchParams.get('loyaltyId');
                requestUrl = url.pathname;

                return HttpResponse.json({ biRewardGroups });
            })
        );

        const result = await getBiRewardsGroupForProfile();

        expect(result).toStrictEqual(apiResponse);
        expect(requestUrl).toBe('/gway/v1/lxs/rewards');
        expect(sourceParam).toBe('profile');
        expect(loyaltyIdParam).toBe('123456789');
        expect(requestHeaders.get('defaultSACountryCode')).toBe('US');
        expect(requestHeaders.get('defaultSAZipCode')).toBe('10001');
    });

    test('handles missing biAccountId when useLXSBiRewards is enabled', async () => {
        Sephora.configurationSettings.useLXSBiRewards = true;
        let requestHeaders = {};
        let requestUrl = '';
        let sourceParam = '';
        let loyaltyIdParam = null;

        const reduxState = {
            auth: { profileStatus: 4 },
            user: {
                defaultSAZipCode,
                defaultSACountryCode,
                beautyInsiderAccount: { biAccountId: null }
            }
        };

        jest.spyOn(store, 'getState').mockReturnValue(reduxState);

        server.use(
            http.get(LXS_REWARDS_URL, ({ request }) => {
                const url = new URL(request.url);

                requestHeaders = request.headers;
                sourceParam = url.searchParams.get('source');
                loyaltyIdParam = url.searchParams.get('loyaltyId');
                requestUrl = url.pathname;

                return HttpResponse.json({ biRewardGroups });
            })
        );

        const result = await getBiRewardsGroupForProfile();

        expect(result).toStrictEqual(apiResponse);
        expect(requestUrl).toBe('/gway/v1/lxs/rewards');
        expect(sourceParam).toBe('profile');
        expect(loyaltyIdParam).toBe(null);
        expect(requestHeaders.get('defaultSACountryCode')).toBe('US');
        expect(requestHeaders.get('defaultSAZipCode')).toBe('10001');
    });

    test('use LXS rewards endpoint when useLXSBiRewards is enabled but do not send defaultSA headers when they are not available', async () => {
        Sephora.configurationSettings.useLXSBiRewards = true;
        let requestHeaders = {};
        let requestUrl = '';
        let sourceParam = '';
        let loyaltyIdParam = null;

        const reduxState = {
            auth: { profileStatus: 4 },
            user: {
                defaultSAZipCode: '',
                defaultSACountryCode: '',
                beautyInsiderAccount: { biAccountId: '123456789' }
            }
        };

        jest.spyOn(store, 'getState').mockReturnValue(reduxState);

        server.use(
            http.get(LXS_REWARDS_URL, ({ request }) => {
                const url = new URL(request.url);

                requestHeaders = request.headers;
                sourceParam = url.searchParams.get('source');
                loyaltyIdParam = url.searchParams.get('loyaltyId');
                requestUrl = url.pathname;

                return HttpResponse.json({ biRewardGroups });
            })
        );

        const result = await getBiRewardsGroupForCheckout();

        expect(result).toStrictEqual(apiResponse);
        expect(requestUrl).toBe('/gway/v1/lxs/rewards');
        expect(sourceParam).toBe('checkout');
        expect(loyaltyIdParam).toBe('123456789');
        expect(requestHeaders.get('defaultSACountryCode')).toBe(null);
        expect(requestHeaders.get('defaultSAZipCode')).toBe(null);
    });

    test('rejects with an error when ufeApi.makeRequest returns an errorCode', async () => {
        Sephora.configurationSettings.useLXSBiRewards = true;
        const statusCode = 500;
        const message = 'Internal server error';

        server.use(
            http.get(LXS_REWARDS_URL, () => {
                return new HttpResponse(JSON.stringify({ message }), {
                    status: statusCode,
                    headers: { 'Content-Type': 'application/json' }
                });
            })
        );

        const result = await getBiRewardsGroupForProfile();

        expect(result.message).toBe(message);
        expect(result.responseStatus).toBe(statusCode);
    });
});
