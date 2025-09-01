export const PAGE_TYPES = {
    CATEGORY: 'category',
    SEARCH: 'search'
};

export const POSITIONS = {
    TOP: 'top',
    MID: 'mid',
    BOTTOM: 'bottom'
};

export const LEADERBOARD_POSITION_INDEX = {
    TOP: 0,
    MID: 1,
    BOTTOM: 2
};

export const SECTIONS = {
    MAIN: 'main',
    SIDEBAR: 'sidebar'
};

export const BANNER_AND_PLA_TYPES = {
    LEADERBOARD: 'banner.leaderboard',
    SIDERAIL: 'banner.siderail',
    CAROUSEL: 'pla.carousel'
};

export default {
    MOBILE_VIEW: 'xsMax',
    PAGE_TYPES,
    POSITIONS,
    SECTIONS,
    LEADERBOARD_POSITION_INDEX,
    BANNER_AND_PLA_TYPES,
    TYPES: {
        SUPER_LEADERBOARD: {
            NAME: 'SUPER_LEADERBOARD',
            WIDTH: 970,
            HEIGHT: 90,
            DISPLAY: ['none', 'block'],
            SLOT: {
                [PAGE_TYPES.CATEGORY]: '02123',
                [PAGE_TYPES.SEARCH]: '03123'
            }
        },
        MOBILE_LEADERBOARD: {
            NAME: 'MOBILE_LEADERBOARD',
            WIDTH: 320,
            HEIGHT: 50,
            DISPLAY: [null, 'none'],
            SLOT: {
                [PAGE_TYPES.CATEGORY]: '02223',
                [PAGE_TYPES.SEARCH]: '03223'
            }
        },
        WIDE_SIDESCRAPER: {
            NAME: 'WIDE_SIDESCRAPER',
            WIDTH: 160,
            HEIGHT: 600,
            DISPLAY: ['none', null, 'block'],
            SLOT: {
                [PAGE_TYPES.CATEGORY]: '02124',
                [PAGE_TYPES.SEARCH]: '03124'
            }
        }
    }
};
