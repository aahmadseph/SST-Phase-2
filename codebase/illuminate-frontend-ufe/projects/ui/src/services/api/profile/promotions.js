import ufeApi from 'services/api/ufeApi';
import cookieUtils from 'utils/Cookies';

function getPersonalizedPromotions(profileId, isUS) {
    const { isBeautyOffersEnabled, sdnUfeAPIUserKey, sdnDomainBaseUrl } = Sephora.configurationSettings;

    const showMLPromos = isBeautyOffersEnabled && isUS;

    const DYN_USER_ID = cookieUtils.read(cookieUtils.KEYS.DYN_USER_ID);
    const DYN_USER_CONFIRM = cookieUtils.read(cookieUtils.KEYS.DYN_USER_CONFIRM);

    const params = `${profileId}/${DYN_USER_ID}/${DYN_USER_CONFIRM}`;
    const ML_URL = `${sdnDomainBaseUrl}/beauty-offers/v1/${params}`;
    const url = showMLPromos ? ML_URL : '/api/users/profiles/current/promotions?includeBCCData=true';

    const options = {
        method: 'GET',
        headers: showMLPromos
            ? {
                'X-Api-Key': sdnUfeAPIUserKey
            }
            : {}
    };
    const getPromosData = data => (showMLPromos ? data.data : data);

    return ufeApi.makeRequest(url, options).then(data => (data.errorCode ? Promise.reject(data) : getPromosData(data)));
}

export default { getPersonalizedPromotions };
