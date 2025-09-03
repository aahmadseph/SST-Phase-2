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
        currentBalance: getTextFromResource(getText, 'currentBalance'),
        cardNumber: getTextFromResource(getText, 'cardNumber'),
        pin: getTextFromResource(getText, 'pin'),
        checkBalance: getTextFromResource(getText, 'checkBalance'),
        and: getTextFromResource(getText, 'and'),
        addToWallet: getTextFromResource(getText, 'addToWallet'),
        balance: getTextFromResource(getText, 'balance'),
        giftCardBalanceModalTitle: getTextFromResource(getText, 'giftCardBalanceModalTitle'),
        appleWalletDisclaimer: getTextFromResource(getText, 'appleWalletDisclaimer'),
        googleWalletDisclaimer: getTextFromResource(getText, 'googleWalletDisclaimer'),
        addTo: getTextFromResource(getText, 'addTo'),
        appleWallet: getTextFromResource(getText, 'appleWallet'),
        googleWallet: getTextFromResource(getText, 'googleWallet'),
        done: getTextFromResource(getText, 'done')
    })
});

const functions = null;

const withGiftCardBalanceCheckFormProps = wrapHOC(connect(fields, functions));

export {
    withGiftCardBalanceCheckFormProps, fields, functions
};
