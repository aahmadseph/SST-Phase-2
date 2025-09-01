export default function getResource(label, vars = []) {
    const resources = {
        applyCCRewards: 'Apply Credit Card Rewards',
        apply: 'Apply',
        available: 'available',
        firstPurchaseAvailable: 'First Purchase available',
        firstPurchaseApplied: 'First Purchase applied',
        applied: 'Applied',
        remove: 'Remove',
        ccMessage: '*With your Sephora Credit card or Sephora Visa. Exclusions apply, ',
        ccMessageWithoutStar: 'With your Sephora Credit card or Sephora Visa. Exclusions apply, ',
        clickHere: 'click here for details',
        off: 'off',
        expiry: `Exp ${vars[0]}`
    };

    return resources[label];
}
