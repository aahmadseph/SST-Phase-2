import ufeApi from 'services/api/ufeApi';

function getUFEComponentContent(componentId) {
    const url = `/api/catalog/component/${componentId}?includeRegionsMap=true`;

    return ufeApi.makeRequest(url, { method: 'GET' }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default { getUFEComponentContent };
