import 'utils/tokens/handlers/user';

const handlers = {};

export default {
    async getHandlerPackage(handlerName) {
        try {
            if (!handlers[handlerName]) {
                handlers[handlerName] = await import(/* webpackMode: "eager" */ `./handlers/${handlerName}`);
            }

            return handlers[handlerName];
        } catch (_) {
            throw new Error(`Handler [${handlerName}] has not been defined`);
        }
    }
};
