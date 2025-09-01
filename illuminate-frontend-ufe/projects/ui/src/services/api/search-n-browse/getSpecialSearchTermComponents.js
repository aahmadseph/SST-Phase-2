import ufeApi from 'services/api/ufeApi';

// https://jira.sephora.com/wiki/display/ILLUMINATE/Get+Special+Search+Term+Components

function getSpecialSearchTermComponents(keyword) {
    const url = `/api/catalog/specialSearchTerms?keyword=${keyword}`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getSpecialSearchTermComponents;
