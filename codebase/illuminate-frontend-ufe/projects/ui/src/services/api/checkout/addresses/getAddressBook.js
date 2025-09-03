import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Address+Book+API

function getAddressBook(profileId, country, isReshipOrder = false) {
    const url = `/api/checkout/profiles/${profileId}/addresses?country=${country}${isReshipOrder ? '&isReshipOrder=true' : ''}`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getAddressBook;
