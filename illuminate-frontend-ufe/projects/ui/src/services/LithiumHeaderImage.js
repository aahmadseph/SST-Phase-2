import store from 'store/Store';
import userActions from 'actions/UserActions';
import Events from 'utils/framework/Events';

export default (function () {
    Events.onLastLoadEvent(window, [Events.UserInfoReady], () => {
        const profile = store.getState().user;
        store.dispatch(userActions.getLithiumUserData({ profile: profile }));
    });
}());
