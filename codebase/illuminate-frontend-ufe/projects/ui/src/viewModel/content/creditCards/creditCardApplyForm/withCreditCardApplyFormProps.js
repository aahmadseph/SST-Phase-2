import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import userUtils from 'utils/User';
import { APPROVAL_STATUS, USER_STATE } from 'constants/CreditCard';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Actions from 'actions/Actions';

const { wrapHOC } = FrameworkUtils;
const { showSignInWithMessagingModal, showBiRegisterModal } = Actions;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Content/CreditCards/CreditCardApplyForm/locales', 'CreditCardApplyForm');

const localization = createStructuredSelector({
    ccProgramName: getTextFromResource(getText, 'ccProgramName'),
    backLink: getTextFromResource(getText, 'backLink'),
    submitButton: getTextFromResource(getText, 'submitButton')
});

const fields = createSelector(userSelector, localization, (user, locales) => {
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
        user,
        isBI: userUtils.isBI(),
        isSignedIn: userUtils.isSignedIn(),
        isPreApprovedForCreditCard: userUtils.isPreApprovedForCreditCard(),
        userCreditCardStatus,
        bankRewards,
        locales
    };
});

const openSignInModal = opts => dispatch => dispatch(showSignInWithMessagingModal(opts));
const openBiRegisterModal = opts => dispatch => dispatch(showBiRegisterModal(opts));

const functions = { openSignInModal, openBiRegisterModal };

const withCreditCardApplyFormProps = wrapHOC(connect(fields, functions));

export {
    withCreditCardApplyFormProps, fields, localization, functions
};
