import ufeApi from 'services/api/ufeApi';

function confirmReturnOrder(params = {}) {
    const url = '/api/selfReturn/confirmIRorNCR';

    return ufeApi
        .makeRequest(
            url,
            {
                method: 'POST',
                body: JSON.stringify(params)
            },
            { skipLoginPrompt: true }
        )
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default confirmReturnOrder;
