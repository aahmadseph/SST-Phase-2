import frameworkUtils from 'utils/framework';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { happeningUserDataSelector } from 'selectors/page/happening/happeningUserDataSelector';
import Actions from 'Actions';
import HappeningActions from 'actions/HappeningActions';

const { wrapHOC } = frameworkUtils;
const { showBiRegisterModal } = Actions;
const { guestBookingDetails, reservationSensitiveDetails } = HappeningActions;

const fields = createSelector(happeningUserDataSelector, user => ({ user }));

const functions = {
    showBiRegisterModal,
    guestBookingDetails,
    reservationSensitiveDetails
};

const withHappeningUserProps = wrapHOC(connect(fields, functions));

export {
    withHappeningUserProps, fields, functions
};
