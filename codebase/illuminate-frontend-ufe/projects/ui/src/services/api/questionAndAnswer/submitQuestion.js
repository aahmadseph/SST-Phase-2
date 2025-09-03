import ufeApi from 'services/api/ufeApi';

//https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Submit+Question+API

function submitQuestion(productId, questionText, fp, email, isCommunityServiceEnabled = true, locale, userId) {
    let url = '/api/bazaarvoice/question';

    const body =
        email === ''
            ? {
                productId,
                questionText,
                fp
            }
            : {
                productId,
                questionText,
                fp,
                email
            };

    if (isCommunityServiceEnabled) {
        url = `/api/v1/community/bazaarvoice/question?loc=${locale}`;

        if (userId) {
            body.userId = userId;
        }
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then(data => {
            return data.errorCode ? Promise.reject(data) : data;
        });
}

export default submitQuestion;
