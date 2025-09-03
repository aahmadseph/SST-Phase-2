const cacheConcern = (() => {
    let cache = {};

    function decorate(cacheNamespace, decoratedMethod) {
        if (!cache[cacheNamespace]) {
            cache[cacheNamespace] = {};
        }

        const decorated = function (...callArgs) {
            const cacheKey = callArgs.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(',');

            let promise;

            if (cache[cacheNamespace][cacheKey]) {
                // eslint-disable-next-line no-console
                console.debug('CACHE HIT:', cacheNamespace, cacheKey);
                promise = Promise.resolve(cache[cacheNamespace][cacheKey]);
            } else {
                promise = decoratedMethod.apply(null, callArgs).then(data => {
                    cache[cacheNamespace][cacheKey] = data;

                    return data;
                });
            }

            return promise;
        };

        return decorated;
    }

    function clearCache(namespace) {
        if (!namespace) {
            cache = {};
            Sephora.logger.info('CACHE All namespaces cleared.');
        } else {
            cache[namespace] = {};
            Sephora.logger.info(`CACHE Namespace "${namespace}" cleared.`);
        }
    }

    return {
        clearCache,
        decorate
    };
})();

export default cacheConcern;
