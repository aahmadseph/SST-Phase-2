export default function getResource(label) {
    const resources = {
        ccReward: 'Credit Card Reward',
        firstPurchase: 'First Purchase',
        remove: 'Remove',
        apply: 'Apply',
        applied: 'Applied',
        exp: 'Exp.'
    };

    return resources[label];
}
