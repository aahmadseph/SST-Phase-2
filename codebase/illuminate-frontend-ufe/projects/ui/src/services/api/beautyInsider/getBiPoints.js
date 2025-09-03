import ufeApi from 'services/api/ufeApi';
import biProfile from 'utils/BiProfile';
import userUtils from 'utils/User';
import basketUtils from 'utils/Basket';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+BI+Points+API

function getBiPoints(userProfileId, source = 'profile', orderId) {
    const { useLXSBiPoints } = Sephora.configurationSettings;
    const biAccountId = userUtils.getBiAccountId();
    const nonBiAccountResponse = { beautyBankPoints: 0 };

    if (useLXSBiPoints && !biAccountId) {
        return new Promise(resolve => resolve(nonBiAccountResponse));
    }

    const headers = useLXSBiPoints
        ? {
            'x-requested-source': 'web'
        }
        : undefined;

    let url;

    if (useLXSBiPoints) {
        const redeemedBiPoints = basketUtils.getRedeemedBiPoints();
        const potentialBeautyBankPoints = basketUtils.getPotentialBiPoints();
        const netBeautyBankPointsAvailable = basketUtils.getAvailableBiPoints();
        const subtotal = basketUtils.getSubtotal();
        url = `/gway/v1/lxs/${biAccountId}/points?source=${source}&redeemedPoints=${redeemedBiPoints}&earnedPoints=${potentialBeautyBankPoints}&netBeautyBankPointsAvailable=${netBeautyBankPointsAvailable}&subTotal=${subtotal}`;
    } else {
        url = `/api/bi/profiles/${userProfileId}/points?source=${source}`;
    }

    if (source === biProfile.SOURCES.ORDER_CONFIRMATION) {
        url += `${useLXSBiPoints ? `&orderId=${orderId}` : ''}&isLastOrder=true`;
    }

    return ufeApi.makeRequest(url, { method: 'GET', headers }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getBiPoints;
