import apiUtil from 'utils/Api';
import { isUfeEnvProduction } from 'utils/Env';

function getRuleSetByContextId(contextId) {
    const host = isUfeEnvProduction ? 'https://appscms-preview.sephora.com/dp-p13nops' : 'https://appscms-qa.sephora.com/dp-p13nops';
    const opts = {
        url: `${host}/v1/ruleset/bycontextid/${contextId}`,
        method: 'GET'
    };

    return apiUtil
        .request(opts)
        .then(response => response.json())
        .then(rules => {
            if (rules?.length > 0) {
                return rules.filter(rule => rule.active);
            }

            return rules;
        })
        .catch(reason => {
            return reason;
        });
}

export default getRuleSetByContextId;
