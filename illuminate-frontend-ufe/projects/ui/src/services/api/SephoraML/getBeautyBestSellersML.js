import ufeApi from 'services/api/ufeApi';
import localeUtils from 'utils/LanguageLocale';
import imageUtils from 'utils/Image';

function transformProduct(product) {
    const candidate = product.skus[0];

    candidate.skuImages = { image: candidate.grid_images };
    candidate.badge = imageUtils.getImageBadgeFromUrl(candidate.grid_images);
    candidate.brandName = product.brand_name;
    candidate.productName = product.display_name;
    candidate.primaryProduct = product;
    candidate.productId = candidate.primary_product_id;
    candidate.skuId = candidate.sku_number;
    candidate.targetUrl = product.product_url;
    candidate.starRatings = product.rating;
    candidate.productReviewCount = product.reviews;
    candidate.isLimitedEdition = candidate.is_limited_edition || false;
    candidate.isNew = candidate.is_new || false;
    candidate.isSephoraExclusive = candidate.is_sephora_exclusive || false;
    candidate.isOnlineOnly = candidate.is_online_only || false;
    candidate.isAppExclusive = candidate.is_app_exclusive || false;
    candidate.isFirstAccess = candidate.is_first_access || false;
    candidate.isLimitedTimeOffer = candidate.is_limited_time_offer || false;
    candidate.listPrice = localeUtils.getFormattedPrice(candidate.list_price);
    candidate.salePrice = localeUtils.getFormattedPrice(candidate.sale_price);
    candidate.valuePrice = localeUtils.getFormattedPrice(candidate.value_price, true);
    candidate.wholeSalePrice = localeUtils.getFormattedPrice(candidate.wholesale_price, false, true, true);
    candidate.heroImageAltText = product.heroImageAltText || '';
    candidate.variationValue = candidate.variation_value || false;

    return candidate;
}

function getBeautyBestSellersML({ userId, catId }) {
    const { sdnUfeAPIUserKey, sdnDomainBaseUrl } = Sephora.configurationSettings;
    const apiEndpoint = new URL(`${sdnDomainBaseUrl}/v1/orchestration-service/us_web_bestseller`);

    // Calling /us_web_bestseller with no categoryId returns /beauty-best-sellers results
    if (catId != null) {
        apiEndpoint.searchParams.append('categoryId', catId);
    }

    // Calling /us_web_bestseller with no clientId still returns results
    if (userId != null) {
        apiEndpoint.searchParams.append('clientId', userId);
    }

    return ufeApi
        .makeRequest(apiEndpoint.href, {
            method: 'GET',
            headers: {
                'X-Api-Key': sdnUfeAPIUserKey
            }
        })
        .then(res => {
            if (!(res.responseStatus === 200)) {
                return Promise.reject(res.fault);
            }

            const { data } = res;

            if (data.error != null) {
                return Promise.reject(data);
            }

            return {
                ...data,
                items: data.items.map(item => transformProduct(item))
            };
        });
}

export default getBeautyBestSellersML;
