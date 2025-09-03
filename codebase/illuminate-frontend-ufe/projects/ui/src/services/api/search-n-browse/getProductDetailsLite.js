import ufeApi from 'services/api/ufeApi';
import localeUtils from 'utils/LanguageLocale';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';
import { addCurrentSkuToProductChildSkus, changeCurrentSkuTo } from './getProductDetails';
import { CHANNELS } from 'constants/Channels';

const getProductDetailsLite = (productId = null, skuId = null, options = {}, config = {}) => {
    let url = `/gway/v1/dotcom/productservice/v3/catalog/products/${productId}/lite`;

    const queryOptions = {
        ...options,
        channel: CHANNELS.RWD,
        loc: localeUtils.getCurrentLanguageLocale(),
        countryCode: localeUtils.getCurrentCountry(),
        zipcode: userUtils.getZipCode(),
        storeId: userUtils.getPreferredStoreId(),
        preferredSku: skuId || null,
        biSegment: userUtils.getBiStatusText()?.toUpperCase()
    };

    if (Object.keys(queryOptions).length) {
        url += `?${urlUtils.makeQueryString(queryOptions)}`;
    }

    return ufeApi.makeRequest(url, {}, config).then(data => {
        if (data.errorCode) {
            return Promise.reject(data);
        }

        const product = data;

        if (options.addCurrentSkuToProductChildSkus) {
            addCurrentSkuToProductChildSkus(product);
        }

        changeCurrentSkuTo(product, skuId);

        return product;
    }).catch(error => {
        Sephora.logger.error(error);

        throw error;
    });
};

export default getProductDetailsLite;
