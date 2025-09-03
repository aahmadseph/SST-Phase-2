import { createSelector } from 'reselect';

const isGiftcardAddToWalletEnabledSelector = createSelector(() => {
    const isGiftcardAddToWalletEnabled = !!Sephora.configurationSettings?.paymentService?.allowGiftCardWalletPass;

    return isGiftcardAddToWalletEnabled;
});

export { isGiftcardAddToWalletEnabledSelector };
