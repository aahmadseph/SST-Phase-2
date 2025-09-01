import ufeApi from 'services/api/ufeApi';
import urlUtils from 'utils/Url';
import UUIDv4 from 'utils/UUID';
import Location from 'utils/Location';

const UFE = 'UFE';
const CORRELATION_ID = 'correlationId';

function getFulfillmentOptions(payload = {}, details = false) {
    const { sdnDomainBaseUrl, sdnUfeAPIUserKey, shipToHomeFilterEligibleInBrowse, shipToHomeEligibleInPDP } = Sephora.configurationSettings;
    const shouldCallV2 =
        ((Location.isNthCategoryPage() || Location.isBrandNthCategoryPage()) && shipToHomeFilterEligibleInBrowse) ||
        (Location.isProductPage() && shipToHomeEligibleInPDP) ||
        Location.isBasketPage() ||
        payload.source === 'chooseOptionsModal';

    const queryParams = new Map();
    queryParams.set('apikey', sdnUfeAPIUserKey);
    queryParams.set('details', details);

    const requestId = UUIDv4();
    const queryString = urlUtils.buildQuery(queryParams);
    const apiVersion = shouldCallV2 ? 'V2' : '';
    const url = `${sdnDomainBaseUrl}/v1.0/getFulfillmentOptions${apiVersion}${queryString}`;
    const options = {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
            [CORRELATION_ID]: `${UFE}_${requestId}`
        }
    };

    return ufeApi.makeRequest(url, options).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getFulfillmentOptions;
