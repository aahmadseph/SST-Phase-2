/* eslint-disable class-methods-use-this */
import Empty from 'constants/empty';
import Storage from 'utils/localStorage/Storage';
import stringUtils from 'utils/String';

const GQL_API_CACHE_KEY = 'GQL_API_{0}_{1}';

class CacheMiddleware {
    constructor() {
        this.ttl = {};

        Object.entries(Sephora.configurationSettings.gqlTTLs || Empty.Object).forEach(([key, value]) => {
            this.ttl[key.toLowerCase()] = Number(value);
        });
    }

    async request(context, next) {
        let result;
        const ttl = this.ttl[context.options.operationName.toLowerCase()];

        if (ttl) {
            const cacheKey = await this._getCacheKey(context.options);
            const cacheData = await Storage.db.getItem(cacheKey, false, true);

            if (cacheData) {
                result = cacheData;
            } else {
                result = await next();
                await Storage.db.setItem(cacheKey, result, ttl);
            }
        } else {
            result = await next();
        }

        return result;
    }

    async _getCacheKey({ operationName, variables }) {
        let cacheKeySuffix = '0';
        const keys = Object.keys(variables || {});

        if (keys.length) {
            const sortedVariables = {};
            keys.sort().forEach(key => (sortedVariables[key] = variables[key]));
            const encoder = new TextEncoder();
            const data = encoder.encode(JSON.stringify(sortedVariables));
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            cacheKeySuffix = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        return stringUtils.format(GQL_API_CACHE_KEY, operationName, cacheKeySuffix);
    }
}

export default CacheMiddleware;
