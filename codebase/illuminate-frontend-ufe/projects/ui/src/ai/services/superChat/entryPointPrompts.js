/* eslint-disable camelcase */
import ufeApi from 'services/api/ufeApi';
import languageLocaleUtils from 'utils/LanguageLocale';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { ENTRYPOINTS } from 'ai/constants/superchat';

const CAMPAIGN_NAME = 'product-advisor';
const URL = '/gway/v1/genai-pa/v1/entrypoint-prompts';

const getPayload = ({
    productId, skuId, categoryId, searchTerm, page, clientId, anonymousId
}) => {
    const { getCurrentLanguage, getCurrentCountry } = languageLocaleUtils;

    const basePayload = {
        language: getCurrentLanguage()?.toLowerCase(),
        country: getCurrentCountry(),
        campaign_name: CAMPAIGN_NAME,
        atg_id: Storage.local.getItem(LOCAL_STORAGE.PROFILE_ID) || '',
        anonymous_id: anonymousId || '',
        client_id: clientId || ''
    };

    if (page === ENTRYPOINTS.PDP) {
        return {
            ...basePayload,
            data: {
                products: [
                    {
                        product_id: productId,
                        sku_id: skuId
                    }
                ],
                category_id: categoryId,
                search_term: '',
                entrypoint: page
            }
        };
    }

    // Default to PLP or SRP payload
    return {
        ...basePayload,
        data: {
            entrypoint: page,
            category_id: categoryId,
            search_term: searchTerm
        }
    };
};

const entryPointPrompts = (token, params) => {
    const payload = getPayload(params);
    const headers = {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
    };

    return ufeApi
        .makeRequest(URL, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
};

export default entryPointPrompts;
