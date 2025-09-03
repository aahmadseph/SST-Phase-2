import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { isGiftcardAddToWalletEnabledSelector } from 'viewModel/selectors/giftcards/isGiftcardAddToWalletEnabled/isGiftcardAddToWalletEnabledSelector';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Content/GiftCards/locales', 'GiftCards');

const fields = createStructuredSelector({
    isGiftcardAddToWalletEnabled: isGiftcardAddToWalletEnabledSelector,
    localization: createStructuredSelector({
        checkYourBalance: getTextFromResource(getText, 'checkYourBalance'),
        and: getTextFromResource(getText, 'and'),
        addToWallet: getTextFromResource(getText, 'addToWallet'),
        enterGiftCardNumber: getTextFromResource(getText, 'enterGiftCardNumber'),
        reCaptcha: getTextFromResource(getText, 'reCaptcha'),
        privacyPolicy: getTextFromResource(getText, 'privacyPolicy'),
        terms: getTextFromResource(getText, 'terms'),
        balanceCall: getTextFromResource(getText, 'balanceCall')
    })
});

const functions = null;

const withGiftCardBalanceCheckProps = wrapHOC(connect(fields, functions));

export {
    withGiftCardBalanceCheckProps, fields, functions
};
