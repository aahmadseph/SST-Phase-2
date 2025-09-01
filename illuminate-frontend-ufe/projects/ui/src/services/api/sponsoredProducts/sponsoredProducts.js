import ufeApi from 'services/api/ufeApi';
const { makeRequest } = ufeApi;
import cookieUtils from 'utils/Cookies';
import localeUtils from 'utils/LanguageLocale';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import PageTemplateType from 'constants/PageTemplateType';

/**
 *  Request params
 *  targets, slot, count, count_fill
 */

function getSponsoredProducts({ searchTerm = '', ...params } = {}) {
    const url = Sephora.configurationSettings.sdnDomainBaseUrl + '/v1/browseSearchProduct';

    const apikey = Sephora.configurationSettings.sdnUfeAPIUserKey;

    // Pulls the information from the local storage.
    const userData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA, false, false, true);

    const session = cookieUtils.read('SephSession') || '';
    const locale = localeUtils.getCurrentCountry() + '-' + localeUtils.getCurrentLanguage();

    // Verifies if the user is logged or not to fill the user parameter.
    const biAccountId = userData?.data?.profile?.beautyInsiderAccount?.biAccountId || '';
    const segments = userData?.data?.segments?.userSegments || [];

    let body = {
        session,
        internal: false,
        locale: locale.toLowerCase()
    };

    if (biAccountId) {
        body.user = biAccountId;

        if (segments.length > 0) {
            body.audiences = segments;
        }
    }

    if (params) {
        body = {
            ...body,
            ...params
        };
    }

    if (Sephora.configurationSettings.smnBrowseCombinedCallEnabled) {
        // Verifies if the page is a search page or not.
        if (Sephora.template === PageTemplateType.Search) {
            body = {
                ...body,
                query: searchTerm
            };
        }

        body = {
            ...body,
            // eslint-disable-next-line camelcase
            group_ads_by_placements: true
        };
    }

    return makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-type': 'application/json',
            'x-api-key': apikey
        }
    })
        .then(data => (data.errorCode ? Promise.reject(data) : data))
        .catch(error => Promise.reject(error));
}

export default getSponsoredProducts;
