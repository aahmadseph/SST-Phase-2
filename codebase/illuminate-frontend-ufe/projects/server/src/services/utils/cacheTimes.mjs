import {
    MINUTE,
    HOUR
} from '#server/config/TimeConstants.mjs';
import {
    SIMPLE_CACHE_EXP_TIME
} from '#server/config/envRouterConfig.mjs';

// this is from config
const SHORT_CACHE_LIFE = SIMPLE_CACHE_EXP_TIME;

// short cache is a 5 second cache
// meant to be used for when lots of requests come in for same API
// so we are not calling the API all the time for the same data
const CACHE_FIVE_MINUTES = MINUTE * 5,
    CACHE_THIRTY_MINUTES = MINUTE * 30,
    CACHE_ONE_HOUR = HOUR,
    CACHE_FOUR_HOURS = 4 * HOUR,
    CACHE_TWENTY_FOUR_HOURS = 24 * HOUR,
    SHORT_CACHE = SHORT_CACHE_LIFE;

export {
    CACHE_FIVE_MINUTES,
    CACHE_THIRTY_MINUTES,
    CACHE_ONE_HOUR,
    CACHE_FOUR_HOURS,
    CACHE_TWENTY_FOUR_HOURS,
    SHORT_CACHE
};
