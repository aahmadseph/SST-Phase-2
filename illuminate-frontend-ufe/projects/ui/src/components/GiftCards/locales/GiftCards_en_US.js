export default function getResource(label, vars = []) {
    const resources = {
        giftCardBalance: 'Gift Card balance',
        checkYourBalance: 'Check Balance',
        and: '&',
        addToWallet: 'Add to Wallet',
        toCheckCurrentBalance: 'Enter your 16-digit gift card number and PIN.',
        balance: 'Balance',
        cardNumber: 'Card Number',
        pin: 'PIN',
        check: 'Check',
        checkBalance: 'Check Balance',
        giftCardBalanceModalTitle: 'Your Gift Card Balance',
        appleWalletDisclaimer: 'This balance will continue to be available on your physical/eGift card as well as your Apple Wallet Pass.',
        googleWalletDisclaimer: 'This balance will continue to be available on your physical/eGift card as well as your Google Wallet Pass.',
        addTo: 'Add to',
        appleWallet: 'Apple Wallet',
        googleWallet: 'Google Wallet',
        done: 'Done'
    };

    return resources[label];
}
