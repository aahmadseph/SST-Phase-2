import ufeApi from 'services/api/ufeApi';

/*
 * API: https://confluence.sephora.com/wiki/display/ILLUMINATE/Contact+Us+API
 * Story: https://jira.sephora.com/browse/ILLUPH-106582
 * */

function contactUs(params) {
    const url = '/api/util/customerService/contact';

    const options = {
        method: 'POST',
        body: JSON.stringify(params)
    };

    return ufeApi.makeRequest(url, options).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default contactUs;
