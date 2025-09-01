import getRougeRewards from 'services/api/beautyInsider/getRougeRewards';
import { server, http, HttpResponse } from 'test-utils';
import store from 'Store';

describe('getRougeRewards', () => {
    const responseStatus = 200;
    const biRewardGroups = 'success';
    const defaultSAZipCode = '94546';
    const defaultSACountryCode = 'US';

    const apiResponse = {
        biRewardGroups,
        responseStatus
    };

    test('use the default productgraph path when isSampleSellThroughBiRewardsEnabled is false', async () => {
        Sephora.configurationSettings.isSampleSellThroughBiRewardsEnabled = false;
        Sephora.renderQueryParams.language = 'fr';
        Sephora.renderQueryParams.country = 'CA';
        const PRODUCT_GRAPH_URL = '/gway/productgraph/v5/bi/rewards';
        let requestHeaders = {};
        let requestUrl = '';
        let locParam = '';

        server.use(
            http.get(PRODUCT_GRAPH_URL, ({ request }) => {
                requestHeaders = request.headers;

                const url = new URL(request.url);
                locParam = url.searchParams.get('loc');
                requestUrl = url.pathname;

                return HttpResponse.json({ biRewardGroups });
            })
        );

        const result = await getRougeRewards(null);

        expect(result).toStrictEqual(apiResponse);
        expect(requestUrl).toBe(PRODUCT_GRAPH_URL);
        expect(locParam).toBe('fr-CA');
        expect(requestHeaders.get('defaultSACountryCode')).toBe(null);
        expect(requestHeaders.get('defaultSAZipCode')).toBe(null);
    });

    test('use the new productaggregation path with defaultSA headers when isSampleSellThroughBiRewardsEnabled is true', async () => {
        Sephora.configurationSettings.isSampleSellThroughBiRewardsEnabled = true;
        Sephora.renderQueryParams.language = 'en';
        Sephora.renderQueryParams.country = 'US';
        const PRODUCT_AGGREGATION_URL = '/gway/productaggregation/v5/bi/rewards';
        let requestHeaders = {};
        let requestUrl = '';
        let locParam = '';

        const reduxState = {
            user: {
                defaultSAZipCode,
                defaultSACountryCode
            }
        };

        jest.spyOn(store, 'getState').mockReturnValue(reduxState);

        server.use(
            http.get(PRODUCT_AGGREGATION_URL, ({ request }) => {
                requestHeaders = request.headers;

                const url = new URL(request.url);
                locParam = url.searchParams.get('loc');
                requestUrl = url.pathname;

                return HttpResponse.json({ biRewardGroups });
            })
        );

        const result = await getRougeRewards();

        expect(result).toStrictEqual(apiResponse);
        expect(requestUrl).toBe(PRODUCT_AGGREGATION_URL);
        expect(locParam).toBe('en-US');
        expect(requestHeaders.get('defaultSACountryCode')).toBe('US');
        expect(requestHeaders.get('defaultSAZipCode')).toBe('94546');
    });
});
