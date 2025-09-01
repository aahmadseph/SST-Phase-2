import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
import UserActions from 'actions/UserActions';

const { wrapHOC } = FrameworkUtils;

const fields = createSelector(userSelector, user => {
    return {
        userIsInitialized: user.isInitialized
    };
});

const functions = {
    validateUserStatus: UserActions.validateUserStatus
};

const withOrderStatusLookupProps = wrapHOC(connect(fields, functions));

export {
    withOrderStatusLookupProps, fields, functions
};
