import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import cmsDataSelector from 'selectors/page/autoReplenishment/cmsData/cmsDataSelector';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import AutoReplenishmentActions from 'actions/AutoReplenishmentActions';
import userUtils from 'utils/User';

const { wrapHOC } = FrameworkUtils;

const fields = createSelector(cmsDataSelector, userSelector, (cmsData, user) => {
    const isLoggedIn = userUtils.isSignedIn();
    const shouldDisplaySignIn = user.isInitialized && !isLoggedIn;

    return {
        cmsData,
        shouldDisplaySignIn
    };
});

const functions = {
    showSignInModal: AutoReplenishmentActions.showSignInModal
};

const withAutoReplenishEmptyHubProps = wrapHOC(connect(fields, functions));

export {
    withAutoReplenishEmptyHubProps, fields, functions
};
