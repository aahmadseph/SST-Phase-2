import ufeApi from 'services/api/ufeApi';
import dateUtils from 'utils/Date';

function validatePromo(token, { customerID = '', promoId }) {
    const body = {
        channel: 'digital',
        device: 'web',
        cutoffDate: dateUtils.formatBeforeDateToYYYYMMDD(14),
        customerID
    };

    const url = `/gway/${Sephora.configurationSettings?.useV1PromoValidationApi ? 'v1' : 'v2'}/promotions/validation/${promoId}`;

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default validatePromo;
