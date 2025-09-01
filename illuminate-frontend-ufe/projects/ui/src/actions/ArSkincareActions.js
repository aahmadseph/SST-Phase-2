import Actions from 'Actions';
import Location from 'utils/Location';
import userUtils from 'utils/User';

const onClickCTA = targetUrl => (dispatch, getState) => {
    const { user } = getState();
    const isAnonymous = userUtils.isAnonymous();
    const isUserSignedIn = !isAnonymous && user?.isInitialized;

    if (isUserSignedIn) {
        Location.navigateTo(null, targetUrl);
    } else {
        dispatch(Actions.showSignInModal({ isOpen: true, callback: () => Location.navigateTo(null, targetUrl) }));
    }
};

export default { onClickCTA };
