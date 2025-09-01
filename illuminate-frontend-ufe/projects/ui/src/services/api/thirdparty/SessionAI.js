/* eslint-disable camelcase */
import apiUtil from 'utils/Api';
import locationUtils from 'utils/Location';

const hostsMap = {
    stag: 'https://gc-csb.zineone.com',
    prod: 'https://cloud3.zineone.com'
};

const apiKeysMap = {
    ['us_en_prod']: Sephora.configurationSettings.sessionAIProductCountProductionAPIKey,
    ['us_en_stag']: Sephora.configurationSettings.sessionAIProductConutStagingAPIKey,
    ['ca_en_prod']: Sephora.configurationSettings.sessionAIProductCountProductionAPIKeyCA,
    ['ca_fr_prod']: Sephora.configurationSettings.sessionAIProductCountProductionAPIKeyFR,
    ['ca_en_stag']: Sephora.configurationSettings.sessionAIProductCountStagingAPIKeyCA,
    ['ca_fr_stag']: Sephora.configurationSettings.sessionAIProductCountStagingAPIKeyFR
};

const getProductsCount = productId => {
    const cookies = Sephora.Util.cookieStore() || {};
    const { site_locale = '', site_language = '' } = cookies;
    const environment = locationUtils.isProd() ? 'prod' : 'stag';
    const apiKey = apiKeysMap[`${site_locale}_${site_language}_${environment}`];
    const host = hostsMap[environment];
    const msApiURL = `${host}/public/api/v1/service/fetchProductCounts?apikey=${apiKey}`;

    const options = {
        url: msApiURL,
        method: 'POST',
        params: { productId }
    };

    return new Promise(resolve => {
        apiUtil
            .request(options)
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(_e => {
                throw new Error('SessionAI social proof no response');
            });
    });
};

export default {
    getProductsCount
};
