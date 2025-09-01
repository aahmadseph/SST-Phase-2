import apiUtil from 'utils/Api';
import { isUfeEnvProduction } from 'utils/Env';

function getRuleSetByContextIds(contextIds) {
    const host = isUfeEnvProduction ? 'https://appscms-preview.sephora.com/dp-p13nops' : 'https://appscms-qa.sephora.com/dp-p13nops';
    const url = `${host}/v1/ruleset/bycontextids`;
    const opts = {
        url: url,
        method: 'POST',
        params: contextIds,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return apiUtil
        .request(opts)
        .then(response => response.json())
        .then(data => {
            if (data.errorCode) {
                return Promise.reject(data);
            }

            delete data.responseStatus;

            // Extract all rulesets from the response
            const allRuleSets = Object.values(data).flat();

            // Filter active rulesets and extract their rules
            const allActiveRuleSet = allRuleSets.filter(ruleSet => ruleSet?.active);

            return allActiveRuleSet;
        })
        .catch(reason => {
            return reason;
        });
}

export default getRuleSetByContextIds;
