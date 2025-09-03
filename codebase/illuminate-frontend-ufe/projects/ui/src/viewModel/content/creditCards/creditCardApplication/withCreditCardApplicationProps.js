import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import userUtils from 'utils/User';
import { APPROVAL_STATUS, USER_STATE } from 'constants/CreditCard';

const { wrapHOC } = FrameworkUtils;

const fields = createSelector(userSelector, user => {
    const ccApprovalStatus = user?.beautyInsiderAccount?.ccAccountandPrescreenInfo?.ccApprovalStatus;
    let userCreditCardStatus = '';
    const bankRewards = user?.bankRewards;

    if (ccApprovalStatus) {
        if (ccApprovalStatus === APPROVAL_STATUS.NEW_APPLICATION || ccApprovalStatus === APPROVAL_STATUS.DECLINED) {
            userCreditCardStatus = USER_STATE.NO_CARD;
        } else if (ccApprovalStatus === APPROVAL_STATUS.IN_PROGRESS) {
            userCreditCardStatus = USER_STATE.IN_PROGRESS;
        } else if (ccApprovalStatus === APPROVAL_STATUS.APPROVED) {
            if (userUtils.checkForNoBankRewards(bankRewards)) {
                userCreditCardStatus = USER_STATE.CARD_NO_REWARDS;
            } else {
                userCreditCardStatus = USER_STATE.CARD_AND_REWARDS;
            }
        } else if (ccApprovalStatus === APPROVAL_STATUS.CLOSED) {
            userCreditCardStatus = USER_STATE.CARD_CLOSED;
        }
    }

    return {
        isBiAccountInfoReady: Boolean(user.beautyInsiderAccount),
        isAnonymous: user.isInitialized && userUtils.isAnonymous(),
        userCreditCardStatus,
        bankRewards
    };
});

const functions = null;

const withCreditCardApplicationProps = wrapHOC(connect(fields, null));

export {
    withCreditCardApplicationProps, fields, functions
};
