import ufeApi from 'services/api/ufeApi';
import helpersUtils from 'utils/Helpers';

const { fixArrayResponse } = helpersUtils;

const getUserPaymentInfo = (token, { creditCardId = '' }) => {
    const url = `/gway/v1/happening/payment/${creditCardId}`;

    return ufeApi
        .makeRequest(url, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            const data = fixArrayResponse(response);

            return data.errorCode ? Promise.reject(data) : data;
        });
};

export default getUserPaymentInfo;
