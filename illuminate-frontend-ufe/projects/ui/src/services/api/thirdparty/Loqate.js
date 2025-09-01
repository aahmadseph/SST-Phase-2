import apiUtil from 'utils/Api';
import localeUtils from 'utils/LanguageLocale';

function makeLoqateRequest(type, qsParams) {
    const LOQATE_KEY = Sephora.configurationSettings.loqateAddressValidationKeys.loqateFindRetrieveUFEKey;
    const opts = {
        url: `https://api.addressy.com/Capture/Interactive/${type}/v1.00/json3.ws`,
        method: 'GET',
        qsParams: Object.assign({}, qsParams, { Key: LOQATE_KEY })
    };

    return apiUtil
        .request(opts)
        .then(response => response.json())
        .catch(reason => {
            // eslint-disable-next-line no-console
            console.error(reason);

            return Promise.reject(reason);
        });
}

function findAddresses(text, country, container) {
    const currentLanguage =
        localeUtils.getCurrentLanguage().toUpperCase() === localeUtils.LANGUAGES.EN ? localeUtils.LANGUAGES.EN : localeUtils.LANGUAGES.FR;
    const qsParams = {
        Text: text,
        Container: container,
        Limit: 10,
        Language: currentLanguage,
        Countries: country
    };

    return makeLoqateRequest('Find', qsParams);
}

function retrieveAddress(id) {
    const qsParams = { Id: id };

    return makeLoqateRequest('Retrieve', qsParams);
}

export default {
    findAddresses,
    retrieveAddress
};
