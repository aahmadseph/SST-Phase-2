import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Actions from 'actions/Actions';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { redirectToHome } = Actions;
const getText = getLocaleResourceFile('components/GlobalModals/MobileConfirmModal/locales', 'MobileConfirmModal');

const withMobileConfirmModalProps = wrapHOC(
    connect(
        createStructuredSelector({
            mobileModalTitle: getTextFromResource(getText, 'mobileModalTitle'),
            mobileModalSubtitle: getTextFromResource(getText, 'mobileModalSubtitle'),
            sent: getTextFromResource(getText, 'sent'),
            reply: getTextFromResource(getText, 'reply'),
            buttonContinue: getTextFromResource(getText, 'buttonContinue'),
            mobileTerms: getTextFromResource(getText, 'mobileTerms', [
                '/beauty/sms-terms-and-conditions',
                '/beauty/privacy-policy',
                '/beauty/privacy-policy#USNoticeIncentive'
            ]),
            mobileTermsAdditionalInfo: getTextFromResource(getText, 'mobileTermsAdditionalInfo', [])
        }),
        { redirectToHome }
    )
);

export { withMobileConfirmModalProps };
