import ufeApi from 'services/api/ufeApi';
import Empty from 'constants/empty';

const bannerArray = [];
const dynamicBannerArray = [];

function getVariations({ variationIds, channel, language, country }) {
    const variations = variationIds.join(',');
    const queryParams = `?ch=${channel}&loc=${language}-${country}`;
    const path = `/api/content/bulk/p13nVariation/${variations}`;

    const url = `${path}${queryParams}`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(({ data = Empty.Array, errorCode }) => {
        if (errorCode) {
            return Promise.reject(data);
        }

        const hasDynamicBanners = data.some(variation => variation && variation.type === 'DynamicBanner');

        // skipDynamicProcessing or recursion ends here
        if (!hasDynamicBanners) {
            return [...bannerArray, ...data];
        }

        // Separate banner types and dynamic banner types into 2 arrays
        data.forEach(variation => {
            if (variation && variation.type === 'DynamicBanner') {
                dynamicBannerArray.push(variation);
            } else if (variation && variation.type === 'Banner') {
                bannerArray.push(variation);
            }
        });

        // If we have dynamic banners, find one with promotionBannerMapping that has content
        if (dynamicBannerArray.length > 0) {
            // Choose dynamic banner that has promotionContainer.promotionBannerMapping.length > 0
            const validDynamicBanner = dynamicBannerArray.find(banner => {
                const mappingLength = banner.promotionContainer?.promotionBannerMapping?.length || 0;

                return mappingLength > 0;
            });

            if (validDynamicBanner) {
                const promotionBannerMapping = validDynamicBanner.promotionContainer.promotionBannerMapping;

                // Extract all variation IDs from promotionBannerMapping
                const extractedVariationIds = promotionBannerMapping
                    .filter(mapping => mapping.value) // Only include mappings that have a value
                    .map(mapping => mapping.value);

                // API Call : If we have variation IDs to process, make recursive call
                if (extractedVariationIds.length > 0) {
                    return getVariations({
                        variationIds: extractedVariationIds,
                        channel,
                        language,
                        country
                    })
                        .then(dynamicBannerResults => {
                            // Combine banner array with dynamic banner results
                            return [...bannerArray, ...(dynamicBannerResults || [])];
                        })
                        .catch(_error => {
                            return bannerArray;
                        });
                }
            }
        }

        // Return banner array if no dynamic banners or no variation IDs to process
        return bannerArray;
    });
}

export default getVariations;
