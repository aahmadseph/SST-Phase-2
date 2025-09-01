import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import { authSelector } from 'selectors/auth/authSelector';
import isBIPointsAvailableSelector from 'selectors/basket/isBIPointsAvailableSelector';

const { wrapHOC } = FrameworkUtils;

const fields = createSelector(userSelector, authSelector, isBIPointsAvailableSelector, (user, auth, isBiPointsAvailable) => {
    return {
        user,
        auth,
        isBiPointsAvailable
    };
});

const functions = null;

const withRwdAdvocacyProps = wrapHOC(connect(fields, functions));

export {
    withRwdAdvocacyProps, fields, functions
};
