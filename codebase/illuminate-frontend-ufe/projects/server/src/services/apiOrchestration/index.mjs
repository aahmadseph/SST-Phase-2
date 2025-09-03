import fixRWDchannelMiddleware from '#server/services/middleware/fixRWDchannelMiddleware.mjs';

import {
    addAPIRoutes
} from '#server/services/apiOrchestration/apiRoutes.mjs';
import addAPI2Routes from '#server/services/apiOrchestration/api2Routes.mjs';
import addCommunityRoutes from '#server/services/apiOrchestration/community.mjs';
import addGwayRoutes from '#server/services/apiOrchestration/gwayRoutes.mjs';

import addProfileAPI from '#server/services/apiOrchestration/userFull/profile/index.mjs';
import addContentRoutes from '#server/services/apiOrchestration/content/contentRoutes.mjs';
import {
    ENDPOINTS
} from '#server/services/apiOrchestration/content/constants.mjs';
import addUserFullAPI from '#server/services/apiOrchestration/userFull/addUserFullAPI.mjs';
import addRecommendationRoutes from '#server/services/apiOrchestration/recommendation/index.mjs';
import addLoyaltyRewardsRoutes from '#server/services/apiOrchestration/rewards/index.mjs';
import getSdnAuthToken from '#server/services/apiOrchestration/authentication/getSdnAuthToken.mjs';

const CA_EN_FR = '';//'(/ca/en|/ca/fr)?';

function includeAPIs(app) {

    app.use('/api/content/{*splat}', fixRWDchannelMiddleware);
    app.use(`${ENDPOINTS.GAMES_CONTENT}/{*splat}`, fixRWDchannelMiddleware);
    app.use('/api/catalog/categories/{*splat}', fixRWDchannelMiddleware);
    app.use('/api/catalog/brands/{*splat}', fixRWDchannelMiddleware);
    app.use('/api/catalog/media/{*splat}', fixRWDchannelMiddleware);
    app.use('/api/catalog/search{*splat}', fixRWDchannelMiddleware);
    app.use('/api/catalog/screens{*splat}', fixRWDchannelMiddleware);
    app.use(`${CA_EN_FR}/api/util/content-seo/{*splat}`, fixRWDchannelMiddleware);

    addGwayRoutes(app);
    addContentRoutes(app);
    addUserFullAPI(app);
    addProfileAPI(app);
    addCommunityRoutes(app);
    addAPI2Routes(app);
    addAPIRoutes(app);
    addRecommendationRoutes(app);
    addLoyaltyRewardsRoutes(app);
    getSdnAuthToken.addAuthenticationRoutes(app);
}

export default includeAPIs;
