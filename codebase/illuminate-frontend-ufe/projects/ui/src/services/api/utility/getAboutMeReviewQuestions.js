import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+About+Me+Review+Questions+API

function getAboutMeReviewQuestions(productId) {
    const url = '/api/util/aboutMeQuestions?productId=' + productId;

    return ufeApi.makeRequest(url).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getAboutMeReviewQuestions;
