const URLS = {
    ATG_LOGIN_URL: '/api/auth/v1/login',
    SDN_LOGIN_URL: '/gway/v1/dotcom/auth/v1/login'
};

const AUTH_HEADERS = {
    'Content-type': 'application/json',
    'x-requested-source': 'web'
};

const HEADER_VALUE = {
    USER_CLICK: 'user_click'
};

export {
    URLS, AUTH_HEADERS, HEADER_VALUE
};
