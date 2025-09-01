import apiUtil from 'utils/Api';
import localeUtils from 'utils/LanguageLocale';

const LINK_LIMIT = 10;

const PROD_HOST = 'https://pdp.api.htap.io';
const QA_HOST = 'https://b7i8ltfqah.execute-api.us-east-1.amazonaws.com/dev';
const IS_ADD_STRUCTURE_ENABLED = Sephora.configurationSettings.isAddStructureEnabled;
const ADD_STRUCTURE_ORG = Sephora.configurationSettings.addStructureOrg;
const host = Sephora.UFE_ENV === 'PROD' ? PROD_HOST : QA_HOST;

const addStructureApiRequest = function (options) {
    const getText = localeUtils.getLocaleResourceFile('services/api/thirdparty/locales', 'messages');

    if (!IS_ADD_STRUCTURE_ENABLED) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ error: getText('addStructureApiRequestFailureReason') });
    }

    return new Promise((resolve, reject) => {
        apiUtil
            .request(options)
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(Object.assign({}, error, { apiFailed: true }));
            });
    });
};

const getSeoLinks = function (sku) {
    return addStructureApiRequest({
        method: 'GET',
        url: host + '/links',
        qsParams: {
            limit: LINK_LIMIT,
            sku: sku,
            org: ADD_STRUCTURE_ORG
        }
    }).catch(errorMsg => {
        return { errorMsg };
    });
};

export default { getSeoLinks };
