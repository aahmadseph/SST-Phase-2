import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Actions from 'Actions';
import FrameworkUtils from 'utils/framework';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import HomepageActions from 'actions/HomepageActions';

const { wrapHOC } = FrameworkUtils;

const { showContentModal } = Actions;
const fields = createStructuredSelector({
    user: coreUserDataSelector
});

const functions = dispatch => ({
    onDismiss: () => dispatch(showContentModal({ isOpen: false })),
    getPersonalizedEnabledComponents: HomepageActions.getPersonalizedEnabledComponents
});

const withContentModalProps = wrapHOC(connect(fields, functions));

export {
    withContentModalProps, fields, functions
};
