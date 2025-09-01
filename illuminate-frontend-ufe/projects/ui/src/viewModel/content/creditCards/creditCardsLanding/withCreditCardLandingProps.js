import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import userUtils from 'utils/User';
import { APPROVAL_STATUS, USER_STATE } from 'constants/CreditCard';
import Actions from 'actions/Actions';

const { wrapHOC } = FrameworkUtils;

const fields = createSelector(userSelector, user => {
    const ccApprovalStatus = user?.beautyInsiderAccount?.ccAccountandPrescreenInfo?.ccApprovalStatus;
    let userCreditCardStatus = '';

    if (ccApprovalStatus) {
        if (ccApprovalStatus === APPROVAL_STATUS.NEW_APPLICATION || ccApprovalStatus === APPROVAL_STATUS.DECLINED) {
            userCreditCardStatus = USER_STATE.NO_CARD;
        } else if (ccApprovalStatus === APPROVAL_STATUS.IN_PROGRESS) {
            userCreditCardStatus = USER_STATE.IN_PROGRESS;
        } else if (ccApprovalStatus === APPROVAL_STATUS.APPROVED) {
            if (userUtils.checkForNoBankRewards(user?.ccRewards.bankRewards)) {
                userCreditCardStatus = USER_STATE.CARD_NO_REWARDS;
            } else {
                userCreditCardStatus = USER_STATE.CARD_AND_REWARDS;
            }
        } else if (ccApprovalStatus === APPROVAL_STATUS.CLOSED) {
            userCreditCardStatus = USER_STATE.CARD_CLOSED;
        }
    }

    return {
        isAnonymous: user.isInitialized && userUtils.isAnonymous(),
        userCreditCardStatus,
        ccRewards: user.ccRewards
    };
});

const functions = {
    showSignInModal: Actions.showSignInModal
};

const withCreditCardLandingProps = wrapHOC(connect(fields, functions));

export {
    withCreditCardLandingProps, fields, functions
};
