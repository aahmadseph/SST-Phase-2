import ufeApi from 'services/api/ufeApi';

function getLABCodeDescription(token, labCode) {
    const sdnDomain = Sephora.configurationSettings.sdnDomainBaseUrl;
    const url = `${sdnDomain}/v1/reverseLookUp/nomenclature/lab`;

    // In some cases lab value comes with commas and API is expecting it with colons
    const lab = labCode.replace(/,/g, ':');

    const options = {
        method: 'POST',
        body: JSON.stringify({ lab }),
        headers: {
            authorization: `Bearer ${token}`,
            'Content-type': 'application/json'
        }
    };

    return ufeApi.makeRequest(url, { ...options }).then(data => (data.errorCode ? Promise.reject(data) : data));
}

export default getLABCodeDescription;
