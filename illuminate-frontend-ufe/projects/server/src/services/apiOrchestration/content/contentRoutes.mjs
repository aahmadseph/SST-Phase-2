import {
    resolve,
    basename
} from 'path';

import {
    sendAPIJsonResponse,
    sendAPI404Response,
    sendAPI500Response
} from '#server/utils/sendAPIResponse.mjs';
import {
    findCompomentsToEnhace,
    getFeature,
    buildApisToCall
} from '#server/services/apiOrchestration/content/utils.mjs';
import {
    ENDPOINTS
} from '#server/services/apiOrchestration/content/constants.mjs';
import {
    withSdnToken
} from '#server/services/api/oauth/sdn/withSdnToken.mjs';
import getCMSPageData from '#server/services/api/cms/getCMSPageData.mjs';
import {
    stringifyMsg,
    safelyParse
} from '#server/utils/serverUtils.mjs';

const filename = basename(resolve(import.meta.url));
import Logger from '#server/libs/Logger.mjs';
const logger = Logger(filename);

const getCMSPageDataWithToken = withSdnToken(getCMSPageData);

function handleSimpleContent(request, response) {
    // Initial CXS API call
    const apiPath = request.apiOptions.apiPath.replace(ENDPOINTS.GAMES_CONTENT, '');
    getCMSPageDataWithToken({
        ...request.apiOptions,
        apiPath,
        useSDN: true
    }).then(result => {
        const content = safelyParse(result.data);

        if (!content.data) {
            sendAPI404Response(response);

            return;
        }

        const requestOptions = {
            ...request.apiOptions,
            userId: request.query.userId
        };

        const compomentsToEnhace = findCompomentsToEnhace(content);
        const apisToCall = buildApisToCall(compomentsToEnhace);
        const dependentApiCalls = apisToCall.map(x => x.apiMethod({
            ...requestOptions,
            ...x.options,
            ...x.extraOptions
        }));

        // Nothing to enhance, send back the original response
        if (dependentApiCalls.length === 0) {
            sendAPIJsonResponse(response, content);

            return;
        }

        Promise.all(dependentApiCalls).then(dependentResults => {
            const apiResults = dependentResults
                .map((x, i) => ({
                    [apisToCall[i].id]: safelyParse(x.data)
                }))
                .reduce((acc, x) => ({
                    ...acc,
                    ...x
                }));

            const {
                userId,
                isAnonymous
            } = request.apiOptions.parseQuery;

            const sharedContext = {
                userId,
                isAnonymous
            };

            compomentsToEnhace.forEach(component => {
                const feature = getFeature(component);
                try {
                    const newInstance = feature.mapper.enhanceComponent(component, apiResults, sharedContext);

                    // For the newInstance we need to update the original reference to newInstance instead of mutating oldInstance
                    if (newInstance) {
                        content.data.layout.content[content.data.layout.content.findIndex(c => c?.sid === component.sid)] = newInstance;
                    }

                    delete component.features; // we do delete as they sucesfully processed, so the dynamic binding response will look exactly the same as static
                    delete component.featuresData; // we do delete as they sucesfully processed, so the dynamic binding response will look exactly the same as static
                    logger.info(`Feature '${feature.handlerType}' sucesfully enhanced component '${component.sid}'.`);
                } catch (e) {
                    logger.error(`Feature '${feature.handlerType}' failed to enhance component '${component.sid}' with error: ${stringifyMsg(e.message)}.`);
                }
            });

            sendAPIJsonResponse(response, content);
            // Next catch replies with 200 having original content. components not enhanced -> we're not clearing component.features, next arch layer can try do it as well.
        }).catch(e => sendAPIJsonResponse(response, content, `Dependent API calls failed on '${request.url}': ${stringifyMsg(e?.message)}.`));
    }).catch(e => sendAPI500Response(response, `Initial CXS API call failed on '${request.url}': ${stringifyMsg(e?.message)}.`));
}

function addContentRoutes(app) {
    app.get(`${ENDPOINTS.GAMES_CONTENT}/{*splat}`, handleSimpleContent);
}

export default addContentRoutes;
