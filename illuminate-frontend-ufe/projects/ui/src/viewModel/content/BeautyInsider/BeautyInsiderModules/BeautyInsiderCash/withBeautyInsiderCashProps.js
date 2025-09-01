import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import BCCUtils from 'utils/BCC';
import TermsAndConditionsActions from 'actions/TermsAndConditionsActions';

const { wrapHOC } = FrameworkUtils;
const { CASH_BACK_REWARDS_MODAL_CONTENT } = BCCUtils.MEDIA_IDS;
const fields = null;

const functions = dispatch => ({
    showTermsAndConditionsModal: () => dispatch(TermsAndConditionsActions.showModal(true, CASH_BACK_REWARDS_MODAL_CONTENT, ''))
});

const withBeautyInsiderCashProps = wrapHOC(connect(fields, functions));

export {
    withBeautyInsiderCashProps, fields, functions
};
