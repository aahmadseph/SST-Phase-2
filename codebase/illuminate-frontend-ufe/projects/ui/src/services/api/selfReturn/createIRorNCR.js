import ufeApi from 'services/api/ufeApi';

// https://confluence.sephora.com/wiki/pages/viewpage.action?spaceKey=ILLUMINATE&title=Create+Immediate+Return+or+NCR

function createIRorNCR(payload) {
    const url = '/api/selfReturn/createIRorNCR';

    return ufeApi
        .makeRequest(url, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default createIRorNCR;
