import frameworkUtils from 'utils/framework';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import Actions from 'Actions';
import ExperienceDetailsActions from 'actions/ExperienceDetailsActions';

import { happeningUserDataSelector } from 'selectors/page/happening/happeningUserDataSelector';

const { wrapHOC } = frameworkUtils;
const { openInfoWindow } = ExperienceDetailsActions;
const { showEDPConfirmRsvpModal } = Actions;

const fields = createSelector(happeningUserDataSelector, user => ({ user }));

const functions = {
    openInfoWindow,
    showEDPConfirmRsvpModal
};

const withEDPRsvpModuleProps = wrapHOC(connect(fields, functions));

export {
    withEDPRsvpModuleProps, fields, functions
};
