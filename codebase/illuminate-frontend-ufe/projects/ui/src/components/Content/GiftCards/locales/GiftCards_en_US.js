const resources = {
    checkYourBalance: 'Check Balance',
    and: '&',
    addToWallet: 'Add to Wallet',
    enterGiftCardNumber: 'Enter your 16-digit gift card number and PIN.',
    reCaptcha: 'Sephora uses Google ReCaptcha and users are subject to Google’s',
    privacyPolicy: 'privacy policy',
    terms: 'terms',
    balanceCall: 'To hear your balance, call',
    currentBalance: 'Current Balance',
    cardNumber: 'Card Number',
    pin: 'PIN',
    checkBalance: 'Check Balance',
    balance: 'Balance',
    giftCardBalanceModalTitle: 'Your Gift Card Balance',
    appleWalletDisclaimer: 'This balance will continue to be available on your physical/eGift card as well as your Apple Wallet Pass.',
    googleWalletDisclaimer: 'This balance will continue to be available on your physical/eGift card as well as your Google Wallet Pass.',
    addTo: 'Add to',
    appleWallet: 'Apple Wallet',
    googleWallet: 'Google Wallet',
    done: 'Done'
};

export default function getResource(label) {
    return resources[label];
}
