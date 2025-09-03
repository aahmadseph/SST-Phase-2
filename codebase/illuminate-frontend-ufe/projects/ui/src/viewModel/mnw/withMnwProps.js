import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import MwnActions from 'actions/MnwActions';

const { wrapHOC } = FrameworkUtils;
const fields = createSelector(coreUserDataSelector, user => {
    return { isAnonymous: user.isAnonymous };
});

const functions = {
    showPasswordResetRecommendation: MwnActions.showPasswordResetRecommendation,
    showPasswordResetAfterSignup: MwnActions.showPasswordResetAfterSignup
};

const withMnwProps = wrapHOC(connect(fields, functions));

export {
    withMnwProps, fields, functions
};
