import ufeApi from 'services/api/ufeApi';

export default async function getEligibleOrders() {
    const url = '/gway/v1/dotcom/creditmemo/retrieveExemptionEligibleOrders';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        const data = await ufeApi.makeRequest(url, options);

        if (data.errorCode || data.err) {
            throw data;
        }

        return data;
    } catch (error) {
        return Promise.reject(error);
    }
}
