import {
    SUPPORTED_APIS,
    SUPPORTED_COMPONENTS,
    SUPPORTED_FEATURES
} from '#server/services/apiOrchestration/content/configuration.mjs';

function getFeature(component) {
    // We do support only single feature per component at this moment.
    const handlerType = component.features?.[0]?.handlerType;

    return {
        ...SUPPORTED_FEATURES[handlerType],
        handlerType
    };
}

function findCompomentsToEnhace(content) {
    return (content?.data?.layout?.content || []).filter(x => SUPPORTED_COMPONENTS.indexOf(x.type) >= 0 && getFeature(x));
}

function buildApisToCall(components) {
    const arrayOfApisPerFeature = components.map(component => {
        const feature = getFeature(component);

        return feature.requestsApis.map(api => ({
            api: api,
            extraOptions: feature.mapper.buildExtraOptions(api, component)
        }));
    });

    if (arrayOfApisPerFeature.length === 0) {
        return [];
    }

    const result = {};
    arrayOfApisPerFeature.reduce((acc, current) => [...acc, ...current]).forEach(x => {
        if (!result[x.api]) {
            result[x.api] = ({
                id: x.api,
                apiMethod: SUPPORTED_APIS[x.api].method,
                options: SUPPORTED_APIS[x.api].options
            });
        }

        result[x.api].extraOptions = ({
            ...result[x.api].extraOptions,
            ...x.extraOptions
        });
    });

    return Object.values(result);
}

export {
    findCompomentsToEnhace,
    getFeature,
    buildApisToCall
};
