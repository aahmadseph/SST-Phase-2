export const STATUS = {
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    RETRYING: 'retrying',
    ERROR: 'error',
    AWAITING_RESPONSE: 'awaiting-response',
    AWAITING_USER_RESPONSE: 'awaiting-response'
};

export const EVENT_TYPES = {
    CONNECTION: 'connection',
    MESSAGE: 'message',
    HEARTBEAT: 'heartbeat'
};

export const MESSAGE_TYPES = {
    NEW_CONNECTION_REQUEST: 'NEW_CONNECTION_REQUEST',
    USER_QUERY: 'USER_QUERY',
    USER_PING: 'USER_PING',
    USER_QUERY_RESPONSE: 'USER_QUERY_RESPONSE',
    PRODUCTS_RESPONSE: 'PRODUCTS_RESPONSE'
};

export const RESPONSE_TYPES = {
    CAMPAIGN_CONFIG_RESPONSE: 'CAMPAIGN_CONFIG_RESPONSE',
    FOLLOW_UP_MESSAGES_RESPONSE: 'FOLLOW_UP_MESSAGES_RESPONSE',
    PRODUCT_RECOMMENDATION_RESPONSE: 'PRODUCTS_RESPONSE',
    PONG_RESPONSE: 'PONG_RESPONSE'
};

export const ENTRYPOINTS = {
    PDP: 'PDP',
    PLP: 'PLP',
    SRP: 'SRP'
};

export const ERROR_CODES = {
    ABNORMAL_CLOSURE: 1006
};

export const STD_BASKET_TYPE = 'Standard';

export const PRODUCT_RECOMMENDATION_ANALYTICS_CONTEXT = 'productRecommendation';

export const PRODUCT_RECOMMENDATION_ANALYTICS_CATEGORY = 'ai-recommendation';

export const INTENTIONS = {
    GIFT_FINDER: 'GF'
};
