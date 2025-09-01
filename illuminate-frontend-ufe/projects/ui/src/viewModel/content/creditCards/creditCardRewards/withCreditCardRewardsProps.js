import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';

const { wrapHOC } = FrameworkUtils;
const fields = null;

const functions = {
    showMediaModal: Actions.showMediaModal
};

const withCreditCardRewardsProps = wrapHOC(connect(fields, functions));

export {
    withCreditCardRewardsProps, fields, functions
};
