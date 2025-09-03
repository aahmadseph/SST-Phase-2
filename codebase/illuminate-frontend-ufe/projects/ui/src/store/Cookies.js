import cookiesReducer from 'reducers/cookies';
import cookieUtils from 'utils/Cookies';

const { ACTION_TYPES } = cookiesReducer;

const cookieHandler = () => next => action => {
    let result;

    switch (action.type) {
        case ACTION_TYPES.SET_COOKIE:
            cookieUtils.write(action.name, action.value, action.days, action.top);
            result = next(action);

            break;
        case ACTION_TYPES.DELETE_COOKIE:
            cookieUtils.delete(action.cookie);
            result = next(action);

            break;
        default:
            result = next(action);

            break;
    }

    return result;
};

export default cookieHandler;
