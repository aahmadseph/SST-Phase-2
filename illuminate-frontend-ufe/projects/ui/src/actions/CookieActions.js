import cookiesReducer from 'reducers/cookies';
const { ACTION_TYPES: TYPES } = cookiesReducer;

function setAllCookies(cookies) {
    return {
        type: TYPES.SET_ALL_COOKIES,
        cookies
    };
}

function setCookie(name, value, days, top) {
    return {
        type: TYPES.SET_COOKIE,
        name,
        value,
        days,
        top
    };
}

function deleteCookie(cookie) {
    return {
        type: TYPES.DELETE_COOKIE,
        cookie
    };
}

export default {
    TYPES,
    setAllCookies,
    setCookie,
    deleteCookie
};
