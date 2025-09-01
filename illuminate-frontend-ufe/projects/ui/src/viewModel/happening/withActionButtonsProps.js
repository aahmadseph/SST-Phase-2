import frameworkUtils from 'utils/framework';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Actions from 'Actions';
import { happeningUserDataSelector } from 'selectors/page/happening/happeningUserDataSelector';

const { wrapHOC } = frameworkUtils;
const { showInfoModal, showEDPConfirmRsvpModal } = Actions;

const fields = createSelector(happeningUserDataSelector, user => ({ user }));

const functions = {
    showInfoModal,
    showEDPConfirmRsvpModal
};

const withActionButtonsProps = wrapHOC(connect(fields, functions));

export {
    withActionButtonsProps, fields, functions
};
