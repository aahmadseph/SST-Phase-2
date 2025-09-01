import {
    API,
    RENDERING,
    FEATURE
} from '#server/services/apiOrchestration/content/constants.mjs';
import getCMSPageData from '#server/services/api/cms/getCMSPageData.mjs';

// Add APIs Here
import getAllGames from '#server/services/api/gamification/getAllGames.mjs';
import getGameDetails from '#server/services/api/gamification/getGameDetails.mjs';
import {
    withSdnToken
} from '#server/services/api/oauth/sdn/withSdnToken.mjs';

// Add Mappers Here
import GamificationActiveGamesMapper from '#server/services/apiOrchestration/content/responseMappers/GamificationActiveGamesMapper.mjs';
import GamificationHistoricalGamesMapper from '#server/services/apiOrchestration/content/responseMappers/GamificationHistoricalGamesMapper.mjs';
import GamificationOtherGamesMapper from '#server/services/apiOrchestration/content/responseMappers/GamificationOtherGamesMapper.mjs';
import GamificationGameDetailsMapper from '#server/services/apiOrchestration/content/responseMappers/GamificationGameDetailsMapper.mjs';

// Supported APIs that can be reqested by Features
const SUPPORTED_APIS = {
    [API.GAMIFICATION_SETTINGS]: {
        method: withSdnToken(getCMSPageData),
        options: {
            apiPath: '/settings/Gamification-Settings',
            useSDN: true
        }
    },
    [API.GAMIFICATION_GAMES]: {
        method: getAllGames,
        options: {}
    },
    [API.GAMIFICATION_GAME_DETAILS]: {
        method: getGameDetails,
        options: {}
    }
};

// Supported Components that can have Features setup
const SUPPORTED_COMPONENTS = [
    RENDERING.CUSTOM,
    RENDERING.SECTION
];

// Supported Features that use the 'mapper' to enhance 'Component' with the data from original 'Component' and 'requestsAPis' responses
const SUPPORTED_FEATURES = {
    [FEATURE.GAMIFICATION_ACTIVE_GAMES]: {
        requestsApis: [API.GAMIFICATION_SETTINGS, API.GAMIFICATION_GAMES],
        mapper: new GamificationActiveGamesMapper()
    },
    [FEATURE.GAMIFICATION_HISTORICAL_GAMES]: {
        requestsApis: [API.GAMIFICATION_SETTINGS, API.GAMIFICATION_GAMES],
        mapper: new GamificationHistoricalGamesMapper()
    },
    [FEATURE.GAMIFICATION_OTHER_GAMES]: {
        requestsApis: [API.GAMIFICATION_SETTINGS, API.GAMIFICATION_GAME_DETAILS],
        mapper: new GamificationOtherGamesMapper()
    },
    [FEATURE.GAMIFICATION_GAME_DETAILS]: {
        requestsApis: [API.GAMIFICATION_SETTINGS, API.GAMIFICATION_GAME_DETAILS],
        mapper: new GamificationGameDetailsMapper()
    }
};

export {
    SUPPORTED_APIS,
    SUPPORTED_COMPONENTS,
    SUPPORTED_FEATURES
};
