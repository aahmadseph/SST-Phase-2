export default function getResource(label, vars = []) {
    const resources = {
        giftCardLabel: 'Gift Card',
        hasBeenApplied: 'has been applied',
        applied: 'applied',
        removeLink: 'Remove',
        removeGiftCardText: 'Remove Gift Card',
        areYouSureMessage: 'Are you sure you want to remove this gift card from your order?'
    };
    return resources[label];
}
