import frameworkUtils from 'utils/framework';
import { connect } from 'react-redux';

import Actions from 'Actions';

const { wrapHOC } = frameworkUtils;
const { showInfoModal } = Actions;

const functions = {
    showInfoModal
};

const withEventRSVPConfirmationProps = wrapHOC(connect(null, functions));

export { withEventRSVPConfirmationProps };
