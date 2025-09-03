import ufeApi from 'services/api/ufeApi';

function getHighlightedReviews({
    sentiment, productID, language = 'en', limit = 6, page = 0
}) {
    let url = '/api/v1/community/bazaarvoice/highlighted-reviews';
    const productIdKey = 'productId';

    const options = {
        sentiment,
        [productIdKey]: productID,
        language,
        limit,
        offset: page * limit
    };

    // Convert options json to URL params
    if (options) {
        const params = Object.keys(options);

        if (params.length > 0) {
            url += '?';
            params.forEach((param, index) => {
                url += param + '=' + options[param];

                if (index < params.length - 1) {
                    url += '&';
                }
            });
        }
    }

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getHighlightedReviews;
