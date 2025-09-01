/* eslint-disable camelcase */
/* eslint-disable no-console */
import localeUtils from 'utils/LanguageLocale';
import urlUtils from 'utils/Url';
import { CONSTRUCTOR_PODS } from 'constants/constructorConstants';

const useConstructorFeedUpdates = Boolean(Sephora.configurationSettings?.useConstructorFeedUpdates);
const { addParam } = urlUtils;
const { AUTO_REPLENISH_CHOSEN_FOR_YOU, AUTO_REPLENISH_SEPHORA_COLLECTION } = CONSTRUCTOR_PODS;
const AR_PARAM_NAME = 'source';
const AR_PARAM_VALUE = 'auto-replenish';

const STATIC_PARAMS = {
    variationsMap: {
        values: {
            network_status: { aggregation: 'max', field: 'data.sku_availability.network_SEPHORAUS' },
            store_status: { aggregation: 'max', field: 'data.sku_availability.store_123' },
            sku_count: { aggregation: 'count' },
            sale_count: { aggregation: 'value_count', field: 'data.facets.on_sale', value: true },
            min_list_price: { aggregation: 'min', field: 'data.currentSku.listPriceFloat' },
            max_list_price: { aggregation: 'max', field: 'data.currentSku.listPriceFloat' },
            min_sale_price: { aggregation: 'min', field: 'data.currentSku.salePriceFloat' },
            max_sale_price: { aggregation: 'max', field: 'data.currentSku.salePriceFloat' },
            min_price: { aggregation: 'min', field: 'data.currentSku.finalPriceFloat' },
            max_price: { aggregation: 'max', field: 'data.facets.finalPriceFloat' },
            moreColors: { aggregation: 'all', field: 'data.currentSku.colorName' }
        },
        dtype: 'object'
    }
};

const transformConstructorResponseForCarousel = (recommendations, sourceType = {}) => {
    var results = [];
    recommendations.forEach(recommendation => {
        const recommendationData = recommendation.data;

        if (recommendation.variations_map && useConstructorFeedUpdates) {
            const { max_list_price = null, min_list_price = null, max_sale_price = null, min_sale_price = null } = recommendation.variations_map;

            const listPrice = formatPriceRangeToString(min_list_price, max_list_price);

            if (listPrice) {
                recommendationData.listPrice = listPrice;
            }

            const salePrice = formatPriceRangeToString(min_sale_price, max_sale_price);

            if (salePrice) {
                recommendationData.salePrice = salePrice;
            }
        }

        const transformedRecommendation = {
            badgeAltText: recommendationData.currentSku?.imageAltText,
            biExclusiveLevel: recommendationData.currentSku?.biExclusivityLevel,
            brandName: recommendationData.brandName,
            starRatings: recommendationData.rating,
            size: recommendationData.size,
            productReviewCount: recommendationData.totalReviews,
            image: recommendationData.image_url,
            isAppExclusive: convertToBoolean(recommendationData.isAppExclusive),
            isBiOnly: convertToBoolean(recommendationData.currentSku?.isBI),
            isFirstAccess: convertToBoolean(recommendationData.currentSku?.isFirstAccess),
            isFree: convertToBoolean(recommendationData.currentSku?.isFree),
            isLimitedEdition: convertToBoolean(recommendationData.currentSku?.isLimitedEdition),
            isLimitedQuantity: convertToBoolean(recommendationData.currentSku?.isLimitedQuantity),
            isLimitedTimeOffer: convertToBoolean(recommendationData.currentSku?.isLimitedTimeOffer),
            isNew: convertToBoolean(recommendationData.currentSku?.isNew),
            isOnlineOnly: convertToBoolean(recommendationData.currentSku?.isOnlineOnly),
            isOutOfStock: convertToBoolean(recommendationData.currentSku?.isOutOfStock),
            isSephoraExclusive: convertToBoolean(recommendationData.currentSku?.isSephoraExclusive),
            listPrice: convertPrice(recommendationData.listPrice),
            salePrice: convertPrice(recommendationData.salePrice),
            valuePrice: convertPrice(recommendationData.valuePrice),
            wholeSalePrice: convertPrice(recommendationData.wholesalePrice),
            productId: recommendationData.id,
            productName: recommendation.value,
            skuId: recommendationData.currentSku?.skuId,
            skuImages: {
                imageUrl: recommendationData.image_url
            },
            smallImage: recommendationData.currentSku?.skuImages?.image50,
            targetUrl: recommendationData.url,
            variationId: recommendationData.variation_id,
            variationType: recommendationData.currentSku?.variationValue,
            variationTypeDisplayName: recommendationData.currentSku?.variationValue,
            variationValue: recommendationData.currentSku?.variationValue,
            highlights: recommendationData.facets?.filter(facet => facet.name === 'Ingredient Preferences')[0]?.values || [],
            strategyId: recommendation.strategy?.id
        };

        if (sourceType.id === AUTO_REPLENISH_CHOSEN_FOR_YOU || sourceType.id === AUTO_REPLENISH_SEPHORA_COLLECTION) {
            transformedRecommendation.targetUrl = addParam(recommendationData.url, AR_PARAM_NAME, AR_PARAM_VALUE);
        }

        results.push(transformedRecommendation);
    });

    return results;
};

const convertPrice = price => {
    if (price) {
        const convertedPrice = `${price.replaceAll('.', ',').replaceAll('$', '').replaceAll('-', '$ -')} $`;

        return localeUtils.isFrench() ? convertedPrice : price;
    }

    return null;
};

const getConstructorRecommendations = (podId, params) => {
    if (global.constructorio) {
        return global.constructorio.recommendations.getRecommendations(podId, { ...params, ...STATIC_PARAMS });
    } else {
        return Promise.reject(new Error('Constructor io not initialized'));
    }
};

const getConstructorCollections = (collectionId, params) => {
    if (global.constructorio) {
        return global.constructorio.browse.getBrowseResults('collection_id', collectionId, { ...params, ...STATIC_PARAMS });
    } else {
        return Promise.reject(new Error('Constructor io not initialized'));
    }
};

const convertToBoolean = stringValue => {
    if (typeof stringValue === 'boolean') {
        return stringValue;
    }

    const booleanValue = typeof stringValue === 'string' && stringValue?.toLowerCase() === 'true';

    return booleanValue;
};

const formatPriceRangeToString = (minPrice, maxPrice) => {
    if (!minPrice || !maxPrice) {
        return null;
    }

    const formattedMin = minPrice.toFixed(2);
    const formattedMax = maxPrice.toFixed(2);

    return formattedMin === formattedMax ? `$${formattedMax}` : `$${formattedMin} - $${formattedMax}`;
};

export default {
    transformConstructorResponseForCarousel,
    getConstructorRecommendations,
    convertToBoolean,
    getConstructorCollections
};
