import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';
import BCCUtils from 'utils/BCC';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { CREDIT_CARD_REWARDS } = BCCUtils.MEDIA_IDS;
const { getLocaleResourceFile } = LanguageLocaleUtils;
const fields = null;

const getText = getLocaleResourceFile('components/RichProfile/BeautyInsider/CreditCardRewards/locales', 'CreditCardRewards');

const functions = dispatch => ({
    showMediaModal: () =>
        dispatch(
            Actions.showMediaModal({
                isOpen: true,
                mediaId: CREDIT_CARD_REWARDS,
                titleDataAt: 'cc_rewards_modal_title',
                showMediaTitle: true,
                dismissButtonText: getText('modalButton'),
                dismissButtonDataAt: 'cc_rewards_modal_got_it_button',
                modalDataAt: 'cc_rewards_modal'
            })
        )
});

const withCreditCardRewardsProps = wrapHOC(connect(fields, functions));

export {
    withCreditCardRewardsProps, fields, functions
};
