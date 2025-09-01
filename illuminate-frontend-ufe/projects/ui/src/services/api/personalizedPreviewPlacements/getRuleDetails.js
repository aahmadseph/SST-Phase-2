import apiUtil from 'utils/Api';
import { isUfeEnvProduction } from 'utils/Env';

function getRuleDetails(ruleId) {
    const host = isUfeEnvProduction ? 'https://appscms-preview.sephora.com/dp-p13nops' : 'https://appscms-qa.sephora.com/dp-p13nops';
    const opts = {
        url: `${host}/v1/rule/${ruleId}`,
        method: 'GET'
    };

    return apiUtil
        .request(opts)
        .then(response => response.json())
        .then(data => {
            return data;
        })
        .catch(reason => {
            return reason;
        });
}

export default getRuleDetails;
