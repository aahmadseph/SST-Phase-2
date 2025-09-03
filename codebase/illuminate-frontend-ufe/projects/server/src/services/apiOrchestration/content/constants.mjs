const ENDPOINTS = {
    GAMES_CONTENT: '/api/games/content'
};

const API = {
    GAMIFICATION_SETTINGS: 'gamificationSettings',
    GAMIFICATION_GAMES: 'gamificationGames',
    GAMIFICATION_GAME_DETAILS: 'gamificationGameDetails'
};

const FEATURE = {
    GAMIFICATION_ACTIVE_GAMES: 'gamificationActiveGames',
    GAMIFICATION_HISTORICAL_GAMES: 'gamificationHistoricalGames',
    GAMIFICATION_OTHER_GAMES: 'gamificationOtherGames',
    GAMIFICATION_GAME_DETAILS: 'gamificationGameDetails'
};

const RENDERING = {
    SECTION: 'SectionRendering',
    CUSTOM: 'CustomRendering',
    CARD: 'CardRendering'
};

const DATASOURCE = {
    SECTION: 'SectionDatasource',
    CARD: 'CardDatasource',
    GAME_DETAILS: 'GameDetailsDatasource'
};

const PARAMETERS = {
    SECTION: 'SectionRenderingParameters',
    CARD: 'CardRenderingParameters',
    GAME_DETAILS: 'GameDetailsRenderingParameters'
};

const LAYOUTS = {
    VERTICAL: 'vertical',
    SIDE_BY_SIDE: 'sideBySide'
};

const CHALLENGE_STATUS = {
    NOT_JOINED: 'NOT_JOINED',
    OPTED_IN: 'OPTED_IN',
    COMPLETED: 'COMPLETED'
};

export {
    ENDPOINTS,
    API,
    FEATURE,
    RENDERING,
    DATASOURCE,
    PARAMETERS,
    LAYOUTS,
    CHALLENGE_STATUS
};
