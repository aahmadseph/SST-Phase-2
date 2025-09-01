import frameworkUtils from 'utils/framework';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { happeningUserDataSelector } from 'selectors/page/happening/happeningUserDataSelector';

import Actions from 'actions/Actions';

const { wrapHOC } = frameworkUtils;
const { showInfoModal, showBiRegisterModal, showSignInModal } = Actions;

const fields = createSelector(happeningUserDataSelector, user => ({ user }));

const functions = {
    showInfoModal,
    showBiRegisterModal,
    showSignInModal
};

const withBookingConfirmationDetailsProps = wrapHOC(connect(fields, functions));

export { withBookingConfirmationDetailsProps };
