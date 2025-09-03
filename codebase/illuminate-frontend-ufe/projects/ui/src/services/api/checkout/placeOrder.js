import ufeApi from 'services/api/ufeApi';
import headerUtils from 'utils/Headers';
import splitEDDUtils from 'utils/SplitEDD';

const { purchaseEventTimeStamp } = headerUtils;

// https://jira.sephora.com/wiki/display/ILLUMINATE/Place+Order+API

function placeOrder(params = {}) {
    const url = '/api/checkout/submitOrder';

    const headers = {
        ...purchaseEventTimeStamp()
    };

    const splitEDDExperience = splitEDDUtils.iSplitEDDExperienceDisplayed();

    if (splitEDDExperience) {
        headers['x-edd-split'] = true;
    }

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(params)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default placeOrder;
