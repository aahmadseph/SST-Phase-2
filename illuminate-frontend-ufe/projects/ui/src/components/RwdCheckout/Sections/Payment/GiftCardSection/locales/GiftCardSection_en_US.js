export default function getResource(label, vars = []) {
    const resources = {
        howToUseCard: 'How to use a gift card',
        giftCard: 'Gift card',
        addGiftCard: 'Add gift card',
        giftCardNumber: 'Gift card number',
        pin: 'PIN',
        apply: 'Apply',
        giftCardEndingIn: 'Gift card ending in',
        hasBeenApplied: 'has been applied',
        removeLink: 'Remove',
        cancelLink: 'Cancel',
        cancelText: 'Never mind, I don’t want to add a gift card',
        removeGiftCard: 'Remove gift card',
        areYouSureMessage: 'Are you sure you would like to permanently remove this gift card?',
        moreInfoTitle: 'Using a Sephora Gift Card or eGift Card'
    };

    return resources[label];
}
