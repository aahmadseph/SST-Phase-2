import FrameworkUtils from 'utils/framework';
import HappeningActions from 'actions/HappeningActions';
import { connect } from 'react-redux';

import actions from 'actions/Actions';
import UserActions from 'actions/UserActions';

const { wrapHOC } = FrameworkUtils;
const { showRegisterModal } = actions;

const functions = {
    bookGuestService: HappeningActions.bookGuestService,
    showRegisterModal,
    checkEmailAndPhone: UserActions.checkEmailAndPhone
};

const withReviewAndPayProps = wrapHOC(connect(null, functions));

export {
    withReviewAndPayProps, functions
};
