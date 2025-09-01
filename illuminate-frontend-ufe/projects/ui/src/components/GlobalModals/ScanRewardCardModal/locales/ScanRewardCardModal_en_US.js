export default function getResource(label, vars = []) {
    const resources = {
        scanCards: 'Scan Cards',
        scanAtCheckout: 'Scan at checkout',
        showBarcode: 'Show barcode to a cashier to collect points or use rewards.',
        rewardsText: 'Rewards will be applied to the merchandise subtotal.',
        termsAndConditions: 'Terms & Conditions'
    };
    return resources[label];
}
