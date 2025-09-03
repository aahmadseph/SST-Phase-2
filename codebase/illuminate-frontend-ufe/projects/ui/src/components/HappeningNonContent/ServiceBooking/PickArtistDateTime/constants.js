const ANY_ARTIST_ID = 'any';

const DAY_PERIOD = {
    MORNING: 'morning',
    AFTERNOON: 'afternoon',
    EVENING: 'evening'
};

const STORE_LOCATOR_URL = '/happening/stores/sephora-near-me';

const PERIOD_START_HOUR = {
    [DAY_PERIOD.MORNING]: 0,
    [DAY_PERIOD.AFTERNOON]: 12,
    [DAY_PERIOD.EVENING]: 17
};

const MINIMUM_HOURS = 24;

export {
    ANY_ARTIST_ID, DAY_PERIOD, STORE_LOCATOR_URL, PERIOD_START_HOUR, MINIMUM_HOURS
};
