import ufeApi from 'services/api/ufeApi';

function unsubscribeQuestion(subscriptionId, questionId, isCommunityServiceEnabled = true) {
    let url = '/api/bazaarvoice/unsubscribe';
    const options = {
        method: 'PUT',
        body: JSON.stringify({
            subscriptionId,
            questionId
        })
    };

    if (isCommunityServiceEnabled) {
        url = '/api/v1/community/bazaarvoice/unsubscribe';
        options.headers = {
            'Content-type': 'application/json'
        };
    }

    return ufeApi.makeRequest(url, options).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default unsubscribeQuestion;
