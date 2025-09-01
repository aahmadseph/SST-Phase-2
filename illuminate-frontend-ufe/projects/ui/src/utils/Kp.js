import stringUtils from 'utils/String';

const { removeHttp } = stringUtils;

function buildEndpointConfig() {
    const apis = Sephora.configurationSettings.kpEndpoints || [];
    const domain = removeHttp(Sephora.imageHost);
    const config = apis.map(apiPath => {
        return {
            method: '*',
            domain: domain,
            path: apiPath
        };
    });

    const configStr = JSON.stringify(config).replace(/"([^"]+)":/g, ' $1: ');

    return configStr;
}

export default {
    buildEndpointConfig
};
