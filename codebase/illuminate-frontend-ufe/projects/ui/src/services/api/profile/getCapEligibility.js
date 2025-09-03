import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/pages/viewpage.action?pageId=345335309

function getCapEligibility() {
    const url = '/api/users/profiles/current/capEligibility';

    const options = { method: 'GET', headers: { 'Content-Type': 'application/json' } };

    return ufeApi.makeRequest(url, options).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getCapEligibility;
