// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Product+Details+API
import skuHelpers from 'utils/skuHelpers';
import ufeApi from 'services/api/ufeApi';
import localeUtils from 'utils/LanguageLocale';
import urlUtils from 'utils/Url';
import headerUtils from 'utils/Headers';
import getAuthDataId from 'services/api/utility/getAuthDataId';
import { CHANNELS } from 'constants/Channels';

const { userXTimestampHeader } = headerUtils;

export const addCurrentSkuToProductChildSkus = productData => {
    const { regularChildSkus = [], onSaleChildSkus = [], currentSku = {} } = productData;
    const skuIdComparer = ({ skuId }) => skuId === currentSku.skuId;

    if (currentSku.salePrice) {
        if (!onSaleChildSkus.some(skuIdComparer)) {
            onSaleChildSkus.unshift(currentSku);
        }
    } else {
        if (!regularChildSkus.some(skuIdComparer)) {
            regularChildSkus.unshift(currentSku);
        }
    }

    productData.regularChildSkus = regularChildSkus;
    productData.onSaleChildSkus = onSaleChildSkus;

    return productData;
};

export const changeCurrentSkuTo = (product, skuId) => {
    if (!skuId) {
        return;
    }

    const sku = skuHelpers.getSkuFromProduct(product, skuId);

    if (sku) {
        product.currentSku = sku;
    }
};

const getProductDetails = (productId, skuId = null, options = {}, config = {}) => {
    let url = '/api/v3/catalog/products/';
    const locale = localeUtils.isCanada() ? (localeUtils.isFrench() ? 'fr-CA' : 'en-CA') : 'en-US';
    options.includeRnR = 'true';
    options.loc = locale;
    options.ch = CHANNELS.RWD;
    options.countryCode = localeUtils.getCurrentCountry();
    const authId = getAuthDataId();

    if (authId) {
        options.profileId = authId;
    }

    options.sentiments = 6;

    url += `${productId}`;

    if (skuId) {
        options.includeConfigurableSku = true;
    }

    if (skuId || Object.keys(options).length) {
        url += `?${urlUtils.makeQueryString(options)}`;
    }

    const requestOptions = options.removePersonalizedData ? { headers: { EXCLUDE_PERSONALIZED_CONTENT: true } } : {};
    requestOptions.headers = {
        ...(requestOptions.headers || {}),
        'x-ufe-request': true,
        'x-requested-source': CHANNELS.RWD
    };

    if (config.includeTimestamp) {
        requestOptions.headers = {
            ...(requestOptions.headers || {}),
            ...userXTimestampHeader()
        };

        delete config.includeTimestamp;
    }

    return ufeApi.makeRequest(url, requestOptions, config).then(data =>
        data.errorCode
            ? Promise.reject(data)
            : (() => {
                let product = data;

                if (options.addCurrentSkuToProductChildSkus) {
                    product = addCurrentSkuToProductChildSkus(product);
                }

                changeCurrentSkuTo(product, skuId);

                return Promise.resolve(product);
            })()
    );
};

export default getProductDetails;
