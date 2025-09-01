import {
    SDN_API_HOST,
    SDN_API_PORT
} from '#server/config/envRouterConfig.mjs';

import {
    httpsRequest
} from '#server/services/utils/apiRequest.mjs';
import logAPICheck from '#server/utils/logAPICheck.mjs';
import {
    getConfigSetting
} from '#server/services/apiOrchestration/userFull/utils/utils.mjs';
import {
    KS
} from '#server/services/apiOrchestration/userFull/utils/constants.mjs';
import {
    COOKIES_NAMES
} from '#server/services/utils/Constants.mjs';

function isNewSLSEnabled(options, configurationSettings) {
    const isSLSServiceEnabled = getConfigSetting(configurationSettings, KS.IS_SLS_SERVICE_ENABLED);
    const isSLSServiceCookieIgnore = getConfigSetting(configurationSettings, KS.IS_SLS_SERVICE_COOKIE_IGNORE);
    const isRCPSSLSEnabled = options.headers.Cookie[COOKIES_NAMES.RCPS_SLS] === 'true';

    if (!isSLSServiceEnabled) {
        return false;
    }
    return isSLSServiceCookieIgnore ? true : isRCPSSLSEnabled;
}

function getShoppingList(options, configurationSettings) {
    const isShoppingListEnabled = getConfigSetting(configurationSettings, KS.IS_SHOPPING_LIST_ENABLED);
    const sharableLists = getConfigSetting(configurationSettings, KS.SHARABLE_LISTS_CONFIGURATION);
    const { country = 'US' } = options;
    const isSharableListEnabled = sharableLists && sharableLists[`sharableLists${country}`]?.isEnabled === true;

    let url = isNewSLSEnabled(options, configurationSettings)
        ? '/v1/dotcom/users/profiles/lists'
        : `/v2/user/profiles/shopping-list/${options.profileId}?isShoppingListEnabled=${isShoppingListEnabled}`;

    if (isSharableListEnabled) {
        url = `/v1/dotcom/users/profiles/${options.biAccountIdOrDefault}/lists/skus/all?itemsPerPage=2000&currentPage=1&listShortNameLength=20&skipProductDetails=true&includeInactiveSkus=true`;
    }

    return httpsRequest(SDN_API_HOST, SDN_API_PORT, url, 'GET', options);
}

export default logAPICheck(getShoppingList);
